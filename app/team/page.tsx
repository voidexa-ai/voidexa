'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const CAST = [
  {
    id: 'jix',
    name: 'Jix',
    role: 'CEO',
    oneliner: '47 ideas per minute, remembers 3',
    image: '/images/cast/jix.jpg',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
  },
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

export default function TeamPage() {
  return (
    <div className="relative" style={{ background: 'transparent', minHeight: '100vh' }}>

      {/* ── Hero: group photo ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 600 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/cast/gruppe billede.jpg"
          alt="The Quantum Team"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 15%',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(7,7,13,1) 0%, rgba(7,7,13,0.5) 60%, rgba(7,7,13,0.15) 100%)',
        }} />

        <div
          className="relative flex flex-col items-center justify-end text-center px-6"
          style={{ minHeight: 600, paddingBottom: 48, paddingTop: 140 }}
        >
          {/* spacer — keep text low so faces stay clear */}
          <div style={{ flex: 1 }} />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            style={{
              fontFamily: 'var(--font-space)',
              fontSize: 'clamp(36px, 7vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#e2e8f0',
              marginBottom: '0.3em',
            }}
          >
            The team behind the code
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ fontSize: 18, color: 'rgba(148,163,184,0.8)', maxWidth: 480 }}
          >
            Six personalities. One goal. Endless disagreement.
          </motion.p>
        </div>
      </div>

      {/* ── Character cards ── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono uppercase tracking-[0.28em] mb-10 text-center" style={{ fontSize: 13, color: 'rgba(119,119,187,0.65)' }}>
            The Cast
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CAST.map((char, i) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col items-center text-center p-5 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-5px)'
                  el.style.boxShadow = `0 0 36px ${char.glow}`
                  el.style.background = char.glow.replace('0.35)', '0.06)').replace('0.25)', '0.04)')
                  el.style.borderColor = `${char.color}44`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                  el.style.background = 'rgba(255,255,255,0.02)'
                  el.style.borderColor = 'rgba(255,255,255,0.06)'
                }}
              >
                <div className="relative mb-4" style={{ width: 100, height: 100 }}>
                  <div style={{
                    position: 'absolute', inset: -2, borderRadius: '50%',
                    background: `conic-gradient(${char.color}70, transparent 60%, ${char.color}70)`,
                    opacity: 0.65,
                  }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={char.image}
                    alt={char.name}
                    style={{
                      width: 100, height: 100, borderRadius: '50%',
                      objectFit: 'cover', objectPosition: 'center top',
                      border: `2px solid ${char.color}55`,
                      position: 'relative', display: 'block',
                    }}
                  />
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: char.color, marginBottom: 2 }}>{char.name}</p>
                <p style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: 10 }}>{char.role}</p>
                <p style={{ fontSize: 14, lineHeight: 1.45, fontStyle: 'italic', color: '#334155' }}>
                  &ldquo;{char.oneliner}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Links ── */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link
            href="/quantum"
            className="inline-flex items-center gap-2 font-semibold rounded-full transition-all hover:opacity-85"
            style={{
              fontSize: 15, padding: '11px 26px',
              background: 'rgba(119,119,187,0.15)',
              border: '1px solid rgba(119,119,187,0.35)',
              color: '#a5b4fc',
            }}
          >
            See them in action on Quantum <ArrowRight size={15} />
          </Link>
          <Link
            href="/station"
            className="inline-flex items-center gap-2 font-semibold rounded-full transition-all hover:opacity-85"
            style={{
              fontSize: 15, padding: '11px 26px',
              background: 'rgba(68,170,204,0.10)',
              border: '1px solid rgba(68,170,204,0.28)',
              color: '#7dd3fc',
            }}
          >
            Full roadmap at the Station <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  )
}
