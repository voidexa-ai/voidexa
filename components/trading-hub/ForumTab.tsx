'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#cc9955'

type Category = 'strategy' | 'post-mortem' | 'market' | 'help' | 'competition'

const CAT_CONFIG: Record<Category, { label: string; color: string }> = {
  strategy:      { label: 'Strategy',    color: '#f59e0b' },
  'post-mortem': { label: 'Post-mortem', color: '#f87171' },
  market:        { label: 'Market',      color: '#3b82f6' },
  help:          { label: 'Help',        color: '#22c55e' },
  competition:   { label: 'Competition', color: '#a855f7' },
}

const MOCK_THREADS = [
  { id: '1', title: "My grid bot made 34% in April sideways BTC — here's how", author: 'gridlord', category: 'strategy' as Category, reply_count: 12, created_at: new Date(Date.now() - 2 * 3600_000).toISOString() },
  { id: '2', title: 'Post-mortem: momentum bot wiped 40% in 3 days — lessons learned', author: 'cryptovoid', category: 'post-mortem' as Category, reply_count: 28, created_at: new Date(Date.now() - 6 * 3600_000).toISOString() },
  { id: '3', title: 'Is this a real altseason or a fake-out? Reading the regime signals', author: 'moonbase9', category: 'market' as Category, reply_count: 7, created_at: new Date(Date.now() - 14 * 3600_000).toISOString() },
  { id: '4', title: 'Help: my DCA bot keeps buying at market price instead of limit — why?', author: 'newtrader99', category: 'help' as Category, reply_count: 4, created_at: new Date(Date.now() - 24 * 3600_000).toISOString() },
  { id: '5', title: "April competition strategy reveal: what I'm submitting and why", author: 'adaptai', category: 'competition' as Category, reply_count: 19, created_at: new Date(Date.now() - 36 * 3600_000).toISOString() },
]

type Thread = typeof MOCK_THREADS[number]

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function CategoryBadge({ cat }: { cat: Category }) {
  const cfg = CAT_CONFIG[cat]
  return (
    <span
      className="text-sm px-2 py-0.5 rounded-full font-medium"
      style={{ color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}28`, fontSize: '0.8125rem' }}
    >
      {cfg.label}
    </span>
  )
}

export default function ForumTab() {
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS)
  const [activeFilter, setFilter] = useState<Category | 'all'>('all')

  useEffect(() => {
    supabase
      .from('forum_threads')
      .select('id, title, user_id, category, reply_count, created_at')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setThreads(data.map(d => ({ ...d, author: (d.user_id as string).slice(0, 8) })) as Thread[])
        }
      })
  }, [])

  const filtered = activeFilter === 'all' ? threads : threads.filter(t => t.category === activeFilter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
            Community Forum
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Strategies, post-mortems, and market discussion.</p>
        </div>
        <button
          className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT }}
          onClick={() => alert('Thread creation coming soon — authentication required.')}
        >
          + New Thread
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className="px-3 py-1.5 rounded-full text-sm transition-colors"
          style={{
            background: activeFilter === 'all' ? `${ACCENT}18` : 'rgba(255,255,255,0.04)',
            color: activeFilter === 'all' ? ACCENT : '#64748b',
            border: activeFilter === 'all' ? `1px solid ${ACCENT}44` : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          All
        </button>
        {(Object.keys(CAT_CONFIG) as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-full text-sm transition-colors"
            style={{
              background: activeFilter === cat ? `${CAT_CONFIG[cat].color}18` : 'rgba(255,255,255,0.04)',
              color: activeFilter === cat ? CAT_CONFIG[cat].color : '#64748b',
              border: activeFilter === cat ? `1px solid ${CAT_CONFIG[cat].color}44` : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {CAT_CONFIG[cat].label}
          </button>
        ))}
      </div>

      {/* Thread list */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {filtered.map((thread, i) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-4 px-5 py-5 cursor-pointer transition-colors"
            style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div className="flex-1 min-w-0">
              <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem', marginBottom: 6, lineHeight: 1.4 }}>
                {thread.title}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <CategoryBadge cat={thread.category} />
                <span style={{ color: '#475569', fontSize: '0.8125rem' }}>@{thread.author}</span>
                <span style={{ color: '#334155', fontSize: '0.8125rem' }}>·</span>
                <span className="flex items-center gap-1" style={{ color: '#475569', fontSize: '0.8125rem' }}>
                  <MessageSquare size={12} /> {thread.reply_count}
                </span>
                <span className="flex items-center gap-1" style={{ color: '#475569', fontSize: '0.8125rem' }}>
                  <Clock size={12} /> {timeAgo(thread.created_at)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
