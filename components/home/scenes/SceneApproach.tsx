'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  active: boolean
  elapsed: number
}

const STAR_COUNT = 2400

function buildStarPositions(seed: number): Float32Array {
  const arr = new Float32Array(STAR_COUNT * 3)
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 20 + rand() * 100
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi) - 20
  }
  return arr
}

function CockpitFrame() {
  return (
    <group position={[0, 0, -2]} raycast={() => null}>
      <mesh position={[-1.9, 0, 0]}>
        <boxGeometry args={[1.4, 5, 0.2]} />
        <meshBasicMaterial color="#05070d" />
      </mesh>
      <mesh position={[1.9, 0, 0]}>
        <boxGeometry args={[1.4, 5, 0.2]} />
        <meshBasicMaterial color="#05070d" />
      </mesh>
      <mesh position={[0, -1.55, 0]}>
        <boxGeometry args={[5, 1.4, 0.2]} />
        <meshBasicMaterial color="#05070d" />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[5, 1.0, 0.2]} />
        <meshBasicMaterial color="#05070d" />
      </mesh>
      <mesh position={[-1.1, -0.9, 0.05]}>
        <boxGeometry args={[0.12, 0.6, 0.04]} />
        <meshBasicMaterial color="#00d4ff" toneMapped={false} />
      </mesh>
      <mesh position={[1.1, -0.9, 0.05]}>
        <boxGeometry args={[0.12, 0.6, 0.04]} />
        <meshBasicMaterial color="#a78bfa" toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function SceneApproach({ active, elapsed }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const starsRef = useRef<THREE.Points>(null)
  const voidexaPointRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const nebulaRef = useRef<THREE.Mesh>(null)
  const positions = useMemo(() => buildStarPositions(73312), [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.position.z += delta * 1.6
    if (groupRef.current.position.z > 40) groupRef.current.position.z = -40
    if (voidexaPointRef.current) {
      const pulse = 0.85 + Math.sin(elapsed * 1.5) * 0.15
      const mat = voidexaPointRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = pulse
      voidexaPointRef.current.scale.setScalar(0.9 + Math.sin(elapsed * 1.5) * 0.08)
    }
    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.22 + Math.sin(elapsed * 0.9) * 0.06
    }
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.01
      starsRef.current.rotation.x += delta * 0.003
    }
  })

  if (!active) return null

  return (
    <group>
      <mesh ref={nebulaRef} position={[0, 0, -90]} raycast={() => null}>
        <planeGeometry args={[260, 150]} />
        <meshBasicMaterial
          transparent
          opacity={0.55}
          depthWrite={false}
          toneMapped={false}
          color="#0a1433"
        />
      </mesh>
      <mesh position={[-40, 12, -75]} raycast={() => null}>
        <planeGeometry args={[120, 80]} />
        <meshBasicMaterial
          transparent
          opacity={0.22}
          depthWrite={false}
          toneMapped={false}
          color="#1b2f66"
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[35, -8, -80]} raycast={() => null}>
        <planeGeometry args={[110, 70]} />
        <meshBasicMaterial
          transparent
          opacity={0.18}
          depthWrite={false}
          toneMapped={false}
          color="#321a55"
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group ref={groupRef}>
        <points ref={starsRef} raycast={() => null}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={2.2}
            color="#e2f1ff"
            transparent
            opacity={0.95}
            sizeAttenuation
            depthWrite={false}
            toneMapped={false}
          />
        </points>
        <mesh ref={voidexaPointRef} position={[0, 0, -50]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#aeefff" transparent opacity={0.95} toneMapped={false} />
        </mesh>
        <mesh ref={haloRef} position={[0, 0, -50]}>
          <sphereGeometry args={[1.8, 24, 24]} />
          <meshBasicMaterial
            color="#3da6ff"
            transparent
            opacity={0.22}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <CockpitFrame />
    </group>
  )
}
