/**
 * lib/data/shipTiers.ts
 *
 * Ship tier definitions — anchors which hulls are FREE for new pilots and
 * which are locked behind the shop. Referenced by ShipPicker (Free Flight)
 * and the shop gating UI.
 *
 * Rule (master plan Part 3): gameplay earns stats, shop sells looks. The
 * starter pool is picked for pace and handling — small, agile frames —
 * because a new pilot flying a capital-class hauler has no fun learning
 * controls.
 *
 * Tiers are exclusive: a slug appears in exactly one tier. `getShipTier()`
 * checks starter first and defaults to `common` for anything unmapped so new
 * ship uploads do not accidentally appear as locked.
 */
export type ShipTier = 'starter' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

/**
 * Six free starter ships — shown with a green "STARTER" badge, no price,
 * "Play now" CTA. Everything else in SHIP_CATALOG (and future uploads) is
 * treated as locked cosmetic content.
 *
 * qs_bob already ships as the default hull (SHIP_CATALOG[0]); the rest are
 * reserved slugs — catalog entries can be added in follow-up work without
 * needing to re-tune tier data.
 */
export const STARTER_SHIPS: readonly string[] = [
  'qs_bob',
  'qs_challenger',
  'qs_striker',
  'qs_imperial',
  'usc_astroeagle',
  'usc_cosmicshark',
] as const

/**
 * Premium content tiers — color-coded in the shop (Common → Legendary).
 * A slug can be tested against these in UI code to pick a lock glow color.
 */
export const SHIP_TIERS: Record<ShipTier, readonly string[]> = {
  starter: STARTER_SHIPS,
  common: [],
  uncommon: [],
  rare: [],
  epic: [
    'uscx_starforce',
  ],
  legendary: [
    'usc_voidwhale',
    'uscx_galacticokamoto',
  ],
}

/**
 * Resolve a ship slug → tier. Unknown slugs fall back to `common`.
 * Case-insensitive; hyphens and underscores are normalized.
 */
export function getShipTier(slug: string): ShipTier {
  const key = normalizeSlug(slug)
  for (const tier of Object.keys(SHIP_TIERS) as ShipTier[]) {
    if (SHIP_TIERS[tier].some(s => normalizeSlug(s) === key)) return tier
  }
  return 'common'
}

export function isStarterShip(slug: string): boolean {
  return getShipTier(slug) === 'starter'
}

function normalizeSlug(s: string): string {
  return s.toLowerCase().replace(/[-_\s]+/g, '_')
}

/** Public display label for a tier. Shown in picker badges + tooltips. */
export const TIER_LABEL: Record<ShipTier, string> = {
  starter:   'Starter',
  common:    'Common',
  uncommon:  'Uncommon',
  rare:      'Rare',
  epic:      'Epic',
  legendary: 'Legendary',
}

/** Rarity-aligned glow color for locked ship overlays. */
export const TIER_COLOR: Record<ShipTier, string> = {
  starter:   '#66ff99',
  common:    '#94a3b8',
  uncommon:  '#4ade80',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#f59e0b',
}
