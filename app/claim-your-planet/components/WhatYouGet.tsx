'use client'

import { motion } from 'framer-motion'
import { Zap, Layers, Database, Rocket, Globe, Orbit } from 'lucide-react'
import type { ReactNode } from 'react'
import { fadeUp, sectionHeading, sectionSub } from './shared'

type Item = { icon: ReactNode; title: string; desc: string; color: string }

const items: Item[] = [
  {
    icon: <Zap size={22} />,
    title: 'Quantum API access',
    desc: 'Multi-AI orchestration across Claude, GPT, Gemini, and Perplexity. Debate, synthesis, and scaffold modes ready to embed in your product.',
    color: '#8b5cf6',
  },
  {
    icon: <Layers size={22} />,
    title: 'KCP-90 compression',
    desc: '95.67% token reduction on context payloads. Cut AI bills by an order of magnitude on day one.',
    color: '#00d4ff',
  },
  {
    icon: <Database size={22} />,
    title: 'Shared Supabase infrastructure',
    desc: 'Auth, storage, real-time, RLS — preconfigured. No infra to build, no plan to pay for.',
    color: '#22d3ee',
  },
  {
    icon: <Rocket size={22} />,
    title: 'Deployment pipeline',
    desc: 'Railway + Vercel stack wired for you. Push to deploy. Your planet ships like ours does.',
    color: '#f59e0b',
  },
  {
    icon: <Globe size={22} />,
    title: 'Custom planet in the 3D star map',
    desc: 'A rendered sphere in the voidexa galaxy with your brand color, logo, and orbital position. Discoverable, linkable, live.',
    color: '#00ff88',
  },
  {
    icon: <Orbit size={22} />,
    title: 'Your own Level 2 star system',
    desc: 'Your products and services orbit YOUR sun. Visitors drill into your world without ever leaving the universe.',
    color: '#ec4899',
  },
]

export function WhatYouGet() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <h2 style={sectionHeading}>What You Get</h2>
          <p style={sectionSub}>
            The full voidexa infrastructure bundle — the same stack we run our own systems on.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {items.map((item, i) => (
            <motion.div
              key={i} custom={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp}
              style={{
                padding: '28px 24px', borderRadius: 14,
                border: `1px solid ${item.color}22`,
                background: 'rgba(7,4,18,0.7)',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, marginBottom: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${item.color}14`,
                border: `1px solid ${item.color}2a`,
                color: item.color,
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 10, fontFamily: 'var(--font-space)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
