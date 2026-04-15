'use client'

import { useState } from 'react'
import type { CoreSetCard } from '@/lib/cards/starter_set'
import { STARTER_CATALOGUE } from '@/lib/cards/starter_set'
import CardComponent from './CardComponent'

export interface CardHandProps {
  /** Card ids in the active player's hand. */
  hand: ReadonlyArray<string>
  /** Available energy — used to dim non-affordable cards. */
  energy: number
  /** Player's turn? Cards greyed out + un-clickable when false. */
  isYourTurn: boolean
  onPlayCard: (cardId: string) => void
}

export default function CardHand({ hand, energy, isYourTurn, onPlayCard }: CardHandProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const cards = hand
    .map((id) => STARTER_CATALOGUE[id])
    .filter((c): c is CoreSetCard => Boolean(c))

  const n = cards.length
  // Layout: cards fan along an arc. center index gets 0deg rotation.
  const ARC_DEG = Math.min(20 + n * 4, 60) // wider with more cards
  const RADIUS = 800

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 220,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        pointerEvents: isYourTurn ? 'auto' : 'none',
        opacity: isYourTurn ? 1 : 0.55,
      }}
      aria-label="Your card hand"
    >
      {cards.length === 0 && (
        <div style={{ color: 'rgba(229,247,250,0.4)', fontSize: 14, padding: 32 }}>
          (empty hand — wait for next draw)
        </div>
      )}
      {cards.map((card, i) => {
        const center = (n - 1) / 2
        const offset = i - center
        const rotate = (offset / Math.max(center, 0.5)) * ARC_DEG
        const lift = hoverIdx === i ? 60 : 0
        const z = hoverIdx === i ? 100 : i
        const affordable = energy >= card.energyCost
        return (
          <div
            key={`${card.id}-${i}`}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: `translateX(-50%) translateX(${offset * 90}px) translateY(-${lift}px) rotate(${rotate}deg)`,
              transformOrigin: `50% ${RADIUS}px`,
              transition: 'transform 0.18s ease',
              zIndex: z,
              cursor: affordable ? 'pointer' : 'not-allowed',
            }}
          >
            <CardComponent
              card={card}
              size="compact"
              affordable={affordable}
              hoverEnlarge={true}
              disabled={!affordable || !isYourTurn}
              onClick={() => isYourTurn && affordable && onPlayCard(card.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
