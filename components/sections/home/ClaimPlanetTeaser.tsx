'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Star } from 'lucide-react'

export default function ClaimPlanetTeaser() {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.025) 50%, transparent 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative ring */}
      <div aria-hidden style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        border: '1px dashed rgba(0,212,255,0.05)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 18,
          padding: '5px 14px', borderRadius: 999,
          border: '1px solid rgba(245,158,11,0.25)',
          background: 'rgba(245,158,11,0.05)',
        }}>
          <Star size={12} style={{ color: '#f59e0b' }} />
          <span style={{
            fontSize: 13, fontWeight: 600, color: '#f59e0b',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            5 Pioneer Slots · First come, first served
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 44px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: 16,
          fontFamily: 'var(--font-space)',
          background: 'linear-gradient(90deg, #00d4ff 0%, #8b5cf6 40%, #00d4ff 80%, #8b5cf6 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 3s linear infinite',
        }}>
          Claim Your Planet
        </h2>

        <p style={{
          fontSize: 17, color: 'rgba(148,163,184,0.8)', lineHeight: 1.65,
          maxWidth: 520, margin: '0 auto 14px',
        }}>
          Own a sovereign node in the voidexa star system.
          Fuel it with GHAI, build something real, and become
          part of the infrastructure that runs itself.
        </p>

        <p style={{
          fontSize: 15, color: '#475569', lineHeight: 1.6,
          maxWidth: 480, margin: '0 auto 32px',
        }}>
          The first 5 habitable planets receive a special pioneer reward:
          up to <span style={{ color: '#94a3b8', fontWeight: 500 }}>10M GHAI</span> vested over 18 months.
        </p>

        <Link
          href="/claim-your-planet"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '13px 28px', borderRadius: 999,
            border: '1px solid rgba(0,212,255,0.25)',
            background: 'rgba(0,212,255,0.05)',
            color: '#00d4ff', fontSize: 15, fontWeight: 600,
            textDecoration: 'none', transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(0,212,255,0.1)'
            el.style.borderColor = 'rgba(0,212,255,0.45)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(0,212,255,0.05)'
            el.style.borderColor = 'rgba(0,212,255,0.25)'
          }}
        >
          Learn more
          <ChevronRight size={15} />
        </Link>
      </motion.div>
    </section>
  )
}
