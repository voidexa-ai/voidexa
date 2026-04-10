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

// Demo debate for offline/fallback mode
const DEMO_DEBATE: { characterId: string; text: string }[] = [
  { characterId: 'claude', text: '## Initial analysis\n\nThe optimal approach here requires careful consideration of both **time** and **space** complexity. I suggest we evaluate the trade-offs systematically.' },
  { characterId: 'gpt', text: 'Agreed on the systematic approach. However, I\'d prioritize **runtime performance** — in production, `O(n log n)` with good constant factors beats `O(n)` with heavy overhead.' },
  { characterId: 'perplexity', text: 'According to recent benchmarks from 2024, the gap between theoretical complexity and real-world performance varies by up to 3x depending on cache behavior. *Sources: ACM SIGPLAN, IEEE transactions.*' },
  { characterId: 'gemini', text: 'Your benchmarks are helpful, but the question assumes a specific workload pattern. Without profiling the actual use case, we\'re optimizing in the dark. **Show me the flamegraph.**' },
]

interface CostSummary {
  cost: number
  tokens: number
  providers: string[]
  rounds: number
  mode: string
  /** Wall-clock duration from Ask-Quantum click to session_complete. */
  elapsedMs: number
}

// Local message shape — extends the public QuantumMessage with the
// streaming flag and the round number from the SSE event.
type LiveMessage = QuantumMessage & {
  streaming?: boolean
  round?: number
}

// Total providers shown in the avatar ring — used as the "/4" denominator
// in the cost strip's providers line.
const TOTAL_PROVIDERS = 4

// Default rounds per UX mode — keeps the round-separator label logic
// honest about which round is the final "synthesis" round.
const MODE_ROUND_COUNT: Record<QuantumMode, number> = {
  standard: 2,
  deep: 3,
}

export default function QuantumDebatePanel() {
  const [question, setQuestion] = useState<string | null>(null)
  const [messages, setMessages] = useState<LiveMessage[]>([])
  const [consensus, setConsensus] = useState(0)
  const [activeCharId, setActiveCharId] = useState<string | null>(null)
  const [thinkingIds, setThinkingIds] = useState<string[]>([])
  const [sessionActive, setSessionActive] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [offline, setOffline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null)
  const [currentMode, setCurrentMode] = useState<QuantumMode>('standard')
  // Live wall-clock timer ticked at 100 ms while a session is in flight.
  // Snapshotted into costSummary.elapsedMs on session_complete and then
  // hidden from the live readout so the summary owns the final figure.
  const [elapsedMs, setElapsedMs] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerStartRef = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cancelStreamRef = useRef<(() => void) | null>(null)

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
    startTimer()

    let msgIdx = 0
    const addNextMessage = () => {
      if (msgIdx >= DEMO_DEBATE.length) {
        setThinkingIds([])
        setActiveCharId(null)
        stopTimer()
        return
      }
      const demo = DEMO_DEBATE[msgIdx]
      const charId = demo.characterId
      setThinkingIds(prev => prev.filter(id => id !== charId))
      setActiveCharId(charId)

      const msg: LiveMessage = {
        id: `demo-${msgIdx}`,
        characterId: charId,
        text: demo.text,
        timestamp: Date.now(),
        streaming: true,
        round: 1,
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
  }, [startTimer, stopTimer])

  const handleSubmit = useCallback(async (q: string, mode: QuantumMode) => {
    setLoading(true)
    setQuestion(q)
    setMessages([])
    setConsensus(0)
    setCostSummary(null)
    setSessionActive(true)
    setStartTime(Date.now())
    setThinkingIds(CHARACTERS.map(c => c.id))
    setCurrentMode(mode)
    startTimer()

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
                const round = event.round ?? 1
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
                      id: `msg-${Date.now()}-${event.characterId}-r${round}`,
                      characterId: event.characterId!,
                      text: event.token!,
                      timestamp: Date.now(),
                      streaming: true,
                      round,
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
            case 'session_complete': {
              setThinkingIds([])
              setActiveCharId(null)
              const finalMs = stopTimer()
              if (typeof event.cost === 'number') {
                setCostSummary({
                  cost: event.cost,
                  tokens: event.tokens ?? 0,
                  providers: event.providers_used ?? [],
                  rounds: event.rounds ?? 0,
                  mode: event.mode ?? mode,
                  elapsedMs: finalMs,
                })
              }
              break
            }
            case 'error':
              setOffline(true)
              stopTimer()
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
  }, [runDemoDebate, startTimer, stopTimer])

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

  // Build the chat-area children with round separators interleaved
  // between message groups. The final round is labelled SYNTHESIS so
  // the user knows the debate is converging on its consolidated answer.
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
    <div className="flex flex-col lg:flex-row h-full w-full">
      {/* ─────────────────── LEFT PANEL — sticky ─────────────────── */}
      <aside
        className="shrink-0 flex flex-col gap-5 px-5 py-6 overflow-y-auto"
        style={{
          width: '300px',
          maxWidth: '100%',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(8,8,18,0.4)',
        }}
      >
        <SessionBar active={sessionActive} startTime={startTime} />

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
                  style={{ fontSize: 12 }}
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

        {/* KCP-90 stats panel */}
        <Kcp90InfoPanel
          mode={currentMode}
          tokens={costSummary?.tokens ?? null}
        />
      </aside>

      {/* ─────────────────── RIGHT PANEL — chat + cost + input ─────────── */}
      <section className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Offline banner */}
        {offline && (
          <div
            className="px-5 py-2 text-center shrink-0"
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

        {/* Chat area — independently scrolling. */}
        <div
          ref={scrollContainerRef}
          className="quantum-chat-area flex-1 overflow-y-auto"
          style={{ padding: '24px 28px', minHeight: 0 }}
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
                  fontSize: 11,
                  color: '#7f77dd',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  marginBottom: 4,
                }}
              >
                QUESTION
              </div>
              <p style={{ fontSize: 16, color: '#e8e8f0', lineHeight: 1.55 }}>
                {question}
              </p>
              {timerRunning && (
                <p
                  style={{
                    fontSize: 12,
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
            <div className="flex flex-col items-center justify-center text-center py-20">
              <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 6 }}>
                Ask a question and watch 4 AIs debate it live.
              </p>
              <p style={{ fontSize: 14, color: '#64748b' }}>
                They&apos;ll challenge each other, cite sources, and converge on the best answer.
              </p>
            </div>
          )}

          {renderChatBody()}
          <div ref={messagesEndRef} />
        </div>

        {/* Cost strip — pinned bottom of right panel */}
        {costSummary && (
          <div
            className="shrink-0"
            style={{
              padding: '12px 28px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <CostSummaryStrip summary={costSummary} />
          </div>
        )}

        {/* Input — pinned bottom */}
        <div
          className="shrink-0"
          style={{ padding: '14px 28px 20px' }}
        >
          <QuantumInput
            onSubmit={handleSubmit}
            disabled={thinkingIds.length > 0 && messages.length > 0}
            loading={loading}
          />
        </div>
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
          fontSize: 11,
          letterSpacing: '0.16em',
          color: synthesis ? '#a5b4fc' : 'rgba(127,119,221,0.6)',
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
  // Standard mode disables Layer 1 (BERT) for fast web sessions, so the
  // realistic compression ratio is L0+L2 only.
  standard: { label: 'KCP-90 LITE', ratio: 2.5, layers: 'L0 · L2' },
  // Deep mode runs the full L0+L1+L2 stack — slower but stronger compression.
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
  // Estimate tokens saved using the typical ratio for the mode. We
  // can't know the true compressed-vs-original count without backend
  // help, so we present an estimate plainly so users understand the
  // headline number.
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
            fontSize: 11,
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
          fontSize: 12,
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

// Standard-API baseline: what this same debate would cost if each
// provider were queried independently without KCP-90 prompt
// compression. 3× the actual session cost is the rule-of-thumb ratio
// we quote for a typical multi-round debate — the same multi-round
// eval prompts still run, just without the compression savings.
const STANDARD_API_MULTIPLIER = 3

// Pretty label for each mode as shown in the summary headline.
const MODE_LABEL: Record<string, string> = {
  standard: 'Standard',
  deep: 'Deep',
  // Legacy values are kept as read-only fallbacks so old completed
  // sessions still render a sensible label.
  fast: 'Standard',
  verbose: 'Deep',
  quick: 'Standard',
}

function modeLabel(mode: string): string {
  return MODE_LABEL[mode] ?? 'Standard'
}

function formatCost(usd: number): string {
  if (usd <= 0) return '$0.00'
  // Sub-dollar amounts render at 4 decimals so tiny quantum prices and
  // their 3× API baselines stay at matching precision in the strip.
  if (usd < 1) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(2)}`
}

function formatDuration(ms: number): string {
  const seconds = Math.max(0, ms) / 1000
  return `${seconds.toFixed(1)}s`
}

function CostSummaryStrip({ summary }: { summary: CostSummary }) {
  const quantumPrice = summary.cost
  const standardApiPrice = quantumPrice * STANDARD_API_MULTIPLIER
  const modeName = modeLabel(summary.mode)
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
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: '#4ade80',
          fontWeight: 700,
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}
      >
        SESSION SUMMARY
      </div>

      {/* Line 1 — narrative headline describing the debate itself. */}
      <p style={{ fontSize: 14, color: '#e2e8f0', marginBottom: 8 }}>
        A <span style={{ fontWeight: 700, color: '#a5b4fc' }}>{modeName}</span>{' '}
        Quantum debate with{' '}
        <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{providerCount}</span>{' '}
        providers across{' '}
        <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{rounds}</span>{' '}
        {rounds === 1 ? 'round' : 'rounds'}
      </p>

      {/* Lines 2 & 3 — price comparison. */}
      <div className="flex flex-col gap-1" style={{ fontSize: 13 }}>
        <div>
          <span style={{ color: '#64748b' }}>
            Standard API cost for this debate:{' '}
          </span>
          <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
            ~{formatCost(standardApiPrice)}
          </span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Your price: </span>
          <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 15 }}>
            {formatCost(quantumPrice)}
          </span>
        </div>
      </div>

      {/* Line 4 — dot-separated meta (providers / tokens / time). */}
      <div
        style={{
          fontSize: 12,
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
