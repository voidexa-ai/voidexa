/**
 * Sprint 3 — Task 3: unified loot table.
 *
 * One function `rollLootCard(source, tier, seed)` returns a card drop (or null
 * for no drop). Every gameplay results screen calls this so drop rates stay
 * centralised and testable.
 *
 * Seed determinism: we hash the source_id into an integer RNG seed so the
 * same results screen always yields the same card — no "re-roll on re-render".
 */

import { ALL_CARDS } from '@/lib/game/cards/library'
import type { CardTemplate, GameCardRarity } from '@/lib/game/cards/index'

export type LootSource = 'mission' | 'speedrun' | 'hauling' | 'battle'

/**
 * Tier input, normalised by each caller:
 *   missions/speedrun/hauling → 'bronze' | 'silver' | 'gold'
 *   battle → 'tier_1' … 'tier_5' | 'kestrel' | 'lantern_auditor' | 'varka' |
 *            'choir_sight' | 'patient_wreck'
 */
export type LootTier = string

export interface LootResult {
  card: CardTemplate
  rarity: GameCardRarity
}

export interface DropSchedule {
  /** Overall chance of getting a card at all. */
  dropChance: number
  /** Weighted rarity pool for when a drop happens. */
  rarityWeights: Partial<Record<GameCardRarity, number>>
}

// ---------------------------------------------------------------------------
// Per-source × per-tier schedule.
// ---------------------------------------------------------------------------

const MISSION_SCHEDULE: Record<string, DropSchedule> = {
  bronze: { dropChance: 0.20, rarityWeights: { common: 1 } },
  silver: { dropChance: 0.40, rarityWeights: { common: 0.6, uncommon: 0.4 } },
  gold:   { dropChance: 0.65, rarityWeights: { uncommon: 0.6, rare: 0.4 } },
}

const SPEEDRUN_SCHEDULE: Record<string, DropSchedule> = {
  bronze: { dropChance: 0.15, rarityWeights: { common: 1 } },
  silver: { dropChance: 0.30, rarityWeights: { common: 0.6, uncommon: 0.4 } },
  gold:   { dropChance: 0.55, rarityWeights: { uncommon: 0.65, rare: 0.35 } },
}

const HAULING_SCHEDULE: Record<string, DropSchedule> = {
  bronze: { dropChance: 0.20, rarityWeights: { common: 1 } },
  silver: { dropChance: 0.35, rarityWeights: { common: 0.6, uncommon: 0.4 } },
  gold:   { dropChance: 0.50, rarityWeights: { uncommon: 0.6, rare: 0.4 } },
}

const BATTLE_SCHEDULE: Record<string, DropSchedule> = {
  tier_1: { dropChance: 0.80, rarityWeights: { common: 1 } },
  tier_2: { dropChance: 0.85, rarityWeights: { common: 0.6, uncommon: 0.4 } },
  tier_3: { dropChance: 0.88, rarityWeights: { common: 0.3, uncommon: 0.5, rare: 0.2 } },
  tier_4: { dropChance: 0.90, rarityWeights: { uncommon: 0.4, rare: 0.5, legendary: 0.1 } },
  tier_5: { dropChance: 0.90, rarityWeights: { uncommon: 0.2, rare: 0.55, legendary: 0.25 } },
  // Bosses drop guaranteed rare+; small mythic chance via the 0.001 layer.
  kestrel:         { dropChance: 1.0, rarityWeights: { rare: 0.6, legendary: 0.4 } },
  lantern_auditor: { dropChance: 1.0, rarityWeights: { uncommon: 0.4, rare: 0.6 } },
  varka:           { dropChance: 1.0, rarityWeights: { rare: 0.6, legendary: 0.4 } },
  choir_sight:     { dropChance: 1.0, rarityWeights: { rare: 0.5, legendary: 0.5 } },
  patient_wreck:   { dropChance: 1.0, rarityWeights: { legendary: 0.7, rare: 0.3 } },
}

const SCHEDULES: Record<LootSource, Record<string, DropSchedule>> = {
  mission:  MISSION_SCHEDULE,
  speedrun: SPEEDRUN_SCHEDULE,
  hauling:  HAULING_SCHEDULE,
  battle:   BATTLE_SCHEDULE,
}

/** Mythic chance from gameplay (separate from pack mythic chance — same rate). */
const GAMEPLAY_MYTHIC_CHANCE = 0.001

// ---------------------------------------------------------------------------
// Seed hashing + RNG.
// ---------------------------------------------------------------------------

function hashSeed(source: LootSource, tier: LootTier, seedKey: string): number {
  const s = `${source}:${tier}:${seedKey}`
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h
}

interface Rng { next(): number }

function mulberry32(seed: number): Rng {
  let s = seed >>> 0
  return {
    next() {
      s = (s + 0x6d2b79f5) >>> 0
      let t = s
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    },
  }
}

// ---------------------------------------------------------------------------
// Public API.
// ---------------------------------------------------------------------------

export interface LootRollInput {
  source: LootSource
  tier: LootTier
  /** Unique per-run id — used to seed the RNG. Same id → same drop. */
  seedKey: string
}

export function rollLootCard(input: LootRollInput): LootResult | null {
  const schedule = SCHEDULES[input.source]?.[input.tier]
  if (!schedule) return null

  const rng = mulberry32(hashSeed(input.source, input.tier, input.seedKey))

  // Step 1: drop check.
  if (rng.next() >= schedule.dropChance) return null

  // Step 2: Mythic layer (independent of schedule). Only gameplay mythic drop
  // if supply allows — this is enforced by the caller against Supabase.
  if (rng.next() < GAMEPLAY_MYTHIC_CHANCE) {
    const mythics = ALL_CARDS.filter(c => c.rarity === 'mythic')
    if (mythics.length > 0) {
      const pick = mythics[Math.floor(rng.next() * mythics.length)]
      return { card: pick, rarity: 'mythic' }
    }
  }

  // Step 3: pick rarity from weights.
  const rarity = pickWeighted(schedule.rarityWeights, rng)
  if (!rarity) return null

  // Step 4: pick a card of that rarity.
  const pool = ALL_CARDS.filter(c => c.rarity === rarity)
  if (pool.length === 0) return null
  const card = pool[Math.floor(rng.next() * pool.length)]
  return { card, rarity }
}

function pickWeighted(
  weights: Partial<Record<GameCardRarity, number>>,
  rng: Rng,
): GameCardRarity | null {
  const entries = Object.entries(weights) as [GameCardRarity, number][]
  const total = entries.reduce((s, [, w]) => s + w, 0)
  if (total <= 0) return null
  let pick = rng.next() * total
  for (const [rarity, weight] of entries) {
    pick -= weight
    if (pick <= 0) return rarity
  }
  return entries[entries.length - 1][0]
}

// Exports used by tests.
export const __internal = { SCHEDULES, hashSeed, mulberry32, GAMEPLAY_MYTHIC_CHANCE }
