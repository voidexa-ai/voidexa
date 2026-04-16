// Internal admin tagging schema for /admin/ship-tagger. Tags are stored as
// JSON in lib/data/shipTagging.json and edited via the admin UI. The legacy
// rarity model lives in lib/data/shipTiers.ts and is intentionally untouched
// — once tagging is complete, a follow-up migration will reconcile the two.

export type ShipTier =
  | 'free'
  | 'achievement'
  | 'paid-medium'
  | 'paid-high'
  | 'legendary'

export type ShipRole =
  | 'scout'
  | 'fighter'
  | 'tank'
  | 'striker'
  | 'capital'
  | 'explorer'

export interface ShipTag {
  tier: ShipTier | null
  role: ShipRole | null
  priceUSD: number | null
  priceGHAI: number | null
  achievementId: string | null
  notes: string
}

export interface ShipTaggingFile {
  version: number
  lastUpdated: string
  ships: Record<string, ShipTag>
}

export const TIER_DEFAULTS: Record<ShipTier, { priceUSD: number; priceGHAI: number }> = {
  'free':         { priceUSD: 0,  priceGHAI: 0 },
  'achievement':  { priceUSD: 0,  priceGHAI: 0 },
  'paid-medium':  { priceUSD: 12, priceGHAI: 1200 },
  'paid-high':    { priceUSD: 20, priceGHAI: 2000 },
  'legendary':    { priceUSD: 30, priceGHAI: 3000 },
}

export const TIER_LABELS: Record<ShipTier, string> = {
  'free':        'Free',
  'achievement': 'Achievement',
  'paid-medium': 'Paid — Medium',
  'paid-high':   'Paid — High',
  'legendary':   'Legendary',
}

export const TIER_COLORS: Record<ShipTier, string> = {
  'free':        '#66ff99',
  'achievement': '#a855f7',
  'paid-medium': '#3b82f6',
  'paid-high':   '#06b6d4',
  'legendary':   '#f59e0b',
}

export const ROLE_LABELS: Record<ShipRole, string> = {
  'scout':    'Scout (agile, fragile)',
  'fighter':  'Fighter (balanced combat)',
  'tank':     'Tank (heavy hull, slow)',
  'striker':  'Striker (high damage, medium speed)',
  'capital':  'Capital (massive, slow, expensive to run)',
  'explorer': 'Explorer (long-range, cargo)',
}

export const EMPTY_TAG: ShipTag = {
  tier: null,
  role: null,
  priceUSD: null,
  priceGHAI: null,
  achievementId: null,
  notes: '',
}
