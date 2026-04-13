'use client'

import { motion } from 'framer-motion'
import { Vote } from 'lucide-react'
import { fadeUp, sectionHeading, sectionSub } from './shared'

export function Governance() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.25)',
          }}>
            <Vote size={28} style={{ color: '#a855f7' }} />
          </div>
          <h2 style={sectionHeading}>Governance</h2>
          <p style={sectionSub}>
            Planet owners vote on ecosystem direction — fees, infrastructure
            priorities, new features. You have a voice in how this universe evolves.
          </p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{
            padding: '28px 28px', borderRadius: 16,
            border: '1px solid rgba(139,92,246,0.22)',
            background: 'rgba(139,92,246,0.05)',
            textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: 14, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#a855f7', marginBottom: 16,
          }}>
            Vote weight formula
          </p>
          <p style={{
            fontSize: 22, fontWeight: 700, color: '#e2e8f0',
            fontFamily: 'var(--font-space)', marginBottom: 16, letterSpacing: '-0.01em',
          }}>
            Gravity Score × Pioneer multiplier
          </p>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: 0, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            The more you contribute, the louder your voice. Tier 1 pioneers get a 2x
            multiplier — their early conviction earns them permanent influence.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
