/**
 * Sprint 3 — Task 2: booster pack types.
 * Source: docs/VOIDEXA_GAMING_COMBINED_V3.md PART 5 (Booster packs).
 */

import type { GameCardRarity } from '@/lib/game/cards/index'

export type PackTier = 'standard' | 'premium' | 'legendary'

export interface PackDef {
  tier: PackTier
  name: string
  priceGhai: number
  cardCount: number
  /** Minimum-rarity schedule for the non-best slots. */
  baseSchedule: readonly GameCardRarity[]
  /** Rarity pool for the best (5th) slot — at least one must be drawn. */
  bestSlotPool: readonly GameCardRarity[]
  /** Flavor shown in the shop UI. */
  description: string
}

/**
 * Per-tier roll recipe. 5 cards each. The best slot always rolls from the
 * bestSlotPool (with a Mythic upgrade chance layered on top in rollPack).
 */
export const PACK_DEFS: Readonly<Record<PackTier, PackDef>> = {
  standard: {
    tier: 'standard',
    name: 'Standard Pack',
    priceGhai: 100,
    cardCount: 5,
    baseSchedule: ['common', 'common', 'common', 'common'],
    bestSlotPool: ['uncommon', 'rare', 'legendary'],
    description: '4 Common + 1 Uncommon or better. Volume product — buy often, hope always.',
  },
  premium: {
    tier: 'premium',
    name: 'Premium Pack',
    priceGhai: 300,
    cardCount: 5,
    baseSchedule: ['common', 'common', 'common', 'uncommon'],
    bestSlotPool: ['rare', 'legendary'],
    description: '3 Common + 1 Uncommon + 1 Rare or better. Step up when GHAI allows.',
  },
  legendary: {
    tier: 'legendary',
    name: 'Legendary Pack',
    priceGhai: 1000,
    cardCount: 5,
    baseSchedule: ['uncommon', 'uncommon', 'rare', 'rare'],
    bestSlotPool: ['legendary'],
    description: '2 Uncommon + 2 Rare + 1 Legendary chance. End-game pulls.',
  },
}

export const PACK_TIERS: readonly PackTier[] = ['standard', 'premium', 'legendary']

/** Global Mythic upgrade chance on the best slot of any pack. */
export const MYTHIC_CHANCE = 0.001

export interface PackRollResult {
  tier: PackTier
  cardIds: string[]
  rarities: GameCardRarity[]
  /** True if the best slot became a Mythic. */
  mythicPulled: boolean
  mythicCardId?: string
}

/** Mythic supply snapshot for the UI. */
export interface MythicSupply {
  cardId: string
  totalMinted: number
  pulled: number
}
