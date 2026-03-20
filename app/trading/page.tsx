'use client'

import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  ArrowRight, TrendingUp, Shield, Activity, Clock, Zap,
  ChevronRight, Users, Lock, AlertTriangle, CheckCircle2,
} from 'lucide-react'

/* ─── Pipeline stages ─── */
const pipeline = [
  { name: 'Market Data',   sub: 'KuCoin · Binance',  color: '#00d4ff' },
  { name: 'Season Engine', sub: 'Regime detection',   color: '#4fc3f7' },
  { name: 'Rebalance',     sub: 'Proposal engine',    color: '#7c6ff7' },
  { name: 'Risk Gate',     sub: 'Final authority',    color: '#a78bfa' },
  { name: 'Execution',     sub: 'Dry-run / Live',     color: '#8b5cf6' },
]

const stats = [
  { icon: TrendingUp, value: '+306%',   label: '12-month backtest',     color: '#00d4ff' },
  { icon: Activity,   value: '+312%',   label: 'vs buy-and-hold alpha', color: '#8b5cf6' },
  { icon: Shield,     value: '11',      label: 'coins tracked',         color: '#00d4ff' },
  { icon: Clock,      value: '4',       label: 'market phases',         color: '#8b5cf6' },
]

const seasons = [
  {
    name: 'BTC Phase',
    desc: 'Bitcoin dominance rising — overweight BTC, reduce alts, futures overlay long BTC.',
    icon: '₿',
    color: '#f7931a',
    alloc: 'BTC 40% · ETH 15% · USDT 18%',
  },
  {
    name: 'ETH Phase',
    desc: 'Ethereum breaking out — rotate into ETH and the L2 ecosystem, trim BTC.',
    icon: 'Ξ',
    color: '#627eea',
    alloc: 'ETH 35% · BTC 25% · alts 30%',
  },
  {
    name: 'Altcoin Phase',
    desc: 'Alt season — momentum-weighted exposure across 11 coins, BTC trimmed.',
    icon: '◈',
    color: '#00d4ff',
    alloc: 'Top alts 60% · BTC 20% · USDT 8%',
  },
  {
    name: 'RISK_OFF',
    desc: 'Market stress detected — rotate to stable assets, short BTC futures via overlay.',
    icon: '⊘',
    color: '#ef4444',
    alloc: 'USDT 83% · BTC 10% · ETH 5%',
  },
]

/* ─── Living network node visualization ─── */
const NET_NODES = [
  { id: 0,  x: 50, y: 15, active: true,  size: 4,   label: 'Master' },
  { id: 1,  x: 22, y: 35, active: true,  size: 3,   label: 'Node 1' },
  { id: 2,  x: 50, y: 35, active: true,  size: 3,   label: 'Node 2' },
  { id: 3,  x: 78, y: 35, active: true,  size: 3,   label: 'Node 3' },
  { id: 4,  x: 12, y: 58, active: true,  size: 2.5, label: '' },
  { id: 5,  x: 34, y: 58, active: true,  size: 2.5, label: '' },
  { id: 6,  x: 56, y: 58, active: true,  size: 2.5, label: '' },
  { id: 7,  x: 78, y: 58, active: true,  size: 2.5, label: '' },
  { id: 8,  x: 22, y: 78, active: false, size: 2,   label: '' },
  { id: 9,  x: 40, y: 78, active: false, size: 2,   label: '' },
  { id: 10, x: 60, y: 78, active: false, size: 2,   label: '' },
  { id: 11, x: 78, y: 78, active: false, size: 2,   label: '' },
]

const NET_EDGES = [
  [0,1],[0,2],[0,3],
  [1,4],[1,5],[2,5],[2,6],[3,6],[3,7],
]

function NetworkViz() {
  const [pulse, setPulse] = useState(0)
  const [joinPulse, setJoinPulse] = useState(false)

  useEffect(() => {
    const t1 = setInterval(() => setPulse(p => (p + 1) % NET_EDGES.length), 600)
    const t2 = setInterval(() => { setJoinPulse(true); setTimeout(() => setJoinPulse(false), 1200) }, 3500)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div className="relative">
      <div
        className="rounded-2xl p-6 overflow-hidden relative"
        style={{
          background: 'rgba(7,4,18,0.8)',
          border: '1px solid rgba(0,212,255,0.12)',
          boxShadow: '0 0 40px rgba(0,212,255,0.05)',
        }}
      >
        <svg viewBox="0 0 100 95" className="w-full h-60">
          <defs>
            <radialGradient id="activeNode" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="masterNode" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#a78bfa" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Inactive future nodes */}
          {NET_NODES.filter(n => !n.active).map(n => (
            <circle key={n.id} cx={n.x} cy={n.y} r={n.size}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
            />
          ))}

          {/* Edges with pulsing highlight */}
          {NET_EDGES.map(([a, b], i) => {
            const na = NET_NODES[a], nb = NET_NODES[b]
            const active = i === pulse
            return (
              <motion.line key={i}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={active ? '#00d4ff' : 'rgba(0,212,255,0.2)'}
                strokeWidth={active ? 0.8 : 0.4}
                opacity={active ? 1 : 0.6}
                animate={{ opacity: active ? [0.4, 1, 0.4] : 0.5 }}
                transition={{ duration: 0.6 }}
              />
            )
          })}

          {/* Active nodes */}
          {NET_NODES.filter(n => n.active).map(n => (
            <g key={n.id} filter="url(#glow)">
              {/* Halo */}
              <motion.circle cx={n.x} cy={n.y} r={n.id === 0 ? 8 : 5}
                fill="none"
                stroke={n.id === 0 ? '#00d4ff' : '#8b5cf6'}
                strokeWidth="0.3"
                opacity={0.3}
                animate={{ r: [n.id === 0 ? 8 : 5, n.id === 0 ? 12 : 8], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: n.id * 0.2 }}
              />
              {/* Core */}
              <circle cx={n.x} cy={n.y} r={n.size}
                fill={n.id === 0 ? 'url(#masterNode)' : 'url(#activeNode)'}
                stroke={n.id === 0 ? 'rgba(0,212,255,0.8)' : 'rgba(0,212,255,0.5)'}
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Joining node pulse (node 8) */}
          {joinPulse && (
            <motion.circle cx={NET_NODES[8].x} cy={NET_NODES[8].y} r={2}
              fill="rgba(0,212,255,0.6)"
              stroke="#00d4ff" strokeWidth="0.5"
              animate={{ r: [2, 8], opacity: [1, 0] }}
              transition={{ duration: 1.2 }}
            />
          )}

          {/* Labels for top nodes */}
          <text x={50} y={10} textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="3" fontWeight="bold">master</text>
          {[1,2,3].map(id => {
            const n = NET_NODES[id]
            return <text key={id} x={n.x} y={n.y + 7} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="2.5">node {id}</text>
          })}
        </svg>

        {/* Status bar */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl mt-1"
          style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.08)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"
              style={{ boxShadow: '0 0 6px #00d4ff', animation: 'breathe 2s ease-in-out infinite' }} />
            <span className="text-xs text-[#475569]">7 active nodes</span>
          </div>
          <span className="text-[10px] text-[#334155]">next tier opens at 20</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] opacity-40" />
            <span className="text-[10px] text-[#334155]">13 open slots</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Animated backtest chart ─── */
function BacktestChart() {
  const botPath  = 'M0,72 C8,68 12,60 20,52 C28,44 32,38 40,30 C48,22 54,26 62,18 C70,10 76,8 84,5 C90,3 95,6 100,2'
  const holdPath = 'M0,72 C25,74 55,70 100,76'

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(7,4,18,0.8)',
        border: '1px solid rgba(0,212,255,0.12)',
        height: 280,
      }}
    >
      <svg viewBox="0 0 100 85" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0.25" />
            <stop offset="60%"  stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="botLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00d4ff" />
            <stop offset="50%"  stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f471b5" />
          </linearGradient>
        </defs>

        {/* Horizontal grid */}
        {[15, 30, 45, 60, 75].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
        ))}
        {/* Vertical grid */}
        {[20, 40, 60, 80].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="85"
            stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
        ))}

        {/* Buy-and-hold */}
        <motion.path d={holdPath} fill="none"
          stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" strokeDasharray="2,2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />

        {/* Area fill */}
        <motion.path
          d={`${botPath} L100,85 L0,85 Z`}
          fill="url(#chartFill)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        />

        {/* Bot line */}
        <motion.path d={botPath} fill="none"
          stroke="url(#botLine)" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />

        {/* End dot + glow */}
        <motion.circle cx="100" cy="2" r="2.5" fill="#f471b5"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5 }}
        />
        <motion.circle cx="100" cy="2" r="2.5" fill="none" stroke="#f471b5" strokeWidth="0.6"
          animate={{ r: [2.5, 6], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 2.8 }}
        />

        {/* Season bands (subtle) */}
        <rect x="0" y="0" width="25" height="85" fill="rgba(247,147,26,0.025)" />
        <rect x="25" y="0" width="18" height="85" fill="rgba(98,126,234,0.025)" />
        <rect x="43" y="0" width="22" height="85" fill="rgba(0,212,255,0.025)" />
        <rect x="65" y="0" width="15" height="85" fill="rgba(239,68,68,0.04)" />
        <rect x="80" y="0" width="20" height="85" fill="rgba(0,212,255,0.025)" />
      </svg>

      {/* Chart labels */}
      <div className="absolute top-3 right-4 text-right">
        <div
          className="text-sm font-bold"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #f471b5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-space)',
          }}
        >
          +306%
        </div>
        <div className="text-[10px] text-[#334155]">All-Season Bot</div>
      </div>
      <div className="absolute bottom-14 right-10 text-right">
        <div className="text-[10px] text-[#334155]">--- buy & hold</div>
      </div>

      {/* X axis labels */}
      <div className="absolute bottom-3 left-4 right-4 flex justify-between">
        {['Apr', 'Jun', 'Aug', 'Oct', 'Dec', 'Feb', 'Mar'].map(m => (
          <span key={m} className="text-[9px]" style={{ color: '#283040' }}>{m}</span>
        ))}
      </div>

      {/* Season phase indicators */}
      <div className="absolute top-3 left-4 flex gap-3">
        {[
          { label: 'BTC', color: '#f7931a' },
          { label: 'ETH', color: '#627eea' },
          { label: 'ALT', color: '#00d4ff' },
          { label: 'OFF', color: '#ef4444' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, opacity: 0.7 }} />
            <span style={{ color: '#283040', fontSize: 9 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Features list ─── */
const features = [
  'Multi-agent architecture — Scanner, Season, Futures, Portfolio agents running independently',
  'Season Engine classifies BTC/ETH/ALTCOIN/RISK_OFF phases every tick',
  'Rebalance engine generates proposals with momentum weighting (never executes directly)',
  'Risk Gate is the final authority — every order must pass before execution',
  'Futures overlay: adaptive leverage 1x–5x based on signal confidence + volume',
  'Trailing stops, breakeven logic, funding rate harvester in RISK_OFF',
  'Telegram notifications for every signal, trade, and daily summary',
  'Paper trading simulator runs in parallel with live bot',
  'KuCoin spot + futures integration via ccxt',
  'Full source code — no black box, you own it',
]

export default function TradingPage() {
  const [email, setEmail] = useState('')
  const [waitlisted, setWaitlisted] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#07070d' }}>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        {/* Mesh */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,212,255,0.08) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 60%, rgba(139,92,246,0.06) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <span
                className="inline-flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.22)', color: '#00d4ff', fontFamily: 'var(--font-space)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"
                  style={{ boxShadow: '0 0 6px #00d4ff', animation: 'breathe 2s ease-in-out infinite' }} />
                AI Trading Systems
              </span>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-5"
                style={{ fontFamily: 'var(--font-space)' }}
              >
                <span className="text-[#e2e8f0]">The bot that{' '}</span>
                <span style={{
                  background: 'linear-gradient(135deg, #00d4ff 0%, #a78bfa 55%, #f471b5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.25))',
                }}>
                  reads the market.
                </span>
              </h1>
              <p className="text-[#3d5068] leading-relaxed mb-8 text-lg max-w-lg">
                An autonomous trading system that reads the market in real time, adjusts strategy
                across four phases, and executes through a five-stage risk pipeline.
                Set it once — it runs itself.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#node" className="btn-primary glow-cyan-btn">
                  Join the Node <ArrowRight size={15} />
                </a>
                <a href="#bot" className="btn-ghost">
                  How it works
                </a>
              </div>
            </motion.div>

            {/* Right — chart */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
              <BacktestChart />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ borderTop: '1px solid rgba(0,212,255,0.08)', borderBottom: '1px solid rgba(0,212,255,0.08)', background: 'rgba(0,212,255,0.015)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="text-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div
                className="text-2xl font-bold mb-0.5"
                style={{
                  fontFamily: 'var(--font-space)',
                  background: `linear-gradient(135deg, ${color}, #a78bfa)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >{value}</div>
              <div className="text-xs text-[#3d5068] tracking-wide">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── THE ALL-SEASON BOT ── */}
      <section id="bot" className="section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-divider mb-20 opacity-30" />

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: 'rgba(0,212,255,0.6)', fontFamily: 'var(--font-space)' }}>
              Flagship product
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#e2e8f0] mb-4"
              style={{ fontFamily: 'var(--font-space)' }}
            >
              The All-Season Bot
            </h2>
            <p className="text-[#3d5068] max-w-2xl mx-auto leading-relaxed">
              An autonomous trading system that reads the market in real time, adjusts strategy
              across four phases, and executes through a five-stage risk pipeline.
              Set it once — it runs itself.
            </p>
          </motion.div>

          {/* Pipeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center mb-6"
              style={{ color: '#2a3a4a', fontFamily: 'var(--font-space)' }}>
              5-stage execution pipeline
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 flex-wrap">
              {pipeline.map((step, i) => (
                <div key={step.name} className="flex items-center gap-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    className="px-4 py-3 rounded-xl text-center cursor-default"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}10, ${step.color}05)`,
                      border: `1px solid ${step.color}28`,
                      minWidth: 120,
                    }}
                  >
                    <div className="text-xs font-semibold text-[#e2e8f0]">{step.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: step.color }}>{step.sub}</div>
                  </motion.div>
                  {i < pipeline.length - 1 && (
                    <ChevronRight size={12} className="hidden sm:block flex-shrink-0" style={{ color: '#1e2a38' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Market phases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {seasons.map((s, i) => (
              <motion.div key={s.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card shimmer-card rounded-2xl p-5"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 font-bold"
                  style={{ background: `${s.color}12`, border: `1px solid ${s.color}25`, color: s.color }}
                >
                  {s.icon}
                </div>
                <h3 className="text-sm font-bold text-[#e2e8f0] mb-1.5" style={{ fontFamily: 'var(--font-space)' }}>
                  {s.name}
                </h3>
                <p className="text-xs text-[#3d5068] leading-relaxed mb-3">{s.desc}</p>
                <div
                  className="text-[10px] font-medium px-2 py-1 rounded-lg"
                  style={{ background: `${s.color}08`, color: s.color, border: `1px solid ${s.color}18` }}
                >
                  {s.alloc}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Full feature list */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 lg:p-10"
          >
            <h3 className="text-xl font-bold text-[#e2e8f0] mb-6" style={{ fontFamily: 'var(--font-space)' }}>
              Everything the bot can do
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map(f => (
                <div key={f} className="flex items-start gap-2.5 text-sm text-[#3d5068] leading-relaxed">
                  <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#00d4ff' }} />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── NODE SYSTEM ── */}
      <section id="node" className="section-pad relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #07070d 0%, #0d0419 50%, #07070d 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(139,92,246,0.07) 0%, transparent 65%)' }} />
        <div className="absolute top-0 left-0 right-0">
          <div className="section-divider opacity-25" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <span className="badge-soon mb-5 inline-block">Coming Soon</span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-space)' }}>
                <span className="text-[#e2e8f0]">Join the </span>
                <span style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.3))',
                }}>Node.</span>
              </h2>
              <p className="text-[#3d5068] leading-relaxed mb-6 text-base">
                Buy into a shared trading pool powered by the All-Season Bot.
                Early nodes lock in at the lowest price tier — as more people join, the cost
                per node increases. The bot trades for the collective. You hold a node. The node earns.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: Users,         text: 'Shared pool — bot manages collective allocation' },
                  { icon: TrendingUp,    text: 'Early nodes locked in at lowest price tier forever' },
                  { icon: Lock,         text: 'Trustless — your funds, your keys, your node' },
                  { icon: AlertTriangle, text: 'Price escalates as node count grows (currently tier 1)' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-[#3d5068]">
                    <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#8b5cf6' }} />
                    {text}
                  </li>
                ))}
              </ul>

              {waitlisted ? (
                <div className="p-4 rounded-xl text-sm font-medium"
                  style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                  You're on the list. We'll contact you when nodes open.
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && email && setWaitlisted(true)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-full text-sm outline-none placeholder-[#1e2a38]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
                  />
                  <button
                    onClick={() => email && setWaitlisted(true)}
                    className="px-5 py-3 rounded-full text-sm font-semibold text-[#07070d] hover:opacity-90 transition-opacity flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
                  >
                    Join waitlist
                  </button>
                </div>
              )}
            </motion.div>

            {/* Right — living network */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
              <NetworkViz />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LICENSE OPTIONS ── */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-divider mb-20 opacity-25" />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#e2e8f0]" style={{ fontFamily: 'var(--font-space)' }}>
              Or run it yourself.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* License */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card shimmer-card rounded-3xl p-8"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Zap size={20} style={{ color: '#00d4ff' }} />
              </div>
              <h3 className="text-2xl font-bold text-[#e2e8f0] mb-2" style={{ fontFamily: 'var(--font-space)' }}>
                All-Season Bot License
              </h3>
              <p className="text-sm text-[#3d5068] mb-6 leading-relaxed">
                License the full system — your exchange account, your keys, your infrastructure.
                Flat fee or performance split. Full source code, no black box.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Full Python source code', 'KuCoin spot + futures integration',
                  'Telegram notifications built-in', 'Paper trading mode for safe testing',
                  'Ongoing updates included', 'Setup documentation + support',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#3d5068]">
                    <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#00d4ff' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact"
                className="btn-primary glow-cyan-btn inline-flex">
                Contact for pricing <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Scalper */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass-card shimmer-card rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-5 right-5">
                <span className="badge-soon">Coming Soon</span>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Activity size={20} style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-2xl font-bold text-[#e2e8f0] mb-1" style={{ fontFamily: 'var(--font-space)' }}>
                Aggressive Scalper
              </h3>
              <p className="text-sm font-semibold mb-4" style={{ color: '#8b5cf6' }}>For experienced traders only.</p>
              <p className="text-sm text-[#3d5068] mb-6 leading-relaxed">
                High-frequency scalping bot. Sub-minute cycles, order book imbalance detection,
                momentum signals. Tight entries, fast exits, no hand-holding.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Sub-minute position cycles', 'Order book imbalance detection',
                  'Configurable risk parameters', 'Futures-first architecture',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm opacity-50 text-[#3d5068]">
                    <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#8b5cf6' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-[#1e2a38]">Join the waitlist above to get notified when this launches.</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="pb-28">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center rounded-3xl p-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(139,92,246,0.05))',
              border: '1px solid rgba(0,212,255,0.12)',
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,212,255,0.04), transparent)' }} />
            <h2 className="relative text-3xl font-bold text-[#e2e8f0] mb-3" style={{ fontFamily: 'var(--font-space)' }}>
              Ready to automate?
            </h2>
            <p className="relative text-[#3d5068] mb-7 max-w-md mx-auto">
              Whether you want to join the node or run it yourself — start a conversation.
              We respond within 24 hours.
            </p>
            <Link href="/contact"
              className="relative btn-primary glow-cyan-btn inline-flex">
              Get in touch <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
