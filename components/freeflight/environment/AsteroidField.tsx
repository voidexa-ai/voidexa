'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { checkCollision, type Obstacle } from '@/lib/game/physics'
import type { ShipState } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  count?: number
  center?: [number, number, number]
  spread?: number
}

function makeNoisyIcosa(radius: number, seed: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(radius, 1)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const n = Math.sin(x * 3 + seed) * 0.12 + Math.cos(y * 2.5 + seed * 1.7) * 0.12 + Math.sin(z * 2 + seed * 0.5) * 0.08
    const s = 1 + n
    pos.setXYZ(i, x * s, y * s, z * s)
  }
  geo.computeVertexNormals()
  return geo
}

export default function AsteroidField({
  ship,
  count = 260,
  center = [-60, 0, -40],
  spread = 180,
}: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { geometry, data } = useMemo(() => {
    const geometry = makeNoisyIcosa(1, 7.3)
    const rng = (() => {
      let s = 12345
      return () => {
        s = (s * 9301 + 49297) % 233280
        return s / 233280
      }
    })()
    const data = Array.from({ length: count }, () => {
      const r = 0.8 + rng() * 3.2
      return {
        pos: new THREE.Vector3(
          center[0] + (rng() - 0.5) * spread,
          center[1] + (rng() - 0.5) * (spread * 0.4),
          center[2] + (rng() - 0.5) * spread,
        ),
        rot: new THREE.Euler(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI),
        rotSpeed: new THREE.Vector3((rng() - 0.5) * 0.3, (rng() - 0.5) * 0.3, (rng() - 0.5) * 0.3),
        scale: r,
      }
    })
    return { geometry, data }
  }, [count, spread, center[0], center[1], center[2]])

  const obstacles: Obstacle[] = useMemo(
    () => data.map((d, i) => ({
      id: `ast-${i}`,
      pos: { x: d.pos.x, y: d.pos.y, z: d.pos.z },
      radius: d.scale,
    })),
    [data],
  )

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8a7f72',
    roughness: 0.95,
    metalness: 0.05,
    emissive: '#1a0f08',
  }), [])

  useEffect(() => {
    if (!meshRef.current) return
    const m = new THREE.Matrix4()
    data.forEach((d, i) => {
      m.compose(
        d.pos,
        new THREE.Quaternion().setFromEuler(d.rot),
        new THREE.Vector3(d.scale, d.scale, d.scale),
      )
      meshRef.current!.setMatrixAt(i, m)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [data])

  const lastCollision = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const dt = Math.min(delta, 0.05)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const scl = new THREE.Vector3()

    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      d.rot.x += d.rotSpeed.x * dt
      d.rot.y += d.rotSpeed.y * dt
      d.rot.z += d.rotSpeed.z * dt
      q.setFromEuler(d.rot)
      scl.set(d.scale, d.scale, d.scale)
      m.compose(d.pos, q, scl)
      meshRef.current.setMatrixAt(i, m)
    }
    meshRef.current.instanceMatrix.needsUpdate = true

    // Collision
    const s = ship.current
    const now = performance.now()
    if (now - lastCollision.current > 500) {
      const shipPos = { x: s.position.x, y: s.position.y, z: s.position.z }
      const hit = checkCollision(shipPos, obstacles, 1.5)
      if (hit) {
        lastCollision.current = now
        s.shakeUntil = now + 400
        s.shakeStrength = 0.4
        s.velocity.multiplyScalar(-0.3)
        s.shield = Math.max(0, s.shield - 5)
      }
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} castShadow={false} receiveShadow={false} />
  )
}
