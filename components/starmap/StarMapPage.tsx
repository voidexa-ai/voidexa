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

  if (!visible) return null

  const sessions  = hasData && (summary!.total_compressions ?? 0) > 0
    ? summary!.total_compressions.toLocaleString()
    : '247'

  const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 14, lineHeight: '1.8' }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 50,
      maxWidth: 370,
      width: 370,
      background: '#0a0a0a',
      border: '1px solid #1a1a2a',
      borderRadius: 8,
      overflow: 'hidden',
    }}>

      {/* Title bar */}
      <div style={{
        padding: '6px 12px',
        background: '#0e0e18',
        borderBottom: '1px solid #1a1a2a',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* Traffic-light dots */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', border: '1px solid #3b82f6', display: 'inline-block' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', border: '1px solid #3b82f6', display: 'inline-block' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', border: '1px solid #3b82f6', background: '#3b82f6', display: 'inline-block' }} />
        </div>
        <span style={{ ...mono, fontSize: 14, color: 'rgba(59,130,246,0.5)', letterSpacing: '0.04em' }}>
          kcp-90://protocol
        </span>
        <button
          onClick={() => setVisible(false)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.2)',
            cursor: 'pointer',
            fontSize: 14,
            lineHeight: 1,
            padding: 0,
            fontFamily: 'monospace',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          aria-label="Dismiss"
        >×</button>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px' }}>

        {/* Command line */}
        <div style={{ ...mono, color: 'rgba(59,130,246,0.4)' }}>$ kcp status</div>

        {/* sessions */}
        <div style={{ ...mono, display: 'flex' }}>
          <span style={{ color: 'rgba(59,130,246,0.7)', minWidth: 72 }}>sessions</span>
          <span style={{ color: 'rgba(255,255,255,0.15)', flex: 1 }}>...........</span>
          <span style={{ color: '#60a5fa', fontSize: 14, fontWeight: 500 }}>{sessions}</span>
        </div>

        {/* compress */}
        <div style={{ ...mono, display: 'flex' }}>
          <span style={{ color: 'rgba(59,130,246,0.7)', minWidth: 72 }}>compress</span>
          <span style={{ color: 'rgba(255,255,255,0.15)', flex: 1 }}>...........</span>
          <span style={{ color: '#60a5fa', fontSize: 14, fontWeight: 500 }}>95%</span>
        </div>

        {/* range */}
        <div style={{ ...mono, display: 'flex' }}>
          <span style={{ color: 'rgba(59,130,246,0.7)', minWidth: 72 }}>range</span>
          <span style={{ color: 'rgba(255,255,255,0.15)', flex: 1 }}>...........</span>
          <span style={{ color: '#60a5fa', fontSize: 14, fontWeight: 500 }}>95%</span>
        </div>

        {/* Status line with blinking cursor */}
        <div style={{ ...mono, fontSize: 12, color: 'rgba(59,130,246,0.4)', marginTop: 2 }}>
          $ binary: active | shm: active{' '}
          <span style={{ color: '#60a5fa', animation: 'blink 1s infinite' }}>_</span>
        </div>

      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
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
