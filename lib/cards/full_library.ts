/**
 * lib/cards/full_library.ts
 *
 * Sprint 14g — adapter that unions the three source-of-truth card JSONs
 * (baseline + full_card_library + expansion_set_1) and re-shapes each entry
 * into the `CoreSetCard` form that the existing combat UI expects.
 *
 *   baseline.json               26 cards  (starter)
 *   full_card_library.json     177 cards  (main set)
 *   expansion_set_1.json        54 cards  (expansion)
 *                              ---
 *                              257 cards  (matches public/cards/rendered/*.png)
 *
 * Sprint 14h owns redesigning the card visual layout — here we only wire
 * data + keyword metadata through to the existing component.
 */
import baselineJson from '@/lib/game/cards/baseline.json'
import fullJson from '@/lib/game/cards/full_card_library.json'
import expansionJson from '@/lib/game/cards/expansion_set_1.json'
import { CardCategory, CardRarity, type Card } from '@/lib/game/cards'
import type { CardCatalogue } from './deck'
import type { CoreSetCard } from './starter_set'

interface SourceCard {
  id: string
  name: string
  type: string
  rarity: string
  cost: number
  stats?: Record<string, unknown>
  abilityText: string
  flavor?: string
  faction?: string
  shipClassRestriction?: string | null
  keywords?: string[]
}

/** Extends CoreSetCard with the optional keyword list from the JSON library. */
export interface FullLibraryCard extends CoreSetCard {
  keywords?: string[]
  /** The original JSON rarity string (common/uncommon/rare/legendary/mythic). */
  sourceRarity: string
  /** The original JSON type (weapon/defense/maneuver/drone/ai/consumable). */
  sourceType: string
  flavor?: string
}

const RARITY_MAP: Readonly<Record<string, CardRarity>> = {
  common: CardRarity.Common,
  uncommon: CardRarity.Uncommon,
  rare: CardRarity.Rare,
  epic: CardRarity.Epic,
  legendary: CardRarity.Legendary,
  mythic: CardRarity.Mythic,
  // Defensive fallback: pioneer-tier cards are treated as Legendary for visuals.
  pioneer: CardRarity.Legendary,
}

const CATEGORY_MAP: Readonly<Record<string, CardCategory>> = {
  weapon: CardCategory.Attack,
  defense: CardCategory.Defense,
  maneuver: CardCategory.Tactical,
  ai: CardCategory.Tactical,
  drone: CardCategory.Deployment,
  consumable: CardCategory.Deployment,
}

function toRarity(raw: string): CardRarity {
  return RARITY_MAP[raw.toLowerCase()] ?? CardRarity.Common
}

function toCategory(raw: string): CardCategory {
  return CATEGORY_MAP[raw.toLowerCase()] ?? CardCategory.Tactical
}

function mapCard(src: SourceCard): FullLibraryCard {
  const rarity = toRarity(src.rarity)
  const category = toCategory(src.type)
  const base: Card = {
    id: src.id,
    name: src.name,
    rarity,
    category,
    energyCost: src.cost ?? 0,
    description: src.flavor ?? src.abilityText,
    primaryEffect: src.abilityText,
  }
  return {
    ...base,
    keywords: src.keywords,
    sourceRarity: src.rarity,
    sourceType: src.type,
    flavor: src.flavor,
  }
}

function dedupe(cards: FullLibraryCard[]): FullLibraryCard[] {
  const seen = new Set<string>()
  const out: FullLibraryCard[] = []
  for (const c of cards) {
    if (seen.has(c.id)) continue
    seen.add(c.id)
    out.push(c)
  }
  return out
}

/** Union of baseline + full library + expansion 1, de-duped by id. */
export const FULL_CARDS: ReadonlyArray<FullLibraryCard> = dedupe(
  ([
    ...(baselineJson as SourceCard[]),
    ...(fullJson as SourceCard[]),
    ...(expansionJson as SourceCard[]),
  ]).map(mapCard),
)

/** id → card lookup, shape-compatible with `CardCatalogue` (collection helpers). */
export const FULL_CATALOGUE: CardCatalogue = Object.freeze(
  Object.fromEntries(FULL_CARDS.map((c) => [c.id, c])) as Record<string, Card>,
)

/** Formatted label for a library keyword slug (e.g. "tracking_lock" → "Tracking Lock"). */
export function formatKeyword(slug: string): string {
  return slug
    .split('_')
    .map((word) => (word.length ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')
}
