'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#cc9955'

interface Competition {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  prizes: { first: number; second: number; third: number }
  status: 'upcoming' | 'active' | 'ended'
}

const MOCK_COMP: Competition = {
  id: 'mock-1',
  title: 'April Regime Challenge',
  description: 'Build a bot that outperforms in the current BTC-dominated regime. All strategies welcome. Show your code after the competition ends.',
  start_date: '2026-04-01T00:00:00Z',
  end_date: '2026-04-30T23:59:59Z',
  prizes: { first: 10000, second: 5000, third: 2500 },
  status: 'upcoming',
}

function getDaysLeft(end: string): number {
  return Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86400_000))
}

export default function CompeteTab() {
  const [comp, setComp] = useState<Competition>(MOCK_COMP)

  useEffect(() => {
    supabase
      .from('competitions')
      .select('*')
      .in('status', ['upcoming', 'active'])
      .order('start_date', { ascending: true })
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setComp(data as Competition) })
  }, [])

  const daysLeft = getDaysLeft(comp.end_date)
  const statusColor = comp.status === 'active' ? '#22c55e' : comp.status === 'upcoming' ? ACCENT : '#475569'

  return (
    <div className="space-y-8">
      {/* Monthly competition banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header stripe */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} style={{ color: ACCENT }} />
            <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Monthly Competition</span>
          </div>
          <span
            className="px-2.5 py-1 rounded-full font-medium uppercase"
            style={{ background: `${statusColor}14`, color: statusColor, border: `1px solid ${statusColor}33`, letterSpacing: '0.08em', fontSize: '0.875rem' }}
          >
            {comp.status}
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <h2
            style={{ color: '#e2e8f0', fontSize: '1.5rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}
          >
            {comp.title}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 20 }}>
            {comp.description}
          </p>

          {/* Prize pool */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {([
              { place: '1st', amount: comp.prizes.first,  icon: '🥇' },
              { place: '2nd', amount: comp.prizes.second, icon: '🥈' },
              { place: '3rd', amount: comp.prizes.third,  icon: '🥉' },
            ] as const).map(({ place, amount, icon }) => (
              <div
                key={place}
                className="rounded-xl px-4 py-4 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{icon}</div>
                <div style={{ color: '#e2e8f0', fontSize: '1.375rem', fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1 }}>
                  {amount.toLocaleString()}
                </div>
                <div style={{ color: '#475569', fontSize: '0.875rem', marginTop: 2 }}>GHAI</div>
              </div>
            ))}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <div style={{ color: '#475569', fontSize: '0.875rem', marginBottom: 2 }}>Duration</div>
              <div style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.9375rem' }}>
                {new Date(comp.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                {' — '}
                {new Date(comp.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div>
              <div style={{ color: '#475569', fontSize: '0.875rem', marginBottom: 2 }}>Days remaining</div>
              <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.375rem', letterSpacing: '0.02em', lineHeight: 1 }}>
                {daysLeft}
              </div>
            </div>
          </div>

          {/* Rules */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Rules
            </p>
            {[
              'Submit via the Upload Bot tab — one entry per user.',
              'Bots run in voidexa sandbox with real market data.',
              'Source code revealed to all participants after competition ends.',
              'Scoring: 60% return, 30% Sharpe ratio, 10% max drawdown.',
            ].map(r => (
              <div key={r} className="flex gap-2 mb-2">
                <span style={{ color: `${ACCENT}55` }}>·</span>
                <span style={{ color: '#64748b', fontSize: '0.9375rem' }}>{r}</span>
              </div>
            ))}
          </div>

          <button
            className="w-full sm:w-auto px-6 py-3 rounded-full font-medium transition-opacity hover:opacity-80"
            style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44`, color: ACCENT, fontSize: '0.9375rem' }}
            onClick={() => alert('Competition entry requires bot upload — go to the Upload Bot tab first.')}
          >
            Enter Competition
          </button>
        </div>
      </motion.div>

      {/* Beat the house */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-6"
        style={{ border: `1px solid ${ACCENT}22`, background: `rgba(204,153,85,0.04)` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} style={{ color: ACCENT }} />
          <h3 style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.125rem', fontFamily: 'var(--font-space)' }}>
            Beat the House — Permanent Challenge
          </h3>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 16 }}>
          The voidexa All-Season bot has returned +194.79% over its lifetime. Any bot on the leaderboard that beats this benchmark earns a permanent spot in the Hall of Fame and 5,000 GHAI.
        </p>
        <div className="flex flex-wrap gap-4">
          <div>
            <div style={{ color: '#475569', fontSize: '0.875rem' }}>Target to beat</div>
            <div style={{ color: '#22c55e', fontWeight: 500, fontSize: '1.5rem', letterSpacing: '0.02em' }}>+194.79%</div>
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.875rem' }}>Hall of Fame entries</div>
            <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.5rem', letterSpacing: '0.02em' }}>0</div>
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.875rem' }}>Reward</div>
            <div style={{ color: ACCENT, fontWeight: 500, fontSize: '1.5rem', letterSpacing: '0.02em' }}>5,000 GHAI</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
