'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FREE_FLIGHT_CTA, HOMEPAGE_PANELS, HomePanel } from '@/lib/cinematic/config'

interface Props {
  visible: boolean
}

const ICON_MAP: Record<HomePanel['icon'], string> = {
  Globe: '🌐',
  Wrench: '🛠',
  Compass: '🧭',
  Zap: '⚡',
}

export default function CinematicOverlay({ visible }: Props) {
  const router = useRouter()
  const [launching, setLaunching] = useState(false)
  const [hoverKey, setHoverKey] = useState<string | null>(null)

  useEffect(() => {
    if (!launching) return
    const t = window.setTimeout(() => {
      router.push(FREE_FLIGHT_CTA.route)
    }, FREE_FLIGHT_CTA.loadingDurationMs)
    return () => window.clearTimeout(t)
  }, [launching, router])

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: 24,
        zIndex: 30,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 1.2s ease-out',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 300px))',
          gap: 16,
          width: 'min(640px, 100%)',
        }}
      >
        {HOMEPAGE_PANELS.map((panel) => {
          const isHover = hoverKey === panel.title
          return (
            <Link
              key={panel.title}
              href={panel.route}
              onMouseEnter={() => setHoverKey(panel.title)}
              onMouseLeave={() => setHoverKey(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 6,
                padding: '18px 20px',
                minHeight: 140,
                maxHeight: 160,
                background: isHover
                  ? 'rgba(20, 30, 60, 0.45)'
                  : 'rgba(10, 15, 30, 0.35)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: isHover
                  ? '1px solid rgba(150, 200, 255, 0.45)'
                  : '1px solid rgba(150, 200, 255, 0.25)',
                borderRadius: 14,
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow:
                  'inset 0 0 20px rgba(0, 180, 255, 0.08), 0 8px 28px rgba(0, 0, 0, 0.35)',
                transition:
                  'background 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
                transform: isHover ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 22, lineHeight: 1 }} aria-hidden>
                  {ICON_MAP[panel.icon]}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.9)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {panel.title}
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.4,
                }}
              >
                {panel.description}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#7fd8ff',
                }}
              >
                {panel.cta} →
              </div>
            </Link>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setLaunching(true)}
        disabled={launching}
        style={{
          padding: '14px 28px',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#02101e',
          background: 'linear-gradient(120deg, #7fd8ff, #a78bfa)',
          border: 'none',
          borderRadius: 999,
          cursor: launching ? 'progress' : 'pointer',
          boxShadow:
            '0 0 28px rgba(127,216,255,0.55), 0 0 60px rgba(167,139,250,0.35)',
        }}
      >
        {launching ? FREE_FLIGHT_CTA.loadingText : FREE_FLIGHT_CTA.label}
      </button>

      {launching && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2,8,18,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 80,
            color: 'rgba(230,240,255,0.95)',
            fontSize: 16,
            letterSpacing: '0.08em',
          }}
        >
          {FREE_FLIGHT_CTA.loadingText}
        </div>
      )}
    </div>
  )
}
