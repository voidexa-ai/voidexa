'use client'

import { RefObject, useCallback, useEffect, useState } from 'react'

interface Options {
  audioRef: RefObject<HTMLAudioElement | null>
  elapsed: number
  enabled?: boolean
}

export interface VoiceoverSyncState {
  muted: boolean
  hasInteracted: boolean
  unmute: () => void
  stop: () => void
}

const DRIFT_TOLERANCE = 0.35

export function useVoiceoverSync({ audioRef, elapsed, enabled = true }: Options): VoiceoverSyncState {
  const [muted, setMuted] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const el = audioRef.current
    if (!el || !enabled) return
    el.muted = muted
    if (muted) return
    if (Math.abs(el.currentTime - elapsed) > DRIFT_TOLERANCE) {
      try { el.currentTime = elapsed } catch {}
    }
    if (el.paused) {
      el.play().catch(() => {})
    }
  }, [audioRef, elapsed, muted, enabled])

  const unmute = useCallback(() => {
    setMuted(false)
    setHasInteracted(true)
    const el = audioRef.current
    if (!el) return
    el.muted = false
    el.play().catch(() => {})
  }, [audioRef])

  const stop = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    try { el.pause() } catch {}
  }, [audioRef])

  return { muted, hasInteracted, unmute, stop }
}
