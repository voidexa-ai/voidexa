'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TRACKS, formatTime, type TrackId } from '@/lib/game/speedrun/tracks'

interface Row {
  id: string
  user_id: string
  pilot_name: string | null
  track_id: string
  ship_id: string
  duration_ms: number
  created_at: string
}

export default function Leaderboard() {
  const [trackId, setTrackId] = useState<TrackId>('core_circuit')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const track = useMemo(() => TRACKS.find(t => t.id === trackId), [trackId])

  useEffect(() => {
    let alive = true
    setLoading(true)
    supabase
      .from('speedrun_times')
      .select('id, user_id, pilot_name, track_id, ship_id, duration_ms, created_at')
      .eq('track_id', trackId)
      .order('duration_ms', { ascending: true })
      .limit(10)
      .then(({ data }) => {
        if (!alive) return
        setRows((data ?? []) as Row[])
        setLoading(false)
      })
    return () => { alive = false }
  }, [trackId])

  return (
    <section style={S.wrap}>
      <div style={S.header}>
        <h2 style={S.title}>Leaderboard</h2>
        <div style={S.tabs}>
          {TRACKS.map(t => {
            const active = t.id === trackId
            return (
              <button
                key={t.id}
                onClick={() => setTrackId(t.id)}
                style={{
                  ...S.tab,
                  color: active ? '#00d4ff' : 'rgba(220,216,230,0.7)',
                  borderColor: active ? 'rgba(0,212,255,0.55)' : 'rgba(127,119,221,0.2)',
                  background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                }}
              >
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      <div style={S.subtitle}>
        Top 10 times — par {track ? formatTime(track.parMs) : '—'}
      </div>

      <div style={S.table}>
        <div style={S.tableHeader}>
          <span style={{ ...S.col, ...S.colRank }}>#</span>
          <span style={{ ...S.col, ...S.colPilot }}>Pilot</span>
          <span style={{ ...S.col, ...S.colShip }}>Ship</span>
          <span style={{ ...S.col, ...S.colTime }}>Time</span>
        </div>
        {loading && <div style={S.empty}>Loading…</div>}
        {!loading && rows.length === 0 && <div style={S.empty}>No times yet. Be the first.</div>}
        {!loading && rows.map((r, i) => (
          <div key={r.id} style={{ ...S.row, ...(i === 0 ? S.rowFirst : {}) }}>
            <span style={{ ...S.col, ...S.colRank }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
            </span>
            <span style={{ ...S.col, ...S.colPilot }}>
              {r.pilot_name?.trim() || shortId(r.user_id)}
            </span>
            <span style={{ ...S.col, ...S.colShip }}>{r.ship_id}</span>
            <span style={{ ...S.col, ...S.colTime }}>{formatTime(r.duration_ms)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function shortId(id: string): string {
  return `Pilot ${id.slice(0, 6)}`
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    padding: 24,
    borderRadius: 14,
    border: '1px solid rgba(127,119,221,0.25)',
    background: 'rgba(12,14,30,0.55)',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    marginLeft: 'auto',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '7px 14px',
    borderRadius: 999,
    border: '1px solid',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(220,216,230,0.65)',
    marginBottom: 14,
  },
  table: {
    borderRadius: 10,
    border: '1px solid rgba(127,119,221,0.2)',
    overflow: 'hidden',
    background: 'rgba(20,22,40,0.6)',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(127,119,221,0.18)',
    background: 'rgba(127,119,221,0.08)',
    fontSize: 12,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(148,163,184,0.9)',
    fontWeight: 600,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderTop: '1px solid rgba(127,119,221,0.1)',
    color: '#e8e4f0',
    fontSize: 14,
  },
  rowFirst: {
    borderTop: 'none',
    background: 'rgba(255,209,102,0.04)',
  },
  col: {
    fontSize: 14,
  },
  colRank: { flex: '0 0 42px' },
  colPilot: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  colShip: { flex: '0 0 130px', color: 'rgba(220,216,230,0.75)', fontSize: 13 },
  colTime: { flex: '0 0 120px', textAlign: 'right', fontFamily: 'var(--font-mono), Consolas, monospace', fontWeight: 600, color: '#00d4ff' },
  empty: {
    padding: '28px 16px',
    textAlign: 'center',
    color: 'rgba(220,216,230,0.55)',
    fontSize: 14,
  },
}
