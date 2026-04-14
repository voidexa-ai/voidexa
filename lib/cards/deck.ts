/**
 * lib/cards/deck.ts
 *
 * Deck management. Mirrors master plan Part 8 "Deck Rules":
 *   - Deck size: 20 cards
 *   - Max 2 copies of same card (Legendary: max 1)
 *   - Starting hand: 5 cards, draw 1 per turn
 *   - Max 7 in hand (excess discarded)
 *
 * All mutators are IMMUTABLE — return new Deck objects, never mutate in place.
 * Validation and drawing use the provided card catalogue (keyed by card id) so
 * this module doesn't need to know about any specific card content.
 */

import { CardRarity, type Card } from "../game/cards";

export const DECK_SIZE = 20;
export const MAX_COPIES_DEFAULT = 2;
export const MAX_COPIES_LEGENDARY = 1;
export const STARTING_HAND_SIZE = 5;
export const MAX_HAND_SIZE = 7;

/** A deck is a flat list of card ids (duplicates allowed up to per-rarity caps). */
export interface Deck {
  name: string;
  /** Ordered list of card ids. Order is preserved so autosaves and UI are stable. */
  cardIds: string[];
}

/** Lookup type: card catalogue, keyed by `card.id`. */
export type CardCatalogue = Readonly<Record<string, Card>>;

/** Maximum allowed copies of a card in one deck, given its rarity. */
export function maxCopies(rarity: CardRarity): number {
  return rarity === CardRarity.Legendary ? MAX_COPIES_LEGENDARY : MAX_COPIES_DEFAULT;
}

// ── CRUD ────────────────────────────────────────────────────────────────────

export function createDeck(name: string = "New Deck"): Deck {
  return { name, cardIds: [] };
}

/**
 * Add one copy of `cardId` to the deck.
 * Throws if:
 *   - the deck is already full (>= DECK_SIZE)
 *   - the card isn't in the catalogue
 *   - adding would exceed the per-rarity copy cap
 */
export function addCard(
  deck: Deck,
  cardId: string,
  catalogue: CardCatalogue,
): Deck {
  const card = catalogue[cardId];
  if (!card) throw new Error(`Unknown card: ${cardId}`);
  if (deck.cardIds.length >= DECK_SIZE) {
    throw new Error(`Deck is full (${DECK_SIZE}/${DECK_SIZE})`);
  }
  const currentCopies = deck.cardIds.filter((id) => id === cardId).length;
  const limit = maxCopies(card.rarity);
  if (currentCopies >= limit) {
    throw new Error(
      `Cannot add more copies of "${card.name}" (limit ${limit} for ${card.rarity})`,
    );
  }
  return { ...deck, cardIds: [...deck.cardIds, cardId] };
}

/**
 * Remove ONE copy of `cardId` from the deck.
 * No-op if the card isn't present — returns the same deck reference so callers
 * can detect "nothing to remove".
 */
export function removeCard(deck: Deck, cardId: string): Deck {
  const idx = deck.cardIds.indexOf(cardId);
  if (idx < 0) return deck;
  const next = [...deck.cardIds];
  next.splice(idx, 1);
  return { ...deck, cardIds: next };
}

// ── validation ──────────────────────────────────────────────────────────────

export interface DeckValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a deck against all Part 8 rules. Returns both the boolean and the
 * list of violations so the UI can surface every issue at once instead of
 * trickling them.
 */
export function isValidDeck(
  deck: Deck,
  catalogue: CardCatalogue,
): DeckValidationResult {
  const errors: string[] = [];

  if (deck.cardIds.length !== DECK_SIZE) {
    errors.push(
      `Deck must contain exactly ${DECK_SIZE} cards (has ${deck.cardIds.length})`,
    );
  }

  // Unknown cards + per-card copy limits.
  const counts = new Map<string, number>();
  for (const id of deck.cardIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  for (const [id, count] of counts) {
    const card = catalogue[id];
    if (!card) {
      errors.push(`Unknown card in deck: ${id}`);
      continue;
    }
    const limit = maxCopies(card.rarity);
    if (count > limit) {
      errors.push(
        `"${card.name}" has ${count} copies (limit ${limit} for ${card.rarity})`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

// ── drawing ─────────────────────────────────────────────────────────────────

/**
 * Draw a random hand from the deck. Returns the drawn card ids and the
 * remaining draw pile (not mutated — both are new arrays).
 *
 * @param deck      Source deck.
 * @param handSize  Number of cards to draw. Default `STARTING_HAND_SIZE` (5).
 *                  Clamped to deck length.
 * @param rng       Injectable RNG returning [0,1). Default Math.random.
 */
export function getHandFromDeck(
  deck: Deck,
  handSize: number = STARTING_HAND_SIZE,
  rng: () => number = Math.random,
): { hand: string[]; remaining: string[] } {
  if (handSize < 0) throw new Error("handSize must be >= 0");
  if (handSize > MAX_HAND_SIZE) {
    throw new Error(`handSize ${handSize} exceeds MAX_HAND_SIZE ${MAX_HAND_SIZE}`);
  }

  const pool = [...deck.cardIds];
  const drawCount = Math.min(handSize, pool.length);
  const hand: string[] = [];

  for (let i = 0; i < drawCount; i++) {
    const idx = Math.floor(rng() * pool.length);
    hand.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return { hand, remaining: pool };
}

/**
 * Draw 1 additional card from `remaining`. Useful for per-turn draw.
 * Returns null if the draw pile is empty.
 */
export function drawOne(
  remaining: ReadonlyArray<string>,
  rng: () => number = Math.random,
): { drawn: string | null; remaining: string[] } {
  if (remaining.length === 0) return { drawn: null, remaining: [] };
  const pool = [...remaining];
  const idx = Math.floor(rng() * pool.length);
  const drawn = pool[idx];
  pool.splice(idx, 1);
  return { drawn, remaining: pool };
}
