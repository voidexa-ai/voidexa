'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Hammer, Circle, ChevronUp, Send, Wrench, Zap, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#44aacc'

type RoadmapStatus = 'live' | 'active' | 'building' | 'next' | 'testing' | 'planned'

interface RoadmapItem {
  title: string
  desc: string
  tooltip?: string
  status: RoadmapStatus
  phase: string
}

const ROADMAP: RoadmapItem[] = [
  // ── LIVE ─────────────────────────────────────────────────────────────────
  {
    title: 'Void Chat',
    desc: 'Multi-AI chat with KCP-90 compression. Claude, ChatGPT & Gemini.',
    tooltip: 'KCP-90 context compression active — older messages compressed to extend context window.',
    status: 'live',
    phase: 'Phase 1',
  },
  {
    title: 'AI Trading Bot',
    desc: 'Regime-aware autonomous trading. +357% backtested. v4.1.0.',
    tooltip: 'v4.1.0. 359 tests. APEX + SCALPER strategies. Momentum defense active. KCP-90 context compression.',
    status: 'live',
    phase: 'Phase 2',
  },
  {
    title: 'Quantum',
    desc: 'Multi-AI debate engine. 960 tests. KCP-90 middleware.',
    tooltip: '960 tests. KCP-90 middleware integrated. Multi-provider debate engine live.',
    status: 'live',
    phase: 'Phase 3',
  },
  {
    title: 'KCP-90',
    desc: 'AI-to-AI compression protocol. 78–88% proven. 248 tests.',
    tooltip: 'v0.8.0. 248 tests. 78–88% compression proven across 20 domains. Integrated in Void Chat, Quantum, Trading Bot.',
    status: 'live',
    phase: 'Phase 4',
  },
  {
    title: 'Control Plane',
    desc: 'Real-time KCP-90 compression dashboard.',
    tooltip: 'Live dashboard at /control-plane. Auto-refresh. Encoder breakdown, daily trends, recent events.',
    status: 'live',
    phase: 'Phase 5',
  },
  // ── NEXT ─────────────────────────────────────────────────────────────────
  {
    title: 'Jarvis',
    desc: 'Personal AI assistant with voice, context, and Quantum.',
    tooltip: 'Building next. Voice interface, persistent context, proactive task suggestions.',
    status: 'next',
    phase: 'Phase 6',
  },
  // ── BUILDING ─────────────────────────────────────────────────────────────
  {
    title: 'Trading Hub',
    desc: 'Bot upload, leaderboard, competitions, community forum.',
    tooltip: 'Bot upload, leaderboard, competitions, community forum',
    status: 'building',
    phase: 'Phase 7',
  },
  // ── PLANNED ──────────────────────────────────────────────────────────────
  {
    title: 'Node System',
    desc: 'Validator nodes earning GHAI.',
    tooltip: undefined,
    status: 'planned',
    phase: 'Phase 8',
  },
  {
    title: 'Competitions',
    desc: 'Monthly GHAI prize pools.',
    tooltip: undefined,
    status: 'planned',
    phase: 'Phase 9',
  },
  {
    title: 'TINE Secretary AI',
    desc: 'AI secretary for scheduling.',
    tooltip: 'AI secretary that manages scheduling, follow-ups, and communications.',
    status: 'planned',
    phase: 'Phase 10',
  },
  {
    title: 'BOSSO',
    desc: 'Autonomous business operations AI.',
    tooltip: 'Autonomous business operations AI — decisions, reports, and execution.',
    status: 'planned',
    phase: 'Phase 11',
  },
  {
    title: 'ContextSynch',
    desc: 'Cross-session memory sync.',
    tooltip: 'Cross-session memory synchronisation across all voidexa AI products.',
    status: 'planned',
    phase: 'Phase 12',
  },
  {
    title: 'Sentient AI Scaffold',
    desc: 'Persistent AI agent framework.',
    tooltip: 'Persistent AI agent framework with long-term memory and goal tracking.',
    status: 'planned',
    phase: 'Phase 13',
  },
  {
    title: 'DIY Mechanic',
    desc: 'AI-powered repair guide engine.',
    tooltip: 'AI-powered repair guide engine — diagnose and fix anything step by step.',
    status: 'planned',
    phase: 'Phase 14',
  },
  {
    title: 'Book Scaffold Engine',
    desc: 'AI-assisted book writing.',
    tooltip: 'AI-assisted book writing — outline, draft, and structure from a prompt.',
    status: 'planned',
    phase: 'Phase 15',
  },
  {
    title: 'Referrals',
    desc: 'Earn GHAI for bringing builders.',
    tooltip: undefined,
    status: 'planned',
    phase: 'Phase 16',
  },
  {
    title: 'Comlink',
    desc: 'Encrypted messaging. Off-grid capable.',
    tooltip: undefined,
    status: 'planned',
    phase: 'Phase 17',
  },
  {
    title: 'TINE Secretary AI',
    desc: 'AI secretary that manages scheduling, follow-ups, and task delegation.',
    tooltip: 'AI secretary that manages scheduling, follow-ups, and task delegation.',
    status: 'planned',
    phase: 'AI',
  },
  {
    title: 'Sentient AI Scaffold',
    desc: 'Persistent AI agent framework with long-term memory and goal tracking.',
    tooltip: 'Persistent AI agent framework with long-term memory and goal tracking.',
    status: 'planned',
    phase: 'AI',
  },
  {
    title: 'BOSSO',
    desc: 'Autonomous business operations AI — decisions, reports, and execution.',
    tooltip: 'Autonomous business operations AI — decisions, reports, and execution.',
    status: 'planned',
    phase: 'AI',
  },
  {
    title: 'ContextSynch',
    desc: 'Cross-session memory synchronisation across all voidexa AI products.',
    tooltip: 'Cross-session memory synchronisation across all voidexa AI products.',
    status: 'planned',
    phase: 'Infra',
  },
  {
    title: 'DIY Mechanic',
    desc: 'AI-powered repair guide engine — diagnose and fix anything step by step.',
    tooltip: 'AI-powered repair guide engine — diagnose and fix anything step by step.',
    status: 'planned',
    phase: 'Product',
  },
  {
    title: 'Book Scaffold Engine',
    desc: 'AI-assisted book writing — outline, draft, and structure from a prompt.',
    tooltip: 'AI-assisted book writing — outline, draft, and structure from a prompt.',
    status: 'planned',
    phase: 'Product',
  },
]

const STATUS_CONFIG: Record<
  RoadmapStatus,
  { label: string; color: string; Icon: typeof CheckCircle; pulse?: boolean }
> = {
  live:     { label: 'LIVE',     color: '#22c55e', Icon: CheckCircle, pulse: true },
  active:   { label: 'ACTIVE',   color: '#22c55e', Icon: Zap,         pulse: true },
  next:     { label: 'NEXT',     color: '#00d4ff', Icon: ArrowRight },
  building: { label: 'BUILDING', color: '#f97316', Icon: Wrench },
  testing:  { label: 'TESTING',  color: '#eab308', Icon: Hammer },
  planned:  { label: 'PLANNED',  color: '#475569', Icon: Circle },
}

interface Idea {
  id: string
  title: string
  description: string
  votes: number
}

const MOCK_IDEAS: Idea[] = [
  { id: '1', title: 'Dark/light mode toggle',                description: 'Some users prefer light mode for daytime use.', votes: 14 },
  { id: '2', title: 'Mobile app (iOS + Android)',            description: 'Native app for void chat on mobile.',            votes: 31 },
  { id: '3', title: 'Bot performance alerts via email/SMS', description: 'Notify when bot crosses threshold.',              votes: 22 },
]

export default function ScienceDeck() {
  const [ideas, setIdeas]       = useState<Idea[]>(MOCK_IDEAS)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [voted, setVoted]       = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase
      .from('station_ideas')
      .select('id, title, description, votes')
      .order('votes', { ascending: false })
      .limit(20)
      .then(({ data }) => { if (data && data.length > 0) setIdeas(data as Idea[]) })
  }, [])

  async function handleVote(id: string) {
    if (voted.has(id)) return
    const current = ideas.find(i => i.id === id)
    if (!current) return
    setVoted(prev => new Set([...prev, id]))
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i))
    await supabase.from('station_ideas').update({ votes: current.votes + 1 }).eq('id', id)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Please sign in to submit an idea.'); setSubmitting(false); return }
    const { data } = await supabase
      .from('station_ideas')
      .insert({ user_id: user.id, title: newTitle.trim(), description: newDesc.trim(), votes: 0 })
      .select()
      .single()
    if (data) setIdeas(prev => [data as Idea, ...prev])
    setNewTitle('')
    setNewDesc('')
    setSubmitting(false)
  }

  return (
    <div className="space-y-12">
      {/* Roadmap */}
      <div>
        <p style={{ color: `${ACCENT}88`, fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>
          Science Deck
        </p>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}>
          What We&apos;re Building
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 24 }}>
          The full voidexa roadmap — from what&apos;s live today to what&apos;s in the pipeline.
        </p>

        <div className="space-y-3">
          {ROADMAP.map((item, i) => {
            const { label, color, Icon, pulse } = STATUS_CONFIG[item.status]

            const rowBg =
              item.status === 'live'
                ? 'rgba(34,197,94,0.06)'
                : item.status === 'active'
                ? 'rgba(34,197,94,0.04)'
                : item.status === 'next'
                ? 'rgba(0,212,255,0.05)'
                : item.status === 'building'
                ? 'rgba(249,115,22,0.04)'
                : item.status === 'testing'
                ? 'rgba(234,179,8,0.04)'
                : 'rgba(255,255,255,0.015)'

            const rowBorder =
              item.status === 'live'
                ? '1px solid rgba(34,197,94,0.28)'
                : item.status === 'active'
                ? '1px solid rgba(34,197,94,0.14)'
                : item.status === 'next'
                ? '1px solid rgba(0,212,255,0.22)'
                : item.status === 'building'
                ? '1px solid rgba(249,115,22,0.14)'
                : item.status === 'testing'
                ? '1px solid rgba(234,179,8,0.14)'
                : '1px solid rgba(255,255,255,0.04)'

            const rowBoxShadow =
              item.status === 'live'
                ? 'inset 3px 0 0 rgba(34,197,94,0.5)'
                : item.status === 'next'
                ? 'inset 3px 0 0 rgba(0,212,255,0.45)'
                : 'none'

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-4 px-5 py-4 rounded-xl items-start group relative"
                style={{ background: rowBg, border: rowBorder, boxShadow: rowBoxShadow }}
              >
                <Icon size={18} style={{ color, marginTop: 2, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{item.title}</span>
                    <span style={{ color: '#334155', fontSize: '0.875rem' }}>·</span>
                    <span style={{ color: '#475569', fontSize: '0.875rem' }}>{item.phase}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>{item.desc}</p>
                </div>

                {/* Status badge — with tooltip on hover if tooltip text exists */}
                <div className="shrink-0 relative">
                  <span
                    className="text-sm px-2 py-0.5 rounded-full flex items-center gap-1.5"
                    style={{
                      background: `${color}14`,
                      color,
                      border: `1px solid ${color}28`,
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                    }}
                    title={item.tooltip}
                  >
                    {pulse && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: color,
                          boxShadow: `0 0 5px ${color}`,
                          animation: 'pulse-dot 1.8s ease-in-out infinite',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {label}
                  </span>
                  {/* Tooltip bubble (shows on hover) */}
                  {item.tooltip && (
                    <div
                      className="absolute right-0 bottom-full mb-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{
                        background: 'rgba(15,15,25,0.97)',
                        border: `1px solid ${color}33`,
                        borderRadius: 8,
                        padding: '8px 12px',
                        minWidth: 200,
                        maxWidth: 300,
                        color: '#94a3b8',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        whiteSpace: 'normal',
                      }}
                    >
                      {item.tooltip}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Community ideas */}
      <div>
        <h3 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
          Community Ideas
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 20 }}>
          Suggest a feature. Upvote the ones you want most.
        </p>

        {/* Submit form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-5 mb-6 space-y-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Idea title"
            maxLength={100}
            className="w-full rounded-xl px-4 py-3 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.9375rem' }}
          />
          <div className="flex gap-3">
            <input
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Short description (optional)"
              maxLength={200}
              className="flex-1 rounded-xl px-4 py-3 outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.9375rem' }}
            />
            <button
              type="submit"
              disabled={submitting || !newTitle.trim()}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT, fontSize: '0.9375rem', fontWeight: 500 }}
            >
              <Send size={15} />
              Submit
            </button>
          </div>
        </form>

        {/* Ideas list */}
        <div className="space-y-3">
          {ideas.map((idea, i) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex gap-4 items-start px-5 py-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <button
                onClick={() => handleVote(idea.id)}
                disabled={voted.has(idea.id)}
                className="flex flex-col items-center gap-0.5 pt-0.5 transition-opacity disabled:opacity-50"
                style={{ color: voted.has(idea.id) ? ACCENT : '#475569', minWidth: 32 }}
              >
                <ChevronUp size={16} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1 }}>{idea.votes}</span>
              </button>
              <div>
                <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem', marginBottom: 2 }}>{idea.title}</p>
                {idea.description && <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{idea.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
    </div>
  )
}
