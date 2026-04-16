'use client'

import { formatHaulingTime, type HaulingContract } from '@/lib/game/hauling/contracts'

interface Props {
  contract: HaulingContract
  elapsedMs: number
  checkpointIndex: number
  checkpointTotal: number
  cargoIntegrity: number
  engineFlicker: boolean
  onExit: () => void
}

export default function HaulingHUD({
  contract,
  elapsedMs,
  checkpointIndex,
  checkpointTotal,
  cargoIntegrity,
  engineFlicker,
  onExit,
}: Props) {
  const pct = checkpointTotal === 0 ? 0 : (checkpointIndex / checkpointTotal) * 100
  const integrityColor =
    cargoIntegrity > 75 ? '#7fff9f' :
    cargoIntegrity > 40 ? '#ffd166' : '#ff6b6b'

  return (
    <>
      <div style={S.topBar}>
        <button onClick={onExit} style={S.exitBtn}>← Exit</button>
        <div style={S.route}>
          <span style={S.routeFrom}>{contract.origin}</span>
          <span style={S.routeArrow}>→</span>
          <span style={S.routeTo}>{contract.destination}</span>
        </div>
        <div style={S.timer}>{formatHaulingTime(elapsedMs)}</div>
      </div>

      <div style={S.crosshair} />

      {engineFlicker && (
        <div style={S.flickerWarn}>ENGINE FLICKER · 50% thrust</div>
      )}

      {/* Bottom: cargo + progress */}
      <div style={S.bottomStack}>
        <div style={S.cargoBox}>
          <div style={S.cargoHeader}>
            <span style={S.cargoLabel}>CARGO</span>
            <span style={S.cargoName}>{contract.cargoName}</span>
            {contract.cargoFragile && <span style={S.fragileBadge}>FRAGILE</span>}
          </div>
          {contract.cargoFragile && (
            <div style={S.integrityRow}>
              <div style={S.integrityBar}>
                <div style={{ ...S.integrityFill, width: `${cargoIntegrity}%`, background: integrityColor }} />
              </div>
              <span style={{ ...S.integrityValue, color: integrityColor }}>{Math.round(cargoIntegrity)}%</span>
            </div>
          )}
        </div>

        <div style={S.progressBox}>
          <div style={S.progressHeader}>
            <span style={S.progressLabel}>CHECKPOINT</span>
            <span style={S.progressCounter}>
              <span style={S.progressCur}>{checkpointIndex}</span>
              <span style={S.progressTotal}> / {checkpointTotal}</span>
            </span>
          </div>
          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div style={S.controlsHint}>
        <b>WASD</b> fly · <b>Mouse</b> look · <b>Shift</b> boost · <b>Q/E</b> up/down
      </div>
    </>
  )
}

const S: Record<string, React.CSSProperties> = {
  topBar: { position: 'absolute', top: 18, left: 18, right: 18, display: 'flex', alignItems: 'center', gap: 14, zIndex: 10 },
  exitBtn: { pointerEvents: 'auto', padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(127,119,221,0.35)', background: 'rgba(12,14,30,0.75)', color: '#e8e4f0', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', backdropFilter: 'blur(8px)' },
  route: { marginLeft: 'auto', marginRight: 'auto', padding: '8px 18px', borderRadius: 10, background: 'rgba(12,14,30,0.75)', border: '1px solid rgba(127,119,221,0.35)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, backdropFilter: 'blur(8px)' },
  routeFrom: { color: '#7fd8ff' },
  routeArrow: { color: 'rgba(175,82,222,0.85)', fontSize: 16 },
  routeTo: { color: '#7fff9f' },
  timer: { padding: '10px 20px', borderRadius: 12, background: 'rgba(12,14,30,0.8)', border: '1px solid rgba(0,212,255,0.5)', color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono), Consolas, monospace', letterSpacing: '0.06em', backdropFilter: 'blur(8px)', textShadow: '0 0 10px rgba(0,212,255,0.5)' },
  crosshair: { position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, marginLeft: -6, marginTop: -6, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.55)', boxShadow: '0 0 10px rgba(0,212,255,0.35)', pointerEvents: 'none' },
  flickerWarn: { position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', padding: '8px 18px', borderRadius: 8, background: 'rgba(255,179,71,0.14)', border: '1px solid rgba(255,179,71,0.6)', color: '#ffb347', fontSize: 14, fontWeight: 600, letterSpacing: '0.12em', backdropFilter: 'blur(8px)' },
  bottomStack: { position: 'absolute', bottom: 24, left: 18, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10, width: 320 },
  cargoBox: { padding: '12px 16px', borderRadius: 10, background: 'rgba(12,14,30,0.8)', border: '1px solid rgba(127,119,221,0.3)', backdropFilter: 'blur(8px)' },
  cargoHeader: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cargoLabel: { fontSize: 11, letterSpacing: '0.18em', color: 'rgba(148,163,184,0.8)', fontWeight: 600, textTransform: 'uppercase' },
  cargoName: { fontSize: 14, color: '#fff', fontWeight: 500, flex: 1 },
  fragileBadge: { padding: '2px 8px', borderRadius: 4, background: 'rgba(255,107,107,0.14)', color: '#ff9f9f', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' },
  integrityRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 },
  integrityBar: { flex: 1, height: 6, borderRadius: 3, background: 'rgba(127,119,221,0.2)', overflow: 'hidden' },
  integrityFill: { height: '100%', transition: 'width 0.3s, background 0.3s' },
  integrityValue: { fontSize: 13, fontWeight: 600, minWidth: 44, textAlign: 'right' },
  progressBox: { padding: '12px 16px', borderRadius: 10, background: 'rgba(12,14,30,0.8)', border: '1px solid rgba(0,212,255,0.3)', backdropFilter: 'blur(8px)' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  progressLabel: { fontSize: 11, letterSpacing: '0.18em', color: 'rgba(148,163,184,0.8)', fontWeight: 600, textTransform: 'uppercase' },
  progressCounter: { fontSize: 14 },
  progressCur: { fontSize: 18, color: '#7fff9f', fontWeight: 700 },
  progressTotal: { color: 'rgba(220,216,230,0.6)' },
  progressBar: { height: 6, borderRadius: 3, background: 'rgba(127,119,221,0.2)', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #00d4ff, #af52de)', transition: 'width 0.4s' },
  controlsHint: { position: 'absolute', bottom: 18, right: 18, fontSize: 13, color: 'rgba(220,216,230,0.65)', background: 'rgba(12,14,30,0.55)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 10, padding: '8px 14px', backdropFilter: 'blur(6px)' },
}
