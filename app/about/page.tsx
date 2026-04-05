'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const beliefs = [
  { text: 'Privacy is architecture, not policy' },
  { text: 'AI should work for you — not the other way around' },
  { text: "If it touches a third-party server, it's not secure" },
  { text: 'European sovereignty by design' },
]

const differentiators = [
  {
    title: 'Compressed Intelligence',
    desc: "Our AI systems communicate in ways that use 95% fewer resources than industry standard. We didn't optimize the pipeline — we reinvented the language.",
  },
  {
    title: 'Persistent Memory',
    desc: "Every interaction builds on the last. Our systems don't forget — they compound knowledge over time.",
  },
  {
    title: 'Collective Verification',
    desc: "One AI gives you an opinion. Our systems give you verified consensus — through methods nobody else has built.",
  },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(0,212,255,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-36 pb-32">

        {/* ── Hero ── */}
        <motion.div {...fade()} className="mb-24">
          <p
            className="text-sm font-medium uppercase tracking-[0.18em] mb-5"
            style={{ color: 'rgba(0,212,255,0.55)' }}
          >
            About
          </p>
          <h1
            className="text-6xl sm:text-7xl font-bold leading-none tracking-tight mb-0"
            style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}
          >
            Born from{' '}
            <span className="gradient-text">the void.</span>
          </h1>
        </motion.div>

        {/* ── Section 1: Why we exist ── */}
        <motion.section {...fade(0.05)} className="mb-20">
          <h2
            className="text-sm font-semibold uppercase tracking-[0.14em] mb-6"
            style={{ color: 'rgba(0,212,255,0.6)' }}
          >
            Why we exist
          </h2>
          <p
            className="text-xl leading-relaxed"
            style={{ color: '#8899af', fontFamily: 'var(--font-space)' }}
          >
            In 2025, Denmark directed companies to exit American cloud services. Copenhagen and
            Aarhus ended Microsoft dependencies. voidexa builds for this moment — sovereign AI
            infrastructure, designed in Denmark.
          </p>
        </motion.section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 80 }} />

        {/* ── Section 2: What we believe ── */}
        <motion.section {...fade(0.05)} className="mb-20">
          <h2
            className="text-sm font-semibold uppercase tracking-[0.14em] mb-8"
            style={{ color: 'rgba(0,212,255,0.6)' }}
          >
            What we believe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {beliefs.map(({ text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                style={{
                  padding: '20px 24px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(0,212,255,0.08)',
                }}
              >
                <p className="text-base font-medium" style={{ color: '#c8d5e3', lineHeight: 1.5 }}>
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 80 }} />

        {/* ── Section 3: What makes us different ── */}
        <motion.section {...fade(0.05)} className="mb-20">
          <h2
            className="text-sm font-semibold uppercase tracking-[0.14em] mb-8"
            style={{ color: 'rgba(0,212,255,0.6)' }}
          >
            What makes us different
          </h2>
          <div className="flex flex-col gap-5">
            {differentiators.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                style={{
                  padding: '28px 32px',
                  borderRadius: 14,
                  background: 'rgba(0,212,255,0.025)',
                  border: '1px solid rgba(0,212,255,0.1)',
                  borderLeft: '2px solid rgba(0,212,255,0.35)',
                }}
              >
                <p
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}
                >
                  {title}
                </p>
                <p className="text-base leading-relaxed" style={{ color: '#64748b' }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 80 }} />

        {/* ── Section 4: Coming soon ── */}
        <motion.section {...fade(0.05)} className="mb-24">
          <h2
            className="text-sm font-semibold uppercase tracking-[0.14em] mb-6"
            style={{ color: 'rgba(0,212,255,0.6)' }}
          >
            Coming soon
          </h2>
          <p
            className="text-xl leading-relaxed"
            style={{ color: '#8899af', fontFamily: 'var(--font-space)' }}
          >
            We're building capabilities that don't exist yet. Three undiscovered systems are in
            development. Watch the star map.
          </p>
        </motion.section>

        {/* ── Section 5: Footer info ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm" style={{ color: 'rgba(100,116,139,0.6)', letterSpacing: '0.04em' }}>
            voidexa · CVR 46343387 · Denmark ·{' '}
            <a
              href="mailto:contact@voidexa.com"
              className="hover:text-[#00d4ff] transition-colors"
              style={{ color: 'rgba(100,116,139,0.8)' }}
            >
              contact@voidexa.com
            </a>
          </p>
        </motion.div>

      </div>
    </div>
  )
}
