'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { nearestObstacle, type Obstacle } from '@/lib/game/physics'
import { PLANETS } from '../types'
import type { ShipState } from '../types'
import * as THREE from 'three'

interface Props {
  ship: React.MutableRefObject<ShipState>
  padding?: number
}

export default function PlanetCollision({ ship, padding = 2 }: Props) {
  const obstacles = useMemo<Obstacle[]>(
    () => PLANETS.map(p => ({
      id: p.id,
      pos: { x: p.position.x, y: p.position.y, z: p.position.z },
      radius: p.radius + padding,
    })),
    [padding],
  )

  const lastHit = useRef(0)
  const push = useRef(new THREE.Vector3())

  useFrame(() => {
    const s = ship.current
    const shipPos = { x: s.position.x, y: s.position.y, z: s.position.z }
    const hit = nearestObstacle(shipPos, obstacles, 1000)
    if (!hit) return
    const dx = s.position.x - hit.pos.x
    const dy = s.position.y - hit.pos.y
    const dz = s.position.z - hit.pos.z
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const minDist = hit.radius + 1.5

    if (d < minDist && d > 0.0001) {
      // Push ship out along the normal so it never passes through the surface
      push.current.set(dx / d, dy / d, dz / d)
      s.position.set(
        hit.pos.x + push.current.x * minDist,
        hit.pos.y + push.current.y * minDist,
        hit.pos.z + push.current.z * minDist,
      )
      // Reflect velocity component along normal, damped
      const vDotN = s.velocity.x * push.current.x + s.velocity.y * push.current.y + s.velocity.z * push.current.z
      if (vDotN < 0) {
        s.velocity.x -= 1.6 * vDotN * push.current.x
        s.velocity.y -= 1.6 * vDotN * push.current.y
        s.velocity.z -= 1.6 * vDotN * push.current.z
        s.velocity.multiplyScalar(0.5)
      }

      const now = performance.now()
      if (now - lastHit.current > 500) {
        lastHit.current = now
        s.shakeUntil = now + 500
        s.shakeStrength = 0.6
        s.shield = Math.max(0, s.shield - 8)
      }
    }
  })

  return null
}
