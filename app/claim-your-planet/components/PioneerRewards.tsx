'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { fadeUp, sectionHeading, sectionSub } from './shared'

type Tier = {
  range: string
  headline: string
  governance: string
  featured: string
  color: string
  glow: string
}

const tiers: Tier[] = [
  { range: 'Planet 1–10', headline: 'Tier 1 Pioneer', governance: '2x governance', featured: '12 months featured', color: '#f59e0b', glow: 'rgba(245,158,11,0.12)' },
  { range: 'Planet 11–25', headline: 'Tier 2 Pioneer', governance: '1.5x governance', featured: '6 months featured', color: '#00d4ff', glow: 'rgba(0,212,255,0.12)' },
  { range: 'Planet 26–50', headline: 'Tier 3 Pioneer', governance: '1x governance', featured: '3 months featured', color: '#8b5cf6', glow: 'rgba(139,92,246,0.12)' },
]

export function PioneerRewards() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
            padding: '5px 14px', borderRadius: 999,
            border: '1px solid rgba(245,158,11,0.3)',
            background: 'rgba(245,158,11,0.06)',
          }}>
            <Star size={13} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Pioneer Rewards
            </span>
          </div>
          <h2 style={sectionHeading}>The earlier you land, the more you carry.</h2>
          <p style={sectionSub}>
            Tiered pioneer benefits — governance weight, featured placement, and token
            incentives scaled to how early you stake your planet.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {tiers.map((t, i) => (
            <motion.div
              key={i} custom={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp}
              style={{
                padding: '32px 28px', borderRadius: 16,
                border: `1px solid ${t.color}35`,
                background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${t.glow} 100%)`,
                boxShadow: `0 0 40px ${t.glow}`,
              }}
            >
              <p style={{
                fontSize: 14, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: t.color, marginBottom: 14,
              }}>
                {t.range}
              </p>
              <p style={{
                fontSize: 28, fontWeight: 800, color: '#e2e8f0',
                letterSpacing: '-0.02em', marginBottom: 14,
                fontFamily: 'var(--font-space)',
              }}>
                {t.headline}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 15, color: '#cbd5e1', lineHeight: 1.8 }}>
                <li>{t.governance}</li>
                <li>{t.featured}</li>
                <li style={{ color: '#94a3b8' }}>Pioneer token incentives</li>
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{
            marginTop: 24,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          <div style={{
            padding: '20px 24px', borderRadius: 12,
            border: '1px solid rgba(0,212,255,0.15)',
            background: 'rgba(0,212,255,0.04)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#00d4ff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Token incentives
            </p>
            <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>
              Pioneer token incentives — details shared during onboarding. Token rewards
              structure pending legal review.
            </p>
          </div>
          <div style={{
            padding: '20px 24px', borderRadius: 12,
            border: '1px solid rgba(139,92,246,0.18)',
            background: 'rgba(139,92,246,0.05)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#a855f7', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Derivative credits
            </p>
            <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>
              Pioneers are recognized when later planets build on top of their work —
              recognition model subject to regulatory approval.
            </p>
          </div>
        </motion.div>

        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{
            fontSize: 14, color: '#64748b', marginTop: 24, textAlign: 'center',
            maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          GHAI integration coming soon — subject to regulatory approval. Not a
          securities offering. Not financial advice.
        </motion.p>
      </div>
    </section>
  )
}
