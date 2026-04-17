'use client'

import { useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  userId: string
  initialPilotName: string
  initialKnownFor: string
}

export default function ProfileEditForm({ userId, initialPilotName, initialKnownFor }: Props) {
  const [pilotName, setPilotName] = useState(initialPilotName)
  const [knownFor, setKnownFor] = useState(initialKnownFor)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const onSave = useCallback(async () => {
    setSaving(true)
    setErr(null)
    const trimmedName = pilotName.trim().slice(0, 32)
    const trimmedKnown = knownFor.trim().slice(0, 120)
    const { error } = await supabase.from('pilot_reputation').upsert(
      {
        user_id: userId,
        pilot_name: trimmedName || null,
        known_for: trimmedKnown || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    setSaving(false)
    if (error) {
      setErr(error.message)
    } else {
      setSavedAt(Date.now())
    }
  }, [userId, pilotName, knownFor])

  return (
    <section style={S.wrap}>
      <div style={S.eyebrow}>EDIT PROFILE</div>
      <label style={S.label}>
        <span style={S.labelText}>Pilot name · max 32 chars</span>
        <input
          type="text"
          value={pilotName}
          onChange={e => setPilotName(e.target.value)}
          maxLength={32}
          style={S.input}
        />
      </label>
      <label style={S.label}>
        <span style={S.labelText}>Known for · max 120 chars</span>
        <textarea
          value={knownFor}
          onChange={e => setKnownFor(e.target.value)}
          maxLength={120}
          rows={3}
          style={S.textarea}
        />
      </label>
      <div style={S.row}>
        <button onClick={onSave} disabled={saving} style={{ ...S.btn, opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        {savedAt && <span style={S.saved}>Saved ✓</span>}
        {err && <span style={S.err}>{err}</span>}
      </div>
    </section>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    padding: 24,
    borderRadius: 14,
    border: '1px solid rgba(127,119,221,0.22)',
    background: 'rgba(12,14,30,0.6)',
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    fontFamily: 'var(--font-sans)',
    color: '#e8e4f0',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.18em',
    color: 'rgba(148,163,184,0.85)',
    textTransform: 'uppercase',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  labelText: {
    fontSize: 14,
    color: 'rgba(220,216,230,0.85)',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(127,119,221,0.3)',
    background: 'rgba(6,10,20,0.75)',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(127,119,221,0.3)',
    background: 'rgba(6,10,20,0.75)',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  btn: {
    padding: '10px 22px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #00d4ff, #af52de)',
    color: '#050210',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  saved: { fontSize: 14, color: '#bfffcf', fontWeight: 500 },
  err: { fontSize: 14, color: '#ff9f9f', fontWeight: 500 },
}
