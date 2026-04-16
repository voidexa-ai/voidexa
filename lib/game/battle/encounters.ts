/**
 * Phase 4a — PvE encounter definitions. 5 tiers + Kestrel Reclaimer boss.
 * Source of truth: docs/VOIDEXA_GAMING_COMBINED_V3.md (PART 5 baseline cards,
 * PART 6 battle engine).
 */

import { CARD_TEMPLATES, type CardTemplate, type GameCardRarity } from '../cards/index'

export type PveTierId = 1 | 2 | 3 | 4 | 5

export interface PveTierDef {
  id: PveTierId
  name: string
  zone: string
  hull: number
  deckSize: number
  maxDrones: number
  /** Allowed rarities when building this tier's deck. */
  allowedRarities: readonly GameCardRarity[]
  /** If true the AI will weave status applies into openings. */
  usesStatuses: boolean
  /** If true AI ignores safety priorities and always plays finishers. */
  aggressive: boolean
}

export const PVE_TIERS: Readonly<Record<PveTierId, PveTierDef>> = {
  1: { id: 1, name: 'Core Patrol',   zone: 'Core',      hull: 60,  deckSize: 12, maxDrones: 0, allowedRarities: ['common'],                              usesStatuses: false, aggressive: false },
  2: { id: 2, name: 'Inner Scout',   zone: 'Inner',     hull: 80,  deckSize: 16, maxDrones: 1, allowedRarities: ['common', 'uncommon'],                  usesStatuses: false, aggressive: false },
  3: { id: 3, name: 'Mid Enforcer',  zone: 'Mid Ring',  hull: 100, deckSize: 20, maxDrones: 2, allowedRarities: ['common', 'uncommon', 'rare'],          usesStatuses: true,  aggressive: false },
  4: { id: 4, name: 'Outer Marauder',zone: 'Outer',     hull: 120, deckSize: 20, maxDrones: 3, allowedRarities: ['uncommon', 'rare', 'legendary'],       usesStatuses: true,  aggressive: false },
  5: { id: 5, name: 'Deep Void Prowler', zone: 'Deep Void', hull: 150, deckSize: 20, maxDrones: 4, allowedRarities: ['rare', 'legendary'],               usesStatuses: true,  aggressive: true  },
}

// ----------------------------------------------------------------------------
// Deck builder
// ----------------------------------------------------------------------------

/**
 * Builds a deterministic enemy deck of size `deckSize` using only templates
 * from `allowedRarities`. Extras repeat (up to 2 copies). Falls back to common
 * templates if the rarity filter produces too few cards.
 */
export function buildEnemyDeck(tier: PveTierDef, seed = 0): CardTemplate[] {
  const rarityPool = CARD_TEMPLATES.filter(c => tier.allowedRarities.includes(c.rarity))
  const pool = rarityPool.length > 0 ? rarityPool : [...CARD_TEMPLATES]
  // Separate drones vs non-drones so we can cap drones without locking the loop.
  const nonDrones = pool.filter(c => c.type !== 'drone')
  const drones = pool.filter(c => c.type === 'drone').slice(0, tier.maxDrones)
  // Ensure there is always *something* non-drone to pick from.
  const effective = nonDrones.length > 0
    ? [...nonDrones, ...drones]
    : [...CARD_TEMPLATES.filter(c => c.type !== 'drone'), ...drones]

  const deck: CardTemplate[] = []
  const rng = mulberry32(seed + tier.id)
  const usage = new Map<string, number>()
  const maxPerCard = Math.max(2, Math.ceil(tier.deckSize / Math.max(1, effective.length)))

  let guard = 0
  const guardMax = tier.deckSize * 50 // safety fuse
  while (deck.length < tier.deckSize && guard < guardMax) {
    guard++
    const pick = effective[Math.floor(rng() * effective.length) % effective.length]
    const seen = usage.get(pick.id) ?? 0
    if (seen >= maxPerCard) continue
    deck.push(pick)
    usage.set(pick.id, seen + 1)
  }
  return deck
}

// ----------------------------------------------------------------------------
// Boss: The Kestrel Reclaimer
// ----------------------------------------------------------------------------

export const KESTREL_HULL = 140

/** Three unique boss-only cards, not in the player pool. */
export const KESTREL_UNIQUE_CARDS: readonly CardTemplate[] = [
  {
    id: 'kestrel_mag_clamp',
    name: 'Mag Clamp',
    type: 'defense',
    rarity: 'legendary',
    cost: 2,
    stats: { block: 14 },
    abilityText: 'Gain 14 Block. When you deploy a drone, gain 4 Block next turn.',
    flavor: 'Salvage tether repurposed as a hull anchor.',
    faction: 'void',
    shipClassRestriction: null,
  },
  {
    id: 'kestrel_salvage_sweep',
    name: 'Salvage Sweep',
    type: 'ai',
    rarity: 'legendary',
    cost: 3,
    stats: { apply: ['jam'], draw: 1 },
    abilityText: 'Apply Jam. Draw 1.',
    flavor: 'Scanner beam tagged for plunder.',
    faction: 'void',
    shipClassRestriction: null,
  },
  {
    id: 'kestrel_hull_breach',
    name: 'Hull Breach',
    type: 'weapon',
    rarity: 'legendary',
    cost: 4,
    stats: { damage: 18, conditional: 'ignore_half_block' },
    abilityText: 'Deal 18. Ignore half of target Block.',
    flavor: 'Old pre-war breaching charge. Still works.',
    faction: 'void',
    shipClassRestriction: null,
  },
] as const

export type KestrelPhase = 1 | 2 | 3

export interface KestrelPhaseDef {
  phase: KestrelPhase
  hullMin: number
  hullMax: number
  description: string
  /** Turns between signature drone deploys. 0 = never. */
  droneCadence: number
  /** Plays this many cards per turn. */
  cardsPerTurn: number
}

export const KESTREL_PHASES: readonly KestrelPhaseDef[] = [
  { phase: 1, hullMin: KESTREL_HULL * 0.7, hullMax: KESTREL_HULL,      description: 'Standard play.',                         droneCadence: 0, cardsPerTurn: 1 },
  { phase: 2, hullMin: KESTREL_HULL * 0.3, hullMax: KESTREL_HULL * 0.7, description: 'Signature drone every 3 turns.',        droneCadence: 3, cardsPerTurn: 1 },
  { phase: 3, hullMin: 0,                   hullMax: KESTREL_HULL * 0.3, description: 'Desperate mode — two cards per turn.', droneCadence: 2, cardsPerTurn: 2 },
]

export function kestrelPhaseForHull(hull: number): KestrelPhaseDef {
  for (const p of KESTREL_PHASES) {
    if (hull > p.hullMin && hull <= p.hullMax) return p
  }
  return KESTREL_PHASES[KESTREL_PHASES.length - 1]
}

/**
 * Kestrel deck: 20 cards mixing the 3 unique boss cards with rare+legendary
 * staples. +1 energy/turn passive is applied by the caller when stepping turns
 * (not in the data itself).
 */
export function buildKestrelDeck(): CardTemplate[] {
  const deck: CardTemplate[] = []
  // 2 copies of each unique boss card.
  KESTREL_UNIQUE_CARDS.forEach(c => { deck.push(c, c) })
  const staples = CARD_TEMPLATES.filter(c => c.rarity === 'rare' || c.rarity === 'legendary')
  let i = 0
  const usage = new Map<string, number>()
  while (deck.length < 20 && staples.length > 0) {
    const pick = staples[i % staples.length]
    const seen = usage.get(pick.id) ?? 0
    if (seen < 2) {
      deck.push(pick)
      usage.set(pick.id, seen + 1)
    }
    i++
    if (i > staples.length * 4) break // safety
  }
  // Pad with common if still short.
  if (deck.length < 20) {
    const commons = CARD_TEMPLATES.filter(c => c.rarity === 'common')
    let j = 0
    while (deck.length < 20 && commons.length > 0) {
      deck.push(commons[j % commons.length])
      j++
    }
  }
  return deck
}

export interface EncounterConfig {
  hull: number
  deck: CardTemplate[]
  tier: PveTierDef | null
  isBoss: boolean
  /** Extra energy added each turn start. Kestrel gets +1. */
  bonusEnergyPerTurn: number
}

export function makeTierEncounter(tierId: PveTierId, seed = 0): EncounterConfig {
  const tier = PVE_TIERS[tierId]
  return {
    hull: tier.hull,
    deck: buildEnemyDeck(tier, seed),
    tier,
    isBoss: false,
    bonusEnergyPerTurn: 0,
  }
}

export function makeKestrelEncounter(): EncounterConfig {
  return {
    hull: KESTREL_HULL,
    deck: buildKestrelDeck(),
    tier: null,
    isBoss: true,
    bonusEnergyPerTurn: 1,
  }
}

function mulberry32(seed: number) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
