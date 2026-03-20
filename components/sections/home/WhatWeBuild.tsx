'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, Shield, BookOpen, Wrench, Brain, Zap } from 'lucide-react'

const items = [
  {
    icon: TrendingUp,
    title: 'AI Trading Bot',
    desc: 'Fully autonomous crypto spot rebalancer with futures overlay. 5-stage pipeline, market regime detection, live on KuCoin.',
    tag: 'Live',
    color: '#00d4ff',
  },
  {
    icon: Shield,
    title: 'Comlink',
    desc: 'Encrypted peer-to-peer messaging. End-to-end encryption, zero server storage, ephemeral channels.',
    tag: 'Beta',
    color: '#8b5cf6',
  },
  {
    icon: BookOpen,
    title: 'AI Book Creator',
    desc: 'Generate structured, publication-ready books from a single prompt. Full chapters, consistent voice, export-ready.',
    tag: 'In Dev',
    color: '#00d4ff',
  },
  {
    icon: Wrench,
    title: 'Website Builder',
    desc: 'AI-designed websites generated from a brief. Production-quality Next.js, deployed in minutes.',
    tag: 'Soon',
    color: '#8b5cf6',
  },
  {
    icon: Brain,
    title: 'Custom AI Systems',
    desc: 'Bespoke intelligent software built to your spec. Pipelines, agents, automation — we scope and ship.',
    tag: 'Services',
    color: '#00d4ff',
  },
  {
    icon: Zap,
    title: 'Data Intelligence',
    desc: 'Pipelines, dashboards, and predictive models. Turn raw data into decisions that run on their own.',
    tag: 'Services',
    color: '#8b5cf6',
  },
]

function Card({ item, i }: { item: typeof items[0]; i: number }) {
  const Icon = item.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="glass-card rounded-2xl p-6 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
        >
          <Icon size={18} style={{ color: item.color }} />
        </div>
        <span
          className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{
            background: `${item.color}12`,
            border: `1px solid ${item.color}30`,
            color: item.color,
          }}
        >
          {item.tag}
        </span>
      </div>
      <h3
        className="text-base font-semibold text-[#e2e8f0] mb-2"
        style={{ fontFamily: 'var(--font-space)' }}
      >
        {item.title}
      </h3>
      <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
    </motion.div>
  )
}

export default function WhatWeBuild() {
  return (
    <section className="section-pad bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            What we build
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#e2e8f0] mb-4"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Intelligent systems,<br />
            <span className="gradient-text">not just software</span>
          </h2>
          <p className="text-[#64748b] max-w-xl mx-auto">
            Every product we ship has AI at its core — not as a feature, but as the foundation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => <Card key={item.title} item={item} i={i} />)}
        </div>
      </div>
    </section>
  )
}
