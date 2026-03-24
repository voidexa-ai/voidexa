'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import CSSStarfield from './CSSStarfield'
import MiniNav from './MiniNav'

// R3F canvas — client-side only, no SSR
const StarMapCanvas = dynamic(() => import('./StarMapCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function StarMapPage() {
  // Lock scroll while on homepage
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* CSS starfield — always visible, shows while WebGL loads */}
      <CSSStarfield />

      {/* R3F canvas — loads progressively on top */}
      <StarMapCanvas />

      {/* Mini navigation overlay */}
      <MiniNav />

      {/* Interaction hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          color: 'rgba(100,116,139,0.55)',
          fontSize: 11,
          letterSpacing: '0.08em',
          fontFamily: 'var(--font-inter, system-ui)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
        }}
      >
        Drag to rotate · Click a star to explore
      </div>
    </div>
  )
}
