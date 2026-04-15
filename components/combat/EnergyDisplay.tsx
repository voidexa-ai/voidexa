'use client'

import { SHIP_STATS } from '@/lib/game/ships'
import type { Combatant } from './CombatEngine'

export interface EnergyDisplayProps {
  combatant: Combatant
  /** Override the dot count cap (default = 2 × energyPerTurn so you can see overflow visually). */
  capacity?: number
}

export default function EnergyDisplay({ combatant, capacity }: EnergyDisplayProps) {
  const stats = SHIP_STATS[combatant.shipClass]
  const cap = capacity ?? Math.max(combatant.energy, stats.energyPerTurn * 2)
  const dots: boolean[] = []
  for (let i = 0; i < cap; i++) dots.push(i < combatant.energy)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 14, color: 'rgba(229,247,250,0.7)' }}>Energy</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {dots.map((filled, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: filled
                ? 'radial-gradient(circle at 30% 30%, #67e8f9 0%, #22d3ee 60%, #06748c 100%)'
                : 'transparent',
              border: `1.5px solid ${filled ? '#67e8f9' : 'rgba(34,211,238,0.4)'}`,
              boxShadow: filled ? '0 0 8px #22d3ee88' : 'none',
              transition: 'background 0.15s, box-shadow 0.15s',
            }}
            aria-label={filled ? 'filled energy' : 'empty energy'}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: 14,
          color: '#67e8f9',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          marginLeft: 4,
        }}
      >
        {combatant.energy}
      </span>
    </div>
  )
}
