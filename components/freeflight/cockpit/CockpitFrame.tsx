'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  visible: boolean
}

// A procedural cockpit frame that rides with the camera.
// Dark panels surround the viewport + glowing cyan accent bars.
export default function CockpitFrame({ ship, visible }: Props) {
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const hudRingRef = useRef<THREE.Mesh>(null)
  const speedBarRef = useRef<THREE.Mesh>(null)
  const shieldBarRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    // Attach to camera each frame (cheap and avoids re-parenting)
    g.position.copy(camera.position)
    g.quaternion.copy(camera.quaternion)
    g.visible = visible

    const s = ship.current
    // Pulse accent ring
    if (hudRingRef.current) {
      const mat = hudRingRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.55 + Math.sin(performance.now() * 0.003) * 0.15
    }
    // Speed bar scale
    if (speedBarRef.current) {
      const pct = Math.min(1, s.speed / 160)
      speedBarRef.current.scale.x = Math.max(0.001, pct)
    }
    // Shield bar scale
    if (shieldBarRef.current) {
      shieldBarRef.current.scale.x = Math.max(0.001, s.shield / 100)
    }
  })

  if (!visible) return null

  // Everything below is positioned relative to the camera's local frame:
  //   forward = -Z, up = +Y, right = +X
  // We keep it small so the frame feels worn as a helmet/cockpit.
  const panelMat = (
    <meshStandardMaterial
      color="#0a1424"
      emissive="#001826"
      emissiveIntensity={0.6}
      metalness={0.75}
      roughness={0.35}
    />
  )
  const accentMat = (emissive: string, opacity = 0.8) => (
    <meshBasicMaterial color={emissive} transparent opacity={opacity} toneMapped={false} />
  )

  return (
    <group ref={groupRef}>
      {/* Bottom dash panel */}
      <mesh position={[0, -0.28, -0.55]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[1.1, 0.18, 0.04]} />
        {panelMat}
      </mesh>
      {/* Lower lip accent strip */}
      <mesh position={[0, -0.22, -0.5]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.95, 0.01, 0.005]} />
        {accentMat('#00d4ff')}
      </mesh>

      {/* Left pillar */}
      <mesh position={[-0.44, 0, -0.55]} rotation={[0, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.04]} />
        {panelMat}
      </mesh>
      {/* Right pillar */}
      <mesh position={[0.44, 0, -0.55]} rotation={[0, -0.22, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.04]} />
        {panelMat}
      </mesh>
      {/* Top canopy rim */}
      <mesh position={[0, 0.3, -0.55]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.95, 0.06, 0.04]} />
        {panelMat}
      </mesh>

      {/* HUD accent ring (below center) */}
      <mesh ref={hudRingRef} position={[0, -0.18, -0.52]} rotation={[-0.3, 0, 0]}>
        <ringGeometry args={[0.09, 0.105, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Left holo bar frame (speed) */}
      <mesh position={[-0.26, -0.19, -0.52]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.18, 0.018, 0.001]} />
        {accentMat('#003a55', 0.5)}
      </mesh>
      <mesh
        ref={speedBarRef}
        position={[-0.35, -0.19, -0.519]}
        rotation={[-0.3, 0, 0]}
        scale={[0.001, 1, 1]}
      >
        <boxGeometry args={[0.18, 0.018, 0.001]} />
        {accentMat('#00ffff', 0.95)}
      </mesh>

      {/* Right holo bar frame (shield) */}
      <mesh position={[0.26, -0.19, -0.52]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.18, 0.018, 0.001]} />
        {accentMat('#002a1a', 0.5)}
      </mesh>
      <mesh
        ref={shieldBarRef}
        position={[0.17, -0.19, -0.519]}
        rotation={[-0.3, 0, 0]}
        scale={[0.001, 1, 1]}
      >
        <boxGeometry args={[0.18, 0.018, 0.001]} />
        {accentMat('#66ff99', 0.95)}
      </mesh>

      {/* Small glowing beacon dots on dash corners */}
      <mesh position={[-0.42, -0.24, -0.5]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        {accentMat('#00ffff')}
      </mesh>
      <mesh position={[0.42, -0.24, -0.5]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        {accentMat('#ff6699')}
      </mesh>
    </group>
  )
}
