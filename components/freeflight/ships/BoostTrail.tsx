'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  /** Local-space engine emission point (behind ship in ship-local coords). */
  origin?: [number, number, number]
}

const PARTICLE_COUNT = 150
const NORMAL_LIFE = 0.3
const BOOST_LIFE = 0.5

/**
 * Particle trail behind the ship. Each particle is spawned in WORLD space at
 * the engine emission point and drifts freely — we keep a separate position
 * buffer from the ship group so the trail is left behind instead of following.
 */
export default function BoostTrail({ ship, origin = [0, 0, 2] }: Props) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, ages, velocities, lifes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const ages = new Float32Array(PARTICLE_COUNT)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const lifes = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      ages[i] = Math.random() // stagger so we don't pop all at once
      lifes[i] = NORMAL_LIFE
    }
    return { positions, ages, velocities, lifes }
  }, [])

  const colors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), [])
  const sizes = useMemo(() => new Float32Array(PARTICLE_COUNT), [])

  const cursor = useRef(0)
  const tmpOrigin = useRef(new THREE.Vector3()).current
  const tmpBack = useRef(new THREE.Vector3()).current
  const tmpJitter = useRef(new THREE.Vector3()).current

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const s = ship.current
    const speedN = Math.min(1, s.speed / 160)
    const boost = s.boost

    // Emission rate scales with speed; much higher during boost.
    const emitPerSec = boost ? 600 : 180 + speedN * 200
    const toEmit = emitPerSec * dt

    // World-space emission point = ship position + ship-local origin rotated by ship quaternion.
    tmpOrigin.set(origin[0], origin[1], origin[2]).applyQuaternion(s.quaternion).add(s.position)

    // Backwards direction in world space (ship's local +Z after [0,π,0] model rotation).
    tmpBack.set(0, 0, 1).applyQuaternion(s.quaternion)

    let emitted = 0
    let emitAccum = toEmit
    while (emitAccum >= 1 && emitted < 20) {
      const i = cursor.current
      cursor.current = (cursor.current + 1) % PARTICLE_COUNT
      ages[i] = 0
      lifes[i] = boost ? BOOST_LIFE : NORMAL_LIFE
      positions[i * 3] = tmpOrigin.x
      positions[i * 3 + 1] = tmpOrigin.y
      positions[i * 3 + 2] = tmpOrigin.z
      // Random jitter perpendicular to motion
      tmpJitter.set((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).multiplyScalar(boost ? 1.2 : 0.6)
      const baseSpeed = boost ? 48 : 18 + speedN * 20
      velocities[i * 3]     = tmpBack.x * baseSpeed + tmpJitter.x
      velocities[i * 3 + 1] = tmpBack.y * baseSpeed + tmpJitter.y
      velocities[i * 3 + 2] = tmpBack.z * baseSpeed + tmpJitter.z
      emitAccum -= 1
      emitted++
    }

    // Advance & build visual buffers
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      ages[i] += dt
      const life = lifes[i]
      if (ages[i] >= life) {
        // keep position, fade to 0
        colors[i * 3] = 0
        colors[i * 3 + 1] = 0
        colors[i * 3 + 2] = 0
        sizes[i] = 0
        continue
      }
      positions[i * 3]     += velocities[i * 3] * dt
      positions[i * 3 + 1] += velocities[i * 3 + 1] * dt
      positions[i * 3 + 2] += velocities[i * 3 + 2] * dt
      const lifeT = 1 - ages[i] / life
      const isBoost = life === BOOST_LIFE
      // cyan #00d4ff vs orange #ffaa00
      const r = isBoost ? 1.0 : 0.0
      const g = isBoost ? 0.67 : 0.83
      const b = isBoost ? 0.0 : 1.0
      colors[i * 3]     = r * lifeT
      colors[i * 3 + 1] = g * lifeT
      colors[i * 3 + 2] = b * lifeT
      sizes[i] = (isBoost ? 1.6 : 1.0) * (0.6 + lifeT * 0.8)
    }

    const geom = pointsRef.current?.geometry
    if (geom) {
      const posAttr = geom.attributes.position as THREE.BufferAttribute
      const colAttr = geom.attributes.color as THREE.BufferAttribute
      const sizeAttr = geom.attributes.size as THREE.BufferAttribute
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true
      sizeAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        vertexColors
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}
