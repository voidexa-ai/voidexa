'use client'

import { useEffect, useState } from 'react'
import type { QuantumMode } from '@/types/quantum'

// Customer pricing multipliers — must match CostSummaryStrip
const CUSTOMER_MARKUP: Record<string, { markup: number; min: number }> = {
  standard: { markup: 2.5, min: 0.05 },
  deep: { markup: 3.5, min: 0.25 },
}

function toCustomerPrice(apiCost: number, mode: string): number {
  const pricing = CUSTOMER_MARKUP[mode === 'deep' || mode === 'verbose' ? 'deep' : 'standard']
  return Math.max(pricing.min, apiCost * pricing.markup)
}

interface SessionBarProps {
  active: boolean
  startTime: number | null
  /** Final API cost from session_complete — converted to customer price. */
  finalCost?: number | null
  /** Current UX mode — determines customer price multiplier. */
  mode?: QuantumMode
}

export default function SessionBar({ active, startTime, finalCost, mode = 'standard' }: SessionBarProps) {
  const [elapsed, setElapsed] = useState(0)
  const [liveApiCost, setLiveApiCost] = useState(0)

  useEffect(() => {
    if (!active || !startTime) return
    const iv = setInterval(() => {
      const s = Math.floor((Date.now() - startTime) / 1000)
      setElapsed(s)
      setLiveApiCost(parseFloat((s * 0.00013).toFixed(5)))
    }, 1000)
    return () => clearInterval(iv)
  }, [active, startTime])

  // When session completes, freeze the elapsed time
  const [frozenElapsed, setFrozenElapsed] = useState<number | null>(null)
  useEffect(() => {
    if (!active && startTime && finalCost != null && frozenElapsed === null) {
      setFrozenElapsed(elapsed)
    }
    if (active) setFrozenElapsed(null)
  }, [active, startTime, finalCost, elapsed, frozenElapsed])

  const displayElapsed = frozenElapsed ?? elapsed
  // Always show customer price — never raw API cost
  const displayCost = finalCost != null
    ? toCustomerPrice(finalCost, mode)
    : toCustomerPrice(liveApiCost, mode)

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const hasRun = startTime !== null

  const statusLabel = active ? 'Live Session' : hasRun ? 'Session Complete' : 'Ready'

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
      style={{
        background: 'rgba(8,8,18,0.8)',
        border: '1px solid rgba(119,119,187,0.2)',
        backdropFilter: 'blur(12px)',
        minWidth: 240,
      }}
    >
      {/* Mac dots */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
      </div>

      {/* Status + timer + cost — stacked vertically to prevent overlap */}
      <div className="flex flex-col items-center flex-1" style={{ lineHeight: 1.4 }}>
        <div className="flex items-center gap-2">
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
            {statusLabel}
          </span>
        </div>

        {hasRun && (
          <>
            <span style={{ fontSize: 14, color: '#7777bb', fontFamily: 'monospace', marginTop: 2 }}>
              {fmtTime(displayElapsed)}
            </span>
            <span style={{ fontSize: 14, color: '#64748b', fontFamily: 'monospace' }}>
              ${displayCost.toFixed(4)}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
