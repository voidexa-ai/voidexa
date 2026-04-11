'use client'

import { useEffect, useState } from 'react'

interface SessionBarProps {
  active: boolean
  startTime: number | null
}

export default function SessionBar({ active, startTime }: SessionBarProps) {
  const [elapsed, setElapsed] = useState(0)
  const [cost, setCost] = useState(0)

  useEffect(() => {
    if (!active || !startTime) return
    const iv = setInterval(() => {
      const s = Math.floor((Date.now() - startTime) / 1000)
      setElapsed(s)
      setCost(parseFloat((s * 0.00013).toFixed(5)))
    }, 1000)
    return () => clearInterval(iv)
  }, [active, startTime])

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const hasRun = startTime !== null

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2 rounded-lg"
      style={{
        background: 'rgba(8,8,18,0.8)',
        border: '1px solid rgba(119,119,187,0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Mac dots */}
      <div className="flex items-center gap-1.5">
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 min-w-0">
        {active && (
          <span
            className="inline-block rounded-full shrink-0"
            style={{
              width: 6,
              height: 6,
              background: '#4ade80',
              boxShadow: '0 0 8px #4ade80',
              animation: 'quantum-pulse 2s ease-in-out infinite',
            }}
          />
        )}
        <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {active ? 'Live Session' : hasRun ? 'Session Complete' : 'Ready'}
        </span>
      </div>

      {/* Timer + cost — stacked vertically */}
      {hasRun && (
        <div className="flex flex-col items-end shrink-0" style={{ lineHeight: 1.3 }}>
          <span style={{ fontSize: 14, color: '#7777bb', fontFamily: 'monospace' }}>
            {fmtTime(elapsed)}
          </span>
          <span style={{ fontSize: 14, color: '#64748b', fontFamily: 'monospace' }}>
            ${cost.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  )
}
