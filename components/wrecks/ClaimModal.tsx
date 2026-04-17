'use client'

import { useState } from 'react'
import { computeClaimEconomics } from '@/lib/game/wrecks/economics'
import type { WreckRow } from '@/lib/game/wrecks/types'

interface Props {
  wreck: WreckRow
  ghaiBalance: number
  onClaim: () => Promise<void>
  onDismiss: () => void
}

export default function ClaimModal({ wreck, ghaiBalance, onClaim, onDismiss }: Props) {
  const [acting, setActing] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const econ = wreck.ship_tier ? computeClaimEconomics(wreck.ship_tier) : null

  const handle = async () => {
    setErr(null)
    setActing(true)
    try {
      await onClaim()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Claim failed')
      setActing(false)
    }
  }

  const canAfford = econ ? ghaiBalance >= econ.total : false

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.eyebrow}>⚙ ABANDONED WRECK</div>
        <h2 style={S.title}>{humanShipId(wreck.ship_id)}</h2>
        <p style={S.subtitle}>
          {wreck.ship_class ? `${titleCase(wreck.ship_class)} class · ` : ''}
          {wreck.ship_tier ? titleCase(wreck.ship_tier) : 'unknown tier'}
          {' · abandoned by the original owner'}
        </p>

        {err && <div style={S.err}>{err}</div>}

        {econ ? (
          <div style={S.tableBlock}>
            <Row label="Claim fee" value={`${econ.claimFee} GHAI`} />
            <Row label="Repair cost" value={`${econ.repairCost} GHAI`} />
            <Row label="Total" value={`${econ.total} GHAI`} accent="#ffd166" bold />
            <Row label="Savings vs new ship" value={`${econ.savingsVsNewPct}%`} accent="#7fff9f" />
            <Row label="Your balance" value={`${ghaiBalance.toLocaleString()} GHAI`} />
          </div>
        ) : (
          <div style={S.hint}>
            This wreck cannot be reclaimed (soulbound or pioneer class). Walk away.
          </div>
        )}

        <div style={S.actions}>
          <button onClick={onDismiss} disabled={acting} style={S.secondaryBtn}>Walk away</button>
          <button
            onClick={handle}
            disabled={acting || !econ || !canAfford}
            style={{ ...S.primaryBtn, opacity: acting || !econ || !canAfford ? 0.5 : 1 }}
          >
            {!econ ? 'Cannot claim' : !canAfford ? 'Not enough GHAI' : acting ? 'Claiming…' : 'Claim & repair'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, accent, bold }: { label: string; value: string; accent?: string; bold?: boolean }) {
  return (
    <div style={S.row}>
      <span style={S.rowLabel}>{label}</span>
      <span style={{ ...S.rowValue, color: accent ?? '#fff', fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  )
}

function humanShipId(id: string): string {
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,1,10,0.88)',
    backdropFilter: 'blur(10px)',
    zIndex: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'var(--font-sans)',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    padding: 32,
    borderRadius: 16,
    background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))',
    border: '1px solid rgba(255,138,60,0.4)',
    color: '#e8e4f0',
  },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', color: '#ff8a3c', textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 6px' },
  subtitle: { fontSize: 15, color: 'rgba(220,216,230,0.8)', margin: '0 0 20px', lineHeight: 1.55 },
  err: { padding: '10px 14px', borderRadius: 8, background: 'rgba(255,107,107,0.14)', border: '1px solid rgba(255,107,107,0.5)', color: '#ffafaf', fontSize: 14, marginBottom: 14 },
  tableBlock: { padding: 16, borderRadius: 10, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.22)', marginBottom: 20 },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: 15, padding: '6px 0', borderBottom: '1px solid rgba(127,119,221,0.08)' },
  rowLabel: { color: 'rgba(220,216,230,0.75)' },
  rowValue: { color: '#fff' },
  hint: { padding: '12px 14px', borderRadius: 8, background: 'rgba(127,119,221,0.08)', fontSize: 14, color: 'rgba(220,216,230,0.8)', marginBottom: 20 },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end' },
  secondaryBtn: { padding: '11px 20px', borderRadius: 10, border: '1px solid rgba(127,119,221,0.35)', background: 'transparent', color: '#e8e4f0', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  primaryBtn: { padding: '11px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #ff8a3c, #af52de)', color: '#050210', fontSize: 14, fontWeight: 700, letterSpacing: '0.02em', cursor: 'pointer', fontFamily: 'inherit' },
}
