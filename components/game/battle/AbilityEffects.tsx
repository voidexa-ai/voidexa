'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { BattleEffect, Side } from '@/lib/game/battle/types'

interface Props {
  effect: BattleEffect | null
  playerPos: [number, number, number]
  enemyPos: [number, number, number]
  playerBlocking: boolean
  enemyBlocking: boolean
}

const WEAPON_DURATION = 900
const SHIELD_DURATION = 900
const EXPLOSION_DURATION = 1170
const DEPLOY_DURATION = 700

export default function AbilityEffects({ effect, playerPos, enemyPos, playerBlocking, enemyBlocking }: Props) {
  // Map side → position helpers.
  const resolve = useMemo(() => ({
    player: new THREE.Vector3(...playerPos),
    enemy: new THREE.Vector3(...enemyPos),
  }), [playerPos, enemyPos])

  return (
    <>
      {playerBlocking && <StaticShield at={resolve.player} />}
      {enemyBlocking && <StaticShield at={resolve.enemy} />}
      {effect && <EffectInstance effect={effect} resolve={resolve} />}
    </>
  )
}

function EffectInstance({ effect, resolve }: { effect: BattleEffect; resolve: Record<Side, THREE.Vector3> }) {
  switch (effect.kind) {
    case 'weapon_fire': {
      const from = resolve[effect.target === 'player' ? 'enemy' : 'player']
      const to = resolve[effect.target]
      return <WeaponFireEffect from={from} to={to} key={`wf-${Math.random()}`} />
    }
    case 'shield_up':
      return <ShieldPulse at={resolve[effect.target]} key={`sh-${Math.random()}`} />
    case 'drone_deploy':
      return <DroneDeployEffect at={resolve[effect.target]} key={`dd-${Math.random()}`} />
    case 'explosion':
      return <ExplosionEffect at={resolve[effect.target]} key={`ex-${Math.random()}`} />
    case 'hit_impact':
      return <ExplosionEffect at={resolve[effect.target]} key={`hi-${Math.random()}`} small />
    case 'status_apply':
      return <StatusFlash at={resolve[effect.target]} key={`sa-${Math.random()}`} />
    case 'repair':
      return <RepairPulse at={resolve[effect.target]} key={`rp-${Math.random()}`} />
    default:
      return null
  }
}

function WeaponFireEffect({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const startRef = useRef(performance.now())
  useFrame(() => {
    const t = Math.min(1, (performance.now() - startRef.current) / WEAPON_DURATION)
    if (!meshRef.current) return
    meshRef.current.position.lerpVectors(from, to, t)
    meshRef.current.scale.setScalar(1 - t * 0.5)
    if (lightRef.current) lightRef.current.intensity = 8 * (1 - t)
  })
  return (
    <mesh ref={meshRef} position={from}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshBasicMaterial color="#7ffcff" toneMapped={false} />
      <pointLight ref={lightRef} intensity={8} color="#7ffcff" distance={6} />
    </mesh>
  )
}

function ShieldPulse({ at }: { at: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const startRef = useRef(performance.now())
  useFrame(() => {
    const t = Math.min(1, (performance.now() - startRef.current) / SHIELD_DURATION)
    if (!meshRef.current || !matRef.current) return
    matRef.current.opacity = Math.sin(t * Math.PI) * 0.65
    meshRef.current.scale.setScalar(2.2 + t * 0.6)
  })
  return (
    <mesh ref={meshRef} position={at}>
      <sphereGeometry args={[1.6, 32, 32]} />
      <meshBasicMaterial
        ref={matRef}
        color="#7fd8ff"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}

function StaticShield({ at }: { at: THREE.Vector3 }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(() => {
    if (!matRef.current) return
    matRef.current.opacity = 0.15 + Math.sin(performance.now() * 0.006) * 0.08
  })
  return (
    <mesh position={at}>
      <sphereGeometry args={[2.4, 24, 24]} />
      <meshBasicMaterial
        ref={matRef}
        color="#7fd8ff"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}

function DroneDeployEffect({ at }: { at: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null)
  const startRef = useRef(performance.now())
  useFrame(() => {
    const t = Math.min(1, (performance.now() - startRef.current) / DEPLOY_DURATION)
    if (!groupRef.current) return
    groupRef.current.position.set(at.x + 1.2, at.y + t * 1.2, at.z)
    groupRef.current.rotation.y = t * Math.PI * 2
    groupRef.current.scale.setScalar(t * 0.6 + 0.3)
  })
  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshBasicMaterial color="#af52de" toneMapped={false} />
      </mesh>
      <pointLight intensity={4} color="#af52de" distance={4} />
    </group>
  )
}

function ExplosionEffect({ at, small = false }: { at: THREE.Vector3; small?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const startRef = useRef(performance.now())
  const count = small ? 40 : 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.15 + Math.random() * 0.85
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])
  useFrame(() => {
    const t = Math.min(1, (performance.now() - startRef.current) / EXPLOSION_DURATION)
    if (!pointsRef.current || !matRef.current) return
    pointsRef.current.scale.setScalar(1 + t * 4)
    matRef.current.opacity = 1 - t
  })
  return (
    <points ref={pointsRef} position={at}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={small ? 0.09 : 0.14}
        color={small ? '#ff9f5a' : '#ff8a3c'}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

function StatusFlash({ at }: { at: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const startRef = useRef(performance.now())
  useFrame(() => {
    const t = Math.min(1, (performance.now() - startRef.current) / 600)
    if (!meshRef.current || !matRef.current) return
    matRef.current.opacity = (1 - t) * 0.7
    meshRef.current.scale.setScalar(1 + t * 1.6)
  })
  return (
    <mesh ref={meshRef} position={at}>
      <ringGeometry args={[1.2, 1.5, 32]} />
      <meshBasicMaterial ref={matRef} color="#d87fff" transparent opacity={0.7} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

function RepairPulse({ at }: { at: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const startRef = useRef(performance.now())
  useFrame(() => {
    const t = Math.min(1, (performance.now() - startRef.current) / 900)
    if (!meshRef.current || !matRef.current) return
    matRef.current.opacity = (1 - t) * 0.6
    meshRef.current.scale.setScalar(1.2 + t * 1.4)
  })
  return (
    <mesh ref={meshRef} position={at}>
      <torusGeometry args={[1.1, 0.1, 16, 32]} />
      <meshBasicMaterial ref={matRef} color="#7fff7f" transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

