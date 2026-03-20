'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight, TrendingUp, Shield, Activity, Clock, Zap,
  ChevronRight, Users, Lock, AlertTriangle,
} from 'lucide-react'

/* ─── Pipeline stages ─── */
const pipeline = [
  { name: 'Market Data',   sub: 'KuCoin · Binance',  color: '#00d4ff' },
  { name: 'Season Engine', sub: 'Regime detection',   color: '#4fc3f7' },
  { name: 'Rebalance',     sub: 'Proposal engine',    color: '#7c6ff7' },
  { name: 'Risk Gate',     sub: 'Final authority',    color: '#a78bfa' },
  { name: 'Execution',     sub: 'Dry-run / Live',     color: '#8b5cf6' },
]

/* ─── Stats ─── */
const stats = [
  { icon: TrendingUp, value: '+306%',   label: '12-month backtest return', color: '#00d4ff' },
  { icon: Activity,   value: '+312%',   label: 'vs buy-and-hold',          color: '#8b5cf6' },
  { icon: Shield,     value: '11',      label: 'coins tracked',            color: '#00d4ff' },
  { icon: Clock,      value: '4',       label: 'market phases detected',   color: '#8b5cf6' },
]

/* ─── Seasons / phases ─── */
const seasons = [
  { name: 'BTC Phase',     desc: 'Bitcoin dominance — overweight BTC, reduce alts',   icon: '₿', color: '#f7931a' },
  { name: 'ETH Phase',     desc: 'Ethereum breakout — rotate into ETH + L2 ecosystem', icon: 'Ξ', color: '#627eea' },
  { name: 'Altcoin Phase', desc: 'Alt season — momentum-weighted small cap exposure',   icon: '◈', color: '#00d4ff' },
  { name: 'RISK_OFF',      desc: 'Market stress — move to stable assets, hedge shorts', icon: '⊘', color: '#ef4444' },
]

/* ─── Node visualization dots ─── */
const NODE_COUNT = 18
const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
  id: i,
  x: 15 + Math.floor(i % 6) * 14 + (Math.floor(i / 6) % 2) * 7,
  y: 20 + Math.floor(i / 6) * 30,
  active: i < 7, // first 7 "filled"
  delay: i * 0.12,
}))

function NodeViz() {
  return (
    <div className="relative h-48 w-full max-w-sm mx-auto">
      <svg viewBox="0 0 100 90" className="w-full h-full">
        {/* Connection lines between active nodes */}
        {nodes.filter(n => n.active).map(a =>
          nodes.filter(b => b.active && b.id > a.id && Math.hypot(b.x - a.x, b.y - a.y) < 25).map(b => (
            <motion.line
              key={`${a.id}-${b.id}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="url(#nodeGrad)" strokeWidth="0.4" opacity={0.4}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: Math.max(a.delay, b.delay) }}
            />
          ))
        )}
        <defs>
          <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {/* Nodes */}
        {nodes.map(n => (
          <motion.circle
            key={n.id}
            cx={n.x} cy={n.y} r={n.active ? 3 : 2}
            fill={n.active ? 'url(#nodeGrad)' : 'rgba(255,255,255,0.08)'}
            stroke={n.active ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.05)'}
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: n.delay }}
          />
        ))}
        {/* "Joining" node pulse */}
        <motion.circle
          cx={nodes[7].x} cy={nodes[7].y} r={3}
          fill="none" stroke="#00d4ff" strokeWidth="0.8"
          animate={{ r: [3, 7], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 2.5 }}
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-xs text-[#475569]">7 active nodes · next tier opens at 20</span>
      </div>
    </div>
  )
}

/* ─── Animated chart lines ─── */
function TradingHeroViz() {
  // Simple SVG price path
  const path = 'M0,70 C10,65 15,55 25,48 S38,30 48,28 S60,35 68,24 S80,10 90,8 S95,12 100,5'
  const holdPath = 'M0,70 C30,72 60,68 100,74'

  return (
    <div
      className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(0,212,255,0.03)',
        border: '1px solid rgba(0,212,255,0.1)',
      }}
    >
      <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[20, 40, 60].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
        ))}
        {/* Buy-and-hold flat line */}
        <motion.path d={holdPath} fill="none"
          stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="2,2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        {/* Area fill */}
        <motion.path
          d={`${path} L100,80 L0,80 Z`}
          fill="url(#chartFill)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
        {/* Bot performance line */}
        <motion.path d={path} fill="none"
          stroke="url(#chartLine)" strokeWidth="1.2"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />
        {/* End dot */}
        <motion.circle cx="100" cy="5" r="1.5"
          fill="#8b5cf6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        />
      </svg>
      {/* Labels */}
      <div className="absolute top-3 right-4 text-right">
        <div className="text-xs font-bold text-[#00d4ff]">+306%</div>
        <div className="text-[10px] text-[#475569]">voidexa bot</div>
      </div>
      <div className="absolute bottom-10 right-4 text-right">
        <div className="text-xs text-[#475569]">—— buy & hold</div>
      </div>
      <div className="absolute bottom-3 left-4 flex gap-1">
        {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
          <span key={m} className="text-[9px] text-[#334155] w-12 text-center">{m}</span>
        ))}
      </div>
    </div>
  )
}

export default function TradingPage() {
  const [email, setEmail] = useState('')
  const [waitlisted, setWaitlisted] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,212,255,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
          }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block mb-5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                Trading Systems
              </span>
              <h1 className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] leading-tight mb-5"
                style={{ fontFamily: 'var(--font-space)' }}>
                The bot that{' '}
                <span className="gradient-text">reads the market.</span>
              </h1>
              <p className="text-[#64748b] leading-relaxed mb-8 text-lg">
                Regime-aware, multi-agent, fully autonomous. Four market phases,
                dynamic futures overlay, AI-powered risk engine. Set it up once — it runs itself.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#node"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity glow-cyan-btn"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>
                  Join the Node <ArrowRight size={15} />
                </a>
                <a href="#bot"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#94a3b8] hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  How it works
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <TradingHeroViz />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="border-y" style={{ borderColor: 'rgba(0,212,255,0.08)', background: 'rgba(0,212,255,0.02)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="text-center">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="text-2xl font-bold gradient-text mb-0.5" style={{ fontFamily: 'var(--font-space)' }}>{value}</div>
              <div className="text-xs text-[#475569]">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── THE ALL-SEASON BOT ── */}
      <section id="bot" className="section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-3">Flagship product</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#e2e8f0] mb-4" style={{ fontFamily: 'var(--font-space)' }}>
              The All-Season Bot
            </h2>
            <p className="text-[#64748b] max-w-2xl mx-auto leading-relaxed">
              A fully autonomous, multi-agent crypto trading system that classifies market
              conditions every tick, generates allocation proposals, validates them through
              a dedicated risk engine, then executes — or stands down. Nothing runs without passing the gate.
            </p>
          </motion.div>

          {/* Pipeline diagram */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#475569] text-center mb-6">
              5-stage execution pipeline
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 flex-wrap">
              {pipeline.map((step, i) => (
                <div key={step.name} className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-3 rounded-xl text-center min-w-[120px]"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}10, ${step.color}06)`,
                      border: `1px solid ${step.color}30`,
                    }}>
                    <div className="text-sm font-semibold text-[#e2e8f0]">{step.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: step.color }}>{step.sub}</div>
                  </motion.div>
                  {i < pipeline.length - 1 && (
                    <ChevronRight size={14} className="text-[#334155] hidden sm:block flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Market seasons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasons.map((s, i) => (
              <motion.div key={s.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5">
                <div className="text-2xl mb-3" style={{ color: s.color }}>{s.icon}</div>
                <h3 className="text-sm font-semibold text-[#e2e8f0] mb-2">{s.name}</h3>
                <p className="text-xs text-[#475569] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NODE SYSTEM ── */}
      <section id="node" className="section-pad relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0520 50%, #0a0a0f 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="badge-soon mb-5 inline-block">Coming Soon</span>
              <h2 className="text-4xl font-bold text-[#e2e8f0] mb-4" style={{ fontFamily: 'var(--font-space)' }}>
                Join the{' '}
                <span className="gradient-text">Node.</span>
              </h2>
              <p className="text-[#64748b] leading-relaxed mb-6">
                Buy into a shared trading pool powered by the All-Season Bot. Early nodes get the best price — as more people join, the cost per node increases. The bot trades for the collective.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: Users, text: 'Shared pool — bot manages the collective allocation' },
                  { icon: TrendingUp, text: 'Early nodes locked in at lowest price tier' },
                  { icon: Lock, text: 'Trustless — your funds, your keys, your node' },
                  { icon: AlertTriangle, text: 'Price escalates as node count grows' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-[#64748b]">
                    <Icon size={14} className="mt-0.5 flex-shrink-0 text-[#8b5cf6]" />
                    {text}
                  </li>
                ))}
              </ul>

              {/* Waitlist form */}
              {waitlisted ? (
                <div className="p-4 rounded-xl text-sm text-[#00d4ff]"
                  style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  You're on the list. We'll contact you when nodes open.
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-full text-sm outline-none placeholder-[#334155]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
                  />
                  <button
                    onClick={() => email && setWaitlisted(true)}
                    className="px-5 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>
                    Join waitlist
                  </button>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
              <NodeViz />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── RUN YOUR OWN ── */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Run your own */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Zap size={20} style={{ color: '#00d4ff' }} />
              </div>
              <h2 className="text-2xl font-bold text-[#e2e8f0] mb-2" style={{ fontFamily: 'var(--font-space)' }}>
                Run it yourself.
              </h2>
              <p className="text-sm text-[#475569] mb-6 leading-relaxed">
                Prefer full independence? License the All-Season Bot and run it on your own infrastructure — your exchange account, your keys, your data. Choose between a flat license fee or a performance-based split.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Full source code, no black box',
                  'KuCoin spot + futures integration',
                  'Telegram notifications built-in',
                  'Dry-run mode for safe testing',
                  'Ongoing updates included',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#64748b]">
                    <span style={{ color: '#00d4ff' }}>·</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>
                Contact us for pricing <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Aggressive Scalper */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="badge-soon">Coming Soon</span>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Activity size={20} style={{ color: '#8b5cf6' }} />
              </div>
              <h2 className="text-2xl font-bold text-[#e2e8f0] mb-2" style={{ fontFamily: 'var(--font-space)' }}>
                Aggressive Scalper.
              </h2>
              <p className="text-sm text-[#8b5cf6] font-medium mb-4">For experienced traders.</p>
              <p className="text-sm text-[#475569] mb-6 leading-relaxed">
                A high-frequency scalping bot for experienced traders who want speed over caution. Tight entries, fast exits, no hand-holding. Uses momentum signals and order book imbalance for precision.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Sub-minute position cycles',
                  'Order book imbalance detection',
                  'Configurable risk parameters',
                  'Futures-first architecture',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#64748b] opacity-60">
                    <span style={{ color: '#8b5cf6' }}>·</span> {f}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-[#334155]">
                Join the waitlist above to get notified when this launches.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(139,92,246,0.05))',
              border: '1px solid rgba(0,212,255,0.12)',
            }}>
            <h2 className="text-3xl font-bold text-[#e2e8f0] mb-3" style={{ fontFamily: 'var(--font-space)' }}>
              Ready to automate?
            </h2>
            <p className="text-[#64748b] mb-6">
              Whether you want to join the node or run it yourself — start a conversation.
            </p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity glow-cyan-btn"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>
              Get in touch <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
