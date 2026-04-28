'use client'

/**
 * components/cards/AlphaCardFrame.tsx
 *
 * AFS-6d     - Premium frame for the 1000-card Alpha set.
 * AFS-18     - Per-card image wiring via optional imageUrl prop. When
 *              supplied, renders the unique webp from Supabase Storage
 *              public bucket; otherwise falls back to category PNG.
 * AFS-18b    - Mythic iridescent frame (.mythic-frame in app/globals.css)
 *              + rarity badge experiment (now superseded by 5b layout).
 * AFS-18b/5b - Layout overhaul to match TCG industry grammar
 *              (MTG / Hearthstone / Yu-Gi-Oh):
 *
 *              ┌──────────────────────────┐
 *              │ NAME              [COST] │  header
 *              ├──────────────────────────┤
 *              │       CARD ART           │  image
 *              ├──────────────────────────┤
 *              │ TYPE — RARITY            │  type-line
 *              ├──────────────────────────┤
 *              │ Effect text              │
 *              │ ─────                    │
 *              │ Flavor text (italic)     │
 *              ├──────────────────────────┤
 *              │ ATK 0          DEF 0     │  footer
 *              └──────────────────────────┘
 *
 *              The TYPE pill + rarity badge that lived in the AFS-18b
 *              header are removed; rarity color now tints the type-line
 *              text and the ATK/DEF footer text instead. Visual rarity
 *              hierarchy is preserved.
 *
 * 'use client' is required because the onError handler runs in browser.
 *
 * Color: rarity -> RARITY_GLOW value. Drives the cost circle background,
 * the type-line text + its bottom border tint, the flavor separator, the
 * footer border, and the ATK/DEF text. Mythic still uses the .mythic-frame
 * conic-gradient class for the outer border per AFS-18b Task 5.
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
  // app/globals.css). Outer glow on mythic uses pink + cyan RGBA (2 of 3
  // conic stops); gold stop intentionally omitted from the halo so it
  // does not read as warm-yellow.
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
      {/* Header: name on the left, cost circle on the right. */}
      <header className="flex items-center justify-between gap-2 px-3 py-2">
        <h3 className="truncate text-base font-semibold leading-tight">
          {name}
        </h3>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{ backgroundColor: color, color: '#0a0a0a' }}
          aria-label={`Energy cost ${energy_cost}`}
        >
          {energy_cost}
        </span>
      </header>

      {/* Image. */}
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

      {/* Type-line: TYPE - RARITY in rarity color, single line below image
       * per TCG convention. CSS `uppercase` handles the text-transform so
       * we keep the prop values as-is in JSX (titlecase type, lowercase
       * rarity) for test simplicity. */}
      <p
        data-testid="type-line"
        className="border-b px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
        style={{ color, borderColor: `${color}33` }}
      >
        {type} — {rarity}
      </p>

      {/* Body: effect text, then flavor text separated by a thin top border. */}
      <div className="flex flex-1 flex-col gap-2 px-3 py-3">
        <p className="text-base leading-snug">{effect_text}</p>
        {flavor_text && (
          <p
            className="border-t pt-2 text-sm italic leading-snug opacity-70"
            style={{ borderColor: `${color}33` }}
          >
            {flavor_text}
          </p>
        )}
      </div>

      {/* Footer: ATK left, DEF right (opposite corners via justify-between).
       * Empty placeholders preserve corner positioning when only one stat
       * is set (e.g. weapon-style ATK-only or shield-style DEF-only). */}
      {hasStats && (
        <footer
          className="flex items-center justify-between gap-2 border-t px-3 py-2 text-sm font-mono uppercase"
          style={{ borderColor: `${color}33` }}
        >
          {attack !== undefined ? (
            <span data-testid="stat-attack" style={{ color }}>
              ATK {attack}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          {defense !== undefined ? (
            <span data-testid="stat-defense" style={{ color }}>
              DEF {defense}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
        </footer>
      )}

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
