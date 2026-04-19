/**
 * lib/game/cards.ts
 *
 * Card system foundation for duels / card combat (Phase 10 per master plan,
 * but the data shape is locked here so Phase 3 code can import types cleanly).
 *
 * Master plan references:
 *   - Rarities (line 199): Common → Uncommon → Rare → Epic → Legendary
 *   - Disenchant dust values (line 484)
 *   - Fusion: 2 same-rarity → 1 next-rarity (lines 489–492)
 *   - Deck cap: max 2 copies of same card, max 1 for Legendary (line 472)
 *   - Energy cost bands (line 421)
 */

export enum CardRarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Epic = "Epic",
  Legendary = "Legendary",
  Mythic = "Mythic",
}

export enum CardCategory {
  Attack = "Attack",
  Defense = "Defense",
  Tactical = "Tactical",
  Deployment = "Deployment",
  Alien = "Alien",
}

/** Rarity ladder (low → high). Used for fusion & comparisons. */
export const RARITY_ORDER: readonly CardRarity[] = [
  CardRarity.Common,
  CardRarity.Uncommon,
  CardRarity.Rare,
  CardRarity.Epic,
  CardRarity.Legendary,
  CardRarity.Mythic,
];

export interface Card {
  /** Unique identifier — slug or UUID. */
  id: string;
  name: string;
  rarity: CardRarity;
  category: CardCategory;
  /** Energy cost to play. See ENERGY_COST_RANGE by rarity. */
  energyCost: number;
  /** One-line explanation shown on the card face. */
  description: string;
  /** Mechanical effect text — what the card actually does. */
  primaryEffect: string;
  /** Optional drawback / risk. Required for Alien category; optional elsewhere. */
  backfireEffect?: string;
}

/**
 * Dust values from disenchanting a card. Exported for UI tooltips too.
 * Master plan line 484: Common 5 / Uncommon 20 / Rare 100 / Epic 400 / Legendary 1600.
 */
export const DUST_VALUES: Readonly<Record<CardRarity, number>> = {
  [CardRarity.Common]: 5,
  [CardRarity.Uncommon]: 20,
  [CardRarity.Rare]: 100,
  [CardRarity.Epic]: 400,
  [CardRarity.Legendary]: 1600,
  [CardRarity.Mythic]: 3200,
};

/**
 * Dust cost to craft a specific card.
 * Master plan line 487: Common 30 / Uncommon 100 / Rare 400 / Epic 1600 / Legendary 6400.
 */
export const CRAFT_COSTS: Readonly<Record<CardRarity, number>> = {
  [CardRarity.Common]: 30,
  [CardRarity.Uncommon]: 100,
  [CardRarity.Rare]: 400,
  [CardRarity.Epic]: 1600,
  [CardRarity.Legendary]: 6400,
  [CardRarity.Mythic]: 12800,
};

/**
 * Energy cost range per rarity (inclusive). Cards must fall within.
 * Master plan line 421.
 */
export const ENERGY_COST_RANGE: Readonly<Record<CardRarity, { min: number; max: number }>> = {
  [CardRarity.Common]:    { min: 1, max: 2 },
  [CardRarity.Uncommon]:  { min: 2, max: 3 },
  [CardRarity.Rare]:      { min: 3, max: 4 },
  [CardRarity.Epic]:      { min: 4, max: 5 },
  [CardRarity.Legendary]: { min: 5, max: 7 },
  [CardRarity.Mythic]:    { min: 6, max: 10 },
};

/**
 * Per-deck copy cap. Master plan line 472.
 * Max 2 copies of a normal card. Legendary cards cap at 1.
 */
export function maxCopiesInDeck(rarity: CardRarity): number {
  if (rarity === CardRarity.Legendary || rarity === CardRarity.Mythic) return 1;
  return 2;
}

/** Returns the disenchant dust value for the card's rarity. */
export function calculateDust(rarity: CardRarity): number {
  return DUST_VALUES[rarity];
}

/**
 * Fusion requires both cards to share a rarity AND not be Legendary
 * (Legendary has no higher tier to fuse into).
 */
export function canFuse(card1: Card, card2: Card): boolean {
  if (card1.rarity !== card2.rarity) return false;
  // Legendary is the crafting ceiling (no fusion into Mythic — Mythic is
  // library-only / drop-only). Mythic itself has no higher tier.
  if (card1.rarity === CardRarity.Legendary) return false;
  if (card1.rarity === CardRarity.Mythic) return false;
  return true;
}

/**
 * Returns the rarity one step above `rarity`, or null for Legendary.
 */
export function nextRarity(rarity: CardRarity): CardRarity | null {
  const i = RARITY_ORDER.indexOf(rarity);
  if (i < 0 || i === RARITY_ORDER.length - 1) return null;
  return RARITY_ORDER[i + 1];
}

/**
 * Returns true iff `card.energyCost` is inside the band defined for its rarity.
 * Useful for content validation during card import / DB seed.
 */
export function isValidEnergyCost(card: Pick<Card, "rarity" | "energyCost">): boolean {
  const band = ENERGY_COST_RANGE[card.rarity];
  return card.energyCost >= band.min && card.energyCost <= band.max;
}
