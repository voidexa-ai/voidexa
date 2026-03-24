'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import NodeMesh from './NodeMesh'
import { NODES } from './nodes'

// Faint constellation lines from center to each satellite
function ConstellationLines() {
  return (
    <>
      {NODES.filter(n => !n.isCenter).map(node => (
        <Line
          key={node.id}
          points={[[0, 0, 0], node.position]}
          color={node.color}
          lineWidth={0.5}
          transparent
          opacity={0.1}
          dashed={false}
        />
      ))}
    </>
  )
}

// Slowly drifting ambient particles
function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 120
  const positions = useRef(
    Float32Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 30)
  ).current

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.elapsedTime * 0.006
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.004) * 0.035
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

export default function StarMapScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[10, 10, 5]} intensity={0.25} color="#ffffff" />

      {/* Deep starfield */}
      <Stars
        radius={250}
        depth={60}
        count={9000}
        factor={4}
        saturation={0}
        fade
        speed={0.1}
      />

      <AmbientDust />
      <ConstellationLines />

      {NODES.map(node => (
        <NodeMesh key={node.id} {...node} />
      ))}

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.22}
        enableZoom
        enablePan={false}
        minDistance={6}
        maxDistance={20}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.82}
        makeDefault
      />
    </>
  )
}
