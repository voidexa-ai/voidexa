'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, ArrowRight } from 'lucide-react'

const subjects = [
  'AI Trading Bot — access request',
  'Join the Node — waitlist',
  'Comlink — beta access',
  'AI Book Creator — waitlist',
  'AI Website Builder — waitlist',
  'Custom app development',
  'Data intelligence project',
  'AI consulting',
  'Node membership',
  'General inquiry',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: subjects[0], message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In a real implementation this would POST to an API route
    setSent(true)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#e2e8f0',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            Contact
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-4"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Let's build{' '}
            <span className="gradient-text">something.</span>
          </h1>
          <p className="text-[#64748b] max-w-md mx-auto">
            Tell us what you're working on. We respond within 24 hours.
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
                Message sent.
              </h2>
              <p className="text-[#64748b]">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#334155]"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#334155]"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What are you building? What do you need?"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#334155]"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity glow-cyan-btn"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
              >
                Send message <ArrowRight size={15} />
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
          <p className="text-xs text-[#334155]">
            Prefer email?{' '}
            <a href="mailto:hello@voidexa.com" className="text-[#475569] hover:text-[#00d4ff] transition-colors">
              hello@voidexa.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
