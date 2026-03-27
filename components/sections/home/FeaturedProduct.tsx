'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield as ShieldIcon, Activity, Clock } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '+306%',   label: '12-month backtest',   color: '#00d4ff' },
  { icon: Activity,   value: '5-stage', label: 'AI pipeline',          color: '#8b5cf6' },
  { icon: ShieldIcon, value: '11',      label: 'Coins tracked',        color: '#00d4ff' },
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
      style={{ background: 'linear-gradient(180deg, #07070d 0%, #0d0419 45%, #07070d 100%)' }}
    >
      {/* Rich gradient mesh */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 15% 50%, rgba(0,212,255,0.07) 0%, transparent 55%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 85% 40%, rgba(139,92,246,0.07) 0%, transparent 55%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 40% 40% at 50% 100%, rgba(244,113,181,0.03) 0%, transparent 60%)' }} />

      {/* Divider top */}
      <div className="absolute top-0 left-0 right-0">
        <div className="section-divider opacity-30" />
      </div>

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
              className="inline-block mb-4 text-sm font-medium uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                color: '#00d4ff',
              }}
            >
              Featured — The All-Season Bot
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#e2e8f0] leading-tight mb-5"
              style={{ fontFamily: 'var(--font-space)' }}
            >
              The bot that{' '}
              <span className="gradient-text">thinks</span>{' '}
              before it trades.
            </h2>
            <p className="text-[#8899af] leading-relaxed mb-8">
              A five-stage AI pipeline that classifies market regimes and executes trades
              autonomously. +306% backtested returns across 11 crypto assets.
              Every trade logged, every decision auditable.
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
                    <div className="text-sm font-medium text-[#e2e8f0]">{step.name}</div>
                    <div className="text-sm text-[#7a8a9e]">{step.sub}</div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <ArrowRight size={12} className="text-[#334155] flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/trading#node"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] transition-all hover:opacity-90 glow-cyan-btn"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
              >
                Join the Node
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/trading"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#94a3b8] hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Learn more
              </Link>
            </div>
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
                className="glass-card shimmer-card rounded-2xl p-6 text-center"
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
                <div className="text-sm text-[#8899af] tracking-wide">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
