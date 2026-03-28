'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'

export default function HomeCtas() {
  return (
    <section style={{ padding: '8px 24px 80px', position: 'relative', zIndex: 10 }}>
      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          justifyContent: 'center',
        }}
      >
        {/* ── Meet the Team card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: '1 1 380px', maxWidth: 500 }}
        >
          <Link
            href="/team"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '32px 36px',
              borderRadius: 24,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.07)'
              el.style.borderColor = 'rgba(139,92,246,0.4)'
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(139,92,246,0.15)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.04)'
              el.style.borderColor = 'rgba(255,255,255,0.1)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            {/* Double-size team photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cast/gruppe billede.jpg"
              alt="The voidexa team"
              style={{
                width: 112,
                height: 112,
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                border: '2px solid rgba(139,92,246,0.45)',
                flexShrink: 0,
                boxShadow: '0 0 32px rgba(139,92,246,0.25)',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(148,163,184,0.5)',
                marginBottom: 6,
                fontFamily: 'var(--font-space)',
              }}>
                The People
              </p>
              <p style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#e2e8f0',
                fontFamily: 'var(--font-space)',
                marginBottom: 4,
                lineHeight: 1.2,
              }}>
                Meet the team
              </p>
              <p style={{
                fontSize: 13,
                color: 'rgba(148,163,184,0.6)',
                lineHeight: 1.5,
              }}>
                The builders behind voidexa
              </p>
            </div>
            <ArrowRight
              size={18}
              style={{ color: 'rgba(148,163,184,0.4)', flexShrink: 0 }}
            />
          </Link>
        </motion.div>

        {/* ── Claim Your Planet card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: '1 1 380px', maxWidth: 500 }}
        >
          <Link
            href="/claim-your-planet"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '32px 36px',
              borderRadius: 24,
              background: 'rgba(0,212,255,0.04)',
              border: '1px solid rgba(0,212,255,0.14)',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              backdropFilter: 'blur(12px)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(0,212,255,0.09)'
              el.style.borderColor = 'rgba(0,212,255,0.35)'
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 16px 48px rgba(0,212,255,0.1), 0 0 0 1px rgba(0,212,255,0.12)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(0,212,255,0.04)'
              el.style.borderColor = 'rgba(0,212,255,0.14)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            {/* Planet icon — 100px to match team photo */}
            <div style={{
              width: 112,
              height: 112,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at 35% 35%, rgba(0,212,255,0.25) 0%, rgba(139,92,246,0.2) 50%, rgba(10,10,30,0.95) 100%)',
              border: '2px solid rgba(0,212,255,0.3)',
              boxShadow: '0 0 32px rgba(0,212,255,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Ring */}
              <div style={{
                position: 'absolute',
                width: 130,
                height: 30,
                borderRadius: '50%',
                border: '1.5px solid rgba(0,212,255,0.3)',
                transform: 'rotate(-25deg)',
                pointerEvents: 'none',
              }} />
              <span style={{ fontSize: 36, lineHeight: 1, position: 'relative', zIndex: 1 }}>🪐</span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Pioneer badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                marginBottom: 6,
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
              }}>
                <Star size={9} style={{ color: '#f59e0b' }} />
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#f59e0b',
                }}>
                  5 Pioneer Slots
                </span>
              </div>
              <p style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#e2e8f0',
                fontFamily: 'var(--font-space)',
                marginBottom: 4,
                lineHeight: 1.2,
              }}>
                Claim Your Planet
              </p>
              <p style={{
                fontSize: 13,
                color: 'rgba(148,163,184,0.6)',
                lineHeight: 1.5,
              }}>
                Own a sovereign node in the star system
              </p>
            </div>
            <ArrowRight
              size={18}
              style={{ color: 'rgba(0,212,255,0.4)', flexShrink: 0 }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
