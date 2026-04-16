'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CARD_TEMPLATES, CARDS_BY_ID, type CardTemplate } from '@/lib/game/cards/index'

interface Props {
  onResolved: (result: BattleResult) => void
}

export interface BattleResult {
  outcome: 'won' | 'lost'
  playerHullLeft: number
}

const PLAYER_HULL = 40
const PIRATE_HULL = 30

/** Reasonable damage estimate for a card in a 3-turn skirmish. */
function cardStrength(tpl: CardTemplate): number {
  if (tpl.stats.damage) return tpl.stats.damage + (tpl.stats.splash ?? 0)
  if (tpl.stats.block) return Math.floor((tpl.stats.block ?? 0) * 0.5)
  if (tpl.stats.heal) return Math.floor((tpl.stats.heal ?? 0) * 0.4)
  if (tpl.stats.absorb) return Math.floor((tpl.stats.absorb ?? 0) * 0.4)
  if (tpl.stats.per_turn && tpl.stats.duration_turns) {
    return tpl.stats.per_turn * Math.min(3, tpl.stats.duration_turns)
  }
  return 3
}

export default function MiniCardBattle({ onResolved }: Props) {
  const [playerDeck, setPlayerDeck] = useState<CardTemplate[]>([])
  const [pirateDeck, setPirateDeck] = useState<CardTemplate[]>([])
  const [turn, setTurn] = useState(1)
  const [playerHull, setPlayerHull] = useState(PLAYER_HULL)
  const [pirateHull, setPirateHull] = useState(PIRATE_HULL)
  const [log, setLog] = useState<string[]>([])
  const [finished, setFinished] = useState(false)

  // Load player's active deck (or fall back to 3 random common cards).
  useEffect(() => {
    (async () => {
      const hand = await loadPlayerHand()
      setPlayerDeck(hand)
      setPirateDeck(pickPirateHand())
    })()
  }, [])

  useEffect(() => {
    if (finished) return
    if (playerHull <= 0 || pirateHull <= 0) {
      setFinished(true)
      setTimeout(() => onResolved({
        outcome: pirateHull <= 0 && playerHull > 0 ? 'won' : 'lost',
        playerHullLeft: Math.max(0, playerHull),
      }), 900)
    }
  }, [playerHull, pirateHull, finished, onResolved])

  function handlePlay(card: CardTemplate, index: number) {
    if (finished || turn > 3) return
    const playerDmg = cardStrength(card)
    const pirateCard = pirateDeck[index] ?? pirateDeck[0]
    const pirateDmg = pirateCard ? cardStrength(pirateCard) : 5

    const nextPirateHull = Math.max(0, pirateHull - playerDmg)
    const nextPlayerHull = Math.max(0, playerHull - Math.max(0, pirateDmg - (card.stats.block ?? 0)))
    setPirateHull(nextPirateHull)
    setPlayerHull(nextPlayerHull)
    setPlayerDeck(prev => prev.filter((_, i) => i !== index))
    setPirateDeck(prev => prev.filter((_, i) => i !== index))
    setLog(prev => [
      `T${turn}: You played ${card.name} — ${playerDmg} dmg.`,
      ...(pirateCard ? [`T${turn}: Pirate played ${pirateCard.name} — ${pirateDmg} dmg.`] : []),
      ...prev,
    ])
    setTurn(t => t + 1)

    // Turn 3 over and both still alive → decide by remaining hull
    if (turn >= 3) {
      setTimeout(() => {
        const winner = nextPirateHull < nextPlayerHull ? 'won' : 'lost'
        setFinished(true)
        onResolved({ outcome: winner, playerHullLeft: nextPlayerHull })
      }, 900)
    }
  }

  const canAct = !finished && playerDeck.length > 0 && turn <= 3

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.eyebrow}>Pirate Ambush · Card Battle</div>
        <h3 style={S.title}>Turn {Math.min(turn, 3)} / 3</h3>

        <div style={S.hullsRow}>
          <HullBar label="Pirate" value={pirateHull} max={PIRATE_HULL} color="#ff6b6b" />
          <HullBar label="You" value={playerHull} max={PLAYER_HULL} color="#7fff9f" />
        </div>

        <div style={S.hand}>
          {playerDeck.length === 0 && <div style={S.emptyHand}>Empty hand.</div>}
          {playerDeck.slice(0, 3).map((c, i) => (
            <button
              key={`${c.id}-${i}`}
              onClick={() => handlePlay(c, i)}
              disabled={!canAct}
              style={{ ...S.cardTile, opacity: canAct ? 1 : 0.5, cursor: canAct ? 'pointer' : 'not-allowed' }}
            >
              <div style={S.cardCost}>{c.cost}</div>
              <div style={S.cardName}>{c.name}</div>
              <div style={S.cardAbility}>{c.abilityText}</div>
              <div style={S.cardStrength}>~ {cardStrength(c)} impact</div>
            </button>
          ))}
        </div>

        <div style={S.log}>
          {log.slice(0, 4).map((line, i) => (
            <div key={i} style={S.logLine}>{line}</div>
          ))}
          {log.length === 0 && <div style={S.logEmpty}>Play a card to attack.</div>}
        </div>
      </div>
    </div>
  )
}

function HullBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.max(0, (value / max) * 100)
  return (
    <div style={S.hullBlock}>
      <div style={S.hullLabel}>{label}</div>
      <div style={S.hullBar}>
        <div style={{ ...S.hullFill, width: `${pct}%`, background: color }} />
      </div>
      <div style={S.hullValue}>{value} / {max}</div>
    </div>
  )
}

async function loadPlayerHand(): Promise<CardTemplate[]> {
  const { data: user } = await supabase.auth.getUser()
  if (user.user) {
    const { data: decks } = await supabase
      .from('decks')
      .select('id')
      .eq('user_id', user.user.id)
      .limit(1)
    const deckId = decks && decks[0] ? (decks[0].id as string) : null
    if (deckId) {
      const { data: cards } = await supabase
        .from('deck_cards')
        .select('template_id')
        .eq('deck_id', deckId)
      const ids = (cards ?? []).map(r => r.template_id as string)
      const mapped = ids.map(id => CARDS_BY_ID[id]).filter((c): c is CardTemplate => !!c)
      if (mapped.length >= 3) return shuffle(mapped).slice(0, 3)
    }
  }
  return shuffle(CARD_TEMPLATES.filter(c => c.rarity === 'common' || c.rarity === 'uncommon')).slice(0, 3)
}

function pickPirateHand(): CardTemplate[] {
  return shuffle(CARD_TEMPLATES.filter(c => c.type === 'weapon' || c.type === 'maneuver')).slice(0, 3)
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const S: Record<string, React.CSSProperties> = {
  wrap: { position: 'fixed', inset: 0, background: 'rgba(2,1,10,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 20 },
  card: { width: '100%', maxWidth: 720, padding: 28, borderRadius: 16, background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))', border: '1px solid rgba(255,107,107,0.35)', boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 32px rgba(255,107,107,0.15)', color: '#e8e4f0', fontFamily: 'var(--font-sans)' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ff6b6b' },
  title: { fontSize: 24, fontWeight: 700, color: '#fff', margin: '4px 0 16px' },
  hullsRow: { display: 'flex', gap: 16, marginBottom: 18 },
  hullBlock: { flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(127,119,221,0.2)', background: 'rgba(12,14,30,0.6)' },
  hullLabel: { fontSize: 12, letterSpacing: '0.14em', color: 'rgba(148,163,184,0.8)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 },
  hullBar: { height: 8, borderRadius: 4, background: 'rgba(127,119,221,0.18)', overflow: 'hidden', marginBottom: 4 },
  hullFill: { height: '100%', transition: 'width 0.4s' },
  hullValue: { fontSize: 14, fontWeight: 600, color: '#fff' },
  hand: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 16 },
  cardTile: { position: 'relative', padding: 14, borderRadius: 10, border: '1px solid rgba(127,119,221,0.35)', background: 'linear-gradient(145deg, rgba(20,22,40,0.95), rgba(12,14,30,0.95))', color: '#e8e4f0', fontFamily: 'inherit', textAlign: 'left', minHeight: 120 },
  cardCost: { position: 'absolute', top: 8, left: 8, width: 28, height: 28, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #7ff7ff, #1d6b8a)', color: '#071019', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardName: { marginLeft: 36, fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 },
  cardAbility: { fontSize: 13, lineHeight: 1.4, color: 'rgba(220,216,230,0.8)' },
  cardStrength: { marginTop: 8, fontSize: 12, color: '#ffd166', fontWeight: 600 },
  emptyHand: { gridColumn: '1 / -1', textAlign: 'center', padding: '24px 0', fontSize: 14, color: 'rgba(220,216,230,0.6)' },
  log: { padding: '10px 14px', borderRadius: 8, background: 'rgba(127,119,221,0.06)', border: '1px solid rgba(127,119,221,0.18)', maxHeight: 120, overflowY: 'auto', fontSize: 13, lineHeight: 1.5 },
  logLine: { color: 'rgba(220,216,230,0.85)' },
  logEmpty: { color: 'rgba(220,216,230,0.5)', textAlign: 'center' },
}
