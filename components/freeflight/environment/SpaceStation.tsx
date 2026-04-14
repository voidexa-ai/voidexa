'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'
import { STATIONS } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  onDockPromptChange?: (name: string | null) => void
}

export default function SpaceStations({ ship, onDockPromptChange }: Props) {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([])
  const beaconRefs = useRef<(THREE.PointLight | null)[]>([])
  const lastPromptRef = useRef<string | null>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ringRefs.current.forEach((r, i) => {
      if (r) r.rotation.y = t * (0.3 + i * 0.05)
    })
    beaconRefs.current.forEach((b, i) => {
      if (b) b.intensity = 3 + Math.sin(t * 2 + i) * 2
    })

    let inRange: string | null = null
    const s = ship.current
    for (const st of STATIONS) {
      const d = s.position.distanceTo(st.position)
      if (d <= st.dockRadius) {
        inRange = st.name
        break
      }
    }
    if (inRange !== lastPromptRef.current) {
      lastPromptRef.current = inRange
      onDockPromptChange?.(inRange)
    }
  })

  return (
    <>
      {STATIONS.map((st, i) => (
        <group key={st.id} position={st.position.toArray()}>
          {/* Cylinder body */}
          <mesh>
            <cylinderGeometry args={[2, 2, 6, 16]} />
            <meshStandardMaterial color="#4a5a70" metalness={0.7} roughness={0.4} emissive="#0a1420" emissiveIntensity={0.5} />
          </mesh>
          {/* Outer ring */}
          <mesh ref={(r) => { ringRefs.current[i] = r }}>
            <torusGeometry args={[6, 0.4, 8, 48]} />
            <meshStandardMaterial color="#5a6a80" metalness={0.6} roughness={0.5} emissive="#00334d" emissiveIntensity={0.8} />
          </mesh>
          {/* Antenna */}
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 6]} />
            <meshStandardMaterial color="#9aa5b0" />
          </mesh>
          {/* Beacon light */}
          <pointLight
            ref={(l) => { beaconRefs.current[i] = l }}
            position={[0, 6, 0]}
            color="#00d4ff"
            intensity={4}
            distance={40}
          />
          <mesh position={[0, 6, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshBasicMaterial color="#00ffff" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  )
}
