'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n/context'

export default function AuthButton() {
  const { user, loading } = useAuth()
  const { locale, localizeHref } = useI18n()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const labels = locale === 'da'
    ? { profile: 'Profil', wallet: 'Tegnebog', settings: 'Indstillinger', signOut: 'Log ud', join: 'Tilmeld' }
    : { profile: 'Profile', wallet: 'Wallet', settings: 'Settings', signOut: 'Sign out', join: 'Join' }

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  if (loading) return null

  if (!user) {
    return (
      <Link
        href={localizeHref('/auth/login')}
        className="px-4 py-2 text-sm font-semibold rounded-full transition-all"
        style={{
          background: 'rgba(0,212,255,0.08)',
          border: '1px solid rgba(0,212,255,0.2)',
          color: '#00d4ff',
        }}
      >
        {labels.join}
      </Link>
    )
  }

  const initials = (user.user_metadata?.name as string)
    ? (user.user_metadata.name as string).slice(0, 2).toUpperCase()
    : user.email!.slice(0, 2).toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all hover:opacity-80"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex items-center justify-center rounded-full text-sm font-bold"
          style={{
            width: 26, height: 26,
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            color: '#0a0a0f',
          }}
        >
          {initials}
        </div>
        <span className="text-sm font-medium hidden sm:block" style={{ color: '#94a3b8', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.user_metadata?.name || user.email}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 rounded-xl py-1 shadow-xl"
          style={{
            minWidth: 160,
            background: 'rgba(10,10,20,0.97)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            zIndex: 100,
          }}
        >
          <Link
            href={localizeHref('/profile')}
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
            style={{ color: '#94a3b8' }}
          >
            {labels.profile}
          </Link>
          <Link
            href={localizeHref('/wallet')}
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
            style={{ color: '#94a3b8' }}
          >
            {labels.wallet}
          </Link>
          <Link
            href={localizeHref('/settings')}
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
            style={{ color: '#94a3b8' }}
          >
            {labels.settings}
          </Link>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
          <button
            onClick={signOut}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors hover:bg-white/5 text-left"
            style={{ color: '#64748b' }}
          >
            {labels.signOut}
          </button>
        </div>
      )}
    </div>
  )
}
