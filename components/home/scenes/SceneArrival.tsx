'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  active: boolean
  elapsed: number
}

const FAR_STAR_COUNT = 1500

function buildArrivalStars(seed: number): Float32Array {
  const arr = new Float32Array(FAR_STAR_COUNT * 3)
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < FAR_STAR_COUNT; i++) {
    const r = 60 + rand() * 90
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi)
  }
  return arr
}

export default function SceneArrival({ active, elapsed }: Props) {
  const sunRef = useRef<THREE.Mesh>(null)
  const sunHaloRef = useRef<THREE.Mesh>(null)
  const claimRef = useRef<THREE.Mesh>(null)
  const constRef = useRef<THREE.Group>(null)
  const [positions] = useState(() => buildArrivalStars(91827))

  useFrame((_, delta) => {
    if (sunRef.current) {
      const pulse = 0.92 + Math.sin(elapsed * 1.6) * 0.08
      sunRef.current.scale.setScalar(pulse)
    }
    if (sunHaloRef.current) {
      const mat = sunHaloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.14 + Math.sin(elapsed * 0.9) * 0.04
    }
    if (claimRef.current) {
      claimRef.current.rotation.y += delta * 0.12
    }
    if (constRef.current) {
      constRef.current.rotation.y += delta * 0.02
    }
  })

  if (!active) return null

  return (
    <group>
      <points raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#dfeaff"
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      <mesh ref={sunRef} position={[0, 0, -22]}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshBasicMaterial color="#7fd8ff" toneMapped={false} />
      </mesh>
      <mesh ref={sunHaloRef} position={[0, 0, -22]}>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial
          color="#3da6ff"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={claimRef} position={[12, -2, -38]}>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshStandardMaterial
          color="#0c1830"
          emissive="#00d4ff"
          emissiveIntensity={0.55}
          roughness={0.7}
        />
      </mesh>

      <group ref={constRef}>
        <mesh position={[-9, 4, -34]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshBasicMaterial color="#a78bfa" toneMapped={false} />
        </mesh>
        <mesh position={[-14, -3, -42]}>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshBasicMaterial color="#ffaa66" toneMapped={false} />
        </mesh>
        <mesh position={[7, 5, -45]}>
          <sphereGeometry args={[0.45, 12, 12]} />
          <meshBasicMaterial color="#66ffaa" toneMapped={false} />
        </mesh>
      </group>

      <ambientLight intensity={0.18} />
      <pointLight position={[0, 0, -22]} intensity={1.4} color="#7fd8ff" distance={60} />
    </group>
  )
}
