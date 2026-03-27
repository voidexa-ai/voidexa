'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { STAR_MAP_NODES } from '@/components/starmap/nodes'

const links = [
  { href: '/trading',  label: 'Trading'  },
  { href: '/apps',     label: 'Apps'     },
  { href: '/ai-tools', label: 'AI Tools' },
  { href: '/services', label: 'Services' },
  { href: '/about',    label: 'About'    },
  { href: '/contact',  label: 'Contact'  },
]

// path → planet emissive color
const PATH_COLOR: Record<string, string> = {}
STAR_MAP_NODES.forEach(n => { if (n.path) PATH_COLOR[n.path] = n.emissive })

export default function MiniNav() {
  const pathname = usePathname()
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {links.map(({ href, label }) => {
          const active = pathname === href
          const isHovered = hoveredHref === href
          const planetColor = PATH_COLOR[href] ?? '#00d4ff'
          const r = parseInt(planetColor.slice(1, 3), 16)
          const g = parseInt(planetColor.slice(3, 5), 16)
          const b = parseInt(planetColor.slice(5, 7), 16)
          return (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => setHoveredHref(href)}
              onMouseLeave={() => setHoveredHref(null)}
              style={{
                padding: '5px 11px',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: (active || isHovered) ? 500 : 400,
                color: (active || isHovered) ? planetColor : 'rgba(148,163,184,0.7)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                backgroundColor: isHovered ? `rgba(${r},${g},${b},0.12)` : 'transparent',
                textShadow: (active || isHovered) ? `0 0 14px ${planetColor}` : 'none',
                border: active ? `1px solid rgba(${r},${g},${b},0.2)` : '1px solid transparent',
                transition: 'all 0.3s ease',
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
