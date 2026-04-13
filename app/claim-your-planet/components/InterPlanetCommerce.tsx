'use client'

import { motion } from 'framer-motion'
import { fadeUp, sectionHeading, sectionSub } from './shared'

type Split = { who: string; pct: string; desc: string; color: string }

const splits: Split[] = [
  { who: 'Service provider', pct: '70%', desc: 'The planet that publishes the API keeps the majority share of revenue.', color: '#22c55e' },
  { who: 'Routing planet', pct: '15%', desc: 'The planet that integrated the service takes a referral share.', color: '#00d4ff' },
  { who: 'voidexa', pct: '15%', desc: 'Infrastructure, orchestration, and network maintenance.', color: '#a855f7' },
]

export function InterPlanetCommerce() {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.04) 50%, transparent 100%)',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <h2 style={sectionHeading}>How Inter-Planet Commerce Works</h2>
          <p style={sectionSub}>
            You offer a service. Another planet uses it. Revenue splits
            proportionally across the participants.
          </p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{
            padding: '28px 28px', borderRadius: 16,
            border: '1px solid rgba(0,212,255,0.18)',
            background: 'rgba(0,8,16,0.55)',
            marginBottom: 28,
            fontSize: 16, color: '#cbd5e1', lineHeight: 1.75,
          }}
        >
          <p style={{ margin: 0 }}>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>Planet A</span> publishes a medical chatbot API.{' '}
            <span style={{ color: '#00d4ff', fontWeight: 600 }}>Planet B</span> calls it from their edtech app.
            Each call splits automatically across the revenue participants — visible as
            a glowing trade route on the star map. Settlement in GHAI coming soon,
            subject to regulatory approval.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {splits.map((s, i) => (
            <motion.div
              key={i} custom={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp}
              style={{
                padding: '28px 24px', borderRadius: 14,
                border: `1px solid ${s.color}30`,
                background: `linear-gradient(135deg, rgba(0,0,0,0.55) 0%, ${s.color}10 100%)`,
                textAlign: 'center',
              }}
            >
              <p style={{
                fontSize: 48, fontWeight: 800, color: s.color,
                letterSpacing: '-0.03em', marginBottom: 6,
                fontFamily: 'var(--font-space)', lineHeight: 1,
              }}>
                {s.pct}
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 10 }}>
                {s.who}
              </p>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{
            fontSize: 15, color: '#64748b', marginTop: 28, textAlign: 'center',
            maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65,
          }}
        >
          All inter-planet transactions render as live trade routes on the star
          map — glowing arcs between planets that actually move value.
        </motion.p>
      </div>
    </section>
  )
}
