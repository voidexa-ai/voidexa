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

// Sprint 16 Task 1 — GPU thrash fix.
//
// Live audit showed FPS collapsing 118 → 1 after ~6-9 s of sustained boost.
// Memory stable at ~240MB, so this was a per-frame GPU + CPU overload, not a
// leak. Three levers were dialled back:
//
//   1. Pool size: 150 → 80 particles (additive-blended sprites are expensive
//      at high overdraw; 80 still reads as a plume at the 320 px HUD scale).
//   2. Emission rate: boost 600 → 250 / sec, idle 180 + 200·speed → 120 + 80·speed.
//   3. `needsUpdate = true` was set every frame regardless of change. The
//      buffers now only flip dirty when something actually wrote to them
//      during emission or particle advance.
//
// Rendering pipeline kept from Sprint 15: custom ShaderMaterial reads per-
// particle `aSize` and `aColor`, fragment shader does soft radial falloff.
const PARTICLE_COUNT = 80
const NORMAL_LIFE = 0.3
const BOOST_LIFE = 0.5

const MAX_IDLE_EMIT = 120
const IDLE_SPEED_BONUS = 80
const MAX_BOOST_EMIT = 250

const VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * 120.0 / max(0.0001, -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, alpha);
  }
`

export default function BoostTrail({ ship, origin = [0, 0, 2] }: Props) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, ages, velocities, lifes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const ages = new Float32Array(PARTICLE_COUNT)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const lifes = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      ages[i] = Math.random()
      lifes[i] = NORMAL_LIFE
    }
    return { positions, ages, velocities, lifes }
  }, [])

  const colors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), [])
  const sizes = useMemo(() => new Float32Array(PARTICLE_COUNT), [])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  }), [])

  const cursor = useRef(0)
  const tmpOrigin = useRef(new THREE.Vector3()).current
  const tmpBack = useRef(new THREE.Vector3()).current
  const tmpJitter = useRef(new THREE.Vector3()).current

  // Per-particle dead flag lets the update loop skip already-faded slots
  // without re-zeroing their color / size every frame.
  const dead = useRef<Uint8Array>(new Uint8Array(PARTICLE_COUNT)).current

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const s = ship.current
    const speedN = Math.min(1, s.speed / 160)
    const boost = s.boost

    const emitPerSec = boost
      ? MAX_BOOST_EMIT
      : Math.min(MAX_IDLE_EMIT + IDLE_SPEED_BONUS, MAX_IDLE_EMIT + speedN * IDLE_SPEED_BONUS)
    const toEmit = emitPerSec * dt

    tmpOrigin.set(origin[0], origin[1], origin[2]).applyQuaternion(s.quaternion).add(s.position)
    tmpBack.set(0, 0, 1).applyQuaternion(s.quaternion)

    // Dirty flags — set only when a buffer was actually written.
    let posDirty = false
    let colDirty = false
    let sizeDirty = false

    let emitted = 0
    let emitAccum = toEmit
    while (emitAccum >= 1 && emitted < 20) {
      const i = cursor.current
      cursor.current = (cursor.current + 1) % PARTICLE_COUNT
      ages[i] = 0
      lifes[i] = boost ? BOOST_LIFE : NORMAL_LIFE
      dead[i] = 0
      positions[i * 3] = tmpOrigin.x
      positions[i * 3 + 1] = tmpOrigin.y
      positions[i * 3 + 2] = tmpOrigin.z
      tmpJitter
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .multiplyScalar(boost ? 3.5 : 1.4)
      const baseSpeed = boost ? 48 : 18 + speedN * 20
      velocities[i * 3]     = tmpBack.x * baseSpeed + tmpJitter.x
      velocities[i * 3 + 1] = tmpBack.y * baseSpeed + tmpJitter.y
      velocities[i * 3 + 2] = tmpBack.z * baseSpeed + tmpJitter.z
      emitAccum -= 1
      emitted++
    }
    if (emitted > 0) {
      posDirty = true
      colDirty = true
      sizeDirty = true
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (dead[i]) continue
      ages[i] += dt
      const life = lifes[i]
      if (ages[i] >= life) {
        // Transition to dead: zero the visible fields once, then leave alone
        // until the slot is re-emitted.
        colors[i * 3] = 0
        colors[i * 3 + 1] = 0
        colors[i * 3 + 2] = 0
        sizes[i] = 0
        dead[i] = 1
        colDirty = true
        sizeDirty = true
        continue
      }
      positions[i * 3]     += velocities[i * 3] * dt
      positions[i * 3 + 1] += velocities[i * 3 + 1] * dt
      positions[i * 3 + 2] += velocities[i * 3 + 2] * dt
      const lifeT = 1 - ages[i] / life
      const isBoost = life === BOOST_LIFE
      const r = isBoost ? 1.0 : 0.0
      const g = isBoost ? 0.67 : 0.83
      const b = isBoost ? 0.0 : 1.0
      colors[i * 3]     = r * lifeT
      colors[i * 3 + 1] = g * lifeT
      colors[i * 3 + 2] = b * lifeT
      sizes[i] = (isBoost ? 0.9 : 0.55) * (0.35 + lifeT * 0.9)
      posDirty = true
      colDirty = true
      sizeDirty = true
    }

    const geom = pointsRef.current?.geometry
    if (geom) {
      if (posDirty) {
        const posAttr = geom.attributes.position as THREE.BufferAttribute | undefined
        if (posAttr) posAttr.needsUpdate = true
      }
      if (colDirty) {
        const colAttr = geom.attributes.aColor as THREE.BufferAttribute | undefined
        if (colAttr) colAttr.needsUpdate = true
      }
      if (sizeDirty) {
        const sizeAttr = geom.attributes.aSize as THREE.BufferAttribute | undefined
        if (sizeAttr) sizeAttr.needsUpdate = true
      }
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
          attach="attributes-aColor"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  )
}

// Exported for tests — lets the Sprint 16 suite pin the tuning knobs so a
// future regression doesn't accidentally rehydrate the 150/600 values.
export const BOOST_TRAIL_TUNING = {
  PARTICLE_COUNT,
  MAX_BOOST_EMIT,
  MAX_IDLE_EMIT,
  IDLE_SPEED_BONUS,
  NORMAL_LIFE,
  BOOST_LIFE,
}
