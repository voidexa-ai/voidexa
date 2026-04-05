'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const deploymentTiers = [
  {
    tier: 'Tier 1',
    title: 'Anonymous Cloud',
    desc: 'Rent an anonymous server through voidexa. Instant setup, no hardware needed. Your messages route through infrastructure we manage but cannot read.',
  },
  {
    tier: 'Tier 2',
    title: 'Own Server',
    desc: 'Run Comlink on a compact computer with 4G/5G SIM and mobile hotspot. Full control, full anonymity. No third party involved.',
  },
  {
    tier: 'Tier 3',
    title: 'Off-Grid Suitcase',
    desc: 'Weatherproof hardcase with built-in computer, 4G/5G modem with external antenna, solar panel or small windmill for power. Can be deployed anywhere — mounted in a tree, placed on the ground, or buried with only antenna and power source visible. Complete off-grid operation for days without maintenance.',
  },
]

const upcoming = [
  {
    title: 'TINE — AI Secretary',
    desc: 'Voice-powered AI assistant for Danish tradespeople. Records client conversations on the job site, extracts project details, generates PDF quotes, sends via SMS or email, and auto-follows up on unanswered quotes after 48 hours. Speaks fluent Danish with trade-specific jargon. Voice-controlled — works with dirty hands.',
    tag: 'Coming Soon',
  },
  {
    title: "DIY Mechanic's Bible",
    desc: 'AI repair assistant for engines. Point your camera at any component — the AI identifies it and walks you through the repair step by step. Voice-controlled for greasy hands. Uses only verified repair manuals — no hallucinations. Works for boat motors, scooters, motorcycles, cars.',
    tag: 'Coming Soon',
  },
  {
    title: 'BOSSO — Smart Lending',
    desc: 'Peer-to-peer lending between friends with built-in tracking and contracts. Available as standard Play Store app, or as anonymous voidexa custom build for private transactions.',
    tag: 'Coming Soon',
  },
]

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-transparent pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            Apps
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-5"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Tools for people who{' '}
            <span className="gradient-text">think in systems.</span>
          </h1>
          <p className="text-[#b0b0b0] max-w-xl mx-auto">
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
                  className="inline-block mb-4 text-sm font-medium uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(139,92,246,0.12)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    color: '#8b5cf6',
                  }}
                >
                  Beta — Comlink
                </span>
                <p className="text-[#94a3b8] text-base leading-relaxed mb-4" style={{ fontStyle: 'italic' }}>
                  Encrypted AI-powered communication. Your agents talk. Nobody else listens.
                </p>
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
                <p className="text-[#b0b0b0] leading-relaxed mb-3">
                  Comlink is encrypted one-to-many communication. A master node sends to all agents. Each agent responds directly to master only. Agents cannot see each other. Every message is encrypted client-side before it leaves your device.
                </p>
                <p className="text-[#b0b0b0] leading-relaxed mb-3">
                  QR invite only. 60-minute message lifespan. Ghost mode runs entirely in RAM — nothing written to disk, nothing persists after shutdown.
                </p>
                <p className="text-[#b0b0b0] leading-relaxed mb-6">
                  Three deployment tiers:
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                >
                  Request beta access <ArrowRight size={14} />
                </Link>
              </div>

              <div className="lg:w-3/5 space-y-4">
                {deploymentTiers.map(({ tier, title, desc }, i) => (
                  <motion.div
                    key={tier}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="text-sm font-medium uppercase tracking-widest mb-1" style={{ color: '#8b5cf6' }}>{tier}</div>
                    <div className="text-sm font-medium text-[#e2e8f0] mb-1">{title}</div>
                    <div className="text-[15px] text-[#b0b0b0] leading-relaxed">{desc}</div>
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
              <p className="text-[#b0b0b0] leading-relaxed mb-6">
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
                <div key={item} className="flex items-center gap-2 p-3 rounded-xl text-base text-[#b0b0b0]"
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
                  <h3 className="text-sm font-medium text-[#e2e8f0]">{title}</h3>
                  <span className="badge-soon">{tag}</span>
                </div>
                <p className="text-[15px] text-[#b0b0b0] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
