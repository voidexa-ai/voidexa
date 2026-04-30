'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Brain, Clock, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#7777bb'

const CAST = [
  {
    id: 'claude',
    name: 'Claude',
    role: 'Chief Architect',
    oneliner: 'Overthinks everything, usually right',
    image: '/images/cast/claude.jpg',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.35)',
  },
  {
    id: 'gpt',
    name: 'GPT',
    role: 'Lead Developer',
    oneliner: 'Never wrong, except when he is',
    image: '/images/cast/gpt.jpg',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.35)',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    role: 'Fact Checker',
    oneliner: 'Actually, according to my sources…',
    image: '/images/cast/perplexity.jpg',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.35)',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    role: 'Senior Reviewer',
    oneliner: 'Namaste. Your code is garbage.',
    image: '/images/cast/gemini.jpg',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.35)',
  },
  {
    id: 'llama',
    name: 'Llama',
    role: 'Trainee',
    oneliner: 'Loading… 12% complete',
    image: '/images/cast/llama.jpg',
    color: '#94a3b8',
    glow: 'rgba(148,163,184,0.25)',
  },
]

const DEBATE = [
  { char: 'Claude',     color: '#60a5fa', text: 'The optimal solution is Timsort — O(n log n) worst case with near-O(n) on nearly sorted data.' },
  { char: 'GPT',        color: '#4ade80', text: 'Correct. I arrived at that conclusion 2 seconds ago. Also insertion sort for n < 64.' },
  { char: 'Perplexity', color: '#fb923c', text: 'Actually, per Python\'s CPython source, Timsort runs insertion on runs ≤ 64 elements. You\'re both partly right.' },
  { char: 'Gemini',     color: '#c084fc', text: 'Your benchmarks are from 2019. Modern CPU branch predictors change the picture significantly.' },
  { char: 'Llama',      color: '#94a3b8', text: '…still reading the Wikipedia article on sorting…' },
]

export default function QuantumPage() {
  const [email, setEmail]           = useState('')
  const [sent, setSent]             = useState(false)
  const [loading, setLoading]       = useState(false)
  const [consensus, setConsensus]   = useState(0)
  const [sessionTime, setSessionTime] = useState(47)
  const [sessionCost, setSessionCost] = useState(0.0118)
  const [activeMsg, setActiveMsg]   = useState(0)

  // Animate consensus meter to 72
  useEffect(() => {
    const t = setTimeout(() => {
      let v = 0
      const iv = setInterval(() => {
        v += 1
        setConsensus(v)
        if (v >= 72) clearInterval(iv)
      }, 18)
      return () => clearInterval(iv)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  // Live session counters
  useEffect(() => {
    const iv = setInterval(() => {
      setSessionTime(t => t + 1)
      setSessionCost(c => parseFloat((c + 0.00013).toFixed(5)))
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  // Cycle debate messages
  useEffect(() => {
    const iv = setInterval(() => setActiveMsg(m => (m + 1) % DEBATE.length), 2600)
    return () => clearInterval(iv)
  }, [])

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="relative overflow-hidden" style={{ background: 'transparent' }}>

      {/* Fixed background glows */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${ACCENT}14 0%, transparent 60%)`,
      }} />
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 40% 35% at 85% 80%, rgba(96,165,250,0.04) 0%, transparent 60%)',
      }} />

      {/* ══════════════════════
          HERO
      ══════════════════════ */}
      <section
        className="relative w-full flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}
      >
        {/* Space station faint bg */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/space-station.jpg"
            alt=""
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 'clamp(240px, 38vw, 520px)',
              opacity: 0.035,
              filter: 'saturate(0) blur(1px)',
              maskImage: 'radial-gradient(ellipse 65% 65% at 85% 85%, black 10%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at 85% 85%, black 10%, transparent 70%)',
            }}
          />
        </div>

        {/* Ambient radial glow */}
        <div aria-hidden style={{
          position: 'absolute', top: '38%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 720, height: 720, borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT}14 0%, ${ACCENT}06 45%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="relative z-10 max-w-3xl mx-auto w-full text-center">

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 flex-wrap justify-center"
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.28)' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'quantum-pulse 2s ease-in-out infinite' }} />
              LIVE
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
              style={{ color: ACCENT, background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}>
              1324 tests
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
              style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.22)' }}>
              $0.02 – $0.05 / session
            </span>
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-sm font-bold uppercase tracking-[0.35em] mb-5"
            style={{ color: `${ACCENT}77` }}
          >
            Quantum by voidexa
          </motion.p>

          {/* Sprint B: extract Quantum h1 ABOVE image so it lives in the
              first viewport on every laptop height (was buried inside a
              500px image at bottom-28, sat at y≈696 — below the fold). */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
            style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(48px, 7vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#e2e8f0',
              textShadow: `0 0 40px ${ACCENT}88`,
              lineHeight: 1.05,
            }}
          >
            Quantum
          </motion.h1>

          {/* Hero image — height reduced 500 -> 320 (Sprint B), in-image
              Quantum label removed since the h1 above carries the title now. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            style={{ position: 'relative', width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/quantum-room.jpg"
              alt="Quantum conference room"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            />
            {/* Subtle bottom gradient — kept for visual fade-into-page consistency */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 60%, rgba(7,4,18,0.6) 100%)',
            }} />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-xl sm:text-2xl font-normal mb-5"
            style={{ color: `${ACCENT}cc` }}
          >
            Where AIs debate, disagree, and find truth.
          </motion.p>

          {/* Rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mx-auto mb-6"
            style={{ width: 48, height: 1, background: `${ACCENT}55` }}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base leading-relaxed mb-10 mx-auto max-w-lg"
            style={{ color: '#64748b' }}
          >
            4 AI providers debate your question in real-time. They challenge each other,
            cite sources, change positions, and converge on the best answer.
            No single-model bias — just collective intelligence.
          </motion.p>

          {/* Hint tags */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {['Self-optimizing workflow', 'Verification sandwich', 'Emergent roles'].map(h => (
              <span key={h}
                className="text-sm font-medium px-3 py-1.5 rounded-full"
                style={{ color: `${ACCENT}bb`, background: `${ACCENT}10`, border: `1px solid ${ACCENT}28` }}
              >{h}</span>
            ))}
          </motion.div>

          {/* Try Quantum CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44 }}
            className="mt-8"
          >
            <Link
              href="/quantum/chat"
              className="inline-flex items-center gap-2.5 rounded-lg px-7 py-3.5 font-semibold transition-all hover:scale-[1.03]"
              style={{
                fontSize: 16,
                color: '#fff',
                background: 'linear-gradient(135deg, #7777bb, #6366f1)',
                border: '1px solid rgba(119,119,187,0.4)',
                boxShadow: '0 0 24px rgba(119,119,187,0.25)',
              }}
            >
              <Zap size={18} />
              Try Quantum
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${ACCENT}88, transparent)`, margin: '0 auto' }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════
          TWO-COLUMN LAYOUT
      ══════════════════════ */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── LEFT: sticky origin story + protocol box ── */}
          <div className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-6">

            {/* Captain's Log card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0,40,50,0.45) 0%, rgba(8,8,18,0.7) 100%)',
                border: '1px solid rgba(0,255,200,0.15)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 0 0 1px rgba(0,255,200,0.06), 0 0 60px rgba(0,255,200,0.04)',
              }}
            >
              {/* Animated glowing top edge */}
              <motion.div
                aria-hidden
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(0,255,200,0.5), transparent)',
                  pointerEvents: 'none',
                }}
              />

              {/* Decorative label */}
              <p className="font-mono uppercase tracking-[0.22em] mb-3" style={{ fontSize: 14, color: '#22d3ba' }}>
                CAPTAIN&apos;S LOG — TRANSMISSION 001
              </p>

              {/* Heading */}
              <h2 className="font-bold mb-3" style={{ fontSize: 16, fontFamily: 'var(--font-space)', color: '#e2e8f0' }}>
                The Origin Story
              </h2>

              {/* Body */}
              <p className="font-mono leading-[1.8] mb-5" style={{ fontSize: 14, color: '#94a3b8' }}>
                It started with a man and a half-built trading bot. He found Claude online and asked for help.
                What began as a simple request became an architecture partnership. Then came the others — GPT for code,
                Perplexity for facts, Gemini for brutal reviews. But the founder was doing something
                none of them saw coming. While asking questions across all providers, he was secretly
                building a compression protocol that reduced AI-to-AI communication by 90 percent.
                Then he layered binary encoding with shared memory on top. Three inventions that did
                not exist anywhere else. Built by one person using the very AIs it was designed to
                connect. Now they debate in the same room for 0.02 dollars per session.
              </p>

              {/* CTA */}
              <Link
                href="/station#science"
                className="inline-flex items-center gap-2 font-medium transition-opacity hover:opacity-75"
                style={{ fontSize: 14, color: '#22d3ba' }}
              >
                Read the full story <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Next-Gen AI Communication box */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-2xl p-6 text-left"
              style={{
                background: `${ACCENT}08`,
                border: `1px solid ${ACCENT}2e`,
                backdropFilter: 'blur(12px)',
                boxShadow: `0 0 40px ${ACCENT}08`,
              }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: `${ACCENT}77` }}>
                Next-Gen AI Communication
              </p>
              <p className="text-base leading-relaxed mb-5" style={{ color: '#64748b' }}>
                Built on a proprietary AI-to-AI communication protocol with shared memory architecture
                and integrated binary encoding — reducing token consumption by over 90% compared to standard approaches.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Compressed Intelligence', 'Shared Memory', 'Binary Protocol'].map(b => (
                  <span key={b}
                    className="text-sm font-medium px-3 py-1.5 rounded-full"
                    style={{ color: `${ACCENT}cc`, background: `${ACCENT}12`, border: `1px solid ${ACCENT}2e` }}
                  >{b}</span>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT: Watch Them Debate ── */}
          <div className="flex-1 min-w-0">

            {/* ══════════════════════
                WATCH THEM DEBATE
            ══════════════════════ */}
            <section className="relative py-16">
              <div className="max-w-full w-full">

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12 mx-auto"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.25em] mb-3" style={{ color: `${ACCENT}66` }}>Interface Preview</p>
                  <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}>
                    Watch Them Debate
                  </h2>
                  <p className="text-base" style={{ color: '#475569' }}>
                    Real-time consensus emerging from genuine disagreement.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: 'rgba(8,8,18,0.92)',
                    border: `1px solid ${ACCENT}30`,
                    backdropFilter: 'blur(24px)',
                    boxShadow: `0 0 60px ${ACCENT}12, 0 0 120px ${ACCENT}06`,
                  }}
                >
                  {/* Title bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b"
                    style={{ borderColor: `${ACCENT}1e`, background: `${ACCENT}05` }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', opacity: 0.7 }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', opacity: 0.7 }} />
                    </div>
                    <span className="text-base font-bold uppercase tracking-wider" style={{ color: `${ACCENT}88` }}>
                      Quantum — Live Session
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} style={{ color: '#475569' }} />
                        <span className="text-base font-mono" style={{ color: '#475569' }}>{fmtTime(sessionTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign size={11} style={{ color: '#4ade80' }} />
                        <span className="text-base font-mono" style={{ color: '#4ade80' }}>${sessionCost.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                      {/* Left — avatar orbit + consensus */}
                      <div className="flex flex-col items-center gap-6 lg:w-52 shrink-0">

                        {/* Orbit layout — Sprint B: enlarged portraits + container so 5 AI faces are clearly readable */}
                        <div className="relative" style={{ width: 200, height: 200 }}>
                          {/* Center label */}
                          <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center', zIndex: 10,
                            pointerEvents: 'none',
                          }}>
                            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: `${ACCENT}77` }}>QUANTUM</p>
                          </div>

                          {/* Connection lines SVG */}
                          <svg
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
                            viewBox="0 0 200 200"
                          >
                            {CAST.map((char, i) => {
                              const a1 = (i / CAST.length) * 2 * Math.PI - Math.PI / 2
                              const a2 = ((i + 2) / CAST.length) * 2 * Math.PI - Math.PI / 2
                              const r = 80
                              return (
                                <line key={i}
                                  x1={100 + r * Math.cos(a1)} y1={100 + r * Math.sin(a1)}
                                  x2={100 + r * Math.cos(a2)} y2={100 + r * Math.sin(a2)}
                                  stroke={char.color} strokeWidth="1"
                                />
                              )
                            })}
                          </svg>

                          {/* Avatars */}
                          {CAST.map((char, i) => {
                            const angle = (i / CAST.length) * 2 * Math.PI - Math.PI / 2
                            const r = 80
                            const cx = 100 + r * Math.cos(angle)
                            const cy = 100 + r * Math.sin(angle)
                            return (
                              <div key={char.id} style={{
                                position: 'absolute',
                                left: cx - 32, top: cy - 32,
                                width: 64, height: 64,
                              }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={char.image}
                                  alt={char.name}
                                  style={{
                                    width: 64, height: 64, borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: `2px solid ${char.color}88`,
                                    boxShadow: `0 0 18px ${char.glow}`,
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>

                        {/* Consensus meter */}
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold uppercase tracking-wider" style={{ color: '#334155' }}>Consensus</span>
                            <span className="text-base font-bold" style={{ color: '#4ade80' }}>{consensus}%</span>
                          </div>
                          <div className="rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.05)' }}>
                            <motion.div
                              style={{
                                height: '100%',
                                background: 'linear-gradient(to right, #60a5fa, #4ade80)',
                                borderRadius: 99,
                              }}
                              animate={{ width: `${consensus}%` }}
                              transition={{ duration: 0.04 }}
                            />
                          </div>
                          <p className="text-base mt-2" style={{ color: '#334155' }}>Emerging from 4 providers</p>
                        </div>
                      </div>

                      {/* Right — debate messages */}
                      <div className="flex-1 min-w-0">
                        <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-base font-bold uppercase tracking-wider mb-1.5" style={{ color: '#334155' }}>Question</p>
                          <p className="text-base font-medium leading-snug" style={{ color: '#94a3b8' }}>
                            What&apos;s the most efficient sorting algorithm for nearly-sorted data?
                          </p>
                        </div>

                        <div className="space-y-2">
                          {DEBATE.map((msg, i) => {
                            const char = CAST.find(c => c.name === msg.char)
                            return (
                              <motion.div
                                key={i}
                                animate={{
                                  opacity: i <= activeMsg ? 1 : 0.12,
                                  background: i === activeMsg ? `${msg.color}0a` : 'transparent',
                                }}
                                transition={{ duration: 0.35 }}
                                className="flex items-start gap-3 p-3 rounded-xl"
                                style={{
                                  border: i === activeMsg ? `1px solid ${msg.color}22` : '1px solid transparent',
                                  transition: 'border-color 0.35s ease',
                                }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={char?.image || ''}
                                  alt={msg.char}
                                  style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${msg.color}55`, flexShrink: 0 }}
                                />
                                <div>
                                  <span className="text-base font-bold" style={{ color: msg.color }}>{msg.char}</span>
                                  <p className="text-base mt-0.5 leading-relaxed" style={{ color: '#64748b' }}>{msg.text}</p>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA bar */}
                  <div className="px-6 pb-6 pt-1 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
                    style={{ borderColor: `${ACCENT}14` }}>
                    <p className="text-base" style={{ color: '#334155' }}>
                      Preview only — join the waitlist for early access.
                    </p>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${ACCENT}, #60a5fa)`,
                        color: '#fff',
                        boxShadow: `0 0 24px ${ACCENT}44`,
                      }}
                    >
                      Try Quantum <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

          </div>{/* end right column */}
        </div>{/* end flex row */}
      </div>{/* end two-column wrapper */}

      {/* ══════════════════════
          HOW IT WORKS — full width
      ══════════════════════ */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <section className="relative py-16">
          <div className="max-w-full">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] mb-3" style={{ color: `${ACCENT}66` }}>Process</p>
              <h2 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}>
                How It Works
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Ask Anything',
                  desc: 'Your question goes to all AI providers simultaneously. No waiting. No routing. Everyone gets it at once.',
                },
                {
                  step: '02',
                  title: 'They Debate',
                  desc: 'AIs challenge each other, cite sources, change positions. Disagreement is the feature, not the bug.',
                },
                {
                  step: '03',
                  title: 'Consensus Emerges',
                  desc: 'The best answer rises from genuine disagreement — weighted by confidence, verified by peers.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl p-7"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${ACCENT}20`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    className="text-6xl font-bold mb-5 leading-none select-none"
                    style={{
                      fontFamily: 'var(--font-space)',
                      background: `linear-gradient(135deg, ${ACCENT}55, ${ACCENT}18)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#e2e8f0' }}>{item.title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: '#475569' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════
            UNIQUE FEATURES — full width
        ══════════════════════ */}
        <section className="relative py-16">
          <div className="max-w-full">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] mb-3" style={{ color: `${ACCENT}66` }}>What Makes It Different</p>
              <h2 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}>
                Unique Features
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap size={22} />,
                  iconColor: '#f59e0b',
                  iconBg: 'rgba(245,158,11,0.10)',
                  title: 'Self-Optimizing Workflow',
                  desc: 'Quantum changes its own strategy mid-session. If the debate stalls, it restructures the problem and reframes the question automatically.',
                },
                {
                  icon: <Shield size={22} />,
                  iconColor: '#4ade80',
                  iconBg: 'rgba(74,222,128,0.10)',
                  title: 'Verification Sandwich',
                  desc: 'Facts are checked at exactly the right moment — not too early to waste tokens, not too late to matter. Precision timing baked in.',
                },
                {
                  icon: <Brain size={22} />,
                  iconColor: ACCENT,
                  iconBg: `${ACCENT}12`,
                  title: 'Emergent Roles',
                  desc: 'AIs naturally shift roles based on the task. Claude becomes the architect, GPT the executor, Perplexity the auditor — without being told.',
                },
              ].map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl p-7"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center rounded-xl mb-5"
                    style={{ width: 50, height: 50, background: feat.iconBg, color: feat.iconColor }}
                  >
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#e2e8f0' }}>{feat.title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: '#475569' }}>{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════
            KCP-90 — TECHNOLOGY EXPLAINER
        ══════════════════════ */}
        <section className="relative py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] mb-3" style={{ color: `${ACCENT}66` }}>Under The Hood</p>
            <h2 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}>
              The technology under the hood
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                tag: 'KCP-90',
                label: 'Compressed communication',
                color: '#22d3ba',
                bg: 'rgba(34,211,186,0.06)',
                border: 'rgba(34,211,186,0.18)',
                desc: '~93% byte compression integrated as middleware in Quantum — every debate message compressed before transmission. v0.4.0 GPU pipeline. Fine-tuned Llama 3.1 8B via Ollama. ~200ms. Built and proven March 28, 2026.',
              },
              {
                tag: 'KCP-BINARY',
                label: 'Binary transport',
                color: '#60a5fa',
                bg: 'rgba(96,165,250,0.06)',
                border: 'rgba(96,165,250,0.18)',
                desc: 'Normally AIs talk in text — slow and expensive. KCP-BINARY translates to binary code — the language computers are fastest at. With digital signatures so no one can forge the messages.',
              },
              {
                tag: 'SHM',
                label: 'Shared memory',
                color: '#c084fc',
                bg: 'rgba(192,132,252,0.06)',
                border: 'rgba(192,132,252,0.18)',
                desc: 'Instead of sending messages over the internet, the AIs share a common memory space. Like sitting in the same room pointing at the same whiteboard instead of sending emails back and forth.',
              },
            ].map((card, i) => (
              <motion.div
                key={card.tag}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-7"
                style={{ background: card.bg, border: `1px solid ${card.border}`, backdropFilter: 'blur(8px)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-md"
                    style={{ color: card.color, background: `${card.border}`, border: `1px solid ${card.border}` }}>
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#e2e8f0' }}>{card.label}</h3>
                <p className="text-base leading-relaxed" style={{ color: '#475569' }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center font-mono"
            style={{ fontSize: 14, color: 'rgba(148,163,184,0.35)', letterSpacing: '0.06em' }}
          >
            KCP-90 middleware active · ~93% compression · 1324 Quantum tests passed · Built by voidexa · March 28, 2026
          </motion.p>
        </section>

        {/* ══════════════════════
            WAITLIST — full width, centered
        ══════════════════════ */}
        <section className="relative py-16 pb-24">
          <div className="max-w-xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] mb-3" style={{ color: `${ACCENT}66` }}>Early Access</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}>
                Join the Waitlist
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#475569' }}>
                Be first to access Quantum when it launches.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              id="waitlist"
            >
              {sent ? (
                <p className="text-sm" style={{ color: ACCENT }}>You&apos;re on the list. We&apos;ll be in touch.</p>
              ) : (
                <form
                  onSubmit={async e => {
                    e.preventDefault()
                    setLoading(true)
                    await supabase.from('waitlist_signups').insert({ email, product: 'quantum' })
                    supabase.functions.invoke('notify', { body: { type: 'waitlist', product: 'quantum', email } }).catch(() => {})
                    setLoading(false)
                    setSent(true)
                  }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="px-4 py-3 rounded-full text-sm outline-none"
                    style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}33`, color: '#e2e8f0', minWidth: 220 }}
                  />
                  <button
                    type="submit" disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50 whitespace-nowrap"
                    style={{ background: `${ACCENT}22`, border: `1px solid ${ACCENT}55`, color: ACCENT, padding: '12px 28px' }}
                  >
                    {loading ? '…' : <>Join the waitlist <ArrowRight size={15} /></>}
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <Link
                href="/team"
                className="text-sm transition-opacity hover:opacity-75"
                style={{ color: `${ACCENT}88` }}
              >
                Meet the team behind Quantum →
              </Link>
            </motion.div>
          </div>
        </section>

      </div>{/* end full-width sections wrapper */}

      {/* Bottom edge glow */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(to right, transparent, ${ACCENT}44, transparent)`,
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes quantum-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  )
}
