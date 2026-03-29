'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomeCtas() {
  return (
    <div style={{ padding: '0 24px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>

        {/* ── Team card ── */}
        <Link
          href="/team"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 18px',
            borderRadius: 14,
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.18)',
            textDecoration: 'none',
            maxWidth: 400,
            flex: '0 0 auto',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(139,92,246,0.12)'
            el.style.borderColor = 'rgba(139,92,246,0.35)'
            el.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(139,92,246,0.06)'
            el.style.borderColor = 'rgba(139,92,246,0.18)'
            el.style.transform = 'translateY(0)'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cast/gruppe billede.jpg"
            alt="The voidexa team"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              border: '2px solid rgba(139,92,246,0.4)',
              flexShrink: 0,
              boxShadow: '0 0 14px rgba(139,92,246,0.25)',
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#e2e8f0',
              fontFamily: 'var(--font-space)',
              lineHeight: 1.3,
            }}>
              Meet the team
            </div>
            <div style={{
              fontSize: 12,
              color: 'rgba(148,163,184,0.55)',
              marginTop: 1,
            }}>
              The builders behind voidexa
            </div>
          </div>
          <ArrowRight size={14} style={{ color: 'rgba(139,92,246,0.5)', flexShrink: 0 }} />
        </Link>

        {/* ── Claim Your Planet card ── */}
        <Link
          href="/claim-your-planet"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 18px',
            borderRadius: 14,
            background: 'rgba(0,212,255,0.04)',
            border: '1px solid rgba(0,212,255,0.16)',
            textDecoration: 'none',
            maxWidth: 400,
            flex: '0 0 auto',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(0,212,255,0.09)'
            el.style.borderColor = 'rgba(0,212,255,0.32)'
            el.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'rgba(0,212,255,0.04)'
            el.style.borderColor = 'rgba(0,212,255,0.16)'
            el.style.transform = 'translateY(0)'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/claaming a planet.jpg"
            alt="Claim Your Planet"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              objectFit: 'cover',
              objectPosition: 'center',
              border: '2px solid rgba(0,212,255,0.3)',
              flexShrink: 0,
              boxShadow: '0 0 14px rgba(0,212,255,0.18)',
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#e2e8f0',
                fontFamily: 'var(--font-space)',
                lineHeight: 1.3,
              }}>
                Claim Your Planet
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#f59e0b',
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.22)',
                borderRadius: 999,
                padding: '1px 6px',
              }}>
                5 slots
              </span>
            </div>
            <div style={{
              fontSize: 12,
              color: 'rgba(148,163,184,0.55)',
            }}>
              Own a node in the star system
            </div>
          </div>
          <ArrowRight size={14} style={{ color: 'rgba(0,212,255,0.45)', flexShrink: 0 }} />
        </Link>

      </div>
    </div>
  )
}
