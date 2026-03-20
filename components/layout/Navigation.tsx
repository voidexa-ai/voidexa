'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

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
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
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
            <span
              className="text-lg font-bold tracking-tight gradient-text"
              style={{ fontFamily: 'var(--font-space)' }}
            >
              voidexa
            </span>
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

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 z-40 md:hidden"
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
