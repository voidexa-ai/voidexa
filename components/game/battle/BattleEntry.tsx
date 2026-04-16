'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CARDS_BY_ID, type CardTemplate } from '@/lib/game/cards/index'
import { PVE_TIERS, type PveTierId } from '@/lib/game/battle/encounters'

interface Props {
  onStart: (tierId: PveTierId, playerDeck: CardTemplate[]) => void
}

const TIER_COLORS: Record<PveTierId, string> = {
  1: '#7fff9f', 2: '#5ac8fa', 3: '#ffd166', 4: '#ff8a3c', 5: '#ff6b6b',
}

const STARTER_DECK_IDS = [
  'pulse_tap', 'pulse_tap', 'quick_shield', 'quick_shield',
  'strafe_burn', 'strafe_burn', 'scout_drone', 'scout_drone',
  'tactical_predict', 'tactical_predict', 'repair_foam', 'repair_foam',
  'rail_spike', 'rail_spike', 'deflector_net', 'deflector_net',
  'hard_flip', 'hard_flip', 'intercept_drone', 'hunter_logic',
]

function buildStarterDeck(): CardTemplate[] {
  return STARTER_DECK_IDS
    .map(id => CARDS_BY_ID[id])
    .filter((c): c is CardTemplate => !!c)
}

export default function BattleEntry({ onStart }: Props) {
  const [selectedTier, setSelectedTier] = useState<PveTierId>(1)
  const [loading, setLoading] = useState(true)
  const [playerDeck, setPlayerDeck] = useState<CardTemplate[]>(buildStarterDeck())
  const [deckSource, setDeckSource] = useState<'starter' | 'saved'>('starter')
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id
      if (!uid) { setLoading(false); return }
      setSignedIn(true)
      const { data: decks } = await supabase
        .from('decks')
        .select('id, name, updated_at')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false })
        .limit(1)
      const deckId = decks && decks[0] ? (decks[0].id as string) : null
      if (deckId) {
        const { data: rows } = await supabase
          .from('deck_cards')
          .select('template_id, count')
          .eq('deck_id', deckId)
        const expanded: CardTemplate[] = []
        ;(rows ?? []).forEach(r => {
          const tpl = CARDS_BY_ID[r.template_id as string]
          if (!tpl) return
          for (let i = 0; i < (r.count as number); i++) expanded.push(tpl)
        })
        if (expanded.length >= 10) {
          setPlayerDeck(expanded)
          setDeckSource('saved')
        }
      }
      setLoading(false)
    })()
  }, [])

  const tier = useMemo(() => PVE_TIERS[selectedTier], [selectedTier])
  const color = TIER_COLORS[selectedTier]

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div style={S.headerInner}>
          <Link href="/" style={S.backLink}>← voidexa</Link>
          <span style={S.eyebrow}>PVE · CARD COMBAT</span>
          <h1 style={S.title}>Pick a Fight</h1>
          <p style={S.subtitle}>
            Five tiers of escalating difficulty. Start in the Core. Earn your way to the Deep Void.
          </p>
        </div>
      </header>

      <main style={S.main}>
        <section style={S.tierSection}>
          <h2 style={S.sectionTitle}>Tier</h2>
          <div style={S.tierRow}>
            {([1, 2, 3, 4, 5] as PveTierId[]).map(id => {
              const t = PVE_TIERS[id]
              const active = selectedTier === id
              const c = TIER_COLORS[id]
              return (
                <button
                  key={id}
                  onClick={() => setSelectedTier(id)}
                  style={{
                    ...S.tierCard,
                    borderColor: active ? c : 'rgba(127,119,221,0.25)',
                    background: active ? `linear-gradient(145deg, ${c}15, rgba(12,14,30,0.9))` : 'rgba(12,14,30,0.6)',
                    boxShadow: active ? `0 0 24px ${c}40` : 'none',
                  }}
                >
                  <div style={{ ...S.tierNumber, color: c }}>T{id}</div>
                  <div style={S.tierName}>{t.name}</div>
                  <div style={S.tierZone}>{t.zone}</div>
                  <div style={S.tierStats}>
                    <span>{t.hull} HP</span>
                    <span>·</span>
                    <span>{t.deckSize} cards</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section style={S.enemySection}>
          <div style={S.enemyCard}>
            <div style={S.enemyHeader}>
              <span style={{ ...S.tierBadge, background: `${color}20`, color, borderColor: `${color}80` }}>
                Tier {tier.id}
              </span>
              <h3 style={S.enemyName}>{tier.name}</h3>
            </div>
            <p style={S.enemyDesc}>
              A {tier.zone.toLowerCase()} opponent wielding {tier.allowedRarities.join(' / ')} cards.
              {tier.maxDrones > 0 && ` Up to ${tier.maxDrones} drone${tier.maxDrones > 1 ? 's' : ''}.`}
              {tier.usesStatuses && ' Uses status effects.'}
              {tier.aggressive && ' Plays aggressively.'}
            </p>
            <div style={S.enemyStats}>
              <Stat label="Hull" value={`${tier.hull}`} accent={color} />
              <Stat label="Deck" value={`${tier.deckSize}`} />
              <Stat label="Drones" value={`${tier.maxDrones}`} />
            </div>
          </div>

          <div style={S.deckInfo}>
            <span style={S.deckSourceLabel}>YOUR DECK</span>
            {loading ? (
              <span style={S.deckSourceValue}>Loading…</span>
            ) : (
              <>
                <span style={S.deckSourceValue}>
                  {deckSource === 'saved' ? 'Saved deck' : 'Starter deck'} · {playerDeck.length} cards
                </span>
                {deckSource === 'starter' && signedIn && (
                  <Link href="/game/cards/deck-builder" style={S.deckHint}>Build a custom deck →</Link>
                )}
                {!signedIn && (
                  <span style={{ ...S.deckHint, color: 'rgba(220,216,230,0.55)' }}>
                    Sign in to save decks & battles
                  </span>
                )}
              </>
            )}
          </div>
        </section>

        <button
          onClick={() => onStart(selectedTier, playerDeck)}
          disabled={loading || playerDeck.length < 5}
          style={{
            ...S.fightBtn,
            background: `linear-gradient(135deg, ${color}, #af52de)`,
            boxShadow: `0 0 28px ${color}55`,
            opacity: loading || playerDeck.length < 5 ? 0.55 : 1,
          }}
        >
          Fight →
        </button>
      </main>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={S.statBlock}>
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
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: '#ff6b6b', textTransform: 'uppercase', display: 'block', marginBottom: 6 },
  title: { fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ff6b6b, #af52de)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px' },
  subtitle: { fontSize: 16, color: 'rgba(220,216,230,0.8)', margin: 0, maxWidth: 640, lineHeight: 1.55 },
  main: { maxWidth: 1200, margin: '0 auto', padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 28 },
  sectionTitle: { fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.9)', fontWeight: 600, margin: '0 0 14px' },
  tierSection: {},
  tierRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  tierCard: { padding: '14px 16px', borderRadius: 12, border: '1px solid', background: 'rgba(12,14,30,0.6)', cursor: 'pointer', textAlign: 'left', color: '#e8e4f0', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', gap: 4 },
  tierNumber: { fontSize: 14, fontWeight: 700, letterSpacing: '0.12em' },
  tierName: { fontSize: 16, fontWeight: 600, color: '#fff' },
  tierZone: { fontSize: 13, color: 'rgba(148,163,184,0.85)' },
  tierStats: { display: 'flex', gap: 6, fontSize: 13, color: 'rgba(220,216,230,0.75)', marginTop: 4 },
  enemySection: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 24, alignItems: 'start' },
  enemyCard: { padding: 24, borderRadius: 14, border: '1px solid rgba(127,119,221,0.28)', background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))' },
  enemyHeader: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 },
  tierBadge: { padding: '4px 12px', borderRadius: 999, border: '1px solid', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' },
  enemyName: { fontSize: 26, fontWeight: 700, color: '#fff', margin: 0 },
  enemyDesc: { fontSize: 15, lineHeight: 1.55, color: 'rgba(220,216,230,0.8)', margin: '0 0 18px' },
  enemyStats: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  statBlock: { flex: 1, padding: '10px 14px', borderRadius: 8, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.18)', minWidth: 100 },
  statLabel: { fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.8)', fontWeight: 600, marginBottom: 2 },
  statValue: { fontSize: 22, fontWeight: 700 },
  deckInfo: { padding: 18, borderRadius: 14, border: '1px solid rgba(127,119,221,0.28)', background: 'rgba(12,14,30,0.55)', display: 'flex', flexDirection: 'column', gap: 6 },
  deckSourceLabel: { fontSize: 11, letterSpacing: '0.18em', color: 'rgba(148,163,184,0.85)', fontWeight: 600, textTransform: 'uppercase' },
  deckSourceValue: { fontSize: 16, fontWeight: 500, color: '#fff' },
  deckHint: { fontSize: 14, color: '#00d4ff', textDecoration: 'none', marginTop: 2 },
  fightBtn: { padding: '16px 40px', borderRadius: 12, border: 'none', color: '#050210', fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'center' },
}
