'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Info } from 'lucide-react'
import { STAR_MAP_NODES } from '@/components/starmap/nodes'
import AuthButton from '@/components/AuthButton'
import { useGetInTouchModal } from '@/components/GetInTouchModal'

const BANNER_KEY = 'voidexa_beta_banner_dismissed'

// FIX 2: All products visible in top nav
const mainLinks = [
  { href: '/home',        label: 'Home',        badge: null   },
  { href: '/trading',     label: 'AI Trading',  badge: null   },
  { href: '/trading-hub', label: 'Trading Hub', badge: null   },
  { href: '/apps',        label: 'Apps',        badge: null   },
  { href: '/ai-tools',    label: 'AI Tools',    badge: null   },
  { href: '/services',    label: 'Services',    badge: null   },
  { href: '/station',     label: 'Station',     badge: null   },
  { href: '/quantum',     label: 'Quantum',     badge: 'SOON' },
]

// FIX 3: Info panel links (removed from top nav)
const infoPanelLinks = [
  { href: '/about',      label: 'About'       },
  { href: '/contact',    label: 'Contact'     },
  { href: '/ghost-ai',   label: 'Ghost AI'    },
  { href: '/token',      label: 'Token'       },
  { href: '/whitepaper', label: 'White Paper' },
]

// Mobile: secondary links
const mobileSecondary = [
  { href: '/station',    label: 'Space Station', badge: 'NEW'  },
  { href: '/about',      label: 'About',         badge: null   },
  { href: '/contact',    label: 'Contact',       badge: null   },
  { href: '/ghost-ai',   label: 'Ghost AI',      badge: null   },
  { href: '/token',      label: 'Token',         badge: null   },
  { href: '/whitepaper', label: 'White Paper',   badge: null   },
] as const

// FIX 4: Page label map for breadcrumb
const PAGE_LABELS: Record<string, string> = {
  '/':             'Home',
  '/home':         'Home',
  '/trading':      'AI Trading',
  '/trading-hub':  'Trading Hub',
  '/apps':         'Apps',
  '/ai-tools':     'AI Tools',
  '/services':     'Services',
  '/void-chat':    'Void Chat',
  '/quantum':      'Quantum',
  '/station':      'Space Station',
  '/about':        'About',
  '/contact':      'Contact',
  '/ghost-ai':     'Ghost AI',
  '/token':        'Token',
  '/whitepaper':   'White Paper',
  '/products':     'Products',
  '/profile':      'Profile',
}

function getPageLabel(pathname: string): string {
  if (pathname.startsWith('/void-chat')) return 'Void Chat'
  if (pathname.startsWith('/trading-hub/')) return 'Trading Hub'
  return PAGE_LABELS[pathname] ?? ''
}

const PATH_COLOR: Record<string, string> = {}
STAR_MAP_NODES.forEach(n => { if (n.path) PATH_COLOR[n.path] = n.emissive })

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

export default function Navigation() {
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [infoPanelOpen, setInfoPanel] = useState(false)
  const [bannerVisible, setBanner]    = useState(false)
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const pathname = usePathname()
  const { open: openModal } = useGetInTouchModal()

  useEffect(() => {
    setBanner(localStorage.getItem(BANNER_KEY) !== 'true')
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => { setMenuOpen(false); setInfoPanel(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen || infoPanelOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, infoPanelOpen])

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, 'true')
    setBanner(false)
    window.dispatchEvent(new CustomEvent('banner-dismissed'))
  }

  const pageLabel = getPageLabel(pathname)

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* ── Countdown banner ── */}
        {bannerVisible && (
          <div
            className="relative flex items-center justify-center px-10"
            style={{
              background: 'linear-gradient(90deg,rgba(10,8,20,0.98) 0%,rgba(22,10,45,0.98) 50%,rgba(10,8,20,0.98) 100%)',
              borderBottom: '1px solid rgba(139,92,246,0.18)',
              backdropFilter: 'blur(16px)',
              paddingTop: '12px',
              paddingBottom: '12px',
            }}
          >
            <p className="text-center select-none" style={{ color: 'rgba(200,190,230,0.9)', fontSize: '15px', fontWeight: 500 }}>
              <span style={{ color: 'rgba(220,210,255,0.98)', fontWeight: 600 }}>Early Access</span>
              {' '}— Limited slots available. We onboard users personally to ensure quality.
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
          <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-[2px] rounded-md bg-[#0a0a0f] flex items-center justify-center">
                  <span className="text-sm font-bold gradient-text">VX</span>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight gradient-text" style={{ fontFamily: 'var(--font-space)' }}>
                  voidexa
                </span>
                <span className="hidden xl:block text-sm font-medium tracking-widest uppercase" style={{ color: '#555', letterSpacing: '0.1em' }}>
                  sovereign AI
                </span>
              </div>
            </Link>

            {/* Desktop: main links — FIX 1 + FIX 2 */}
            <div className="hidden lg:flex items-center gap-0 flex-1 justify-center">
              {mainLinks.map(({ href, label, badge }) => {
                const active = href === '/trading-hub'
                  ? pathname.startsWith('/trading-hub')
                  : pathname === href
                const planetColor = PATH_COLOR[href] ?? '#00d4ff'
                const { r, g, b } = hexToRgb(planetColor)
                return (
                  <div key={href} style={{ position: 'relative' }}>
                    <Link
                      href={href}
                      onMouseEnter={() => setHoveredHref(href)}
                      onMouseLeave={() => setHoveredHref(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 3,
                        padding: '5px 9px', borderRadius: 6,
                        fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none',
                        color: (active || hoveredHref === href) ? planetColor : '#94a3b8',
                        background: active
                          ? `rgba(${r},${g},${b},0.10)`
                          : hoveredHref === href ? `rgba(${r},${g},${b},0.07)` : 'transparent',
                        textShadow: (active || hoveredHref === href) ? `0 0 12px ${planetColor}` : 'none',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {label}
                      {badge && (
                        <span style={{
                          fontSize: '7px', fontWeight: 700, letterSpacing: '0.08em',
                          padding: '1px 4px', borderRadius: 3,
                          background: `rgba(${r},${g},${b},0.18)`, color: planetColor,
                          textTransform: 'uppercase', lineHeight: '12px',
                        }}>
                          {badge}
                        </span>
                      )}
                    </Link>
                    {/* FIX 1: active indicator — animated underline */}
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

              {/* Void Chat */}
              <div style={{ position: 'relative', marginLeft: 2 }}>
                <Link
                  href="/void-chat"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '5px 9px', borderRadius: 6,
                    fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none',
                    color: pathname.startsWith('/void-chat') ? '#a78bfa' : '#8b5cf6',
                    background: pathname.startsWith('/void-chat') ? 'rgba(139,92,246,0.14)' : 'rgba(139,92,246,0.07)',
                    border: '1px solid rgba(139,92,246,0.22)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.18)'; (e.currentTarget as HTMLElement).style.color = '#c4b5fd' }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    if (pathname.startsWith('/void-chat')) {
                      el.style.background = 'rgba(139,92,246,0.14)'; el.style.color = '#a78bfa'
                    } else {
                      el.style.background = 'rgba(139,92,246,0.07)'; el.style.color = '#8b5cf6'
                    }
                  }}
                >
                  Void Chat
                  <span style={{
                    fontSize: '7px', fontWeight: 700, letterSpacing: '0.08em',
                    padding: '1px 4px', borderRadius: 3,
                    background: 'rgba(139,92,246,0.35)', color: '#ddd6fe',
                    textTransform: 'uppercase', lineHeight: '12px',
                  }}>
                    NEW
                  </span>
                </Link>
                {/* FIX 1: active indicator for Void Chat */}
                {pathname.startsWith('/void-chat') && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute', bottom: 0, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 16, height: 2, borderRadius: 2,
                      background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6',
                    }}
                  />
                )}
              </div>

            </div>

            {/* Desktop right: CTA + auth */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                onClick={() => openModal()}
                className="px-3 py-1.5 text-sm font-semibold rounded-full text-[#0a0a0f] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#8b5cf6)' }}
              >
                Get in touch
              </button>
              <AuthButton />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#94a3b8] hover:text-white transition-colors"
              style={{ background: 'rgba(7,4,18,0.95)' }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </header>

        {/* FIX 4: Page name breadcrumb — subtle label below nav */}
        {pageLabel && (
          <div
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.03), transparent)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              padding: '2px 0 3px',
              textAlign: 'center',
            }}
          >
            <span style={{
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(148,163,184,0.45)',
              fontFamily: 'var(--font-space)',
              userSelect: 'none',
            }}>
              {pageLabel}
            </span>
          </div>
        )}
      </div>

      {/* FIX 3: Floating side button — right edge, vertically centered, pulsing glow */}
      <motion.button
        onClick={() => setInfoPanel(true)}
        animate={{
          boxShadow: [
            '-2px 0 12px rgba(0,212,255,0.15), inset 0 0 8px rgba(0,212,255,0.05)',
            '-4px 0 28px rgba(0,212,255,0.5), inset 0 0 14px rgba(0,212,255,0.12)',
            '-2px 0 12px rgba(0,212,255,0.15), inset 0 0 8px rgba(0,212,255,0.05)',
          ],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ x: -3, background: 'rgba(0,30,45,0.98)' }}
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 39,
          background: 'rgba(7,15,25,0.95)',
          border: '1px solid rgba(0,212,255,0.35)',
          borderRight: 'none',
          borderRadius: '10px 0 0 10px',
          padding: '18px 0',
          width: '44px',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
        aria-label="Open info panel"
      >
        <Info size={16} style={{ color: 'rgba(0,212,255,0.85)' }} />
        <span style={{
          writingMode: 'vertical-rl',
          display: 'block',
          fontSize: '14px',
          color: 'rgba(0,212,255,0.7)',
          letterSpacing: '0.22em',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontFamily: 'var(--font-space)',
          userSelect: 'none',
        }}>
          INFO
        </span>
      </motion.button>

      {/* FIX 3: Info slide-out panel */}
      <AnimatePresence>
        {infoPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setInfoPanel(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 45,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
              }}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'fixed', right: 0, top: 0, bottom: 0,
                width: 300, zIndex: 50,
                background: 'rgba(9,5,22,0.99)',
                borderLeft: '1px solid rgba(139,92,246,0.22)',
                backdropFilter: 'blur(24px)',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Panel header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '22px 24px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div>
                  <p style={{
                    fontSize: 14, fontWeight: 700, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'rgba(139,92,246,0.65)',
                    marginBottom: 3, fontFamily: 'var(--font-space)',
                  }}>
                    VOIDEXA
                  </p>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', fontFamily: 'var(--font-space)' }}>
                    Info &amp; Links
                  </h2>
                </div>
                <button
                  onClick={() => setInfoPanel(false)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#64748b', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e2e8f0'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Panel links */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {infoPanelLinks.map(({ href, label }, i) => {
                  const active = pathname === href
                  const col = PATH_COLOR[href] ?? '#94a3b8'
                  const { r, g, b } = hexToRgb(col)
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.05, duration: 0.2 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setInfoPanel(false)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 24px',
                          fontSize: 14, fontWeight: active ? 600 : 400,
                          color: active ? col : '#94a3b8',
                          background: active ? `rgba(${r},${g},${b},0.08)` : 'transparent',
                          borderLeft: active ? `2px solid ${col}` : '2px solid transparent',
                          textDecoration: 'none', transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = `rgba(${r},${g},${b},0.06)`
                          el.style.color = col
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = active ? `rgba(${r},${g},${b},0.08)` : 'transparent'
                          el.style.color = active ? col : '#94a3b8'
                        }}
                      >
                        <span>{label}</span>
                        {active && (
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: col, boxShadow: `0 0 8px ${col}`,
                            display: 'inline-block',
                          }} />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Panel footer */}
              <div style={{ padding: '16px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => { setInfoPanel(false); openModal() }}
                  className="w-full py-3 text-sm font-semibold rounded-full text-[#0a0a0f] transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#00d4ff,#8b5cf6)' }}
                >
                  Get in touch
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden flex flex-col"
            style={{ background: 'rgba(7,4,18,0.98)', backdropFilter: 'blur(24px)' }}
          >
            <div className="shrink-0" style={{ height: bannerVisible ? '105px' : '72px' }} />

            <nav className="flex-1 flex flex-col justify-center px-8 gap-0.5 overflow-y-auto py-4">
              {/* Main links */}
              {mainLinks.map(({ href, label, badge }, i) => {
                const active = href === '/trading-hub'
                  ? pathname.startsWith('/trading-hub')
                  : pathname === href
                const planetColor = PATH_COLOR[href] ?? '#00d4ff'
                const { r, g, b } = hexToRgb(planetColor)
                return (
                  <motion.div key={href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.22 }}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 w-full rounded-2xl px-5 transition-colors"
                      style={{
                        minHeight: 52, fontSize: '1.1rem', fontWeight: 600,
                        fontFamily: 'var(--font-space)',
                        color: active ? planetColor : '#94a3b8',
                        background: active ? `rgba(${r},${g},${b},0.06)` : 'transparent',
                        borderLeft: active ? `2px solid ${planetColor}` : '2px solid transparent',
                        textShadow: active ? `0 0 10px ${planetColor}66` : 'none',
                      }}
                    >
                      {label}
                      {badge && (
                        <span style={{
                          fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em',
                          padding: '2px 6px', borderRadius: 4,
                          background: `rgba(${r},${g},${b},0.2)`, color: planetColor, textTransform: 'uppercase',
                        }}>
                          {badge}
                        </span>
                      )}
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
                    minHeight: 52, fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-space)',
                    color: pathname.startsWith('/void-chat') ? '#a78bfa' : '#7c3aed',
                    background: pathname.startsWith('/void-chat') ? 'rgba(139,92,246,0.10)' : 'transparent',
                    borderLeft: pathname.startsWith('/void-chat') ? '2px solid #a78bfa' : '2px solid transparent',
                  }}
                >
                  Void Chat
                  <span style={{
                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                    padding: '2px 6px', borderRadius: 4,
                    background: 'rgba(139,92,246,0.35)', color: '#ddd6fe', textTransform: 'uppercase',
                  }}>
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
                const { r, g, b } = hexToRgb(planetColor)
                return (
                  <motion.div key={href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (mainLinks.length + 1 + i) * 0.04 + 0.04, duration: 0.22 }}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 w-full rounded-2xl px-5 transition-colors"
                      style={{
                        minHeight: 44, fontSize: '1rem', fontWeight: 500, fontFamily: 'var(--font-space)',
                        opacity: active ? 1 : 0.75,
                        color: active ? planetColor : '#94a3b8',
                        background: active ? `rgba(${r},${g},${b},0.06)` : 'transparent',
                        borderLeft: active ? `2px solid ${planetColor}` : '2px solid transparent',
                      }}
                    >
                      {label}
                      {badge && (
                        <span style={{
                          fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em',
                          padding: '2px 6px', borderRadius: 4,
                          background: `rgba(${r},${g},${b},0.2)`, color: planetColor, textTransform: 'uppercase',
                        }}>
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
