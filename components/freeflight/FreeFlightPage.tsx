'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CockpitHUD from './cockpit/CockpitHUD'
import type { ShipState } from './types'
import { createShipState } from './types'

const FreeFlightCanvas = dynamic(() => import('./FreeFlightCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function FreeFlightPage() {
  const router = useRouter()
  const shipRef = useRef<ShipState>(createShipState())
  const [firstPerson, setFirstPerson] = useState(false)
  const [dockPrompt, setDockPrompt] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setMenuOpen(v => !v)
        if (document.pointerLockElement) document.exitPointerLock()
      }
      if (e.code === 'KeyE' && dockPrompt) {
        setMenuOpen(true)
        if (document.pointerLockElement) document.exitPointerLock()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dockPrompt])

  const onShipState = (ref: React.MutableRefObject<ShipState>) => {
    shipRef.current = ref.current
  }

  const exitToGalaxy = () => router.push('/starmap')

  return (
    <div style={{
      position: 'fixed', inset: 0, width: '100vw', height: '100vh',
      overflow: 'hidden', background: '#02030a',
    }}>
      <FreeFlightCanvas
        onShipState={onShipState}
        onDockPromptChange={setDockPrompt}
        onFirstPersonChange={setFirstPerson}
      />

      <CockpitHUD ship={shipRef} visible={firstPerson && !menuOpen} />

      {/* Chase cam HUD (lite) */}
      {!firstPerson && !menuOpen && (
        <div style={{
          position: 'fixed', bottom: 20, left: 20, zIndex: 10,
          color: '#6fe6ff', fontFamily: 'var(--font-space, monospace)',
          fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '10px 14px',
          background: 'rgba(0,18,30,0.3)',
          border: '1px solid rgba(0,212,255,0.35)',
          borderRadius: 6, backdropFilter: 'blur(6px)',
          textShadow: '0 0 8px #00d4ff88',
        }}>
          <div>WASD · Thrust</div>
          <div>Mouse · Look (click to lock)</div>
          <div>Shift · Boost · Space · Brake</div>
          <div>V · Toggle Cockpit · ESC · Menu</div>
        </div>
      )}

      {/* Dock prompt */}
      {dockPrompt && !menuOpen && (
        <div style={{
          position: 'fixed', top: '62%', left: '50%',
          transform: 'translate(-50%, -50%)', zIndex: 15,
          color: '#00ffff', fontFamily: 'var(--font-space, monospace)',
          fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '10px 20px',
          background: 'rgba(0, 40, 60, 0.45)',
          border: '1px solid rgba(0, 212, 255, 0.55)',
          borderRadius: 6, backdropFilter: 'blur(8px)',
          boxShadow: '0 0 24px rgba(0, 212, 255, 0.35)',
          textShadow: '0 0 10px #00d4ff',
        }}>
          Press E to dock · {dockPrompt}
        </div>
      )}

      {/* ESC menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(2, 4, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          color: '#fff', fontFamily: 'var(--font-space, system-ui)',
        }}>
          <div style={{
            fontSize: 28, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#00ffff',
            textShadow: '0 0 16px #00d4ff',
          }}>
            {dockPrompt ? `Docked · ${dockPrompt}` : 'Flight Menu'}
          </div>
          <button onClick={() => setMenuOpen(false)} style={btnStyle('#00d4ff')}>Resume</button>
          <button onClick={exitToGalaxy} style={btnStyle('#ff6699')}>Return to Galaxy</button>
          <div style={{ marginTop: 20, fontSize: 14, opacity: 0.6, letterSpacing: '0.06em' }}>
            Click the canvas to re-lock mouse after resuming
          </div>
        </div>
      )}

      {/* Exit badge (always visible) */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            position: 'fixed', top: 20, left: '50%',
            transform: 'translateX(-50%)', zIndex: 30,
            padding: '6px 16px',
            background: 'rgba(6, 8, 18, 0.5)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: 999,
            color: 'rgba(255,255,255,0.85)',
            fontSize: 14, letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-space, system-ui)',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          Free Flight
        </button>
      )}
    </div>
  )
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: '12px 32px',
    minWidth: 260,
    fontSize: 16,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    background: `${color}18`,
    border: `1px solid ${color}88`,
    borderRadius: 6,
    color: '#fff',
    fontFamily: 'var(--font-space, system-ui)',
    cursor: 'pointer',
    boxShadow: `0 0 18px ${color}44`,
    textShadow: `0 0 10px ${color}`,
  }
}
