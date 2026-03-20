'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Lock, Zap, EyeOff, Clock, Globe } from 'lucide-react'

const comlinkFeatures = [
  { icon: Lock,    title: 'End-to-end encrypted',  desc: 'Every message encrypted client-side. Not even we can read it.' },
  { icon: EyeOff,  title: 'Zero server storage',   desc: 'Nothing persisted. Messages live only on your devices.' },
  { icon: Clock,   title: 'Ephemeral channels',    desc: 'Channels that auto-close and self-destruct when you leave.' },
  { icon: Globe,   title: 'Cross-platform',        desc: 'iOS, Android, and web. Works everywhere, logs nowhere.' },
  { icon: Zap,     title: 'No account required',   desc: 'No email, no phone. Create a channel and share the link.' },
  { icon: Shield,  title: 'Open protocol (v2)',     desc: 'Full protocol documentation and self-hosting planned.' },
]

const upcoming = [
  { title: 'JARVIS Desktop',  desc: 'Claude-powered desktop AI agent that controls your workflow.', tag: 'Concept' },
  { title: 'DataLens',        desc: 'AI dashboard generator — connect a database, get instant insights.', tag: 'Concept' },
  { title: 'PaperTrail',      desc: 'Automated document intelligence — extract, classify, and route.', tag: 'Concept' },
]

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            Apps
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-5"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Tools for people who{' '}
            <span className="gradient-text">think in systems.</span>
          </h1>
          <p className="text-[#64748b] max-w-xl mx-auto">
            Our consumer apps are designed for people who want software that respects
            their intelligence — and their privacy.
          </p>
        </motion.div>

        {/* Comlink feature section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20 rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,255,0.04))',
            border: '1px solid rgba(139,92,246,0.15)',
          }}
        >
          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/5">
                <span
                  className="inline-block mb-4 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(139,92,246,0.12)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    color: '#8b5cf6',
                  }}
                >
                  Beta — Comlink
                </span>
                <h2
                  className="text-4xl font-bold text-[#e2e8f0] mb-4"
                  style={{ fontFamily: 'var(--font-space)' }}
                >
                  Privacy isn't a feature.{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #00d4ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    It's the architecture.
                  </span>
                </h2>
                <p className="text-[#64748b] leading-relaxed mb-6">
                  Comlink was built because every existing messenger makes a compromise.
                  We didn't. End-to-end encryption, zero logs, ephemeral by design.
                  For conversations that shouldn't exist anywhere but between you and who you're talking to.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                >
                  Request beta access <ArrowRight size={14} />
                </Link>
              </div>

              <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {comlinkFeatures.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex gap-3 p-4 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#8b5cf6' }} />
                    <div>
                      <div className="text-sm font-semibold text-[#e2e8f0] mb-0.5">{title}</div>
                      <div className="text-xs text-[#475569] leading-relaxed">{desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-2xl font-bold text-[#e2e8f0] mb-8"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            On the roadmap
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {upcoming.map(({ title, desc, tag }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#e2e8f0]">{title}</h3>
                  <span className="badge-soon">{tag}</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
