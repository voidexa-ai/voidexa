'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, LayoutDashboard, Menu, X } from 'lucide-react'
import AuthButton from '@/components/AuthButton'
import { useGetInTouchModal } from '@/components/GetInTouchModal'
import { useAuth } from '@/components/AuthProvider'
import { useI18n } from '@/lib/i18n/context'
import { stripLocale } from '@/lib/i18n/locale'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

interface NavLink {
  href: string
  label: string
  description?: string
  badge?: string
}

interface NavGroup {
  label: string
  href?: string // optional top-level target
  children?: NavLink[]
}

function isActiveGroup(group: NavGroup, pathname: string): boolean {
  if (group.href && pathname === group.href) return true
  if (group.children?.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))) return true
  return false
}

export default function Navigation() {
  const rawPathname = usePathname()
  const pathname = stripLocale(rawPathname)
  const { t, localizeHref } = useI18n()
  const tLink = (href: string, fallback: string) => t.nav.items[href]?.label ?? fallback
  const tDesc = (href: string) => t.nav.items[href]?.description
  const NAV_GROUPS: NavGroup[] = [
    { label: t.nav.home, href: '/' },
    {
      label: t.nav.products,
      children: [
        { href: '/trading',  label: tLink('/trading', 'AI Trading (LIVE)'),            description: tDesc('/trading') },
        { href: '/services', label: tLink('/services', 'Custom Apps (BETA)'),          description: tDesc('/services') },
        { href: '/apps',     label: tLink('/apps', 'Apps'),                            description: tDesc('/apps') ?? 'All voidexa apps and products', badge: 'BETA' },
        { href: '/ai-tools', label: tLink('/ai-tools', 'AI Tools (IN DEV)'),           description: tDesc('/ai-tools') },
      ],
    },
    {
      label: t.nav.universe,
      children: [
        { href: '/starmap',      label: tLink('/starmap', 'Star Map'),           description: tDesc('/starmap') },
        { href: '/freeflight',   label: tLink('/freeflight', 'Free Flight'),    description: tDesc('/freeflight') },
        { href: '/shop',         label: tLink('/shop', 'Shop'),                 description: tDesc('/shop') },
        { href: '/cards',        label: tLink('/cards', 'Cards'),               description: tDesc('/cards') },
        { href: '/achievements', label: tLink('/achievements', 'Achievements'), description: tDesc('/achievements') },
        { href: '/assembly-editor', label: tLink('/assembly-editor', 'Assembly Editor'), description: tDesc('/assembly-editor') },
      ],
    },
    {
      label: t.nav.about,
      children: [
        { href: '/team',       label: tLink('/team', 'Team'),              description: tDesc('/team') },
        { href: '/station',    label: tLink('/station', 'Station'),        description: tDesc('/station') },
        { href: '/whitepaper', label: tLink('/whitepaper', 'White Paper'), description: tDesc('/whitepaper') },
        { href: '/contact',    label: tLink('/contact', 'Contact'),        description: tDesc('/contact') },
      ],
    },
    { label: t.nav.breakRoom, href: '/break-room' },
  ]
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { open: openModal } = useGetInTouchModal()
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenGroup(null)
    setMobileExpanded(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!user) { setIsAdmin(false); return }
    fetch('/api/auth/role')
      .then(r => r.json())
      .then(({ role }) => setIsAdmin(role === 'admin'))
      .catch(() => setIsAdmin(false))
  }, [user?.id])

  if (pathname === '/freeflight' || pathname === '/assembly-editor') return null

  const handleGroupEnter = (label: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setOpenGroup(label)
  }

  const handleGroupLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => setOpenGroup(null), 120)
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <header
          className="transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(7,4,18,0.92)' : 'rgba(7,4,18,0.60)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : '1px solid rgba(255,255,255,0.04)',
            boxShadow: scrolled
              ? '0 4px 30px rgba(0,0,0,0.4),0 1px 0 rgba(0,212,255,0.06)'
              : '0 2px 16px rgba(0,0,0,0.3)',
          }}
        >
          <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            {/* Logo */}
            <Link href={localizeHref('/')} className="flex items-center gap-2 group shrink-0">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-[2px] rounded-md bg-[#0a0a0f] flex items-center justify-center">
                  <span className="text-sm font-bold gradient-text">VX</span>
                </div>
              </div>
              <span
                className="text-lg font-bold tracking-tight gradient-text"
                style={{ fontFamily: 'var(--font-space)' }}
              >
                voidexa
              </span>
            </Link>

            {/* Desktop groups */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_GROUPS.map(group => {
                const active = isActiveGroup(group, pathname)
                const isOpen = openGroup === group.label
                if (!group.children) {
                  return (
                    <Link
                      key={group.label}
                      href={localizeHref(group.href!)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 8,
                        fontSize: 15,
                        fontWeight: 500,
                        textDecoration: 'none',
                        color: active ? '#00d4ff' : '#cbd5e1',
                        background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                        textShadow: active ? '0 0 10px rgba(0,212,255,0.5)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {group.label}
                    </Link>
                  )
                }
                return (
                  <div
                    key={group.label}
                    onMouseEnter={() => handleGroupEnter(group.label)}
                    onMouseLeave={handleGroupLeave}
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={() => setOpenGroup(isOpen ? null : group.label)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '7px 14px',
                        borderRadius: 8,
                        fontSize: 15,
                        fontWeight: 500,
                        color: active || isOpen ? '#00d4ff' : '#cbd5e1',
                        background: active || isOpen ? 'rgba(0,212,255,0.08)' : 'transparent',
                        textShadow: active || isOpen ? '0 0 10px rgba(0,212,255,0.5)' : 'none',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        border: 'none',
                        fontFamily: 'inherit',
                      }}
                    >
                      {group.label}
                      <ChevronDown
                        size={14}
                        style={{
                          transition: 'transform 0.2s',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        }}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.16 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: 8,
                            minWidth: 280,
                            padding: 8,
                            background: 'rgba(7,8,22,0.96)',
                            border: '1px solid rgba(0,212,255,0.18)',
                            borderRadius: 12,
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 18px 44px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.06)',
                            zIndex: 60,
                          }}
                        >
                          {group.children.map(link => {
                            const linkActive =
                              pathname === link.href || pathname.startsWith(link.href + '/')
                            return (
                              <Link
                                key={`${link.href}-${link.label}`}
                                href={localizeHref(link.href)}
                                onClick={() => setOpenGroup(null)}
                                style={{
                                  display: 'block',
                                  padding: '10px 12px',
                                  borderRadius: 8,
                                  textDecoration: 'none',
                                  background: linkActive ? 'rgba(0,212,255,0.1)' : 'transparent',
                                  transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => {
                                  ;(e.currentTarget as HTMLElement).style.background =
                                    'rgba(0,212,255,0.08)'
                                }}
                                onMouseLeave={e => {
                                  ;(e.currentTarget as HTMLElement).style.background = linkActive
                                    ? 'rgba(0,212,255,0.1)'
                                    : 'transparent'
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 14.5,
                                    fontWeight: 600,
                                    color: linkActive ? '#00d4ff' : '#e2e8f0',
                                    letterSpacing: '-0.005em',
                                    fontFamily: 'var(--font-space)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                  }}
                                >
                                  <span>{link.label}</span>
                                  {link.badge && (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: '0.08em',
                                        padding: '2px 6px',
                                        borderRadius: 4,
                                        background: 'rgba(0,212,255,0.18)',
                                        color: '#00d4ff',
                                        border: '1px solid rgba(0,212,255,0.45)',
                                        lineHeight: 1,
                                        fontFamily: 'var(--font-space)',
                                      }}
                                    >
                                      {link.badge}
                                    </span>
                                  )}
                                </div>
                                {link.description && (
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: 'rgba(148,163,184,0.75)',
                                      marginTop: 2,
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {link.description}
                                  </div>
                                )}
                              </Link>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Desktop right */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <LanguageSwitcher />
              {!isAdmin && (
                <button
                  onClick={() => openModal()}
                  className="px-4 py-1.5 text-sm font-semibold rounded-full text-[#0a0a0f] transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#00d4ff,#8b5cf6)' }}
                >
                  {t.common.getInTouch}
                </button>
              )}
              {isAdmin && (
                <Link
                  href="/control-plane"
                  title="Control Plane"
                  className="flex items-center justify-center"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'rgba(0,212,255,0.07)',
                    border: '1px solid rgba(0,212,255,0.25)',
                    color: 'rgba(0,212,255,0.7)',
                    transition: 'all 0.2s',
                  }}
                >
                  <LayoutDashboard size={15} />
                </Link>
              )}
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
      </div>

      {/* Mobile overlay */}
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
            <div className="shrink-0" style={{ height: 72 }} />

            <nav
              className="flex-1 overflow-y-auto px-6 py-4"
              style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              {NAV_GROUPS.map(group => {
                const active = isActiveGroup(group, pathname)
                if (!group.children) {
                  return (
                    <Link
                      key={group.label}
                      href={localizeHref(group.href!)}
                      style={{
                        display: 'block',
                        padding: '14px 18px',
                        borderRadius: 12,
                        fontSize: 17,
                        fontWeight: 600,
                        color: active ? '#00d4ff' : '#e2e8f0',
                        background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-space)',
                      }}
                    >
                      {group.label}
                    </Link>
                  )
                }
                const expanded = mobileExpanded === group.label
                return (
                  <div key={group.label}>
                    <button
                      onClick={() => setMobileExpanded(expanded ? null : group.label)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: 12,
                        fontSize: 17,
                        fontWeight: 600,
                        color: active ? '#00d4ff' : '#e2e8f0',
                        background: active ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-space)',
                      }}
                    >
                      {group.label}
                      <ChevronDown
                        size={18}
                        style={{
                          transition: 'transform 0.2s',
                          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                        }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '4px 0 8px 12px' }}>
                            {group.children.map(link => {
                              const linkActive =
                                pathname === link.href || pathname.startsWith(link.href + '/')
                              return (
                                <Link
                                  key={`${link.href}-${link.label}`}
                                  href={localizeHref(link.href)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '10px 16px',
                                    borderRadius: 10,
                                    fontSize: 15,
                                    color: linkActive ? '#00d4ff' : '#cbd5e1',
                                    background: linkActive
                                      ? 'rgba(0,212,255,0.08)'
                                      : 'transparent',
                                    textDecoration: 'none',
                                  }}
                                >
                                  <span>{link.label}</span>
                                  {link.badge && (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: '0.08em',
                                        padding: '2px 6px',
                                        borderRadius: 4,
                                        background: 'rgba(0,212,255,0.18)',
                                        color: '#00d4ff',
                                        border: '1px solid rgba(0,212,255,0.45)',
                                        lineHeight: 1,
                                        fontFamily: 'var(--font-space)',
                                      }}
                                    >
                                      {link.badge}
                                    </span>
                                  )}
                                </Link>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />

              <button
                onClick={() => { setMenuOpen(false); openModal() }}
                className="py-3 text-[15px] font-semibold rounded-full text-[#0a0a0f]"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#8b5cf6)' }}
              >
                {t.common.getInTouch}
              </button>

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AuthButton />
                <LanguageSwitcher variant="full" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
