'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DirectorySidebar from './DirectorySidebar'
import { GALAXY_PLANETS, type CompanyPlanet } from './companies'

const GalaxyCanvas = dynamic(() => import('./GalaxyCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function GalaxyPage() {
  const router = useRouter()
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [warping, setWarping] = useState(false)
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const handleWarpTo = (planet: CompanyPlanet) => {
    setHighlightedId(planet.id)
    setFocusTarget([planet.position[0], planet.position[1], planet.position[2]])
    if (planet.path) {
      window.setTimeout(() => router.push(planet.path), 650)
    }
  }

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
      <GalaxyCanvas
        highlightedId={highlightedId}
        onHoverChange={setHighlightedId}
        onWarpChange={setWarping}
        focusTarget={focusTarget}
        onFocusConsumed={() => setFocusTarget(null)}
      />

      <DirectorySidebar
        planets={GALAXY_PLANETS}
        highlightedId={highlightedId}
        onHighlight={setHighlightedId}
        onWarpTo={handleWarpTo}
      />

      {/* Top badge */}
      <div style={{
        position: 'fixed',
        top: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        padding: '8px 18px',
        background: 'rgba(6, 8, 18, 0.55)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 212, 255, 0.25)',
        borderRadius: 999,
        color: 'rgba(255,255,255,0.92)',
        fontSize: 14,
        fontFamily: 'var(--font-space, system-ui)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>
        Galaxy View · Level 1
      </div>

      {/* Hint */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        color: 'rgba(255,255,255,0.55)',
        fontSize: 14,
        letterSpacing: '0.08em',
        fontFamily: 'var(--font-inter, system-ui)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
      }}>
        Drag to rotate · Scroll to zoom · Click a planet to enter its system
      </div>

      {/* Explore the Universe (Free Flight entry) */}
      <button
        onClick={() => router.push('/freeflight')}
        disabled={warping}
        style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          padding: '12px 28px',
          background: 'linear-gradient(135deg, rgba(0,120,180,0.5), rgba(139,92,246,0.45))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.5)',
          borderRadius: 999,
          color: '#fff',
          fontSize: 16,
          fontFamily: 'var(--font-space, system-ui)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: warping ? 'default' : 'pointer',
          boxShadow: '0 0 22px rgba(0, 212, 255, 0.35)',
          textShadow: '0 0 10px #00d4ff',
          opacity: warping ? 0.4 : 1,
        }}
      >
        Explore the Universe
      </button>

      {/* Sprint 16 Task 6 — thin full-width footer strip at z:10, low-opacity
          gradient so it doesn't compete with the scene but still anchors the
          brand. Font bumped to 14 px to clear the 14 px label minimum. */}
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 28,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'var(--font-inter, system-ui)',
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, transparent, rgba(2,4,14,0.55))',
      }}>
        Operating globally from Denmark · CVR 46343387
      </div>

      {/* Back to voidexa home */}
      <button
        onClick={() => router.push('/')}
        disabled={warping}
        style={{
          position: 'fixed',
          top: 18,
          right: 18,
          zIndex: 30,
          padding: '8px 16px',
          background: 'rgba(6, 8, 18, 0.65)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: 6,
          color: 'rgba(255,255,255,0.9)',
          fontSize: 14,
          fontFamily: 'var(--font-inter, system-ui)',
          letterSpacing: '0.04em',
          cursor: warping ? 'default' : 'pointer',
          opacity: warping ? 0.4 : 1,
        }}
      >
        ← Home
      </button>
    </div>
  )
}
