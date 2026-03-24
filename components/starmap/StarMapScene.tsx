'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import NodeMesh from './NodeMesh'
import { STAR_MAP_NODES } from './nodes'
import NebulaBg from './NebulaBg'

// ── Custom starfield: 5000 particles with twinkle ──────────────────────────
function StarField() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 5000

  const { positions, sizes, twinkleFlags } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const twinkleFlags = new Float32Array(count) // 1 = twinkles, 0 = static
    const phaseOffsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute on a sphere of radius 50
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 45 + Math.random() * 10
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = 0.3 + Math.random() * 1.7
      twinkleFlags[i] = Math.random() < 0.1 ? 1 : 0
      phaseOffsets[i] = Math.random() * Math.PI * 2
    }
    return { positions, sizes, twinkleFlags, phaseOffsets }
  }, [])

  const phaseOffsetsRef = useRef(
    Float32Array.from({ length: count }, () => Math.random() * Math.PI * 2)
  ).current

  const sizesRef = useRef<THREE.BufferAttribute>(null)

  useFrame(({ clock }) => {
    if (!sizesRef.current) return
    const t = clock.elapsedTime
    const arr = sizesRef.current.array as Float32Array
    let changed = false
    for (let i = 0; i < count; i++) {
      if (twinkleFlags[i] === 1) {
        const base = sizes[i]
        arr[i] = base * (0.6 + 0.4 * Math.sin(t * 2.5 + phaseOffsetsRef[i]))
        changed = true
      }
    }
    if (changed) sizesRef.current.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute ref={sizesRef} attach="attributes-size" args={[sizes.slice(), 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#e8f0ff"
        transparent
        opacity={0.85}
        sizeAttenuation
        vertexColors={false}
      />
    </points>
  )
}

// ── Ambient dust: 2000 drifting micro-particles ────────────────────────────
function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 2000

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 40
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.elapsedTime * 0.003
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.002) * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#7c4dff"
        transparent
        opacity={0.10}
        sizeAttenuation
      />
    </points>
  )
}

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

  return (
    <>
      {/* Deep space nebula background */}
      <NebulaBg />

      {/* Lighting */}
      <ambientLight intensity={0.08} />
      <directionalLight position={[10, 10, 5]} intensity={0.2} color="#ffffff" />

      {/* Starfield */}
      <StarField />
      <AmbientDust />

      {/* Constellation network */}
      <ConstellationLines />
      <EnergyPulses />

      {/* Planets */}
      {STAR_MAP_NODES.map(node => (
        <NodeMesh key={node.id} node={node} onWarpStart={() => setWarping(true)} />
      ))}

      {/* Unmount OrbitControls during warp so it can't fight the camera animation */}
      {!warping && (
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.22}
          enableZoom
          enablePan={false}
          minDistance={5}
          maxDistance={30}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
          target={[0, -0.5, -4]}
          makeDefault
        />
      )}
    </>
  )
}
