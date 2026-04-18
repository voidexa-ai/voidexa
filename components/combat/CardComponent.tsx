'use client'

import { useState } from 'react'
import { CardCategory, CardRarity } from '@/lib/game/cards'
import type { CoreSetCard } from '@/lib/cards/starter_set'
import { ALIEN_BACKFIRE_CHANCE } from '@/lib/cards/starter_set'
import { CATEGORY_COLORS, RARITY_GLOW, cardArtPath } from './cardArt'

export interface CardComponentProps {
  card: CoreSetCard
  /** Optional badge in the top-right corner (e.g. owned count). */
  ownedCount?: number
  /** Reduced-energy guard. When false, the card renders dimmed. */
  affordable?: boolean
  /** Click handler — receives the card. */
  onClick?: (card: CoreSetCard) => void
  /** Drag-start handler — for drag-to-deck workflows. */
  onDragStart?: (card: CoreSetCard) => void
  /** Compact mode for in-deck rows. Default: false (full size 200×280). */
  size?: 'compact' | 'normal' | 'large'
  /** Hover-enlarge — default true on `normal`, false on others. */
  hoverEnlarge?: boolean
  /** Disabled (greyed out). */
  disabled?: boolean
  /** Optional keyword labels shown as chips under the effect text. */
  keywords?: string[]
}

const SIZES = {
  compact: { w: 120, h: 168, font: 12 },
  normal:  { w: 200, h: 280, font: 14 },
  large:   { w: 280, h: 392, font: 16 },
}

export default function CardComponent({
  card,
  ownedCount,
  affordable = true,
  onClick,
  onDragStart,
  size = 'normal',
  hoverEnlarge,
  disabled,
  keywords,
}: CardComponentProps) {
  const [hover, setHover] = useState(false)
  const enlarge = hoverEnlarge ?? size === 'normal'
  const dim = SIZES[size]
  const glow = RARITY_GLOW[card.rarity]
  const catColor = CATEGORY_COLORS[card.category] ?? '#67e8f9'
  const art = cardArtPath(card.id)

  const scale = hover && enlarge && !disabled ? 1.08 : 1
  const dimAlpha = disabled || !affordable ? 0.45 : 1

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => !disabled && onClick?.(card)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) onClick?.(card)
      }}
      draggable={!!onDragStart && !disabled}
      onDragStart={(e) => {
        if (!onDragStart) return
        e.dataTransfer.setData('application/voidexa-card-id', card.id)
        e.dataTransfer.effectAllowed = 'copy'
        onDragStart(card)
      }}
      style={{
        width: dim.w,
        height: dim.h,
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: 'linear-gradient(180deg, rgba(15,17,28,0.95) 0%, rgba(8,10,18,0.95) 100%)',
        border: `2px solid ${glow}`,
        borderRadius: 12,
        boxShadow: hover ? `0 0 24px ${glow}80, 0 0 6px ${glow}` : `0 0 8px ${glow}40`,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        opacity: dimAlpha,
        overflow: 'hidden',
        color: '#e5f7fa',
        fontSize: dim.font,
        userSelect: 'none',
      }}
      aria-label={`${card.name} — ${card.rarity} ${card.category} card, costs ${card.energyCost} energy`}
    >
      {/* Top header — energy + rarity + owned badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 8px',
          background: 'rgba(0,0,0,0.55)',
          borderBottom: `1px solid ${glow}40`,
        }}
      >
        <div
          style={{
            background: '#67e8f9',
            color: '#0a0a0f',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: dim.font,
          }}
          aria-label={`Energy ${card.energyCost}`}
        >
          {card.energyCost}
        </div>
        <div
          style={{
            color: glow,
            fontSize: dim.font - 2,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {card.rarity}
        </div>
        {ownedCount !== undefined && (
          <div
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: `1px solid ${glow}`,
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: dim.font - 2,
              minWidth: 32,
              textAlign: 'center',
            }}
            aria-label={`Owned: ${ownedCount}`}
          >
            ×{ownedCount}
          </div>
        )}
      </div>

      {/* Art */}
      <div
        style={{
          height: dim.h * 0.42,
          background: art
            ? `url(${art}) center/cover no-repeat, #0a0a0f`
            : `linear-gradient(135deg, ${catColor}33 0%, #0a0a0f 70%)`,
          borderBottom: `1px solid ${glow}40`,
          position: 'relative',
        }}
      >
        {!art && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 32,
              opacity: 0.6,
              color: catColor,
            }}
          >
            ◆
          </div>
        )}
      </div>

      {/* Title + category */}
      <div style={{ padding: '6px 10px 4px' }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: dim.font + 1,
            color: '#e5f7fa',
            lineHeight: 1.1,
            marginBottom: 2,
          }}
        >
          {card.name}
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: dim.font - 2,
            color: catColor,
            background: `${catColor}22`,
            border: `1px solid ${catColor}66`,
            padding: '1px 6px',
            borderRadius: 4,
          }}
        >
          {card.category}
        </div>
      </div>

      {/* Effect text */}
      <div
        style={{
          padding: '4px 10px 8px',
          fontSize: dim.font - 1,
          color: 'rgba(229,247,250,0.85)',
          lineHeight: 1.25,
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {card.primaryEffect}
        {keywords && keywords.length > 0 && (
          <div
            style={{
              marginTop: 4,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            {keywords.map((kw) => (
              <span
                key={kw}
                style={{
                  fontSize: dim.font - 3,
                  color: glow,
                  background: `${glow}18`,
                  border: `1px solid ${glow}55`,
                  borderRadius: 3,
                  padding: '1px 5px',
                  letterSpacing: '0.02em',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Alien backfire warning */}
      {card.category === CardCategory.Alien && (
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            left: 6,
            right: 6,
            fontSize: dim.font - 3,
            color: '#fbbf24',
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 4px',
            borderRadius: 3,
            border: '1px solid rgba(251,191,36,0.5)',
          }}
        >
          ⚠ {Math.round((card.backfireChance ?? ALIEN_BACKFIRE_CHANCE) * 100)}% backfire
        </div>
      )}

      {/* Hover detail tooltip — full description */}
      {hover && enlarge && (
        <div
          style={{
            position: 'absolute',
            left: '100%',
            top: 0,
            marginLeft: 8,
            width: 240,
            padding: 10,
            background: 'rgba(0,0,0,0.92)',
            border: `1px solid ${glow}`,
            borderRadius: 8,
            color: '#e5f7fa',
            fontSize: 14,
            lineHeight: 1.4,
            zIndex: 100,
            pointerEvents: 'none',
            boxShadow: `0 0 24px ${glow}80`,
          }}
        >
          <div style={{ fontWeight: 700, color: glow, marginBottom: 4 }}>
            {card.name}
          </div>
          <div style={{ marginBottom: 6, opacity: 0.8 }}>{card.description}</div>
          <div style={{ marginBottom: 4 }}>
            <strong style={{ color: catColor }}>Effect:</strong> {card.primaryEffect}
          </div>
          {card.backfireEffect && (
            <div style={{ color: '#fbbf24' }}>
              <strong>Backfire:</strong> {card.backfireEffect}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** Convenience: tiny rarity-only chip (used in deck builder filters). */
export function RarityChip({ rarity, active, onClick }: {
  rarity: CardRarity
  active?: boolean
  onClick?: () => void
}) {
  const glow = RARITY_GLOW[rarity]
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        borderRadius: 6,
        background: active ? `${glow}33` : 'transparent',
        border: `1px solid ${active ? glow : `${glow}55`}`,
        color: active ? '#fff' : glow,
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
      }}
    >
      {rarity}
    </button>
  )
}

export { RARITY_GLOW, CATEGORY_COLORS }
