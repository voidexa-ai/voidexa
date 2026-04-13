'use client'

import { motion } from 'framer-motion'
import { Gauge } from 'lucide-react'
import { fadeUp, sectionHeading, sectionSub } from './shared'

export function GravityScore() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
          }}>
            <Gauge size={28} style={{ color: '#f59e0b' }} />
          </div>
          <h2 style={sectionHeading}>Gravity Score, Explained</h2>
          <p style={sectionSub}>
            The one number that tells the galaxy how real your planet is.
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
              padding: '28px 26px', borderRadius: 14,
              border: '1px solid rgba(245,158,11,0.2)',
              background: 'rgba(245,158,11,0.04)',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 12 }}>
              What it measures
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 15, color: '#cbd5e1', lineHeight: 1.9 }}>
              <li>Transactions — every GHAI flow through your planet</li>
              <li>Services — APIs, products, and integrations you publish</li>
              <li>Tenure — how long you&apos;ve been orbiting</li>
            </ul>
          </motion.div>

          <motion.div
            custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{
              padding: '28px 26px', borderRadius: 14,
              border: '1px solid rgba(0,212,255,0.2)',
              background: 'rgba(0,212,255,0.04)',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00d4ff', marginBottom: 12 }}>
              What it affects
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 15, color: '#cbd5e1', lineHeight: 1.9 }}>
              <li>Planet size on the star map</li>
              <li>Search ranking across the galaxy</li>
              <li>Governance weight in ecosystem votes</li>
            </ul>
          </motion.div>
        </div>

        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{
            fontSize: 18, color: '#e2e8f0', marginTop: 32, textAlign: 'center',
            maxWidth: 540, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55,
            fontFamily: 'var(--font-space)', fontWeight: 500,
          }}
        >
          Your planet grows as you contribute.
        </motion.p>
      </div>
    </section>
  )
}
