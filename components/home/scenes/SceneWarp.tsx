'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  active: boolean
  progress: number
}

const SEGMENT_COUNT = 900

function buildWarpSegments(seed: number) {
  const positions = new Float32Array(SEGMENT_COUNT * 2 * 3)
  const starts = new Float32Array(SEGMENT_COUNT * 3)
  const dirs = new Float32Array(SEGMENT_COUNT * 3)
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    const r = 4 + rand() * 30
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)
    starts[i * 3] = x
    starts[i * 3 + 1] = y
    starts[i * 3 + 2] = z
    const len = Math.hypot(x, y, z) || 1
    dirs[i * 3] = x / len
    dirs[i * 3 + 1] = y / len
    dirs[i * 3 + 2] = z / len
    positions[i * 6] = x
    positions[i * 6 + 1] = y
    positions[i * 6 + 2] = z
    positions[i * 6 + 3] = x
    positions[i * 6 + 4] = y
    positions[i * 6 + 5] = z
  }
  return { positions, starts, dirs }
}

export default function SceneWarp({ active, progress }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const geomRef = useRef<THREE.BufferGeometry>(null)
  const strengthRef = useRef(0)
  const { camera } = useThree()
  const [{ positions, starts, dirs }] = useState(() => buildWarpSegments(184412))

  useFrame((_, delta) => {
    const target = active ? 1 : 0
    strengthRef.current += (target - strengthRef.current) * Math.min(delta * 8, 1)
    const s = strengthRef.current
    if (groupRef.current) {
      groupRef.current.position.copy(camera.position)
      groupRef.current.quaternion.copy(camera.quaternion)
    }
    if (!geomRef.current) return
    const stretch = s * (10 + progress * 12)
    const arr = geomRef.current.attributes.position.array as Float32Array
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const ox = starts[i * 3]
      const oy = starts[i * 3 + 1]
      const oz = starts[i * 3 + 2]
      const dx = dirs[i * 3]
      const dy = dirs[i * 3 + 1]
      const dz = dirs[i * 3 + 2]
      arr[i * 6] = ox
      arr[i * 6 + 1] = oy
      arr[i * 6 + 2] = oz
      arr[i * 6 + 3] = ox + dx * stretch
      arr[i * 6 + 4] = oy + dy * stretch
      arr[i * 6 + 5] = oz + dz * stretch
    }
    geomRef.current.attributes.position.needsUpdate = true
    const mat = (groupRef.current?.children[0] as THREE.LineSegments)?.material as
      | THREE.LineBasicMaterial
      | undefined
    if (mat) mat.opacity = s * 0.95
  })

  return (
    <group ref={groupRef}>
      <lineSegments raycast={() => null}>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#bfe1ff"
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}
