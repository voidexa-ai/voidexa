/**
 * Sprint 4 — Task 4: hand-authored cosmetic catalog.
 *
 * 5 items per tab (except Premium at 4) × 4 tabs = 19 items total.
 * Prices fall within V3 pricing bands:
 *   - Racing / Combat / Pilot: 200–1200 GHAI
 *   - Premium: 1500–5000 GHAI
 */

import type { CosmeticDef } from './types'

export const COSMETIC_CATALOG: readonly CosmeticDef[] = [
  // ─── Racing ─────────────────────────────────────────────────────────────
  {
    id: 'racing_engine_glow_blue',
    name: 'Arctic Plume Engine Glow',
    category: 'racing',
    slot: 'engine_glow',
    priceGhai: 300,
    description: 'A cold blue trail that pulses brighter at boost.',
  },
  {
    id: 'racing_engine_glow_red',
    name: 'Ember Stripe Engine Glow',
    category: 'racing',
    slot: 'engine_glow',
    priceGhai: 500,
    description: 'Warm red afterburner trail. Visible from two sectors away.',
  },
  {
    id: 'racing_engine_glow_gold',
    name: 'Sun-Line Gold Engine Glow',
    category: 'racing',
    slot: 'engine_glow',
    priceGhai: 1200,
    description: 'A premium gold shimmer. Signals a racer who has something to prove.',
  },
  {
    id: 'racing_finish_flare',
    name: 'Finish Line Flare',
    category: 'racing',
    slot: 'victory_effect',
    priceGhai: 800,
    description: 'Confetti burst when crossing the last gate of a race.',
  },
  {
    id: 'racing_afterburner_plume',
    name: 'Afterburner Plume',
    category: 'racing',
    slot: 'engine_glow',
    priceGhai: 600,
    description: 'Extra-long boost exhaust. Purely cosmetic — no speed change.',
  },

  // ─── Combat ─────────────────────────────────────────────────────────────
  {
    id: 'combat_sleeve_core',
    name: 'Core Standard Card Sleeve',
    category: 'combat',
    slot: 'card_sleeve',
    priceGhai: 400,
    description: 'Cyan-bordered sleeves with Core Zone motif.',
  },
  {
    id: 'combat_sleeve_void',
    name: 'Void Lattice Card Sleeve',
    category: 'combat',
    slot: 'card_sleeve',
    priceGhai: 600,
    description: 'Deep-purple lattice pattern. Feels expensive.',
  },
  {
    id: 'combat_sleeve_pioneer',
    name: 'Pioneer Gold Card Sleeve',
    category: 'combat',
    slot: 'card_sleeve',
    priceGhai: 900,
    description: 'Restrained gold accents. Not a flex, but close.',
  },
  {
    id: 'combat_shake_toggle',
    name: 'Battle Shake Intensity',
    category: 'combat',
    slot: 'battle_shake',
    priceGhai: 200,
    description: 'Toggle the battle camera shake preference on your account.',
  },
  {
    id: 'combat_victory_pose',
    name: 'Victory Pose · Slow Pan',
    category: 'combat',
    slot: 'victory_pose',
    priceGhai: 700,
    description: 'Post-victory camera pulls wide and settles on your ship for two beats.',
  },

  // ─── Pilot ──────────────────────────────────────────────────────────────
  {
    id: 'pilot_avatar_jix',
    name: 'Jix-Portrait Avatar',
    category: 'pilot',
    slot: 'avatar',
    priceGhai: 300,
    description: 'Cast-adjacent portrait (non-official, non-endorsed).',
  },
  {
    id: 'pilot_avatar_gemini',
    name: 'Gemini-Portrait Avatar',
    category: 'pilot',
    slot: 'avatar',
    priceGhai: 300,
    description: 'Another Cast-adjacent portrait choice for your profile.',
  },
  {
    id: 'pilot_avatar_silent',
    name: 'Silent One Silhouette',
    category: 'pilot',
    slot: 'avatar',
    priceGhai: 300,
    description: 'For pilots who prefer to be read, not seen.',
  },
  {
    id: 'pilot_title_slot',
    name: 'Title Slot Expansion',
    category: 'pilot',
    slot: 'title_slot',
    priceGhai: 800,
    description: 'Equip two composed titles at once on your pilot profile.',
  },
  {
    id: 'pilot_profile_bg',
    name: 'Deep-Void Profile Background',
    category: 'pilot',
    slot: 'profile_bg',
    priceGhai: 500,
    description: 'Star-field background for your pilot profile page.',
  },

  // ─── Premium ────────────────────────────────────────────────────────────
  {
    id: 'premium_legendary_trail',
    name: 'Legendary Aurora Trail',
    category: 'premium',
    slot: 'trail',
    priceGhai: 3500,
    description: 'Permanent shimmering trail that shifts color by zone. Premium tier.',
  },
  {
    id: 'premium_cockpit_interior',
    name: 'Custom Cockpit Interior',
    category: 'premium',
    slot: 'cockpit_interior',
    priceGhai: 2200,
    description: 'Swap your cockpit paneling for a hand-illustrated alternative.',
  },
  {
    id: 'premium_holographic_badge',
    name: 'Holographic Ship Badge',
    category: 'premium',
    slot: 'badge',
    priceGhai: 1500,
    description: 'A holographic emblem floating beside your callsign on profile pages.',
  },
  {
    id: 'premium_named_asteroid',
    name: 'Named Asteroid (Permanent)',
    category: 'premium',
    slot: 'named_asteroid',
    priceGhai: 5000,
    description: 'A permanent asteroid in the voidexa universe bearing your name. One per pilot.',
  },
] as const

export const COSMETIC_TABS: readonly { id: 'racing' | 'combat' | 'pilot' | 'premium' | 'ships' | 'packs'; label: string }[] = [
  { id: 'ships',   label: 'Ships' },
  { id: 'racing',  label: 'Racing' },
  { id: 'combat',  label: 'Combat' },
  { id: 'pilot',   label: 'Pilot' },
  { id: 'packs',   label: 'Packs' },
  { id: 'premium', label: 'Premium' },
]

export function getCosmetic(id: string): CosmeticDef | undefined {
  return COSMETIC_CATALOG.find(c => c.id === id)
}

export function cosmeticsByCategory(category: CosmeticDef['category']): CosmeticDef[] {
  return COSMETIC_CATALOG.filter(c => c.category === category)
}
