'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from './types'
import type { MissionWaypoint } from '@/lib/game/missions/waypoints'
import { MISSION_WAYPOINT_REACH } from '@/lib/game/missions/waypoints'

interface Props {
  ship: React.MutableRefObject<ShipState>
  waypoints: readonly MissionWaypoint[]
  currentIndex: number
  onCleared: (index: number) => void
}

const NEXT_COLOR = new THREE.Color('#00d4ff')
const CLEARED_COLOR = new THREE.Color('#7fff9f')
const PENDING_COLOR = new THREE.Color('#7a7aa0')
const FINAL_COLOR = new THREE.Color('#ffd166')

export default function MissionRunner({ ship, waypoints, currentIndex, onCleared }: Props) {
  if (waypoints.length === 0) return null
  return (
    <group>
      {waypoints.map((w, i) => (
        <WaypointRing
          key={i}
          index={i}
          waypoint={w}
          status={
            i < currentIndex ? 'cleared'
              : i === currentIndex ? 'next'
              : 'pending'
          }
          isFinal={i === waypoints.length - 1}
          ship={ship}
          onCleared={onCleared}
        />
      ))}
    </group>
  )
}

function WaypointRing({
  index,
  waypoint,
  status,
  isFinal,
  ship,
  onCleared,
}: {
  index: number
  waypoint: MissionWaypoint
  status: 'pending' | 'next' | 'cleared'
  isFinal: boolean
  ship: React.MutableRefObject<ShipState>
  onCleared: (index: number) => void
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const triggered = useRef(false)

  useFrame(() => {
    if (!ringRef.current || !matRef.current) return
    const dx = ship.current.position.x - waypoint.x
    const dy = ship.current.position.y - waypoint.y
    const dz = ship.current.position.z - waypoint.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (status === 'next' && !triggered.current && dist < MISSION_WAYPOINT_REACH) {
      triggered.current = true
      onCleared(index)
    }

    let color: THREE.Color
    let opacity = 0.5
    let intensity = 0
    if (status === 'cleared') {
      color = CLEARED_COLOR; opacity = 0.72
    } else if (status === 'next') {
      color = isFinal ? FINAL_COLOR : NEXT_COLOR
      const pulse = 0.7 + 0.3 * Math.sin(performance.now() * 0.009)
      opacity = pulse
      intensity = dist < 60 ? 3 : 1.5
    } else {
      color = PENDING_COLOR; opacity = 0.32
    }
    matRef.current.color.copy(color)
    matRef.current.opacity = opacity
    if (lightRef.current) {
      lightRef.current.color.copy(color)
      lightRef.current.intensity = intensity
    }
  })

  const radius = isFinal ? 18 : 12
  return (
    <group position={[waypoint.x, waypoint.y, waypoint.z]}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.55, 16, 40]} />
        <meshBasicMaterial ref={matRef} color={NEXT_COLOR} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} intensity={0} distance={radius * 4} color={NEXT_COLOR} />
    </group>
  )
}
