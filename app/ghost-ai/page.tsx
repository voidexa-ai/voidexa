'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ACCENT = '#888888'

export default function GhostAIPage() {
  const [sent, setSent] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('sent=true')) setSent(true)
  }, [])

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
              method="POST"
              action="https://formsubmit.co/contact@voidexa.com"
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input type="hidden" name="_subject" value="Ghost AI — waitlist" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://voidexa.com/ghost-ai?sent=true" />
              <input
                type="email"
                name="email"
                required
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
                className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                style={{
                  background: `${ACCENT}18`,
                  border: `1px solid ${ACCENT}44`,
                  color: ACCENT,
                  padding: '12px 28px',
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                }}
              >
                Join the waitlist <ArrowRight size={15} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
