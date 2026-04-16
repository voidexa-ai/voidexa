'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export type WaypointStatus = 'pending' | 'next' | 'cleared'

interface Props {
  position: [number, number, number]
  status: WaypointStatus
  label: string
  kind: 'origin' | 'checkpoint' | 'destination'
}

const NEXT_COLOR = new THREE.Color('#00d4ff')
const CLEARED_COLOR = new THREE.Color('#7fff9f')
const IDLE_COLOR = new THREE.Color('#7a7aa0')
const DEST_COLOR = new THREE.Color('#ffd166')

export default function WaypointMarker({ position, status, label: _label, kind }: Props) {
  const ringRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (!ringRef.current || !matRef.current) return
    let color: THREE.Color
    let opacity = 0.5
    let intensity = 0
    if (status === 'cleared') {
      color = CLEARED_COLOR
      opacity = 0.75
    } else if (status === 'next') {
      color = kind === 'destination' ? DEST_COLOR : NEXT_COLOR
      const pulse = 0.7 + 0.3 * Math.sin(performance.now() * 0.01)
      opacity = pulse
      intensity = 2
    } else {
      color = IDLE_COLOR
      opacity = 0.3
    }
    matRef.current.color.copy(color)
    matRef.current.opacity = opacity
    if (lightRef.current) {
      lightRef.current.color.copy(color)
      lightRef.current.intensity = intensity
    }
  })

  const radius = kind === 'destination' ? 18 : kind === 'origin' ? 14 : 12

  return (
    <group position={position}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.5, 12, 32]} />
        <meshBasicMaterial ref={matRef} color={NEXT_COLOR} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} intensity={0} distance={radius * 3} color={NEXT_COLOR} />
    </group>
  )
}
