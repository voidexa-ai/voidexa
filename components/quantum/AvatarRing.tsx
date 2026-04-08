'use client'

import { motion } from 'framer-motion'
import type { QuantumCharacter } from '@/types/quantum'

interface AvatarRingProps {
  characters: QuantumCharacter[]
  activeId: string | null
  thinkingIds: string[]
}

export default function AvatarRing({ characters, activeId, thinkingIds }: AvatarRingProps) {
  const size = 280
  const radius = 100
  const center = size / 2

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Connection lines */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        style={{ pointerEvents: 'none' }}
      >
        {characters.map((c, i) => {
          const angle1 = (i / characters.length) * Math.PI * 2 - Math.PI / 2
          const x1 = center + radius * Math.cos(angle1)
          const y1 = center + radius * Math.sin(angle1)
          return characters.slice(i + 1).map((c2, j) => {
            const idx2 = i + j + 1
            const angle2 = (idx2 / characters.length) * Math.PI * 2 - Math.PI / 2
            const x2 = center + radius * Math.cos(angle2)
            const y2 = center + radius * Math.sin(angle2)
            return (
              <line
                key={`${c.id}-${c2.id}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(119,119,187,0.15)"
                strokeWidth={1}
              />
            )
          })
        })}
      </svg>

      {/* Center label */}
      <div
        className="absolute font-bold tracking-wider"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-space)',
          fontSize: 12,
          color: 'rgba(119,119,187,0.6)',
          letterSpacing: '0.2em',
        }}
      >
        QUANTUM
      </div>

      {/* Avatars */}
      {characters.map((char, i) => {
        const angle = (i / characters.length) * Math.PI * 2 - Math.PI / 2
        const x = center + radius * Math.cos(angle) - 24
        const y = center + radius * Math.sin(angle) - 24
        const isActive = activeId === char.id
        const isThinking = thinkingIds.includes(char.id)

        return (
          <motion.div
            key={char.id}
            className="absolute flex flex-col items-center"
            style={{ left: x, top: y, width: 48 }}
            animate={
              isThinking
                ? { scale: [1, 1.08, 1], opacity: [1, 0.7, 1] }
                : isActive
                ? { scale: 1.1 }
                : { scale: 1 }
            }
            transition={
              isThinking
                ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
          >
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: 48,
                height: 48,
                border: `2px solid ${isActive ? char.color : 'rgba(119,119,187,0.3)'}`,
                boxShadow: isActive ? `0 0 16px ${char.glow}` : 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={char.image}
                alt={char.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <span
              className="text-center mt-1 font-medium"
              style={{ fontSize: 11, color: isActive ? char.color : '#94a3b8' }}
            >
              {char.name}
            </span>
            <span
              className="text-center"
              style={{ fontSize: 9, color: '#64748b' }}
            >
              {char.role}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
