'use client'

import { useEffect, useRef, useState } from 'react'
import type { QuantumCharacter } from '@/types/quantum'

interface DebateMessageProps {
  character: QuantumCharacter
  text: string
  streaming?: boolean
  strikethrough?: boolean
  agreement?: boolean
}

export default function DebateMessage({
  character,
  text,
  streaming = false,
  strikethrough = false,
  agreement = false,
}: DebateMessageProps) {
  // Character-by-character typewriter. We track `visibleLen` rather than a
  // displayed string so new chunks arriving via the `text` prop don't reset
  // progress — the cursor keeps advancing forward toward the growing target.
  const [visibleLen, setVisibleLen] = useState<number>(() =>
    streaming ? 0 : text.length
  )
  const targetLenRef = useRef<number>(text.length)
  targetLenRef.current = text.length

  useEffect(() => {
    if (!streaming) {
      // Finalized: show the full text immediately.
      setVisibleLen(text.length)
      return
    }
    const iv = setInterval(() => {
      setVisibleLen(prev =>
        prev >= targetLenRef.current ? prev : prev + 1
      )
    }, 18)
    return () => clearInterval(iv)
  }, [streaming, text])

  const displayed = text.slice(0, visibleLen)

  return (
    <div
      className="flex items-start gap-3 py-2.5 px-3 rounded-lg"
      style={{
        background: agreement ? 'rgba(74,222,128,0.06)' : 'transparent',
        borderLeft: `2px solid ${character.color}33`,
      }}
    >
      {/* Avatar */}
      <div
        className="rounded-full overflow-hidden shrink-0"
        style={{ width: 30, height: 30, border: `1.5px solid ${character.color}66` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={character.image}
          alt={character.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-semibold" style={{ fontSize: 14, color: character.color }}>
          {character.name}
        </span>
        <p
          className="leading-relaxed mt-0.5"
          style={{
            fontSize: 15,
            color: '#cbd5e1',
            textDecoration: strikethrough ? 'line-through' : 'none',
            textDecorationColor: strikethrough ? 'rgba(239,68,68,0.5)' : undefined,
          }}
        >
          {displayed}
          {streaming && visibleLen < text.length && (
            <span
              className="inline-block ml-0.5"
              style={{
                width: 2,
                height: 14,
                background: character.color,
                animation: 'quantum-blink 0.8s ease-in-out infinite',
                verticalAlign: 'text-bottom',
              }}
            />
          )}
        </p>
      </div>
    </div>
  )
}
