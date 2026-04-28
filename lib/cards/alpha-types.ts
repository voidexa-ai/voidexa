// lib/cards/alpha-types.ts
//
// Shared constants for the AFS-6d Alpha catalog. Server pages
// (app/cards/alpha/page.tsx, app/dk/cards/alpha/page.tsx) read these
// to validate searchParams. The client catalog (components/cards/AlphaCatalog.tsx)
// reads them to render type tabs. Source of truth — do not inline elsewhere.

export const VALID_ALPHA_TYPES = [
  'weapon',
  'drone',
  'ai_routine',
  'defense',
  'module',
  'maneuver',
  'equipment',
  'field',
  'ship_core',
] as const

export type AlphaTypeDb = (typeof VALID_ALPHA_TYPES)[number]

export const ALPHA_PAGE_SIZE = 20

export const ALPHA_DB_TO_LABEL: Readonly<Record<AlphaTypeDb, string>> = {
  weapon: 'Weapon',
  drone: 'Drone',
  ai_routine: 'AI Routine',
  defense: 'Defense',
  module: 'Module',
  maneuver: 'Maneuver',
  equipment: 'Equipment',
  field: 'Field',
  ship_core: 'Ship Core',
}

export const DEFAULT_ALPHA_TYPE: AlphaTypeDb = 'weapon'

export function isValidAlphaType(t: string | undefined): t is AlphaTypeDb {
  return (VALID_ALPHA_TYPES as readonly string[]).includes(t ?? '')
}

export function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

// AFS-18b - Rarity helpers (matches alpha_cards.rarity CHECK constraint
// in supabase/migrations/20260425_afs6d_alpha_cards_decks.sql).

export const VALID_ALPHA_RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
] as const

export type AlphaRarityDb = (typeof VALID_ALPHA_RARITIES)[number]

export const ALPHA_RARITY_LABELS: Readonly<Record<AlphaRarityDb, string>> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
}

export function isValidAlphaRarity(
  r: string | undefined,
): r is AlphaRarityDb {
  return (VALID_ALPHA_RARITIES as readonly string[]).includes(r ?? '')
}
