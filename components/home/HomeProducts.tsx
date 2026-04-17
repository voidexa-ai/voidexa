'use client'

import Link from 'next/link'

interface Product {
  title: string
  description: string
  href: string
  status: 'LIVE' | 'BETA' | 'IN DEV' | 'SOON' | 'SERVICES'
  // SVG glyph path, rendered inside a 36px viewport at stroke=1.4.
  glyph: string
}

const STATUS_COLOR: Record<Product['status'], string> = {
  'LIVE':     '#22c55e',
  'BETA':     '#00d4ff',
  'IN DEV':   '#f59e0b',
  'SOON':     '#94a3b8',
  'SERVICES': '#a855f7',
}

const PRODUCTS: Product[] = [
  {
    title: 'AI Trading',
    description: 'Backtested, live-trading strategies with continuous monitoring.',
    href: '/trading',
    status: 'LIVE',
    glyph: 'M4 30 L12 18 L18 22 L28 6',
  },
  {
    title: 'Custom Apps',
    description: 'Bespoke AI tools built for your operation — encrypted, sovereign.',
    href: '/services',
    status: 'BETA',
    glyph: 'M8 10 h20 v20 h-20 z M14 16 h8 M14 20 h8 M14 24 h5',
  },
  {
    title: 'AI Book Creator',
    description: 'Voice notes → structured chapters. For founders building thought leadership.',
    href: '/apps',
    status: 'IN DEV',
    glyph: 'M8 6 h14 l4 4 v22 h-18 z M12 14 h10 M12 18 h10 M12 22 h6',
  },
  {
    title: 'AI Website Builder',
    description: 'Prompt-to-production sites with full design-system fidelity.',
    href: '/apps',
    status: 'SOON',
    glyph: 'M6 8 h24 v6 h-24 z M6 16 h10 v16 h-10 z M18 16 h12 v16 h-12 z',
  },
  {
    title: 'Data Intelligence',
    description: 'Custom dashboards, pipelines, and decision systems for your data.',
    href: '/services',
    status: 'SERVICES',
    glyph: 'M6 30 L14 20 L20 24 L30 10',
  },
  {
    title: 'AI Consulting',
    description: 'Strategy, architecture, and implementation for AI-first companies.',
    href: '/services',
    status: 'SERVICES',
    glyph: 'M10 12 a8 8 0 1 0 0 12 M18 12 a8 8 0 1 0 0 12 M26 12 a8 8 0 1 0 0 12',
  },
]

function ProductCard({ p }: { p: Product }) {
  const statusColor = STATUS_COLOR[p.status]
  return (
    <Link
      href={p.href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '26px 24px',
        background: 'linear-gradient(160deg, rgba(14,18,30,0.8), rgba(6,10,18,0.92))',
        border: '1px solid rgba(0,212,255,0.18)',
        borderRadius: 14,
        color: '#fff',
        textDecoration: 'none',
        transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
        boxShadow: '0 0 20px rgba(0,212,255,0.06)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 0 36px rgba(0,212,255,0.22)'
        el.style.borderColor = 'rgba(0,212,255,0.45)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 0 20px rgba(0,212,255,0.06)'
        el.style.borderColor = 'rgba(0,212,255,0.18)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d={p.glyph} stroke="#00d4ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.5))' }} />
        </svg>
        <span style={{
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 4,
          color: statusColor,
          background: `${statusColor}22`,
          border: `1px solid ${statusColor}77`,
          fontFamily: 'var(--font-space, monospace)',
          textShadow: `0 0 6px ${statusColor}aa`,
        }}>
          {p.status}
        </span>
      </div>
      <div style={{
        marginTop: 16,
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '-0.005em',
        fontFamily: 'var(--font-space, system-ui)',
      }}>
        {p.title}
      </div>
      <div style={{
        marginTop: 8,
        fontSize: 15,
        lineHeight: 1.5,
        color: 'rgba(255,255,255,0.7)',
      }}>
        {p.description}
      </div>
      <div style={{
        marginTop: 18,
        fontSize: 14,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#00d4ff',
        fontFamily: 'var(--font-space, monospace)',
      }}>
        Learn more →
      </div>
    </Link>
  )
}

export default function HomeProducts() {
  return (
    <section style={{
      padding: '40px 24px 80px',
      background: 'linear-gradient(180deg, #050813 0%, #070918 100%)',
      color: '#fff',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{
          fontSize: 14,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(0,212,255,0.75)',
          fontFamily: 'var(--font-space, monospace)',
          marginBottom: 6,
        }}>
          Products
        </div>
        <h2 style={{
          margin: '0 0 30px',
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-space, system-ui)',
          background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          What we build
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
        }}>
          {PRODUCTS.map(p => <ProductCard key={p.title} p={p} />)}
        </div>
      </div>
    </section>
  )
}
