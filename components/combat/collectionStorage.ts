/**
 * components/combat/collectionStorage.ts
 *
 * Tiny localStorage adapter for the player's CardCollection + saved decks.
 * Lives in the browser only — server-side imports must guard with `typeof window`.
 */

import type { CardCollection } from '@/lib/cards/collection'
import { createCollection } from '@/lib/cards/collection'
import { STARTER_CARDS } from '@/lib/cards/starter_set'
import type { Deck } from '@/lib/cards/deck'

const COLLECTION_KEY = 'voidexa.cards.collection.v1'
const DECKS_KEY = 'voidexa.cards.decks.v1'
const ACTIVE_DECK_KEY = 'voidexa.cards.activeDeck.v1'

// ── collection ────────────────────────────────────────────────────────────

export function loadCollection(): CardCollection {
  if (typeof window === 'undefined') return seedCollection()
  try {
    const raw = window.localStorage.getItem(COLLECTION_KEY)
    if (!raw) return seedCollection()
    const parsed = JSON.parse(raw) as CardCollection
    if (
      parsed &&
      typeof parsed.dust === 'number' &&
      parsed.cards &&
      typeof parsed.cards === 'object'
    ) {
      return parsed
    }
  } catch {
    /* fall through */
  }
  return seedCollection()
}

export function saveCollection(c: CardCollection): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(c))
  } catch {
    /* localStorage full or disabled — silent */
  }
}

/**
 * Generous starter pile so a fresh player can immediately try the deck builder.
 * Gives 2 of every Common, 1 of every Uncommon, and 200 starter dust.
 */
function seedCollection(): CardCollection {
  let c = createCollection()
  c = { ...c, dust: 200 }
  const cards: Record<string, number> = {}
  for (const card of STARTER_CARDS) {
    if (card.rarity === 'Common') cards[card.id] = 2
    else if (card.rarity === 'Uncommon') cards[card.id] = 1
  }
  return { dust: 200, cards }
}

// ── decks ─────────────────────────────────────────────────────────────────

export function loadDecks(): Deck[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(DECKS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
  } catch {
    /* */
  }
  return []
}

export function saveDecks(decks: Deck[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(DECKS_KEY, JSON.stringify(decks))
  } catch {
    /* */
  }
}

export function loadActiveDeckName(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACTIVE_DECK_KEY)
}

export function saveActiveDeckName(name: string | null): void {
  if (typeof window === 'undefined') return
  if (name == null) window.localStorage.removeItem(ACTIVE_DECK_KEY)
  else window.localStorage.setItem(ACTIVE_DECK_KEY, name)
}

// ── reset (for debugging / tests) ─────────────────────────────────────────

export function clearAll(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(COLLECTION_KEY)
  window.localStorage.removeItem(DECKS_KEY)
  window.localStorage.removeItem(ACTIVE_DECK_KEY)
}
