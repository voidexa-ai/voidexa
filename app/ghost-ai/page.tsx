'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, FileText, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#888888'
const GHAI_CONTRACT = 'Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK'

const EARN_REWARDS = [
  { action: 'Create account',          reward: '50 GHAI',      desc: 'Welcome bonus for new members' },
  { action: 'Connect wallet',          reward: '25 GHAI',      desc: 'Verify your Solana wallet' },
  { action: 'Refer a friend',          reward: '100 GHAI each', desc: 'Both you and your friend earn' },
  { action: 'Upload a trading bot',    reward: '500 GHAI',     desc: 'Share your strategy on Trading Hub' },
  { action: 'Win monthly competition', reward: '10,000 GHAI',  desc: 'Top ranked bot of the month' },
]

export default function GhostAIPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#07070d' }}>
      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 65% 45% at 50% 30%, ${ACCENT}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── HERO ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-40 pb-24 text-center">
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
            style={{ color: '#ccaa44', background: 'rgba(204,170,68,0.12)', border: '1px solid rgba(204,170,68,0.3)' }}
          >
            Powered by GHAI Token
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
          style={{ color: `${ACCENT}77` }}
        >
          Ghost AI
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl sm:text-7xl font-bold mb-5 leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0', textShadow: `0 0 60px ${ACCENT}28` }}
        >
          Ghost AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-xl sm:text-2xl font-light mb-8"
          style={{ color: `${ACCENT}bb` }}
        >
          Fast AI. No friction. Powered by Ghost AI Token.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mx-auto mb-8"
          style={{ width: 40, height: 1, background: `${ACCENT}44` }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base leading-relaxed mb-12 mx-auto max-w-lg"
          style={{ color: '#64748b' }}
        >
          Instant answers from the world&apos;s best AI models. One interface. One token. No subscriptions.
        </motion.p>

        {/* Waitlist form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
        >
          {sent ? (
            <p className="text-sm" style={{ color: ACCENT }}>You&apos;re on the list. We&apos;ll be in touch.</p>
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
                style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}33`, color: '#e2e8f0', minWidth: 220 }}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44`, color: ACCENT, padding: '12px 28px', whiteSpace: 'nowrap' }}
              >
                {loading ? '…' : <><Send size={13} /> Join the waitlist</>}
              </button>
            </form>
          )}
        </motion.div>

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

      {/* ── TOKEN INFO ── */}
      <section id="token-info" className="relative z-10 max-w-3xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] mb-3" style={{ color: `${ACCENT}66` }}>Token</p>
          <h2 className="text-3xl font-bold text-[#e2e8f0] mb-8" style={{ fontFamily: 'var(--font-space)' }}>
            Ghost AI Token <span style={{ color: '#ccaa44' }}>(GHAI)</span>
          </h2>

          {/* Contract address */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: 'rgba(204,170,68,0.04)', border: '1px solid rgba(204,170,68,0.15)' }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>Contract Address</p>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="text-sm font-mono break-all" style={{ color: '#ccaa44' }}>{GHAI_CONTRACT}</code>
              <a
                href={`https://solscan.io/token/${GHAI_CONTRACT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80 shrink-0"
                style={{ color: '#ccaa44' }}
              >
                Solscan <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Token stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Chain',   value: 'Solana' },
              { label: 'Supply',  value: '1B (300M burned)' },
              { label: 'Mint',    value: 'Revoked' },
              { label: 'Freeze',  value: 'Revoked' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#334155' }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://raydium.io/swap/?inputMint=sol&outputMint=${GHAI_CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'rgba(204,170,68,0.12)', border: '1px solid rgba(204,170,68,0.3)', color: '#ccaa44' }}
            >
              Buy on Raydium <ArrowRight size={14} />
            </a>
            <Link
              href="/whitepaper"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
            >
              <FileText size={14} /> Read White Paper
            </Link>
            <a
              href="https://t.me/GhostAI_voidexa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.25)', color: '#0088cc' }}
            >
              Join Telegram <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── EARN GHAI ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: `${ACCENT}66` }}>Rewards</p>
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}
            >
              Coming Soon
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#e2e8f0] mb-8" style={{ fontFamily: 'var(--font-space)' }}>
            Earn GHAI
          </h2>

          <div className="space-y-2">
            {EARN_REWARDS.map(({ action, reward, desc }, i) => (
              <motion.div
                key={action}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div>
                  <p className="text-sm font-medium text-[#cbd5e1]">{action}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{desc}</p>
                </div>
                <span
                  className="text-sm font-bold shrink-0"
                  style={{ color: '#ccaa44' }}
                >
                  {reward}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── VOID CHAT CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-8 text-center"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#7c3aed', letterSpacing: '0.15em' }}>
            Powered by GHAI
          </p>
          <h3 className="text-2xl font-bold mb-3 text-white">Try Void Chat</h3>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>
            Access Claude, GPT-4o, and Gemini in one place — pay with GHAI tokens.
          </p>
          <a
            href="/void-chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff' }}
          >
            Open Void Chat →
          </a>
        </motion.div>
      </section>
    </div>
  )
}
