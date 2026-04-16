/**
 * Sprint 1 — Task 2: full 257-card library loader.
 *
 * Merges three source files into a single validated `ALL_CARDS` array:
 *   - baseline.json           (26 cards — matches lib/game/cards/index.ts)
 *   - expansion_set_1.json    (54 cards — docs/CARD_SET_27_80.md)
 *   - full_card_library.json  (177 cards — docs/CARD_SET_COMPLETE.md cards 81–257)
 *
 * Total: 257 unique cards. Duplicate ids are dropped (last source wins, but
 * the three source files are non-overlapping by design).
 *
 * Existing `CARDS_BY_ID` in `./index.ts` is preserved unchanged so callers
 * that only want the 26-card baseline still work. Consumers wanting the full
 * library import from `./library` instead.
 */

import baselineJson from './baseline.json'
import expansion1Json from './expansion_set_1.json'
import fullLibraryJson from './full_card_library.json'
import type {
  CardFaction,
  CardStats,
  CardTemplate,
  CardType,
  GameCardRarity,
  ShipClassRestriction,
} from './index'

const CARD_TYPES: readonly CardType[] = ['weapon', 'defense', 'maneuver', 'drone', 'ai', 'consumable']
const CARD_RARITIES: readonly GameCardRarity[] = ['common', 'uncommon', 'rare', 'legendary', 'mythic', 'pioneer']
const CARD_FACTIONS: readonly CardFaction[] = ['core', 'pioneer', 'void', 'neutral']

interface RawCard {
  id: string
  name: string
  type: string
  rarity: string
  cost: number
  stats?: CardStats
  abilityText?: string
  ability_text?: string
  flavor?: string
  faction?: string
  shipClassRestriction?: ShipClassRestriction
  ship_class_restriction?: ShipClassRestriction
}

function coerceCard(raw: RawCard, source: string): CardTemplate | null {
  if (!raw.id || !raw.name) return null
  if (typeof raw.cost !== 'number' || raw.cost < 0 || raw.cost > 7) return null

  const type = CARD_TYPES.includes(raw.type as CardType) ? (raw.type as CardType) : null
  if (!type) {
    console.warn(`[cards/library] Skipping ${raw.id} from ${source}: invalid type "${raw.type}"`)
    return null
  }
  const rarity = CARD_RARITIES.includes(raw.rarity as GameCardRarity) ? (raw.rarity as GameCardRarity) : null
  if (!rarity) {
    console.warn(`[cards/library] Skipping ${raw.id} from ${source}: invalid rarity "${raw.rarity}"`)
    return null
  }
  const faction = CARD_FACTIONS.includes(raw.faction as CardFaction) ? (raw.faction as CardFaction) : 'core'
  const abilityText = raw.abilityText ?? raw.ability_text ?? ''
  const shipClassRestriction =
    (raw.shipClassRestriction ?? raw.ship_class_restriction ?? null) as ShipClassRestriction

  return {
    id: raw.id,
    name: raw.name,
    type,
    rarity,
    cost: raw.cost,
    stats: raw.stats ?? {},
    abilityText,
    flavor: raw.flavor,
    faction,
    shipClassRestriction,
  }
}

function loadSource(raw: unknown, source: string): CardTemplate[] {
  if (!Array.isArray(raw)) return []
  const out: CardTemplate[] = []
  for (const r of raw) {
    const c = coerceCard(r as RawCard, source)
    if (c) out.push(c)
  }
  return out
}

function buildLibrary(): CardTemplate[] {
  const byId = new Map<string, CardTemplate>()
  // Order: baseline → expansion → full_library. Later wins on collision, but
  // the three are non-overlapping by design (see `npm run test` assertions).
  const sources: [unknown, string][] = [
    [baselineJson, 'baseline.json'],
    [expansion1Json, 'expansion_set_1.json'],
    [fullLibraryJson, 'full_card_library.json'],
  ]
  for (const [raw, name] of sources) {
    for (const card of loadSource(raw, name)) {
      byId.set(card.id, card)
    }
  }
  return Array.from(byId.values())
}

export const ALL_CARDS: readonly CardTemplate[] = Object.freeze(buildLibrary())

export const ALL_CARDS_BY_ID: Readonly<Record<string, CardTemplate>> = Object.freeze(
  ALL_CARDS.reduce<Record<string, CardTemplate>>((acc, c) => { acc[c.id] = c; return acc }, {}),
)

export function getAnyCardTemplate(id: string): CardTemplate | undefined {
  return ALL_CARDS_BY_ID[id]
}

export function cardCount(): number {
  return ALL_CARDS.length
}
