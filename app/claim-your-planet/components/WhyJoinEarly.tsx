'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { fadeUp, sectionHeading } from './shared'

type Item = { title: string; desc: string }

const items: Item[] = [
  {
    title: 'Pioneer GHAI grants decrease over time',
    desc: 'Planet 1 gets 10M. Planet 51 gets 3M. Planet 101 gets 1M. The door is closing as it opens.',
  },
  {
    title: 'Early planets claim key marketplace niches',
    desc: 'The first medical-AI planet owns that category. The first logistics planet owns that one. Categories don\'t duplicate well.',
  },
  {
    title: 'Governance influence compounds with tenure',
    desc: 'Your vote weight grows as your Gravity Score grows. Later arrivals spend years catching up to your early head start.',
  },
  {
    title: 'Pioneer Royalties create permanent passive income',
    desc: 'Every derivative built on top of what you ship pays you 2% — forever.',
  },
]

export function WhyJoinEarly() {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(245,158,11,0.05) 50%, transparent 100%)',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
            padding: '5px 14px', borderRadius: 999,
            border: '1px solid rgba(245,158,11,0.35)',
            background: 'rgba(245,158,11,0.08)',
          }}>
            <Flame size={13} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Why Join Early
            </span>
          </div>
          <h2 style={sectionHeading}>Planet #50 will wish they were Planet #5.</h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {items.map((item, i) => (
            <motion.div
              key={i} custom={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp}
              style={{
                padding: '26px 24px', borderRadius: 14,
                border: '1px solid rgba(245,158,11,0.15)',
                background: 'rgba(18,10,4,0.6)',
              }}
            >
              <p style={{
                fontSize: 24, fontWeight: 800, color: 'rgba(245,158,11,0.5)',
                fontFamily: 'var(--font-space)', marginBottom: 12,
              }}>
                {(i + 1).toString().padStart(2, '0')}
              </p>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e2e8f0', marginBottom: 10, fontFamily: 'var(--font-space)', lineHeight: 1.35 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
