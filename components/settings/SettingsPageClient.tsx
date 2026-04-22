'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SettingsPageClientProps {
  email: string
  userId: string
  initialName: string
  role: string
}

type LocalePref = 'en' | 'da'

const LOCALE_KEY = 'voidexa_locale_pref_v1'

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 16,
  padding: '24px',
}

export default function SettingsPageClient({
  email, userId, initialName, role,
}: SettingsPageClientProps) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [locale, setLocale] = useState<LocalePref>('en')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(LOCALE_KEY) : null
    if (stored === 'da' || stored === 'en') setLocale(stored)
  }, [])

  async function saveProfile() {
    setSaving(true)
    setError('')
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_KEY, locale)
    }

    setSaving(false)
    if (dbError) {
      setError(dbError.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: '#334155' }}>Your account</p>
          <h1 className="text-3xl font-bold text-[#e2e8f0] mb-8" style={{ fontFamily: 'var(--font-space)' }}>
            Settings
          </h1>
        </motion.div>

        <div className="space-y-4">
          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} style={cardStyle}>
            <h2 className="text-sm font-semibold text-[#e2e8f0] mb-4">Profile</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>Email</label>
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                  {email}
                </div>
                <p className="text-sm mt-1" style={{ color: '#475569' }}>Email cannot be changed here — contact support.</p>
              </div>

              <div>
                <label htmlFor="settings-name" className="block text-sm font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>Display name</label>
                <input
                  id="settings-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
                />
              </div>

              {role && (
                <div>
                  <label className="block text-sm font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>Role</label>
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
                    {role}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={cardStyle}>
            <h2 className="text-sm font-semibold text-[#e2e8f0] mb-4">Preferences</h2>

            <div>
              <label className="block text-sm font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>Language</label>
              <div className="flex gap-2">
                {(['en', 'da'] as const).map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{
                      background: locale === code ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${locale === code ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      color: locale === code ? '#00d4ff' : '#94a3b8',
                    }}
                  >
                    {code === 'en' ? 'English' : 'Dansk'}
                  </button>
                ))}
              </div>
              <p className="text-sm mt-2" style={{ color: '#475569' }}>Stored locally. Full Danish translations arrive in sprint AFS-26.</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>Notifications</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-sm" style={{ color: '#64748b' }}>Email alerts for wallet top-ups · Coming soon</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ background: saved ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #00d4ff, #8b5cf6)', border: `1px solid ${saved ? 'rgba(34,197,94,0.3)' : 'transparent'}`, color: saved ? '#22c55e' : '#0a0a0f' }}
              >
                {saved ? (
                  <span className="inline-flex items-center gap-1"><Check size={14} /> Saved</span>
                ) : saving ? 'Saving…' : 'Save changes'}
              </button>
              {error && <span className="text-sm" style={{ color: '#f87171' }}>{error}</span>}
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={cardStyle}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#f87171' }}>Danger zone</h2>

            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
              >
                <LogOut size={14} /> Sign out
              </button>

              <div>
                <Link
                  href="/contact?subject=Delete%20account%20request"
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
                >
                  Delete account
                </Link>
                <p className="text-sm mt-1.5" style={{ color: '#475569' }}>
                  Account deletion is handled by support per GDPR. Your message will be tagged for priority review.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
