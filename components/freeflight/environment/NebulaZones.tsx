'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'
import { NEBULA_ZONES } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  onNebulaChange?: (color: string | null) => void
}

export default function NebulaZones({ ship, onNebulaChange }: Props) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])
  const lastZone = useRef<string | null>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    meshRefs.current.forEach((m, i) => {
      if (m) {
        const mat = m.material as THREE.MeshBasicMaterial
        mat.opacity = 0.06 + Math.sin(t * 0.4 + i) * 0.02
        m.rotation.y = t * 0.02
        m.scale.setScalar(1 + Math.sin(t * 0.2 + i) * 0.03)
      }
    })

    // Detect ship inside a nebula
    const s = ship.current
    let inside: typeof NEBULA_ZONES[number] | null = null
    for (const z of NEBULA_ZONES) {
      if (s.position.distanceTo(z.position) <= z.radius) { inside = z; break }
    }
    const id = inside?.id ?? null
    if (id !== lastZone.current) {
      lastZone.current = id
      onNebulaChange?.(inside?.color ?? null)
    }
  })

  return (
    <>
      {NEBULA_ZONES.map((z, i) => (
        <group key={z.id} position={z.position.toArray()}>
          <mesh ref={(m) => { meshRefs.current[i] = m }}>
            <sphereGeometry args={[z.radius, 32, 32]} />
            <meshBasicMaterial
              color={z.color}
              transparent
              opacity={0.08}
              depthWrite={false}
              side={THREE.BackSide}
              toneMapped={false}
            />
          </mesh>
          {/* Bright core */}
          <mesh>
            <sphereGeometry args={[z.radius * 0.45, 24, 24]} />
            <meshBasicMaterial
              color={z.color}
              transparent
              opacity={0.05}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
          <pointLight color={z.color} intensity={0.4} distance={z.radius * 1.2} />
        </group>
      ))}
    </>
  )
}
