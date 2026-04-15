'use client'

import { useEffect, useState } from 'react'
import { CombatantSide, CombatPhase } from './CombatEngine'

export interface TurnIndicatorProps {
  phase: CombatPhase
  current: CombatantSide
  selfSide: CombatantSide
  turn: number
  turnLimit: number
}

export default function TurnIndicator({
  phase, current, selfSide, turn, turnLimit,
}: TurnIndicatorProps) {
  const isYourTurn = current === selfSide
  const inCombat = phase === CombatPhase.TurnA || phase === CombatPhase.TurnB
  const [pulse, setPulse] = useState(0)

  // Re-pulse whenever the turn flips
  useEffect(() => {
    setPulse((p) => p + 1)
  }, [current, phase])

  if (!inCombat) return null

  const banner = isYourTurn ? 'YOUR TURN' : "OPPONENT'S TURN"
  const color = isYourTurn ? '#67e8f9' : '#fb7185'

  return (
    <div
      key={pulse} // re-mounts → re-runs animation
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        background: `${color}15`,
        border: `1.5px solid ${color}`,
        borderRadius: 24,
        color,
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '0.05em',
        textShadow: `0 0 12px ${color}aa`,
        animation: 'voidexa-turn-pulse 0.55s ease-out',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      <span>{banner}</span>
      <span style={{ opacity: 0.6, fontWeight: 400, fontSize: 14 }}>
        Turn {turn} / {turnLimit}
      </span>

      <style jsx>{`
        @keyframes voidexa-turn-pulse {
          0%   { transform: scale(0.92); opacity: 0; }
          50%  { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
