'use client'

/**
 * Sprint 6 — renders the Gemini lore catalog (80 landmarks) in Free Flight
 * outer rings (radius 320–1100). Distance LOD: hidden >1200u, glyph 600–1200u,
 * billboard label 200–600u, full mesh + scan prompt <200u.
 *
 * Sits alongside the gameplay-positioned `<Landmarks />` component, which
 * renders the 20 Core/Inner Ring landmarks at radius 60–240.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'
import {
  loadLandmarks,
  landmarkPositions,
  colorForVisual,
} from '@/lib/game/universe/loaders'
import type { UniverseLandmark } from '@/lib/game/universe/types'

const SCAN_RADIUS = 80

interface Props {
  ship: React.MutableRefObject<ShipState>
  onScanCandidateChange?: (lm: UniverseLandmark | null) => void
}

interface PositionedLandmark extends UniverseLandmark {
  x: number
  y: number
  z: number
}

export default function UniverseLandmarks({ ship, onScanCandidateChange }: Props) {
  const positioned = useMemo<PositionedLandmark[]>(() => {
    const pos = landmarkPositions()
    const byId = new Map(pos.map((p) => [p.id, p]))
    return loadLandmarks().map((lm) => {
      const p = byId.get(lm.id)!
      return { ...lm, x: p.x, y: p.y, z: p.z }
    })
  }, [])

  const lastNearId = useRef<string | null>(null)

  useFrame(() => {
    let nearest: PositionedLandmark | null = null
    let nearestDist = Infinity
    const sp = ship.current.position
    for (const lm of positioned) {
      const dx = sp.x - lm.x, dy = sp.y - lm.y, dz = sp.z - lm.z
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < SCAN_RADIUS && d < nearestDist) {
        nearest = lm
        nearestDist = d
      }
    }
    const id = nearest?.id ?? null
    if (id !== lastNearId.current) {
      lastNearId.current = id
      onScanCandidateChange?.(nearest)
    }
  })

  return (
    <group>
      {positioned.map((lm) => (
        <UniverseLandmarkMesh key={lm.id} landmark={lm} ship={ship} />
      ))}
    </group>
  )
}

function UniverseLandmarkMesh({
  landmark,
  ship,
}: {
  landmark: PositionedLandmark
  ship: React.MutableRefObject<ShipState>
}) {
  const color = useMemo(() => new THREE.Color(colorForVisual(landmark.visual_type)), [
    landmark.visual_type,
  ])
  const groupRef = useRef<THREE.Group>(null)
  const lodRef = useRef<'hidden' | 'glyph' | 'billboard' | 'full'>('hidden')

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    const sp = ship.current.position
    const dx = sp.x - landmark.x, dy = sp.y - landmark.y, dz = sp.z - landmark.z
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
    let next: typeof lodRef.current
    if (d > 1200) next = 'hidden'
    else if (d > 600) next = 'glyph'
    else if (d > 200) next = 'billboard'
    else next = 'full'
    if (next !== lodRef.current) {
      lodRef.current = next
      g.visible = next !== 'hidden'
      g.scale.setScalar(next === 'full' ? 1.0 : next === 'billboard' ? 0.7 : 0.4)
    }
  })

  return (
    <group ref={groupRef} position={[landmark.x, landmark.y, landmark.z]}>
      {/* Low-poly glyph — octahedron for monuments, icosahedron everything else. */}
      <mesh>
        {landmark.visual_type === 'monument' ? (
          <octahedronGeometry args={[2.4, 0]} />
        ) : (
          <icosahedronGeometry args={[2.0, 0]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={color} intensity={1.2} distance={40} />
    </group>
  )
}
