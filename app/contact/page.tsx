'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

const INTERESTS = [
  { value: 'ai-trading',  label: 'AI Trading Bot'    },
  { value: 'ghost-ai',    label: 'Ghost AI Chat'      },
  { value: 'quantum',     label: 'Quantum'            },
  { value: 'trading-hub', label: 'Trading Hub'        },
  { value: 'node-system', label: 'Node System'        },
  { value: 'comlink',     label: 'Comlink'            },
  { value: 'apps',        label: 'Apps'               },
]

const inputStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#e2e8f0',
}

export default function ContactPage() {
  const { user } = useAuth()
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState(user?.email ?? '')
  const [selected, setSelected]     = useState<string[]>([])
  const [newsletter, setNewsletter] = useState(false)
  const [message, setMessage]       = useState('')
  const [sent, setSent]             = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  function toggleInterest(value: string) {
    setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const allSelected = newsletter ? [...selected, 'newsletter'] : selected
    if (allSelected.length === 0) { setError('Please select at least one interest.'); return }

    setError('')
    setLoading(true)

    const subject = allSelected.join(', ')

    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
      user_id: user?.id ?? null,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Fire edge function notification (best-effort)
    supabase.functions.invoke('notify', {
      body: { type: 'contact', email, name, subject },
    }).catch(() => {})

    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            Contact
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-4"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            {"Let's build "}
            <span className="gradient-text">something.</span>
          </h1>
          <p className="text-[#b0b0b0] max-w-md mx-auto">
            Tell us what you&apos;re working on. We respond within 24 hours.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-card rounded-3xl p-8"
        >
          {sent ? (
            <div className="text-center py-8">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)' }}
              >
                <Send size={20} style={{ color: '#00d4ff' }} />
              </div>
              <h2
                className="text-2xl font-bold text-[#e2e8f0] mb-2"
                style={{ fontFamily: 'var(--font-space)' }}
              >
                Message sent!
              </h2>
              <p className="text-[#b0b0b0]">{"We'll respond within 24 hours."}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#7a8a9e] uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#334155]"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7a8a9e] uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#334155]"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Interest checkboxes */}
              <div>
                <label className="block text-sm font-medium text-[#7a8a9e] uppercase tracking-wider mb-3">
                  {"I'm interested in"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INTERESTS.map(({ value, label }) => {
                    const checked = selected.includes(value)
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleInterest(value)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition-all"
                        style={{
                          background: checked ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${checked ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                          color: checked ? '#00d4ff' : '#64748b',
                        }}
                      >
                        <span
                          className="shrink-0 w-4 h-4 rounded flex items-center justify-center"
                          style={{
                            background: checked ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${checked ? '#00d4ff' : 'rgba(255,255,255,0.12)'}`,
                          }}
                        >
                          {checked && <span style={{ color: '#00d4ff', fontSize: 14, lineHeight: 1 }}>✓</span>}
                        </span>
                        {label}
                      </button>
                    )
                  })}
                </div>

                {/* Newsletter */}
                <button
                  type="button"
                  onClick={() => setNewsletter(v => !v)}
                  className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-xl text-left text-sm transition-all w-full"
                  style={{
                    background: newsletter ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${newsletter ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    color: newsletter ? '#a78bfa' : '#64748b',
                  }}
                >
                  <span
                    className="shrink-0 w-4 h-4 rounded flex items-center justify-center"
                    style={{
                      background: newsletter ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${newsletter ? '#a78bfa' : 'rgba(255,255,255,0.12)'}`,
                    }}
                  >
                    {newsletter && <span style={{ color: '#a78bfa', fontSize: 14, lineHeight: 1 }}>✓</span>}
                  </span>
                  Subscribe to newsletter — general updates
                </button>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#7a8a9e] uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What are you building? What do you need?"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#334155]"
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
                className="flex items-center justify-center gap-2 rounded-full font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity glow-cyan-btn disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                  width: '100%',
                  padding: '16px 32px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              >
                {loading ? 'Sending…' : 'Send message →'}
              </button>
            </form>
          )}
        </motion.div>

        {/* Direct email */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[#334155]">
            Prefer email?{' '}
            <a href="mailto:contact@voidexa.com" className="text-[#7a8a9e] hover:text-[#00d4ff] transition-colors">
              contact@voidexa.com
            </a>
          </p>
          <p className="text-sm text-[#334155] mt-2">
            Management:{' '}
            <a href="mailto:ceo@voidexa.com" className="text-[#7a8a9e] hover:text-[#00d4ff] transition-colors">
              ceo@voidexa.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
