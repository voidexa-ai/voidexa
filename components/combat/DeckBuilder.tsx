'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { CardCategory, CardRarity, RARITY_ORDER } from '@/lib/game/cards'
import {
  STARTER_CARDS,
  STARTER_CATALOGUE,
  type CoreSetCard,
} from '@/lib/cards/starter_set'
import {
  DECK_SIZE,
  MAX_COPIES_DEFAULT,
  MAX_COPIES_LEGENDARY,
  addCard,
  createDeck,
  isValidDeck,
  maxCopies,
  removeCard,
  type Deck,
} from '@/lib/cards/deck'
import { ownedCount, type CardCollection } from '@/lib/cards/collection'
import CardComponent, { RARITY_GLOW, RarityChip } from './CardComponent'
import {
  loadActiveDeckName,
  loadCollection,
  loadDecks,
  saveActiveDeckName,
  saveCollection,
  saveDecks,
} from './collectionStorage'

const CATEGORIES: CardCategory[] = [
  CardCategory.Attack,
  CardCategory.Defense,
  CardCategory.Tactical,
  CardCategory.Deployment,
  CardCategory.Alien,
]

export default function DeckBuilder() {
  const [collection, setCollection] = useState<CardCollection>(() => loadCollection())
  const [decks, setDecks] = useState<Deck[]>(() => loadDecks())
  const [activeName, setActiveName] = useState<string | null>(() => loadActiveDeckName())

  const activeDeck =
    decks.find((d) => d.name === activeName) ?? decks[0] ?? createDeck('My First Deck')

  const [deck, setDeck] = useState<Deck>(activeDeck)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<CardCategory | null>(null)
  const [filterRarity, setFilterRarity] = useState<CardRarity | null>(null)
  const [showOnlyOwned, setShowOnlyOwned] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Persist collection (in case we ever modify it here)
  useEffect(() => {
    saveCollection(collection)
  }, [collection])

  // Persist decks list
  useEffect(() => {
    saveDecks(decks)
  }, [decks])

  // Persist active deck name
  useEffect(() => {
    saveActiveDeckName(activeName)
  }, [activeName])

  // ─── filtering ─────────────────────────────────────────────────────────

  const visible = useMemo(() => {
    return STARTER_CARDS.filter((c) => {
      if (showOnlyOwned && ownedCount(collection, c.id) === 0) return false
      if (filterCategory && c.category !== filterCategory) return false
      if (filterRarity && c.rarity !== filterRarity) return false
      if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [collection, search, filterCategory, filterRarity, showOnlyOwned])

  // ─── add / remove ──────────────────────────────────────────────────────

  const tryAdd = (card: CoreSetCard) => {
    setError(null)
    const owned = ownedCount(collection, card.id)
    const inDeck = deck.cardIds.filter((id) => id === card.id).length
    if (inDeck >= owned) {
      setError(`You only own ${owned} copy(s) of "${card.name}".`)
      return
    }
    try {
      const next = addCard(deck, card.id, STARTER_CATALOGUE)
      setDeck(next)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const tryRemove = (cardId: string) => {
    setError(null)
    setDeck(removeCard(deck, cardId))
  }

  // ─── deck-level actions ────────────────────────────────────────────────

  const validation = isValidDeck(deck, STARTER_CATALOGUE)

  const saveCurrent = () => {
    setError(null)
    if (!deck.name.trim()) {
      setError('Deck name cannot be empty.')
      return
    }
    setDecks((prev) => {
      const idx = prev.findIndex((d) => d.name === deck.name)
      if (idx === -1) return [...prev, deck]
      const next = [...prev]
      next[idx] = deck
      return next
    })
    setActiveName(deck.name)
  }

  const renameDeck = (newName: string) => {
    setDeck({ ...deck, name: newName })
  }

  const newDeck = () => {
    const blank = createDeck(`New Deck ${decks.length + 1}`)
    setDeck(blank)
  }

  const loadDeck = (name: string) => {
    const d = decks.find((x) => x.name === name)
    if (d) {
      setDeck(d)
      setActiveName(name)
    }
  }

  // Auto-fill: greedily add affordable cards until 20, respecting ownership + copy caps.
  const autoFill = () => {
    setError(null)
    let next = deck
    // Cycle priority: rare → common (covers more ground), prefer affordable energy.
    const sortedPool = [...STARTER_CARDS].sort((a, b) => {
      const ra = RARITY_ORDER.indexOf(a.rarity)
      const rb = RARITY_ORDER.indexOf(b.rarity)
      if (ra !== rb) return rb - ra // higher rarity first
      return a.energyCost - b.energyCost
    })
    let safety = 200
    while (next.cardIds.length < DECK_SIZE && safety-- > 0) {
      let added = false
      for (const card of sortedPool) {
        if (next.cardIds.length >= DECK_SIZE) break
        const owned = ownedCount(collection, card.id)
        const inDeck = next.cardIds.filter((id) => id === card.id).length
        if (inDeck >= owned) continue
        if (inDeck >= maxCopies(card.rarity)) continue
        try {
          next = addCard(next, card.id, STARTER_CATALOGUE)
          added = true
        } catch {
          /* fall through */
        }
      }
      if (!added) break
    }
    setDeck(next)
    if (next.cardIds.length < DECK_SIZE) {
      setError(
        `Auto-fill stopped at ${next.cardIds.length}/${DECK_SIZE} — you don't own enough cards. Disenchant + craft, or seed via /cards.`,
      )
    }
  }

  // ─── deck stats ────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const cards = deck.cardIds.map((id) => STARTER_CATALOGUE[id]).filter(Boolean)
    const totalEnergy = cards.reduce((s, c) => s + c.energyCost, 0)
    const avgEnergy = cards.length ? totalEnergy / cards.length : 0
    const byCategory: Record<string, number> = {}
    const byRarity: Record<string, number> = {}
    for (const c of cards) {
      byCategory[c.category] = (byCategory[c.category] ?? 0) + 1
      byRarity[c.rarity] = (byRarity[c.rarity] ?? 0) + 1
    }
    return { avgEnergy, byCategory, byRarity, count: cards.length }
  }, [deck])

  // ─── render ────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#e5f7fa',
        padding: '24px 20px 80px',
      }}
    >
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#67e8f9' }}>
              Deck Builder
            </h1>
            <p style={{ fontSize: 16, opacity: 0.7, margin: '4px 0 0' }}>
              Build a {DECK_SIZE}-card deck. Max {MAX_COPIES_DEFAULT} copies of normal cards,{' '}
              {MAX_COPIES_LEGENDARY} of Legendary.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={deck.name}
              onChange={(e) => loadDeck(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.6)',
                color: '#e5f7fa',
                border: '1px solid rgba(34,211,238,0.4)',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
              }}
            >
              {!decks.find((d) => d.name === deck.name) && (
                <option value={deck.name}>{deck.name} (unsaved)</option>
              )}
              {decks.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.cardIds.length})
                </option>
              ))}
            </select>
            <button
              onClick={newDeck}
              style={btnStyle('#67e8f9')}
            >
              + New
            </button>
            <button onClick={autoFill} style={btnStyle('#a855f7')}>
              Auto-fill
            </button>
            <button onClick={saveCurrent} style={btnStyle('#22c55e', true)}>
              Save deck
            </button>
            <Link href="/cards" style={{ ...btnStyle('#9ca3af'), textDecoration: 'none' }}>
              ← Collection
            </Link>
          </div>
        </div>

        {/* Validation banner */}
        <div
          style={{
            padding: '10px 14px',
            background: validation.valid
              ? 'rgba(34,197,94,0.1)'
              : 'rgba(239,68,68,0.1)',
            border: `1px solid ${validation.valid ? '#22c55e' : '#ef4444'}`,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {validation.valid ? (
            <>✓ Deck is valid — {deck.cardIds.length}/{DECK_SIZE} cards.</>
          ) : (
            <>
              ⚠ {validation.errors.length} issue(s):{' '}
              {validation.errors.join(' · ')}
            </>
          )}
          {error && (
            <div style={{ marginTop: 6, color: '#fca5a5' }}>
              {error}
            </div>
          )}
        </div>

        {/* Two-pane layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: 24,
          }}
        >
          {/* LEFT — owned cards */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                style={{
                  flex: '1 1 200px',
                  padding: '8px 12px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#e5f7fa',
                  border: '1px solid rgba(34,211,238,0.4)',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  padding: '0 8px',
                }}
              >
                <input
                  type="checkbox"
                  checked={showOnlyOwned}
                  onChange={(e) => setShowOnlyOwned(e.target.checked)}
                />
                Owned only
              </label>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {[null, ...CATEGORIES].map((c) => (
                <button
                  key={c ?? 'all'}
                  onClick={() => setFilterCategory(c)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    background:
                      filterCategory === c ? 'rgba(34,211,238,0.2)' : 'transparent',
                    border:
                      filterCategory === c
                        ? '1px solid #22d3ee'
                        : '1px solid rgba(34,211,238,0.3)',
                    color: filterCategory === c ? '#67e8f9' : 'rgba(229,247,250,0.7)',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  {c ?? 'All'}
                </button>
              ))}
              {RARITY_ORDER.map((r) => (
                <RarityChip
                  key={r}
                  rarity={r}
                  active={filterRarity === r}
                  onClick={() => setFilterRarity(filterRarity === r ? null : r)}
                />
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 12,
              }}
            >
              {visible.map((card) => {
                const owned = ownedCount(collection, card.id)
                const inDeck = deck.cardIds.filter((id) => id === card.id).length
                const limit = Math.min(maxCopies(card.rarity), owned)
                const canAdd = inDeck < limit && deck.cardIds.length < DECK_SIZE
                return (
                  <div
                    key={card.id}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  >
                    <CardComponent
                      card={card}
                      ownedCount={owned}
                      size="compact"
                      onClick={canAdd ? tryAdd : undefined}
                      onDragStart={canAdd ? tryAdd : undefined}
                      affordable={canAdd}
                      hoverEnlarge={true}
                    />
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      {inDeck}/{limit} in deck
                    </div>
                  </div>
                )
              })}
              {visible.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center', opacity: 0.5 }}>
                  No matching cards.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — current deck */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData('application/voidexa-card-id')
              const card = STARTER_CATALOGUE[id] as CoreSetCard | undefined
              if (card) tryAdd(card)
            }}
            style={{
              padding: 16,
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(34,211,238,0.4)',
              borderRadius: 12,
              minHeight: 300,
              alignSelf: 'flex-start',
              position: 'sticky',
              top: 16,
            }}
          >
            <input
              value={deck.name}
              onChange={(e) => renameDeck(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.6)',
                color: '#e5f7fa',
                border: '1px solid rgba(34,211,238,0.4)',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12,
                outline: 'none',
              }}
              placeholder="Deck name..."
            />
            <div style={{ fontSize: 14, marginBottom: 12, opacity: 0.8 }}>
              {deck.cardIds.length}/{DECK_SIZE} cards
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              {Object.entries(groupCounts(deck.cardIds))
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([id, count]) => {
                  const card = STARTER_CATALOGUE[id] as CoreSetCard | undefined
                  if (!card) return null
                  return (
                    <DeckRow
                      key={id}
                      card={card}
                      count={count}
                      onRemove={() => tryRemove(id)}
                    />
                  )
                })}
              {deck.cardIds.length === 0 && (
                <div
                  style={{
                    padding: 24,
                    textAlign: 'center',
                    opacity: 0.5,
                    fontSize: 14,
                    border: '1px dashed rgba(34,211,238,0.3)',
                    borderRadius: 8,
                  }}
                >
                  Drag or click cards from the left to add them.
                </div>
              )}
            </div>

            {/* Deck stats */}
            <div
              style={{
                padding: 12,
                background: 'rgba(34,211,238,0.05)',
                border: '1px solid rgba(34,211,238,0.2)',
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              <div style={{ marginBottom: 8, fontWeight: 600, color: '#67e8f9' }}>
                Stats
              </div>
              <div>Avg energy: {stats.avgEnergy.toFixed(2)}</div>
              <div style={{ marginTop: 6 }}>
                <strong>Categories:</strong>{' '}
                {Object.entries(stats.byCategory)
                  .map(([c, n]) => `${c} ${n}`)
                  .join(' · ') || '—'}
              </div>
              <div>
                <strong>Rarities:</strong>{' '}
                {Object.entries(stats.byRarity)
                  .map(([r, n]) => `${r} ${n}`)
                  .join(' · ') || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function btnStyle(color: string, primary = false): React.CSSProperties {
  return {
    padding: '8px 14px',
    background: primary ? `${color}33` : `${color}11`,
    border: `1px solid ${color}`,
    color: primary ? '#fff' : color,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: primary ? 600 : 400,
    cursor: 'pointer',
  }
}

function groupCounts(ids: string[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const id of ids) out[id] = (out[id] ?? 0) + 1
  return out
}

function DeckRow({
  card,
  count,
  onRemove,
}: {
  card: CoreSetCard
  count: number
  onRemove: () => void
}) {
  const glow = RARITY_GLOW[card.rarity]
  return (
    <button
      onClick={onRemove}
      title="Click to remove one copy"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        background: 'rgba(0,0,0,0.4)',
        border: `1px solid ${glow}55`,
        borderRadius: 6,
        cursor: 'pointer',
        textAlign: 'left',
        color: '#e5f7fa',
        fontSize: 14,
      }}
    >
      <span
        style={{
          background: '#67e8f9',
          color: '#0a0a0f',
          width: 20,
          height: 20,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {card.energyCost}
      </span>
      <span style={{ flex: 1 }}>{card.name}</span>
      <span style={{ color: glow, fontSize: 12, marginRight: 6 }}>×{count}</span>
      <span style={{ opacity: 0.5, fontSize: 12 }}>×</span>
    </button>
  )
}
