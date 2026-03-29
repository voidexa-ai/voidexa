'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomeCtas() {
  return (
    <div style={{ padding: '0 24px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── TOP: Full-width Team card ── */}
        <Link
          href="/team"
          style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: 160,
            borderRadius: 16,
            overflow: 'hidden',
            textDecoration: 'none',
            background: '#070412',
            border: '1px solid rgba(139,92,246,0.22)',
            boxShadow: '0 0 0 0 rgba(139,92,246,0)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(139,92,246,0.45)'
            el.style.boxShadow = '0 0 28px rgba(139,92,246,0.18)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(139,92,246,0.22)'
            el.style.boxShadow = '0 0 0 0 rgba(139,92,246,0)'
            el.style.transform = 'translateY(0)'
          }}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cast/gruppe billede.jpg"
            alt="The voidexa team"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center center',
            }}
          />
          {/* Dark overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(7,4,18,0.72) 0%, rgba(7,4,18,0.45) 60%, rgba(7,4,18,0.25) 100%)',
          }} />
          {/* Purple glow overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(139,92,246,0.18) 0%, transparent 70%)',
          }} />
          {/* Text content */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px 24px',
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(139,92,246,0.9)',
              marginBottom: 6,
              fontFamily: 'var(--font-space)',
            }}>
              THE PEOPLE
            </div>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#e2e8f0',
              fontFamily: 'var(--font-space)',
              lineHeight: 1.2,
              marginBottom: 4,
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              Meet the team
            </div>
            <div style={{
              fontSize: 14,
              color: 'rgba(226,232,240,0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              The builders behind voidexa
              <ArrowRight size={14} style={{ color: 'rgba(139,92,246,0.8)' }} />
            </div>
          </div>
        </Link>

        {/* ── BOTTOM ROW: Two square cards ── */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>

          {/* Left: Claim Your Planet */}
          <Link
            href="/claim-your-planet"
            style={{
              position: 'relative',
              flex: '1 1 0',
              aspectRatio: '1 / 1',
              borderRadius: 16,
              overflow: 'hidden',
              textDecoration: 'none',
              border: '1px solid rgba(0,212,255,0.2)',
              background: '#070412',
              boxShadow: '0 0 0 0 rgba(0,212,255,0)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(0,212,255,0.4)'
              el.style.boxShadow = '0 0 28px rgba(0,212,255,0.15)'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(0,212,255,0.2)'
              el.style.boxShadow = '0 0 0 0 rgba(0,212,255,0)'
              el.style.transform = 'translateY(0)'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/claaming a planet.jpg"
              alt="Claim Your Planet"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, rgba(7,4,18,0.55) 0%, rgba(7,4,18,0.75) 100%)',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '18px 20px',
            }}>
              <span style={{
                display: 'inline-block',
                marginBottom: 8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#f59e0b',
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 999,
                padding: '2px 8px',
                width: 'fit-content',
              }}>
                5 PIONEER SLOTS
              </span>
              <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#e2e8f0',
                fontFamily: 'var(--font-space)',
                lineHeight: 1.2,
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                Claim Your Planet
                <ArrowRight size={14} style={{ color: 'rgba(0,212,255,0.7)' }} />
              </div>
            </div>
          </Link>

          {/* Right: GHAI */}
          <Link
            href="/token"
            style={{
              position: 'relative',
              flex: '1 1 0',
              aspectRatio: '1 / 1',
              borderRadius: 16,
              overflow: 'hidden',
              textDecoration: 'none',
              border: '1px solid rgba(0,212,255,0.2)',
              background: '#070412',
              boxShadow: '0 0 0 0 rgba(0,212,255,0)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(0,212,255,0.4)'
              el.style.boxShadow = '0 0 28px rgba(0,212,255,0.15)'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(0,212,255,0.2)'
              el.style.boxShadow = '0 0 0 0 rgba(0,212,255,0)'
              el.style.transform = 'translateY(0)'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/GHAI.jpg"
              alt="GHAI Token"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, rgba(7,4,18,0.55) 0%, rgba(7,4,18,0.75) 100%)',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '18px 20px',
            }}>
              <span style={{
                display: 'inline-block',
                marginBottom: 8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#00d4ff',
                background: 'rgba(0,212,255,0.12)',
                border: '1px solid rgba(0,212,255,0.28)',
                borderRadius: 999,
                padding: '2px 8px',
                width: 'fit-content',
              }}>
                GHAI TOKEN
              </span>
              <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#e2e8f0',
                fontFamily: 'var(--font-space)',
                lineHeight: 1.2,
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                marginBottom: 3,
              }}>
                GHAI
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(226,232,240,0.65)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                The fuel of voidexa
                <ArrowRight size={13} style={{ color: 'rgba(0,212,255,0.7)' }} />
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}
