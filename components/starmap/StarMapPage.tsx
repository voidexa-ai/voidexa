'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'
import CSSStarfield from './CSSStarfield'

// R3F canvas — client-side only, no SSR
const StarMapCanvas = dynamic(() => import('./StarMapCanvas'), {
  ssr: false,
  loading: () => null,
})

// ── KCP-90 floating stats panel ────────────────────────────────────────────

interface KcpSummary {
  total_compressions: number
  overall_ratio: number
  total_tokens_saved: number
  estimated_usd_saved: number
}

function useCountUp(target: number, run: boolean, duration = 1200) {
  const [count, setCount] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    if (!run || target <= 0) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, run, duration])
  return count
}

function Kcp90FloatingPanel() {
  const [summary, setSummary] = useState<KcpSummary | null | undefined>(undefined)
  const [visible, setVisible] = useState(true)
  const hasData = summary != null

  useEffect(() => {
    fetch('/api/kcp90/public-stats')
      .then(r => r.json())
      .then(({ data }) => setSummary(data ?? null))
      .catch(() => setSummary(null))
  }, [])

  const compressions = useCountUp(hasData ? (summary!.total_compressions ?? 0) : 0, hasData)
  const ratio        = useCountUp(hasData ? Math.round((summary!.overall_ratio ?? 0) * 100) : 0, hasData)
  const tokens       = useCountUp(hasData ? (summary!.total_tokens_saved ?? 0) : 0, hasData)

  if (!visible) return null

  const statVal: React.CSSProperties = {
    fontSize: 52,
    fontWeight: 900,
    fontFamily: 'var(--font-space)',
    color: '#00d4ff',
    lineHeight: 1.0,
    letterSpacing: '-0.02em',
    textShadow: '0 0 24px rgba(0,212,255,0.7)',
  }
  const statLbl: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: 'rgba(148,163,184,0.75)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginTop: 6,
    whiteSpace: 'nowrap',
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 72,
        right: 20,
        zIndex: 55,
        background: 'rgba(7,4,18,0.95)',
        border: '1px solid rgba(0,212,255,0.3)',
        borderRadius: 20,
        padding: '28px 36px 24px',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        boxShadow: '0 16px 64px rgba(0,0,0,0.7), 0 0 80px rgba(0,212,255,0.08)',
        minWidth: 420,
        minHeight: 200,
      }}
    >
      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-block',
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 9px #22c55e',
            animation: 'kcp-pulse 2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.9)',
            fontFamily: 'var(--font-space)',
          }}>
            KCP-90 Live Stats
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(148,163,184,0.4)',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
            padding: '0 2px',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.4)')}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* Stats row — 3 columns */}
      <div style={{ display: 'flex', gap: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={statVal}>
            {hasData && compressions > 0 ? compressions.toLocaleString() : '20+'}
          </div>
          <div style={statLbl}>Compressions</div>
        </div>

        <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={statVal}>
            {hasData && ratio > 0 ? `${ratio}%` : '83%'}
          </div>
          <div style={statLbl}>Avg Compression</div>
        </div>

        <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={statVal}>
            {hasData && tokens > 0 ? tokens.toLocaleString() : '—'}
          </div>
          <div style={statLbl}>Tokens Saved</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 14,
        paddingTop: 10,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontSize: 10,
        color: 'rgba(148,163,184,0.4)',
        letterSpacing: '0.08em',
        textAlign: 'center',
        fontWeight: 500,
      }}>
        Powered by KCP-90 — voidexa compression protocol
      </div>

      <style>{`
        @keyframes kcp-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

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

      {/* KCP-90 floating stats panel — bottom-right */}
      <Kcp90FloatingPanel />

      {/* Interaction hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14,
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
