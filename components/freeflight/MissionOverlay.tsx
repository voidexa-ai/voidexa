'use client'

import type { MissionTemplate } from '@/lib/game/missions/board'

interface Props {
  mission: MissionTemplate
  cleared: number
  total: number
  visible: boolean
}

export default function MissionOverlay({ mission, cleared, total, visible }: Props) {
  if (!visible) return null
  const pct = total === 0 ? 0 : (cleared / total) * 100
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>Active Contract</div>
      <div style={S.name}>{mission.name}</div>
      <div style={S.objective}>{mission.objective}</div>
      <div style={S.progressRow}>
        <span style={S.progressLabel}>Waypoints</span>
        <span style={S.progressCounter}>
          <span style={S.progressCur}>{cleared}</span>
          <span style={S.progressTotal}> / {total}</span>
        </span>
      </div>
      <div style={S.progressBar}>
        <div style={{ ...S.progressFill, width: `${pct}%` }} />
      </div>
      <div style={S.reward}>Reward on delivery: <b>{mission.rewardMin}–{mission.rewardMax} GHAI</b></div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed', top: 80, right: 24, zIndex: 24,
    width: 280,
    padding: '14px 16px',
    background: 'rgba(6,10,20,0.75)',
    border: '1px solid rgba(0,212,255,0.5)',
    borderRadius: 10,
    backdropFilter: 'blur(8px)',
    boxShadow: '0 0 22px rgba(0,212,255,0.18)',
    fontFamily: 'var(--font-sans)',
    color: '#e8f4ff',
    letterSpacing: '0.01em',
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#00d4ff',
    fontWeight: 600,
    marginBottom: 4,
    textShadow: '0 0 8px rgba(0,212,255,0.5)',
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 6,
  },
  objective: {
    fontSize: 14,
    lineHeight: 1.5,
    color: 'rgba(220,236,255,0.8)',
    marginBottom: 12,
  },
  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(148,163,184,0.85)',
    fontWeight: 600,
  },
  progressCounter: { fontSize: 14 },
  progressCur: { fontSize: 18, color: '#7fff9f', fontWeight: 700 },
  progressTotal: { color: 'rgba(220,216,230,0.65)' },
  progressBar: { height: 6, borderRadius: 3, background: 'rgba(127,119,221,0.2)', overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #00d4ff, #af52de)', transition: 'width 0.4s' },
  reward: {
    fontSize: 13,
    color: '#ffd699',
    letterSpacing: '0.02em',
  },
}
