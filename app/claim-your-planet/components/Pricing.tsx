'use client'

import { motion } from 'framer-motion'
import { fadeUp, sectionHeading, sectionSub } from './shared'

export function Pricing() {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.04) 50%, transparent 100%)',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <h2 style={sectionHeading}>Pricing</h2>
          <p style={sectionSub}>
            Transparent. Flat. Self-sustaining once your planet reaches critical mass.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          <motion.div
            custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{
              padding: '32px 28px', borderRadius: 16,
              border: '1px solid rgba(0,212,255,0.25)',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,212,255,0.08) 100%)',
              boxShadow: '0 0 40px rgba(0,212,255,0.08)',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00d4ff', marginBottom: 12 }}>
              Deposit
            </p>
            <p style={{ fontSize: 40, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: 6, fontFamily: 'var(--font-space)' }}>
              $500 <span style={{ fontSize: 18, color: '#64748b', fontWeight: 500 }}>USD</span>
            </p>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65, marginBottom: 12 }}>
              One-time, paid in USD. Discount available when paying with GHAI (coming
              soon — subject to regulatory approval).
            </p>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>
              Funds ecosystem infrastructure — servers, APIs, scaling. Transparent allocation.
            </p>
          </motion.div>

          <motion.div
            custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{
              padding: '32px 28px', borderRadius: 16,
              border: '1px solid rgba(139,92,246,0.25)',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(139,92,246,0.08) 100%)',
              boxShadow: '0 0 40px rgba(139,92,246,0.08)',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a855f7', marginBottom: 12 }}>
              Monthly
            </p>
            <p style={{ fontSize: 40, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: 6, fontFamily: 'var(--font-space)' }}>
              $50 <span style={{ fontSize: 18, color: '#64748b', fontWeight: 500 }}>/ month</span>
            </p>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65, marginBottom: 12 }}>
              Keeps your planet habitable. Covers infrastructure, monitoring, and network costs.
            </p>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>
              <strong style={{ color: '#a855f7', fontWeight: 600 }}>Self-sustaining:</strong> the monthly drops when your planet reaches critical mass — your own Service Mesh revenue covers it.
            </p>
          </motion.div>
        </div>

        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{
            fontSize: 15, color: '#64748b', marginTop: 24, textAlign: 'center',
            maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65,
          }}
        >
          Your deposit funds ecosystem infrastructure — servers, APIs, scaling.
          Transparent allocation.
        </motion.p>
      </div>
    </section>
  )
}
