'use client'

import { motion } from 'framer-motion'
import { fadeUp } from './shared'

const CLAIMED = 0
const TOTAL = 10

export function PioneerSlots() {
  const remaining = TOTAL - CLAIMED
  const slots = Array.from({ length: TOTAL }, (_, i) => i + 1)

  return (
    <section style={{ padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <p style={{
            fontSize: 14, fontWeight: 600, color: 'rgba(0,212,255,0.8)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24,
          }}>
            {remaining} of {TOTAL} Pioneer slots remaining
          </p>

          <div style={{
            display: 'flex', gap: 12, justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 24,
          }}>
            {slots.map((i) => {
              const claimed = i <= CLAIMED
              return (
                <div
                  key={i}
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    border: claimed
                      ? '2px solid rgba(139,92,246,0.5)'
                      : '2px dashed rgba(0,212,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: claimed
                      ? 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.05) 100%)'
                      : 'rgba(0,212,255,0.03)',
                    animation: claimed ? 'none' : 'cyanPulse 3s ease-in-out infinite',
                    animationDelay: `${i * 0.25}s`,
                  }}
                >
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: claimed ? '#e2e8f0' : 'rgba(0,212,255,0.4)',
                    fontFamily: 'var(--font-space)',
                  }}>
                    {i.toString().padStart(2, '0')}
                  </span>
                </div>
              )
            })}
          </div>

          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
            The first 10 planets are onboarded personally by Jix. Tier 1 Pioneer
            benefits apply to this cohort only.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
