'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { STAR_MAP_NODES } from '@/components/starmap/nodes'
import AuthButton from '@/components/AuthButton'
import { useGetInTouchModal } from '@/components/GetInTouchModal'

const BANNER_KEY = 'voidexa_beta_banner_dismissed'

const links = [
  { href: '/home',        label: 'Home'       },
  { href: '/trading',     label: 'AI Trading' },
  { href: '/apps',        label: 'Apps'       },
  { href: '/ai-tools',    label: 'AI Tools'   },
  { href: '/services',    label: 'Services'   },
]

const comingSoonLinks = [
  { href: '/ghost-ai',    label: 'Ghost AI'    },
  { href: '/quantum',     label: 'Quantum'     },
  { href: '/trading-hub', label: 'Trading Hub' },
]

const tailLinks = [
  { href: '/about',   label: 'About'   },
  { href: '/contact', label: 'Contact' },
]

// Build a map from path → emissive color (covers all nodes including undiscovered)
const PATH_COLOR: Record<string, string> = {}
STAR_MAP_NODES.forEach(n => { if (n.path) PATH_COLOR[n.path] = n.emissive })

export default function Navigation() {
  const [scrolled, setScrolled]    = useState(false)
  const [menuOpen, setMenuOpen]    = useState(false)
  const [bannerVisible, setBanner] = useState(false)
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const pathname = usePathname()
  const { open: openModal } = useGetInTouchModal()

  useEffect(() => {
    setBanner(localStorage.getItem(BANNER_KEY) !== 'true')
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, 'true')
    setBanner(false)
  }

  function getLinkColor(href: string): string {
    const active = pathname === href
    const hovered = hoveredHref === href
    if (active || hovered) {
      return PATH_COLOR[href] ?? '#00d4ff'
    }
    return '#94a3b8'
  }

  function getLinkBg(href: string): string {
    const hovered = hoveredHref === href
    if (hovered) {
      const col = PATH_COLOR[href] ?? '#00d4ff'
      // Convert hex to rgba with 0.08 opacity
      const r = parseInt(col.slice(1, 3), 16)
      const g = parseInt(col.slice(3, 5), 16)
      const b = parseInt(col.slice(5, 7), 16)
      return `rgba(${r},${g},${b},0.08)`
    }
    return 'transparent'
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* ── Beta banner ── */}
        {bannerVisible && (
          <div
            className="relative flex items-center justify-center px-8 py-2 text-xs"
            style={{
              background: 'rgba(10,10,20,0.97)',
              borderBottom: '1px solid rgba(139,92,246,0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p className="text-center text-[#94a3b8]">
              Early access — voidexa is in active development.{' '}
              Interested in beta?{' '}
              <Link
                href="/contact"
                className="font-medium underline underline-offset-2 hover:text-white transition-colors"
                style={{ color: '#00d4ff' }}
              >
                Get in touch.
              </Link>
            </p>
            <button
              onClick={dismissBanner}
              aria-label="Dismiss banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94a3b8] transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* ── Nav bar ── */}
        <header
          className="transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(7, 4, 18, 0.88)' : 'transparent',
            backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : 'none',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4), 0 1px 0 rgba(0,212,255,0.06)' : 'none',
          }}
        >
          <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-[2px] rounded-md bg-[#0a0a0f] flex items-center justify-center">
                  <span className="text-[10px] font-bold gradient-text">VX</span>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-lg font-bold tracking-tight gradient-text"
                  style={{ fontFamily: 'var(--font-space)' }}
                >
                  voidexa
                </span>
                <span
                  className="hidden sm:block text-[11px] font-medium tracking-widest uppercase"
                  style={{ color: '#666', letterSpacing: '0.12em' }}
                >
                  sovereign AI infrastructure
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(({ href, label }) => {
                const active = pathname === href
                const isHovered = hoveredHref === href
                const planetColor = PATH_COLOR[href] ?? '#00d4ff'
                const r = parseInt(planetColor.slice(1, 3), 16)
                const g = parseInt(planetColor.slice(3, 5), 16)
                const b = parseInt(planetColor.slice(5, 7), 16)
                return (
                  <div
                    key={href}
                    style={{ position: 'relative' }}
                  >
                    <Link
                      href={href}
                      onMouseEnter={() => setHoveredHref(href)}
                      onMouseLeave={() => setHoveredHref(null)}
                      style={{
                        display: 'block',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        color: (active || isHovered) ? planetColor : '#94a3b8',
                        backgroundColor: isHovered ? `rgba(${r},${g},${b},0.12)` : 'transparent',
                        textShadow: (active || isHovered) ? `0 0 14px ${planetColor}` : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {label}
                    </Link>
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 16,
                          height: 2,
                          borderRadius: 2,
                          background: planetColor,
                          boxShadow: `0 0 8px ${planetColor}`,
                        }}
                      />
                    )}
                  </div>
                )
              })}

              {/* Void Chat — NEW (right after main links) */}
              <Link
                href="/void-chat"
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all"
                style={{
                  color: pathname.startsWith('/void-chat') ? '#a78bfa' : '#7c3aed',
                  background: pathname.startsWith('/void-chat') ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.07)',
                  fontWeight: 500,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.14)' }}
                onMouseLeave={e => { if (!pathname.startsWith('/void-chat')) { (e.currentTarget as HTMLElement).style.color = '#7c3aed'; (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.07)' } }}
              >
                Void Chat
                <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em', padding: '1px 5px', borderRadius: 3, background: 'rgba(139,92,246,0.3)', color: '#c4b5fd', textTransform: 'uppercase', lineHeight: '14px' }}>
                  NEW
                </span>
              </Link>

              {/* Subtle divider */}
              <div
                style={{
                  width: 1,
                  height: 18,
                  background: 'rgba(255,255,255,0.08)',
                  margin: '0 6px',
                  flexShrink: 0,
                }}
              />

              {/* Coming soon mystery links */}
              {comingSoonLinks.map(({ href, label }) => {
                const active = pathname === href
                const isHovered = hoveredHref === href
                const planetColor = PATH_COLOR[href] ?? '#888888'
                const r = parseInt(planetColor.slice(1, 3), 16)
                const g = parseInt(planetColor.slice(3, 5), 16)
                const b = parseInt(planetColor.slice(5, 7), 16)
                return (
                  <div key={href} style={{ position: 'relative' }}>
                    <Link
                      href={href}
                      onMouseEnter={() => setHoveredHref(href)}
                      onMouseLeave={() => setHoveredHref(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        textDecoration: 'none',
                        opacity: (active || isHovered) ? 0.85 : 0.45,
                        color: (active || isHovered) ? planetColor : '#94a3b8',
                        backgroundColor: isHovered ? `rgba(${r},${g},${b},0.10)` : 'transparent',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {label}
                      <span
                        style={{
                          fontSize: '8px',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          padding: '1px 5px',
                          borderRadius: 3,
                          background: `rgba(${r},${g},${b},0.18)`,
                          color: planetColor,
                          textTransform: 'uppercase',
                          lineHeight: '14px',
                        }}
                      >
                        soon
                      </span>
                    </Link>
                  </div>
                )
              })}

              {/* About + Contact */}
              {tailLinks.map(({ href, label }) => {
                const active = pathname === href
                const isHovered = hoveredHref === href
                const planetColor = PATH_COLOR[href] ?? '#00d4ff'
                const r = parseInt(planetColor.slice(1, 3), 16)
                const g = parseInt(planetColor.slice(3, 5), 16)
                const b = parseInt(planetColor.slice(5, 7), 16)
                return (
                  <div key={href} style={{ position: 'relative' }}>
                    <Link
                      href={href}
                      onMouseEnter={() => setHoveredHref(href)}
                      onMouseLeave={() => setHoveredHref(null)}
                      style={{
                        display: 'block',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        color: (active || isHovered) ? planetColor : '#94a3b8',
                        backgroundColor: isHovered ? `rgba(${r},${g},${b},0.12)` : 'transparent',
                        textShadow: (active || isHovered) ? `0 0 14px ${planetColor}` : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {label}
                    </Link>
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 16,
                          height: 2,
                          borderRadius: 2,
                          background: planetColor,
                          boxShadow: `0 0 8px ${planetColor}`,
                        }}
                      />
                    )}
                  </div>
                )
              })}

              <Link
                href="/whitepaper"
                className="ml-2 px-3 py-2 text-sm rounded-lg transition-all"
                style={{
                  color: pathname === '/whitepaper' ? '#ccaa44' : '#64748b',
                  background: pathname === '/whitepaper' ? 'rgba(204,170,68,0.08)' : 'transparent',
                }}
                onMouseEnter={e => { if (pathname !== '/whitepaper') (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                onMouseLeave={e => { if (pathname !== '/whitepaper') (e.currentTarget as HTMLElement).style.color = '#64748b' }}
              >
                White Paper
              </Link>

              <Link
                href="/token"
                className="px-3 py-2 text-sm rounded-lg transition-all"
                style={{
                  color: pathname === '/token' ? '#ccaa44' : '#64748b',
                  background: pathname === '/token' ? 'rgba(204,170,68,0.08)' : 'transparent',
                }}
                onMouseEnter={e => { if (pathname !== '/token') (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                onMouseLeave={e => { if (pathname !== '/token') (e.currentTarget as HTMLElement).style.color = '#64748b' }}
              >
                Token
              </Link>

              <button
                onClick={() => openModal()}
                className="ml-2 px-4 py-2 text-sm font-semibold rounded-full text-[#0a0a0f] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
              >
                Get in touch
              </button>

              <div className="ml-2">
                <AuthButton />
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-[#94a3b8] hover:text-white transition-colors"
              style={{ background: 'rgba(7,4,18,0.95)' }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </header>
      </div>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{ background: 'rgba(7, 4, 18, 0.98)', backdropFilter: 'blur(24px)' }}
          >
            {/* Spacer for the fixed header (banner + nav) */}
            <div className="shrink-0" style={{ height: bannerVisible ? '105px' : '72px' }} />

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {/* Main links: Home → Services */}
              {links.map(({ href, label }, i) => {
                const active = pathname === href
                const planetColor = PATH_COLOR[href] ?? '#00d4ff'
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={href}
                      className="flex items-center w-full rounded-2xl px-5 transition-colors"
                      style={{
                        minHeight: '60px',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-space)',
                        color: active ? planetColor : '#94a3b8',
                        background: active ? `rgba(${parseInt(planetColor.slice(1,3),16)},${parseInt(planetColor.slice(3,5),16)},${parseInt(planetColor.slice(5,7),16)},0.06)` : 'transparent',
                        borderLeft: active ? `2px solid ${planetColor}` : '2px solid transparent',
                        textShadow: active ? `0 0 10px ${planetColor}66` : 'none',
                      }}
                    >
                      {label}
                    </Link>
                  </motion.div>
                )
              })}

              {/* Void Chat — NEW */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.05, duration: 0.25 }}
              >
                <Link
                  href="/void-chat"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full rounded-2xl px-5 transition-colors"
                  style={{
                    minHeight: '60px',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-space)',
                    color: pathname.startsWith('/void-chat') ? '#a78bfa' : '#7c3aed',
                    background: pathname.startsWith('/void-chat') ? 'rgba(139,92,246,0.10)' : 'transparent',
                    borderLeft: pathname.startsWith('/void-chat') ? '2px solid #a78bfa' : '2px solid transparent',
                  }}
                >
                  Void Chat
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', padding: '2px 6px', borderRadius: 4, background: 'rgba(139,92,246,0.35)', color: '#ddd6fe', textTransform: 'uppercase' }}>
                    NEW
                  </span>
                </Link>
              </motion.div>

              {/* Coming soon group */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 20px' }} />
              {comingSoonLinks.map(({ href, label }, i) => {
                const active = pathname === href
                const planetColor = PATH_COLOR[href] ?? '#888888'
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (links.length + 1 + i) * 0.05 + 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 w-full rounded-2xl px-5 transition-colors"
                      style={{
                        minHeight: '52px',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        fontFamily: 'var(--font-space)',
                        opacity: active ? 0.9 : 0.45,
                        color: active ? planetColor : '#94a3b8',
                        background: active ? `rgba(${parseInt(planetColor.slice(1,3),16)},${parseInt(planetColor.slice(3,5),16)},${parseInt(planetColor.slice(5,7),16)},0.06)` : 'transparent',
                        borderLeft: active ? `2px solid ${planetColor}` : '2px solid transparent',
                      }}
                    >
                      {label}
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: `rgba(${parseInt(planetColor.slice(1,3),16)},${parseInt(planetColor.slice(3,5),16)},${parseInt(planetColor.slice(5,7),16)},0.2)`,
                          color: planetColor,
                          textTransform: 'uppercase',
                        }}
                      >
                        soon
                      </span>
                    </Link>
                  </motion.div>
                )
              })}

              {/* About + Contact */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 20px' }} />
              {tailLinks.map(({ href, label }, i) => {
                const active = pathname === href
                const planetColor = PATH_COLOR[href] ?? '#00d4ff'
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (links.length + 1 + comingSoonLinks.length + i) * 0.05 + 0.1, duration: 0.25 }}
                  >
                    <Link
                      href={href}
                      className="flex items-center w-full rounded-2xl px-5 transition-colors"
                      style={{
                        minHeight: '52px',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        fontFamily: 'var(--font-space)',
                        color: active ? planetColor : '#94a3b8',
                        background: active ? `rgba(${parseInt(planetColor.slice(1,3),16)},${parseInt(planetColor.slice(3,5),16)},${parseInt(planetColor.slice(5,7),16)},0.06)` : 'transparent',
                        borderLeft: active ? `2px solid ${planetColor}` : '2px solid transparent',
                        textShadow: active ? `0 0 10px ${planetColor}66` : 'none',
                      }}
                    >
                      {label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Bottom CTA */}
            <div className="shrink-0 px-8 pb-12 flex flex-col gap-3">
              <Link
                href="/whitepaper"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(204,170,68,0.08)',
                  border: '1px solid rgba(204,170,68,0.25)',
                  color: '#ccaa44',
                }}
              >
                White Paper
              </Link>
              <Link
                href="/token"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(204,170,68,0.06)',
                  border: '1px solid rgba(204,170,68,0.2)',
                  color: '#ccaa44',
                }}
              >
                Token
              </Link>
              <button
                onClick={() => { setMenuOpen(false); openModal() }}
                className="flex items-center justify-center w-full rounded-full py-4 text-base font-semibold text-[#0a0a0f] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
              >
                Get in touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
