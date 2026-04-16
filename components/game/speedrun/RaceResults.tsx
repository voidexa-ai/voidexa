'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { creditGhai } from '@/lib/credits/credit'
import {
  GRADE_REWARDS,
  POWERUPS,
  calculateGrade,
  formatTime,
  type Grade,
  type PowerUpId,
  type TrackDef,
} from '@/lib/game/speedrun/tracks'

interface Props {
  track: TrackDef
  timeMs: number
  clearedGates: number
  missedGates: number
  powerUpsUsed: PowerUpId[]
  shipId: string
  onRaceAgain: () => void
  onBackToTracks: () => void
}

const GRADE_LABEL: Record<Grade, string> = {
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  dnf: 'DNF',
}

const GRADE_COLOR: Record<Grade, string> = {
  gold: '#ffd166',
  silver: '#d8d8e4',
  bronze: '#cd7f32',
  dnf: '#ff6b6b',
}

export default function RaceResults({
  track,
  timeMs,
  clearedGates,
  missedGates,
  powerUpsUsed,
  shipId,
  onRaceAgain,
  onBackToTracks,
}: Props) {
  const completed = clearedGates === track.gates.length
  const grade = calculateGrade(timeMs, track.parMs, completed)
  const reward = GRADE_REWARDS[grade]

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  async function handleSave() {
    if (!userId) {
      setErr('Sign in to save your time.')
      return
    }
    if (!completed) {
      setErr('Finish the track to post a leaderboard time.')
      return
    }
    setSaving(true)
    setErr(null)
    const { data: row, error } = await supabase.from('speedrun_times').insert({
      user_id: userId,
      track_id: track.id,
      ship_id: shipId,
      duration_ms: Math.round(timeMs),
      checkpoints: { powerups: powerUpsUsed, cleared: clearedGates, missed: missedGates },
      validated: false,
    }).select('id').single()
    if (error) {
      setSaving(false)
      setErr(error.message)
      return
    }
    if (reward > 0 && row?.id) {
      await creditGhai(userId, reward, { source: 'speedrun', sourceId: row.id as string })
    }
    setSaving(false)
    setSaved(true)
  }

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={{ ...S.eyebrow, color: GRADE_COLOR[grade] }}>Race complete</div>
        <h2 style={S.title}>{track.name}</h2>

        <div style={{ ...S.gradeCircle, borderColor: GRADE_COLOR[grade], boxShadow: `0 0 40px ${GRADE_COLOR[grade]}55` }}>
          <div style={{ ...S.gradeLabel, color: GRADE_COLOR[grade] }}>{GRADE_LABEL[grade]}</div>
          <div style={S.timeBig}>{formatTime(timeMs)}</div>
          <div style={S.parLine}>Par {formatTime(track.parMs)}</div>
        </div>

        <div style={S.statsGrid}>
          <Stat label="Gates cleared" value={`${clearedGates}/${track.gates.length}`} />
          <Stat label="Gates missed" value={`${missedGates}`} />
          <Stat label="Power-ups used" value={`${powerUpsUsed.length}`} />
          <Stat label="GHAI reward" value={`${reward}`} accent="#ffd166" />
        </div>

        {powerUpsUsed.length > 0 && (
          <div style={S.powerUpsRow}>
            {powerUpsUsed.map((id, i) => (
              <span key={i} style={S.powerUpChip}>{POWERUPS[id].name}</span>
            ))}
          </div>
        )}

        {err && <div style={S.err}>{err}</div>}
        {saved && <div style={S.ok}>Time saved to the leaderboard.</div>}

        <div style={S.actions}>
          <button onClick={onBackToTracks} style={S.secondaryBtn}>Back to Tracks</button>
          <button onClick={onRaceAgain} style={S.secondaryBtn}>Race Again</button>
          <button
            onClick={handleSave}
            disabled={saving || saved || !completed || !userId}
            style={{
              ...S.primaryBtn,
              opacity: (saving || saved || !completed || !userId) ? 0.55 : 1,
              cursor: (saving || saved || !completed || !userId) ? 'not-allowed' : 'pointer',
            }}
          >
            {saved ? 'Saved ✓' : saving ? 'Saving…' : !userId ? 'Sign In to Save' : 'Save to Leaderboard'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={S.stat}>
      <div style={S.statLabel}>{label}</div>
      <div style={{ ...S.statValue, color: accent ?? '#fff' }}>{value}</div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: { position: 'fixed', inset: 0, background: 'rgba(2,1,10,0.86)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 },
  card: { width: '100%', maxWidth: 560, padding: 36, borderRadius: 16, background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))', border: '1px solid rgba(127,119,221,0.35)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', color: '#e8e4f0', fontFamily: 'var(--font-sans)', textAlign: 'center' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 24px' },
  gradeCircle: { width: 200, height: 200, borderRadius: '50%', border: '3px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', background: 'rgba(12,14,30,0.6)' },
  gradeLabel: { fontSize: 28, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textShadow: '0 0 18px currentColor' },
  timeBig: { fontSize: 30, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono), Consolas, monospace', marginTop: 6, letterSpacing: '0.04em' },
  parLine: { fontSize: 14, color: 'rgba(220,216,230,0.6)', marginTop: 4 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 18 },
  stat: { padding: '12px 16px', borderRadius: 10, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.2)', textAlign: 'left' },
  statLabel: { fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.8)', fontWeight: 600, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 600 },
  powerUpsRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 18 },
  powerUpChip: { padding: '6px 12px', borderRadius: 999, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)', color: '#7fd8ff', fontSize: 14 },
  err: { padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.4)', color: '#ff9f9f', fontSize: 14, marginBottom: 14 },
  ok: { padding: '10px 14px', borderRadius: 10, background: 'rgba(127,255,159,0.1)', border: '1px solid rgba(127,255,159,0.4)', color: '#bfffcf', fontSize: 14, marginBottom: 14 },
  actions: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 10 },
  secondaryBtn: { padding: '12px 20px', borderRadius: 10, border: '1px solid rgba(127,119,221,0.35)', background: 'transparent', color: '#e8e4f0', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  primaryBtn: { padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00d4ff, #af52de)', color: '#050210', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', fontFamily: 'inherit', boxShadow: '0 0 20px rgba(0,212,255,0.35)' },
}
