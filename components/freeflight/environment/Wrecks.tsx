'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'
import type { WreckRow } from '@/lib/game/wrecks/types'

const WRECK_PROX_RADIUS = 35

interface Props {
  wrecks: readonly WreckRow[]
  ship: React.MutableRefObject<ShipState>
  onNearChange?: (wreck: WreckRow | null) => void
}

export default function Wrecks({ wrecks, ship, onNearChange }: Props) {
  const lastNearId = useRef<string | null>(null)

  useFrame(() => {
    let nearest: WreckRow | null = null
    let nearestDist = Infinity
    const pos = ship.current.position
    for (const w of wrecks) {
      if (w.phase !== 'protected' && w.phase !== 'abandoned') continue
      const dx = pos.x - w.position.x, dy = pos.y - w.position.y, dz = pos.z - w.position.z
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < WRECK_PROX_RADIUS && d < nearestDist) { nearest = w; nearestDist = d }
    }
    const nearestId = nearest?.id ?? null
    if (nearestId !== lastNearId.current) {
      lastNearId.current = nearestId
      onNearChange?.(nearest)
    }
  })

  return (
    <group>
      {wrecks
        .filter(w => w.phase === 'protected' || w.phase === 'abandoned')
        .map(w => <WreckMesh key={w.id} wreck={w} />)}
    </group>
  )
}

function WreckMesh({ wreck }: { wreck: WreckRow }) {
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const color = useMemo(
    () => new THREE.Color(wreck.phase === 'protected' ? '#ffd166' : '#ff6b6b'),
    [wreck.phase],
  )

  useFrame(() => {
    if (groupRef.current) {
      const t = performance.now() * 0.0001
      groupRef.current.rotation.x = Math.sin(t * 1.1) * 0.2
      groupRef.current.rotation.y = t * 2
      groupRef.current.rotation.z = Math.cos(t * 0.9) * 0.15
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.3 + Math.sin(performance.now() * 0.003) * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[wreck.position.x, wreck.position.y, wreck.position.z]}>
      <mesh>
        <icosahedronGeometry args={[2.2, 0]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          metalness={0.6}
          roughness={0.6}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={color} intensity={1.6} distance={18} />
    </group>
  )
}
