'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

/* ── Context ── */
interface ModalCtx {
  open: (product?: string) => void
  close: () => void
}
const Ctx = createContext<ModalCtx>({ open: () => {}, close: () => {} })

export function useGetInTouchModal() {
  return useContext(Ctx)
}

/* ── Products ── */
const PRODUCTS = [
  { value: 'ai-trading',  label: 'AI Trading Bot'  },
  { value: 'ghost-ai',    label: 'Ghost AI'         },
  { value: 'quantum',     label: 'Quantum'          },
  { value: 'trading-hub', label: 'Trading Hub'      },
  { value: 'node-system', label: 'Node System'      },
  { value: 'comlink',     label: 'Comlink'          },
  { value: 'apps',        label: 'Apps'             },
  { value: 'general',     label: 'General enquiry'  },
]

const WAITLIST_PRODUCTS = new Set(['ghost-ai', 'quantum', 'trading-hub', 'node-system', 'comlink'])

/* ── Provider + Modal ── */
export function GetInTouchProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [visible, setVisible]   = useState(false)
  const [product, setProduct]   = useState(PRODUCTS[0].value)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [message, setMessage]   = useState('')
  const [sending, setSending]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Prefill email from auth
  useEffect(() => {
    if (user?.email) setEmail(user.email)
    if (user?.user_metadata?.name) setName(user.user_metadata.name as string)
  }, [user])

  function open(preset?: string) {
    if (preset) setProduct(preset)
    setSent(false)
    setError('')
    setVisible(true)
  }

  function close() {
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')

    const isWaitlist = WAITLIST_PRODUCTS.has(product)

    if (isWaitlist) {
      const { error } = await supabase.from('waitlist_signups').insert({
        email,
        product,
        name: name || null,
        user_id: user?.id ?? null,
      })
      if (error) { setError(error.message); setSending(false); return }
    } else {
      const { error } = await supabase.from('contact_messages').insert({
        name,
        email,
        subject: PRODUCTS.find(p => p.value === product)?.label ?? product,
        message,
        user_id: user?.id ?? null,
      })
      if (error) { setError(error.message); setSending(false); return }
    }

    // Fire edge function notification (best-effort)
    supabase.functions.invoke('notify', {
      body: { type: isWaitlist ? 'waitlist' : 'contact', product, email, name },
    }).catch(() => {})

    setSending(false)
    setSent(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#e2e8f0',
    fontSize: 13,
    outline: 'none',
  }

  const isWaitlist = WAITLIST_PRODUCTS.has(product)

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}

      <AnimatePresence>
        {visible && (
          <>
            {/* Backdrop */}
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(6px)',
                zIndex: 200,
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', maxWidth: 460,
                zIndex: 201,
                padding: '0 16px',
              }}
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(10,10,20,0.98)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-[#e2e8f0]" style={{ fontFamily: 'var(--font-space)' }}>
                      Get in touch
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                      We respond within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={close}
                    className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: '#475569' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {sent ? (
                  <div className="text-center py-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}
                    >
                      <span className="text-[#00d4ff]">✓</span>
                    </div>
                    <p className="font-semibold text-[#e2e8f0]" style={{ fontFamily: 'var(--font-space)' }}>
                      {isWaitlist ? "You're on the list!" : 'Message sent!'}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                      {isWaitlist ? "We'll notify you when it launches." : "We'll respond within 24 hours."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Product selector */}
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>
                        I'm interested in
                      </label>
                      <select
                        value={product}
                        onChange={e => setProduct(e.target.value)}
                        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                      >
                        {PRODUCTS.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>
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
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>
                          Email *
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
                    </div>

                    {!isWaitlist && (
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#7a8a9e' }}>
                          Message
                        </label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          placeholder="Tell us what you're building…"
                          style={{ ...inputStyle, resize: 'none' }}
                        />
                      </div>
                    )}

                    {error && (
                      <p className="text-xs text-red-400 bg-red-900/20 border border-red-900/30 rounded-lg px-3 py-2">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-[#0a0a0f] transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)', marginTop: 4 }}
                    >
                      {sending ? 'Sending…' : isWaitlist ? 'Join waitlist' : 'Send message'}
                      {!sending && <ArrowRight size={14} />}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  )
}
