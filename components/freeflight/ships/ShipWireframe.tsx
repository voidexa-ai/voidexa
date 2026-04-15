'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  visible: boolean
}

/**
 * Placeholder rendered while the ship GLTF streams from Supabase. Shown
 * under the ship's world-space position/orientation so the player sees a
 * wireframe silhouette instead of an unexplained cyan sphere.
 */
export default function ShipWireframe({ ship, visible }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.visible = visible
    if (!visible) return
    groupRef.current.position.copy(ship.current.position)
    groupRef.current.quaternion.copy(ship.current.quaternion)
  })

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.2, 3, 4]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.55} toneMapped={false} />
      </mesh>
    </group>
  )
}
