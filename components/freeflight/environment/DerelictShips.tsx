'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { ShipState, DerelictDef } from '../types'
import { DERELICTS } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  onNearChange?: (derelict: DerelictDef | null) => void
}

const SCAN_RADIUS = 40

function DerelictModel({ url }: { url: string }) {
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene.clone()} scale={1.0} />
}

export default function DerelictShips({ ship, onNearChange }: Props) {
  const tumbleRefs = useRef<(THREE.Group | null)[]>([])
  const lastNear = useRef<string | null>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    tumbleRefs.current.forEach((g, i) => {
      if (g) {
        const base = DERELICTS[i].rotation
        g.rotation.x = base[0] + Math.sin(t * 0.12 + i) * 0.25
        g.rotation.y = base[1] + t * 0.04 * (i % 2 === 0 ? 1 : -1)
        g.rotation.z = base[2] + Math.cos(t * 0.1 + i * 0.7) * 0.2
      }
    })

    const s = ship.current
    let near: DerelictDef | null = null
    let nearestDist = Infinity
    for (const d of DERELICTS) {
      const dist = s.position.distanceTo(d.position)
      if (dist <= SCAN_RADIUS && dist < nearestDist) {
        near = d
        nearestDist = dist
      }
    }
    const id = near?.id ?? null
    if (id !== lastNear.current) {
      lastNear.current = id
      onNearChange?.(near)
    }
  })

  return (
    <>
      {DERELICTS.map((d, i) => (
        <group key={d.id} position={d.position.toArray()}>
          <group ref={(g) => { tumbleRefs.current[i] = g }}>
            <DerelictModel url={d.model} />
          </group>
          <pointLight color="#ff8855" intensity={0.25} distance={20} />
        </group>
      ))}
    </>
  )
}

DERELICTS.forEach(d => useGLTF.preload(d.model))
