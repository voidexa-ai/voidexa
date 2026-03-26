'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Hammer, Circle, ChevronUp, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#44aacc'

type RoadmapStatus = 'live' | 'building' | 'planned'

interface RoadmapItem {
  title: string
  desc: string
  status: RoadmapStatus
  phase: string
}

const ROADMAP: RoadmapItem[] = [
  { title: 'Void Chat',    desc: 'Multi-provider AI chat — Claude, GPT-4o, Gemini in one interface.',    status: 'live',     phase: 'Phase 2' },
  { title: 'Trading Hub',  desc: 'Bot upload, leaderboard, competitions, and the community forum.',       status: 'building', phase: 'Phase 3' },
  { title: 'Node System',  desc: 'Validator nodes earning GHAI for powering the network.',                status: 'planned',  phase: 'Phase 4' },
  { title: 'Competitions', desc: 'Monthly GHAI prize pools for top-performing trading bots.',             status: 'planned',  phase: 'Phase 5' },
  { title: 'Quantum',      desc: 'Multi-AI debate — emergent intelligence from provider disagreement.',   status: 'planned',  phase: 'Phase 6' },
  { title: 'Referrals',    desc: 'Earn GHAI for bringing new builders into the voidexa ecosystem.',       status: 'planned',  phase: 'Phase 7' },
  { title: 'Comlink',      desc: 'Encrypted AI-powered messaging protocol for the community.',            status: 'planned',  phase: 'Phase 9' },
  { title: 'Copy Trading', desc: 'One-click replication of top bot strategies.',                          status: 'planned',  phase: 'Phase 10' },
]

const STATUS_CONFIG: Record<RoadmapStatus, { label: string; color: string; Icon: typeof CheckCircle }> = {
  live:     { label: 'Live',     color: '#22c55e', Icon: CheckCircle },
  building: { label: 'Building', color: ACCENT,    Icon: Hammer },
  planned:  { label: 'Planned',  color: '#475569', Icon: Circle },
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
        <p style={{ color: `${ACCENT}88`, fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>
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
            const { label, color, Icon } = STATUS_CONFIG[item.status]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 px-5 py-4 rounded-xl items-start"
                style={{
                  background: item.status === 'live' ? 'rgba(34,197,94,0.04)' : item.status === 'building' ? `rgba(68,170,204,0.04)` : 'rgba(255,255,255,0.02)',
                  border: item.status === 'building' ? `1px solid ${ACCENT}22` : '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Icon size={18} style={{ color, marginTop: 2, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{item.title}</span>
                    <span style={{ color: '#334155', fontSize: '0.8125rem' }}>·</span>
                    <span style={{ color: '#475569', fontSize: '0.8125rem' }}>{item.phase}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
                <span
                  className="shrink-0 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${color}14`, color, border: `1px solid ${color}28`, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                >
                  {label}
                </span>
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
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.9375rem' }}
          />
          <div className="flex gap-3">
            <input
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Short description (optional)"
              maxLength={200}
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.9375rem' }}
            />
            <button
              type="submit"
              disabled={submitting || !newTitle.trim()}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT, fontSize: '0.875rem', fontWeight: 500 }}
            >
              <Send size={14} />
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
    </div>
  )
}
