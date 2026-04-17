'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  active: boolean
  doorProgress: number
  revealProgress: number
}

const FAR_STAR_COUNT = 1400

function buildFarStars(seed: number): Float32Array {
  const arr = new Float32Array(FAR_STAR_COUNT * 3)
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i < FAR_STAR_COUNT; i++) {
    const r = 60 + rand() * 100
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 20
  }
  return arr
}

export default function SceneDoorOpen({ active, doorProgress, revealProgress }: Props) {
  const doorRef = useRef<THREE.Mesh>(null)
  const doorMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const galaxyRef = useRef<THREE.Group>(null)
  const sunRef = useRef<THREE.Mesh>(null)
  const sunHaloRef = useRef<THREE.Mesh>(null)
  const claimRef = useRef<THREE.Mesh>(null)
  const hiveRef = useRef<THREE.Mesh>(null)
  const trackRef = useRef<THREE.Mesh>(null)
  const farStarMatRef = useRef<THREE.PointsMaterial>(null)
  const farStarPositions = useMemo(() => buildFarStars(41088), [])

  useFrame((_, delta) => {
    const open = Math.min(doorProgress, 1)
    const reveal = Math.min(revealProgress, 1)
    if (doorRef.current) {
      doorRef.current.rotation.x = -open * Math.PI * 0.55
    }
    if (doorMatRef.current) {
      doorMatRef.current.emissiveIntensity = open * 0.4
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.2 + open * 1.6
    }
    if (galaxyRef.current) {
      // keep galaxy group alive at reveal — fade in using children opacity
      galaxyRef.current.rotation.y += delta * 0.02
    }
    const visible = Math.max(open * 0.35, reveal)
    if (farStarMatRef.current) {
      farStarMatRef.current.opacity = visible * 0.9
    }
    if (sunRef.current) {
      const mat = sunRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = visible
      sunRef.current.scale.setScalar(0.9 + Math.sin(performance.now() * 0.0015) * 0.05)
    }
    if (sunHaloRef.current) {
      const mat = sunHaloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = visible * 0.28
    }
    if (claimRef.current) {
      claimRef.current.rotation.y += delta * 0.18
      const mat = claimRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = visible * 0.6
    }
    if (hiveRef.current) {
      const mat = hiveRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = visible * 0.7
      hiveRef.current.rotation.y += delta * 0.04
    }
    if (trackRef.current) {
      const mat = trackRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = visible * 0.55
      trackRef.current.rotation.z += delta * 0.06
    }
  })

  if (!active) return null

  return (
    <group>
      {/* Cabin interior walls (surrounding frame for the door opening) */}
      <mesh position={[0, -1.4, -3]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#0a0a14" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[-3.6, 0, -3]}>
        <boxGeometry args={[0.4, 4, 14]} />
        <meshStandardMaterial color="#1c1c2a" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[3.6, 0, -3]}>
        <boxGeometry args={[0.4, 4, 14]} />
        <meshStandardMaterial color="#1c1c2a" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.8, -3]}>
        <boxGeometry args={[7.2, 0.4, 14]} />
        <meshStandardMaterial color="#11111a" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Cargo door hinge group (opens outward & down) */}
      <group position={[0, -1.4, -10]}>
        <mesh ref={doorRef}>
          <boxGeometry args={[7.0, 0.18, 5.4]} />
          <meshStandardMaterial
            ref={doorMatRef}
            color="#16161f"
            roughness={0.55}
            metalness={0.6}
            emissive="#00d4ff"
            emissiveIntensity={0}
          />
        </mesh>
      </group>

      {/* Galaxy revealed beyond the door */}
      <group ref={galaxyRef} position={[0, 0, -30]}>
        <points raycast={() => null}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[farStarPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={farStarMatRef}
            size={1.6}
            color="#e2f1ff"
            transparent
            opacity={0}
            sizeAttenuation
            depthWrite={false}
            toneMapped={false}
          />
        </points>

        {/* voidexa sun — centered in view through door */}
        <mesh ref={sunRef} position={[0, 0, -10]}>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshBasicMaterial color="#7fd8ff" transparent opacity={0} toneMapped={false} />
        </mesh>
        <mesh ref={sunHaloRef} position={[0, 0, -10]}>
          <sphereGeometry args={[3.6, 32, 32]} />
          <meshBasicMaterial
            color="#3da6ff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Claim Planet — off to the side */}
        <mesh ref={claimRef} position={[8, -1.4, -18]}>
          <sphereGeometry args={[0.9, 24, 24]} />
          <meshStandardMaterial
            color="#0c1830"
            emissive="#00d4ff"
            emissiveIntensity={0.6}
            roughness={0.7}
          />
        </mesh>

        {/* Hive — dark irregular silhouette behind-left of voidexa */}
        <mesh ref={hiveRef} position={[-9, 2, -22]}>
          <dodecahedronGeometry args={[1.6, 0]} />
          <meshBasicMaterial color="#15082a" transparent opacity={0} toneMapped={false} />
        </mesh>

        {/* Racing track ring silhouette */}
        <mesh ref={trackRef} position={[6, 2.4, -26]} rotation={[1.1, 0.3, 0]}>
          <torusGeometry args={[2.2, 0.08, 8, 48]} />
          <meshBasicMaterial color="#66ffaa" transparent opacity={0} toneMapped={false} />
        </mesh>

        {/* Break Room station silhouette — small cylinder */}
        <mesh position={[-5, -2.2, -20]} rotation={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 1.4, 10]} />
          <meshBasicMaterial color="#2a1a4a" transparent opacity={0.45} toneMapped={false} />
        </mesh>
      </group>

      <pointLight ref={lightRef} position={[0, 0, -16]} color="#aee2ff" intensity={0.2} distance={40} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 0, -40]} color="#7fd8ff" intensity={0.6} distance={70} />
    </group>
  )
}
