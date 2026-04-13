'use client'

import { motion } from 'framer-motion'
import { Globe, ChevronRight } from 'lucide-react'
import { fadeUp, ShimmerText } from './shared'

export function Hero() {
  return (
    <section style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px 60px',
      position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(0,212,255,0.06) 0%, transparent 70%)',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/claaming a planet.jpg"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', opacity: 0.45, zIndex: 0 }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,7,13,0.35) 0%, rgba(7,7,13,0.15) 50%, rgba(7,7,13,0.55) 100%)', zIndex: 1 }} />

      <div aria-hidden style={{
        position: 'absolute', top: '22%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        border: '1px dashed rgba(0,212,255,0.06)', pointerEvents: 'none', zIndex: 2,
      }} />
      <div aria-hidden style={{
        position: 'absolute', top: '22%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 400, height: 400, borderRadius: '50%',
        border: '1px dashed rgba(139,92,246,0.08)', pointerEvents: 'none', zIndex: 2,
      }} />

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        style={{ textAlign: 'center', maxWidth: 820, position: 'relative', zIndex: 2 }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 999,
          border: '1px solid rgba(0,212,255,0.2)',
          background: 'rgba(0,212,255,0.04)',
          marginBottom: 28,
        }}>
          <Globe size={14} style={{ color: '#00d4ff' }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(0,212,255,0.85)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Pioneer Program — Open
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 88px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: 24,
          fontFamily: 'var(--font-space)',
        }}>
          <ShimmerText>Claim Your Planet</ShimmerText>
        </h1>

        <p style={{
          fontSize: 'clamp(18px, 2.2vw, 22px)',
          color: 'rgba(203,213,225,0.88)',
          lineHeight: 1.65,
          maxWidth: 680,
          margin: '0 auto 36px',
          fontWeight: 400,
        }}>
          You&apos;re not renting a page. You&apos;re building a sovereign system inside
          the voidexa galaxy. Your planet, your economy, your orbit.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="mailto:contact@voidexa.com"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 999,
              background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
              color: '#0a0a0f', fontSize: 16, fontWeight: 700,
              textDecoration: 'none', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            Apply for a Planet
            <ChevronRight size={16} />
          </a>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '14px 24px', borderRadius: 999,
            border: '1px solid rgba(0,212,255,0.2)',
            color: 'rgba(148,163,184,0.8)', fontSize: 15,
          }}>
            10 Pioneer slots — first come, first proven
          </span>
        </div>
      </motion.div>
    </section>
  )
}
