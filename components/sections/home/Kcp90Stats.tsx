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
    fontSize: 20,
    fontWeight: 800,
    fontFamily: 'var(--font-space)',
    background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
    lineHeight: 1.1,
  },
  label: {
    fontSize: 9,
    fontWeight: 600,
    color: 'rgba(148,163,184,0.45)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    marginTop: 3,
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
          borderRadius: 16,
          background: 'rgba(7,4,18,0.85)',
          border: '1px solid rgba(0,212,255,0.13)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          padding: '18px 28px 14px',
        }}
      >
        {/* Top row: pulse label + stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          {/* Live label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <span style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              animation: 'kcp-bar-pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(0,212,255,0.65)',
              fontFamily: 'var(--font-space)',
            }}>
              KCP-90 Live Stats
            </span>
          </div>

          {/* Vertical divider */}
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

          {/* 4 inline stats */}
          <div style={{
            display: 'flex',
            gap: 28,
            flex: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {/* Avg Compression */}
            <div style={{ textAlign: 'center' }}>
              <div style={statStyle.value}>
                {hasData && ratio > 0 ? `${ratio}%` : '83%'}
              </div>
              <div style={statStyle.label}>Avg Compression</div>
            </div>

            {/* Total Compressions */}
            <div style={{ textAlign: 'center' }}>
              <div style={statStyle.value}>
                {hasData && compressions > 0 ? compressions.toLocaleString() : '20+'}
              </div>
              <div style={statStyle.label}>Compressions</div>
            </div>

            {/* Token Range */}
            <div style={{ textAlign: 'center' }}>
              <div style={statStyle.value}>78–88%</div>
              <div style={statStyle.label}>Token Range</div>
            </div>

            {/* Cost Saved */}
            <div style={{ textAlign: 'center' }}>
              <div style={statStyle.value}>Proven</div>
              <div style={statStyle.label}>Cost Saved</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: 10,
          color: 'rgba(148,163,184,0.32)',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          Powered by KCP-90 — Integrated in: Quantum · Trading Bot · Void Chat
        </div>
      </div>

      <style>{`
        @keyframes kcp-bar-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
