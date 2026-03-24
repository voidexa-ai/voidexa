'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/trading',  label: 'Trading'  },
  { href: '/apps',     label: 'Apps'     },
  { href: '/ai-tools', label: 'AI Tools' },
  { href: '/services', label: 'Services' },
  { href: '/about',    label: 'About'    },
  { href: '/contact',  label: 'Contact'  },
]

export default function MiniNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 28px',
        background: 'linear-gradient(180deg, rgba(6,5,16,0.75) 0%, transparent 100%)',
        backdropFilter: 'blur(0px)',
        pointerEvents: 'auto',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 700,
            color: '#00d4ff',
            fontFamily: 'var(--font-space)',
            letterSpacing: '0.05em',
          }}
        >
          VX
        </div>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'var(--font-space)',
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          voidexa
        </span>
      </Link>

      {/* Links — desktop */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
        className="starmap-nav-links"
      >
        {links.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              style={{
                padding: '5px 11px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: active ? 500 : 400,
                color: active ? '#00d4ff' : 'rgba(148,163,184,0.7)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'color 0.2s',
                background: active ? 'rgba(0,212,255,0.07)' : 'transparent',
                border: active ? '1px solid rgba(0,212,255,0.15)' : '1px solid transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
