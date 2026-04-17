'use client'

import { useState } from 'react'
import { SKIP_BUTTON_VISIBLE_FROM } from '@/lib/cinematic/config'

interface Props {
  elapsed: number
  onSkip: () => void
  hidden?: boolean
}

export default function SkipButton({ elapsed, onSkip, hidden = false }: Props) {
  const [hover, setHover] = useState(false)
  const visible = elapsed >= SKIP_BUTTON_VISIBLE_FROM && !hidden
  const fadeIn = visible
    ? Math.min(1, (elapsed - SKIP_BUTTON_VISIBLE_FROM) / 0.5)
    : 0
  const baseOpacity = hover ? 1 : 0.7
  const opacity = fadeIn * baseOpacity

  return (
    <button
      type="button"
      aria-label="Skip cinematic intro"
      onClick={onSkip}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 100,
        opacity,
        pointerEvents: visible ? 'auto' : 'none',
        transform: `scale(${hover ? 1.05 : 1})`,
        transition: 'opacity 0.35s ease-out, transform 0.2s ease-out',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 999,
        color: '#ffffff',
        padding: '10px 18px',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      Skip ›
    </button>
  )
}
