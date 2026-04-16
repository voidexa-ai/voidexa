'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'
import {
  LANDMARKS,
  LANDMARK_SCAN_RADIUS,
  type LandmarkDef,
  type LandmarkType,
} from '@/lib/game/freeflight/landmarks'

interface Props {
  ship: React.MutableRefObject<ShipState>
  onNearChange?: (landmark: LandmarkDef | null) => void
}

export default function Landmarks({ ship, onNearChange }: Props) {
  const lastNearId = useRef<string | null>(null)

  useFrame(() => {
    let nearest: LandmarkDef | null = null
    let nearestDist = Infinity
    const pos = ship.current.position
    for (const lm of LANDMARKS) {
      const dx = pos.x - lm.x, dy = pos.y - lm.y, dz = pos.z - lm.z
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < LANDMARK_SCAN_RADIUS && d < nearestDist) {
        nearest = lm
        nearestDist = d
      }
    }
    const nearestId = nearest?.id ?? null
    if (nearestId !== lastNearId.current) {
      lastNearId.current = nearestId
      onNearChange?.(nearest)
    }
  })

  return (
    <group>
      {LANDMARKS.map(lm => <LandmarkMesh key={lm.id} landmark={lm} />)}
    </group>
  )
}

function LandmarkMesh({ landmark }: { landmark: LandmarkDef }) {
  const groupRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const color = useMemo(() => new THREE.Color(landmark.color), [landmark.color])

  useFrame(() => {
    if (groupRef.current) {
      // Slow rotation for stations + relays, gentle bob for others.
      const t = performance.now() * 0.00012
      if (landmark.type === 'station' || landmark.type === 'relay' || landmark.type === 'data_vault') {
        groupRef.current.rotation.y = t
      } else {
        groupRef.current.position.y = landmark.y + Math.sin(t * 40) * 0.4
      }
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.6 + Math.sin(performance.now() * 0.002) * 0.3
    }
  })

  const geometry = primitiveFor(landmark.type, landmark.scale)
  return (
    <group ref={groupRef} position={[landmark.x, landmark.y, landmark.z]}>
      {geometry}
      <pointLight ref={lightRef} color={color} intensity={1.6} distance={landmark.scale * 40} />
    </group>
  )
}

function primitiveFor(type: LandmarkType, scale: number): React.ReactNode {
  const emissive = (color: string, intensity = 1.2) => (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      roughness={0.5}
      toneMapped={false}
    />
  )
  switch (type) {
    case 'station':
      return (
        <>
          <mesh>
            <cylinderGeometry args={[3 * scale, 3 * scale, 4 * scale, 16]} />
            {emissive('#e0d9ff', 0.8)}
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[5 * scale, 0.4 * scale, 12, 32]} />
            <meshBasicMaterial color="#ffd166" toneMapped={false} />
          </mesh>
        </>
      )
    case 'monument':
      return (
        <group>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 3 * scale, 0, Math.sin(a) * 3 * scale]} rotation={[0, a, 0]}>
                <boxGeometry args={[0.6 * scale, 3 * scale, 0.6 * scale]} />
                <meshStandardMaterial color="#15151f" emissive="#af52de" emissiveIntensity={0.7} toneMapped={false} />
              </mesh>
            )
          })}
        </group>
      )
    case 'training_ring':
      return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5 * scale, 0.45 * scale, 16, 36]} />
          {emissive('#7fff9f', 1.5)}
        </mesh>
      )
    case 'beacon_garden':
      return (
        <group>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            const r = 2.2 * scale + (i % 2) * 0.8
            return (
              <mesh key={i} position={[Math.cos(a) * r, (i % 3 - 1) * 0.8, Math.sin(a) * r]}>
                <sphereGeometry args={[0.25 * scale, 8, 8]} />
                <meshBasicMaterial color="#ffd166" toneMapped={false} />
              </mesh>
            )
          })}
        </group>
      )
    case 'bio_dome':
      return (
        <>
          <mesh>
            <sphereGeometry args={[3 * scale, 24, 24]} />
            <meshStandardMaterial color="#7fff7f" emissive="#7fff7f" emissiveIntensity={0.5} transparent opacity={0.7} toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[2.4 * scale, 16, 16]} />
            <meshBasicMaterial color="#1a3f1a" toneMapped={false} />
          </mesh>
        </>
      )
    case 'relay':
      return (
        <>
          <mesh>
            <cylinderGeometry args={[0.4 * scale, 0.4 * scale, 6 * scale, 8]} />
            {emissive('#ffdd66', 1.0)}
          </mesh>
          <mesh position={[0, 3 * scale, 0]}>
            <coneGeometry args={[1.5 * scale, 1.2 * scale, 8]} />
            {emissive('#ffeaa0', 1.2)}
          </mesh>
        </>
      )
    case 'gate_marker':
      return (
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[4 * scale, 0.6 * scale, 8, 24, Math.PI]} />
          {emissive('#cd7f32', 1.8)}
        </mesh>
      )
    case 'waypoint_path':
      return (
        <group>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[i * 1.2 * scale, 0, 0]}>
              <boxGeometry args={[0.6 * scale, 0.2 * scale, 0.2 * scale]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          ))}
        </group>
      )
    case 'refinery':
      return (
        <>
          <mesh>
            <boxGeometry args={[2 * scale, 5 * scale, 2 * scale]} />
            <meshStandardMaterial color="#2b3138" emissive="#5ac8fa" emissiveIntensity={0.3} toneMapped={false} />
          </mesh>
          <mesh position={[0, 3 * scale, 0]}>
            <cylinderGeometry args={[0.3 * scale, 0.3 * scale, 2 * scale, 6]} />
            {emissive('#5ac8fa', 1.4)}
          </mesh>
        </>
      )
    case 'data_vault':
      return (
        <mesh>
          <boxGeometry args={[3 * scale, 3 * scale, 3 * scale]} />
          <meshStandardMaterial color="#1a1a2a" emissive="#d87fff" emissiveIntensity={0.8} roughness={0.2} metalness={0.8} toneMapped={false} />
        </mesh>
      )
    case 'agri_orbital':
      return (
        <>
          <mesh>
            <sphereGeometry args={[3 * scale, 24, 24]} />
            <meshStandardMaterial color="#1a2a0f" emissive="#9cff9c" emissiveIntensity={0.4} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[4.5 * scale, 0.4 * scale, 8, 32]} />
            <meshBasicMaterial color="#9cff9c" toneMapped={false} />
          </mesh>
        </>
      )
  }
}
