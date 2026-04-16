'use client'

import { POWERUPS, formatTime, type PowerUpId } from '@/lib/game/speedrun/tracks'
import type { PowerUpInventory } from './PowerUpSystem'

interface Props {
  elapsedMs: number
  totalGates: number
  clearedGates: number
  countdown: number | null
  inventory: PowerUpInventory
  trackName: string
  onExit: () => void
}

export default function RaceHUD({
  elapsedMs,
  totalGates,
  clearedGates,
  countdown,
  inventory,
  trackName,
  onExit,
}: Props) {
  const active = inventory.active
  const activeName = active ? POWERUPS[active.id].name : null
  const nextInSlot: PowerUpId | null = inventory.slots[0] ?? null

  return (
    <>
      {/* Top bar: track + timer + counter */}
      <div style={S.topBar}>
        <button onClick={onExit} style={S.exitBtn}>← Exit</button>
        <div style={S.trackName}>{trackName}</div>
        <div style={S.timer}>{formatTime(elapsedMs)}</div>
        <div style={S.gateCounter}>
          <span style={S.counterNum}>{clearedGates}</span>
          <span style={S.counterTotal}>/ {totalGates}</span>
        </div>
      </div>

      {/* Countdown overlay */}
      {countdown !== null && (
        <div style={S.countdownWrap}>
          <div style={S.countdownNum}>{countdown === 0 ? 'GO' : countdown}</div>
        </div>
      )}

      {/* Crosshair */}
      <div style={S.crosshair} />

      {/* Bottom-center power-up slot */}
      <div style={S.powerUpSlot}>
        <div style={S.powerUpLabel}>POWER-UP · SPACE</div>
        <div style={S.powerUpBox}>
          {active ? (
            <>
              <div style={S.powerUpName}>{activeName}</div>
              <div style={S.powerUpTimer}>
                <div
                  style={{
                    ...S.powerUpTimerFill,
                    width: `${Math.max(0, ((active.expiresAt - performance.now()) / (active.expiresAt - active.activatedAt)) * 100)}%`,
                  }}
                />
              </div>
            </>
          ) : nextInSlot ? (
            <>
              <div style={{ ...S.powerUpName, opacity: 0.85 }}>{POWERUPS[nextInSlot].name}</div>
              <div style={S.powerUpHint}>Press SPACE</div>
            </>
          ) : (
            <div style={{ ...S.powerUpName, opacity: 0.5 }}>No power-ups</div>
          )}
        </div>
        <div style={S.queueRow}>
          {inventory.slots.slice(0, 5).map((id, i) => (
            <span key={i} style={S.queueDot} title={POWERUPS[id].name} />
          ))}
          {inventory.slots.length === 0 && !active && (
            <span style={{ fontSize: 12, opacity: 0.5 }}>queue empty</span>
          )}
        </div>
      </div>

      {/* Bottom-left controls hint */}
      <div style={S.controlsHint}>
        <div><b>WASD</b> fly · <b>Mouse</b> look · <b>Shift</b> boost · <b>Q/E</b> up/down · <b>Space</b> power-up</div>
      </div>
    </>
  )
}

const S: Record<string, React.CSSProperties> = {
  topBar: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    zIndex: 10,
    pointerEvents: 'none',
  },
  exitBtn: {
    pointerEvents: 'auto',
    padding: '8px 14px',
    borderRadius: 10,
    border: '1px solid rgba(127,119,221,0.35)',
    background: 'rgba(12,14,30,0.75)',
    color: '#e8e4f0',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    backdropFilter: 'blur(8px)',
  },
  trackName: {
    padding: '8px 16px',
    borderRadius: 10,
    background: 'rgba(12,14,30,0.6)',
    border: '1px solid rgba(0,212,255,0.35)',
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    backdropFilter: 'blur(8px)',
  },
  timer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '10px 22px',
    borderRadius: 12,
    background: 'rgba(12,14,30,0.8)',
    border: '1px solid rgba(0,212,255,0.5)',
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    fontFamily: 'var(--font-mono), Consolas, monospace',
    letterSpacing: '0.06em',
    textShadow: '0 0 12px rgba(0,212,255,0.55)',
    minWidth: 160,
    textAlign: 'center',
    backdropFilter: 'blur(8px)',
  },
  gateCounter: {
    padding: '8px 16px',
    borderRadius: 10,
    background: 'rgba(12,14,30,0.75)',
    border: '1px solid rgba(127,119,221,0.4)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    backdropFilter: 'blur(8px)',
  },
  counterNum: {
    fontSize: 22,
    color: '#7fff9f',
    marginRight: 4,
  },
  counterTotal: {
    color: 'rgba(220,216,230,0.6)',
    fontSize: 16,
  },
  countdownWrap: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
    pointerEvents: 'none',
  },
  countdownNum: {
    fontSize: 160,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.03em',
    textShadow: '0 0 40px rgba(0,212,255,0.85), 0 0 80px rgba(175,82,222,0.4)',
    fontFamily: 'var(--font-sans)',
  },
  crosshair: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 12,
    height: 12,
    marginLeft: -6,
    marginTop: -6,
    borderRadius: '50%',
    border: '1px solid rgba(0,212,255,0.55)',
    boxShadow: '0 0 10px rgba(0,212,255,0.35)',
    zIndex: 5,
    pointerEvents: 'none',
  },
  powerUpSlot: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
    pointerEvents: 'none',
  },
  powerUpLabel: {
    fontSize: 12,
    letterSpacing: '0.2em',
    color: 'rgba(0,212,255,0.8)',
    fontWeight: 600,
  },
  powerUpBox: {
    minWidth: 220,
    padding: '12px 22px',
    borderRadius: 12,
    background: 'rgba(12,14,30,0.82)',
    border: '1px solid rgba(0,212,255,0.45)',
    boxShadow: '0 0 18px rgba(0,212,255,0.2)',
    textAlign: 'center',
    backdropFilter: 'blur(8px)',
  },
  powerUpName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 6,
  },
  powerUpTimer: {
    height: 4,
    borderRadius: 2,
    background: 'rgba(127,119,221,0.2)',
    overflow: 'hidden',
  },
  powerUpTimerFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00d4ff, #af52de)',
    transition: 'width 0.1s linear',
  },
  powerUpHint: {
    fontSize: 12,
    color: 'rgba(220,216,230,0.7)',
    letterSpacing: '0.12em',
  },
  queueRow: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  queueDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'rgba(0,212,255,0.5)',
    border: '1px solid rgba(0,212,255,0.8)',
    boxShadow: '0 0 6px rgba(0,212,255,0.5)',
  },
  controlsHint: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    fontSize: 14,
    color: 'rgba(220,216,230,0.65)',
    background: 'rgba(12,14,30,0.55)',
    border: '1px solid rgba(127,119,221,0.25)',
    borderRadius: 10,
    padding: '8px 14px',
    backdropFilter: 'blur(6px)',
    zIndex: 10,
    pointerEvents: 'none',
  },
}
