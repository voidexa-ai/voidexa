'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { CardTemplate, GameCardRarity } from '@/lib/game/cards/index'
import type { PackTier } from '@/lib/game/packs/types'

export interface PackOpenResult {
  tier: PackTier
  cardIds: string[]
  rarities: GameCardRarity[]
  cards: (CardTemplate | undefined)[]
  mythicPulled: boolean
  mythicRemaining: number | null
}

interface Props {
  result: PackOpenResult
  onDismiss: () => void
}

const RARITY_COLOR: Record<GameCardRarity, string> = {
  common:    '#b0b0c4',
  uncommon:  '#5ac8fa',
  rare:      '#5aa0fa',
  legendary: '#ffba3c',
  mythic:    '#c832ff',
  pioneer:   '#af52de',
}

export default function PackOpeningAnimation({ result, onDismiss }: Props) {
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (revealed >= result.cards.length) return
    // Mythic pause: if the next card is the Mythic best slot, delay reveal.
    const nextIsMythic = result.rarities[revealed] === 'mythic'
    const delay = nextIsMythic ? 1500 : 600
    const t = window.setTimeout(() => setRevealed(v => v + 1), delay)
    return () => window.clearTimeout(t)
  }, [revealed, result.cards.length, result.rarities])

  const allRevealed = revealed >= result.cards.length

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={S.header}>
          <span style={S.eyebrow}>
            {result.tier.charAt(0).toUpperCase() + result.tier.slice(1)} Pack
          </span>
          <div style={S.title}>{allRevealed ? 'Collection Updated' : 'Opening…'}</div>
        </div>

        <div style={S.row}>
          {result.cards.map((card, i) => {
            const rarity = result.rarities[i]
            const color = RARITY_COLOR[rarity]
            const isOpen = i < revealed
            return (
              <motion.div
                key={i}
                initial={{ rotateY: 180, y: 30, opacity: 0 }}
                animate={
                  isOpen
                    ? { rotateY: 0, y: 0, opacity: 1 }
                    : { rotateY: 180, y: 30, opacity: 0.5 }
                }
                transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                style={{
                  ...S.card,
                  borderColor: `${color}aa`,
                  boxShadow: `0 0 28px ${color}55`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {isOpen ? (
                  <>
                    <div style={{ ...S.rarity, color }}>{rarity.toUpperCase()}</div>
                    <div style={S.name}>{card?.name ?? '?'}</div>
                    <div style={S.ability}>{card?.abilityText ?? ''}</div>
                    <div style={S.cost}>{card ? `${card.cost} ⚡` : ''}</div>
                  </>
                ) : (
                  <div style={S.back} aria-hidden>?</div>
                )}
              </motion.div>
            )
          })}
        </div>

        {result.mythicPulled && result.mythicRemaining !== null && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={S.mythicBanner}
            >
              ⚠ MYTHIC PULLED · {result.mythicRemaining} remaining in the universe
            </motion.div>
          </AnimatePresence>
        )}

        <div style={S.actions}>
          <button
            onClick={onDismiss}
            disabled={!allRevealed}
            style={{ ...S.dismissBtn, opacity: allRevealed ? 1 : 0.45, cursor: allRevealed ? 'pointer' : 'wait' }}
          >
            {allRevealed ? 'Done' : '...'}
          </button>
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,1,10,0.94)',
    backdropFilter: 'blur(10px)',
    zIndex: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inner: {
    maxWidth: 1080,
    width: '100%',
    padding: 30,
    fontFamily: 'var(--font-sans)',
    color: '#e8e4f0',
  },
  header: { textAlign: 'center', marginBottom: 22 },
  eyebrow: { fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ffd166', fontWeight: 600 },
  title: { fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 6 },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: 12,
    marginBottom: 22,
  },
  card: {
    position: 'relative',
    height: 220,
    borderRadius: 12,
    border: '1px solid',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.95), rgba(12,14,30,0.95))',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  back: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    fontWeight: 700,
    color: 'rgba(127,119,221,0.4)',
  },
  rarity: {
    fontSize: 11,
    letterSpacing: '0.18em',
    fontWeight: 700,
    textShadow: '0 0 6px currentColor',
  },
  name: { fontSize: 16, fontWeight: 600, color: '#fff' },
  ability: { fontSize: 13, lineHeight: 1.45, color: 'rgba(220,216,230,0.82)', flex: 1, overflow: 'hidden' },
  cost: { fontSize: 14, color: '#ffd166', alignSelf: 'flex-end', fontWeight: 600 },
  mythicBanner: {
    margin: '0 auto 22px',
    maxWidth: 540,
    padding: '12px 18px',
    borderRadius: 10,
    background: 'rgba(200,50,255,0.14)',
    border: '1px solid rgba(200,50,255,0.6)',
    color: '#e5b0ff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textShadow: '0 0 10px rgba(200,50,255,0.7)',
  },
  actions: { display: 'flex', justifyContent: 'center' },
  dismissBtn: {
    padding: '12px 32px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #00d4ff, #af52de)',
    color: '#050210',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.02em',
    fontFamily: 'inherit',
    boxShadow: '0 0 22px rgba(0,212,255,0.35)',
  },
}
