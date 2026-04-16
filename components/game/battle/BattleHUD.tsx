'use client'

import type { DroneInstance, PlayerState, Side } from '@/lib/game/battle/types'

interface Props {
  player: PlayerState
  enemy: PlayerState
  activeSide: Side
  turn: number
  onEndTurn: () => void
  canEndTurn: boolean
  onExit: () => void
}

const STATUS_ICON: Record<string, string> = {
  expose: '◎', burn: '🔥', jam: '⚙', lock: '⊘',
  shielded: '⛨', overcharge: '⚡', drone_mark: '⌖', scrap: '◆',
}

const STATUS_COLOR: Record<string, string> = {
  expose: '#d87fff', burn: '#ff8a3c', jam: '#ffd166', lock: '#ff6b6b',
  shielded: '#7fd8ff', overcharge: '#ffd166', drone_mark: '#ff9447', scrap: '#b0b0c4',
}

export default function BattleHUD({ player, enemy, activeSide, turn, onEndTurn, canEndTurn, onExit }: Props) {
  const playerTurn = activeSide === 'player'

  return (
    <>
      <button onClick={onExit} style={S.exitBtn}>← Exit</button>

      <div style={S.turnBanner}>
        <span style={{ ...S.turnText, color: playerTurn ? '#00d4ff' : '#ff8a3c' }}>
          {playerTurn ? 'Your Turn' : 'Enemy Turn'}
        </span>
        <span style={S.turnNumber}>· Turn {turn}</span>
      </div>

      {/* Enemy HUD — top-center */}
      <div style={{ ...S.hullBlock, ...S.enemyHull }}>
        <div style={S.hullRow}>
          <span style={S.hullLabel}>ENEMY HULL</span>
          <span style={S.hullValue}>{enemy.hull} / {enemy.maxHull}</span>
        </div>
        <div style={S.hullBar}>
          <div style={{ ...S.hullFill, width: `${(enemy.hull / enemy.maxHull) * 100}%`, background: 'linear-gradient(90deg, #ff6b6b, #ff8a3c)' }} />
        </div>
        <div style={S.metaRow}>
          {enemy.block > 0 && <BlockPill value={enemy.block} />}
          <StatusRow statuses={enemy.statuses} />
        </div>
        <DroneStrip drones={enemy.drones} side="enemy" />
      </div>

      {/* Player HUD — bottom-left */}
      <div style={{ ...S.hullBlock, ...S.playerHull }}>
        <div style={S.hullRow}>
          <span style={S.hullLabel}>HULL</span>
          <span style={S.hullValue}>{player.hull} / {player.maxHull}</span>
        </div>
        <div style={S.hullBar}>
          <div style={{ ...S.hullFill, width: `${(player.hull / player.maxHull) * 100}%`, background: 'linear-gradient(90deg, #7fff9f, #00d4ff)' }} />
        </div>
        <div style={S.energyRow}>
          <span style={S.hullLabel}>ENERGY</span>
          <div style={S.energyPips}>
            {Array.from({ length: player.maxEnergy }).map((_, i) => (
              <span key={i} style={{ ...S.pip, ...(i < player.energy ? S.pipOn : S.pipOff) }} />
            ))}
          </div>
          <span style={S.energyValue}>{player.energy} / {player.maxEnergy}</span>
        </div>
        <div style={S.metaRow}>
          {player.block > 0 && <BlockPill value={player.block} />}
          <StatusRow statuses={player.statuses} />
        </div>
        <DroneStrip drones={player.drones} side="player" />
      </div>

      {/* End turn button — bottom-right */}
      <button
        onClick={onEndTurn}
        disabled={!canEndTurn}
        style={{ ...S.endTurnBtn, opacity: canEndTurn ? 1 : 0.45, cursor: canEndTurn ? 'pointer' : 'not-allowed' }}
      >
        End Turn →
      </button>
    </>
  )
}

function BlockPill({ value }: { value: number }) {
  return (
    <span style={S.blockPill}>
      <span style={{ fontSize: 14 }}>⛨</span>
      <span>{value}</span>
    </span>
  )
}

function StatusRow({ statuses }: { statuses: PlayerState['statuses'] }) {
  if (statuses.length === 0) return null
  return (
    <span style={S.statusRow}>
      {statuses.map((s, i) => (
        <span
          key={`${s.type}-${i}`}
          style={{
            ...S.statusIcon,
            color: STATUS_COLOR[s.type] ?? '#fff',
            borderColor: `${STATUS_COLOR[s.type] ?? '#fff'}70`,
          }}
          title={`${s.type} × ${s.stacks} (${s.turnsRemaining}t)`}
        >
          <span>{STATUS_ICON[s.type] ?? '●'}</span>
          {s.stacks > 1 && <span style={S.statusStacks}>×{s.stacks}</span>}
        </span>
      ))}
    </span>
  )
}

function DroneStrip({ drones, side }: { drones: DroneInstance[]; side: Side }) {
  if (drones.length === 0) return null
  return (
    <div style={S.droneStrip}>
      <span style={S.hullLabel}>DRONES</span>
      <div style={S.droneRow}>
        {drones.map(d => (
          <div
            key={d.instanceId}
            style={{
              ...S.droneChip,
              borderColor: side === 'player' ? 'rgba(0,212,255,0.55)' : 'rgba(255,107,107,0.55)',
            }}
            title={`${d.templateId} · ${d.hp} HP · ${d.turnsRemaining}t`}
          >
            <span>⬢</span>
            <span>{d.hp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  exitBtn: { position: 'absolute', top: 18, left: 18, pointerEvents: 'auto', padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(127,119,221,0.35)', background: 'rgba(12,14,30,0.75)', color: '#e8e4f0', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', backdropFilter: 'blur(8px)', zIndex: 30 },
  turnBanner: { position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', padding: '10px 18px', borderRadius: 10, background: 'rgba(12,14,30,0.85)', border: '1px solid rgba(127,119,221,0.35)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-sans)', fontSize: 15, letterSpacing: '0.04em', zIndex: 30 },
  turnText: { fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' },
  turnNumber: { marginLeft: 8, color: 'rgba(220,216,230,0.7)' },
  hullBlock: { position: 'absolute', padding: '12px 16px', borderRadius: 12, background: 'rgba(12,14,30,0.82)', border: '1px solid rgba(127,119,221,0.3)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 300, maxWidth: 360, zIndex: 20 },
  enemyHull: { top: 78, left: 24 },
  playerHull: { bottom: 260, left: 24 },
  hullRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  hullLabel: { fontSize: 11, letterSpacing: '0.2em', color: 'rgba(148,163,184,0.85)', fontWeight: 600, textTransform: 'uppercase' },
  hullValue: { fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono), Consolas, monospace' },
  hullBar: { height: 8, borderRadius: 4, background: 'rgba(127,119,221,0.18)', overflow: 'hidden' },
  hullFill: { height: '100%', transition: 'width 0.4s ease' },
  energyRow: { display: 'flex', alignItems: 'center', gap: 10 },
  energyPips: { display: 'flex', gap: 4, flex: 1, flexWrap: 'wrap' },
  pip: { width: 12, height: 12, borderRadius: '50%', border: '1px solid rgba(127,119,221,0.5)' },
  pipOn: { background: 'radial-gradient(circle at 35% 30%, #7ff7ff, #1d6b8a)', boxShadow: '0 0 6px rgba(125,245,255,0.6)', borderColor: 'rgba(125,245,255,0.8)' },
  pipOff: { background: 'transparent' },
  energyValue: { fontSize: 14, fontWeight: 600, color: '#7ff7ff', minWidth: 52, textAlign: 'right' },
  metaRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minHeight: 24 },
  blockPill: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 999, background: 'rgba(127,216,255,0.14)', border: '1px solid rgba(127,216,255,0.5)', color: '#7fd8ff', fontSize: 13, fontWeight: 600 },
  statusRow: { display: 'inline-flex', gap: 6, flexWrap: 'wrap' },
  statusIcon: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, border: '1px solid', fontSize: 13, background: 'rgba(12,14,30,0.6)' },
  statusStacks: { fontSize: 11, fontWeight: 600 },
  droneStrip: { display: 'flex', alignItems: 'center', gap: 8 },
  droneRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  droneChip: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 8, border: '1px solid', background: 'rgba(12,14,30,0.6)', fontSize: 13, color: '#fff' },
  endTurnBtn: { position: 'absolute', bottom: 260, right: 24, padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #ff8a3c, #ff6b6b)', color: '#050210', fontSize: 15, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 0 24px rgba(255,138,60,0.4)', zIndex: 30 },
}
