'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  active: boolean
  doorProgress: number
  revealProgress: number
}

export default function SceneDoorOpen({ active, doorProgress, revealProgress }: Props) {
  const doorRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const landmarksRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (doorRef.current) {
      const angle = -Math.min(doorProgress, 1) * Math.PI * 0.55
      doorRef.current.rotation.x = angle
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.2 + doorProgress * 1.6
    }
    if (landmarksRef.current) {
      const mat = (landmarksRef.current.children[0] as THREE.Mesh)
        ?.material as THREE.MeshBasicMaterial | undefined
      if (mat) mat.opacity = revealProgress * 0.55
    }
  })

  if (!active) return null

  return (
    <group>
      <mesh position={[0, -1.4, -3]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#0a0a14" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[-3.6, 0, -3]}>
        <boxGeometry args={[0.4, 4, 14]} />
        <meshStandardMaterial color="#1c1c2a" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[3.6, 0, -3]}>
        <boxGeometry args={[0.4, 4, 14]} />
        <meshStandardMaterial color="#1c1c2a" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.8, -3]}>
        <boxGeometry args={[7.2, 0.4, 14]} />
        <meshStandardMaterial color="#11111a" roughness={0.7} metalness={0.3} />
      </mesh>

      <group position={[0, -1.4, -10]}>
        <mesh ref={doorRef}>
          <boxGeometry args={[7.0, 0.18, 5.4]} />
          <meshStandardMaterial
            color="#16161f"
            roughness={0.55}
            metalness={0.6}
            emissive="#00d4ff"
            emissiveIntensity={Math.min(doorProgress, 1) * 0.35}
          />
        </mesh>
      </group>

      <group ref={landmarksRef} position={[0, 0, -28]}>
        <mesh>
          <sphereGeometry args={[1.4, 24, 24]} />
          <meshBasicMaterial
            color="#7fd8ff"
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-5, 1.2, -6]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} toneMapped={false} />
        </mesh>
        <mesh position={[5, -1.2, -8]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#ffaa66" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      </group>

      <pointLight ref={lightRef} position={[0, 0, -16]} color="#aee2ff" intensity={0.2} distance={40} />
      <ambientLight intensity={0.22} />
    </group>
  )
}
