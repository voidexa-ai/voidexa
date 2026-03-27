'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: 'https://voidexa.com/auth/callback',
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1">
            <span
              className="text-2xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-space)' }}
            >
              voidexa
            </span>
          </Link>
          <p className="text-sm font-medium uppercase tracking-widest mt-2" style={{ color: '#334155' }}>
            Create your account
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {done ? (
            <div className="text-center py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}
              >
                <span style={{ fontSize: 20 }}>✓</span>
              </div>
              <h3 className="font-semibold text-[#e2e8f0] mb-1" style={{ fontFamily: 'var(--font-space)' }}>
                Check your email
              </h3>
              <p className="text-sm" style={{ color: '#64748b' }}>
                We sent a confirmation link to <strong style={{ color: '#94a3b8' }}>{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2" style={{ color: '#7a8a9e' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2" style={{ color: '#7a8a9e' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2" style={{ color: '#7a8a9e' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  style={inputStyle}
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-900/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 text-sm font-semibold text-[#0a0a0f] transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)', marginTop: 8 }}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: '#475569' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="hover:text-[#00d4ff] transition-colors" style={{ color: '#94a3b8' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
