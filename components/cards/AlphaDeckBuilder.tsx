'use client'

// Orchestrator for /cards/alpha/deck-builder. Bar + saved-slots UI live in
// AlphaDeckBar.tsx and AlphaDeckSlots.tsx to keep this file under the 300-line
// cap. V3 deck builder at components/combat/DeckBuilder.tsx is untouched.

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import AlphaCardFrame, {
  type AlphaCardType,
  type AlphaRarity,
} from '@/components/cards/AlphaCardFrame'
import AlphaDeckBar, { DECK_SIZE } from '@/components/cards/AlphaDeckBar'
import AlphaDeckSlots, {
  MAX_DECKS,
  type SavedDeckSlot,
} from '@/components/cards/AlphaDeckSlots'
import {
  ALPHA_DB_TO_LABEL,
  VALID_ALPHA_TYPES,
  type AlphaTypeDb,
} from '@/lib/cards/alpha-types'
import { saveDeck } from '@/app/actions/decks/saveDeck'
import { loadDeck } from '@/app/actions/decks/loadDeck'
import { deleteDeck } from '@/app/actions/decks/deleteDeck'

export interface DeckBuilderCard {
  id: string
  name: string
  type: AlphaTypeDb
  rarity: AlphaRarity
  energy_cost: number
  attack: number | null
  defense: number | null
  effect_text: string
  flavor_text: string | null
}

export type SavedDeck = SavedDeckSlot

const ALL_RARITIES: AlphaRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
const INVENTORY_CAP = 100
const SEARCH_DEBOUNCE_MS = 300

export default function AlphaDeckBuilder({
  cards,
  savedDecks,
}: {
  cards: DeckBuilderCard[]
  savedDecks: SavedDeck[]
}) {
  const cardById = useMemo(() => {
    const m = new Map<string, DeckBuilderCard>()
    for (const c of cards) m.set(c.id, c)
    return m
  }, [cards])

  const [deckIds, setDeckIds] = useState<string[]>([])
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null)
  const [deckName, setDeckName] = useState<string>('New Deck')
  const [visibleCount, setVisibleCount] = useState<number>(10)
  const [filterType, setFilterType] = useState<'all' | AlphaTypeDb>('all')
  const [filterRarity, setFilterRarity] = useState<'all' | AlphaRarity>('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusMsg, setStatusMsg] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(
      () => setSearch(searchInput.toLowerCase().trim()),
      SEARCH_DEBOUNCE_MS,
    )
    return () => clearTimeout(t)
  }, [searchInput])

  const filteredAll = useMemo(() => {
    return cards.filter((c) => {
      if (filterType !== 'all' && c.type !== filterType) return false
      if (filterRarity !== 'all' && c.rarity !== filterRarity) return false
      if (search && !c.name.toLowerCase().includes(search)) return false
      return true
    })
  }, [cards, filterType, filterRarity, search])

  const inventory = filteredAll.slice(0, INVENTORY_CAP)
  const overflow = filteredAll.length - inventory.length

  function addCard(id: string) {
    if (!cardById.has(id)) return
    if (deckIds.length >= DECK_SIZE) {
      setStatusMsg(`Deck full at ${DECK_SIZE} cards.`)
      return
    }
    setDeckIds((prev) => [...prev, id])
    setStatusMsg('')
  }

  function removeAt(idx: number) {
    setDeckIds((prev) => prev.filter((_, i) => i !== idx))
    setStatusMsg('')
  }

  function newDeck() {
    setActiveSlotId(null)
    setDeckIds([])
    setDeckName('New Deck')
    setStatusMsg('')
  }

  function loadSlot(slotId: string) {
    startTransition(async () => {
      const res = await loadDeck(slotId)
      if (res.ok) {
        setDeckIds(res.deck.cardIds)
        setActiveSlotId(res.deck.id)
        setDeckName(res.deck.name)
        setStatusMsg(`Loaded "${res.deck.name}".`)
      } else {
        setStatusMsg('Failed to load deck.')
      }
    })
  }

  function saveCurrent() {
    if (deckIds.length !== DECK_SIZE) {
      setStatusMsg(`Need exactly ${DECK_SIZE} cards (have ${deckIds.length}).`)
      return
    }
    if (!activeSlotId && savedDecks.length >= MAX_DECKS) {
      setStatusMsg(`Max ${MAX_DECKS} decks reached. Delete one first.`)
      return
    }
    startTransition(async () => {
      const res = await saveDeck({
        deckId: activeSlotId,
        name: deckName,
        cardIds: deckIds,
      })
      if (res.ok) {
        setActiveSlotId(res.deckId)
        setStatusMsg('Saved.')
        router.refresh()
      } else if (res.error === 'max_decks_reached') {
        setStatusMsg(`Max ${MAX_DECKS} decks reached. Delete one first.`)
      } else {
        setStatusMsg(`Save failed (${res.error}).`)
      }
    })
  }

  function deleteSlot(slotId: string) {
    startTransition(async () => {
      const res = await deleteDeck(slotId)
      if (res.ok) {
        if (activeSlotId === slotId) newDeck()
        setStatusMsg('Deck deleted.')
        router.refresh()
      } else {
        setStatusMsg('Delete failed.')
      }
    })
  }

  function onDragStartCard(e: React.DragEvent, id: string) {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'copy'
  }
  function onDragOverBar(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }
  function onDropOnBar(e: React.DragEvent) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) addCard(id)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 text-zinc-100">
      <header className="mb-4 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Alpha Deck Builder</h1>
        <p className="text-sm opacity-70">
          Best on desktop — drag cards up to add. Mobile: tap to add.
        </p>
      </header>

      <AlphaDeckBar
        deckIds={deckIds}
        cardById={cardById}
        deckName={deckName}
        visibleCount={visibleCount}
        isPending={isPending}
        statusMsg={statusMsg}
        onDeckNameChange={setDeckName}
        onChangeVisible={setVisibleCount}
        onRemoveAt={removeAt}
        onSave={saveCurrent}
        onNew={newDeck}
        onDragOver={onDragOverBar}
        onDrop={onDropOnBar}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section aria-label="Card inventory">
          <div className="mb-4 flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm">
              Type
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | AlphaTypeDb)}
                aria-label="Filter by card type"
                className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                {VALID_ALPHA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ALPHA_DB_TO_LABEL[t]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              Rarity
              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value as 'all' | AlphaRarity)}
                aria-label="Filter by rarity"
                className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                {ALL_RARITIES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name…"
              aria-label="Search cards by name"
              className="flex-1 min-w-[180px] rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm"
            />
          </div>
          <p className="mb-3 text-sm opacity-70">
            Showing {inventory.length} of {filteredAll.length} cards
            {overflow > 0 ? ` (${overflow} more — refine filters)` : ''}.
          </p>
          {inventory.length === 0 ? (
            <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center text-base opacity-70">
              No cards match. Try clearing filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inventory.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => onDragStartCard(e, card.id)}
                  onClick={() => addCard(card.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      addCard(card.id)
                    }
                  }}
                  className="cursor-grab active:cursor-grabbing"
                  role="button"
                  tabIndex={0}
                  aria-label={`Add ${card.name} to deck`}
                >
                  <AlphaCardFrame
                    rarity={card.rarity}
                    type={ALPHA_DB_TO_LABEL[card.type] as AlphaCardType}
                    name={card.name}
                    energy_cost={card.energy_cost}
                    attack={card.attack ?? undefined}
                    defense={card.defense ?? undefined}
                    effect_text={card.effect_text}
                    flavor_text={card.flavor_text ?? ''}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <AlphaDeckSlots
          savedDecks={savedDecks}
          activeSlotId={activeSlotId}
          isPending={isPending}
          onLoad={loadSlot}
          onDelete={deleteSlot}
        />
      </div>
    </main>
  )
}
