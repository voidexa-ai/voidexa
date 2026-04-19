'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import StarMapPage from '@/components/starmap/StarMapPage'

const LAUNCH_DELAY_MS = 2200

export default function VoidexaSystem() {
  const router = useRouter()
  const [launching, setLaunching] = useState(false)

  const enterFreeFlight = () => {
    if (launching) return
    setLaunching(true)
    window.setTimeout(() => router.push('/freeflight'), LAUNCH_DELAY_MS)
  }

  return (
    <>
      <StarMapPage />
      <button
        onClick={() => router.push('/starmap')}
        style={{
          position: 'fixed',
          top: 80,
          left: 18,
          zIndex: 60,
          padding: '8px 16px',
          background: 'rgba(6, 8, 18, 0.72)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.35)',
          borderRadius: 6,
          color: 'rgba(255,255,255,0.92)',
          fontSize: 14,
          fontFamily: 'var(--font-inter, system-ui)',
          letterSpacing: '0.04em',
          cursor: 'pointer',
        }}
      >
        ← Back to Galaxy
      </button>

      {/* Sprint 15 Task 8: Level 2 → Free Flight entry, bottom-center, glass
          pill styled to mirror the Galaxy View CTA. */}
      <button
        data-testid="cta-level2-free-flight"
        onClick={enterFreeFlight}
        disabled={launching}
        style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          padding: '14px 28px',
          minWidth: 260,
          background: launching
            ? 'linear-gradient(120deg, rgba(127,216,255,0.2), rgba(167,139,250,0.2))'
            : 'linear-gradient(120deg, #7fd8ff, #a78bfa)',
          color: '#02101e',
          border: 'none',
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: launching ? 'default' : 'pointer',
          fontFamily: 'var(--font-sans)',
          boxShadow: '0 0 26px rgba(127,216,255,0.55), 0 0 64px rgba(167,139,250,0.35)',
          opacity: launching ? 0.95 : 1,
        }}
      >
        {launching ? 'Requisitioning your ship…' : 'Enter Free Flight'}
      </button>

      {launching && (
        <div
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            fontFamily: 'var(--font-inter, system-ui)',
            fontSize: 14,
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.78)',
            textShadow: '0 0 10px rgba(127,216,255,0.4)',
          }}
        >
          Requisitioning your ship from docking bay…
        </div>
      )}

      <div style={{
        position: 'fixed',
        bottom: 10,
        right: 16,
        zIndex: 60,
        fontSize: 14,
        letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'var(--font-inter, system-ui)',
        pointerEvents: 'none',
      }}>
        Operating globally from Denmark · CVR 46343387
      </div>
    </>
  )
}
