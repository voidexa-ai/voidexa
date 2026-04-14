/**
 * lib/cards/collection.ts
 *
 * Player card collection: the bag of every card a player owns, plus dust.
 * Operations: add / disenchant / craft / fuse.
 *
 * Master plan Part 8 (Crafting / Disenchant):
 *   - Disenchant dust: Common 5 / Uncommon 20 / Rare 100 / Epic 400 / Legendary 1600
 *   - Craft cost:      Common 30 / Uncommon 100 / Rare 400 / Epic 1600 / Legendary 6400
 *   - Fusion: 2 same-rarity cards → 1 random card of next rarity
 *
 * Storage shape is a flat map of cardId → count. Dust is a single integer
 * kept on the Collection. Every mutator returns a fresh Collection (immutable).
 */

import {
  CardRarity,
  CRAFT_COSTS,
  DUST_VALUES,
  RARITY_ORDER,
  calculateDust,
  canFuse,
  nextRarity,
  type Card,
} from "../game/cards";
import type { CardCatalogue } from "./deck";

export interface CardCollection {
  /** cardId → copy count */
  cards: Readonly<Record<string, number>>;
  /** Crafting currency. Accumulates from disenchanting. */
  dust: number;
}

export function createCollection(): CardCollection {
  return { cards: {}, dust: 0 };
}

/** Returns how many copies of `cardId` the player owns. */
export function ownedCount(collection: CardCollection, cardId: string): number {
  return collection.cards[cardId] ?? 0;
}

// ── add ─────────────────────────────────────────────────────────────────────

/**
 * Add `count` copies of `cardId` to the collection.
 * Default `count` is 1.
 */
export function addCardToCollection(
  collection: CardCollection,
  cardId: string,
  count: number = 1,
): CardCollection {
  if (count <= 0) throw new Error("count must be > 0");
  const prev = ownedCount(collection, cardId);
  return {
    ...collection,
    cards: { ...collection.cards, [cardId]: prev + count },
  };
}

// ── disenchant ──────────────────────────────────────────────────────────────

export interface DisenchantResult {
  collection: CardCollection;
  /** Dust granted by this specific disenchant. */
  dustGained: number;
}

/**
 * Disenchant 1 copy of `cardId`. Throws if the player owns zero copies.
 * Dust value is determined by the card's rarity.
 */
export function disenchantCard(
  collection: CardCollection,
  cardId: string,
  catalogue: CardCatalogue,
): DisenchantResult {
  const card = catalogue[cardId];
  if (!card) throw new Error(`Unknown card: ${cardId}`);
  const owned = ownedCount(collection, cardId);
  if (owned <= 0) {
    throw new Error(`Cannot disenchant "${card.name}" — none owned`);
  }

  const dustGained = calculateDust(card.rarity);
  const nextCount = owned - 1;
  const nextCards = { ...collection.cards };
  if (nextCount > 0) nextCards[cardId] = nextCount;
  else delete nextCards[cardId];

  return {
    collection: {
      cards: nextCards,
      dust: collection.dust + dustGained,
    },
    dustGained,
  };
}

// ── craft ──────────────────────────────────────────────────────────────────

/**
 * Craft 1 copy of `cardId` by spending dust from the collection.
 * Throws if the player doesn't have enough dust.
 */
export function craftCard(
  collection: CardCollection,
  cardId: string,
  catalogue: CardCatalogue,
): CardCollection {
  const card = catalogue[cardId];
  if (!card) throw new Error(`Unknown card: ${cardId}`);
  const cost = CRAFT_COSTS[card.rarity];
  if (collection.dust < cost) {
    throw new Error(
      `Not enough dust to craft "${card.name}": need ${cost}, have ${collection.dust}`,
    );
  }
  const prev = ownedCount(collection, cardId);
  return {
    dust: collection.dust - cost,
    cards: { ...collection.cards, [cardId]: prev + 1 },
  };
}

// ── fuse ───────────────────────────────────────────────────────────────────

export interface FuseResult {
  collection: CardCollection;
  /** The card id produced by the fusion (null if the inputs were invalid). */
  resultCardId: string;
  /** Rarity of the result. */
  resultRarity: CardRarity;
}

export interface FuseOptions {
  /** Seeded RNG for deterministic tests. Defaults to Math.random. */
  rng?: () => number;
}

/**
 * Fuse two cards of the same rarity into one random card of the next rarity.
 * Both inputs must be:
 *   - owned by the player (count >= 1 each, or count >= 2 if same card)
 *   - the same rarity
 *   - non-Legendary (no tier above)
 *
 * The result is picked uniformly from every card in `catalogue` whose
 * rarity === nextRarity(input.rarity). Caller is expected to pass a catalogue
 * that contains at least one card at the next rarity.
 */
export function fuseCards(
  collection: CardCollection,
  cardId1: string,
  cardId2: string,
  catalogue: CardCatalogue,
  options: FuseOptions = {},
): FuseResult {
  const card1 = catalogue[cardId1];
  const card2 = catalogue[cardId2];
  if (!card1) throw new Error(`Unknown card: ${cardId1}`);
  if (!card2) throw new Error(`Unknown card: ${cardId2}`);
  if (!canFuse(card1, card2)) {
    throw new Error(
      `Cannot fuse "${card1.name}" (${card1.rarity}) with "${card2.name}" (${card2.rarity}) — same rarity required, non-Legendary`,
    );
  }

  // Ownership check — supports fusing 2 copies of the same card.
  if (cardId1 === cardId2) {
    if (ownedCount(collection, cardId1) < 2) {
      throw new Error(`Need 2 copies of "${card1.name}" to fuse`);
    }
  } else {
    if (ownedCount(collection, cardId1) < 1) {
      throw new Error(`Missing copy: ${card1.name}`);
    }
    if (ownedCount(collection, cardId2) < 1) {
      throw new Error(`Missing copy: ${card2.name}`);
    }
  }

  const targetRarity = nextRarity(card1.rarity);
  if (!targetRarity) {
    throw new Error(`No next rarity above ${card1.rarity}`);
  }

  // Pool of candidate result cards (any card of the target rarity).
  const pool = Object.values(catalogue).filter(
    (c): c is Card => c.rarity === targetRarity,
  );
  if (pool.length === 0) {
    throw new Error(`No cards of rarity ${targetRarity} in catalogue`);
  }
  const rng = options.rng ?? Math.random;
  const picked = pool[Math.floor(rng() * pool.length)];

  // Burn the inputs, grant the output.
  const nextCards: Record<string, number> = { ...collection.cards };
  const burn = (id: string) => {
    const n = (nextCards[id] ?? 0) - 1;
    if (n > 0) nextCards[id] = n;
    else delete nextCards[id];
  };
  burn(cardId1);
  burn(cardId2);
  nextCards[picked.id] = (nextCards[picked.id] ?? 0) + 1;

  return {
    collection: { ...collection, cards: nextCards },
    resultCardId: picked.id,
    resultRarity: targetRarity,
  };
}

// ── aggregates ─────────────────────────────────────────────────────────────

/**
 * Returns the total potential dust if every card in the collection were
 * disenchanted. Useful for the "Manage Dust" screen.
 */
export function totalDustValue(
  collection: CardCollection,
  catalogue: CardCatalogue,
): number {
  let sum = 0;
  for (const [id, count] of Object.entries(collection.cards)) {
    const card = catalogue[id];
    if (!card) continue;
    sum += DUST_VALUES[card.rarity] * count;
  }
  return sum;
}

/**
 * Returns how many unique cards the player owns at each rarity.
 */
export function uniqueByRarity(
  collection: CardCollection,
  catalogue: CardCatalogue,
): Record<CardRarity, number> {
  const out = Object.fromEntries(
    RARITY_ORDER.map((r) => [r, 0]),
  ) as Record<CardRarity, number>;
  for (const id of Object.keys(collection.cards)) {
    const card = catalogue[id];
    if (card) out[card.rarity] += 1;
  }
  return out;
}
