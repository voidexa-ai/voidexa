'use client'

/**
 * Sprint 11 — touch + viewport-size helpers for mobile responsive code.
 *
 * Why hover-media-query, not user-agent: UA sniffing is brittle and Apple
 * famously ships iPad Safari with a desktop UA. `(hover: none)` is the
 * canonical "is this a touch-primary device?" media query.
 */

import { useEffect, useState } from 'react'

/** True if the user's primary input device cannot hover (touch screens). */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)')
    setIsTouch(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    if ('addEventListener' in mq) mq.addEventListener('change', handler)
    return () => {
      if ('removeEventListener' in mq) mq.removeEventListener('change', handler)
    }
  }, [])
  return isTouch
}

/** True if the viewport width is below the given pixel threshold. */
export function useIsNarrow(maxPx = 768): boolean {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxPx - 1}px)`)
    setNarrow(mq.matches)
    const handler = (e: MediaQueryListEvent) => setNarrow(e.matches)
    if ('addEventListener' in mq) mq.addEventListener('change', handler)
    return () => {
      if ('removeEventListener' in mq) mq.removeEventListener('change', handler)
    }
  }, [maxPx])
  return narrow
}
