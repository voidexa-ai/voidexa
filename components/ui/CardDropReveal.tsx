'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { CardTemplate, GameCardRarity } from '@/lib/game/cards/index'

interface Props {
  card: CardTemplate
  rarity: GameCardRarity
  onDismiss?: () => void
}

const RARITY_COLOR: Record<GameCardRarity, string> = {
  common:    '#b0b0c4',
  uncommon:  '#5ac8fa',
  rare:      '#5aa0fa',
  legendary: '#ffba3c',
  mythic:    '#c832ff',
  pioneer:   '#af52de',
}

export default function CardDropReveal({ card, rarity, onDismiss }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVisible(false)
      window.setTimeout(() => onDismiss?.(), 400)
    }, 3000)
    return () => window.clearTimeout(t)
  }, [onDismiss])

  const color = RARITY_COLOR[rarity]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 40, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 24,
            zIndex: 90,
            width: 260,
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(6,10,20,0.92)',
            border: `1px solid ${color}aa`,
            boxShadow: `0 0 24px ${color}55`,
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-sans)',
            color: '#e8f4ff',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color,
              fontWeight: 700,
              textShadow: `0 0 8px ${color}88`,
              marginBottom: 4,
            }}
          >
            NEW CARD · {rarity}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 3 }}>
            {card.name}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.45, color: 'rgba(220,236,255,0.82)' }}>
            {card.abilityText}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
