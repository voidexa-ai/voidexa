'use client'

import { useEffect, useRef, useState } from 'react'

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

const statStyle = {
  value: {
    fontSize: 40,
    fontWeight: 900,
    fontFamily: 'var(--font-space)',
    color: '#00d4ff',
    lineHeight: 1.05,
    letterSpacing: '-0.01em',
    textShadow: '0 0 20px rgba(0,212,255,0.45)',
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    color: 'rgba(148,163,184,0.65)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    marginTop: 5,
    whiteSpace: 'nowrap' as const,
  },
}

export default function Kcp90Stats() {
  const [summary, setSummary] = useState<KcpSummary | null | undefined>(undefined)
  const hasData = summary != null

  useEffect(() => {
    fetch('/api/kcp90/public-stats')
      .then(r => r.json())
      .then(({ data }) => setSummary(data ?? null))
      .catch(() => setSummary(null))
  }, [])

  const compressions = useCountUp(hasData ? (summary!.total_compressions ?? 0) : 0, hasData)
  const ratio        = useCountUp(hasData ? Math.round((summary!.overall_ratio ?? 0) * 100) : 0, hasData)

  return (
    <div style={{ padding: '0 24px 64px', maxWidth: 1100, margin: '0 auto' }}>
      <div
        style={{
          borderRadius: 20,
          background: 'rgba(7,4,18,0.92)',
          border: '1px solid rgba(0,212,255,0.22)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(0,212,255,0.04)',
          padding: '32px 48px 24px',
        }}
      >
        {/* Header: pulse label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <span style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 10px #22c55e',
            animation: 'kcp-bar-pulse 2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.8)',
            fontFamily: 'var(--font-space)',
          }}>
            KCP-90 Live Stats
          </span>
        </div>

        {/* 4 stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 32,
          alignItems: 'center',
        }}>
          {/* Avg Compression */}
          <div style={{ textAlign: 'center' }}>
            <div style={statStyle.value}>
              {hasData && ratio > 0 ? `${ratio}%` : '95%'}
            </div>
            <div style={statStyle.label}>Avg Compression</div>
          </div>

          {/* Total Compressions */}
          <div style={{ textAlign: 'center' }}>
            <div style={statStyle.value}>
              {hasData && compressions > 0 ? compressions.toLocaleString() : '20+'}
            </div>
            <div style={statStyle.label}>Total Compressions</div>
          </div>

          {/* Token Range */}
          <div style={{ textAlign: 'center' }}>
            <div style={statStyle.value}>95%</div>
            <div style={statStyle.label}>Token Range</div>
          </div>

          {/* Cost Saved */}
          <div style={{ textAlign: 'center' }}>
            <div style={statStyle.value}>Proven</div>
            <div style={statStyle.label}>Cost Saved</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: 14,
          color: 'rgba(148,163,184,0.5)',
          letterSpacing: '0.08em',
          textAlign: 'center',
          fontWeight: 500,
        }}>
          Powered by KCP-90 — Integrated in: Quantum · Trading Bot · Void Chat
        </div>
      </div>

      <style>{`
        @keyframes kcp-bar-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
