'use client'

import { useState } from 'react'
import type { ShipTier } from '@/lib/game/wrecks/types'
import { computeClaimEconomics, basePrice, repairCost } from '@/lib/game/wrecks/economics'

export type RecoveryChoice = 'self_repair' | 'tow' | 'abandon' | 'buy_new'

interface Props {
  shipTier: ShipTier
  shipName: string
  ghaiBalance: number
  onChoose: (choice: RecoveryChoice) => Promise<void>
  onClose: () => void
}

export default function ShipDownModal({ shipTier, shipName, ghaiBalance, onChoose, onClose }: Props) {
  const repair = repairCost(shipTier)
  const base = basePrice(shipTier)
  const claimEcon = computeClaimEconomics(shipTier)
  const [acting, setActing] = useState<RecoveryChoice | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const handle = async (choice: RecoveryChoice) => {
    setErr(null)
    setActing(choice)
    try {
      await onChoose(choice)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Action failed')
      setActing(null)
    }
  }

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.eyebrow}>⚠ SHIP DOWN</div>
        <h2 style={S.title}>{shipName}</h2>
        <p style={S.subtitle}>
          Your ship has taken critical damage. The wreck is marked in space.
          You have four paths back into the sky.
        </p>

        {err && <div style={S.err}>{err}</div>}

        <div style={S.grid}>
          <RecoveryCard
            icon="🔧"
            label="Self-Repair"
            price={`${repair} GHAI`}
            description="Pay for a repair kit now. Wreck dissolves."
            disabled={acting != null || ghaiBalance < repair}
            color="#7fff9f"
            onClick={() => handle('self_repair')}
          />
          <RecoveryCard
            icon="🛟"
            label="Request Tow"
            price="Free"
            description="Wreck stays visible to other pilots. Return to the nearest station."
            disabled={acting != null}
            color="#7fd8ff"
            onClick={() => handle('tow')}
          />
          <RecoveryCard
            icon="⏳"
            label="Abandon"
            price="Free"
            description="Timer starts. Another pilot may claim it. You earn 10% insurance if they do."
            disabled={acting != null}
            color="#ffd166"
            onClick={() => handle('abandon')}
          />
          <RecoveryCard
            icon="🚀"
            label="Buy New"
            price={`${base} GHAI`}
            description="Skip the wait. Fresh ship, back in the air."
            disabled={acting != null || ghaiBalance < base}
            color="#af52de"
            onClick={() => handle('buy_new')}
          />
        </div>

        {claimEcon && (
          <div style={S.hint}>
            For reference: reclaim after abandon costs{' '}
            <b style={{ color: '#ffd166' }}>{claimEcon.total} GHAI total</b>
            {' '}({claimEcon.savingsVsNewPct}% less than buying new).
          </div>
        )}

        <button onClick={onClose} disabled={acting != null} style={S.closeBtn}>
          Close
        </button>
      </div>
    </div>
  )
}

function RecoveryCard({
  icon, label, price, description, color, disabled, onClick,
}: {
  icon: string
  label: string
  price: string
  description: string
  color: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...S.option,
        borderColor: `${color}88`,
        boxShadow: `0 0 18px ${color}26`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div style={S.optionHeader}>
        <span style={{ ...S.optionIcon, color }}>{icon}</span>
        <div>
          <div style={{ ...S.optionLabel, color }}>{label}</div>
          <div style={S.optionPrice}>{price}</div>
        </div>
      </div>
      <p style={S.optionDesc}>{description}</p>
    </button>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(40,6,10,0.88)',
    backdropFilter: 'blur(10px)',
    zIndex: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'var(--font-sans)',
  },
  card: {
    width: '100%',
    maxWidth: 760,
    padding: 32,
    borderRadius: 16,
    background: 'linear-gradient(145deg, rgba(40,10,20,0.97), rgba(12,14,30,0.97))',
    border: '1px solid rgba(255,107,107,0.45)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.85), 0 0 40px rgba(255,107,107,0.2)',
    color: '#e8e4f0',
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: '#ff6b6b',
    marginBottom: 10,
    textShadow: '0 0 14px rgba(255,107,107,0.5)',
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#fff',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 1.55,
    color: 'rgba(220,216,230,0.85)',
    margin: '0 0 22px',
  },
  err: {
    padding: '10px 14px',
    borderRadius: 8,
    background: 'rgba(255,107,107,0.14)',
    border: '1px solid rgba(255,107,107,0.55)',
    color: '#ffafaf',
    fontSize: 14,
    marginBottom: 14,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 12,
    marginBottom: 20,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    border: '1px solid',
    background: 'rgba(12,14,30,0.7)',
    color: '#e8e4f0',
    textAlign: 'left',
    fontFamily: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  optionHeader: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  optionIcon: { fontSize: 28, width: 40, textAlign: 'center' },
  optionLabel: { fontSize: 16, fontWeight: 700, letterSpacing: '0.04em' },
  optionPrice: { fontSize: 14, color: 'rgba(220,216,230,0.75)', marginTop: 2 },
  optionDesc: { fontSize: 14, lineHeight: 1.5, color: 'rgba(220,216,230,0.82)', margin: 0 },
  hint: {
    padding: '10px 14px',
    borderRadius: 8,
    background: 'rgba(127,119,221,0.08)',
    border: '1px solid rgba(127,119,221,0.22)',
    fontSize: 14,
    color: 'rgba(220,236,255,0.85)',
    marginBottom: 16,
  },
  closeBtn: {
    padding: '10px 22px',
    borderRadius: 10,
    border: '1px solid rgba(127,119,221,0.35)',
    background: 'transparent',
    color: '#e8e4f0',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}
