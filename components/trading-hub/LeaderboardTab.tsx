'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown, Shield } from 'lucide-react'

const ACCENT = '#cc9955'

type RegimeKey = 'btc' | 'eth' | 'alt' | 'risk-off' | 'all'

const REGIME_CONFIG: Record<RegimeKey, { label: string; color: string; bg: string }> = {
  btc:       { label: 'BTC Phase',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  eth:       { label: 'ETH Phase',    color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
  alt:       { label: 'Alt Phase',    color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  'risk-off':{ label: 'Risk-Off',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  all:       { label: 'All Phases',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
}

interface BotRow {
  rank: number
  name: string
  creator: string
  return_pct: number
  sharpe: number
  max_drawdown: number
  regime: RegimeKey
  isHouse?: boolean
}

const MOCK_BOTS: BotRow[] = [
  { rank: 1, name: 'voidexa All-Season',  creator: 'voidexa',   return_pct: 306.4, sharpe: 3.21, max_drawdown: 8.4,  regime: 'all',      isHouse: true },
  { rank: 2, name: 'BTC Momentum Alpha',  creator: 'cryptovoid', return_pct: 218.7, sharpe: 2.44, max_drawdown: 14.2, regime: 'btc'  },
  { rank: 3, name: 'ETH Grid Master',     creator: 'gridlord',   return_pct: 187.3, sharpe: 2.11, max_drawdown: 11.8, regime: 'eth'  },
  { rank: 4, name: 'AltSeason Hunter',    creator: 'moonbase9',  return_pct: 155.9, sharpe: 1.88, max_drawdown: 22.1, regime: 'alt'  },
  { rank: 5, name: 'Safe Harbor v2',      creator: 'stableops',  return_pct: 98.4,  sharpe: 2.89, max_drawdown: 4.2,  regime: 'risk-off'},
  { rank: 6, name: 'Regime Switcher',     creator: 'adaptai',    return_pct: 142.0, sharpe: 1.72, max_drawdown: 18.6, regime: 'all'  },
  { rank: 7, name: 'MACD Crossover Pro',  creator: 'techtrader', return_pct: 76.3,  sharpe: 1.34, max_drawdown: 25.0, regime: 'btc'  },
]

type SortKey = 'return_pct' | 'sharpe' | 'max_drawdown'
type SortDir = 'asc' | 'desc'

function RegimeBadge({ regime }: { regime: RegimeKey }) {
  const cfg = REGIME_CONFIG[regime]
  return (
    <span
      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, background: cfg.bg, fontSize: '0.8125rem', letterSpacing: '0.02em' }}
    >
      {cfg.label}
    </span>
  )
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} style={{ color: '#334155' }} />
  if (sortDir === 'desc') return <ChevronDown size={13} style={{ color: ACCENT }} />
  return <ChevronUp size={13} style={{ color: ACCENT }} />
}

export default function LeaderboardTab() {
  const [sortKey, setSortKey] = useState<SortKey>('return_pct')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...MOCK_BOTS].sort((a, b) => {
    const mult = sortDir === 'desc' ? -1 : 1
    return mult * (a[sortKey] - b[sortKey])
  })

  return (
    <div className="space-y-8" style={{ paddingTop: '40px' }}>
      {/* House bot banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(204,153,85,0.12) 0%, rgba(204,153,85,0.04) 100%)`,
          border: `1px solid ${ACCENT}33`,
          boxShadow: `0 0 60px ${ACCENT}0a`,
          paddingTop: '24px',
          paddingBottom: '24px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} style={{ color: ACCENT }} />
              <span
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: `${ACCENT}88`, letterSpacing: '0.14em' }}
              >
                House Bot · All-Season
              </span>
            </div>
            <h2
              className="font-medium mb-1"
              style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)' }}
            >
              voidexa All-Season
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
              Current regime: <span style={{ color: '#3b82f6', fontWeight: 500 }}>BTC Phase</span>
              {' '}— strategy adapting to market conditions in real-time.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div
              className="font-medium"
              style={{ color: '#22c55e', fontSize: '2.5rem', letterSpacing: '0.02em', lineHeight: 1 }}
            >
              +306%
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>All-time return</div>
            <div
              className="mt-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT }}
            >
              Can you beat it?
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-6 pt-6" style={{ borderTop: `1px solid ${ACCENT}18` }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>Sharpe Ratio</div>
            <div style={{ color: '#e2e8f0', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.02em' }}>3.21</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>Max Drawdown</div>
            <div style={{ color: '#f87171', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.02em' }}>-8.4%</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>Regime</div>
            <RegimeBadge regime="all" />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Table header */}
        <div
          className="grid gap-0 px-4 py-3 text-xs font-medium uppercase tracking-wider"
          style={{
            gridTemplateColumns: '48px 1fr 120px 120px 120px 140px',
            background: 'rgba(255,255,255,0.03)',
            color: '#475569',
            letterSpacing: '0.1em',
            fontSize: '0.75rem',
          }}
        >
          <div>#</div>
          <div>Bot</div>
          <button className="flex items-center gap-1 hover:text-[#94a3b8] transition-colors" onClick={() => handleSort('return_pct')}>
            Return <SortIcon col="return_pct" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button className="flex items-center gap-1 hover:text-[#94a3b8] transition-colors" onClick={() => handleSort('sharpe')}>
            Sharpe <SortIcon col="sharpe" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button className="flex items-center gap-1 hover:text-[#94a3b8] transition-colors" onClick={() => handleSort('max_drawdown')}>
            Max DD <SortIcon col="max_drawdown" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <div>Regime</div>
        </div>

        {/* Rows */}
        {sorted.map((bot, i) => (
          <motion.div
            key={bot.rank}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="grid items-center px-4 py-4 transition-colors"
            style={{
              gridTemplateColumns: '48px 1fr 120px 120px 120px 140px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              background: bot.isHouse ? `rgba(204,153,85,0.04)` : 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = bot.isHouse ? 'rgba(204,153,85,0.04)' : 'transparent'}
          >
            <div style={{ color: bot.rank <= 3 ? ACCENT : '#475569', fontWeight: 500, fontSize: '1rem' }}>
              {bot.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{bot.name}</span>
                {bot.isHouse && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${ACCENT}18`, color: ACCENT, fontSize: '0.75rem', border: `1px solid ${ACCENT}30` }}
                  >
                    house
                  </span>
                )}
              </div>
              <div style={{ color: '#475569', fontSize: '0.8125rem' }}>@{bot.creator}</div>
            </div>
            <div style={{ color: '#22c55e', fontWeight: 500, fontSize: '1rem', letterSpacing: '0.02em' }}>
              +{bot.return_pct.toFixed(1)}%
            </div>
            <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1rem', letterSpacing: '0.02em' }}>
              {bot.sharpe.toFixed(2)}
            </div>
            <div style={{ color: '#f87171', fontWeight: 500, fontSize: '1rem', letterSpacing: '0.02em' }}>
              -{bot.max_drawdown.toFixed(1)}%
            </div>
            <RegimeBadge regime={bot.regime} />
          </motion.div>
        ))}
      </motion.div>

      <p style={{ color: '#334155', fontSize: '0.8125rem', textAlign: 'center' }}>
        Live data coming soon. Mock data shown above.
      </p>
    </div>
  )
}
