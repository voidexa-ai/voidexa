'use client'

import { Suspense, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import ShipModel from './ShipModel'
import ShipWireframe from './ShipWireframe'
import ModelErrorBoundary from '../ModelErrorBoundary'
import type { ShipState } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  visible: boolean
  url: string
  scale?: number
  onSize?: (size: number) => void
}

const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 2000

/**
 * Ship loader with retry + wireframe placeholder.
 *
 * - First paint: wireframe silhouette (Suspense fallback) while Supabase CDN
 *   streams the .glb.
 * - On GLTF error: bump attempt, drop drei's cached entry, re-mount after a
 *   short delay. Wireframe stays visible in the gap.
 * - After MAX_ATTEMPTS failures: wireframe + "Loading ship..." label (no more
 *   retries), so the player never sees a raw blocky fallback.
 */
const ShipLoader = forwardRef<THREE.Group, Props>(function ShipLoader(
  { ship, visible, url, scale, onSize },
  ref,
) {
  const [attempt, setAttempt] = useState(0)
  const [gaveUp, setGaveUp] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset when URL changes (player switched ships).
  useEffect(() => {
    setAttempt(0)
    setGaveUp(false)
  }, [url])

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const handleError = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    // Drop any cached failed GLTF so the next attempt actually refetches.
    try { useGLTF.clear(url) } catch {}
    timer.current = setTimeout(() => {
      setAttempt(prev => {
        if (prev + 1 >= MAX_ATTEMPTS) {
          setGaveUp(true)
          return prev
        }
        return prev + 1
      })
    }, RETRY_DELAY_MS)
  }, [url])

  if (gaveUp) {
    return <ShipWireframe ship={ship} visible={visible} label="Loading ship..." />
  }

  return (
    <ModelErrorBoundary
      onError={handleError}
      resetKey={`${url}-${attempt}`}
      fallback={<ShipWireframe ship={ship} visible={visible} />}
    >
      <Suspense fallback={<ShipWireframe ship={ship} visible={visible} />}>
        <ShipModel
          key={`${url}-${attempt}`}
          ref={ref}
          ship={ship}
          visible={visible}
          url={url}
          scale={scale}
          onSize={onSize}
        />
      </Suspense>
    </ModelErrorBoundary>
  )
})

export default ShipLoader
