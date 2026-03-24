'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import type { StarNode } from './nodes'

interface NodeMeshProps {
  node: StarNode
  onWarpStart?: (node: StarNode) => void
}

export default function NodeMesh({ node, onWarpStart }: NodeMeshProps) {
  const { position, size, color, emissive, emissiveIntensity, label, sublabel, path, isCenter } = node
  const meshRef  = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const ringRef  = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  const { camera } = useThree()
  const phaseOffset = useRef(Math.random() * Math.PI * 2).current

  // Travel-zoom animation state
  const travelRef = useRef<{
    active: boolean
    progress: number
    startPos: THREE.Vector3
    targetPos: THREE.Vector3
    path: string
    navigated: boolean
  }>({
    active: false,
    progress: 0,
    startPos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(),
    path: '',
    navigated: false,
  })

  useFrame(({ clock, camera: cam }) => {
    const t = clock.elapsedTime
    const pulse = Math.sin(t * 1.4 + phaseOffset) * 0.12 + 0.88

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      const baseIntensity = emissiveIntensity * pulse
      mat.emissiveIntensity = hovered ? emissiveIntensity * 1.5 : baseIntensity
      const targetScale = hovered ? 1.2 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = hovered ? 0.25 : pulse * 0.1
    }

    if (ringRef.current && isCenter) {
      ringRef.current.rotation.y = t * 0.25
      ringRef.current.rotation.x = Math.sin(t * 0.15) * 0.3 + 0.4
    }

    // Travel animation (warp effect)
    const travel = travelRef.current
    if (travel.active) {
      travel.progress = Math.min(travel.progress + 0.018, 1)
      // Ease-in cubic
      const ease = travel.progress < 0.5
        ? 4 * travel.progress ** 3
        : 1 - Math.pow(-2 * travel.progress + 2, 3) / 2

      cam.position.lerpVectors(travel.startPos, travel.targetPos, ease)
      cam.lookAt(0, 0, 0)

      if (travel.progress >= 0.85 && !travel.navigated) {
        travel.navigated = true
        router.push(travel.path)
      }

      if (travel.progress >= 1) {
        travel.active = false
      }
    }
  })

  const onEnter = useCallback(() => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const onLeave = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'grab'
  }, [])

  const onClick = useCallback(() => {
    if (isCenter) return
    // Trigger parent warp callback if provided
    if (onWarpStart) onWarpStart(node)

    const travel = travelRef.current
    travel.active = true
    travel.progress = 0
    travel.navigated = false
    travel.startPos = camera.position.clone()
    const pv = new THREE.Vector3(...position)
    travel.targetPos = pv.clone().multiplyScalar(0.5)
    travel.path = path
  }, [isCenter, path, camera, position, node, onWarpStart])

  return (
    <group position={position}>
      {/* Main planet sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={onEnter}
        onPointerOut={onLeave}
        onClick={onClick}
      >
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
          transparent={false}
          depthWrite={true}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Outer glow sphere — BackSide, very transparent */}
      <mesh ref={glowRef} scale={1.65}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={0.1}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light for scene lighting */}
      <pointLight
        color={emissive}
        intensity={hovered ? 5.0 : isCenter ? 3.0 : 1.8}
        distance={isCenter ? 12 : 6}
        decay={2}
      />

      {/* Center orbital ring */}
      {isCenter && (
        <mesh ref={ringRef}>
          <torusGeometry args={[size * 2.6, 0.025, 8, 96]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.22} toneMapped={false} />
        </mesh>
      )}

      {/* Labels */}
      <Html
        center
        distanceFactor={10}
        position={[0, -(size + 0.55), 0]}
        style={{ pointerEvents: 'none', userSelect: 'none', textAlign: 'center' }}
      >
        <div style={{
          color: hovered ? '#ffffff' : 'rgba(226,232,240,0.92)',
          fontSize: isCenter ? 20 : 16,
          fontWeight: isCenter ? 800 : 600,
          fontFamily: 'var(--font-space, system-ui)',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
          textShadow: `0 0 18px ${emissive}, 0 0 6px ${emissive}88, 0 2px 8px rgba(0,0,0,0.9)`,
          transition: 'color 0.2s',
          lineHeight: 1.2,
        }}>
          {label}
        </div>
        <div style={{
          color: hovered ? 'rgba(210,230,255,0.95)' : 'rgba(148,163,184,0.70)',
          fontSize: 13,
          fontFamily: 'var(--font-inter, system-ui)',
          whiteSpace: 'nowrap',
          marginTop: 3,
          letterSpacing: '0.01em',
          transition: 'color 0.2s',
          textShadow: '0 1px 6px rgba(0,0,0,0.9)',
        }}>
          {sublabel}
        </div>
      </Html>
    </group>
  )
}
