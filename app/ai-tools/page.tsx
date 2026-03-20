'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, Globe, Lightbulb, Mic, Layers, Upload, MessageSquare, Sparkles } from 'lucide-react'

/* ─── Book Creator how-it-works steps ─── */
const bookSteps = [
  { icon: Mic,         label: 'You talk',      desc: 'Tell us your story concept in your own words — a few sentences or an hour-long brain dump.' },
  { icon: MessageSquare, label: 'AI interviews',  desc: 'JARVIS asks targeted questions about characters, timeline, feelings, key moments, and plot structure.' },
  { icon: Layers,      label: 'Structure',     desc: 'Your story gets organised into chapters, arcs, and narrative threads — a complete outline.' },
  { icon: BookOpen,    label: 'Book written',  desc: 'The AI writes a full, consistent, publication-quality manuscript in your voice.' },
  { icon: Upload,      label: 'Published',     desc: 'We help you publish through Amazon KDP, Ingram Spark, or your preferred platform.' },
]

/* ─── Website builder how-it-works steps ─── */
const siteSteps = [
  { icon: MessageSquare, label: 'Describe it',  desc: 'Tell the AI what you need — brand, audience, goal, style. As detailed or vague as you want.' },
  { icon: Sparkles,    label: 'AI builds it', desc: 'A production-quality Next.js site is assembled in real time — not a template, actual code.' },
  { icon: Globe,       label: 'Review',       desc: 'Preview, request changes, refine. The AI iterates until it\'s right.' },
  { icon: Upload,      label: 'Deploy',       desc: 'Push to GitHub, deploy to Vercel or your own server. Done.' },
]

/* ─── Genres supported ─── */
const genres = [
  'Autobiography', 'Memoir', 'Children\'s stories', 'Fairy tales',
  'Action', 'Sci-fi', 'Horror', 'Romance', 'Fantasy', 'Thriller',
  'Self-help', 'Business', 'Historical fiction',
]

/* ─── Site types ─── */
const siteTypes = [
  { label: 'Websites',     icon: Globe },
  { label: 'Web stores',   icon: Layers },
  { label: 'Landing pages', icon: Sparkles },
  { label: 'Portfolios',   icon: BookOpen },
]

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
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* ── PAGE HERO ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 30%, rgba(139,92,246,0.07) 0%, rgba(0,212,255,0.04) 50%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#8b5cf6]/70 mb-3">AI Tools</p>
            <h1 className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-5" style={{ fontFamily: 'var(--font-space)' }}>
              AI that{' '}
              <span className="gradient-text">does the work.</span>
            </h1>
            <p className="text-[#64748b] max-w-xl mx-auto">
              From publishing a book to launching a website to exploring a business idea — voidexa's AI tools turn conversations into finished products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ── AI BOOK CREATOR ── */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section label */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-16">
            <div className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(139,92,246,0.04))',
                border: '1px solid rgba(0,212,255,0.1)',
              }}>
              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                  {/* Left */}
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                        <BookOpen size={20} style={{ color: '#00d4ff' }} />
                      </div>
                      <span className="badge-soon">Coming Soon</span>
                    </div>
                    <h2 className="text-4xl font-bold text-[#e2e8f0] mb-4" style={{ fontFamily: 'var(--font-space)' }}>
                      AI Book Creator
                    </h2>
                    <p className="text-xl text-[#94a3b8] font-medium mb-4">
                      Tell your story. AI writes your book.
                    </p>
                    <p className="text-[#64748b] leading-relaxed mb-6">
                      You don't need to know how to write. You just need your story. The AI interviews you, structures your narrative, maintains a consistent voice across every chapter, and produces a publication-ready manuscript. Mostly automated — your story, AI craftsmanship.
                    </p>
                    <p className="text-[#7a8a9e] text-sm mb-6">
                      Works for any genre:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {genres.map(g => (
                        <span key={g} className="text-xs px-3 py-1 rounded-full text-[#64748b]"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {g}
                        </span>
                      ))}
                    </div>
                    <WaitlistInput label="Join waitlist" />
                  </div>

                  {/* Right — steps */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8a9e] mb-6">How it works</p>
                    <div className="space-y-4">
                      {bookSteps.map(({ icon: Icon, label, desc }, i) => (
                        <motion.div key={label}
                          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                          className="flex gap-4 p-4 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                            <Icon size={14} style={{ color: '#00d4ff' }} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#e2e8f0] mb-0.5">{label}</div>
                            <div className="text-xs text-[#7a8a9e] leading-relaxed">{desc}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ── AI WEBSITE & STORE BUILDER ── */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0520 50%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,255,0.04))',
                border: '1px solid rgba(139,92,246,0.12)',
              }}>
              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                  {/* Left */}
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                        <Globe size={20} style={{ color: '#8b5cf6' }} />
                      </div>
                      <span className="badge-soon">Coming Soon</span>
                    </div>
                    <h2 className="text-4xl font-bold text-[#e2e8f0] mb-4" style={{ fontFamily: 'var(--font-space)' }}>
                      AI Website &<br />Store Builder
                    </h2>
                    <p className="text-xl text-[#94a3b8] font-medium mb-4">
                      Talk it. Build it. Launch it.
                    </p>
                    <p className="text-[#64748b] leading-relaxed mb-6">
                      No coding, no drag-and-drop, no templates. Describe what you want in conversation — the AI builds it in production-quality Next.js, you review it, and it deploys straight to your domain. A real website, built by a real AI.
                    </p>

                    {/* What it builds */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {siteTypes.map(({ label, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-3 p-3 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <Icon size={14} style={{ color: '#8b5cf6' }} />
                          <span className="text-sm text-[#94a3b8]">{label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl mb-8"
                      style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                      <span className="text-[#8b5cf6] text-lg">✓</span>
                      <span className="text-sm text-[#64748b]">No coding needed. Just talk.</span>
                    </div>

                    <WaitlistInput label="Notify me" />
                  </div>

                  {/* Right — steps */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8a9e] mb-6">How it works</p>
                    <div className="space-y-4">
                      {siteSteps.map(({ icon: Icon, label, desc }, i) => (
                        <motion.div key={label}
                          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                          className="flex gap-4 p-4 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                            <Icon size={14} style={{ color: '#8b5cf6' }} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#e2e8f0] mb-0.5">{label}</div>
                            <div className="text-xs text-[#7a8a9e] leading-relaxed">{desc}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ── AI IDEA CHATBOT ── */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section-pad">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(0,212,255,0.2)' }}>
              <Lightbulb size={24} style={{ color: '#00d4ff' }} />
            </div>
            <span className="badge-soon mb-4 inline-block">Coming Soon</span>
            <h2 className="text-3xl font-bold text-[#e2e8f0] mb-3 mt-2" style={{ fontFamily: 'var(--font-space)' }}>
              AI Idea Chatbot
            </h2>
            <p className="text-lg text-[#94a3b8] font-medium mb-4">
              Got an idea? Let's explore it together.
            </p>
            <p className="text-[#64748b] leading-relaxed max-w-xl mx-auto mb-8">
              A conversational AI that helps you develop and pressure-test ideas. It profiles your thinking, asks the hard questions, suggests directions, connects dots you didn't know existed. Your personal brainstorm partner — available any time.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Business ideas', 'Product concepts', 'Creative projects', 'Technical architecture', 'Side hustles', 'Problem solving'].map(t => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-full text-[#64748b]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="flex justify-center">
              <WaitlistInput label="Get notified" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <p className="text-[#64748b] mb-3 text-sm">Have a specific AI tool in mind?</p>
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
