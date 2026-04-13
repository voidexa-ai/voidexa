'use client'

import { motion } from 'framer-motion'
import { Network, Route, Gauge, Coins, ArrowRightLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { fadeUp, sectionHeading, sectionSub } from './shared'

type Item = { icon: ReactNode; title: string; desc: string; color: string }

const items: Item[] = [
  {
    icon: <Network size={22} />,
    title: 'Service Mesh',
    desc: 'Sell your API services to other planets. Every call earns you GHAI. Voluntary — turn it on only when you have something to offer.',
    color: '#00d4ff',
  },
  {
    icon: <Route size={22} />,
    title: 'Trade Routes',
    desc: 'Visible connections between planets that do business together. The map literally shows who fuels whom.',
    color: '#a855f7',
  },
  {
    icon: <Gauge size={22} />,
    title: 'Gravity Score',
    desc: 'Your activity, trades, and contributions determine your planet\'s size and visibility. The more you move, the bigger you render.',
    color: '#f59e0b',
  },
  {
    icon: <Coins size={22} />,
    title: 'Revenue sharing',
    desc: 'voidexa takes 7–15% of inter-planet transactions, scaling by tier. The rest flows to you and the planet routing the call.',
    color: '#22c55e',
  },
  {
    icon: <ArrowRightLeft size={22} />,
    title: 'You earn when others use your services',
    desc: 'This isn\'t hosting — it\'s an economy. Every planet that integrates your API is a passive income stream.',
    color: '#ec4899',
  },
]

export function Ecosystem() {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.05) 50%, transparent 100%)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <h2 style={sectionHeading}>The Ecosystem</h2>
          <p style={sectionSub}>
            Why planet ownership matters: you&apos;re not a tenant. You&apos;re a node
            in an economy that compounds.
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
                border: `1px solid ${item.color}24`,
                background: 'rgba(7,4,18,0.75)',
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
