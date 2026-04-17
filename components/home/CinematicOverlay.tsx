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
        gap: 24,
        padding: 24,
        zIndex: 30,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.9s ease-out',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18,
          width: 'min(720px, 100%)',
        }}
      >
        {HOMEPAGE_PANELS.map((panel) => (
          <Link
            key={panel.title}
            href={panel.route}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 24,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: 'rgba(230,240,255,0.95)',
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: 26, lineHeight: 1 }} aria-hidden>{ICON_MAP[panel.icon]}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{panel.title}</div>
            <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.45 }}>{panel.description}</div>
            <div
              style={{
                marginTop: 6,
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
        ))}
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
          boxShadow: '0 0 28px rgba(127,216,255,0.55), 0 0 60px rgba(167,139,250,0.35)',
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
