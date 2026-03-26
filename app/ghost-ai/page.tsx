'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink, FileText, Send, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const GHAI_CONTRACT = 'Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK'

const EARN_REWARDS = [
  { action: 'Create account',          reward: '50 GHAI',       desc: 'Welcome bonus for new members' },
  { action: 'Connect wallet',          reward: '25 GHAI',       desc: 'Verify your Solana wallet' },
  { action: 'Refer a friend',          reward: '100 GHAI each', desc: 'Both you and your friend earn' },
  { action: 'Upload a trading bot',    reward: '500 GHAI',      desc: 'Share your strategy on Trading Hub' },
  { action: 'Win monthly competition', reward: '10,000 GHAI',   desc: 'Top ranked bot of the month' },
]

interface PriceData {
  priceUsd: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

// Ghost AI SVG watermark — ghost silhouette with embedded circuit lines
function GhostWatermark() {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    >
      <defs>
        <radialGradient id="ghostGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.7" />
          <stop offset="55%"  stopColor="#06b6d4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ghost body */}
      <path
        d="M200 40 C120 40 70 100 70 175 L70 390 L100 360 L130 390 L160 360 L190 390 L220 360 L250 390 L280 360 L310 390 L330 390 L330 175 C330 100 280 40 200 40Z"
        fill="url(#ghostGrad)"
        fillOpacity="0.85"
      />

      {/* Circuit lines inside ghost — horizontal */}
      <line x1="110" y1="200" x2="290" y2="200" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="120" y1="230" x2="280" y2="230" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="130" y1="260" x2="270" y2="260" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.35" />
      <line x1="140" y1="290" x2="260" y2="290" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="150" y1="320" x2="250" y2="320" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.25" />

      {/* Circuit nodes */}
      <circle cx="155" cy="200" r="3" fill="#00d4ff" fillOpacity="0.7" />
      <circle cx="200" cy="200" r="3" fill="#8b5cf6" fillOpacity="0.7" />
      <circle cx="245" cy="200" r="3" fill="#00d4ff" fillOpacity="0.7" />
      <circle cx="165" cy="230" r="2.5" fill="#8b5cf6" fillOpacity="0.6" />
      <circle cx="235" cy="230" r="2.5" fill="#8b5cf6" fillOpacity="0.6" />
      <circle cx="200" cy="260" r="3" fill="#00d4ff" fillOpacity="0.6" />

      {/* Vertical connectors */}
      <line x1="155" y1="200" x2="155" y2="230" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="245" y1="200" x2="245" y2="230" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="200" y1="200" x2="200" y2="260" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="165" y1="230" x2="165" y2="260" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.35" />
      <line x1="235" y1="230" x2="235" y2="260" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.35" />

      {/* Eyes */}
      <ellipse cx="165" cy="155" rx="18" ry="22" fill="#00d4ff" fillOpacity="0.15" />
      <ellipse cx="235" cy="155" rx="18" ry="22" fill="#00d4ff" fillOpacity="0.15" />
      <ellipse cx="165" cy="155" rx="9" ry="11" fill="#00d4ff" fillOpacity="0.5" />
      <ellipse cx="235" cy="155" rx="9" ry="11" fill="#00d4ff" fillOpacity="0.5" />
      {/* Eye glow rings */}
      <ellipse cx="165" cy="155" rx="22" ry="26" fill="none" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.3" />
      <ellipse cx="235" cy="155" rx="22" ry="26" fill="none" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.3" />

      {/* Outer glow rim */}
      <path
        d="M200 35 C115 35 65 98 65 175 L65 395 L97 363 L130 395 L160 363 L190 395 L220 363 L250 395 L280 363 L310 395 L335 395 L335 175 C335 98 285 35 200 35Z"
        fill="none"
        stroke="url(#ghostGrad)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
    </svg>
  )
}

export default function GhostAIPage() {
  const [email, setEmail]       = useState('')
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [price, setPrice]       = useState<PriceData | null>(null)
  const [priceLoading, setPriceLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ghai/price')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.priceUsd) setPrice(d) })
      .catch(() => {})
      .finally(() => setPriceLoading(false))
  }, [])

  const priceUp = (price?.priceChange24h ?? 0) >= 0

  return (
    <div className="relative overflow-hidden" style={{ background: '#07070d' }}>

      {/* ── BACKGROUND LAYERS ── */}
      {/* Deep space radial */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 60%)',
      }} />
      {/* Cyan accent glow */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 50% 40% at 80% 80%, rgba(6,182,212,0.05) 0%, transparent 60%)',
      }} />

      {/* ══════════════════════════════════════════
          HERO — full viewport
      ══════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: '100vh', paddingTop: 80 }}
      >
        {/* GHOST WATERMARK — absolutely positioned behind text */}
        <div aria-hidden style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -54%)',
          width: 'min(70vw, 520px)',
          height: 'min(90vh, 650px)',
          opacity: 0.07,
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(0.5px)',
        }}>
          <GhostWatermark />
        </div>

        {/* GHAI LOGO IMAGE WATERMARK — ghost face lurking behind text */}
        {/* Cyan glow behind the image to make the blue eyes pop */}
        <div aria-hidden style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -52%)',
          width: 'min(80vw, 720px)',
          height: 'min(80vw, 720px)',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,182,212,0.18) 0%, rgba(139,92,246,0.10) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <div aria-hidden style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -52%)',
          width: 'min(80vw, 720px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/GHAI.jpg"
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              opacity: 0.42,
              filter: 'brightness(1.0) saturate(1.3) contrast(1.05)',
              maskImage: 'radial-gradient(ellipse 70% 65% at 50% 48%, black 45%, rgba(0,0,0,0.5) 62%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 48%, black 45%, rgba(0,0,0,0.5) 62%, transparent 78%)',
            }}
          />
        </div>

        {/* Glow behind watermark */}
        <div aria-hidden style={{
          position: 'absolute',
          top: '38%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* HERO TEXT — above watermark */}
        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-10 flex-wrap justify-center"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
              style={{ color: '#888', background: 'rgba(136,136,136,0.1)', border: '1px solid rgba(136,136,136,0.25)' }}>
              Coming Soon
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
              style={{ color: '#ccaa44', background: 'rgba(204,170,68,0.1)', border: '1px solid rgba(204,170,68,0.3)' }}>
              Powered by GHAI Token
            </span>
          </motion.div>

          {/* GHOST AI label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-xs font-bold uppercase tracking-[0.35em] mb-5"
            style={{ color: 'rgba(139,92,246,0.6)', letterSpacing: '0.35em' }}
          >
            Ghost AI
          </motion.p>

          {/* GHAI — giant gradient text with pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6"
          >
            <motion.h1
              animate={{ textShadow: [
                '0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(6,182,212,0.2)',
                '0 0 60px rgba(139,92,246,0.7), 0 0 120px rgba(6,182,212,0.35)',
                '0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(6,182,212,0.2)',
              ]}}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: 'clamp(80px, 16vw, 160px)',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #00d4ff 50%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              GHAI
            </motion.h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base font-medium mb-3 uppercase tracking-widest"
            style={{ color: 'rgba(148,163,184,0.7)', letterSpacing: '0.18em' }}
          >
            AI-Powered Token · Zero Friction · Instant Access
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="text-lg mb-12 max-w-xl mx-auto"
            style={{ color: '#475569' }}
          >
            The utility token powering the voidexa ecosystem
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-14"
          >
            <a
              href={`https://raydium.io/swap/?inputMint=sol&outputMint=${GHAI_CONTRACT}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: '#fff',
                boxShadow: '0 0 30px rgba(139,92,246,0.35)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(139,92,246,0.6)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(139,92,246,0.35)'}
            >
              Buy on Raydium <ArrowRight size={15} />
            </a>

            <a
              href="/void-chat"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.4)',
                color: '#c4b5fd',
                boxShadow: '0 0 20px rgba(139,92,246,0.1)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.22)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(139,92,246,0.25)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.12)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(139,92,246,0.1)' }}
            >
              Try Void Chat — Multi-AI Chat →
            </a>

            <Link
              href="/whitepaper"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
            >
              <FileText size={14} /> White Paper
            </Link>

            <a
              href="https://t.me/GhostAI_voidexa"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.25)', color: '#38bdf8' }}
            >
              <ExternalLink size={14} /> Telegram
            </a>
          </motion.div>

          {/* Waitlist */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {sent ? (
              <p className="text-sm" style={{ color: '#8b5cf6' }}>You&apos;re on the list. We&apos;ll be in touch.</p>
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
                className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
              >
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
                  style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', color: '#e2e8f0' }}
                />
                <button
                  type="submit" disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50 whitespace-nowrap"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd' }}
                >
                  {loading ? '…' : <><Send size={13} /> Join waitlist</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)', margin: '0 auto' }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          LIVE PRICE + TOKEN INFO
      ══════════════════════════════════════════ */}
      <section id="token-info" className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-20">

        {/* Live price card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-2xl p-6"
          style={{
            background: 'rgba(139,92,246,0.05)',
            border: '1px solid rgba(139,92,246,0.2)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 40px rgba(139,92,246,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: '#fff',
              }}>G</div>
              <div>
                <p className="text-sm font-bold text-white">GHAI</p>
                <p className="text-[11px]" style={{ color: '#475569' }}>Ghost AI Token · Solana</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
              Live
            </span>
          </div>

          {priceLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-gray-800 rounded w-40" />
              <div className="h-4 bg-gray-800 rounded w-24" />
            </div>
          ) : price ? (
            <>
              <div className="flex items-end gap-4 mb-4">
                <p className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-space)' }}>
                  ${price.priceUsd.toFixed(8)}
                </p>
                <div className="flex items-center gap-1 mb-1" style={{ color: priceUp ? '#22c55e' : '#ef4444' }}>
                  {priceUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-sm font-semibold">
                    {priceUp ? '+' : ''}{price.priceChange24h.toFixed(2)}%
                  </span>
                  <span className="text-xs" style={{ color: '#475569' }}>24h</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Volume 24h',  value: formatCompact(price.volume24h) },
                  { label: 'Liquidity',   value: formatCompact(price.liquidity) },
                  { label: 'Market Cap',  value: formatCompact(price.marketCap) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#334155' }}>{label}</p>
                    <p className="text-sm font-semibold text-gray-300">{value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm" style={{ color: '#475569' }}>Price data unavailable</p>
          )}
        </motion.div>

        {/* Contract address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-5 mb-6"
          style={{
            background: 'rgba(204,170,68,0.04)',
            border: '1px solid rgba(204,170,68,0.18)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 24px rgba(204,170,68,0.04)',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>
            Contract Address · Solana
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <code className="text-sm font-mono break-all" style={{ color: '#ccaa44' }}>{GHAI_CONTRACT}</code>
            <a
              href={`https://solscan.io/token/${GHAI_CONTRACT}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-80 shrink-0"
              style={{ color: '#ccaa44' }}
            >
              Solscan <ExternalLink size={11} />
            </a>
          </div>
        </motion.div>

        {/* Token stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          {[
            { label: 'Chain',   value: 'Solana',          accent: '#9945ff' },
            { label: 'Supply',  value: '700M circulating', accent: '#00d4ff' },
            { label: 'Mint',    value: 'Revoked ✓',       accent: '#22c55e' },
            { label: 'Freeze',  value: 'Revoked ✓',       accent: '#22c55e' },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className="rounded-xl p-4 text-center"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${accent}22`,
                backdropFilter: 'blur(4px)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#334155' }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: accent }}>{value}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          EARN GHAI
      ══════════════════════════════════════════ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(139,92,246,0.5)' }}>Rewards</p>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}>
              Coming Soon
            </span>
          </div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}>
            Earn GHAI
          </h2>
        </motion.div>

        <div className="space-y-2">
          {EARN_REWARDS.map(({ action, reward, desc }, i) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#cbd5e1' }}>{action}</p>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{desc}</p>
              </div>
              <span className="text-sm font-bold shrink-0" style={{ color: '#ccaa44' }}>{reward}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VOID CHAT CTA
      ══════════════════════════════════════════ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-10 text-center relative overflow-hidden"
          style={{
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.25)',
            boxShadow: '0 0 60px rgba(139,92,246,0.1)',
          }}
        >
          {/* Background glow */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)',
          }} />

          <p className="relative text-xs font-bold uppercase tracking-[0.25em] mb-4" style={{ color: '#7c3aed' }}>
            Powered by GHAI
          </p>
          <h3 className="relative text-3xl font-bold mb-3 text-white" style={{ fontFamily: 'var(--font-space)' }}>
            Try Void Chat
          </h3>
          <p className="relative text-base mb-8 max-w-md mx-auto" style={{ color: '#64748b' }}>
            Claude, GPT-4o, and Gemini — one interface, one token, no subscriptions.
          </p>
          <a
            href="/void-chat"
            className="relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: '#fff',
              boxShadow: '0 0 30px rgba(139,92,246,0.4)',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(139,92,246,0.65)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(139,92,246,0.4)'}
          >
            Open Void Chat — Multi-AI Chat <ArrowRight size={15} />
          </a>
        </motion.div>
      </section>

      {/* Bottom glow edge */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.3), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
