'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import type { StarNode } from './nodes'

interface NodeMeshProps extends StarNode {}

export default function NodeMesh({
  position,
  size,
  color,
  label,
  sublabel,
  href,
  isCenter,
}: NodeMeshProps) {
  const meshRef    = useRef<THREE.Mesh>(null)
  const glowRef    = useRef<THREE.Mesh>(null)
  const ringRef    = useRef<THREE.Mesh>(null)
  const [hovered, setHovered]   = useState(false)
  const [clicking, setClicking] = useState(false)
  const router   = useRouter()
  const { camera } = useThree()
  const phaseOffset = useRef(Math.random() * Math.PI * 2).current

  // Travel-zoom animation state
  const travelRef = useRef<{ active: boolean; progress: number; startPos: THREE.Vector3; targetPos: THREE.Vector3; href: string }>({
    active: false, progress: 0, startPos: new THREE.Vector3(), targetPos: new THREE.Vector3(), href: ''
  })

  useFrame(({ clock, camera: cam }) => {
    const t = clock.elapsedTime
    const pulse = Math.sin(t * 1.4 + phaseOffset) * 0.12 + 0.88

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = hovered ? 1.8 : pulse * (isCenter ? 0.7 : 0.5)
      const s = hovered ? 1.22 : clicking ? 1.4 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.14)
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = hovered ? 0.22 : pulse * 0.1
    }
    if (ringRef.current && isCenter) {
      ringRef.current.rotation.y = t * 0.25
      ringRef.current.rotation.x = Math.sin(t * 0.15) * 0.3 + 0.4
    }

    // Travel animation
    const travel = travelRef.current
    if (travel.active) {
      travel.progress = Math.min(travel.progress + 0.018, 1)
      // Ease-in-out cubic
      const ease = travel.progress < 0.5
        ? 4 * travel.progress ** 3
        : 1 - Math.pow(-2 * travel.progress + 2, 3) / 2

      cam.position.lerpVectors(travel.startPos, travel.targetPos, ease)
      cam.lookAt(0, 0, 0)

      if (travel.progress >= 1) {
        travel.active = false
        router.push(travel.href)
      }
    }
  })

  const onEnter = useCallback(() => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const onLeave = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  const onClick = useCallback(() => {
    if (isCenter) return
    setClicking(true)
    // Start travel animation: zoom into the planet
    const travel = travelRef.current
    travel.active = true
    travel.progress = 0
    travel.startPos = camera.position.clone()
    const pv = new THREE.Vector3(...(position as [number,number,number]))
    // Target: just in front of the planet
    travel.targetPos = pv.clone().multiplyScalar(0.55)
    travel.href = href
  }, [isCenter, href, camera, position])

  return (
    <group position={position}>
      {/* Main planet sphere */}
      <mesh
        ref={meshRef}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={onClick}
      >
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.06}
          metalness={0.5}
          // No transparency — prevents stars showing through
        />
      </mesh>

      {/* Glow halo */}
      <mesh ref={glowRef} scale={1.6}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light */}
      <pointLight
        color={color}
        intensity={hovered ? 4.5 : isCenter ? 2.8 : 1.6}
        distance={isCenter ? 10 : 5}
        decay={2}
      />

      {/* Center orbit ring */}
      {isCenter && (
        <mesh ref={ringRef}>
          <torusGeometry args={[size * 2.6, 0.025, 8, 96]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} />
        </mesh>
      )}

      {/* Labels */}
      <Html
        center
        distanceFactor={10}
        position={[0, -(size + 0.62), 0]}
        style={{ pointerEvents: 'none', userSelect: 'none', textAlign: 'center' }}
      >
        <div style={{
          color: hovered ? '#ffffff' : 'rgba(226,232,240,0.92)',
          fontSize: isCenter ? 20 : 15,
          fontWeight: isCenter ? 800 : 600,
          fontFamily: 'var(--font-space, system-ui)',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
          textShadow: `0 0 16px ${color}, 0 2px 8px rgba(0,0,0,0.8)`,
          transition: 'color 0.2s',
          lineHeight: 1.2,
        }}>
          {label}
        </div>
        {!isCenter && (
          <div style={{
            color: hovered ? 'rgba(200,220,255,0.95)' : 'rgba(148,163,184,0.75)',
            fontSize: 11,
            fontFamily: 'var(--font-inter, system-ui)',
            whiteSpace: 'nowrap',
            marginTop: 3,
            letterSpacing: '0.01em',
            transition: 'color 0.2s',
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
          }}>
            {sublabel}
          </div>
        )}
      </Html>
    </group>
  )
}
