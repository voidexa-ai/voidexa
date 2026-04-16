'use client'

import { useState } from 'react'
import { POWERUPS, type PowerUpId, type TrackDef } from '@/lib/game/speedrun/tracks'

interface Props {
  track: TrackDef
  onStart: (selected: PowerUpId[]) => void
  onCancel: () => void
}

const POWERUP_IDS: PowerUpId[] = ['thruster_surge', 'phase_shell', 'null_drift']

export default function PreRacePanel({ track, onStart, onCancel }: Props) {
  const [selected, setSelected] = useState<PowerUpId[]>([])

  function toggle(id: PowerUpId) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const totalCost = selected.reduce((sum, id) => sum + POWERUPS[id].costGhai, 0)

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.eyebrow}>Pre-race loadout</div>
        <h2 style={S.title}>{track.name}</h2>
        <p style={S.subtitle}>
          Pick up to 3 power-ups. Use them mid-race with <b>Space</b>. First selected = first used.
        </p>

        <div style={S.grid}>
          {POWERUP_IDS.map(id => {
            const def = POWERUPS[id]
            const active = selected.includes(id)
            const order = selected.indexOf(id) + 1
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                style={{
                  ...S.tile,
                  borderColor: active ? 'rgba(0,212,255,0.65)' : 'rgba(127,119,221,0.28)',
                  background: active
                    ? 'linear-gradient(145deg, rgba(0,212,255,0.1), rgba(175,82,222,0.08))'
                    : 'rgba(12,14,30,0.6)',
                  boxShadow: active ? '0 0 24px rgba(0,212,255,0.25)' : 'none',
                }}
              >
                {active && <span style={S.orderBadge}>{order}</span>}
                <div style={S.tileName}>{def.name}</div>
                <div style={S.tileDesc}>{def.description}</div>
                <div style={S.tileCost}>
                  <span style={{ color: '#ffd166', fontWeight: 600 }}>{def.costGhai} GHAI</span>
                </div>
              </button>
            )
          })}
        </div>

        <div style={S.totalRow}>
          <span style={S.totalLabel}>Total</span>
          <span style={{ ...S.totalValue, color: totalCost === 0 ? 'rgba(220,216,230,0.6)' : '#ffd166' }}>
            {totalCost} GHAI
          </span>
        </div>
        <div style={S.mvpNote}>MVP build — power-ups free to test. Wallet billing arrives with Void Prix.</div>

        <div style={S.actions}>
          <button onClick={onCancel} style={S.secondaryBtn}>Back</button>
          <button onClick={() => onStart(selected)} style={S.primaryBtn}>
            Launch Race →
          </button>
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,1,10,0.82)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 680,
    padding: 32,
    borderRadius: 16,
    background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))',
    border: '1px solid rgba(127,119,221,0.35)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#00d4ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    margin: '4px 0 8px',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 1.55,
    color: 'rgba(220,216,230,0.8)',
    margin: '0 0 22px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginBottom: 20,
  },
  tile: {
    position: 'relative',
    padding: 16,
    borderRadius: 12,
    border: '1px solid',
    background: 'rgba(12,14,30,0.6)',
    cursor: 'pointer',
    textAlign: 'left',
    color: '#e8e4f0',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  orderBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#00d4ff',
    color: '#050210',
    fontSize: 13,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 6,
  },
  tileDesc: {
    fontSize: 14,
    lineHeight: 1.5,
    color: 'rgba(220,216,230,0.75)',
    marginBottom: 10,
  },
  tileCost: {
    fontSize: 13,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 18px',
    borderRadius: 10,
    background: 'rgba(127,119,221,0.08)',
    border: '1px solid rgba(127,119,221,0.2)',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 14,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(148,163,184,0.9)',
    fontWeight: 600,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 700,
  },
  mvpNote: {
    fontSize: 13,
    color: 'rgba(220,216,230,0.55)',
    textAlign: 'center',
    marginBottom: 18,
  },
  actions: {
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end',
  },
  secondaryBtn: {
    padding: '12px 20px',
    borderRadius: 10,
    border: '1px solid rgba(127,119,221,0.35)',
    background: 'transparent',
    color: '#e8e4f0',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  primaryBtn: {
    padding: '12px 24px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #00d4ff, #af52de)',
    color: '#050210',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 0 22px rgba(0,212,255,0.4)',
  },
}
