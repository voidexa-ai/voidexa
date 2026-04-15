'use client'

import { SHIP_STATS } from '@/lib/game/ships'
import type { Combatant } from './CombatEngine'

export interface HealthBarsProps {
  combatant: Combatant
  /** Compact mode for top-of-screen opponent bar. */
  compact?: boolean
}

export default function HealthBars({ combatant, compact }: HealthBarsProps) {
  const stats = SHIP_STATS[combatant.shipClass]
  const hullMax = stats.hull
  const shieldMax = stats.shield
  const hullPct = clamp01(combatant.hull / Math.max(hullMax, 1))
  const shieldPct = clamp01(combatant.shield / Math.max(shieldMax, 1))

  const w = compact ? 220 : 320
  const h = compact ? 12 : 18
  const labelSize = compact ? 14 : 16

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: w }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: labelSize, color: '#e5f7fa' }}>
        <span style={{ fontWeight: 700 }}>{combatant.name}</span>
        <span style={{ opacity: 0.7, fontSize: labelSize - 2 }}>{combatant.shipClass}</span>
      </div>

      <Bar
        label="Hull"
        value={combatant.hull}
        max={hullMax}
        pct={hullPct}
        color="#22c55e"
        height={h}
      />

      <Bar
        label="Shield"
        value={combatant.shield}
        max={shieldMax}
        pct={shieldPct}
        color="#22d3ee"
        height={h}
      />
    </div>
  )
}

function Bar({
  label, value, max, pct, color, height,
}: {
  label: string
  value: number
  max: number
  pct: number
  color: string
  height: number
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 60,
          fontSize: 14,
          color: 'rgba(229,247,250,0.7)',
          textAlign: 'right',
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height,
          background: 'rgba(0,0,0,0.6)',
          border: `1px solid ${color}66`,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${pct * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}cc 0%, ${color} 100%)`,
            transition: 'width 0.25s ease',
            boxShadow: `0 0 6px ${color}88`,
          }}
        />
      </div>
      <div
        style={{
          minWidth: 60,
          textAlign: 'right',
          fontSize: 14,
          fontVariantNumeric: 'tabular-nums',
          color: '#e5f7fa',
        }}
      >
        {value} / {max}
      </div>
    </div>
  )
}

function clamp01(n: number) { return Math.max(0, Math.min(1, n)) }
