'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CAST_META } from '@/lib/game/missions/board'
import {
  HAULING_CONTRACTS,
  riskToDb,
  type HaulingContract,
  type RiskLevel,
} from '@/lib/game/hauling/contracts'

type RiskFilter = 'All' | RiskLevel
type RewardFilter = 'All' | 'Low' | 'Mid' | 'High'

const RISK_META: Readonly<Record<RiskLevel, { color: string; bg: string }>> = {
  Safe: { color: '#7fff9f', bg: 'rgba(127,255,159,0.14)' },
  Contested: { color: '#ffb347', bg: 'rgba(255,179,71,0.14)' },
  'Wreck Risk': { color: '#ff6b6b', bg: 'rgba(255,107,107,0.14)' },
}

interface Props {
  onAccept: (contract: HaulingContract) => void
}

export default function HaulingHub({ onAccept }: Props) {
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('All')
  const [rewardFilter, setRewardFilter] = useState<RewardFilter>('All')
  const [accepting, setAccepting] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const filtered = useMemo(() => HAULING_CONTRACTS.filter(c => {
    if (riskFilter !== 'All' && c.risk !== riskFilter) return false
    const avg = (c.rewardMin + c.rewardMax) / 2
    if (rewardFilter === 'Low' && avg >= 80) return false
    if (rewardFilter === 'Mid' && (avg < 80 || avg > 160)) return false
    if (rewardFilter === 'High' && avg <= 160) return false
    return true
  }), [riskFilter, rewardFilter])

  async function handleAccept(c: HaulingContract) {
    setErr(null)
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      setErr('Sign in to accept contracts.')
      return
    }
    setAccepting(c.id)
    const reward = Math.round((c.rewardMin + c.rewardMax) / 2)
    const { error } = await supabase.from('hauling_contracts').insert({
      user_id: data.user.id,
      mission_template: c.id,
      origin_planet: c.origin,
      destination_planet: c.destination,
      cargo_type: c.cargoName,
      cargo_units: 1,
      risk_level: riskToDb(c.risk),
      reward_ghai: reward,
      route_seed: String(Date.now()),
      status: 'active',
    })
    setAccepting(null)
    if (error) {
      setErr(error.message)
      return
    }
    onAccept(c)
  }

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div style={S.headerInner}>
          <Link href="/" style={S.backLink}>← voidexa</Link>
          <div>
            <span style={S.eyebrow}>TRADING HUB · HAULING BOARD</span>
            <h1 style={S.title}>Hauling Contracts</h1>
            <p style={S.subtitle}>
              Pick up cargo, fly the route, deliver. Safe runs pay less but go smoother.
              Risky contracts pay more and attract trouble.
            </p>
          </div>
        </div>
      </header>

      <main style={S.main}>
        <div style={S.filtersRow}>
          <FilterGroup label="Risk">
            {(['All', 'Safe', 'Contested', 'Wreck Risk'] as RiskFilter[]).map(r => (
              <FilterChip key={r} active={riskFilter === r} onClick={() => setRiskFilter(r)}>
                {r}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Reward">
            {(['All', 'Low', 'Mid', 'High'] as RewardFilter[]).map(r => (
              <FilterChip key={r} active={rewardFilter === r} onClick={() => setRewardFilter(r)}>
                {r}
              </FilterChip>
            ))}
          </FilterGroup>
        </div>

        {err && <div style={S.err}>{err}</div>}

        <section style={S.grid}>
          {filtered.map(c => <ContractCard key={c.id} contract={c} accepting={accepting === c.id} onAccept={() => handleAccept(c)} />)}
          {filtered.length === 0 && <div style={S.empty}>No contracts match those filters.</div>}
        </section>
      </main>
    </div>
  )
}

function ContractCard({ contract, accepting, onAccept }: { contract: HaulingContract; accepting: boolean; onAccept: () => void }) {
  const cast = CAST_META[contract.issuer]
  const risk = RISK_META[contract.risk]
  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.avatarWrap}>
          <Image src={cast.avatar} alt={cast.name} width={40} height={40} style={S.avatar} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.castName}>{cast.name}</div>
          <div style={S.castRole}>{cast.role}</div>
        </div>
        <div style={{ ...S.riskBadge, color: risk.color, background: risk.bg, borderColor: `${risk.color}88` }}>
          {contract.risk}
        </div>
      </div>

      <h3 style={S.cardTitle}>{contract.name}</h3>
      <div style={S.route}>
        <span style={S.routeFrom}>{contract.origin}</span>
        <span style={S.routeArrow}>→</span>
        <span style={S.routeTo}>{contract.destination}</span>
      </div>

      <div style={S.cargoRow}>
        <span style={S.cargoLabel}>CARGO</span>
        <span style={S.cargoName}>{contract.cargoName}</span>
        {contract.cargoFragile && <span style={S.fragileBadge}>FRAGILE</span>}
      </div>

      <p style={S.flavor}>{contract.flavor}</p>

      <div style={S.metaRow}>
        <Meta label="Time" value={contract.timeEstimate} />
        <Meta label="Reward" value={`${contract.rewardMin}–${contract.rewardMax}`} accent="#ffd166" suffix="GHAI" />
      </div>

      <button onClick={onAccept} disabled={accepting} style={{ ...S.acceptBtn, opacity: accepting ? 0.6 : 1, cursor: accepting ? 'wait' : 'pointer' }}>
        {accepting ? 'Accepting…' : 'Accept Contract →'}
      </button>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={S.filterGroup}>
      <span style={S.filterLabel}>{label}</span>
      <div style={S.filterChips}>{children}</div>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ ...S.chip, color: active ? '#00d4ff' : 'rgba(220,216,230,0.7)', borderColor: active ? 'rgba(0,212,255,0.55)' : 'rgba(127,119,221,0.2)', background: active ? 'rgba(0,212,255,0.08)' : 'transparent' }}>
      {children}
    </button>
  )
}

function Meta({ label, value, accent, suffix }: { label: string; value: string; accent?: string; suffix?: string }) {
  return (
    <div style={S.meta}>
      <span style={S.metaKey}>{label}</span>
      <span style={{ ...S.metaVal, color: accent ?? '#fff' }}>
        {value}
        {suffix && <span style={S.metaSuffix}> {suffix}</span>}
      </span>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)', color: '#e8e4f0', fontFamily: 'var(--font-sans)', paddingBottom: 80 },
  header: { borderBottom: '1px solid rgba(127,119,221,0.2)' },
  headerInner: { maxWidth: 1280, margin: '0 auto', padding: '24px 28px 36px' },
  backLink: { fontSize: 14, color: 'rgba(148,163,184,0.8)', textDecoration: 'none', marginBottom: 16, display: 'inline-block' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: '#00d4ff', textTransform: 'uppercase', display: 'block', marginBottom: 6 },
  title: { fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #00d4ff, #af52de)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px' },
  subtitle: { fontSize: 16, color: 'rgba(220,216,230,0.8)', maxWidth: 680, margin: 0, lineHeight: 1.55 },
  main: { maxWidth: 1280, margin: '0 auto', padding: '28px 28px 32px' },
  filtersRow: { display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 22, alignItems: 'center' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: 10 },
  filterLabel: { fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.9)', fontWeight: 600 },
  filterChips: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  chip: { padding: '6px 14px', borderRadius: 999, border: '1px solid', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  err: { padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.4)', color: '#ff9f9f', fontSize: 14, marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 },
  empty: { padding: '40px 0', textAlign: 'center', color: 'rgba(220,216,230,0.6)', gridColumn: '1 / -1' },
  card: { display: 'flex', flexDirection: 'column', gap: 12, padding: 20, borderRadius: 14, border: '1px solid rgba(127,119,221,0.25)', background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 10 },
  avatarWrap: { width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(127,119,221,0.4)' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  castName: { fontSize: 14, fontWeight: 600, color: '#fff' },
  castRole: { fontSize: 13, color: 'rgba(148,163,184,0.85)' },
  riskBadge: { padding: '4px 10px', borderRadius: 999, border: '1px solid', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' },
  cardTitle: { fontSize: 20, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.01em' },
  route: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(220,216,230,0.85)' },
  routeFrom: { color: '#7fd8ff', fontWeight: 500 },
  routeArrow: { color: 'rgba(175,82,222,0.8)', fontSize: 16 },
  routeTo: { color: '#7fff9f', fontWeight: 500 },
  cargoRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.2)' },
  cargoLabel: { fontSize: 11, letterSpacing: '0.16em', color: 'rgba(148,163,184,0.8)', fontWeight: 600 },
  cargoName: { fontSize: 14, color: '#fff', fontWeight: 500, flex: 1 },
  fragileBadge: { padding: '2px 8px', borderRadius: 4, background: 'rgba(255,107,107,0.14)', color: '#ff9f9f', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' },
  flavor: { fontSize: 14, lineHeight: 1.55, color: 'rgba(220,216,230,0.75)', margin: 0, fontStyle: 'italic' },
  metaRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  meta: { flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(127,119,221,0.06)', border: '1px solid rgba(127,119,221,0.16)' },
  metaKey: { display: 'block', fontSize: 11, letterSpacing: '0.14em', color: 'rgba(148,163,184,0.8)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 },
  metaVal: { fontSize: 16, fontWeight: 600 },
  metaSuffix: { fontSize: 12, opacity: 0.7, fontWeight: 500 },
  acceptBtn: { marginTop: 4, padding: '11px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00d4ff, #af52de)', color: '#050210', fontSize: 14, fontWeight: 700, letterSpacing: '0.02em', fontFamily: 'inherit', boxShadow: '0 0 18px rgba(0,212,255,0.3)' },
}
