'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface WarpStreaksProps {
  active: boolean
}

const SEGMENT_COUNT = 700

export default function WarpStreaks({ active }: WarpStreaksProps) {
  const groupRef = useRef<THREE.Group>(null)
  const geomRef = useRef<THREE.BufferGeometry>(null)
  const strengthRef = useRef(0)
  const { camera } = useThree()

  const { positions, starts, dirs } = useMemo(() => {
    const positions = new Float32Array(SEGMENT_COUNT * 2 * 3)
    const starts = new Float32Array(SEGMENT_COUNT * 3)
    const dirs = new Float32Array(SEGMENT_COUNT * 3)
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 30
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      starts[i * 3]     = x
      starts[i * 3 + 1] = y
      starts[i * 3 + 2] = z
      const len = Math.hypot(x, y, z)
      dirs[i * 3]     = x / len
      dirs[i * 3 + 1] = y / len
      dirs[i * 3 + 2] = z / len
      positions[i * 6]     = x
      positions[i * 6 + 1] = y
      positions[i * 6 + 2] = z
      positions[i * 6 + 3] = x
      positions[i * 6 + 4] = y
      positions[i * 6 + 5] = z
    }
    return { positions, starts, dirs }
  }, [])

  useFrame((_, delta) => {
    const target = active ? 1 : 0
    strengthRef.current += (target - strengthRef.current) * Math.min(delta * 6, 1)
    const s = strengthRef.current
    if (groupRef.current) {
      groupRef.current.position.copy(camera.position)
      groupRef.current.quaternion.copy(camera.quaternion)
    }
    if (!geomRef.current) return
    const arr = geomRef.current.attributes.position.array as Float32Array
    const stretch = s * 8
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const ox = starts[i * 3]
      const oy = starts[i * 3 + 1]
      const oz = starts[i * 3 + 2]
      const dx = dirs[i * 3]
      const dy = dirs[i * 3 + 1]
      const dz = dirs[i * 3 + 2]
      arr[i * 6]     = ox
      arr[i * 6 + 1] = oy
      arr[i * 6 + 2] = oz
      arr[i * 6 + 3] = ox + dx * stretch
      arr[i * 6 + 4] = oy + dy * stretch
      arr[i * 6 + 5] = oz + dz * stretch
    }
    geomRef.current.attributes.position.needsUpdate = true
    const mat = (groupRef.current?.children[0] as THREE.LineSegments)?.material as THREE.LineBasicMaterial | undefined
    if (mat) mat.opacity = s * 0.9
  })

  return (
    <group ref={groupRef}>
      <lineSegments raycast={() => null}>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#d6e8ff"
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
