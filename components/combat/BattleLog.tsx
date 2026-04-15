'use client'

import { useEffect, useRef } from 'react'
import { CombatantSide, type BattleLogEntry } from './CombatEngine'

export interface BattleLogProps {
  entries: ReadonlyArray<BattleLogEntry>
  selfSide: CombatantSide
  /** Max height in px. Default 220. */
  maxHeight?: number
}

export default function BattleLog({ entries, selfSide, maxHeight = 220 }: BattleLogProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [entries.length])

  return (
    <div
      ref={ref}
      style={{
        maxHeight,
        overflowY: 'auto',
        padding: 12,
        background: 'rgba(0,0,0,0.65)',
        border: '1px solid rgba(34,211,238,0.3)',
        borderRadius: 8,
        fontSize: 14,
        lineHeight: 1.4,
        color: '#e5f7fa',
        scrollbarColor: '#22d3ee rgba(0,0,0,0.4)',
        scrollbarWidth: 'thin',
      }}
      aria-live="polite"
      role="log"
    >
      {entries.length === 0 ? (
        <div style={{ opacity: 0.5, fontStyle: 'italic' }}>Battle log will appear here…</div>
      ) : (
        entries.map((entry, i) => {
          const isSelf = entry.side === selfSide
          const sideColor = isSelf ? '#67e8f9' : '#fb7185'
          const isBackfire = entry.meta?.backfire === true
          return (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
              <span
                style={{
                  fontSize: 12,
                  color: 'rgba(229,247,250,0.4)',
                  fontVariantNumeric: 'tabular-nums',
                  width: 28,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                T{entry.turn}
              </span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: sideColor,
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: isBackfire ? '#fbbf24' : '#e5f7fa',
                  fontWeight: isBackfire ? 600 : 400,
                }}
              >
                {entry.message}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
