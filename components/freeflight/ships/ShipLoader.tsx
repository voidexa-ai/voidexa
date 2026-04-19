'use client'

import { Suspense, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import ShipModel from './ShipModel'
import ShipWireframe from './ShipWireframe'
import ModelErrorBoundary from '../ModelErrorBoundary'
import type { ShipState } from '../types'
import { MODEL_URLS } from '@/lib/config/modelUrls'

interface Props {
  ship: React.MutableRefObject<ShipState>
  visible: boolean
  url: string
  scale?: number
  onSize?: (size: number) => void
}

const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 2000
const BOB_FALLBACK_URL = MODEL_URLS.qs_bob

/**
 * Ship loader with retry + Bob fallback + wireframe placeholder.
 *
 * - First paint: wireframe silhouette (Suspense fallback) while Supabase CDN
 *   streams the .glb.
 * - On GLTF error: bump attempt, drop drei's cached entry, re-mount after a
 *   short delay. Wireframe stays visible in the gap.
 * - After MAX_ATTEMPTS failures: Sprint 16 Task 7 kicks in — swap to Bob's
 *   GLB so the pilot always has a flyable ship, instead of staring at the
 *   wireframe indefinitely.
 * - If Bob itself fails (rare — means the Supabase bucket is offline): fall
 *   through to the old wireframe + "Loading ship..." label path.
 */
const ShipLoader = forwardRef<THREE.Group, Props>(function ShipLoader(
  { ship, visible, url, scale, onSize },
  ref,
) {
  const [attempt, setAttempt] = useState(0)
  const [usingBobFallback, setUsingBobFallback] = useState(false)
  const [gaveUp, setGaveUp] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset when URL changes (player switched ships).
  useEffect(() => {
    setAttempt(0)
    setUsingBobFallback(false)
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
          // Task 7: fall back to Bob before truly giving up — unless Bob is
          // exactly what we were trying to load, in which case the wireframe
          // remains the only safe render path.
          if (url !== BOB_FALLBACK_URL && !usingBobFallback) {
            console.warn(`[ship-loader] ${url} failed ${MAX_ATTEMPTS}x — falling back to Bob`)
            setUsingBobFallback(true)
            return 0
          }
          setGaveUp(true)
          return prev
        }
        return prev + 1
      })
    }, RETRY_DELAY_MS)
  }, [url, usingBobFallback])

  if (gaveUp) {
    return <ShipWireframe ship={ship} visible={visible} label="Loading ship..." />
  }

  const activeUrl = usingBobFallback ? BOB_FALLBACK_URL : url

  return (
    <ModelErrorBoundary
      onError={handleError}
      resetKey={`${activeUrl}-${attempt}`}
      fallback={<ShipWireframe ship={ship} visible={visible} />}
    >
      <Suspense fallback={<ShipWireframe ship={ship} visible={visible} />}>
        <ShipModel
          key={`${activeUrl}-${attempt}`}
          ref={ref}
          ship={ship}
          visible={visible}
          url={activeUrl}
          scale={scale}
          onSize={onSize}
        />
      </Suspense>
    </ModelErrorBoundary>
  )
})

export default ShipLoader
