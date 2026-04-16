'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatHaulingTime, type HaulingContract } from '@/lib/game/hauling/contracts'

export type DeliveryOutcome = 'delivered' | 'failed'

interface Props {
  contract: HaulingContract
  outcome: DeliveryOutcome
  elapsedMs: number
  cargoIntegrity: number
  bonusGhai: number
  failureReason?: string
  onBackToHub: () => void
}

const GRADE_COLOR: Record<string, string> = {
  Gold: '#ffd166',
  Silver: '#d8d8e4',
  Bronze: '#cd7f32',
  Failed: '#ff6b6b',
}

export default function DeliveryResults({
  contract,
  outcome,
  elapsedMs,
  cargoIntegrity,
  bonusGhai,
  failureReason,
  onBackToHub,
}: Props) {
  // Grade: based on cargo integrity. Delivered + >=90% integrity → Gold,
  // >=60% → Silver, lower → Bronze. Failed runs get no grade.
  const grade = outcome === 'failed'
    ? 'Failed'
    : cargoIntegrity >= 90 ? 'Gold'
    : cargoIntegrity >= 60 ? 'Silver' : 'Bronze'

  const baseReward = outcome === 'failed'
    ? 0
    : Math.round((contract.rewardMin + contract.rewardMax) / 2 * (cargoIntegrity / 100))
  const total = baseReward + bonusGhai
  const color = GRADE_COLOR[grade]

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { void finalizeContract() /* eslint-disable-line react-hooks/exhaustive-deps */ }, [])

  async function finalizeContract() {
    try {
      setSubmitting(true)
      setErr(null)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setSubmitting(false)
        return // not signed in — skip finalize silently
      }
      const { data: active } = await supabase
        .from('hauling_contracts')
        .select('id')
        .eq('user_id', userData.user.id)
        .eq('mission_template', contract.id)
        .eq('status', 'active')
        .order('accepted_at', { ascending: false })
        .limit(1)
      const row = active && active[0]
      if (!row) {
        setSubmitted(true)
        return
      }
      const { error } = await supabase
        .from('hauling_contracts')
        .update({
          status: outcome === 'delivered' ? 'completed' : 'failed',
          outcome_grade: grade === 'Failed' ? null : grade.toLowerCase(),
          completed_at: new Date().toISOString(),
          reward_ghai: total,
        })
        .eq('id', row.id)
      if (error) setErr(error.message)
      else setSubmitted(true)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Finalize failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={{ ...S.eyebrow, color }}>
          {outcome === 'delivered' ? 'Delivery complete' : 'Run failed'}
        </div>
        <h2 style={S.title}>{contract.name}</h2>

        <div style={{ ...S.gradeCircle, borderColor: color, boxShadow: `0 0 36px ${color}55` }}>
          <div style={{ ...S.gradeLabel, color }}>{grade}</div>
          <div style={S.timeBig}>{formatHaulingTime(elapsedMs)}</div>
        </div>

        {failureReason && (
          <p style={S.failReason}>{failureReason}</p>
        )}

        <div style={S.statsGrid}>
          <Stat label="Cargo integrity" value={`${Math.round(cargoIntegrity)}%`} />
          <Stat label="Base reward" value={`${baseReward}`} suffix="GHAI" />
          <Stat label="Bonuses" value={`${bonusGhai}`} suffix="GHAI" accent={bonusGhai > 0 ? '#7fff9f' : undefined} />
          <Stat label="Total" value={`${total}`} suffix="GHAI" accent="#ffd166" />
        </div>

        {submitting && <div style={S.note}>Saving contract…</div>}
        {submitted && !err && <div style={{ ...S.note, color: '#bfffcf' }}>Contract recorded.</div>}
        {err && <div style={{ ...S.note, color: '#ff9f9f' }}>{err}</div>}

        <div style={S.actions}>
          <button onClick={onBackToHub} style={S.primaryBtn}>Back to Hub</button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, suffix, accent }: { label: string; value: string; suffix?: string; accent?: string }) {
  return (
    <div style={S.stat}>
      <div style={S.statLabel}>{label}</div>
      <div style={{ ...S.statValue, color: accent ?? '#fff' }}>
        {value}{suffix && <span style={{ fontSize: 13, opacity: 0.7, fontWeight: 500 }}> {suffix}</span>}
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: { position: 'fixed', inset: 0, background: 'rgba(2,1,10,0.86)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 20 },
  card: { width: '100%', maxWidth: 560, padding: 32, borderRadius: 16, background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))', border: '1px solid rgba(127,119,221,0.35)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', color: '#e8e4f0', fontFamily: 'var(--font-sans)', textAlign: 'center' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 22px' },
  gradeCircle: { width: 180, height: 180, borderRadius: '50%', border: '3px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', background: 'rgba(12,14,30,0.6)' },
  gradeLabel: { fontSize: 24, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textShadow: '0 0 18px currentColor' },
  timeBig: { fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono), Consolas, monospace', marginTop: 6 },
  failReason: { fontSize: 14, color: '#ffb3b3', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.4)', padding: '10px 14px', borderRadius: 10, margin: '0 0 16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 },
  stat: { padding: '10px 14px', borderRadius: 10, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.2)', textAlign: 'left' },
  statLabel: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.8)', fontWeight: 600, marginBottom: 3 },
  statValue: { fontSize: 18, fontWeight: 600 },
  note: { fontSize: 14, color: 'rgba(220,216,230,0.8)', marginBottom: 14 },
  actions: { display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10 },
  primaryBtn: { padding: '12px 26px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00d4ff, #af52de)', color: '#050210', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', fontFamily: 'inherit', boxShadow: '0 0 22px rgba(0,212,255,0.35)' },
}
