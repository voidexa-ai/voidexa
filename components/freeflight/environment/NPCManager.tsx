'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { NPCType, NPC_DEFS, generatePatrolRoute } from '@/lib/game/npcs'
import { MODEL_URLS } from '@/lib/config/modelUrls'
import { STATIONS } from '../types'

interface NPCInstance {
  pos: THREE.Vector3
  route: THREE.Vector3[]
  routeIdx: number
  speed: number
  quat: THREE.Quaternion
}

const PATROL_COUNT = 8
const PIRATE_COUNT = 4
const PATROL_MODEL = MODEL_URLS.qs_challenger
const PIRATE_MODEL = MODEL_URLS.qs_executioner
const PATROL_SCALE = 0.4
const PIRATE_SCALE = 0.45

interface NPCShipProps {
  instance: NPCInstance
  scene: THREE.Group
  scale: number
  glowColor: string
  glowOpacity: number
  refCallback: (g: THREE.Group | null) => void
  lightRef: (l: THREE.PointLight | null) => void
}

function NPCShip({ instance, scene, scale, glowColor, glowOpacity, refCallback, lightRef }: NPCShipProps) {
  return (
    <group ref={refCallback}>
      <group rotation={[0, Math.PI, 0]}>
        <primitive object={scene} scale={scale} />
      </group>
      {/* Engine light */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 1.5]}
        color={glowColor}
        intensity={2}
        distance={12}
      />
      {/* Engine glow sphere */}
      <mesh position={[0, 0, 1.5]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshBasicMaterial color={glowColor} toneMapped={false} />
      </mesh>
      {/* Outer halo */}
      <mesh raycast={() => null}>
        <sphereGeometry args={[1.4, 12, 12]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={glowOpacity}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function NPCManager() {
  const patrolGltf = useGLTF(PATROL_MODEL)
  const pirateGltf = useGLTF(PIRATE_MODEL)

  const patrolScenes = useMemo(
    () => Array.from({ length: PATROL_COUNT }, () => patrolGltf.scene.clone()),
    [patrolGltf.scene],
  )
  const pirateScenes = useMemo(
    () => Array.from({ length: PIRATE_COUNT }, () => pirateGltf.scene.clone()),
    [pirateGltf.scene],
  )

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
        quat: new THREE.Quaternion(),
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
        quat: new THREE.Quaternion(),
      })
    }

    return { patrols, pirates }
  }, [])

  const patrolGroupRefs = useRef<(THREE.Group | null)[]>([])
  const pirateGroupRefs = useRef<(THREE.Group | null)[]>([])
  const patrolLightRefs = useRef<(THREE.PointLight | null)[]>([])
  const pirateLightRefs = useRef<(THREE.PointLight | null)[]>([])

  const forward = useRef(new THREE.Vector3()).current
  const zAxis = useRef(new THREE.Vector3(0, 0, 1)).current
  const tmpQuat = useRef(new THREE.Quaternion()).current

  const step = (
    list: NPCInstance[],
    groupRefs: (THREE.Group | null)[],
    lightRefs: (THREE.PointLight | null)[],
    dt: number,
    pulse: number,
  ) => {
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
      // Smoothly orient toward forward
      tmpQuat.setFromUnitVectors(zAxis, forward)
      n.quat.slerp(tmpQuat, 0.1)

      const g = groupRefs[i]
      if (g) {
        g.position.copy(n.pos)
        g.quaternion.copy(n.quat)
      }
      const l = lightRefs[i]
      if (l) l.intensity = 2 + pulse * 1.2
    })
  }

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05)
    const pulse = 0.5 + Math.sin(clock.elapsedTime * 4) * 0.5
    step(patrols, patrolGroupRefs.current, patrolLightRefs.current, dt, pulse)
    step(pirates, pirateGroupRefs.current, pirateLightRefs.current, dt, pulse)
  })

  return (
    <>
      {patrols.map((n, i) => (
        <NPCShip
          key={`patrol-${i}`}
          instance={n}
          scene={patrolScenes[i]}
          scale={PATROL_SCALE}
          glowColor="#00d4ff"
          glowOpacity={0.22}
          refCallback={(g) => { patrolGroupRefs.current[i] = g }}
          lightRef={(l) => { patrolLightRefs.current[i] = l }}
        />
      ))}
      {pirates.map((n, i) => (
        <NPCShip
          key={`pirate-${i}`}
          instance={n}
          scene={pirateScenes[i]}
          scale={PIRATE_SCALE}
          glowColor="#ff3355"
          glowOpacity={0.32}
          refCallback={(g) => { pirateGroupRefs.current[i] = g }}
          lightRef={(l) => { pirateLightRefs.current[i] = l }}
        />
      ))}
    </>
  )
}

useGLTF.preload(PATROL_MODEL)
useGLTF.preload(PIRATE_MODEL)
