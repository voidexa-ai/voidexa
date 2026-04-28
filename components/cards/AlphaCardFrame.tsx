'use client'

/**
 * components/cards/AlphaCardFrame.tsx
 *
 * AFS-6d  - Premium frame for the 1000-card Alpha set.
 * AFS-18  - Per-card image wiring via optional imageUrl prop. When supplied,
 *           renders the unique webp from Supabase Storage public bucket;
 *           otherwise falls back to the 9-PNG category art (also used as
 *           onError fallback).
 * AFS-18b - Rarity badge text in the header + mythic iridescent frame
 *           branch (animated conic gradient via .mythic-frame class in
 *           app/globals.css). Other 5 rarities stay solid per the
 *           AFS-6d/18 "do not touch" rule.
 *
 * 'use client' is required because the onError handler runs in the browser.
 *
 * Color: rarity -> frame color is sourced from RARITY_GLOW in
 * components/combat/cardArt.ts. RARITY_GLOW.Mythic (#ec4899 pink-500) is
 * used for the rarity badge text on mythic cards, and matches one of the
 * three conic-gradient stops so the badge stays visually coherent with the
 * border.
 *
 * Type: titlecase strings ("AI Routine", "Ship Core") match
 * docs/alpha_set/batch_*.json source data verbatim.
 *
 * Distinct from V3 frame at components/combat/CardCollection.tsx.
 */

import { CardRarity } from '@/lib/game/cards'
import { RARITY_GLOW } from '@/components/combat/cardArt'

export type AlphaRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'

export type AlphaCardType =
  | 'Weapon'
  | 'Drone'
  | 'AI Routine'
  | 'Defense'
  | 'Module'
  | 'Maneuver'
  | 'Equipment'
  | 'Field'
  | 'Ship Core'

export interface AlphaCardFrameProps {
  rarity: AlphaRarity
  type: AlphaCardType
  name: string
  energy_cost: number
  attack?: number
  defense?: number
  effect_text: string
  flavor_text: string
  comingSoon?: boolean
  imageUrl?: string
}

const RARITY_TO_ENUM: Readonly<Record<AlphaRarity, CardRarity>> = {
  common: CardRarity.Common,
  uncommon: CardRarity.Uncommon,
  rare: CardRarity.Rare,
  epic: CardRarity.Epic,
  legendary: CardRarity.Legendary,
  mythic: CardRarity.Mythic,
}

export const TYPE_TO_IMAGE: Readonly<Record<AlphaCardType, string>> = {
  Weapon: '/cards/category-art/01_weapon.png',
  Drone: '/cards/category-art/02_drone.png',
  'AI Routine': '/cards/category-art/03_ai_routine.png',
  Defense: '/cards/category-art/04_defense.png',
  Module: '/cards/category-art/05_module.png',
  Maneuver: '/cards/category-art/06_maneuver.png',
  Equipment: '/cards/category-art/07_equipment.png',
  Field: '/cards/category-art/08_field.png',
  'Ship Core': '/cards/category-art/09_ship_core.png',
}

export function frameColor(rarity: AlphaRarity): string {
  return RARITY_GLOW[RARITY_TO_ENUM[rarity]]
}

export function typeImagePath(type: AlphaCardType): string {
  return TYPE_TO_IMAGE[type]
}

export default function AlphaCardFrame({
  rarity,
  type,
  name,
  energy_cost,
  attack,
  defense,
  effect_text,
  flavor_text,
  comingSoon = false,
  imageUrl,
}: AlphaCardFrameProps) {
  const color = frameColor(rarity)
  const fallbackSrc = typeImagePath(type)
  const initialSrc = imageUrl ?? fallbackSrc
  const hasStats = attack !== undefined || defense !== undefined
  const isMythic = rarity === 'mythic'

  // AFS-18b: mythic uses .mythic-frame (animated conic gradient defined in
  // app/globals.css) instead of a solid border. Outer glow uses pink-500 +
  // cyan-400 RGBA (2 of 3 conic stops) to keep the halo iridescent;
  // intentionally omits the gold stop so the halo does not read as warm
  // yellow.
  const articleClass =
    'relative flex w-full max-w-[280px] flex-col rounded-xl bg-zinc-950 text-zinc-100 shadow-lg transition-transform hover:scale-[1.02] ' +
    (isMythic ? 'mythic-frame' : 'border-2')

  const articleStyle: React.CSSProperties = isMythic
    ? {
        boxShadow:
          '0 0 24px rgba(236, 72, 153, 0.45), 0 0 48px rgba(34, 211, 238, 0.25)',
      }
    : {
        borderColor: color,
        boxShadow: `0 0 12px ${color}55, inset 0 0 6px ${color}22`,
      }

  return (
    <article
      data-rarity={rarity}
      data-type={type}
      data-mythic={isMythic ? 'true' : undefined}
      className={articleClass}
      style={articleStyle}
    >
      <header className="flex items-center justify-between gap-2 px-3 py-2">
        <span
          className="rounded-full px-2 py-0.5 text-sm font-semibold uppercase tracking-wider"
          style={{ backgroundColor: `${color}22`, color }}
        >
          {type}
        </span>

        {/* AFS-18b: rarity badge (outlined pill, color matches frame). */}
        <span
          data-testid="rarity-badge"
          aria-label={`Rarity ${rarity}`}
          className="rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider"
          style={{ borderColor: color, color }}
        >
          {rarity}
        </span>

        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-base font-bold"
          style={{ backgroundColor: color, color: '#0a0a0a' }}
          aria-label={`Energy cost ${energy_cost}`}
        >
          {energy_cost}
        </span>
      </header>

      <h3 className="px-3 pb-2 text-base font-semibold leading-tight">
        {name}
      </h3>

      <div
        className="relative aspect-[3/2] w-full overflow-hidden border-y"
        style={{ borderColor: `${color}66` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={initialSrc}
          alt={imageUrl ? name : `${type} category art`}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget
            if (!target.dataset.fallbackTried) {
              target.dataset.fallbackTried = '1'
              target.src = fallbackSrc
            }
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 px-3 py-3">
        {hasStats && (
          <div className="flex gap-3 text-sm font-mono uppercase opacity-80">
            {attack !== undefined && (
              <span data-testid="stat-attack">ATK {attack}</span>
            )}
            {defense !== undefined && (
              <span data-testid="stat-defense">DEF {defense}</span>
            )}
          </div>
        )}
        <p className="text-base leading-snug">{effect_text}</p>
        {flavor_text && (
          <p className="text-sm italic leading-snug opacity-70">
            {flavor_text}
          </p>
        )}
      </div>

      {comingSoon && (
        <div
          data-testid="coming-soon-overlay"
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/70 text-base font-bold uppercase tracking-widest"
          style={{ color }}
        >
          Coming Soon
        </div>
      )}
    </article>
  )
}
