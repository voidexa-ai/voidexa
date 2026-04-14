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
}

export default function NPCManager() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const npcs = useMemo<NPCInstance[]>(() => {
    const rng = (() => {
      let s = 777
      return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    })()
    const list: NPCInstance[] = []
    for (let i = 0; i < 8; i++) {
      const a = STATIONS[i % STATIONS.length].position
      const b = STATIONS[(i + 1) % STATIONS.length].position
      const route = generatePatrolRoute(
        { x: a.x, y: a.y, z: a.z },
        { x: b.x, y: b.y, z: b.z },
        { waypoints: 3, spread: 40, rng },
      ).map(w => new THREE.Vector3(w.x, w.y, w.z))
      list.push({
        pos: route[0].clone(),
        route,
        routeIdx: 1,
        speed: NPC_DEFS[NPCType.Patrol].speed * 0.3,
        type: NPCType.Patrol,
      })
    }
    return list
  }, [])

  const geometry = useMemo(() => new THREE.ConeGeometry(0.5, 1.8, 8), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#b0c4d8',
    emissive: '#00a0c0',
    emissiveIntensity: 0.6,
    metalness: 0.8,
    roughness: 0.3,
  }), [])

  useEffect(() => {
    if (!meshRef.current) return
    const m = new THREE.Matrix4()
    npcs.forEach((n, i) => {
      m.compose(n.pos, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1))
      meshRef.current!.setMatrixAt(i, m)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [npcs])

  const forward = useRef(new THREE.Vector3()).current
  const dummyQuat = useRef(new THREE.Quaternion()).current
  const matrix = useRef(new THREE.Matrix4()).current
  const upVec = useRef(new THREE.Vector3(0, 1, 0)).current

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const dt = Math.min(delta, 0.05)
    npcs.forEach((n, i) => {
      const target = n.route[n.routeIdx]
      forward.copy(target).sub(n.pos)
      const dist = forward.length()
      if (dist < 2) {
        n.routeIdx = (n.routeIdx + 1) % n.route.length
      } else {
        forward.normalize()
        n.pos.addScaledVector(forward, n.speed * dt)
      }
      // Orient cone toward movement (cone points +Y, so rotate to align with forward)
      dummyQuat.setFromUnitVectors(upVec, forward)
      matrix.compose(n.pos, dummyQuat, new THREE.Vector3(1, 1, 1))
      meshRef.current!.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[geometry, material, npcs.length]} />
}
