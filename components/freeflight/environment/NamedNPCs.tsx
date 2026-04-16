'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'
import {
  NPCS,
  NPC_GREET_RADIUS,
  NPC_WARN_RADIUS,
  type NPCDef,
  type NPCShipClass,
} from '@/lib/game/freeflight/npcs'

interface Props {
  ship: React.MutableRefObject<ShipState>
  onNearChange?: (npc: NPCDef | null, isHostile: boolean) => void
}

export default function NamedNPCs({ ship, onNearChange }: Props) {
  const lastNearId = useRef<string | null>(null)

  useFrame(() => {
    let nearest: NPCDef | null = null
    let nearestDist = Infinity
    const pos = ship.current.position
    for (const npc of NPCS) {
      const dx = pos.x - npc.anchor.x
      const dy = pos.y - npc.anchor.y
      const dz = pos.z - npc.anchor.z
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const triggerRadius = npc.role === 'pirate' ? NPC_WARN_RADIUS : NPC_GREET_RADIUS
      if (d < triggerRadius + npc.patrolRadius && d < nearestDist) {
        nearest = npc
        nearestDist = d
      }
    }
    const nearestId = nearest?.id ?? null
    if (nearestId !== lastNearId.current) {
      lastNearId.current = nearestId
      onNearChange?.(nearest, nearest?.role === 'pirate')
    }
  })

  return (
    <group>
      {NPCS.map(npc => <NPCMesh key={npc.id} npc={npc} />)}
    </group>
  )
}

function NPCMesh({ npc }: { npc: NPCDef }) {
  const groupRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const color = useMemo(() => new THREE.Color(npc.color), [npc.color])
  const phase = useMemo(() => {
    let h = 0
    for (const ch of npc.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
    return (h % 1000) / 1000
  }, [npc.id])

  useFrame(() => {
    if (!groupRef.current) return
    const t = performance.now() / 1000 / npc.patrolPeriod + phase
    const a = t * Math.PI * 2
    groupRef.current.position.set(
      npc.anchor.x + Math.cos(a) * npc.patrolRadius,
      npc.anchor.y + Math.sin(a * 0.6) * (npc.patrolRadius * 0.3),
      npc.anchor.z + Math.sin(a) * npc.patrolRadius,
    )
    const forward = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a))
    groupRef.current.lookAt(groupRef.current.position.clone().add(forward))
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(performance.now() * 0.003) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <ClassMesh cls={npc.shipClass} color={color} />
      <pointLight ref={lightRef} color={color} intensity={1.4} distance={12} />
    </group>
  )
}

function ClassMesh({ cls, color }: { cls: NPCShipClass; color: THREE.Color }) {
  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.9}
      roughness={0.4}
      toneMapped={false}
    />
  )
  switch (cls) {
    case 'hauler':
      return <mesh><boxGeometry args={[2.5, 1.2, 1.4]} />{mat}</mesh>
    case 'fighter':
      return <mesh rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.9, 2.4, 8]} />{mat}</mesh>
    case 'salvager':
      return <mesh rotation={[0, Math.PI / 4, 0]}><tetrahedronGeometry args={[1.3]} />{mat}</mesh>
    case 'explorer':
      return <mesh><octahedronGeometry args={[1.1]} />{mat}</mesh>
    case 'bob':
      return <mesh><dodecahedronGeometry args={[0.9]} />{mat}</mesh>
  }
}
