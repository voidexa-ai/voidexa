'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NPCType, NPC_DEFS, generatePatrolRoute } from '@/lib/game/npcs'
import { STATIONS } from '../types'

interface NPCInstance {
  pos: THREE.Vector3
  route: THREE.Vector3[]
  routeIdx: number
  speed: number
  type: NPCType
  hostile: boolean
}

const PATROL_COUNT = 8
const PIRATE_COUNT = 4

export default function NPCManager() {
  const patrolRef = useRef<THREE.InstancedMesh>(null)
  const pirateRef = useRef<THREE.InstancedMesh>(null)
  const patrolGlowRef = useRef<THREE.InstancedMesh>(null)
  const pirateGlowRef = useRef<THREE.InstancedMesh>(null)

  const { patrols, pirates } = useMemo(() => {
    const rng = (() => {
      let s = 777
      return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    })()

    const patrols: NPCInstance[] = []
    for (let i = 0; i < PATROL_COUNT; i++) {
      const a = STATIONS[i % STATIONS.length].position
      const b = STATIONS[(i + 1) % STATIONS.length].position
      const route = generatePatrolRoute(
        { x: a.x, y: a.y, z: a.z },
        { x: b.x, y: b.y, z: b.z },
        { waypoints: 3, spread: 40, rng },
      ).map(w => new THREE.Vector3(w.x, w.y, w.z))
      patrols.push({
        pos: route[0].clone(),
        route, routeIdx: 1,
        speed: NPC_DEFS[NPCType.Patrol].speed * 0.3,
        type: NPCType.Patrol, hostile: false,
      })
    }

    const pirates: NPCInstance[] = []
    for (let i = 0; i < PIRATE_COUNT; i++) {
      const a = STATIONS[(i * 2) % STATIONS.length].position.clone()
        .add(new THREE.Vector3((rng() - 0.5) * 100, (rng() - 0.5) * 40, (rng() - 0.5) * 100))
      const b = STATIONS[(i * 2 + 1) % STATIONS.length].position.clone()
        .add(new THREE.Vector3((rng() - 0.5) * 100, (rng() - 0.5) * 40, (rng() - 0.5) * 100))
      const route = generatePatrolRoute(
        { x: a.x, y: a.y, z: a.z },
        { x: b.x, y: b.y, z: b.z },
        { waypoints: 2, spread: 30, rng },
      ).map(w => new THREE.Vector3(w.x, w.y, w.z))
      pirates.push({
        pos: route[0].clone(),
        route, routeIdx: 1,
        speed: NPC_DEFS[NPCType.Pirate].speed * 0.35,
        type: NPCType.Pirate, hostile: true,
      })
    }

    return { patrols, pirates }
  }, [])

  // Ship-like shape: elongated octahedron (stretched on Z so it looks like a craft)
  const shipGeo = useMemo(() => {
    const g = new THREE.OctahedronGeometry(1, 0)
    g.scale(0.9, 0.6, 2.0) // elongated along +Z (nose)
    return g
  }, [])

  const glowGeo = useMemo(() => new THREE.SphereGeometry(0.8, 10, 10), [])

  const patrolMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c2d6e8',
    emissive: '#00a0d0',
    emissiveIntensity: 1.4,
    metalness: 0.85,
    roughness: 0.25,
  }), [])

  const pirateMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#5a2020',
    emissive: '#ff2a2a',
    emissiveIntensity: 1.8,
    metalness: 0.7,
    roughness: 0.35,
  }), [])

  const patrolGlowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00d4ff',
    transparent: true,
    opacity: 0.35,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [])

  const pirateGlowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#ff3355',
    transparent: true,
    opacity: 0.45,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [])

  useEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const scl = new THREE.Vector3(1, 1, 1)
    const gscl = new THREE.Vector3(1.4, 1.4, 1.4)
    patrols.forEach((n, i) => {
      m.compose(n.pos, q, scl)
      patrolRef.current?.setMatrixAt(i, m)
      m.compose(n.pos, q, gscl)
      patrolGlowRef.current?.setMatrixAt(i, m)
    })
    pirates.forEach((n, i) => {
      m.compose(n.pos, q, scl)
      pirateRef.current?.setMatrixAt(i, m)
      m.compose(n.pos, q, gscl)
      pirateGlowRef.current?.setMatrixAt(i, m)
    })
    if (patrolRef.current) patrolRef.current.instanceMatrix.needsUpdate = true
    if (patrolGlowRef.current) patrolGlowRef.current.instanceMatrix.needsUpdate = true
    if (pirateRef.current) pirateRef.current.instanceMatrix.needsUpdate = true
    if (pirateGlowRef.current) pirateGlowRef.current.instanceMatrix.needsUpdate = true
  }, [patrols, pirates])

  const forward = useRef(new THREE.Vector3()).current
  const dummyQuat = useRef(new THREE.Quaternion()).current
  const matrix = useRef(new THREE.Matrix4()).current
  const zAxis = useRef(new THREE.Vector3(0, 0, 1)).current

  const step = (list: NPCInstance[], mesh: THREE.InstancedMesh | null, glow: THREE.InstancedMesh | null, dt: number, glowScale: number) => {
    if (!mesh) return
    const scl = new THREE.Vector3(1, 1, 1)
    const gscl = new THREE.Vector3(glowScale, glowScale, glowScale)
    list.forEach((n, i) => {
      const target = n.route[n.routeIdx]
      forward.copy(target).sub(n.pos)
      const dist = forward.length()
      if (dist < 2) {
        n.routeIdx = (n.routeIdx + 1) % n.route.length
      } else {
        forward.normalize()
        n.pos.addScaledVector(forward, n.speed * dt)
      }
      // Orient ship nose (+Z) toward movement
      dummyQuat.setFromUnitVectors(zAxis, forward)
      matrix.compose(n.pos, dummyQuat, scl)
      mesh.setMatrixAt(i, matrix)
      if (glow) {
        matrix.compose(n.pos, dummyQuat, gscl)
        glow.setMatrixAt(i, matrix)
      }
    })
    mesh.instanceMatrix.needsUpdate = true
    if (glow) glow.instanceMatrix.needsUpdate = true
  }

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05)
    const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.12
    step(patrols, patrolRef.current, patrolGlowRef.current, dt, 1.4 * pulse)
    step(pirates, pirateRef.current, pirateGlowRef.current, dt, 1.6 * pulse)
  })

  return (
    <>
      <instancedMesh ref={patrolRef} args={[shipGeo, patrolMat, PATROL_COUNT]} />
      <instancedMesh ref={patrolGlowRef} args={[glowGeo, patrolGlowMat, PATROL_COUNT]} />
      <instancedMesh ref={pirateRef} args={[shipGeo, pirateMat, PIRATE_COUNT]} />
      <instancedMesh ref={pirateGlowRef} args={[glowGeo, pirateGlowMat, PIRATE_COUNT]} />
    </>
  )
}
