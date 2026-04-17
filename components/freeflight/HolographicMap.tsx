'use client'

import { useMemo, useState } from 'react'
import { buildWarpGraph, warpCost, warpDistance, type WarpNode } from '@/lib/game/warp/network'

interface Props {
  currentNodeId: string
  ghaiBalance: number
  onWarp: (destination: WarpNode, cost: number) => void
  onClose: () => void
}

const ZONE_COLOR: Record<WarpNode['zone'], string> = {
  'Core Zone':  '#7fd8ff',
  'Inner Ring': '#af52de',
}

export default function HolographicMap({ currentNodeId, ghaiBalance, onWarp, onClose }: Props) {
  const graph = useMemo(() => buildWarpGraph(), [])
  const current = graph.find(n => n.id === currentNodeId) ?? graph[0]
  const [selected, setSelected] = useState<WarpNode | null>(null)

  // 2D projection: x stays X, z becomes Y (flat top-down view).
  // Scale into a 600x600 viewBox.
  const { minX, maxX, minZ, maxZ } = graph.reduce(
    (acc, n) => ({
      minX: Math.min(acc.minX, n.x), maxX: Math.max(acc.maxX, n.x),
      minZ: Math.min(acc.minZ, n.z), maxZ: Math.max(acc.maxZ, n.z),
    }),
    { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity },
  )
  const padding = 40
  const size = 600

  const project = (n: WarpNode) => ({
    cx: padding + ((n.x - minX) / Math.max(1, maxX - minX)) * (size - 2 * padding),
    cy: padding + ((n.z - minZ) / Math.max(1, maxZ - minZ)) * (size - 2 * padding),
  })

  const cost = selected ? warpCost(current, selected) : 0
  const canAfford = ghaiBalance >= cost
  const tooFar = selected && cost === 0 && selected.id !== current.id

  return (
    <div style={S.wrap}>
      <div style={S.panel}>
        <div style={S.header}>
          <div>
            <div style={S.eyebrow}>Holographic Map · Warp Network</div>
            <div style={S.currentLine}>Currently at <b>{current.name}</b></div>
          </div>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>

        <div style={S.body}>
          <svg viewBox={`0 0 ${size} ${size}`} style={S.svg}>
            {/* Ring guides */}
            {[0.25, 0.5, 0.75].map(r => (
              <circle
                key={r}
                cx={size / 2}
                cy={size / 2}
                r={(size / 2 - padding) * r}
                fill="none"
                stroke="rgba(127,119,221,0.18)"
                strokeDasharray="4 6"
              />
            ))}
            {/* Nodes */}
            {graph.map(n => {
              const { cx, cy } = project(n)
              const isCurrent = n.id === current.id
              const isSelected = selected?.id === n.id
              const color = ZONE_COLOR[n.zone]
              return (
                <g key={n.id} style={{ cursor: isCurrent ? 'default' : 'pointer' }} onClick={() => {
                  if (!isCurrent) setSelected(n)
                }}>
                  {isCurrent && (
                    <circle cx={cx} cy={cy} r={14} fill="none" stroke="#00d4ff" strokeWidth={2}>
                      <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 9 : 6}
                    fill={color}
                    stroke={isSelected ? '#fff' : 'none'}
                    strokeWidth={2}
                    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                  />
                  <text
                    x={cx + 10}
                    y={cy + 4}
                    fontSize={12}
                    fill={isSelected ? '#fff' : 'rgba(220,216,230,0.8)'}
                    fontFamily="var(--font-sans)"
                  >
                    {n.name}
                  </text>
                </g>
              )
            })}
          </svg>

          <aside style={S.sidebar}>
            {!selected ? (
              <div style={S.hint}>
                <p style={{ margin: '0 0 10px' }}>Click a destination to see the cost.</p>
                <p style={{ margin: 0, color: 'rgba(220,216,230,0.6)' }}>
                  Deep Void has no warp gates — you must fly manually out there.
                </p>
              </div>
            ) : (
              <>
                <div style={S.eyebrow}>Destination</div>
                <div style={S.destName}>{selected.name}</div>
                <div style={S.destZone}>{selected.zone}</div>

                <div style={S.costBlock}>
                  <div style={S.costLabel}>COST</div>
                  <div style={{ ...S.costValue, color: canAfford ? '#ffd166' : '#ff6b6b' }}>
                    {cost} GHAI
                  </div>
                  <div style={S.balance}>Balance: {ghaiBalance} GHAI</div>
                </div>

                <div style={S.distance}>
                  Distance: {Math.round(warpDistance(current, selected))} units
                </div>

                <button
                  onClick={() => onWarp(selected, cost)}
                  disabled={!canAfford || !!tooFar}
                  style={{
                    ...S.warpBtn,
                    opacity: canAfford ? 1 : 0.5,
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                  }}
                >
                  {canAfford ? `Warp → ${selected.name}` : 'Not enough GHAI'}
                </button>
              </>
            )}
            <div style={S.footer}>
              Manual flight stays free. Warp is convenience, not necessity.
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,1,10,0.88)',
    backdropFilter: 'blur(8px)',
    zIndex: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 1100,
    padding: 28,
    borderRadius: 16,
    background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))',
    border: '1px solid rgba(0,212,255,0.35)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.15)',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#00d4ff' },
  currentLine: { fontSize: 16, color: 'rgba(220,236,255,0.88)', marginTop: 4 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    border: '1px solid rgba(127,119,221,0.35)', background: 'transparent',
    color: '#e8e4f0', fontSize: 16, cursor: 'pointer', fontFamily: 'inherit',
  },
  body: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 20 },
  svg: {
    width: '100%',
    height: 'auto',
    aspectRatio: '1 / 1',
    background: 'rgba(6,10,20,0.6)',
    borderRadius: 12,
    border: '1px solid rgba(127,119,221,0.2)',
  },
  sidebar: {
    padding: 20,
    borderRadius: 12,
    background: 'rgba(12,14,30,0.6)',
    border: '1px solid rgba(127,119,221,0.22)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  hint: { fontSize: 14, lineHeight: 1.55, color: 'rgba(220,216,230,0.82)' },
  destName: { fontSize: 22, fontWeight: 700, color: '#fff' },
  destZone: { fontSize: 13, color: 'rgba(148,163,184,0.85)', letterSpacing: '0.04em' },
  costBlock: { padding: '12px 14px', borderRadius: 10, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.22)' },
  costLabel: { fontSize: 11, letterSpacing: '0.18em', color: 'rgba(148,163,184,0.85)', fontWeight: 600, marginBottom: 4 },
  costValue: { fontSize: 22, fontWeight: 700 },
  balance: { fontSize: 13, color: 'rgba(220,216,230,0.65)', marginTop: 4 },
  distance: { fontSize: 14, color: 'rgba(220,216,230,0.75)' },
  warpBtn: {
    padding: '12px 18px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #00d4ff, #af52de)',
    color: '#050210',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.02em',
    fontFamily: 'inherit',
  },
  footer: {
    marginTop: 'auto',
    fontSize: 12,
    color: 'rgba(220,216,230,0.55)',
    lineHeight: 1.5,
  },
}
