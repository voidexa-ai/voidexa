/**
 * Sprint 4 — Task 4: shop cosmetic types.
 * Source: docs/VOIDEXA_GAMING_COMBINED_V3.md PART 8.
 */

export type CosmeticCategory = 'racing' | 'combat' | 'pilot' | 'premium'

export type CosmeticSlot =
  | 'engine_glow'
  | 'victory_effect'
  | 'card_sleeve'
  | 'battle_shake'
  | 'avatar'
  | 'title_slot'
  | 'profile_bg'
  | 'trail'
  | 'cockpit_interior'
  | 'badge'
  | 'named_asteroid'
  | 'victory_pose'

export interface CosmeticDef {
  id: string
  name: string
  category: CosmeticCategory
  slot: CosmeticSlot
  priceGhai: number
  description: string
}

export interface OwnedCosmetic {
  userId: string
  cosmeticId: string
  equipped: boolean
  acquiredAt: string
}
