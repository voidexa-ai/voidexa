'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Shield, BookOpen, Globe, Database, Brain } from 'lucide-react'
import Link from 'next/link'

const items = [
  {
    icon: TrendingUp,
    title: 'AI Trading Systems',
    desc: 'Regime-aware bots that read the market. Multi-agent, multi-phase, fully autonomous.',
    tag: 'Live',
    color: '#00d4ff',
    href: '/trading',
  },
  {
    icon: Shield,
    title: 'Custom Apps',
    desc: 'Encrypted tools, communication apps, your vision built. Off-grid capable.',
    tag: 'Beta',
    color: '#8b5cf6',
    href: '/apps',
  },
  {
    icon: BookOpen,
    title: 'AI Book Creator',
    desc: 'Tell your story, AI writes your book. Any genre, publication-ready.',
    tag: 'In Dev',
    color: '#00d4ff',
    href: '/ai-tools',
  },
  {
    icon: Globe,
    title: 'AI Website Builder',
    desc: 'Talk it, build it, launch it. Production Next.js from a conversation.',
    tag: 'Soon',
    color: '#8b5cf6',
    href: '/ai-tools',
  },
  {
    icon: Database,
    title: 'Data Intelligence',
    desc: 'Scrape, index, analyze, implement. Turn raw data into autonomous decisions.',
    tag: 'Services',
    color: '#00d4ff',
    href: '/services',
  },
  {
    icon: Brain,
    title: 'AI Consulting',
    desc: 'We help you build with AI. Strategy, implementation, and integration.',
    tag: 'Services',
    color: '#8b5cf6',
    href: '/services',
  },
]

function Card({ item, i }: { item: typeof items[0]; i: number }) {
  const Icon = item.icon
  return (
    <Link href={item.href}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card shimmer-card rounded-2xl p-6 group cursor-pointer h-full"
        whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
      >
        {/* Top bar accent */}
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)`,
            opacity: 0,
            transition: 'opacity 0.35s',
          }}
        />
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: `${item.color}12`,
              border: `1px solid ${item.color}28`,
              boxShadow: `0 0 0 0 ${item.color}40`,
            }}
            whileHover={{
              boxShadow: `0 0 20px ${item.color}40`,
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
          >
            <Icon size={18} style={{ color: item.color }} />
          </motion.div>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: `${item.color}10`,
              border: `1px solid ${item.color}28`,
              color: item.color,
            }}
          >
            {item.tag}
          </span>
        </div>
        <h3
          className="text-base font-bold text-[#e2e8f0] mb-2"
          style={{ fontFamily: 'var(--font-space)' }}
        >
          {item.title}
        </h3>
        <p className="text-sm text-[#3d5068] leading-relaxed mb-5">{item.desc}</p>
        <span
          className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
          style={{ color: item.color }}
        >
          Learn more <span className="text-base leading-none">→</span>
        </span>
      </motion.div>
    </Link>
  )
}

export default function WhatWeBuild() {
  return (
    <section id="what-we-build" className="section-pad" style={{ background: '#07070d' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section divider top */}
        <div className="section-divider mb-20 opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: 'rgba(0,212,255,0.6)', fontFamily: 'var(--font-space)' }}
          >
            What we build
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#e2e8f0] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Intelligent systems,
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #a78bfa 60%, #f471b5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              not just software
            </span>
          </h2>
          <p className="text-[#3d5068] max-w-xl mx-auto leading-relaxed">
            Every product we ship has AI at its core — not as a feature, but as the foundation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => <Card key={item.title} item={item} i={i} />)}
        </div>
      </div>
    </section>
  )
}
