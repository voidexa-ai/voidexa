'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'
import {
  EXPLORATION_ENCOUNTERS,
  ENCOUNTER_PING_RADIUS,
  ENCOUNTER_TRIGGER_RADIUS,
  type ExplorationEncounter,
  type EncounterTrigger,
} from '@/lib/game/freeflight/explorationEncounters'

interface Props {
  ship: React.MutableRefObject<ShipState>
  resolvedIds: ReadonlySet<string>
  onNearChange?: (enc: ExplorationEncounter | null, inRange: boolean) => void
  onTrigger?: (enc: ExplorationEncounter) => void
}

export default function ExplorationEncounters({
  ship,
  resolvedIds,
  onNearChange,
  onTrigger,
}: Props) {
  const lastNearId = useRef<string | null>(null)
  const triggered = useRef<Set<string>>(new Set())

  useFrame(() => {
    const pos = ship.current.position
    let nearest: ExplorationEncounter | null = null
    let nearestDist = Infinity
    for (const e of EXPLORATION_ENCOUNTERS) {
      if (resolvedIds.has(e.id)) continue
      const dx = pos.x - e.x, dy = pos.y - e.y, dz = pos.z - e.z
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < ENCOUNTER_PING_RADIUS && d < nearestDist) {
        nearest = e
        nearestDist = d
      }
      if (d < ENCOUNTER_TRIGGER_RADIUS && !triggered.current.has(e.id)) {
        triggered.current.add(e.id)
        onTrigger?.(e)
      }
    }
    const nearestId = nearest?.id ?? null
    if (nearestId !== lastNearId.current) {
      lastNearId.current = nearestId
      onNearChange?.(nearest, nearest != null && nearestDist < ENCOUNTER_TRIGGER_RADIUS)
    }
  })

  return (
    <group>
      {EXPLORATION_ENCOUNTERS.filter(e => !resolvedIds.has(e.id)).map(e => (
        <EncounterGlyph key={e.id} encounter={e} />
      ))}
    </group>
  )
}

const TRIGGER_COLOR: Record<EncounterTrigger, string> = {
  visual:       '#7fd8ff',
  audio:        '#af52de',
  scanner_ping: '#7fff9f',
  proximity:    '#ffd166',
}

function EncounterGlyph({ encounter }: { encounter: ExplorationEncounter }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const color = useMemo(() => new THREE.Color(TRIGGER_COLOR[encounter.trigger]), [encounter.trigger])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = performance.now() * 0.0005
      meshRef.current.rotation.x = performance.now() * 0.0003
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(performance.now() * 0.004) * 0.4
    }
  })

  return (
    <group position={[encounter.x, encounter.y, encounter.z]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={1.2} distance={24} />
    </group>
  )
}
