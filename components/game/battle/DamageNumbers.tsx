'use client'

import { AnimatePresence, motion } from 'framer-motion'

export type DamageEventKind = 'damage' | 'heal' | 'shield'
export type DamageSide = 'player' | 'enemy'

export interface FloatEvent {
  id: string
  kind: DamageEventKind
  amount: number
  side: DamageSide
}

interface Props {
  events: FloatEvent[]
}

const COLOR: Record<DamageEventKind, string> = {
  damage: '#ff5a5a',
  heal: '#7fff7f',
  shield: '#7fd8ff',
}

// Screen anchor positions (percent of viewport). Player bottom-center, enemy top-center.
const ANCHOR: Record<DamageSide, { left: string; top: string }> = {
  player: { left: '50%', top: '68%' },
  enemy: { left: '50%', top: '32%' },
}

export default function DamageNumbers({ events }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
      <AnimatePresence>
        {events.map(ev => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 0, scale: 0.65 }}
            animate={{ opacity: 1, y: -80, scale: 1.1 }}
            exit={{ opacity: 0, y: -110, scale: 0.9 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: ANCHOR[ev.side].left,
              top: ANCHOR[ev.side].top,
              transform: 'translate(-50%, -50%)',
              fontFamily: 'var(--font-sans)',
              fontSize: 28,
              fontWeight: 600,
              color: COLOR[ev.kind],
              textShadow: '0 0 12px currentColor, 0 2px 6px rgba(0,0,0,0.85)',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {ev.kind === 'damage' && `-${ev.amount}`}
            {ev.kind === 'heal' && `+${ev.amount}`}
            {ev.kind === 'shield' && `⛨ ${ev.amount}`}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
