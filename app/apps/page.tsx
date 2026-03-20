'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Lock, Zap, EyeOff, Clock, Globe } from 'lucide-react'

const comlinkFeatures = [
  { icon: Lock,    title: 'End-to-end encrypted',    desc: 'Every message encrypted client-side. Not even we can read it.' },
  { icon: EyeOff,  title: '60-min message lifespan', desc: 'Messages auto-expire. Ghost mode keeps everything RAM-only — nothing written to disk.' },
  { icon: Clock,   title: 'Ephemeral channels',      desc: 'Channels that auto-close and self-destruct when you leave.' },
  { icon: Globe,   title: 'QR invite only',          desc: 'No links, no search. Join by scanning a QR code. Zero discovery surface.' },
  { icon: Zap,     title: 'Off-grid capable',        desc: 'Runs on Raspberry Pi. Solar or wind powered. Can be buried. No cloud dependency.' },
  { icon: Shield,  title: 'Master/agent hierarchy',  desc: 'Command center control. One master node, unlimited agent nodes under it.' },
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
                  Off-grid.{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #00d4ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Encrypted. Untraceable.
                  </span>
                </h2>
                <p className="text-[#64748b] leading-relaxed mb-6">
                  Comlink is P2P encrypted communication built for people who take privacy seriously.
                  QR invite only, 60-minute message lifespan, ghost mode (RAM only), master/agent hierarchy.
                  Runs on a Raspberry Pi — solar or wind powered, can be buried underground.
                  No cloud, no trace, no compromise.
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

        {/* Custom Apps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-3xl p-8 lg:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(139,92,246,0.04))',
            border: '1px solid rgba(0,212,255,0.1)',
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-[#e2e8f0] mb-3" style={{ fontFamily: 'var(--font-space)' }}>
                Have an idea?{' '}
                <span className="gradient-text">We build it.</span>
              </h2>
              <p className="text-[#64748b] leading-relaxed mb-6">
                From concept to deployment — custom encrypted communication apps, automation tools,
                business apps, anything. Tell us what you need and we'll scope it, build it, and hand you the code.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
              >
                Tell us what you need <ArrowRight size={14} />
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Encrypted communication apps',
                'Automation tools & pipelines',
                'Business intelligence apps',
                'Trading & financial tools',
                'AI-integrated workflows',
                'Off-grid / hardware projects',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 p-3 rounded-xl text-sm text-[#64748b]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#00d4ff' }}>·</span>
                  {item}
                </div>
              ))}
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
