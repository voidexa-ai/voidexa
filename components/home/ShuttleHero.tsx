'use client'

/**
 * Sprint 8 — full-viewport hero with shuttle parallax.
 *
 * Image: public/images/shuttle-hero.png (2.5MB, priority loaded).
 * Effect: CSS background-attachment fixed for desktop, IntersectionObserver
 * translateY for mobile (where fixed-attachment is broken on iOS Safari).
 *
 * Voiceover: silent placeholder until audio asset lands. Plays once on first
 * user interaction (autoplay policy). Mute respected via SoundManager.
 */

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function ShuttleHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [parallax, setParallax] = useState(0)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches)
    const onScroll = () => {
      const el = heroRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // 0 when top of hero is at top of viewport, ramps up as user scrolls
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)))
      setParallax(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const playVoiceover = () => {
    // Voiceover audio file not yet shipped — this is the hook for when it lands.
    // We import the SoundManager lazily so SSR is unaffected.
    void import('@/lib/sound/manager').then(({ getSoundManager }) => {
      const mgr = getSoundManager()
      // Placeholder: trigger the welcome ping until the real VO lands.
      // Replace 'notification-ping' with a 'voiceover-home' key once added.
      const audio = new Audio('/sounds/voiceover-home-placeholder.mp3')
      audio.volume = mgr.getMasterVolume()
      audio.play().catch(() => {
        /* placeholder file 404 is expected — no-op until VO ships */
      })
    })
  }

  const heroHeight = isTouch ? '70vh' : '100vh'

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        width: '100%',
        height: heroHeight,
        overflow: 'hidden',
        background: '#04060d',
      }}
    >
      {/* Static image — translated for mobile parallax fallback. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${parallax * 60}px) scale(1.05)`,
          willChange: 'transform',
          opacity: 0.85,
        }}
      >
        <Image
          src="/images/shuttle-hero.png"
          alt="voidexa shuttle approaching the void"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Vignette + dark gradient for legibility. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(4,6,13,0) 0%, rgba(4,6,13,0.5) 60%, rgba(4,6,13,0.92) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Headline + subhead + CTAs */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          zIndex: 5,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(40px, 7vw, 88px)',
            margin: 0,
            fontFamily: 'var(--font-space, system-ui)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 32px rgba(0,212,255,0.4)',
            lineHeight: 1.05,
          }}
        >
          voidexa
        </h1>
        <p
          style={{
            fontSize: 'clamp(18px, 2.2vw, 26px)',
            color: 'rgba(220, 232, 248, 0.92)',
            opacity: 0.92,
            marginTop: 16,
            maxWidth: 720,
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          Engineered for the void. Software, AI, and a galaxy you can step into.
        </p>

        <div
          style={{
            marginTop: 32,
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/products"
            style={ctaStyle('linear-gradient(135deg, #00d4ff, #8b5cf6)')}
          >
            Explore Products
          </Link>
          <Link href="/freeflight" style={ctaStyle('rgba(0, 20, 40, 0.6)', true)}>
            Enter the Universe →
          </Link>
          <button
            type="button"
            onClick={playVoiceover}
            style={{
              ...ctaStyle('transparent', true),
              cursor: 'pointer',
              opacity: 0.7,
            }}
            aria-label="Play voiceover (placeholder)"
          >
            ▶ Listen
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(0, 212, 255, 0.6)',
          fontSize: 14,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-space, monospace)',
          pointerEvents: 'none',
          textShadow: '0 0 10px rgba(0, 212, 255, 0.6)',
          zIndex: 5,
        }}
      >
        ↓ Scroll
      </div>
    </section>
  )
}

function ctaStyle(bg: string, outline = false): React.CSSProperties {
  return {
    padding: '14px 26px',
    background: bg,
    color: outline ? '#00d4ff' : '#04060d',
    border: outline ? '1px solid rgba(0, 212, 255, 0.5)' : 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: '0.02em',
    textDecoration: 'none',
    boxShadow: outline ? 'none' : '0 0 28px rgba(0, 212, 255, 0.35)',
  }
}
