'use client'

import type { TrackDef } from '@/lib/game/speedrun/tracks'
import { formatTime } from '@/lib/game/speedrun/tracks'

interface Props {
  track: TrackDef
  bestTimeMs: number | null
  onStart: () => void
}

const DIFF_COLOR: Record<string, string> = {
  Easy: '#7fff9f',
  Medium: '#ffd166',
  Hard: '#ff6b6b',
}

const ZONE_GRADIENT: Record<string, string> = {
  'Core Circuit': 'linear-gradient(135deg, #00d4ff33, #00d4ff11)',
  'Nebula Run': 'linear-gradient(135deg, #af52de33, #af52de11)',
  'Void Prix Championship': 'linear-gradient(135deg, #ff6b6b33, #ff6b6b11)',
}

export default function TrackCard({ track, bestTimeMs, onStart }: Props) {
  const diffColor = DIFF_COLOR[track.difficulty]
  return (
    <div style={S.card}>
      <div style={{ ...S.thumb, background: ZONE_GRADIENT[track.name] ?? 'linear-gradient(135deg, #00d4ff33, transparent)' }}>
        <div style={S.thumbGrid} />
        <div style={S.thumbCenter}>
          <div style={S.thumbIcon}>◎</div>
          <div style={S.thumbSubtitle}>{track.zone}</div>
        </div>
        <div style={{ ...S.difficultyBadge, color: diffColor, borderColor: `${diffColor}88` }}>
          {track.difficulty}
        </div>
      </div>
      <div style={S.body}>
        <h3 style={S.name}>{track.name}</h3>
        <p style={S.summary}>{track.summary}</p>
        <div style={S.metaRow}>
          <Meta label="Duration" value={track.timeEstimate} />
          <Meta label="Gates" value={String(track.gates.length)} />
          <Meta
            label="Best"
            value={bestTimeMs != null ? formatTime(bestTimeMs) : '—'}
            accent={bestTimeMs != null ? '#7fff9f' : undefined}
          />
        </div>
        <button onClick={onStart} style={S.startBtn}>
          Start Race →
        </button>
      </div>
    </div>
  )
}

function Meta({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={S.meta}>
      <span style={S.metaLabel}>{label}</span>
      <span style={{ ...S.metaValue, color: accent ?? '#fff' }}>{value}</span>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    border: '1px solid rgba(127,119,221,0.28)',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  thumb: {
    position: 'relative',
    height: 160,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid rgba(127,119,221,0.22)',
    overflow: 'hidden',
  },
  thumbGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(0,212,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.12) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    maskImage: 'radial-gradient(circle at center, #000 30%, transparent 80%)',
  },
  thumbCenter: {
    position: 'relative',
    textAlign: 'center',
    zIndex: 1,
  },
  thumbIcon: {
    fontSize: 56,
    color: '#00d4ff',
    textShadow: '0 0 24px rgba(0,212,255,0.6)',
    lineHeight: 1,
  },
  thumbSubtitle: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: 'rgba(220,216,230,0.75)',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: '4px 12px',
    borderRadius: 999,
    border: '1px solid',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    background: 'rgba(12,14,30,0.6)',
    backdropFilter: 'blur(6px)',
  },
  body: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  summary: {
    fontSize: 14,
    lineHeight: 1.55,
    color: 'rgba(220,216,230,0.8)',
    margin: 0,
  },
  metaRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 12px',
    borderRadius: 8,
    background: 'rgba(127,119,221,0.08)',
    border: '1px solid rgba(127,119,221,0.18)',
    flex: 1,
    minWidth: 80,
  },
  metaLabel: {
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(148,163,184,0.8)',
    fontWeight: 600,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: 2,
  },
  startBtn: {
    marginTop: 4,
    padding: '12px 18px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #00d4ff, #af52de)',
    color: '#050210',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 0 20px rgba(0,212,255,0.3)',
  },
}
