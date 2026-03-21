'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const BANNER_KEY = 'voidexa_beta_banner_dismissed'

const links = [
  { href: '/',           label: 'Home' },
  { href: '/trading',    label: 'Trading' },
  { href: '/apps',       label: 'Apps' },
  { href: '/ai-tools',   label: 'AI Tools' },
  { href: '/services',   label: 'Services' },
  { href: '/about',      label: 'About' },
  { href: '/contact',    label: 'Contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [bannerVisible, setBanner]    = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setBanner(localStorage.getItem(BANNER_KEY) !== 'true')
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, 'true')
    setBanner(false)
  }

  // Mobile menu top offset: banner (33px) + nav bar (72px), or just nav bar
  const menuTop = bannerVisible ? 'top-[105px]' : 'top-[72px]'

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
                className="font-semibold underline underline-offset-2 hover:text-white transition-colors"
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
                  className="text-[9px] font-medium tracking-widest uppercase"
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
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      relative px-4 py-2 text-sm font-medium transition-colors duration-200
                      ${active ? 'text-[#00d4ff]' : 'text-[#94a3b8] hover:text-white'}
                    `}
                  >
                    {label}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
                        style={{ background: 'linear-gradient(90deg, #00d4ff, #8b5cf6)' }}
                      />
                    )}
                  </Link>
                )
              })}
              <Link
                href="/contact"
                className="ml-4 px-4 py-2 text-sm font-semibold rounded-full text-[#0a0a0f] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
              >
                Get in touch
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-[#94a3b8] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </header>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed ${menuTop} left-0 right-0 z-40 md:hidden`}
            style={{
              background: 'rgba(10, 10, 15, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0,212,255,0.1)',
            }}
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href
                      ? 'text-[#00d4ff] bg-[#00d4ff]/5'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
