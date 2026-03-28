'use client'

import { useEffect, useRef, useState } from 'react'

interface KcpSummary {
  total_compressions: number
  overall_ratio: number
  total_tokens_saved: number
  estimated_usd_saved: number
  active_products: number
}

// Fallback benchmark data shown when no live data is available
const FALLBACK = {
  label_compressions: '20+',
  label_ratio:        '83%',
  label_tokens:       '78–88%',
  label_usd:          'Proven',
}

function useCountUp(target: number, duration = 1600, run = true) {
  const [count, setCount] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (!run || target <= 0) return
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setCount(Math.round(eased * target))
      if (t < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, run, duration])

  return count
}

function StatCard({
  label,
  live,
  fallback,
  suffix = '',
  prefix = '',
  decimals = 0,
}: {
  label: string
  live: number | null
  fallback: string
  suffix?: string
  prefix?: string
  decimals?: number
}) {
  const count = useCountUp(live ?? 0, 1600, live !== null && live > 0)
  const display = live !== null && live > 0
    ? `${prefix}${decimals > 0 ? count.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : count.toLocaleString()}${suffix}`
    : fallback

  return (
    <div
      style={{
        flex: '1 1 200px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(0,212,255,0.12)',
        borderRadius: 16,
        padding: '28px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow corner */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 80, height: 80,
        background: 'radial-gradient(circle at top left, rgba(0,212,255,0.07), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: 800,
        fontFamily: 'var(--font-space)',
        background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1.1,
        marginBottom: 10,
      }}>
        {display}
      </div>

      <div style={{
        fontSize: 13,
        fontWeight: 500,
        color: 'rgba(148,163,184,0.75)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  )
}

export default function Kcp90Stats() {
  const [summary, setSummary] = useState<KcpSummary | null | undefined>(undefined)

  useEffect(() => {
    fetch('/api/kcp90/public-stats')
      .then(r => r.json())
      .then(({ data }) => setSummary(data ?? null))
      .catch(() => setSummary(null))
  }, [])

  // undefined = loading, null = no data (use fallback), KcpSummary = live
  const hasData = summary !== undefined && summary !== null

  return (
    <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#00d4ff',
          marginBottom: 12,
          fontFamily: 'var(--font-space)',
        }}>
          Live Infrastructure Stats
        </p>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
          fontWeight: 800,
          fontFamily: 'var(--font-space)',
          color: '#e2e8f0',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          KCP-90 Performance
        </h2>
        <p style={{
          fontSize: 15,
          color: 'rgba(148,163,184,0.7)',
          maxWidth: 520,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          voidexa&apos;s proprietary AI compression protocol — reducing token usage across every product in the platform.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
      }}>
        <StatCard
          label="Total Compressions"
          live={hasData ? (summary!.total_compressions ?? null) : null}
          fallback={FALLBACK.label_compressions}
        />
        <StatCard
          label="Avg Compression"
          live={hasData ? (summary!.overall_ratio != null ? Math.round(summary!.overall_ratio * 100) : null) : null}
          fallback={FALLBACK.label_ratio}
          suffix="%"
        />
        <StatCard
          label="Tokens Saved"
          live={hasData ? (summary!.total_tokens_saved ?? null) : null}
          fallback={FALLBACK.label_tokens}
        />
        <StatCard
          label="Est. Cost Saved"
          live={hasData ? (summary!.estimated_usd_saved != null ? Math.round(summary!.estimated_usd_saved * 100) / 100 : null) : null}
          fallback={FALLBACK.label_usd}
          prefix="$"
          decimals={2}
        />
      </div>

      {/* Footer attribution */}
      <div style={{
        textAlign: 'center',
        marginTop: 32,
        paddingTop: 20,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{
          fontSize: 12,
          color: 'rgba(148,163,184,0.4)',
          letterSpacing: '0.08em',
        }}>
          Powered by KCP-90 — voidexa&apos;s proprietary AI compression protocol
          {!hasData && (
            <span style={{ marginLeft: 8, color: 'rgba(0,212,255,0.4)' }}>
              · 78–88% compression proven across 20 test domains
            </span>
          )}
        </span>
      </div>
    </section>
  )
}
