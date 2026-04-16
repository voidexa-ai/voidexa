/**
 * Sprint 1 — Task 3: four additional PvE bosses.
 * Source of truth: docs/gpt-outputs/GPT_BOSS_DESIGNS.md
 *
 * Each boss has:
 *   - Fixed hull + optional `bonusEnergyPerTurn` passive
 *   - 3–4 unique cards (NOT added to `CARD_TEMPLATES`, kept out of player pool)
 *   - A deck built from its unique cards padded with rarity-appropriate staples
 *
 * Boss-specific passives (Varka cost reductions, Patient Wreck replay, etc.)
 * are intentionally simplified to mechanics the generic engine already resolves
 * (damage, block, status application, draw, energy). The lore framing lives in
 * the card names + flavor text.
 */

import { CARD_TEMPLATES, type CardTemplate, type GameCardRarity } from '../cards/index'
import type { EncounterConfig } from './encounters'

export type BossId = 'kestrel' | 'lantern_auditor' | 'varka' | 'choir_sight' | 'patient_wreck'

export interface BossDef {
  id: BossId
  name: string
  zone: string
  tierLabel: string
  hull: number
  bonusEnergyPerTurn: number
  deckSize: number
  uniqueCards: readonly CardTemplate[]
  stapleRarities: readonly GameCardRarity[]
  summary: string
  reward: { ghai: number; titleFragment: string }
}

// ---------------------------------------------------------------------------
// Unique boss cards (NOT added to the player pool).
// ---------------------------------------------------------------------------

export const LANTERN_AUDITOR_CARDS: readonly CardTemplate[] = [
  { id: 'lantern_inspection_beam', name: 'Inspection Beam', type: 'weapon', rarity: 'rare',      cost: 2, stats: { damage: 7, apply: ['expose'] },          abilityText: 'Deal 7 damage. Apply Expose.',                    flavor: 'Civic AI auditing your defenses.',        faction: 'neutral', shipClassRestriction: null },
  { id: 'lantern_customs_clamp',   name: 'Customs Clamp',   type: 'weapon', rarity: 'uncommon', cost: 2, stats: { damage: 5, apply: ['lock'] },             abilityText: 'Deal 5 damage. Apply Lock.',                      flavor: 'Docking clamp recommissioned for combat.', faction: 'neutral', shipClassRestriction: null },
  { id: 'lantern_civic_barrier',   name: 'Civic Barrier',   type: 'defense', rarity: 'rare',     cost: 2, stats: { block: 10, apply: ['shielded'] },        abilityText: 'Gain 10 Block and Shielded.',                     flavor: 'Standard-issue protection, disciplined.', faction: 'neutral', shipClassRestriction: null },
  { id: 'lantern_examiners_timing',name: "Examiner's Timing", type: 'ai',   rarity: 'rare',     cost: 3, stats: { draw: 2, apply: ['expose'] },            abilityText: 'Draw 2. Apply Expose.',                           flavor: 'Measured fire is better than fast fire.', faction: 'neutral', shipClassRestriction: null },
]

export const VARKA_CARDS: readonly CardTemplate[] = [
  { id: 'varka_hangar_flood',      name: 'Hangar Flood',         type: 'drone',      rarity: 'legendary', cost: 3, stats: { per_turn: 3, duration_turns: 3 },       abilityText: 'Deploy a Raider Drone: 3 damage/turn for 3 turns.', flavor: 'Launch bays open. Brace.',                 faction: 'void', shipClassRestriction: null },
  { id: 'varka_warlords_broadcast',name: "Warlord's Broadcast",  type: 'ai',         rarity: 'rare',      cost: 2, stats: { apply: ['drone_mark', 'overcharge'] },  abilityText: 'Apply Drone Mark and Overcharge to target.',       flavor: 'She speaks, the Hollow answers.',          faction: 'void', shipClassRestriction: null },
  { id: 'varka_salvage_tribute',   name: 'Salvage Tribute',      type: 'consumable', rarity: 'uncommon',  cost: 1, stats: { energy: 1, draw: 1, exhaust: true },    abilityText: 'Gain 1 energy. Draw 1. Exhaust.',                  flavor: 'Pay the Hollow. Keep moving.',             faction: 'void', shipClassRestriction: null },
  { id: 'varka_broadside_hollow',  name: 'Broadside of the Hollow', type: 'weapon',  rarity: 'legendary', cost: 4, stats: { damage: 14, splash: 6 },                abilityText: 'Deal 14 damage. 6 splash to adjacent.',            flavor: 'Every barrel in the fortress speaks at once.', faction: 'void', shipClassRestriction: null },
]

export const CHOIR_SIGHT_CARDS: readonly CardTemplate[] = [
  { id: 'choir_reflection',        name: 'Choir Reflection', type: 'ai',       rarity: 'rare',      cost: 2, stats: { draw: 1, apply: ['jam'] },          abilityText: 'Draw 1. Apply Jam.',                     flavor: 'A hush that answers questions sideways.', faction: 'void', shipClassRestriction: null },
  { id: 'choir_unlit_interval',    name: 'Unlit Interval',   type: 'maneuver', rarity: 'rare',      cost: 3, stats: { apply: ['jam', 'lock'] },          abilityText: 'Apply Jam and Lock to target.',          flavor: 'The pause between two notes you never hear.', faction: 'void', shipClassRestriction: null },
  { id: 'choir_meaning_drift',     name: 'Meaning Drift',    type: 'ai',       rarity: 'uncommon',  cost: 2, stats: { draw: 1, apply: ['expose'] },      abilityText: 'Draw 1. Apply Expose.',                  flavor: 'Your intent, rerouted.',                 faction: 'void', shipClassRestriction: null },
  { id: 'choir_lattice_pulse',     name: 'Lattice Pulse',    type: 'weapon',   rarity: 'legendary', cost: 4, stats: { damage: 16, apply: ['jam'] },      abilityText: 'Deal 16 damage. Apply Jam.',             flavor: 'Black lattice resonates once.',          faction: 'void', shipClassRestriction: null },
]

export const PATIENT_WRECK_CARDS: readonly CardTemplate[] = [
  { id: 'wreck_rewind_window',     name: 'Rewind Window',        type: 'defense',  rarity: 'legendary', cost: 4, stats: { block: 18, apply: ['shielded'] },             abilityText: 'Gain 18 Block and Shielded.',                      flavor: 'Replay the last moment without damage.',     faction: 'void', shipClassRestriction: null },
  { id: 'wreck_borrowed_tomorrow', name: 'Borrowed Tomorrow',    type: 'maneuver', rarity: 'legendary', cost: 5, stats: { block: 8, draw: 2 },                         abilityText: 'Gain 8 Block. Draw 2.',                            flavor: 'An hour taken from a journey that ended.',    faction: 'void', shipClassRestriction: null },
  { id: 'wreck_archive_repetition',name: 'Archive Repetition',   type: 'ai',       rarity: 'rare',      cost: 3, stats: { draw: 2, apply: ['expose'] },                 abilityText: 'Draw 2. Apply Expose.',                            flavor: 'The log remembers. Again. Again.',            faction: 'void', shipClassRestriction: null },
  { id: 'wreck_final_approach',    name: 'Final Approach Forever', type: 'weapon', rarity: 'legendary', cost: 6, stats: { damage: 24, apply: ['lock', 'expose'] },     abilityText: 'Deal 24 damage. Apply Lock and Expose.',           flavor: 'The voyage ended. The orders remain.',        faction: 'void', shipClassRestriction: null },
]

// ---------------------------------------------------------------------------
// Boss definitions
// ---------------------------------------------------------------------------

export const BOSS_DEFS: Readonly<Record<Exclude<BossId, 'kestrel'>, BossDef>> = {
  lantern_auditor: {
    id: 'lantern_auditor',
    name: 'The Lantern Auditor',
    zone: 'Inner Ring · Beacon Lanes',
    tierLabel: 'Tier 2',
    hull: 78,
    bonusEnergyPerTurn: 0,
    deckSize: 20,
    uniqueCards: LANTERN_AUDITOR_CARDS,
    stapleRarities: ['common', 'uncommon'],
    summary: 'A disciplined training corvette. Punishes reckless attacking. Teaches block + status timing.',
    reward: { ghai: 140, titleFragment: 'Passed Inspection' },
  },
  varka: {
    id: 'varka',
    name: 'Varka, Tyrant of the Hollow',
    zone: 'Outer Ring · Hollow Tyrant',
    tierLabel: 'Tier 4',
    hull: 128,
    bonusEnergyPerTurn: 1,
    deckSize: 20,
    uniqueCards: VARKA_CARDS,
    stapleRarities: ['uncommon', 'rare', 'legendary'],
    summary: 'Pirate warlord. Floods the board with drones. Forces target-priority decisions.',
    reward: { ghai: 360, titleFragment: 'Hangar Breaker' },
  },
  choir_sight: {
    id: 'choir_sight',
    name: 'Choir-Sight Envoy',
    zone: 'Deep Void · The Unlit Choir',
    tierLabel: 'Tier 5',
    hull: 154,
    bonusEnergyPerTurn: 1,
    deckSize: 20,
    uniqueCards: CHOIR_SIGHT_CARDS,
    stapleRarities: ['rare', 'legendary'],
    summary: 'Silent One scout. Adapts, mirrors, interrupts. Punishes repetitive decks.',
    reward: { ghai: 520, titleFragment: 'Heard by the Choir' },
  },
  patient_wreck: {
    id: 'patient_wreck',
    name: 'The Patient Wreck',
    zone: 'Deep Void · Core Chamber',
    tierLabel: 'Tier 5+',
    hull: 220,
    bonusEnergyPerTurn: 2,
    deckSize: 24,
    uniqueCards: PATIENT_WRECK_CARDS,
    stapleRarities: ['rare', 'legendary'],
    summary: 'Faithful beyond mercy. Weaponises time and memory. Endgame fight.',
    reward: { ghai: 900, titleFragment: 'Long Return' },
  },
}

// ---------------------------------------------------------------------------
// Deck construction
// ---------------------------------------------------------------------------

function buildBossDeck(def: BossDef): CardTemplate[] {
  const deck: CardTemplate[] = []
  // 2 copies of each unique boss card.
  def.uniqueCards.forEach(c => { deck.push(c, c) })
  // Pad with rarity-appropriate staples from the baseline card pool.
  const staples = CARD_TEMPLATES.filter(c => def.stapleRarities.includes(c.rarity))
  const usage = new Map<string, number>()
  let i = 0
  while (deck.length < def.deckSize && staples.length > 0) {
    const pick = staples[i % staples.length]
    const seen = usage.get(pick.id) ?? 0
    if (seen < 2) {
      deck.push(pick)
      usage.set(pick.id, seen + 1)
    }
    i++
    if (i > staples.length * 4) break
  }
  // Final safety fill with commons so decks always reach target size.
  if (deck.length < def.deckSize) {
    const commons = CARD_TEMPLATES.filter(c => c.rarity === 'common')
    let j = 0
    while (deck.length < def.deckSize && commons.length > 0) {
      deck.push(commons[j % commons.length])
      j++
    }
  }
  return deck
}

export function makeBossEncounter(bossId: Exclude<BossId, 'kestrel'>): EncounterConfig {
  const def = BOSS_DEFS[bossId]
  return {
    hull: def.hull,
    deck: buildBossDeck(def),
    tier: null,
    isBoss: true,
    bonusEnergyPerTurn: def.bonusEnergyPerTurn,
    bossId: def.id,
  }
}

// Individual factories for ergonomic call sites and for tests.
export const makeLanternAuditorEncounter = (): EncounterConfig => makeBossEncounter('lantern_auditor')
export const makeVarkaEncounter         = (): EncounterConfig => makeBossEncounter('varka')
export const makeChoirSightEncounter    = (): EncounterConfig => makeBossEncounter('choir_sight')
export const makePatientWreckEncounter  = (): EncounterConfig => makeBossEncounter('patient_wreck')
