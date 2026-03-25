'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Upload, Trophy, Calendar, Copy, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useGetInTouchModal } from '@/components/GetInTouchModal'

const ACCENT = '#cc9955'

const FEATURES = [
  {
    icon: Upload,
    title: 'Upload Your Bot',
    desc: 'Upload your trading strategy (Python). Run it in our sandbox with paper money. See how it performs in real-time.',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    desc: 'Real-time ranking of all bots. Who earns the most this week? This month? See it live.',
  },
  {
    icon: Calendar,
    title: 'Monthly Competitions',
    desc: 'Enter your bot in monthly challenges. Top 3 win GHAI tokens. All participants show code — open learning platform.',
  },
  {
    icon: Copy,
    title: 'Copy Trading',
    desc: 'Find a top performer. Copy their strategy with one click. The bot trades for you.',
  },
  {
    icon: ShoppingBag,
    title: 'Bot Marketplace',
    desc: 'Sell your strategy as a service. Set your price in GHAI. Passive income from your code.',
  },
]

export default function TradingHubPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const { open: openModal }   = useGetInTouchModal()

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#07070d' }}>
      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 65% 40% at 50% 25%, ${ACCENT}10 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── HERO ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-40 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
            style={{ color: ACCENT, background: `${ACCENT}18`, border: `1px solid ${ACCENT}40` }}
          >
            Coming Soon
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
          style={{ color: `${ACCENT}88` }}
        >
          Trading Hub
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl sm:text-7xl font-bold mb-5 leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0', textShadow: `0 0 60px ${ACCENT}2a` }}
        >
          Trading Hub
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-xl sm:text-2xl font-light mb-10"
          style={{ color: `${ACCENT}cc` }}
        >
          Build. Share. Compete.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mx-auto mb-10"
          style={{ width: 40, height: 1, background: `${ACCENT}55` }}
        />
      </div>

      {/* ── FEATURE CARDS ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        <div className="space-y-3">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="flex items-start gap-5 px-6 py-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}
              >
                <Icon size={16} style={{ color: ACCENT }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="text-sm font-semibold text-[#e2e8f0]">{title}</h3>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}28`, color: ACCENT }}
                  >
                    Soon
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── NODE WIDGET ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-3xl mx-auto px-6 pb-10"
      >
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-4 rounded-2xl text-xs"
          style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
        >
          <span className="font-semibold" style={{ color: ACCENT }}>7 active nodes</span>
          <span style={{ color: '#334155' }}>·</span>
          <span style={{ color: '#64748b' }}>next tier opens at 20</span>
          <span style={{ color: '#334155' }}>·</span>
          <span style={{ color: '#64748b' }}>13 open slots</span>
        </div>
      </motion.div>

      {/* ── WAITLIST FORM ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 max-w-3xl mx-auto px-6 pb-28 text-center"
      >
        {sent ? (
          <p className="text-sm" style={{ color: ACCENT }}>You&apos;re on the list. We&apos;ll be in touch.</p>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <form
              onSubmit={async e => {
                e.preventDefault()
                setLoading(true)
                await supabase.from('waitlist_signups').insert({ email, product: 'trading-hub' })
                supabase.functions.invoke('notify', { body: { type: 'waitlist', product: 'trading-hub', email } }).catch(() => {})
                setLoading(false)
                setSent(true)
              }}
              className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md"
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
                style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}33`, color: '#e2e8f0' }}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44`, color: ACCENT, padding: '12px 24px', whiteSpace: 'nowrap' }}
              >
                {loading ? '…' : <>Join waitlist <ArrowRight size={14} /></>}
              </button>
            </form>
            <p className="text-xs" style={{ color: '#334155' }}>
              or{' '}
              <button
                onClick={() => openModal('trading-hub')}
                className="transition-colors hover:text-[#64748b]"
                style={{ color: '#475569' }}
              >
                send us a message
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
