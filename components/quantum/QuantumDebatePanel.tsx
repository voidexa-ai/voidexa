'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type {
  QuantumCharacter,
  QuantumMessage,
  QuantumMode,
  QuantumSSEEvent,
} from '@/types/quantum'
import { createQuantumSession, streamQuantumSession } from '@/lib/quantum/client'
import AvatarRing from './AvatarRing'
import ConsensusMeter from './ConsensusMeter'
import DebateMessage from './DebateMessage'
import QuantumInput from './QuantumInput'
import SessionBar from './SessionBar'

const CHARACTERS: QuantumCharacter[] = [
  { id: 'claude', name: 'Claude', role: 'Chief Architect', tagline: 'Overthinks everything. Usually right.', image: '/images/cast/claude.jpg', color: '#60a5fa', glow: 'rgba(96,165,250,0.35)' },
  { id: 'gpt', name: 'GPT', role: 'Lead Developer', tagline: 'Never wrong. Except when he is.', image: '/images/cast/gpt.jpg', color: '#4ade80', glow: 'rgba(74,222,128,0.35)' },
  { id: 'perplexity', name: 'Perplexity', role: 'Fact Checker', tagline: 'Actually, according to my sources...', image: '/images/cast/perplexity.jpg', color: '#fb923c', glow: 'rgba(251,146,60,0.35)' },
  { id: 'gemini', name: 'Gemini', role: 'Senior Reviewer', tagline: 'Namaste. Your code is garbage.', image: '/images/cast/gemini.jpg', color: '#c084fc', glow: 'rgba(192,132,252,0.35)' },
]

const THINKING_PHRASES: Record<string, string> = {
  claude: 'Claude is analyzing the problem...',
  gpt: 'GPT is forming a response...',
  perplexity: 'Perplexity is checking sources...',
  gemini: 'Gemini is reviewing positions...',
}

// Demo debate for offline/fallback mode
const DEMO_DEBATE: { characterId: string; text: string }[] = [
  { characterId: 'claude', text: 'The optimal approach here requires careful consideration of both time and space complexity. I suggest we evaluate the trade-offs systematically.' },
  { characterId: 'gpt', text: 'Agreed on the systematic approach. However, I\'d prioritize runtime performance — in production, O(n log n) with good constant factors beats O(n) with heavy overhead.' },
  { characterId: 'perplexity', text: 'According to recent benchmarks from 2024, the gap between theoretical complexity and real-world performance varies by up to 3x depending on cache behavior. Sources: ACM SIGPLAN, IEEE transactions.' },
  { characterId: 'gemini', text: 'Your benchmarks are helpful, but the question assumes a specific workload pattern. Without profiling the actual use case, we\'re optimizing in the dark. Show me the flamegraph.' },
]

interface CostSummary {
  cost: number
  tokens: number
  providers: string[]
  rounds: number
  mode: string
}

export default function QuantumDebatePanel() {
  const [question, setQuestion] = useState<string | null>(null)
  const [messages, setMessages] = useState<(QuantumMessage & { streaming?: boolean })[]>([])
  const [consensus, setConsensus] = useState(0)
  const [activeCharId, setActiveCharId] = useState<string | null>(null)
  const [thinkingIds, setThinkingIds] = useState<string[]>([])
  const [sessionActive, setSessionActive] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [offline, setOffline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cancelStreamRef = useRef<(() => void) | null>(null)

  // Only auto-scroll if the user is already near the bottom (within 100px).
  // If they've scrolled up to re-read previous responses, we don't force-jump.
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

  const runDemoDebate = useCallback((q: string) => {
    setQuestion(q)
    setSessionActive(true)
    setStartTime(Date.now())
    setThinkingIds(CHARACTERS.map(c => c.id))
    setMessages([])
    setConsensus(0)
    setOffline(false)

    let msgIdx = 0
    const addNextMessage = () => {
      if (msgIdx >= DEMO_DEBATE.length) {
        setThinkingIds([])
        setActiveCharId(null)
        return
      }
      const demo = DEMO_DEBATE[msgIdx]
      const charId = demo.characterId
      setThinkingIds(prev => prev.filter(id => id !== charId))
      setActiveCharId(charId)

      const msg: QuantumMessage & { streaming?: boolean } = {
        id: `demo-${msgIdx}`,
        characterId: charId,
        text: demo.text,
        timestamp: Date.now(),
        streaming: true,
      }
      setMessages(prev => [...prev, msg])
      setConsensus(prev => Math.min(100, prev + 12 + Math.random() * 8))

      msgIdx++
      // Wait for streaming to finish (~18ms per char + buffer)
      const streamDuration = demo.text.length * 18 + 500
      setTimeout(() => {
        setMessages(prev =>
          prev.map(m => m.id === msg.id ? { ...m, streaming: false } : m)
        )
        setTimeout(addNextMessage, 400)
      }, streamDuration)
    }

    // Start first message after thinking delay
    setTimeout(addNextMessage, 1500)
  }, [])

  const handleSubmit = useCallback(async (q: string, mode: QuantumMode) => {
    setLoading(true)
    setQuestion(q)
    setMessages([])
    setConsensus(0)
    setCostSummary(null)
    setSessionActive(true)
    setStartTime(Date.now())
    setThinkingIds(CHARACTERS.map(c => c.id))

    try {
      // Quantum chat runs as guest — no Supabase auth required.
      // The Quantum API accepts unauthenticated requests in guest mode.
      const result = await createQuantumSession(q, null, mode)
      if ('error' in result) {
        // API offline — run demo mode
        setOffline(true)
        setLoading(false)
        runDemoDebate(q)
        return
      }

      setLoading(false)
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
                setMessages(prev => {
                  const existing = prev.find(
                    m => m.characterId === event.characterId && m.streaming
                  )
                  if (existing) {
                    return prev.map(m =>
                      m.id === existing.id
                        ? { ...m, text: m.text + event.token }
                        : m
                    )
                  }
                  return [
                    ...prev,
                    {
                      id: `msg-${Date.now()}-${event.characterId}`,
                      characterId: event.characterId!,
                      text: event.token!,
                      timestamp: Date.now(),
                      streaming: true,
                    },
                  ]
                })
                setThinkingIds(prev =>
                  prev.filter(id => id !== event.characterId)
                )
                setActiveCharId(event.characterId)
              }
              break
            case 'message_complete':
              if (event.characterId) {
                setMessages(prev =>
                  prev.map(m =>
                    m.characterId === event.characterId && m.streaming
                      ? { ...m, streaming: false }
                      : m
                  )
                )
              }
              break
            case 'consensus_update':
              if (event.consensus !== undefined) {
                setConsensus(event.consensus)
              }
              break
            case 'session_complete':
              setThinkingIds([])
              setActiveCharId(null)
              if (typeof event.cost === 'number') {
                setCostSummary({
                  cost: event.cost,
                  tokens: event.tokens ?? 0,
                  providers: event.providers_used ?? [],
                  rounds: event.rounds ?? 0,
                  mode: event.mode ?? mode,
                })
              }
              break
            case 'error':
              setOffline(true)
              break
          }
        },
        () => {
          setOffline(true)
          runDemoDebate(q)
        }
      )
      cancelStreamRef.current = cancel
    } catch {
      setOffline(true)
      setLoading(false)
      runDemoDebate(q)
    }
  }, [runDemoDebate])

  useEffect(() => {
    return () => {
      cancelStreamRef.current?.()
    }
  }, [])

  const getCharacter = (id: string) => CHARACTERS.find(c => c.id === id)!

  return (
    <div className="flex flex-col h-full">
      {/* Session bar */}
      <SessionBar active={sessionActive} startTime={startTime} />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 mt-4 min-h-0">
        {/* Left: Avatar ring + consensus */}
        <div className="lg:w-[320px] shrink-0 flex flex-col items-center gap-4 py-4">
          <AvatarRing
            characters={CHARACTERS}
            activeId={activeCharId}
            thinkingIds={thinkingIds}
          />
          <ConsensusMeter value={consensus} />

          {/* Thinking indicators */}
          {thinkingIds.length > 0 && (
            <div className="flex flex-col gap-1 mt-2 w-full max-w-[280px]">
              {thinkingIds.map(id => {
                const char = getCharacter(id)
                return (
                  <div key={id} className="flex items-center gap-2" style={{ fontSize: 12 }}>
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 5,
                        height: 5,
                        background: char.color,
                        animation: 'quantum-pulse 1.5s ease-in-out infinite',
                      }}
                    />
                    <span style={{ color: '#64748b' }}>
                      {THINKING_PHRASES[id]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Debate messages */}
        <div
          className="flex-1 flex flex-col min-h-0 rounded-xl"
          style={{
            background: 'rgba(8,8,18,0.6)',
            border: '1px solid rgba(119,119,187,0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Question header */}
          {question && (
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: 'rgba(119,119,187,0.12)' }}
            >
              <span style={{ fontSize: 11, color: '#7777bb', fontWeight: 600, letterSpacing: '0.1em' }}>
                QUESTION
              </span>
              <p style={{ fontSize: 15, color: '#e2e8f0', marginTop: 4 }}>{question}</p>
            </div>
          )}

          {/* Offline banner */}
          {offline && (
            <div
              className="px-4 py-2 text-center"
              style={{
                fontSize: 13,
                color: '#fb923c',
                background: 'rgba(251,146,60,0.06)',
                borderBottom: '1px solid rgba(251,146,60,0.15)',
              }}
            >
              Quantum API offline — showing demo debate
            </div>
          )}

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-3 py-2 space-y-1"
            style={{ minHeight: 200 }}
          >
            {!question && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <p style={{ fontSize: 16, color: '#64748b', marginBottom: 4 }}>
                  Ask a question and watch 4 AIs debate it live.
                </p>
                <p style={{ fontSize: 13, color: '#475569' }}>
                  They&apos;ll challenge each other, cite sources, and converge on the best answer.
                </p>
              </div>
            )}
            {messages.map(msg => (
              <DebateMessage
                key={msg.id}
                character={getCharacter(msg.characterId)}
                text={msg.text}
                streaming={msg.streaming}
                strikethrough={msg.strikethrough}
                agreement={msg.agreement}
              />
            ))}
            {costSummary && <CostSummaryStrip summary={costSummary} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="px-4 py-3 border-t"
            style={{ borderColor: 'rgba(119,119,187,0.12)' }}
          >
            <QuantumInput
              onSubmit={handleSubmit}
              disabled={thinkingIds.length > 0 && messages.length > 0}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Fine-grained cost strip shown after session_complete. The "without
// KCP-90" baseline is estimated at 3× actual cost — that's the headline
// compression ratio we quote for the typical multi-round debate; once
// the backend reports per-session kcp90_savings we'll wire that through
// instead of the static multiplier.
const KCP_BASELINE_MULTIPLIER = 3

function formatCost(usd: number): string {
  if (usd <= 0) return '$0.00'
  if (usd < 0.01) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(2)}`
}

function CostSummaryStrip({ summary }: { summary: CostSummary }) {
  const actual = summary.cost
  const baseline = actual * KCP_BASELINE_MULTIPLIER
  const savedPct = baseline > 0
    ? Math.round(((baseline - actual) / baseline) * 100)
    : 0

  return (
    <div
      className="mx-1 mt-3 mb-1 rounded-lg"
      style={{
        background:
          'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(99,102,241,0.08))',
        border: '1px solid rgba(74,222,128,0.18)',
        padding: '10px 14px',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: '#4ade80',
          fontWeight: 700,
          letterSpacing: '0.1em',
          marginBottom: 6,
        }}
      >
        SESSION SUMMARY
      </div>
      <div
        className="flex flex-wrap gap-x-6 gap-y-2"
        style={{ fontSize: 13, color: '#cbd5e1' }}
      >
        <div>
          <span style={{ color: '#64748b' }}>Session cost: </span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
            {formatCost(actual)}
          </span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Without KCP-90: </span>
          <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
            ~{formatCost(baseline)}
          </span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>You saved: </span>
          <span style={{ color: '#4ade80', fontWeight: 700 }}>{savedPct}%</span>
        </div>
        {summary.tokens > 0 && (
          <div>
            <span style={{ color: '#64748b' }}>Tokens: </span>
            <span style={{ color: '#e2e8f0' }}>
              {summary.tokens.toLocaleString()}
            </span>
          </div>
        )}
        {summary.rounds > 0 && (
          <div>
            <span style={{ color: '#64748b' }}>Rounds: </span>
            <span style={{ color: '#e2e8f0' }}>{summary.rounds}</span>
          </div>
        )}
      </div>
    </div>
  )
}
