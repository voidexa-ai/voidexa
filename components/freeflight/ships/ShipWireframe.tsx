'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { ShipState } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  visible: boolean
  label?: string | null
}

/**
 * Placeholder rendered while the ship GLTF streams from Supabase. Shown
 * under the ship's world-space position/orientation so the player sees a
 * wireframe silhouette instead of an unexplained cyan sphere.
 */
export default function ShipWireframe({ ship, visible, label }: Props) {
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
      {label && (
        <Html position={[0, 2.2, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            padding: '6px 14px',
            borderRadius: 999,
            background: 'rgba(2, 6, 20, 0.75)',
            border: '1px solid rgba(0, 212, 255, 0.4)',
            color: '#e8fbff',
            fontSize: 14,
            fontFamily: 'var(--font-space, monospace)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(0,212,255,0.6)',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}
