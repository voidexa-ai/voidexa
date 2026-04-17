'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PACK_DEFS, PACK_TIERS, type PackTier } from '@/lib/game/packs/types'
import type { CardTemplate } from '@/lib/game/cards/index'
import PackOpeningAnimation, { type PackOpenResult } from './PackOpeningAnimation'

const TIER_COLOR: Record<PackTier, string> = {
  standard:  '#7fd8ff',
  premium:   '#af52de',
  legendary: '#ffd166',
}

export default function PackShopClient() {
  const [balance, setBalance] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [opening, setOpening] = useState<PackTier | null>(null)
  const [result, setResult] = useState<PackOpenResult | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id ?? null
      setUserId(uid)
      if (!uid) return
      const { data: wallet } = await supabase
        .from('user_credits')
        .select('ghai_balance_platform')
        .eq('user_id', uid)
        .maybeSingle()
      setBalance(wallet?.ghai_balance_platform ?? 0)
    })()
  }, [])

  const openPack = useCallback(async (tier: PackTier) => {
    if (!userId) { setErr('Sign in to open packs.'); return }
    const def = PACK_DEFS[tier]
    if ((balance ?? 0) < def.priceGhai) { setErr(`Need ${def.priceGhai} GHAI. You have ${balance}.`); return }
    setErr(null)
    setOpening(tier)
    try {
      const res = await fetch('/api/shop/open-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const body = await res.json()
      if (!res.ok) {
        setErr(body.error || 'Pack open failed.')
        setOpening(null)
        return
      }
      setBalance(body.newBalance)
      setResult({
        tier,
        cardIds: body.cardIds,
        rarities: body.rarities,
        cards: body.cards as (CardTemplate | undefined)[],
        mythicPulled: body.mythicPulled,
        mythicRemaining: body.mythicRemaining ?? null,
      })
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'network error')
      setOpening(null)
    }
  }, [userId, balance])

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div style={S.headerInner}>
          <Link href="/shop" style={S.backLink}>← Shop</Link>
          <span style={S.eyebrow}>BOOSTER PACKS · 257-CARD LIBRARY</span>
          <h1 style={S.title}>Open Something New</h1>
          <p style={S.subtitle}>
            Every pack has a 0.1% Mythic chance in its best slot. Mythic cards have a universe-wide
            cap of 50 copies each — when they run out, that card is trade-only forever.
          </p>
          <div style={S.balanceRow}>
            <span style={S.balanceLabel}>YOUR BALANCE</span>
            <span style={S.balanceValue}>{balance == null ? '…' : `${balance.toLocaleString()} GHAI`}</span>
          </div>
        </div>
      </header>

      <main style={S.main}>
        {err && <div style={S.err}>{err}</div>}
        <section style={S.grid}>
          {PACK_TIERS.map(tier => {
            const def = PACK_DEFS[tier]
            const color = TIER_COLOR[tier]
            const canAfford = (balance ?? 0) >= def.priceGhai
            return (
              <div key={tier} style={{ ...S.card, borderColor: `${color}55`, boxShadow: `0 0 24px ${color}20` }}>
                <div style={{ ...S.tierBadge, color, borderColor: `${color}88`, background: `${color}12` }}>
                  {def.name}
                </div>
                <div style={S.price}>
                  <span style={S.priceValue}>{def.priceGhai}</span>
                  <span style={S.priceLabel}>GHAI</span>
                </div>
                <p style={S.desc}>{def.description}</p>
                <div style={S.statsBlock}>
                  <Stat label="Cards" value={String(def.cardCount)} />
                  <Stat label="Best slot" value={def.bestSlotPool.join(' / ')} accent={color} />
                </div>
                <button
                  onClick={() => openPack(tier)}
                  disabled={opening != null || !canAfford || !userId}
                  style={{
                    ...S.buyBtn,
                    background: `linear-gradient(135deg, ${color}, #af52de)`,
                    opacity: opening != null || !canAfford || !userId ? 0.5 : 1,
                    cursor: opening != null || !canAfford || !userId ? 'not-allowed' : 'pointer',
                  }}
                >
                  {opening === tier ? 'Opening…' : !userId ? 'Sign in to buy' : !canAfford ? 'Not enough GHAI' : 'Open Pack →'}
                </button>
              </div>
            )
          })}
        </section>
      </main>

      {result && (
        <PackOpeningAnimation
          result={result}
          onDismiss={() => { setResult(null); setOpening(null) }}
        />
      )}
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
  page: { minHeight: '100vh', background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)', color: '#e8e4f0', fontFamily: 'var(--font-sans)', paddingBottom: 60 },
  header: { borderBottom: '1px solid rgba(127,119,221,0.2)' },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '24px 28px 32px' },
  backLink: { fontSize: 14, color: 'rgba(148,163,184,0.8)', textDecoration: 'none', marginBottom: 16, display: 'inline-block' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: '#ffd166', textTransform: 'uppercase', display: 'block', marginBottom: 6 },
  title: { fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffd166, #af52de)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px' },
  subtitle: { fontSize: 16, color: 'rgba(220,216,230,0.8)', maxWidth: 720, margin: '0 0 18px', lineHeight: 1.55 },
  balanceRow: { display: 'inline-flex', gap: 12, alignItems: 'baseline', padding: '10px 18px', borderRadius: 10, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)' },
  balanceLabel: { fontSize: 12, letterSpacing: '0.18em', color: 'rgba(148,163,184,0.9)', fontWeight: 600, textTransform: 'uppercase' },
  balanceValue: { fontSize: 22, fontWeight: 700, color: '#ffd166' },
  main: { maxWidth: 1200, margin: '0 auto', padding: '28px 28px' },
  err: { padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.4)', color: '#ff9f9f', fontSize: 14, marginBottom: 18 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 },
  card: { padding: 24, borderRadius: 14, border: '1px solid', background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))', display: 'flex', flexDirection: 'column', gap: 14 },
  tierBadge: { padding: '6px 14px', borderRadius: 999, border: '1px solid', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', alignSelf: 'flex-start' },
  price: { display: 'flex', alignItems: 'baseline', gap: 6 },
  priceValue: { fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' },
  priceLabel: { fontSize: 16, color: 'rgba(220,216,230,0.6)', letterSpacing: '0.14em' },
  desc: { fontSize: 15, lineHeight: 1.55, color: 'rgba(220,216,230,0.8)', margin: 0 },
  statsBlock: { display: 'flex', gap: 10 },
  stat: { flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(127,119,221,0.06)', border: '1px solid rgba(127,119,221,0.18)' },
  statLabel: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.8)', fontWeight: 600, marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: 600 },
  buyBtn: { marginTop: 6, padding: '12px 18px', borderRadius: 10, border: 'none', color: '#050210', fontSize: 15, fontWeight: 700, letterSpacing: '0.02em', fontFamily: 'inherit', cursor: 'pointer' },
}
