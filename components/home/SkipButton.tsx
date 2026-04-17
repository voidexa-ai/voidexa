'use client'

import { SKIP_BUTTON_VISIBLE_FROM } from '@/lib/cinematic/config'

interface Props {
  elapsed: number
  onSkip: () => void
  hidden?: boolean
}

export default function SkipButton({ elapsed, onSkip, hidden = false }: Props) {
  const visible = elapsed >= SKIP_BUTTON_VISIBLE_FROM && !hidden
  const opacity = visible
    ? Math.min(1, (elapsed - SKIP_BUTTON_VISIBLE_FROM) / 0.5)
    : 0

  return (
    <button
      type="button"
      aria-label="Skip cinematic intro"
      onClick={onSkip}
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 50,
        opacity,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.5s ease-out',
        background: 'rgba(8,12,24,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 999,
        color: 'rgba(230,240,255,0.95)',
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
