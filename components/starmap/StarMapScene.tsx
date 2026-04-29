'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import NodeMesh from './NodeMesh'
import { STAR_MAP_NODES } from './nodes'
import NebulaBg from './NebulaBg'
import WarpStreaks from './WarpStreaks'
import CameraRig from './CameraRig'

// ── Constellation lines with energy pulse dot ─────────────────────────────
function ConstellationLines() {
  const satellites = STAR_MAP_NODES.filter(n => !n.isCenter)

  return (
    <>
      {satellites.map(node => (
        <Line
          key={node.id}
          points={[[0, 0, 0], node.position]}
          color={node.emissive}
          lineWidth={0.5}
          transparent
          opacity={node.isDiscovered ? 0.06 : 0.02}
          dashed={!node.isDiscovered}
          dashScale={node.isDiscovered ? 1 : 3}
          toneMapped={false}
        />
      ))}
    </>
  )
}

// Energy pulse dots travelling along each constellation line
function EnergyPulses() {
  const groupRef = useRef<THREE.Group>(null)
  const satellites = STAR_MAP_NODES.filter(n => !n.isCenter && n.isDiscovered)

  // Each pulse has a phase offset so they don't all sync
  const phaseOffsets = useMemo(
    () => satellites.map(() => Math.random() * Math.PI * 2),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const meshRefs = useRef<(THREE.Mesh | null)[]>(satellites.map(() => null))

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    satellites.forEach((node, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      const progress = (Math.sin(t * 0.6 + phaseOffsets[i]) + 1) / 2
      const target = new THREE.Vector3(...node.position)
      mesh.position.lerpVectors(new THREE.Vector3(0, 0, 0), target, progress)

      // Fade near endpoints
      const fade = 1 - Math.abs(progress - 0.5) * 2.5
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, Math.min(0.65, fade))
    })
  })

  return (
    <group ref={groupRef}>
      {satellites.map((node, i) => (
        <mesh
          key={node.id}
          ref={el => { meshRefs.current[i] = el }}
        >
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial
            color={node.emissive}
            transparent
            opacity={0.65}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// ── Main scene ─────────────────────────────────────────────────────────────
export default function StarMapScene() {
  const [warping, setWarping] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <>
      {/* Deep space nebula background */}
      <NebulaBg />

      {/* Lighting */}
      <ambientLight intensity={0.08} />
      <directionalLight position={[10, 10, 5]} intensity={0.2} color="#ffffff" />

      {/* Warp streaks — visible only during warp */}
      <WarpStreaks active={warping} />

      {/* Camera rig: parallax + hover dolly (disabled during warp) */}
      <CameraRig hoveredId={hoveredId} disabled={warping} />

      {/* Constellation network */}
      <ConstellationLines />
      <EnergyPulses />

      {/* Planets */}
      {STAR_MAP_NODES.map(node => (
        <NodeMesh
          key={node.id}
          node={node}
          onWarpStart={() => setWarping(true)}
          onHoverChange={setHoveredId}
        />
      ))}

      {/* Unmount OrbitControls during warp so it can't fight the camera animation */}
      {!warping && (
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.22}
          enableZoom
          enablePan={false}
          minDistance={5}
          maxDistance={40}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
          target={[0, -0.5, -4]}
          makeDefault
        />
      )}
    </>
  )
}
