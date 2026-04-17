'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  active: boolean
  elapsed: number
}

const STAR_COUNT = 1200

function buildStarPositions(seed: number): Float32Array {
  const arr = new Float32Array(STAR_COUNT * 3)
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 30 + rand() * 80
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi) - 30
  }
  return arr
}

export default function SceneApproach({ active, elapsed }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const starsRef = useRef<THREE.Points>(null)
  const voidexaPointRef = useRef<THREE.Mesh>(null)
  const [positions] = useState(() => buildStarPositions(73312))

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const driftSpeed = 1.4
    groupRef.current.position.z += delta * driftSpeed
    if (groupRef.current.position.z > 60) groupRef.current.position.z = -60
    if (voidexaPointRef.current) {
      const pulse = 0.85 + Math.sin(elapsed * 1.5) * 0.15
      const mat = voidexaPointRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = pulse
    }
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.005
    }
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      <points ref={starsRef} raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#cfe7ff"
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <mesh ref={voidexaPointRef} position={[0, 0, -55]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#7fd8ff" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -55]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial color="#3da6ff" transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}
