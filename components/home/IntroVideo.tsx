'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'

interface Props {
  src: string
  onSkipAvailable?: () => void
  onEnded?: () => void
  /** Sprint 15 Task 11: set by the audio-gate choice. */
  initialMuted?: boolean
}

export interface IntroVideoHandle {
  jumpToEnd: () => void
}

const SKIP_THRESHOLD_SEC = 3

const IntroVideo = forwardRef<IntroVideoHandle, Props>(function IntroVideo(
  { src, onSkipAvailable, onEnded, initialMuted = true },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const skipFiredRef = useRef(false)

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

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const current = e.currentTarget.currentTime
    if (!skipFiredRef.current && current >= SKIP_THRESHOLD_SEC) {
      skipFiredRef.current = true
      onSkipAvailable?.()
    }
  }

  return (
    <video
      ref={videoRef}
      data-testid="intro-video"
      src={src}
      autoPlay
      muted={initialMuted}
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
  )
})

export default IntroVideo
