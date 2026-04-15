'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  CardCategory,
  CardRarity,
  CRAFT_COSTS,
  RARITY_ORDER,
  calculateDust,
  canFuse,
} from '@/lib/game/cards'
import {
  STARTER_CARDS,
  STARTER_CATALOGUE,
  type CoreSetCard,
} from '@/lib/cards/starter_set'
import {
  addCardToCollection,
  craftCard,
  disenchantCard,
  fuseCards,
  ownedCount,
  totalDustValue,
  type CardCollection,
} from '@/lib/cards/collection'
import CardComponent, { RarityChip, RARITY_GLOW } from './CardComponent'
import {
  loadCollection,
  saveCollection,
} from './collectionStorage'

const CATEGORIES: CardCategory[] = [
  CardCategory.Attack,
  CardCategory.Defense,
  CardCategory.Tactical,
  CardCategory.Deployment,
  CardCategory.Alien,
]

export default function CardCollectionView() {
  const [collection, setCollection] = useState<CardCollection>(() => loadCollection())
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<CardCategory | null>(null)
  const [filterRarity, setFilterRarity] = useState<CardRarity | null>(null)
  const [selected, setSelected] = useState<CoreSetCard | null>(null)
  const [fuseTarget, setFuseTarget] = useState<CoreSetCard | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Dev helpers only appear in dev builds, or when ?dev=true is in the URL.
  const [devMode, setDevMode] = useState(false)
  useEffect(() => {
    const inDev = process.env.NODE_ENV === 'development'
    const hasFlag =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('dev') === 'true'
    setDevMode(inDev || hasFlag)
  }, [])

  // Persist on every change
  useEffect(() => {
    saveCollection(collection)
  }, [collection])

  const flashToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  const filtered = useMemo(() => {
    return STARTER_CARDS.filter((c) => {
      if (filterCategory && c.category !== filterCategory) return false
      if (filterRarity && c.rarity !== filterRarity) return false
      if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, filterCategory, filterRarity])

  const totalDust = totalDustValue(collection, STARTER_CATALOGUE)

  // ─── actions ───────────────────────────────────────────────────────────

  const handleDisenchant = (card: CoreSetCard) => {
    try {
      const r = disenchantCard(collection, card.id, STARTER_CATALOGUE)
      setCollection(r.collection)
      flashToast(`Disenchanted ${card.name} → +${r.dustGained} dust`)
    } catch (e) {
      flashToast(`Cannot disenchant: ${(e as Error).message}`)
    }
  }

  const handleCraft = (card: CoreSetCard) => {
    try {
      const next = craftCard(collection, card.id, STARTER_CATALOGUE)
      setCollection(next)
      flashToast(`Crafted ${card.name}`)
    } catch (e) {
      flashToast(`Cannot craft: ${(e as Error).message}`)
    }
  }

  const handleFuseStart = (card: CoreSetCard) => {
    if (card.rarity === CardRarity.Legendary) {
      flashToast('Legendary cards have no fusion target.')
      return
    }
    setFuseTarget(card)
    flashToast(`Pick a second card of ${card.rarity} rarity to fuse.`)
  }

  const handleFuseSecond = (card: CoreSetCard) => {
    if (!fuseTarget) return
    if (!canFuse(fuseTarget, card)) {
      flashToast('Both cards must share rarity (and not be Legendary).')
      return
    }
    try {
      const r = fuseCards(collection, fuseTarget.id, card.id, STARTER_CATALOGUE)
      setCollection(r.collection)
      const result = STARTER_CATALOGUE[r.resultCardId]
      flashToast(`Fused into ${result?.name ?? r.resultCardId} (${r.resultRarity})`)
    } catch (e) {
      flashToast(`Fuse failed: ${(e as Error).message}`)
    } finally {
      setFuseTarget(null)
    }
  }

  // Dev convenience: grant 1 of every card (unblocks deck-builder testing)
  const handleSeedAll = () => {
    let next = collection
    for (const c of STARTER_CARDS) {
      if (ownedCount(next, c.id) < 2 && c.rarity !== CardRarity.Legendary) {
        next = addCardToCollection(next, c.id, 2 - ownedCount(next, c.id))
      } else if (c.rarity === CardRarity.Legendary && ownedCount(next, c.id) < 1) {
        next = addCardToCollection(next, c.id, 1)
      }
    }
    setCollection(next)
    flashToast('Seeded all cards (dev)')
  }

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
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#67e8f9' }}>
              Card Collection
            </h1>
            <p style={{ fontSize: 16, opacity: 0.7, margin: '4px 0 0' }}>
              {STARTER_CARDS.length} cards in the Core Set · disenchant for dust, craft new ones, fuse for higher rarity
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                padding: '10px 16px',
                background: 'rgba(34,211,238,0.1)',
                border: '1px solid rgba(34,211,238,0.5)',
                borderRadius: 8,
                fontSize: 16,
              }}
            >
              <strong style={{ color: '#67e8f9' }}>Dust:</strong>{' '}
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{collection.dust}</span>
              <span style={{ opacity: 0.5, marginLeft: 8 }}>
                (collection worth {totalDust})
              </span>
            </div>
            <Link
              href="/cards/deck-builder"
              style={{
                padding: '10px 16px',
                background: 'rgba(168,85,247,0.15)',
                border: '1px solid rgba(168,85,247,0.6)',
                borderRadius: 8,
                color: '#c084fc',
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Deck Builder →
            </Link>
            {devMode && (
              <button
                onClick={handleSeedAll}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(34,211,238,0.05)',
                  border: '1px dashed rgba(34,211,238,0.4)',
                  color: 'rgba(34,211,238,0.7)',
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
                title="Dev: grant 2 of every non-Legendary card + 1 of every Legendary"
              >
                Seed all (dev)
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 20,
            alignItems: 'center',
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            style={{
              flex: '1 1 220px',
              padding: '8px 12px',
              background: 'rgba(0,0,0,0.6)',
              color: '#e5f7fa',
              border: '1px solid rgba(34,211,238,0.4)',
              borderRadius: 8,
              fontSize: 16,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            {[null, ...CATEGORIES].map((c) => (
              <button
                key={c ?? 'all'}
                onClick={() => setFilterCategory(c)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: filterCategory === c ? 'rgba(34,211,238,0.2)' : 'transparent',
                  border:
                    filterCategory === c
                      ? '1px solid #22d3ee'
                      : '1px solid rgba(34,211,238,0.3)',
                  color: filterCategory === c ? '#67e8f9' : 'rgba(229,247,250,0.7)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                {c ?? 'All categories'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setFilterRarity(null)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: !filterRarity ? 'rgba(34,211,238,0.2)' : 'transparent',
                border: !filterRarity
                  ? '1px solid #22d3ee'
                  : '1px solid rgba(34,211,238,0.3)',
                color: !filterRarity ? '#67e8f9' : 'rgba(229,247,250,0.7)',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              All rarities
            </button>
            {RARITY_ORDER.map((r) => (
              <RarityChip
                key={r}
                rarity={r}
                active={filterRarity === r}
                onClick={() => setFilterRarity(filterRarity === r ? null : r)}
              />
            ))}
          </div>
        </div>

        {/* Fuse target banner */}
        {fuseTarget && (
          <div
            style={{
              padding: 12,
              background: 'rgba(168,85,247,0.15)',
              border: '1px solid #a855f7',
              borderRadius: 8,
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              Fusing <strong>{fuseTarget.name}</strong> ({fuseTarget.rarity}) — pick a
              second {fuseTarget.rarity} card to combine.
            </div>
            <button
              onClick={() => setFuseTarget(null)}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid #a855f7',
                color: '#c084fc',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Card grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 18,
          }}
        >
          {filtered.map((card) => {
            const owned = ownedCount(collection, card.id)
            return (
              <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <CardComponent
                  card={card}
                  ownedCount={owned}
                  onClick={(c) => {
                    if (fuseTarget) handleFuseSecond(c)
                    else setSelected(selected?.id === c.id ? null : c)
                  }}
                  affordable={true}
                  hoverEnlarge={false}
                />
                <CardActions
                  card={card}
                  owned={owned}
                  collection={collection}
                  onDisenchant={() => handleDisenchant(card)}
                  onCraft={() => handleCraft(card)}
                  onFuse={() => handleFuseStart(card)}
                />
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              color: 'rgba(229,247,250,0.5)',
              fontSize: 16,
            }}
          >
            No cards match these filters.
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            background: 'rgba(0,0,0,0.92)',
            border: '1px solid rgba(34,211,238,0.55)',
            borderRadius: 8,
            color: '#e5f7fa',
            fontSize: 16,
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}

// ── inline action buttons for each card ──────────────────────────────────

function CardActions({
  card,
  owned,
  collection,
  onDisenchant,
  onCraft,
  onFuse,
}: {
  card: CoreSetCard
  owned: number
  collection: CardCollection
  onDisenchant: () => void
  onCraft: () => void
  onFuse: () => void
}) {
  const dust = calculateDust(card.rarity)
  const cost = CRAFT_COSTS[card.rarity]
  const canCraftIt = collection.dust >= cost
  const canFuseIt = owned >= 2 && card.rarity !== CardRarity.Legendary

  const btn = (label: string, onClick: () => void, enabled: boolean, color: string) => (
    <button
      onClick={onClick}
      disabled={!enabled}
      style={{
        padding: '6px 10px',
        background: enabled ? `${color}22` : 'transparent',
        border: `1px solid ${enabled ? color : `${color}44`}`,
        color: enabled ? color : `${color}66`,
        borderRadius: 6,
        fontSize: 14,
        cursor: enabled ? 'pointer' : 'not-allowed',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 220 }}>
      {btn(`Disenchant +${dust}`, onDisenchant, owned > 0, '#9ca3af')}
      {btn(`Craft −${cost}`, onCraft, canCraftIt, '#22d3ee')}
      {btn('Fuse ×2', onFuse, canFuseIt, '#a855f7')}
    </div>
  )
}

export { RARITY_GLOW }
