'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  active: boolean
  progress: number
}

const SEGMENT_COUNT = 1100
const BASE_FOV = 70
const PEAK_FOV = 96

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
    const r = 3 + rand() * 28
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
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null)
  const tintRef = useRef<THREE.Mesh>(null)
  const strengthRef = useRef(0)
  const getState = useThree((s) => s.get)
  const { positions, starts, dirs } = useMemo(() => buildWarpSegments(184412), [])

  useFrame((_, delta) => {
    const target = active ? 1 : 0
    strengthRef.current += (target - strengthRef.current) * Math.min(delta * 6, 1)
    const s = strengthRef.current

    const cam = getState().camera as THREE.PerspectiveCamera
    if (cam.isPerspectiveCamera) {
      const fovCurve = Math.sin(Math.max(0, Math.min(1, progress)) * Math.PI)
      const targetFov = BASE_FOV + (PEAK_FOV - BASE_FOV) * fovCurve * s
      if (Math.abs(cam.fov - targetFov) > 0.05) {
        cam.fov = targetFov
        cam.updateProjectionMatrix()
      }
    }

    if (groupRef.current) {
      groupRef.current.position.copy(cam.position)
      groupRef.current.quaternion.copy(cam.quaternion)
    }

    if (geomRef.current) {
      const stretch = s * (14 + progress * 18)
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
    }
    if (lineMatRef.current) {
      lineMatRef.current.opacity = s * 0.95
    }
    if (tintRef.current) {
      const tintMat = tintRef.current.material as THREE.MeshBasicMaterial
      const pulse = Math.sin(Math.max(0, Math.min(1, progress)) * Math.PI)
      tintMat.opacity = s * pulse * 0.42
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={tintRef} position={[0, 0, -0.6]} raycast={() => null}>
        <planeGeometry args={[4, 2.6]} />
        <meshBasicMaterial
          color="#3aa2ff"
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <lineSegments raycast={() => null}>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
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
