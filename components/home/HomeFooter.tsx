'use client'

import Link from 'next/link'

interface FooterColumn {
  heading: string
  links: { label: string; href: string }[]
}

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Products',
    links: [
      { label: 'AI Trading',    href: '/trading' },
      { label: 'Custom Apps',   href: '/services' },
      { label: 'Apps',          href: '/apps' },
      { label: 'AI Tools',      href: '/ai-tools' },
      { label: 'Services',      href: '/services' },
    ],
  },
  {
    heading: 'Universe',
    links: [
      { label: 'Galaxy',        href: '/starmap' },
      { label: 'Free Flight',   href: '/freeflight' },
      { label: 'Shop',          href: '/shop' },
      { label: 'Cards',         href: '/cards' },
      { label: 'Achievements',  href: '/achievements' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'Team',          href: '/team' },
      { label: 'Station',       href: '/station' },
      { label: 'White Paper',   href: '/white-paper' },
      { label: 'Contact',       href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      // Placeholder routes — content stubs live under /contact until legal
      // review ships. Linking them now so the footer layout survives the
      // page rollout.
      { label: 'Terms',         href: '/contact' },
      { label: 'Privacy',       href: '/contact' },
      { label: 'Cookie Policy', href: '/contact' },
      { label: 'CVR 46343387',  href: '/contact' },
    ],
  },
]

export default function HomeFooter() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      padding: '60px 24px 32px',
      background: 'linear-gradient(180deg, #050813 0%, #02030a 100%)',
      color: '#fff',
      borderTop: '1px solid rgba(0,212,255,0.12)',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 28,
          marginBottom: 36,
        }}>
          {COLUMNS.map(col => (
            <div key={col.heading}>
              <div style={{
                fontSize: 13,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#00d4ff',
                fontFamily: 'var(--font-space, monospace)',
                marginBottom: 12,
                textShadow: '0 0 8px rgba(0,212,255,0.5)',
              }}>
                {col.heading}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {col.links.map(link => (
                  <li key={`${col.heading}-${link.label}`} style={{ marginBottom: 8 }}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: 15,
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-inter, system-ui)',
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          paddingTop: 22,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-inter, system-ui)',
          }}>
            © {year} voidexa. CVR 46343387. Built from Denmark.
          </div>
          <div style={{
            fontSize: 13,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.6)',
            fontFamily: 'var(--font-space, monospace)',
            textShadow: '0 0 8px rgba(0,212,255,0.35)',
          }}>
            voidexa · Sovereign AI Infrastructure
          </div>
        </div>
      </div>
    </footer>
  )
}
