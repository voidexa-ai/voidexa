'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#888888'

export default function GhostAIPage() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#07070d' }}
    >
      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 65% 55% at 50% 40%, ${ACCENT}14 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Badges row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 flex-wrap justify-center"
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
            style={{ color: ACCENT, background: `${ACCENT}18`, border: `1px solid ${ACCENT}40` }}
          >
            Coming Soon
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
            style={{
              color: '#ccaa44',
              background: 'rgba(204,170,68,0.12)',
              border: '1px solid rgba(204,170,68,0.3)',
            }}
          >
            Powered by GHAI Token
          </span>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
          style={{ color: `${ACCENT}77` }}
        >
          Ghost AI
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl sm:text-7xl font-bold mb-5 leading-none tracking-tight"
          style={{
            fontFamily: 'var(--font-space)',
            color: '#e2e8f0',
            textShadow: `0 0 60px ${ACCENT}28`,
          }}
        >
          Ghost AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-xl sm:text-2xl font-light mb-8"
          style={{ color: `${ACCENT}bb` }}
        >
          Fast AI. No friction. Powered by Ghost AI Token.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mx-auto mb-8"
          style={{ width: 40, height: 1, background: `${ACCENT}44` }}
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base leading-relaxed mb-12 mx-auto max-w-lg"
          style={{ color: '#64748b' }}
        >
          Instant answers from the world's best AI models. One interface. One token.
          No subscriptions.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
        >
          {sent ? (
            <p className="text-sm" style={{ color: ACCENT }}>You're on the list. We'll be in touch.</p>
          ) : (
            <form
              onSubmit={async e => {
                e.preventDefault()
                setLoading(true)
                await supabase.from('waitlist_signups').insert({ email, product: 'ghost-ai' })
                supabase.functions.invoke('notify', { body: { type: 'waitlist', product: 'ghost-ai', email } }).catch(() => {})
                setLoading(false)
                setSent(true)
              }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="px-4 py-3 rounded-full text-sm outline-none"
                style={{
                  background: `${ACCENT}10`,
                  border: `1px solid ${ACCENT}33`,
                  color: '#e2e8f0',
                  minWidth: 220,
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{
                  background: `${ACCENT}18`,
                  border: `1px solid ${ACCENT}44`,
                  color: ACCENT,
                  padding: '12px 28px',
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? '…' : <>{' '}Join the waitlist <ArrowRight size={15} /></>}
              </button>
            </form>
          )}
        </motion.div>

        {/* White paper link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-8"
        >
          <Link
            href="/whitepaper"
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
            style={{ color: `${ACCENT}99` }}
          >
            <FileText size={14} />
            Read the White Paper
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
