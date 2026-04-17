'use client'

/**
 * Sprint 8 — 4 product panels under the shuttle hero.
 *
 * Headings supplied in the run prompt; sub-keywords inferred from existing
 * voidexa context (CLAUDE.md, /products, /apps) since the source
 * docs/gpt_keywords_homepage.md was a corrupt PowerShell artifact.
 */

import Link from 'next/link'

interface Panel {
  title: string
  tagline: string
  bullets: readonly string[]
  cta: string
  href: string
  accent: string
}

const PANELS: readonly Panel[] = [
  {
    title: 'Website Creation',
    tagline: 'From sketch to live in days.',
    bullets: [
      'Modular Next.js + Tailwind on Vercel Pro',
      'Three-tier pricing — Starter, Pro, Enterprise',
      'Stripe billing, Supabase auth, ready to ship',
    ],
    cta: 'See plans',
    href: '/products',
    accent: '#00d4ff',
  },
  {
    title: 'Custom Apps',
    tagline: 'Bespoke web tools for the Nordic SMB sector.',
    bullets: [
      'Quantum Debate — multi-AI consensus answers',
      'Wallet + KCP billing rails',
      'Full Vercel + Railway deployment',
    ],
    cta: 'Explore apps',
    href: '/apps',
    accent: '#8b5cf6',
  },
  {
    title: 'Universe',
    tagline: 'Step into the voidexa galaxy.',
    bullets: [
      'Free Flight — WASD ship + cockpit HUD',
      'Card combat, hauling, races, missions',
      'Claim Your Planet — sovereign company systems',
    ],
    cta: 'Enter the void',
    href: '/freeflight',
    accent: '#ffba60',
  },
  {
    title: 'Tools',
    tagline: 'Internal accelerators, public surface.',
    bullets: [
      'VoidForge — AI-assisted cockpit generator',
      'Ship Tagger — model catalog admin',
      'Scaffold mode — full-stack repo seeds',
    ],
    cta: 'Open the workshop',
    href: '/ai-tools',
    accent: '#7fff9f',
  },
]

export default function ProductPanels() {
  return (
    <section
      style={{
        padding: '88px 24px',
        background: 'linear-gradient(180deg, #04060d 0%, #06091a 100%)',
        color: '#dce8f8',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: 56,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            margin: 0,
            fontFamily: 'var(--font-space, system-ui)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          What we build
        </h2>
        <p
          style={{
            fontSize: 16,
            opacity: 0.75,
            marginTop: 12,
            maxWidth: 640,
            margin: '12px auto 0',
            lineHeight: 1.55,
          }}
        >
          Four lanes, one team. Production websites, bespoke apps, an
          interactive universe, and the internal tooling that makes it possible.
        </p>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 22,
        }}
      >
        {PANELS.map((p) => (
          <PanelCard key={p.href} panel={p} />
        ))}
      </div>
    </section>
  )
}

function PanelCard({ panel }: { panel: Panel }) {
  return (
    <Link
      href={panel.href}
      style={{
        display: 'block',
        padding: '28px 26px',
        background: 'rgba(8, 14, 28, 0.6)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 14,
        textDecoration: 'none',
        color: '#dce8f8',
        backdropFilter: 'blur(14px)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = panel.accent
        e.currentTarget.style.boxShadow = `0 20px 40px -10px ${panel.accent}44`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `radial-gradient(circle, ${panel.accent}66 0%, transparent 70%)`,
          border: `1px solid ${panel.accent}88`,
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: panel.accent,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        ◆
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 700,
          fontFamily: 'var(--font-space, system-ui)',
          letterSpacing: '-0.01em',
          color: panel.accent,
        }}
      >
        {panel.title}
      </h3>
      <p
        style={{
          fontSize: 14,
          opacity: 0.85,
          margin: '6px 0 16px',
          lineHeight: 1.45,
        }}
      >
        {panel.tagline}
      </p>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {panel.bullets.map((b) => (
          <li
            key={b}
            style={{
              fontSize: 14,
              opacity: 0.78,
              lineHeight: 1.45,
              paddingLeft: 14,
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 8,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: panel.accent,
                opacity: 0.85,
              }}
            />
            {b}
          </li>
        ))}
      </ul>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          fontWeight: 600,
          color: panel.accent,
          letterSpacing: '0.02em',
        }}
      >
        {panel.cta} →
      </div>
    </Link>
  )
}
