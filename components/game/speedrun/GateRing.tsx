'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GATE_RADIUS, GATE_TUBE, GATE_APPROACH_DIST } from '@/lib/game/speedrun/tracks'

export type GateStatus = 'pending' | 'approaching' | 'cleared' | 'missed'

interface Props {
  index: number
  position: [number, number, number]
  yaw: number
  status: GateStatus
  isNext: boolean
  shipPosition: React.MutableRefObject<THREE.Vector3>
}

const CLEARED_COLOR = new THREE.Color('#7fff9f')
const MISSED_COLOR = new THREE.Color('#ff5a5a')
const NEXT_COLOR = new THREE.Color('#00d4ff')
const IDLE_COLOR = new THREE.Color('#7a7aa0')

export default function GateRing({ index, position, yaw, status, isNext, shipPosition }: Props) {
  const ringRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const scaleRef = useRef(1)
  const hitAnimRef = useRef(0)
  const lastStatusRef = useRef<GateStatus>(status)

  useFrame((_, delta) => {
    if (!ringRef.current || !matRef.current) return

    // Trigger pass/miss animation on status transition.
    if (status !== lastStatusRef.current) {
      if (status === 'cleared' || status === 'missed') hitAnimRef.current = 1
      lastStatusRef.current = status
    }

    const ringPos = ringRef.current.position
    const dx = shipPosition.current.x - ringPos.x
    const dy = shipPosition.current.y - ringPos.y
    const dz = shipPosition.current.z - ringPos.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

    // Color by status.
    let color: THREE.Color
    let baseOpacity = 0.5
    let emissive = 0
    if (status === 'cleared') {
      color = CLEARED_COLOR
      baseOpacity = 0.75
    } else if (status === 'missed') {
      color = MISSED_COLOR
      baseOpacity = 0.85
    } else if (isNext) {
      color = NEXT_COLOR
      const approaching = dist < GATE_APPROACH_DIST
      const pulse = approaching
        ? 0.75 + 0.25 * Math.sin(performance.now() * 0.012)
        : 0.55 + 0.15 * Math.sin(performance.now() * 0.003)
      baseOpacity = pulse
      emissive = approaching ? 1 : 0.5
    } else {
      color = IDLE_COLOR
      baseOpacity = 0.35
    }

    // Hit animation scale pop.
    if (hitAnimRef.current > 0) {
      scaleRef.current = 1 + hitAnimRef.current * 0.35
      baseOpacity = Math.max(baseOpacity, hitAnimRef.current)
      hitAnimRef.current = Math.max(0, hitAnimRef.current - delta * 1.5)
    } else {
      const targetScale = status === 'cleared' ? 1.05 : 1
      scaleRef.current += (targetScale - scaleRef.current) * Math.min(1, delta * 6)
    }
    ringRef.current.scale.setScalar(scaleRef.current)

    matRef.current.color.copy(color)
    matRef.current.opacity = baseOpacity
    if (lightRef.current) {
      lightRef.current.color.copy(color)
      lightRef.current.intensity = emissive * 4 + (status === 'cleared' ? 2 : 0)
      lightRef.current.distance = GATE_RADIUS * 3
    }
  })

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[GATE_RADIUS, GATE_TUBE, 16, 48]} />
        <meshBasicMaterial
          ref={matRef}
          color={NEXT_COLOR}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
      {/* Number plate */}
      <mesh position={[0, GATE_RADIUS + 1.5, 0]}>
        <planeGeometry args={[2.4, 1.4]} />
        <meshBasicMaterial color="#0a0620" opacity={0.9} transparent toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0, 0]} color={NEXT_COLOR} intensity={0} distance={30} />
      {/* Tiny debug helper — number via HTML is avoided to keep scene light */}
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshBasicMaterial />
      </mesh>
      {/* index tag for debug */}
      <group visible={false}><mesh><sphereGeometry args={[0.01, 4, 4]} /></mesh></group>
      <group userData={{ gateIndex: index }} />
    </group>
  )
}
