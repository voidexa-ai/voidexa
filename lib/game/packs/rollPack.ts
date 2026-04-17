/**
 * Sprint 3 — Task 2: pure pack-roll function.
 *
 * Deterministic given an RNG. No Supabase calls, no network. The caller
 * (server-side API route) handles Mythic supply decrement + card grants
 * after calling rollPack.
 *
 * If the roller selects a Mythic and the caller reports supply exhausted,
 * the caller calls `downgradeMythic` to coerce that card into a Legendary.
 */

import { ALL_CARDS, ALL_CARDS_BY_ID } from '@/lib/game/cards/library'
import type { CardTemplate, GameCardRarity } from '@/lib/game/cards/index'
import {
  MYTHIC_CHANCE,
  PACK_DEFS,
  type PackDef,
  type PackRollResult,
  type PackTier,
} from './types'

export interface PackRng {
  next(): number
}

/** Default RNG wrapping Math.random — tests pass a deterministic one. */
export const defaultRng: PackRng = { next: () => Math.random() }

export function rollPack(tier: PackTier, rng: PackRng = defaultRng): PackRollResult {
  const def = PACK_DEFS[tier]
  const rarities: GameCardRarity[] = []
  const cardIds: string[] = []

  // Base slots.
  for (const minRarity of def.baseSchedule) {
    const r = rollBaseSlot(minRarity, rng)
    rarities.push(r)
    cardIds.push(pickCardByRarity(r, rng))
  }

  // Best slot — with Mythic layer on top.
  const bestRoll = rollBestSlot(def, rng)
  rarities.push(bestRoll.rarity)
  cardIds.push(bestRoll.cardId)

  return {
    tier,
    cardIds,
    rarities,
    mythicPulled: bestRoll.rarity === 'mythic',
    mythicCardId: bestRoll.rarity === 'mythic' ? bestRoll.cardId : undefined,
  }
}

function rollBaseSlot(minRarity: GameCardRarity, rng: PackRng): GameCardRarity {
  // Base slots exactly match their scheduled rarity — no random upgrades here
  // (upgrade randomness lives in the best slot only).
  return minRarity
}

function rollBestSlot(def: PackDef, rng: PackRng): { rarity: GameCardRarity; cardId: string } {
  // Mythic chance first.
  if (rng.next() < MYTHIC_CHANCE) {
    const mythics = ALL_CARDS.filter(c => c.rarity === 'mythic')
    if (mythics.length > 0) {
      const pick = mythics[Math.floor(rng.next() * mythics.length)]
      return { rarity: 'mythic', cardId: pick.id }
    }
  }
  // Otherwise uniform within the pool.
  const rarity = def.bestSlotPool[Math.floor(rng.next() * def.bestSlotPool.length)]
  return { rarity, cardId: pickCardByRarity(rarity, rng) }
}

function pickCardByRarity(rarity: GameCardRarity, rng: PackRng): string {
  const pool = ALL_CARDS.filter(c => c.rarity === rarity)
  if (pool.length === 0) {
    // Fallback — shouldn't happen with the 257-card library.
    return ALL_CARDS[0].id
  }
  return pool[Math.floor(rng.next() * pool.length)].id
}

/**
 * Caller coerces a Mythic card into a random Legendary when the Mythic supply
 * is exhausted. Keeps the 5-card pack intact.
 */
export function downgradeMythic(rng: PackRng = defaultRng): { rarity: 'legendary'; cardId: string } {
  return { rarity: 'legendary', cardId: pickCardByRarity('legendary', rng) }
}

export function resolveCard(cardId: string): CardTemplate | undefined {
  return ALL_CARDS_BY_ID[cardId]
}

/** Deterministic RNG for tests — simple LCG seeded from an integer. */
export function seededRng(seed: number): PackRng {
  let s = seed >>> 0
  return {
    next() {
      s = (s * 1664525 + 1013904223) >>> 0
      return s / 0x100000000
    },
  }
}
