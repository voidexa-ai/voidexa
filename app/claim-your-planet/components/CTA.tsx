'use client'

import { motion } from 'framer-motion'
import { Star, ChevronRight } from 'lucide-react'
import { fadeUp, ShimmerText } from './shared'

export function CTA() {
  return (
    <section style={{ padding: '80px 24px 120px' }}>
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        style={{
          maxWidth: 720, margin: '0 auto',
          padding: '64px 40px',
          borderRadius: 24,
          border: '1px solid rgba(0,212,255,0.18)',
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.06) 0%, rgba(139,92,246,0.06) 60%, transparent 100%)',
          textAlign: 'center',
          boxShadow: '0 0 80px rgba(0,212,255,0.07)',
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
          padding: '5px 14px', borderRadius: 999,
          border: '1px solid rgba(245,158,11,0.3)',
          background: 'rgba(245,158,11,0.06)',
        }}>
          <Star size={13} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            10 Pioneer Slots — First Come, First Proven
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800,
          letterSpacing: '-0.02em', marginBottom: 16,
          fontFamily: 'var(--font-space)',
        }}>
          <ShimmerText>Ready to Claim Your Planet?</ShimmerText>
        </h2>

        <p style={{
          fontSize: 16, color: '#94a3b8', lineHeight: 1.65,
          maxWidth: 500, margin: '0 auto 36px',
        }}>
          Applications are reviewed personally. Tell us what you bring to the
          voidexa galaxy — and we&apos;ll help you launch your planet.
        </p>

        <a
          href="mailto:contact@voidexa.com"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 40px', borderRadius: 999,
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            color: '#0a0a0f', fontSize: 17, fontWeight: 700,
            textDecoration: 'none', transition: 'opacity 0.2s',
            marginBottom: 24,
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
        >
          Apply for a Planet
          <ChevronRight size={18} />
        </a>

        <p style={{ fontSize: 15, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>
          Questions? Reach the board directly —{' '}
          <a
            href="mailto:contact@voidexa.com"
            style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 500 }}
          >
            contact@voidexa.com
          </a>
        </p>
      </motion.div>
    </section>
  )
}
