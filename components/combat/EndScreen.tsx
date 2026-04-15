'use client'

import Link from 'next/link'
import { CombatPhase, CombatantSide } from './CombatEngine'

export interface EndScreenProps {
  phase: CombatPhase
  selfSide: CombatantSide
  winner?: CombatantSide
  /** Reward summary lines (e.g. "+25 rank points", "+1 Rare card"). */
  rewards?: string[]
  onRematch?: () => void
  /** Default destination for "Return to Flight" button. */
  returnHref?: string
}

export default function EndScreen({
  phase, selfSide, winner, rewards = [], onRematch, returnHref = '/freeflight',
}: EndScreenProps) {
  const isOver =
    phase === CombatPhase.Won ||
    phase === CombatPhase.Lost ||
    phase === CombatPhase.Draw
  if (!isOver) return null

  let title = 'DRAW'
  let color = '#9ca3af'
  let subtitle = 'Both pilots survived 30 turns. No rewards.'
  if (phase === CombatPhase.Draw) {
    title = 'DRAW'
    color = '#9ca3af'
  } else if (winner === selfSide) {
    title = 'VICTORY'
    color = '#22c55e'
    subtitle = 'Opponent ship destroyed.'
  } else {
    title = 'DEFEAT'
    color = '#fb7185'
    subtitle = 'Your hull was destroyed.'
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          padding: 32,
          background: 'linear-gradient(180deg, rgba(15,17,28,0.95), rgba(8,10,18,0.95))',
          border: `2px solid ${color}`,
          borderRadius: 16,
          boxShadow: `0 0 64px ${color}55, 0 0 16px ${color}88`,
          textAlign: 'center',
          color: '#e5f7fa',
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color,
            letterSpacing: '0.1em',
            textShadow: `0 0 16px ${color}aa`,
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 16, opacity: 0.7, marginBottom: 24 }}>
          {subtitle}
        </div>

        {rewards.length > 0 && (
          <div
            style={{
              padding: 16,
              background: `${color}15`,
              border: `1px solid ${color}55`,
              borderRadius: 8,
              marginBottom: 24,
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>Rewards</div>
            {rewards.map((r, i) => (
              <div key={i} style={{ padding: '4px 0', fontSize: 16, color }}>
                ▸ {r}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {onRematch && (
            <button
              onClick={onRematch}
              style={{
                padding: '10px 18px',
                background: `${color}22`,
                border: `1px solid ${color}`,
                color,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Rematch
            </button>
          )}
          <Link
            href={returnHref}
            style={{
              padding: '10px 18px',
              background: 'rgba(34,211,238,0.15)',
              border: '1px solid rgba(34,211,238,0.55)',
              color: '#67e8f9',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Return to Flight
          </Link>
        </div>
      </div>
    </div>
  )
}
