/**
 * Sprint 12 — branded 404. Server component; deep linking encouraged.
 */

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Lost in the void',
  description: 'The page you tried to reach is not on any star chart.',
  robots: { index: false, follow: false },
}

const POPULAR_LINKS: readonly { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/freeflight', label: 'Free Flight' },
  { href: '/starmap', label: 'Galaxy' },
  { href: '/quantum', label: 'Quantum Debate' },
  { href: '/contact', label: 'Contact' },
]

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background:
          'radial-gradient(ellipse at center, #0a1530 0%, #04060d 60%, #02030a 100%)',
        color: '#dce8f8',
        fontFamily: 'var(--font-inter, system-ui)',
      }}
    >
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 14,
            color: '#00d4ff',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: 0.8,
            marginBottom: 16,
          }}
        >
          ◇ Off the Star Chart
        </div>

        <h1
          style={{
            fontSize: 'clamp(64px, 14vw, 120px)',
            margin: 0,
            fontFamily: 'var(--font-space, system-ui)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          404
        </h1>

        <p
          style={{
            fontSize: 18,
            opacity: 0.85,
            margin: '24px auto 32px',
            maxWidth: 440,
            lineHeight: 1.5,
          }}
        >
          That page is not on any voidexa chart. Pick a destination from the orbital
          register, or warp home.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10,
            maxWidth: 480,
            margin: '0 auto 32px',
          }}
        >
          {POPULAR_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: '10px 14px',
                background: 'rgba(0, 20, 40, 0.6)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: 8,
                color: '#00d4ff',
                textDecoration: 'none',
                fontSize: 14,
                letterSpacing: '0.02em',
              }}
            >
              {l.label} →
            </Link>
          ))}
        </div>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            color: '#04060d',
            borderRadius: 10,
            textDecoration: 'none',
            fontSize: 16,
            fontWeight: 600,
            boxShadow: '0 0 28px rgba(0, 212, 255, 0.35)',
          }}
        >
          ⌂ Warp home
        </Link>
      </div>
    </div>
  )
}
