'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield as ShieldIcon, Activity, Clock } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '+313%',   label: '12-month backtest',   color: '#00d4ff' },
  { icon: Activity,   value: '5-stage', label: 'AI pipeline',          color: '#8b5cf6' },
  { icon: ShieldIcon, value: 'Dry-run', label: 'Default safe mode',    color: '#00d4ff' },
  { icon: Clock,      value: '24/7',    label: 'Autonomous operation', color: '#8b5cf6' },
]

const pipeline = [
  { name: 'Market Data',    sub: 'KuCoin + Binance' },
  { name: 'Season Engine',  sub: 'Regime detection' },
  { name: 'Rebalance',      sub: 'Proposal only' },
  { name: 'Risk Gate',      sub: 'Final authority' },
  { name: 'Execution',      sub: 'Dry-run / Live' },
]

export default function FeaturedProduct() {
  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0520 50%, #0a0a0f 100%)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(0,212,255,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-block mb-4 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                color: '#00d4ff',
              }}
            >
              Featured — AI Trading Bot
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#e2e8f0] leading-tight mb-5"
              style={{ fontFamily: 'var(--font-space)' }}
            >
              The bot that{' '}
              <span className="gradient-text">thinks</span>{' '}
              before it trades.
            </h2>
            <p className="text-[#64748b] leading-relaxed mb-8">
              A modular, fully autonomous crypto spot rebalancer with a futures overlay.
              It classifies the market regime every tick, proposes an allocation, validates
              it through a risk gate, then executes — or doesn't. Every decision is logged.
              Nothing runs without approval.
            </p>

            {/* Pipeline visualization */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {pipeline.map((step, i) => (
                <div key={step.name} className="flex items-center gap-2">
                  <div
                    className="px-3 py-1.5 rounded-lg text-center"
                    style={{
                      background: 'rgba(0,212,255,0.06)',
                      border: '1px solid rgba(0,212,255,0.15)',
                    }}
                  >
                    <div className="text-xs font-semibold text-[#e2e8f0]">{step.name}</div>
                    <div className="text-[10px] text-[#475569]">{step.sub}</div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <ArrowRight size={12} className="text-[#334155] flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] transition-all hover:opacity-90 glow-cyan-btn"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
            >
              Learn more
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Right — stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map(({ icon: Icon, value, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{
                    fontFamily: 'var(--font-space)',
                    background: `linear-gradient(135deg, ${color}, #8b5cf6)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {value}
                </div>
                <div className="text-xs text-[#475569]">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
