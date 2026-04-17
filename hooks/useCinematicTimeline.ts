'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CinematicPhase,
  SKIP_TARGET_SECONDS,
  TOTAL_DURATION_SECONDS,
  isOverlayVisibleAt,
  phaseAt,
  phaseProgress,
} from '@/lib/cinematic/config'

export interface CinematicTimelineState {
  elapsed: number
  phase: CinematicPhase
  progress: number
  finished: boolean
  skipped: boolean
  overlayVisible: boolean
  skipToEnd: () => void
  reset: () => void
}

interface Options {
  autoStart?: boolean
  onSkip?: () => void
  onPhaseChange?: (phase: CinematicPhase) => void
}

export function useCinematicTimeline(options: Options = {}): CinematicTimelineState {
  const { autoStart = true, onSkip, onPhaseChange } = options
  const [elapsed, setElapsed] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const startedAtRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastPhaseRef = useRef<CinematicPhase>('approach')
  const tickRef = useRef<() => void>(() => {})

  const tick = useMemo(
    () => () => {
      if (startedAtRef.current === null) {
        rafRef.current = requestAnimationFrame(tickRef.current)
        return
      }
      const now = performance.now()
      const next = Math.min(TOTAL_DURATION_SECONDS, (now - startedAtRef.current) / 1000)
      setElapsed((prev) => (prev === next ? prev : next))
      if (next < TOTAL_DURATION_SECONDS) {
        rafRef.current = requestAnimationFrame(tickRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  useEffect(() => {
    if (!autoStart) return
    startedAtRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [autoStart, tick])

  const phase = skipped ? 'end-state' : phaseAt(elapsed)
  const progress = phaseProgress(elapsed, phase)

  useEffect(() => {
    if (lastPhaseRef.current !== phase) {
      lastPhaseRef.current = phase
      onPhaseChange?.(phase)
    }
  }, [phase, onPhaseChange])

  const skipToEnd = useCallback(() => {
    if (skipped) return
    setSkipped(true)
    setElapsed(SKIP_TARGET_SECONDS)
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    startedAtRef.current = performance.now() - SKIP_TARGET_SECONDS * 1000
    onSkip?.()
  }, [skipped, onSkip])

  const reset = useCallback(() => {
    setSkipped(false)
    setElapsed(0)
    startedAtRef.current = performance.now()
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tickRef.current)
  }, [])

  return {
    elapsed,
    phase,
    progress,
    finished: elapsed >= TOTAL_DURATION_SECONDS - 0.001,
    skipped,
    overlayVisible: isOverlayVisibleAt(elapsed),
    skipToEnd,
    reset,
  }
}
