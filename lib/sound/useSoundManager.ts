'use client'

/**
 * Sprint 7 — React hook for the sound manager singleton.
 * SSR-safe: returns null on the server, hydrated value on the client.
 */

import { useEffect, useState } from 'react'
import { getSoundManager } from './manager'

interface SoundState {
  volume: number
  muted: boolean
}

export function useSoundManager() {
  const [state, setState] = useState<SoundState>({ volume: 0.7, muted: false })

  useEffect(() => {
    const mgr = getSoundManager()
    setState({ volume: mgr.getMasterVolume(), muted: mgr.isMuted() })
  }, [])

  const setVolume = (v: number) => {
    getSoundManager().setMasterVolume(v)
    setState((s) => ({ ...s, volume: v }))
  }
  const setMuted = (b: boolean) => {
    getSoundManager().setMuted(b)
    setState((s) => ({ ...s, muted: b }))
  }
  const toggleMute = () => setMuted(!state.muted)

  return {
    volume: state.volume,
    muted: state.muted,
    setVolume,
    setMuted,
    toggleMute,
  }
}
