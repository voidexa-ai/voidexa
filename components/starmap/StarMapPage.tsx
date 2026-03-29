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

  const dispCompressions = hasData && compressions > 0 ? compressions.toLocaleString() : '20+'
  const dispRatio        = hasData && ratio > 0 ? `${ratio}%` : '83%'
  const dispTokens       = hasData && tokens > 0 ? tokens.toLocaleString() : '78–88%'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 50,
        width: 340,
        background: 'rgba(10,10,30,0.7)',
        border: '1px solid rgba(100,220,255,0.15)',
        borderRadius: 16,
        padding: '20px 28px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,200,255,0.08)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#22c55e',
            flexShrink: 0,
            animation: 'kcp-pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(100,220,255,0.7)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            KCP-90
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.2)',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            padding: '0 2px',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: 28,
            fontWeight: 300,
            color: '#ffffff',
            lineHeight: 1.1,
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.01em',
          }}>
            {dispCompressions}
          </div>
          <div style={{
            fontSize: 10,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: 5,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            compressions
          </div>
        </div>

        <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 4px', alignSelf: 'stretch' }} />

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: 28,
            fontWeight: 300,
            color: '#ffffff',
            lineHeight: 1.1,
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.01em',
          }}>
            {dispRatio}
          </div>
          <div style={{
            fontSize: 10,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: 5,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            avg compression
          </div>
        </div>

        <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 4px', alignSelf: 'stretch' }} />

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: 28,
            fontWeight: 300,
            color: '#ffffff',
            lineHeight: 1.1,
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.01em',
          }}>
            {dispTokens}
          </div>
          <div style={{
            fontSize: 10,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: 5,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            token range
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        marginTop: 16,
        fontSize: 10,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.06em',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        Powered by voidexa compression protocol
      </div>

      <style>{`
        @keyframes kcp-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
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
