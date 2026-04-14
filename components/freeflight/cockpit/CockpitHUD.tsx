'use client'

import { useEffect, useState } from 'react'
import type { ShipState, PlanetInfo } from '../types'
import { PLANETS } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  visible: boolean
}

export default function CockpitHUD({ ship, visible }: Props) {
  const [, force] = useState(0)

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => force(x => x + 1), 80)
    return () => clearInterval(id)
  }, [visible])

  if (!visible) return null

  const s = ship.current
  let nearest: PlanetInfo | null = null
  let nearestDist = Infinity
  for (const p of PLANETS) {
    const d = s.position.distanceTo(p.position)
    if (d < nearestDist) { nearest = p; nearestDist = d }
  }

  const speedPct = Math.min(100, (s.speed / 160) * 100)

  const panel: React.CSSProperties = {
    position: 'absolute',
    color: '#6fe6ff',
    fontFamily: 'var(--font-space, monospace)',
    fontSize: 14,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textShadow: '0 0 8px #00d4ff, 0 0 16px #00d4ff88',
    padding: '10px 14px',
    background: 'linear-gradient(180deg, rgba(0,18,30,0.35), rgba(0,18,30,0.15))',
    border: '1px solid rgba(0, 212, 255, 0.4)',
    borderRadius: 6,
    backdropFilter: 'blur(6px)',
    boxShadow: '0 0 22px rgba(0, 212, 255, 0.25), inset 0 0 18px rgba(0,212,255,0.08)',
    minWidth: 180,
  }

  const bar = (label: string, pct: number, color: string) => (
    <div style={{ marginTop: 6 }}>
      <div style={{ fontSize: 14, opacity: 0.85 }}>{label}</div>
      <div style={{
        width: 160, height: 8, background: 'rgba(0,30,50,0.5)',
        border: `1px solid ${color}88`, borderRadius: 4, overflow: 'hidden',
        boxShadow: `0 0 8px ${color}66`,
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 10px ${color}`,
          transition: 'width 0.15s',
        }} />
      </div>
    </div>
  )

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {/* Crosshair */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 24, height: 24,
        border: '1px solid rgba(0,212,255,0.6)',
        borderRadius: '50%',
        boxShadow: '0 0 12px rgba(0,212,255,0.5)',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 3, height: 3, borderRadius: '50%',
          background: '#00ffff', boxShadow: '0 0 6px #00ffff',
        }} />
      </div>

      {/* Speed — bottom left */}
      <div style={{ ...panel, bottom: 20, left: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>
          {Math.round(s.speed)} <span style={{ fontSize: 12, opacity: 0.7 }}>u/s</span>
        </div>
        {bar('Velocity', speedPct, '#00d4ff')}
        {s.boost && <div style={{ marginTop: 6, color: '#ffaa00', fontSize: 14, textShadow: '0 0 8px #ffaa00' }}>● BOOST</div>}
        {s.brake && <div style={{ marginTop: 6, color: '#ff6699', fontSize: 14, textShadow: '0 0 8px #ff6699' }}>● BRAKE</div>}
      </div>

      {/* Health/Shield — bottom right */}
      <div style={{ ...panel, bottom: 20, right: 20 }}>
        {bar('Hull', s.health, '#66ff99')}
        {bar('Shield', s.shield, '#00d4ff')}
      </div>

      {/* Nearest planet — top right */}
      {nearest && (
        <div style={{ ...panel, top: 20, right: 20 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Nearest</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#00ffff' }}>{nearest.name}</div>
          <div style={{ fontSize: 14 }}>{Math.round(nearestDist)} u</div>
        </div>
      )}

      {/* Mode + keys — top left */}
      <div style={{ ...panel, top: 20, left: 20 }}>
        <div style={{ fontSize: 14, opacity: 0.8 }}>Cockpit · First Person</div>
        <div style={{ fontSize: 14, marginTop: 4, opacity: 0.6 }}>V · Third Person</div>
        <div style={{ fontSize: 14, opacity: 0.6 }}>ESC · Menu</div>
      </div>
    </div>
  )
}
