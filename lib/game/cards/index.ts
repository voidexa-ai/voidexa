/**
 * lib/game/cards/index.ts — Phase 1 gaming card registry
 *
 * Source of truth: docs/VOIDEXA_GAMING_COMBINED_V2.md PART 5.
 *
 * NOTE: A separate pre-existing file `lib/game/cards.ts` hosts the older
 * combat system types (CardRarity/CardCategory enums) used under
 * `components/combat/*`. With tsconfig's bundler resolution and Node's
 * file-first lookup, `@/lib/game/cards` keeps resolving to `cards.ts`.
 * This baseline registry is intentionally accessed via an explicit path
 * (`@/lib/game/cards/index` or `@/lib/game/cards/baseline`) to avoid
 * breaking any of the 6 consumers of the older file.
 */

export type CardType =
  | 'weapon'
  | 'defense'
  | 'maneuver'
  | 'drone'
  | 'ai'
  | 'consumable'

export type GameCardRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'legendary'
  | 'mythic'
  | 'pioneer'

export type CardFaction = 'core' | 'pioneer' | 'void' | 'neutral'

export type ShipClassRestriction =
  | 'starter'
  | 'fighter'
  | 'hauler'
  | 'explorer'
  | 'salvager'
  | null

export type StatusEffect =
  | 'expose'
  | 'burn'
  | 'jam'
  | 'lock'
  | 'shielded'
  | 'overcharge'
  | 'drone_mark'
  | 'scrap'

export interface CardStats {
  damage?: number
  block?: number
  heal?: number
  draw?: number
  discard?: number
  energy?: number
  self_damage?: number
  absorb?: number
  splash?: number
  duration_turns?: number
  per_turn?: number
  apply?: StatusEffect[]
  remove?: StatusEffect[]
  evade?: boolean
  untargetable?: boolean
  exhaust?: boolean
  conditional?: string
  scaling?: string
}

export interface CardTemplate {
  id: string
  name: string
  type: CardType
  rarity: GameCardRarity
  cost: number
  stats: CardStats
  abilityText: string
  flavor?: string
  faction: CardFaction
  shipClassRestriction: ShipClassRestriction
}

export const CARD_TEMPLATES: readonly CardTemplate[] = [
  // ===== Weapons (6) =====
  {
    id: 'pulse_tap',
    name: 'Pulse Tap',
    type: 'weapon',
    rarity: 'common',
    cost: 1,
    stats: { damage: 6, draw: 1, conditional: 'target_exposed' },
    abilityText: 'Deal 6 damage. If target is Exposed, draw 1.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'rail_spike',
    name: 'Rail Spike',
    type: 'weapon',
    rarity: 'uncommon',
    cost: 2,
    stats: { damage: 10, apply: ['lock'] },
    abilityText: 'Deal 10 damage. Apply Lock.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'plasma_arc',
    name: 'Plasma Arc',
    type: 'weapon',
    rarity: 'uncommon',
    cost: 3,
    stats: { damage: 14, splash: 4 },
    abilityText: 'Deal 14 to target, 4 to adjacent.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'breach_cannon',
    name: 'Breach Cannon',
    type: 'weapon',
    rarity: 'rare',
    cost: 4,
    stats: { damage: 20, conditional: 'ignore_half_block' },
    abilityText: 'Deal 20. If target has Block, ignore half.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'nova_charge',
    name: 'Nova Charge',
    type: 'weapon',
    rarity: 'rare',
    cost: 5,
    stats: { damage: 8, scaling: 'plus_8_per_overcharge' },
    abilityText: 'Consume all Overcharge. Deal 8 + 8 per Overcharge.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'salvage_harpoon',
    name: 'Salvage Harpoon',
    type: 'weapon',
    rarity: 'uncommon',
    cost: 2,
    stats: { damage: 8, apply: ['scrap'], conditional: 'on_kill' },
    abilityText: 'Deal 8. If it kills, gain Scrap.',
    faction: 'core',
    shipClassRestriction: null,
  },

  // ===== Defense (4) =====
  {
    id: 'quick_shield',
    name: 'Quick Shield',
    type: 'defense',
    rarity: 'common',
    cost: 1,
    stats: { block: 6 },
    abilityText: 'Gain 6 Block.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'deflector_net',
    name: 'Deflector Net',
    type: 'defense',
    rarity: 'uncommon',
    cost: 2,
    stats: { block: 9, apply: ['shielded'] },
    abilityText: 'Gain 9 Block and Shielded.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'reactive_plating',
    name: 'Reactive Plating',
    type: 'defense',
    rarity: 'uncommon',
    cost: 3,
    stats: { block: 14, damage: 4, conditional: 'reflect_next_hit' },
    abilityText: 'Gain 14 Block. Deal 4 back on next hit.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'emergency_bulkhead',
    name: 'Emergency Bulkhead',
    type: 'defense',
    rarity: 'uncommon',
    cost: 0,
    stats: { block: 5, exhaust: true, conditional: 'hull_below_50' },
    abilityText: 'Exhaust. Gain 5 Block. Only below 50% hull.',
    faction: 'core',
    shipClassRestriction: null,
  },

  // ===== Maneuver (4) =====
  {
    id: 'strafe_burn',
    name: 'Strafe Burn',
    type: 'maneuver',
    rarity: 'common',
    cost: 1,
    stats: { evade: true, apply: ['expose'], conditional: 'next_weapon' },
    abilityText: 'Evade next attack. Next weapon applies Expose.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'hard_flip',
    name: 'Hard Flip',
    type: 'maneuver',
    rarity: 'uncommon',
    cost: 2,
    stats: { block: 5, draw: 2, discard: 1 },
    abilityText: 'Gain 5 Block. Draw 2. Discard 1.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'vector_cut',
    name: 'Vector Cut',
    type: 'maneuver',
    rarity: 'uncommon',
    cost: 2,
    stats: { conditional: 'move_first_next_turn', damage: 4 },
    abilityText: 'Move first next turn. Next attack +4.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'ghost_drift',
    name: 'Ghost Drift',
    type: 'maneuver',
    rarity: 'rare',
    cost: 3,
    stats: { untargetable: true, energy: -1 },
    abilityText: 'Untargetable until next action. Lose 1 energy next turn.',
    faction: 'core',
    shipClassRestriction: null,
  },

  // ===== Drone (4) =====
  {
    id: 'scout_drone',
    name: 'Scout Drone',
    type: 'drone',
    rarity: 'common',
    cost: 1,
    stats: { draw: 1, conditional: 'reveal_top_may_discard' },
    abilityText: 'Reveal top card; may discard.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'gun_drone',
    name: 'Gun Drone',
    type: 'drone',
    rarity: 'uncommon',
    cost: 3,
    stats: { per_turn: 4, duration_turns: 3 },
    abilityText: '4 damage each turn for 3 turns.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'repair_drone',
    name: 'Repair Drone',
    type: 'drone',
    rarity: 'uncommon',
    cost: 3,
    stats: { heal: 3, duration_turns: 3, per_turn: 3 },
    abilityText: 'Heal 3 hull for 3 turns.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'intercept_drone',
    name: 'Intercept Drone',
    type: 'drone',
    rarity: 'uncommon',
    cost: 2,
    stats: { absorb: 8 },
    abilityText: 'Absorbs next 8 damage.',
    faction: 'core',
    shipClassRestriction: null,
  },

  // ===== AI (4) =====
  {
    id: 'tactical_predict',
    name: 'Tactical Predict',
    type: 'ai',
    rarity: 'common',
    cost: 1,
    stats: { draw: 2, conditional: 'next_defense_costs_1_less' },
    abilityText: 'Draw 2. Next defense costs 1 less.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'hunter_logic',
    name: 'Hunter Logic',
    type: 'ai',
    rarity: 'uncommon',
    cost: 2,
    stats: { apply: ['drone_mark', 'expose'] },
    abilityText: 'Apply Drone Mark and Expose.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'overclock_core',
    name: 'Overclock Core',
    type: 'ai',
    rarity: 'rare',
    cost: 3,
    stats: { energy: 2, self_damage: 4 },
    abilityText: 'Gain 2 energy. Take 4 self-damage.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'battlefield_read',
    name: 'Battlefield Read',
    type: 'ai',
    rarity: 'rare',
    cost: 4,
    stats: { conditional: 'duplicate_next_2_cost_or_less_cards', duration_turns: 1 },
    abilityText: 'Duplicate next 2-cost-or-less card this turn.',
    faction: 'core',
    shipClassRestriction: null,
  },

  // ===== Consumable (4) =====
  {
    id: 'repair_foam',
    name: 'Repair Foam',
    type: 'consumable',
    rarity: 'common',
    cost: 1,
    stats: { heal: 7, exhaust: true },
    abilityText: 'Heal 7 hull. Exhaust.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'coolant_purge',
    name: 'Coolant Purge',
    type: 'consumable',
    rarity: 'uncommon',
    cost: 0,
    stats: { remove: ['burn', 'jam', 'lock'], draw: 1, exhaust: true },
    abilityText: 'Remove Burn/Jam/Lock. Draw 1. Exhaust.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'charge_cell',
    name: 'Charge Cell',
    type: 'consumable',
    rarity: 'uncommon',
    cost: 2,
    stats: { energy: 2, conditional: 'next_turn' },
    abilityText: 'Gain 2 energy next turn.',
    faction: 'core',
    shipClassRestriction: null,
  },
  {
    id: 'scrap_injector',
    name: 'Scrap Injector',
    type: 'consumable',
    rarity: 'uncommon',
    cost: 1,
    stats: { block: 10, draw: 1, conditional: 'consume_scrap' },
    abilityText: 'Consume Scrap: gain 10 Block and draw 1.',
    faction: 'core',
    shipClassRestriction: null,
  },
] as const

export const CARDS_BY_ID: Readonly<Record<string, CardTemplate>> = Object.freeze(
  CARD_TEMPLATES.reduce<Record<string, CardTemplate>>((acc, card) => {
    acc[card.id] = card
    return acc
  }, {})
)

export function getCardTemplate(id: string): CardTemplate | undefined {
  return CARDS_BY_ID[id]
}
