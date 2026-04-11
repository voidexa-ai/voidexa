'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type {
  QuantumCharacter,
  QuantumMessage,
  QuantumMode,
  QuantumSSEEvent,
} from '@/types/quantum'
import { createQuantumSession, streamQuantumSession, askFollowUp } from '@/lib/quantum/client'
import { supabase } from '@/lib/supabase'
import AvatarRing from './AvatarRing'
import ConsensusMeter from './ConsensusMeter'
import DebateMessage from './DebateMessage'
import QuantumInput from './QuantumInput'
import SessionBar from './SessionBar'
import WalletBar from './WalletBar'
import ChatHistorySidebar, { type SavedSession } from './ChatHistorySidebar'

const EXEMPT_EMAILS = ['ceo@voidexa.com', 'tom@voidexa.com']

const CHARACTERS: QuantumCharacter[] = [
  { id: 'claude', name: 'Claude', role: 'Chief Architect', tagline: 'Overthinks everything. Usually right.', image: '/images/cast/claude.jpg', color: '#7f77dd', glow: 'rgba(127,119,221,0.35)' },
  { id: 'gpt', name: 'GPT', role: 'Lead Developer', tagline: 'Never wrong. Except when he is.', image: '/images/cast/gpt.jpg', color: '#97c459', glow: 'rgba(151,196,89,0.35)' },
  { id: 'perplexity', name: 'Perplexity', role: 'Fact Checker', tagline: 'Actually, according to my sources...', image: '/images/cast/perplexity.jpg', color: '#ef9f27', glow: 'rgba(239,159,39,0.35)' },
  { id: 'gemini', name: 'Gemini', role: 'Senior Reviewer', tagline: 'Namaste. Your code is garbage.', image: '/images/cast/gemini.jpg', color: '#5dcaa5', glow: 'rgba(93,202,165,0.35)' },
]

const THINKING_PHRASES: Record<string, string> = {
  claude: 'Claude is analyzing the problem...',
  gpt: 'GPT is forming a response...',
  perplexity: 'Perplexity is checking sources...',
  gemini: 'Gemini is reviewing positions...',
}

interface CostSummary {
  cost: number
  tokens: number
  providers: string[]
  rounds: number
  mode: string
  elapsedMs: number
}

type LiveMessage = QuantumMessage & {
  streaming?: boolean
  round?: number
}

const TOTAL_PROVIDERS = 4

const MODE_ROUND_COUNT: Record<QuantumMode, number> = {
  standard: 2,
  deep: 3,
}

// Customer pricing — matches CostSummaryStrip and SessionBar
const CUSTOMER_MULTIPLIER: Record<string, { markup: number; min: number }> = {
  standard: { markup: 2.5, min: 0.05 },
  deep: { markup: 3.5, min: 0.25 },
}

function customerPrice(apiCost: number, mode: string): number {
  const modeKey = mode === 'deep' || mode === 'verbose' ? 'deep' : 'standard'
  const pricing = CUSTOMER_MULTIPLIER[modeKey]
  return Math.max(pricing.min, apiCost * pricing.markup)
}

export default function QuantumDebatePanel() {
  const [question, setQuestion] = useState<string | null>(null)
  const [messages, setMessages] = useState<LiveMessage[]>([])
  const [consensus, setConsensus] = useState(0)
  const [activeCharId, setActiveCharId] = useState<string | null>(null)
  const [thinkingIds, setThinkingIds] = useState<string[]>([])
  const [sessionActive, setSessionActive] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null)
  const [currentMode, setCurrentMode] = useState<QuantumMode>('standard')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [followUps, setFollowUps] = useState<Array<{ q: string; a: string }>>([])
  const [followUpLoading, setFollowUpLoading] = useState(false)
  const [synthesis, setSynthesis] = useState<string | null>(null)
  const [debateExpanded, setDebateExpanded] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [dbSessionId, setDbSessionId] = useState<string | null>(null)
  // Viewing a historical session (read-only)
  const [viewingHistory, setViewingHistory] = useState(false)
  // Wallet insufficient modal trigger
  const [showTopUpPrompt, setShowTopUpPrompt] = useState(false)

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerStartRef = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cancelStreamRef = useRef<(() => void) | null>(null)
  // Accumulate messages for DB save
  const accumulatedMessagesRef = useRef<LiveMessage[]>([])

  const isExempt = EXEMPT_EMAILS.includes(userEmail ?? '')

  // Get user email on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
      setUserLoaded(true)
    })
  }, [])

  const stopTimer = useCallback((): number => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    setTimerRunning(false)
    return performance.now() - timerStartRef.current
  }, [])

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
    timerStartRef.current = performance.now()
    setElapsedMs(0)
    setTimerRunning(true)
    timerIntervalRef.current = setInterval(() => {
      setElapsedMs(performance.now() - timerStartRef.current)
    }, 100)
  }, [])

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight
    if (distanceFromBottom <= 100) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // ─── Save session to Supabase on start ────────────────────────────
  const createDbSession = useCallback(async (q: string, mode: QuantumMode) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('quantum_sessions')
      .insert({
        user_id: user.id,
        question: q,
        mode,
        status: 'active',
      })
      .select('id')
      .single()

    return data?.id ?? null
  }, [])

  // ─── Update session in Supabase on complete ──────────────────────
  const completeDbSession = useCallback(async (
    dbId: string,
    synthText: string | null,
    msgs: LiveMessage[],
    cost: CostSummary
  ) => {
    const cp = customerPrice(cost.cost, cost.mode)
    await supabase
      .from('quantum_sessions')
      .update({
        status: 'complete',
        synthesis: synthText,
        messages: msgs.map(m => ({
          id: m.id,
          characterId: m.characterId,
          text: m.text,
          timestamp: m.timestamp,
          round: m.round,
        })),
        cost_usd: cost.cost,
        customer_price_usd: cp,
        tokens_used: cost.tokens,
        providers_used: cost.providers,
        duration_seconds: cost.elapsedMs / 1000,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbId)
  }, [])

  // ─── Wallet deduction ─────────────────────────────────────────────
  const deductWallet = useCallback(async (amount: number, quantumSessionId: string | null) => {
    if (isExempt) return
    try {
      await fetch('/api/wallet/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_usd: amount,
          quantum_session_id: quantumSessionId,
          description: 'Quantum session',
        }),
      })
    } catch { /* silent — session already ran */ }
  }, [isExempt])

  // ─── Pre-session wallet check ─────────────────────────────────────
  const checkBalance = useCallback(async (mode: QuantumMode): Promise<boolean> => {
    if (isExempt) return true
    try {
      const res = await fetch('/api/wallet')
      if (!res.ok) return true // fail open
      const data = await res.json()
      const balance = parseFloat(data.balance_usd ?? '0')
      const minCost = mode === 'deep' ? 0.25 : 0.05
      if (balance < minCost) {
        setShowTopUpPrompt(true)
        setErrorMessage(`Insufficient balance ($${balance.toFixed(2)}). ${mode === 'deep' ? 'Deep' : 'Standard'} mode costs at least $${minCost.toFixed(2)}.`)
        return false
      }
      return true
    } catch {
      return true // fail open
    }
  }, [isExempt])

  const handleSubmit = useCallback(async (q: string, mode: QuantumMode) => {
    // Balance check
    const hasBalance = await checkBalance(mode)
    if (!hasBalance) return

    setLoading(true)
    setQuestion(q)
    setMessages([])
    setConsensus(0)
    setCostSummary(null)
    setErrorMessage(null)
    setSynthesis(null)
    setDebateExpanded(false)
    setSessionActive(true)
    setSessionId(null)
    setDbSessionId(null)
    setFollowUps([])
    setStartTime(Date.now())
    setThinkingIds(CHARACTERS.map(c => c.id))
    setCurrentMode(mode)
    setViewingHistory(false)
    setShowTopUpPrompt(false)
    accumulatedMessagesRef.current = []
    startTimer()

    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

    // Create DB session
    const newDbId = await createDbSession(q, mode)
    if (newDbId) setDbSessionId(newDbId)

    try {
      const result = await createQuantumSession(q, null, mode)
      if ('error' in result) {
        setErrorMessage(result.error)
        setLoading(false)
        setThinkingIds([])
        setSessionActive(false)
        stopTimer()
        return
      }

      setLoading(false)
      setSessionId(result.id)
      const cancel = streamQuantumSession(
        result.id,
        null,
        (event: QuantumSSEEvent) => {
          switch (event.type) {
            case 'thinking':
              if (event.characterId) {
                setActiveCharId(event.characterId)
              }
              break
            case 'token':
              if (event.characterId && event.token) {
                const round = event.round ?? 1
                setMessages(prev => {
                  const existing = prev.find(
                    m => m.characterId === event.characterId && m.streaming
                  )
                  let updated: LiveMessage[]
                  if (existing) {
                    updated = prev.map(m =>
                      m.id === existing.id
                        ? { ...m, text: m.text + event.token }
                        : m
                    )
                  } else {
                    updated = [
                      ...prev,
                      {
                        id: `msg-${Date.now()}-${event.characterId}-r${round}`,
                        characterId: event.characterId!,
                        text: event.token!,
                        timestamp: Date.now(),
                        streaming: true,
                        round,
                      },
                    ]
                  }
                  accumulatedMessagesRef.current = updated
                  return updated
                })
                setThinkingIds(prev =>
                  prev.filter(id => id !== event.characterId)
                )
                setActiveCharId(event.characterId)
              }
              break
            case 'message_complete':
              if (event.characterId) {
                setMessages(prev => {
                  const updated = prev.map(m =>
                    m.characterId === event.characterId && m.streaming
                      ? { ...m, streaming: false }
                      : m
                  )
                  accumulatedMessagesRef.current = updated
                  return updated
                })
              }
              break
            case 'consensus_update':
              if (event.consensus !== undefined) {
                setConsensus(event.consensus)
              }
              break
            case 'synthesis':
              if (event.content) {
                setSynthesis(event.content)
              }
              break
            case 'session_complete': {
              setThinkingIds([])
              setActiveCharId(null)
              setSessionActive(false)
              const finalMs = stopTimer()
              let completedCost: CostSummary | null = null
              if (typeof event.cost === 'number') {
                completedCost = {
                  cost: event.cost,
                  tokens: event.tokens ?? 0,
                  providers: event.providers_used ?? [],
                  rounds: event.rounds ?? 0,
                  mode: event.mode ?? mode,
                  elapsedMs: finalMs,
                }
                setCostSummary(completedCost)
              }
              const synthText = event.synthesis ?? null
              if (synthText) {
                setSynthesis(synthText)
              }
              // Save to DB + deduct wallet
              if (newDbId && completedCost) {
                completeDbSession(newDbId, synthText, accumulatedMessagesRef.current, completedCost)
                const cp = customerPrice(completedCost.cost, completedCost.mode)
                deductWallet(cp, newDbId)
              }
              break
            }
            case 'error':
              setErrorMessage(event.error ?? 'Engine error')
              setSessionActive(false)
              stopTimer()
              break
          }
        },
        () => {
          setErrorMessage('Connection to Quantum API lost. Please try again.')
          setSessionActive(false)
          stopTimer()
        }
      )
      cancelStreamRef.current = cancel
    } catch {
      setErrorMessage('Quantum API is currently unavailable. Please try again later.')
      setLoading(false)
      setThinkingIds([])
      setSessionActive(false)
      stopTimer()
    }
  }, [startTimer, stopTimer, checkBalance, createDbSession, completeDbSession, deductWallet])

  useEffect(() => {
    return () => {
      cancelStreamRef.current?.()
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [])

  const getCharacter = (id: string) => CHARACTERS.find(c => c.id === id)!

  // ─── Load historical session ──────────────────────────────────────
  const handleSelectSession = useCallback((session: SavedSession) => {
    cancelStreamRef.current?.()
    setViewingHistory(true)
    setQuestion(session.question)
    setCurrentMode(session.mode as QuantumMode)
    setSynthesis(session.synthesis)
    setMessages(
      (session.messages as LiveMessage[]).map(m => ({ ...m, streaming: false }))
    )
    setConsensus(0)
    setActiveCharId(null)
    setThinkingIds([])
    setSessionActive(false)
    setLoading(false)
    setErrorMessage(null)
    setFollowUps([])
    setDbSessionId(session.id)
    setSessionId(null)
    setStartTime(null)
    setCostSummary(
      session.cost_usd != null
        ? {
            cost: parseFloat(String(session.cost_usd)),
            tokens: session.tokens_used ?? 0,
            providers: session.providers_used ?? [],
            rounds: 0,
            mode: session.mode,
            elapsedMs: (session.duration_seconds ?? 0) * 1000,
          }
        : null
    )
    setDebateExpanded(false)
    stopTimer()
  }, [stopTimer])

  const handleNewDebate = useCallback(() => {
    cancelStreamRef.current?.()
    setViewingHistory(false)
    setQuestion(null)
    setMessages([])
    setConsensus(0)
    setCostSummary(null)
    setErrorMessage(null)
    setSynthesis(null)
    setDebateExpanded(false)
    setSessionActive(false)
    setSessionId(null)
    setDbSessionId(null)
    setFollowUps([])
    setStartTime(null)
    setLoading(false)
    setThinkingIds([])
    setActiveCharId(null)
    setShowTopUpPrompt(false)
    stopTimer()
  }, [stopTimer])

  const totalRounds = costSummary?.rounds ?? MODE_ROUND_COUNT[currentMode]
  const renderChatBody = (): React.ReactNode[] => {
    const out: React.ReactNode[] = []
    let lastRound = 0
    for (const msg of messages) {
      const round = msg.round ?? 1
      if (round !== lastRound) {
        const isFinal = round === totalRounds
        out.push(
          <RoundSeparator
            key={`round-sep-${round}`}
            round={round}
            synthesis={isFinal}
          />
        )
        lastRound = round
      }
      out.push(
        <DebateMessage
          key={msg.id}
          character={getCharacter(msg.characterId)}
          text={msg.text}
          streaming={msg.streaming}
          strikethrough={msg.strikethrough}
          agreement={msg.agreement}
        />
      )
    }
    return out
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full" style={{ overflow: 'hidden', maxWidth: '100vw' }}>
      {/* ─────────────────── LEFT PANEL — sticky ─────────────────── */}
      <aside
        className="shrink-0 flex flex-col gap-4 px-3 py-5 overflow-y-auto"
        style={{
          width: '260px',
          maxWidth: '100%',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(8,8,18,0.4)',
          overflowX: 'hidden',
        }}
      >
        {userLoaded ? (
          <WalletBar exempt={isExempt} />
        ) : (
          <div
            className="flex items-center justify-center px-4 py-2 rounded-lg"
            style={{
              background: 'rgba(127,119,221,0.06)',
              border: '1px solid rgba(127,119,221,0.15)',
            }}
          >
            <span style={{ fontSize: 14, color: '#64748b' }}>Loading wallet...</span>
          </div>
        )}
        <SessionBar active={sessionActive} startTime={startTime} finalCost={costSummary?.cost ?? null} mode={currentMode} />

        <div className="flex flex-col items-center gap-4">
          <AvatarRing
            characters={CHARACTERS}
            activeId={activeCharId}
            thinkingIds={thinkingIds}
          />
          <ConsensusMeter value={consensus} />
        </div>

        {/* Thinking indicators */}
        {thinkingIds.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {thinkingIds.map(id => {
              const char = getCharacter(id)
              return (
                <div
                  key={id}
                  className="flex items-center gap-2"
                  style={{ fontSize: 14 }}
                >
                  <span
                    className="inline-block rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      background: char.color,
                      animation: 'quantum-pulse 1.5s ease-in-out infinite',
                    }}
                  />
                  <span style={{ color: '#94a3b8' }}>
                    {THINKING_PHRASES[id]}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <Kcp90InfoPanel
          mode={currentMode}
          tokens={costSummary?.tokens ?? null}
        />

        {/* Chat history */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 12,
            marginTop: 4,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>
            HISTORY
          </div>
          <ChatHistorySidebar
            activeSessionId={dbSessionId}
            onSelectSession={handleSelectSession}
            onNewDebate={handleNewDebate}
          />
        </div>
      </aside>

      {/* ─────────────────── RIGHT PANEL — chat + cost + input ─────────── */}
      <section className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Error banner */}
        {errorMessage && (
          <div
            className="px-5 py-3 text-center shrink-0"
            style={{
              fontSize: 14,
              color: '#ef4444',
              background: 'rgba(239,68,68,0.06)',
              borderBottom: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            {errorMessage}
            {showTopUpPrompt && (
              <button
                onClick={() => {
                  setErrorMessage(null)
                  setShowTopUpPrompt(false)
                  // Scroll to wallet bar top-up
                  document.querySelector('[data-wallet-topup]')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="ml-3 rounded px-3 py-1"
                style={{
                  fontSize: 14,
                  color: '#fff',
                  background: 'rgba(127,119,221,0.5)',
                  border: '1px solid rgba(127,119,221,0.3)',
                  cursor: 'pointer',
                }}
              >
                Top Up Now
              </button>
            )}
          </div>
        )}

        {/* Chat area */}
        <div
          ref={scrollContainerRef}
          className="quantum-chat-area flex-1 overflow-y-auto"
          style={{ padding: '24px 28px 24px 28px', minHeight: 0 }}
        >
          {/* Question header */}
          {question && (
            <div
              className="rounded-xl mb-4"
              style={{
                background: 'rgba(8,8,18,0.6)',
                border: '1px solid rgba(127,119,221,0.18)',
                padding: '14px 18px',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: '#7f77dd',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  marginBottom: 4,
                }}
              >
                {viewingHistory ? 'PREVIOUS QUESTION' : 'QUESTION'}
              </div>
              <p style={{ fontSize: 16, color: '#e8e8f0', lineHeight: 1.55 }}>
                {question}
              </p>
              {timerRunning && (
                <p
                  style={{
                    fontSize: 14,
                    color: '#7f77dd',
                    marginTop: 8,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    letterSpacing: '0.02em',
                  }}
                >
                  <span style={{ color: '#475569' }}>Processing: </span>
                  {formatDuration(elapsedMs)}
                </p>
              )}
            </div>
          )}

          {/* Empty state */}
          {!question && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center h-full px-4">
              <p style={{ fontSize: 24, color: '#e2e8f0', fontWeight: 600, marginBottom: 12 }}>
                Ask a question and watch 4 AIs debate it live.
              </p>
              <p style={{ fontSize: 16, color: '#64748b', maxWidth: 440, lineHeight: 1.6 }}>
                They&apos;ll challenge each other, cite sources, and converge on the best answer.
              </p>
            </div>
          )}

          {/* Synthesis */}
          {synthesis && (
            <div
              className="rounded-xl mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(127,119,221,0.1), rgba(74,222,128,0.08))',
                border: '1px solid rgba(127,119,221,0.25)',
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: '#a5b4fc',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  marginBottom: 8,
                }}
              >
                QUANTUM CONSENSUS
              </div>
              <div className="quantum-markdown" style={{ fontSize: 16, color: '#e2e8f0', lineHeight: 1.7 }}>
                {synthesis.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: '0 0 8px' }}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Full debate — collapsible when synthesis exists */}
          {synthesis && messages.length > 0 && (
            <button
              onClick={() => setDebateExpanded(prev => !prev)}
              className="flex items-center gap-2 mb-3"
              style={{
                fontSize: 14,
                color: '#7777bb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span style={{ transform: debateExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>
                ▶
              </span>
              {debateExpanded ? 'Hide full debate' : 'View full debate'}
            </button>
          )}

          {(!synthesis || debateExpanded) && renderChatBody()}
          <div ref={messagesEndRef} />
        </div>

        {/* Cost strip */}
        {costSummary && (
          <div
            className="shrink-0"
            style={{
              padding: '12px 28px 0 28px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <CostSummaryStrip summary={costSummary} />
          </div>
        )}

        {/* Follow-up input — only for live sessions, not history */}
        {costSummary && sessionId && !viewingHistory && followUps.length < 5 && (
          <FollowUpInput
            sessionId={sessionId}
            followUps={followUps}
            loading={followUpLoading}
            onSubmit={async (q) => {
              if (!sessionId) return
              setFollowUpLoading(true)
              const res = await askFollowUp(sessionId, q, null)
              setFollowUpLoading(false)
              if ('error' in res) {
                setErrorMessage(res.error)
              } else {
                setFollowUps(prev => [...prev, { q, a: res.answer }])
              }
            }}
          />
        )}

        {/* Historical session info */}
        {viewingHistory && costSummary && (
          <div className="shrink-0 flex items-center justify-center gap-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: 14, color: '#64748b' }}>
              Viewing saved session
            </span>
            <button
              onClick={handleNewDebate}
              className="rounded-lg px-4 py-2 font-semibold"
              style={{
                fontSize: 14,
                color: '#fff',
                background: 'rgba(127,119,221,0.5)',
                border: '1px solid rgba(127,119,221,0.3)',
                cursor: 'pointer',
              }}
            >
              New Debate
            </button>
          </div>
        )}

        {/* Input — hidden when viewing history */}
        {!viewingHistory && (
          <div
            className="shrink-0"
            style={{ padding: '14px 28px 64px 28px' }}
          >
            <QuantumInput
              onSubmit={handleSubmit}
              disabled={thinkingIds.length > 0 && messages.length > 0}
              loading={loading}
            />
          </div>
        )}
      </section>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Round separator
// ─────────────────────────────────────────────────────────────────────

function RoundSeparator({
  round,
  synthesis,
}: {
  round: number
  synthesis: boolean
}) {
  const label = synthesis ? `ROUND ${round} · SYNTHESIS` : `ROUND ${round}`
  return (
    <div
      className="flex items-center gap-3"
      style={{ margin: '14px 0 10px' }}
      role="separator"
      aria-label={label}
    >
      <div
        style={{
          height: 1,
          flex: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(127,119,221,0.35), transparent)',
        }}
      />
      <span
        style={{
          fontSize: 14,
          letterSpacing: '0.16em',
          color: synthesis ? '#a5b4fc' : 'rgba(127,119,221,0.7)',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div
        style={{
          height: 1,
          flex: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(127,119,221,0.35), transparent)',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// KCP-90 info panel
// ─────────────────────────────────────────────────────────────────────

interface KcpProfile {
  label: string
  ratio: number
  layers: string
}

const KCP_PROFILES: Record<QuantumMode, KcpProfile> = {
  standard: { label: 'KCP-90 LITE', ratio: 2.5, layers: 'L0 · L2' },
  deep: { label: 'KCP-90 FULL', ratio: 3.5, layers: 'L0 · L1 · L2' },
}

function Kcp90InfoPanel({
  mode,
  tokens,
}: {
  mode: QuantumMode
  tokens: number | null
}) {
  const profile = KCP_PROFILES[mode]
  const tokensSaved =
    tokens && tokens > 0
      ? Math.round(tokens * (profile.ratio - 1))
      : null

  return (
    <div
      className="rounded-lg"
      style={{
        background: 'rgba(127,119,221,0.06)',
        border: '1px solid rgba(127,119,221,0.22)',
        padding: '12px 14px',
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
        <span
          className="inline-block rounded-full"
          style={{
            width: 7,
            height: 7,
            background: '#4ade80',
            boxShadow: '0 0 8px rgba(74,222,128,0.6)',
            animation: 'quantum-pulse 1.8s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#a5b4fc',
          }}
        >
          {profile.label}
        </span>
      </div>

      <div
        style={{
          fontSize: 14,
          color: '#94a3b8',
          lineHeight: 1.7,
        }}
      >
        <div>
          Compression:{' '}
          <span style={{ color: '#e8e8f0', fontWeight: 600 }}>
            ~{profile.ratio.toFixed(1)}×
          </span>
        </div>
        <div>
          Layers:{' '}
          <span style={{ color: '#cbd5e1' }}>{profile.layers}</span>
        </div>
        {tokensSaved !== null && (
          <div>
            Tokens saved:{' '}
            <span style={{ color: '#4ade80', fontWeight: 600 }}>
              ~{tokensSaved.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Cost strip
// ─────────────────────────────────────────────────────────────────────

const MARKET_MULTIPLIER = 10

const MODE_LABEL: Record<string, string> = {
  standard: 'Standard',
  deep: 'Deep',
  fast: 'Standard',
  verbose: 'Deep',
  quick: 'Standard',
}

function modeLabel(mode: string): string {
  return MODE_LABEL[mode] ?? 'Standard'
}

function formatCost(usd: number): string {
  if (usd <= 0) return '$0.00'
  if (usd < 1) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(2)}`
}

function formatDuration(ms: number): string {
  const seconds = Math.max(0, ms) / 1000
  return `${seconds.toFixed(1)}s`
}

function CostSummaryStrip({ summary }: { summary: CostSummary }) {
  const apiCost = summary.cost
  const modeName = modeLabel(summary.mode)
  const modeKey = summary.mode === 'deep' || summary.mode === 'verbose' ? 'deep' : 'standard'
  const pricing = CUSTOMER_MULTIPLIER[modeKey]

  const cp = Math.max(pricing.min, apiCost * pricing.markup)
  const marketPrice = apiCost * MARKET_MULTIPLIER
  const savingsPct = marketPrice > 0
    ? Math.round(((marketPrice - cp) / marketPrice) * 100)
    : 0

  const providerCount = summary.providers.length
  const rounds = summary.rounds || 0
  const tokens = summary.tokens || 0
  const timeStr = formatDuration(summary.elapsedMs)

  return (
    <div
      className="rounded-lg"
      style={{
        background:
          'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(99,102,241,0.08))',
        border: '1px solid rgba(74,222,128,0.18)',
        padding: '12px 16px',
        overflow: 'hidden',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: '#4ade80',
          fontWeight: 700,
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}
      >
        SESSION SUMMARY
      </div>

      <p style={{ fontSize: 14, color: '#e2e8f0', marginBottom: 8 }}>
        A <span style={{ fontWeight: 700, color: '#a5b4fc' }}>{modeName}</span>{' '}
        Quantum debate with{' '}
        <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{providerCount}</span>{' '}
        providers across{' '}
        <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{rounds}</span>{' '}
        {rounds === 1 ? 'round' : 'rounds'}
      </p>

      <div className="flex flex-col gap-1" style={{ fontSize: 14 }}>
        <div>
          <span style={{ color: '#64748b' }}>
            Market price (4 separate APIs):{' '}
          </span>
          <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
            ~{formatCost(marketPrice)}
          </span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Your Quantum price: </span>
          <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 15 }}>
            {formatCost(cp)}
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <span style={{ color: '#4ade80', fontWeight: 600 }}>
            You saved ~{savingsPct}% vs market price
          </span>
        </div>
      </div>

      <div
        className="flex flex-wrap gap-y-1"
        style={{
          fontSize: 14,
          color: '#64748b',
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid rgba(119,119,187,0.12)',
        }}
      >
        <span>
          Providers:{' '}
          <span style={{ color: '#cbd5e1' }}>
            {providerCount}/{TOTAL_PROVIDERS}
          </span>
        </span>
        <span style={{ margin: '0 8px', color: '#334155' }}>·</span>
        <span>
          Tokens:{' '}
          <span style={{ color: '#cbd5e1' }}>{tokens.toLocaleString()}</span>
        </span>
        <span style={{ margin: '0 8px', color: '#334155' }}>·</span>
        <span>
          Time: <span style={{ color: '#cbd5e1' }}>{timeStr}</span>
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Follow-up input
// ─────────────────────────────────────────────────────────────────────

function FollowUpInput({
  followUps,
  loading,
  onSubmit,
}: {
  sessionId: string
  followUps: Array<{ q: string; a: string }>
  loading: boolean
  onSubmit: (question: string) => void
}) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (!q || loading) return
    onSubmit(q)
    setValue('')
  }

  return (
    <div
      className="shrink-0"
      style={{ padding: '0 28px 8px 28px' }}
    >
      {followUps.map((fu, i) => (
        <div
          key={i}
          className="rounded-lg mb-2"
          style={{
            background: 'rgba(127,119,221,0.06)',
            border: '1px solid rgba(127,119,221,0.18)',
            padding: '10px 14px',
          }}
        >
          <p style={{ fontSize: 14, color: '#a5b4fc', fontWeight: 600, marginBottom: 4 }}>
            Follow-up: {fu.q}
          </p>
          <p style={{ fontSize: 16, color: '#c8c8d0', margin: 0, lineHeight: 1.6 }}>{fu.a}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Ask a follow-up (${5 - followUps.length} remaining)...`}
          disabled={loading}
          className="flex-1 rounded-lg px-3 py-2 outline-none"
          style={{
            fontSize: 14,
            color: '#e2e8f0',
            background: 'rgba(8,8,18,0.5)',
            border: '1px solid rgba(127,119,221,0.2)',
          }}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-lg px-4 py-2 font-semibold"
          style={{
            fontSize: 14,
            color: '#fff',
            background: loading ? 'rgba(127,119,221,0.2)' : 'rgba(127,119,221,0.5)',
            border: '1px solid rgba(127,119,221,0.3)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Asking...' : 'Ask Claude'}
        </button>
        <span style={{ fontSize: 14, color: '#475569', whiteSpace: 'nowrap' }}>
          +$0.005 per follow-up question
        </span>
      </form>
    </div>
  )
}
