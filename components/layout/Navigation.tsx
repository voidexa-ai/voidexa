'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { STAR_MAP_NODES } from '@/components/starmap/nodes'
import AuthButton from '@/components/AuthButton'
import { useGetInTouchModal } from '@/components/GetInTouchModal'

const BANNER_KEY = 'voidexa_beta_banner_dismissed'
const LAUNCH_DATE = new Date('2026-04-05T00:00:00Z')

function getCountdown(): string {
  const now = new Date()
  const diff = LAUNCH_DATE.getTime() - now.getTime()
  if (diff <= 0) return 'Live now!'
  const totalSeconds = Math.floor(diff / 1000)
  const days  = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const mins  = Math.floor((totalSeconds % 3600) / 60)
  const secs  = totalSeconds % 60
  if (days > 0) return `${days}d ${hours}h ${mins}m ${secs}s`
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`
  return `${mins}m ${secs}s`
}

// Main nav links — center of navbar
const mainLinks = [
  { href: '/home',     label: 'Home'       },
  { href: '/trading',  label: 'AI Trading' },
  { href: '/apps',     label: 'Apps'       },
  { href: '/ai-tools', label: 'AI Tools'   },
  { href: '/services', label: 'Services'   },
]

// "More" dropdown items
const moreLinks = [
  { href: '/ghost-ai',    label: 'Ghost AI',     badge: null   },
  { href: '/quantum',     label: 'Quantum',      badge: 'SOON' },
  { href: '/trading-hub', label: 'Trading Hub',  badge: null   },
  { href: '/station',     label: 'Space Station', badge: 'NEW'  },
  null, // divider
  { href: '/about',       label: 'About',        badge: null   },
  { href: '/contact',     label: 'Contact',      badge: null   },
  null, // divider
  { href: '/whitepaper',  label: 'White Paper',  badge: null   },
  { href: '/token',       label: 'Token',        badge: null   },
] as const

// Mobile: all secondary links (shown below main links in hamburger)
const mobileSecondary = [
  { href: '/ghost-ai',    label: 'Ghost AI',     badge: null   },
  { href: '/quantum',     label: 'Quantum',      badge: 'SOON' },
  { href: '/trading-hub', label: 'Trading Hub',  badge: null   },
  { href: '/station',     label: 'Space Station', badge: 'NEW'  },
  { href: '/about',       label: 'About',        badge: null   },
  { href: '/contact',     label: 'Contact',      badge: null   },
  { href: '/whitepaper',  label: 'White Paper',  badge: null   },
  { href: '/token',       label: 'Token',        badge: null   },
] as const

const PATH_COLOR: Record<string, string> = {}
STAR_MAP_NODES.forEach(n => { if (n.path) PATH_COLOR[n.path] = n.emissive })

export default function Navigation() {
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [moreOpen, setMoreOpen]       = useState(false)
  const [bannerVisible, setBanner]    = useState(false)
  const [countdown, setCountdown]     = useState('')
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const pathname = usePathname()
  const { open: openModal } = useGetInTouchModal()
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setBanner(localStorage.getItem(BANNER_KEY) !== 'true')
    setCountdown(getCountdown())
    const tick = setInterval(() => setCountdown(getCountdown()), 1000)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearInterval(tick); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => { setMenuOpen(false); setMoreOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close "More" on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    if (moreOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [moreOpen])

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, 'true')
    setBanner(false)
    // Notify VoidChatShell if open
    window.dispatchEvent(new CustomEvent('banner-dismissed'))
  }

  function linkColor(href: string): string {
    return (pathname === href || hoveredHref === href) ? (PATH_COLOR[href] ?? '#00d4ff') : '#94a3b8'
  }

  function linkBg(href: string): string {
    if (hoveredHref !== href) return 'transparent'
    const col = PATH_COLOR[href] ?? '#00d4ff'
    const r = parseInt(col.slice(1,3),16), g = parseInt(col.slice(3,5),16), b = parseInt(col.slice(5,7),16)
    return `rgba(${r},${g},${b},0.10)`
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* ── Countdown banner ── */}
        {bannerVisible && (
          <div
            className="relative flex items-center justify-center px-10 py-2"
            style={{
              background: 'linear-gradient(90deg,rgba(10,8,20,0.98) 0%,rgba(22,10,45,0.98) 50%,rgba(10,8,20,0.98) 100%)',
              borderBottom: '1px solid rgba(139,92,246,0.18)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <p className="text-center text-[11px] tracking-wide select-none" style={{ color: 'rgba(200,190,230,0.85)' }}>
              <span className="font-semibold" style={{ color: 'rgba(220,210,255,0.95)' }}>Early Access</span>
              {' '}—{' '}We&apos;re building something big.{' '}
              <span className="font-bold tabular-nums" style={{ color: 'rgba(180,145,255,0.95)' }}>
                {countdown}
              </span>
            </p>
            <button
              onClick={dismissBanner}
              aria-label="Dismiss"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors"
              style={{ color: 'rgba(139,92,246,0.45)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(200,180,255,0.8)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(139,92,246,0.45)'}
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* ── Nav bar ── */}
        <header
          className="transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(7,4,18,0.88)' : 'transparent',
            backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : 'none',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4),0 1px 0 rgba(0,212,255,0.06)' : 'none',
          }}
        >
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-[2px] rounded-md bg-[#0a0a0f] flex items-center justify-center">
                  <span className="text-[10px] font-bold gradient-text">VX</span>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight gradient-text" style={{ fontFamily: 'var(--font-space)' }}>
                  voidexa
                </span>
                <span className="hidden sm:block text-[11px] font-medium tracking-widest uppercase" style={{ color: '#666', letterSpacing: '0.12em' }}>
                  sovereign AI infrastructure
                </span>
              </div>
            </Link>

            {/* Desktop: main links */}
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {mainLinks.map(({ href, label }) => {
                const active = pathname === href
                const planetColor = PATH_COLOR[href] ?? '#00d4ff'
                const r = parseInt(planetColor.slice(1,3),16), g = parseInt(planetColor.slice(3,5),16), b = parseInt(planetColor.slice(5,7),16)
                return (
                  <div key={href} style={{ position: 'relative' }}>
                    <Link
                      href={href}
                      onMouseEnter={() => setHoveredHref(href)}
                      onMouseLeave={() => setHoveredHref(null)}
                      style={{
                        display: 'block', padding: '6px 12px', borderRadius: 6,
                        fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
                        color: (active || hoveredHref === href) ? planetColor : '#94a3b8',
                        background: hoveredHref === href ? `rgba(${r},${g},${b},0.10)` : 'transparent',
                        textShadow: (active || hoveredHref === href) ? `0 0 14px ${planetColor}` : 'none',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {label}
                    </Link>
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        style={{
                          position: 'absolute', bottom: 0, left: '50%',
                          transform: 'translateX(-50%)',
                          width: 16, height: 2, borderRadius: 2,
                          background: planetColor, boxShadow: `0 0 8px ${planetColor}`,
                        }}
                      />
                    )}
                  </div>
                )
              })}

              {/* Void Chat — NEW */}
              <Link
                href="/void-chat"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all ml-1"
                style={{
                  color: pathname.startsWith('/void-chat') ? '#a78bfa' : '#8b5cf6',
                  background: pathname.startsWith('/void-chat') ? 'rgba(139,92,246,0.14)' : 'rgba(139,92,246,0.08)',
                  fontWeight: 500,
                  border: '1px solid rgba(139,92,246,0.25)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.18)'; (e.currentTarget as HTMLElement).style.color = '#c4b5fd' }}
                onMouseLeave={e => { if (!pathname.startsWith('/void-chat')) { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.08)'; (e.currentTarget as HTMLElement).style.color = '#8b5cf6' } }}
              >
                Void Chat
                <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', padding: '1px 5px', borderRadius: 3, background: 'rgba(139,92,246,0.35)', color: '#ddd6fe', textTransform: 'uppercase', lineHeight: '14px' }}>
                  NEW
                </span>
              </Link>

              {/* More dropdown */}
              <div ref={moreRef} style={{ position: 'relative', marginLeft: 4 }}>
                <button
                  onClick={() => setMoreOpen(v => !v)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: moreOpen ? '#e2e8f0' : '#64748b',
                    background: moreOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!moreOpen) (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                  onMouseLeave={e => { if (!moreOpen) (e.currentTarget as HTMLElement).style.color = '#64748b' }}
                >
                  More
                  <motion.span animate={{ rotate: moreOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: '100%', right: 0, marginTop: 8,
                        minWidth: 200, borderRadius: 12, padding: '6px 0',
                        background: 'rgba(12,8,28,0.97)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08)',
                        zIndex: 100,
                      }}
                    >
                      {moreLinks.map((item, i) => {
                        if (item === null) return (
                          <div key={`div-${i}`} style={{ height: 1, margin: '6px 12px', background: 'rgba(255,255,255,0.06)' }} />
                        )
                        const active = pathname === item.href
                        const col = PATH_COLOR[item.href] ?? '#94a3b8'
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMoreOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors"
                            style={{
                              color: active ? col : 'rgba(148,163,184,0.85)',
                              background: active ? `rgba(${parseInt(col.slice(1,3),16)},${parseInt(col.slice(3,5),16)},${parseInt(col.slice(5,7),16)},0.08)` : 'transparent',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.08)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = active ? `rgba(${parseInt(col.slice(1,3),16)},${parseInt(col.slice(3,5),16)},${parseInt(col.slice(5,7),16)},0.08)` : 'transparent'}
                          >
                            <span>{item.label}</span>
                            {item.badge && (
                              <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', padding: '1px 5px', borderRadius: 3, background: `rgba(${parseInt(col.slice(1,3),16)},${parseInt(col.slice(3,5),16)},${parseInt(col.slice(5,7),16)},0.18)`, color: col, textTransform: 'uppercase' }}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop right: CTA + auth */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={() => openModal()}
                className="px-4 py-2 text-sm font-semibold rounded-full text-[#0a0a0f] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#8b5cf6)' }}
              >
                Get in touch
              </button>
              <AuthButton />
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
            style={{ background: 'rgba(7,4,18,0.98)', backdropFilter: 'blur(24px)' }}
          >
            <div className="shrink-0" style={{ height: bannerVisible ? '105px' : '72px' }} />

            <nav className="flex-1 flex flex-col justify-center px-8 gap-0.5 overflow-y-auto py-4">
              {/* Main links */}
              {mainLinks.map(({ href, label }, i) => {
                const active = pathname === href
                const planetColor = PATH_COLOR[href] ?? '#00d4ff'
                const r = parseInt(planetColor.slice(1,3),16), g = parseInt(planetColor.slice(3,5),16), b = parseInt(planetColor.slice(5,7),16)
                return (
                  <motion.div key={href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.22 }}>
                    <Link
                      href={href}
                      className="flex items-center w-full rounded-2xl px-5 transition-colors"
                      style={{
                        minHeight: 56, fontSize: '1.2rem', fontWeight: 600,
                        fontFamily: 'var(--font-space)',
                        color: active ? planetColor : '#94a3b8',
                        background: active ? `rgba(${r},${g},${b},0.06)` : 'transparent',
                        borderLeft: active ? `2px solid ${planetColor}` : '2px solid transparent',
                        textShadow: active ? `0 0 10px ${planetColor}66` : 'none',
                      }}
                    >
                      {label}
                    </Link>
                  </motion.div>
                )
              })}

              {/* Void Chat */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: mainLinks.length * 0.04, duration: 0.22 }}>
                <Link
                  href="/void-chat"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full rounded-2xl px-5 transition-colors"
                  style={{
                    minHeight: 56, fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-space)',
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

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 20px' }} />

              {/* Secondary links */}
              {mobileSecondary.map(({ href, label, badge }, i) => {
                const active = pathname === href
                const planetColor = PATH_COLOR[href] ?? '#888'
                const r = parseInt(planetColor.slice(1,3),16), g = parseInt(planetColor.slice(3,5),16), b = parseInt(planetColor.slice(5,7),16)
                return (
                  <motion.div key={href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (mainLinks.length + 1 + i) * 0.04 + 0.04, duration: 0.22 }}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 w-full rounded-2xl px-5 transition-colors"
                      style={{
                        minHeight: 48, fontSize: '1rem', fontWeight: 500, fontFamily: 'var(--font-space)',
                        opacity: active ? 1 : (badge === 'SOON' ? 0.5 : 0.75),
                        color: active ? planetColor : '#94a3b8',
                        background: active ? `rgba(${r},${g},${b},0.06)` : 'transparent',
                        borderLeft: active ? `2px solid ${planetColor}` : '2px solid transparent',
                      }}
                    >
                      {label}
                      {badge && (
                        <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', padding: '2px 6px', borderRadius: 4, background: `rgba(${r},${g},${b},0.2)`, color: planetColor, textTransform: 'uppercase' }}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Bottom CTA */}
            <div className="shrink-0 px-8 pb-12">
              <button
                onClick={() => { setMenuOpen(false); openModal() }}
                className="flex items-center justify-center w-full rounded-full py-4 text-base font-semibold text-[#0a0a0f] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#8b5cf6)' }}
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
