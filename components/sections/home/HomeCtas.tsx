'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomeCtas() {
  return (
    <div style={{ padding: '0 24px 48px', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Three-card horizontal row ── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>

        {/* ── LEFT: Claim Your Planet (square) ── */}
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
            display: 'block',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(0,212,255,0.45)'
            el.style.boxShadow = '0 0 28px rgba(0,212,255,0.18)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(0,212,255,0.2)'
            el.style.boxShadow = 'none'
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
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Bottom gradient for text legibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7,4,18,0.82) 0%, rgba(7,4,18,0.3) 45%, transparent 100%)',
          }} />
          {/* Text overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 18px',
          }}>
            <span style={{
              display: 'inline-block',
              marginBottom: 7,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f59e0b',
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.32)',
              borderRadius: 999,
              padding: '2px 8px',
            }}>
              5 PIONEER SLOTS
            </span>
            <div style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#e2e8f0',
              fontFamily: 'var(--font-space)',
              lineHeight: 1.2,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              Claim Your Planet
              <ArrowRight size={13} style={{ color: 'rgba(0,212,255,0.7)', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        {/* ── MIDDLE: Meet the Team ── */}
        <Link
          href="/team"
          style={{
            flex: '1 1 0',
            borderRadius: 16,
            overflow: 'hidden',
            textDecoration: 'none',
            border: '1px solid rgba(139,92,246,0.22)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(7,4,18,0.6)',
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
            el.style.boxShadow = 'none'
            el.style.transform = 'translateY(0)'
          }}
        >
          {/* Image section — same aspect-ratio as the square cards so tops align */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cast/gruppe billede.jpg"
              alt="The voidexa team"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%',
              }}
            />
            {/* Subtle bottom fade into text area */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to top, rgba(7,4,18,0.75) 0%, transparent 100%)',
            }} />
          </div>

          {/* Text section below image */}
          <div style={{
            padding: '18px 20px 20px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'rgba(139,92,246,0.04)',
            borderTop: '1px solid rgba(139,92,246,0.1)',
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(139,92,246,0.8)',
              marginBottom: 7,
              fontFamily: 'var(--font-space)',
            }}>
              THE PEOPLE
            </div>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#e2e8f0',
              fontFamily: 'var(--font-space)',
              lineHeight: 1.2,
              marginBottom: 6,
            }}>
              Meet the team
            </div>
            <div style={{
              fontSize: 13,
              color: 'rgba(226,232,240,0.55)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              The builders behind voidexa
              <ArrowRight size={12} style={{ color: 'rgba(139,92,246,0.7)', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        {/* ── RIGHT: GHAI (square) ── */}
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
            display: 'block',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(0,212,255,0.45)'
            el.style.boxShadow = '0 0 28px rgba(0,212,255,0.18)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(0,212,255,0.2)'
            el.style.boxShadow = 'none'
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
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Bottom gradient for text legibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7,4,18,0.82) 0%, rgba(7,4,18,0.3) 45%, transparent 100%)',
          }} />
          {/* Text overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 18px',
          }}>
            <span style={{
              display: 'inline-block',
              marginBottom: 7,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00d4ff',
              background: 'rgba(0,212,255,0.12)',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: 999,
              padding: '2px 8px',
            }}>
              GHAI TOKEN
            </span>
            <div style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#e2e8f0',
              fontFamily: 'var(--font-space)',
              lineHeight: 1.2,
              marginBottom: 3,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            }}>
              GHAI
            </div>
            <div style={{
              fontSize: 12,
              color: 'rgba(226,232,240,0.65)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              The fuel of voidexa
              <ArrowRight size={12} style={{ color: 'rgba(0,212,255,0.7)', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

      </div>
    </div>
  )
}
