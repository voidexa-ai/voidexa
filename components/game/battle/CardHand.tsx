'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { CardInstance } from '@/lib/game/battle/types'

interface Props {
  cards: CardInstance[]
  energy: number
  playerTurn: boolean
  onPlay: (instanceId: string) => void
  /** instanceIds currently animating out */
  playing: Set<string>
}

const TYPE_ICON: Record<string, string> = {
  weapon: '⚔',
  defense: '◈',
  maneuver: '↗',
  drone: '⬢',
  ai: '◉',
  consumable: '⚗',
}

const RARITY_BORDER: Record<string, string> = {
  common: 'rgba(176,176,196,0.45)',
  uncommon: 'rgba(90,200,250,0.55)',
  rare: 'rgba(90,160,250,0.75)',
  legendary: 'rgba(255,186,60,0.7)',
  mythic: 'rgba(200,50,255,0.8)',
  pioneer: 'rgba(175,82,222,0.75)',
}

const RARITY_GLOW: Record<string, string> = {
  common: 'rgba(176,176,196,0.12)',
  uncommon: 'rgba(90,200,250,0.22)',
  rare: 'rgba(90,160,250,0.3)',
  legendary: 'rgba(255,186,60,0.35)',
  mythic: 'rgba(200,50,255,0.45)',
  pioneer: 'rgba(175,82,222,0.4)',
}

export default function CardHand({ cards, energy, playerTurn, onPlay, playing }: Props) {
  // Layout cards on an arc: center card highest and straight, cards on either side tilt outward.
  const count = cards.length
  const fanSpread = Math.min(36, 8 * count) // degrees across
  const step = count > 1 ? fanSpread / (count - 1) : 0
  const radius = 700

  return (
    <div style={S.wrap}>
      <AnimatePresence initial={false}>
        {cards.map((card, i) => {
          const angle = count === 1 ? 0 : -fanSpread / 2 + step * i
          const rad = (angle * Math.PI) / 180
          const xOffset = Math.sin(rad) * 40 * Math.min(1, count / 6)
          const yOffset = (1 - Math.cos(rad)) * 24
          const affordable = card.cost <= energy
          const playable = playerTurn && affordable && !playing.has(card.instanceId)
          const exiting = playing.has(card.instanceId)
          return (
            <motion.button
              key={card.instanceId}
              onClick={() => playable && onPlay(card.instanceId)}
              disabled={!playable}
              initial={{ y: 180, opacity: 0, scale: 0.85 }}
              animate={
                exiting
                  ? { y: -radius * 0.35, scale: 1.3, opacity: 0, rotate: 0 }
                  : { y: yOffset, opacity: 1, scale: 1, rotate: angle }
              }
              exit={{ y: -200, opacity: 0, scale: 0.8 }}
              transition={{ duration: exiting ? 0.55 : 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={playable ? { y: yOffset - 22, scale: 1.06, rotate: angle * 0.35, transition: { duration: 0.2 } } : undefined}
              style={{
                ...S.card,
                transform: `translateX(${xOffset}px)`,
                borderColor: RARITY_BORDER[card.rarity] ?? RARITY_BORDER.common,
                boxShadow: `0 8px 28px rgba(0,0,0,0.7), 0 0 22px ${RARITY_GLOW[card.rarity] ?? RARITY_GLOW.common}`,
                opacity: playable ? 1 : 0.45,
                cursor: playable ? 'pointer' : 'not-allowed',
              }}
              data-rarity={card.rarity}
            >
              <div style={S.cost}>{card.cost}</div>
              <div style={S.typeIcon}>{TYPE_ICON[card.type] ?? '◆'}</div>
              <div style={{
                ...S.art,
                background: `radial-gradient(circle at 50% 40%, ${RARITY_GLOW[card.rarity] ?? RARITY_GLOW.common}, transparent 72%)`,
              }}>
                <div style={{
                  ...S.artIcon,
                  color: RARITY_BORDER[card.rarity] ?? RARITY_BORDER.common,
                }}>{TYPE_ICON[card.type] ?? '◆'}</div>
              </div>
              <div style={S.name}>{card.name}</div>
              <div style={S.abilityText}>{card.abilityText}</div>
              {affordable ? (
                <div style={S.affordDot} />
              ) : (
                <div style={S.unaffordDot}>⚡</div>
              )}
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    pointerEvents: 'auto',
    padding: '0 24px 10px',
    zIndex: 20,
    perspective: 1400,
  },
  card: {
    position: 'relative',
    width: 160,
    height: 232,
    padding: 10,
    borderRadius: 12,
    border: '1px solid',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.95) 0%, rgba(12,14,30,0.95) 100%)',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
    textAlign: 'left',
    transformOrigin: 'bottom center',
    flexShrink: 0,
    transition: 'box-shadow 0.2s',
  },
  cost: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%, #7ff7ff, #1d6b8a)',
    color: '#071019',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    boxShadow: '0 0 10px rgba(125,245,255,0.6)',
    zIndex: 2,
  },
  typeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 16,
    color: 'rgba(220,216,230,0.8)',
    zIndex: 2,
  },
  art: {
    position: 'relative',
    marginTop: 34,
    height: 82,
    borderRadius: 6,
    background: '#000',
    overflow: 'hidden',
  },
  artIcon: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    opacity: 0.55,
  },
  name: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
  },
  abilityText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 1.35,
    color: 'rgba(220,216,230,0.78)',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  affordDot: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#7fff9f',
    boxShadow: '0 0 8px #7fff9f',
  },
  unaffordDot: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    fontSize: 14,
    color: '#ff8a3c',
    textShadow: '0 0 8px #ff8a3c',
  },
}
