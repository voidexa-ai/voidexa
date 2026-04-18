'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

interface Props {
  src: string
  onSkipAvailable?: () => void
  onEnded?: () => void
}

export interface IntroVideoHandle {
  jumpToEnd: () => void
}

const SKIP_THRESHOLD_SEC = 3

const IntroVideo = forwardRef<IntroVideoHandle, Props>(function IntroVideo(
  { src, onSkipAvailable, onEnded },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const skipFiredRef = useRef(false)
  const [muted, setMuted] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)

  useImperativeHandle(ref, () => ({
    jumpToEnd: () => {
      const v = videoRef.current
      if (!v) return
      if (Number.isFinite(v.duration) && v.duration > 0) {
        try {
          v.currentTime = Math.max(0, v.duration - 0.05)
        } catch {
          // ignore — some browsers block seeking
        }
      }
      onEnded?.()
    },
  }))

  useEffect(() => {
    const t = window.setTimeout(() => setShowTooltip(false), 5000)
    return () => window.clearTimeout(t)
  }, [])

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const current = e.currentTarget.currentTime
    if (!skipFiredRef.current && current >= SKIP_THRESHOLD_SEC) {
      skipFiredRef.current = true
      onSkipAvailable?.()
    }
  }

  function toggleMute() {
    setMuted((m) => !m)
    setShowTooltip(false)
  }

  return (
    <>
      <video
        ref={videoRef}
        data-testid="intro-video"
        src={src}
        autoPlay
        muted={muted}
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => onEnded?.()}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 1,
          background: '#02060f',
        }}
      />
      <button
        type="button"
        aria-label={muted ? 'Unmute intro audio' : 'Mute intro audio'}
        onClick={toggleMute}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 80,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(150, 200, 255, 0.35)',
          borderRadius: 999,
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: muted
            ? '0 0 18px rgba(127,216,255,0.35)'
            : '0 0 12px rgba(127,216,255,0.15)',
          animation: muted ? 'pulseGlow 2.1s ease-in-out infinite' : undefined,
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>
          {muted ? '🔇' : '🔊'}
        </span>
        <span>{muted ? 'Unmute voiceover' : 'Mute'}</span>
      </button>
      {muted && showTooltip && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 84,
            zIndex: 79,
            padding: '10px 14px',
            background: 'rgba(10, 20, 40, 0.85)',
            border: '1px solid rgba(150, 200, 255, 0.35)',
            borderRadius: 10,
            color: 'rgba(255,255,255,0.9)',
            fontSize: 14,
            letterSpacing: '0.02em',
            maxWidth: 240,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            fontFamily: 'var(--font-sans)',
            pointerEvents: 'none',
          }}
        >
          Tap to hear the voiceover.
        </div>
      )}
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 18px rgba(127,216,255,0.35); }
          50% { box-shadow: 0 0 28px rgba(127,216,255,0.65); }
        }
      `}</style>
    </>
  )
})

export default IntroVideo
