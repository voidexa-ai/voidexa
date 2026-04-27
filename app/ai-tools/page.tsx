'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, Globe, Lightbulb } from 'lucide-react'
import { RealWorldPaymentNotice } from '@/components/shop/RealWorldPaymentNotice'

function WaitlistInput({ label }: { label: string }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return done ? (
    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-[#00d4ff]"
      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
      <span>✓</span> You're on the waitlist
    </div>
  ) : (
    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 px-4 py-3 rounded-full text-sm outline-none placeholder-[#334155]"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
      />
      <button
        onClick={() => email && setDone(true)}
        className="px-5 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity whitespace-nowrap"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>
        {label}
      </button>
    </div>
  )
}

export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-transparent">

      {/* ── PAGE HERO ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 30%, rgba(139,92,246,0.07) 0%, rgba(0,212,255,0.04) 50%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-medium uppercase tracking-widest text-[#8b5cf6]/70 mb-3">AI Tools</p>
            <h1 className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-5" style={{ fontFamily: 'var(--font-space)' }}>
              AI that{' '}
              <span className="gradient-text">does the work.</span>
            </h1>
            <p className="text-[#b0b0b0] max-w-xl mx-auto">
              From publishing a book to launching a website to exploring a business idea — voidexa's AI tools turn conversations into finished products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── AI Tools — compact cards ── */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <RealWorldPaymentNotice />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">

            {/* AI Book Creator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} style={{ color: '#00d4ff' }} />
                  <h3 className="text-sm font-medium text-[#e2e8f0]">AI Book Creator</h3>
                </div>
                <span
                  className="text-sm font-medium uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
                >
                  LIVE
                </span>
              </div>
              <p className="text-[15px] text-[#b0b0b0] leading-relaxed mb-4">
                Turn your story into a publication-ready manuscript. The AI listens, asks the right questions, maps character arcs, and writes full chapters with your voice. Biography, fiction, or anything in between.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00d4ff] hover:text-[#67e8f9] transition-colors"
              >
                Learn more <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* AI Website & Store Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe size={16} style={{ color: '#8b5cf6' }} />
                  <h3 className="text-sm font-medium text-[#e2e8f0]">AI Website Builder</h3>
                </div>
                <span className="badge-soon">Coming Soon</span>
              </div>
              <p className="text-[15px] text-[#b0b0b0] leading-relaxed mb-4">
                Describe what you want in conversation — the AI builds a production-quality Next.js site, you review it, and it deploys to your domain. Websites, stores, landing pages, portfolios.
              </p>
              <WaitlistInput label="Notify me" />
            </motion.div>

            {/* AI Idea Chatbot — moved inline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} style={{ color: '#00d4ff' }} />
                  <h3 className="text-sm font-medium text-[#e2e8f0]">AI Idea Chatbot</h3>
                </div>
                <span className="badge-soon">Coming Soon</span>
              </div>
              <p className="text-[15px] text-[#b0b0b0] leading-relaxed mb-4">
                A conversational AI that helps you develop and pressure-test ideas. Business concepts, creative projects, technical architecture, side hustles — your personal brainstorm partner.
              </p>
              <WaitlistInput label="Get notified" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <p className="text-[#b0b0b0] mb-3 text-sm">Have a specific AI tool in mind?</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity glow-cyan-btn"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>
              Tell us what you need <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
