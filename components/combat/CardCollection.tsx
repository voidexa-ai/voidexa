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
import type { CoreSetCard } from '@/lib/cards/starter_set'
import {
  FULL_CARDS,
  FULL_CATALOGUE,
  formatKeyword,
} from '@/lib/cards/full_library'
import {
  addCardToCollection,
  craftCard,
  disenchantCard,
  fuseCards,
  ownedCount,
  totalDustValue,
  type CardCollection,
} from '@/lib/cards/collection'
import { RarityChip, RARITY_GLOW } from './CardComponent'
import { cardArtPath } from './cardArt'
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
    return FULL_CARDS.filter((c) => {
      if (filterCategory && c.category !== filterCategory) return false
      if (filterRarity && c.rarity !== filterRarity) return false
      if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, filterCategory, filterRarity])

  const totalDust = totalDustValue(collection, FULL_CATALOGUE)

  // ─── actions ───────────────────────────────────────────────────────────

  const handleDisenchant = (card: CoreSetCard) => {
    try {
      const r = disenchantCard(collection, card.id, FULL_CATALOGUE)
      setCollection(r.collection)
      flashToast(`Disenchanted ${card.name} → +${r.dustGained} dust`)
    } catch (e) {
      flashToast(`Cannot disenchant: ${(e as Error).message}`)
    }
  }

  const handleCraft = (card: CoreSetCard) => {
    try {
      const next = craftCard(collection, card.id, FULL_CATALOGUE)
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
      const r = fuseCards(collection, fuseTarget.id, card.id, FULL_CATALOGUE)
      setCollection(r.collection)
      const result = FULL_CATALOGUE[r.resultCardId]
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
    for (const c of FULL_CARDS) {
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
              {FULL_CARDS.length} cards in the library · disenchant for dust, craft new ones, fuse for higher rarity
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
            const keywordLabels = card.keywords?.map(formatKeyword) ?? []
            const isFuseTarget = fuseTarget?.id === card.id
            const glow = RARITY_GLOW[card.rarity]
            const src = cardArtPath(card.id) ?? ''
            const handleClick = () => {
              if (fuseTarget) handleFuseSecond(card)
              else setSelected(selected?.id === card.id ? null : card)
            }
            return (
              <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClick()
                  }}
                  aria-label={`${card.name} — ${card.rarity} ${card.category} card`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 260,
                    aspectRatio: '600 / 900',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isFuseTarget ? `2px solid ${glow}` : '2px solid transparent',
                    boxShadow: isFuseTarget ? `0 0 16px ${glow}aa` : 'none',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    background: '#0a0a0f',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)'
                    e.currentTarget.style.boxShadow = `0 0 20px ${glow}66`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = isFuseTarget
                      ? `0 0 16px ${glow}aa`
                      : 'none'
                  }}
                >
                  { /* eslint-disable-next-line @next/next/no-img-element */ }
                  <img
                    src={src}
                    alt={card.name}
                    loading="lazy"
                    width={600}
                    height={900}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                  {owned > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        padding: '2px 8px',
                        background: 'rgba(0,0,0,0.72)',
                        border: `1px solid ${glow}`,
                        borderRadius: 4,
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#e5f7fa',
                        pointerEvents: 'none',
                      }}
                    >
                      ×{owned}
                    </div>
                  )}
                  {keywordLabels.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        right: 8,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        pointerEvents: 'none',
                      }}
                    >
                      {keywordLabels.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          style={{
                            fontSize: 11,
                            color: glow,
                            background: 'rgba(0,0,0,0.78)',
                            border: `1px solid ${glow}aa`,
                            borderRadius: 3,
                            padding: '1px 6px',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
