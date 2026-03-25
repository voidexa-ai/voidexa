'use client'

import { motion } from 'framer-motion'

const techs = [
  {
    title: 'Compressed Communication',
    desc: 'AI that speaks in binary. Faster. Cheaper. Smarter.',
  },
  {
    title: 'Shared Memory',
    desc: 'Systems that remember. Every session builds on the last.',
  },
  {
    title: 'Multi-Source Verification',
    desc: 'Answers verified across multiple AI providers.',
  },
]

export default function CoreTech() {
  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #07070d 0%, #0a0414 50%, #07070d 100%)' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
            style={{ color: 'rgba(0,212,255,0.55)' }}
          >
            Under the hood
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}
          >
            Built on proprietary technology.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {techs.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              style={{
                padding: '32px 28px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(0,212,255,0.08)',
                borderTop: '1px solid rgba(0,212,255,0.18)',
              }}
            >
              <p
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: 'var(--font-space)', color: '#c8d5e3' }}
              >
                {title}
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#64748b' }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
