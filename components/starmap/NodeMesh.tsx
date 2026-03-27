'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import type { StarNode } from './nodes'

interface NodeMeshProps {
  node: StarNode
  onWarpStart?: (node: StarNode) => void
}

export default function NodeMesh({ node, onWarpStart }: NodeMeshProps) {
  const { position, size, color, emissive, emissiveIntensity, label, sublabel, path, isCenter, isDiscovered } = node
  const meshRef  = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const ringRef  = useRef<THREE.Mesh>(null)
  const stationRingRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  const { camera } = useThree()
  const phaseOffset = useRef(Math.random() * Math.PI * 2).current

  // Click guard: track pointer-down position to distinguish click from drag
  const pointerDownAt = useRef<[number, number] | null>(null)

  // Travel-zoom animation state
  const travelRef = useRef<{
    active: boolean
    progress: number
    startPos: THREE.Vector3
    targetPos: THREE.Vector3
    lookAtPos: THREE.Vector3
    path: string
    navigated: boolean
  }>({
    active: false,
    progress: 0,
    startPos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(),
    lookAtPos: new THREE.Vector3(),
    path: '',
    navigated: false,
  })

  useFrame(({ clock, camera: cam }) => {
    const t = clock.elapsedTime
    const pulse = Math.sin(t * 1.4 + phaseOffset) * 0.12 + 0.88
    const travel = travelRef.current

    // Fade emissive/glow during warp approach to prevent bloom overflow
    const warpFade = travel.active ? Math.max(0.08, 1 - travel.progress * 0.92) : 1

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      if (isDiscovered) {
        const baseIntensity = emissiveIntensity * pulse * warpFade
        mat.emissiveIntensity = hovered ? emissiveIntensity * 1.5 * warpFade : baseIntensity
      }
      const targetScale = (isDiscovered && hovered) ? 1.2 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = isDiscovered ? (hovered ? 0.28 : pulse * 0.1) * warpFade : 0
    }

    if (ringRef.current && isCenter) {
      ringRef.current.rotation.y = t * 0.25
      ringRef.current.rotation.x = Math.sin(t * 0.15) * 0.3 + 0.4
    }

    if (stationRingRef.current && node.id === 'station') {
      stationRingRef.current.rotation.y = t * 0.4
      stationRingRef.current.rotation.x = Math.sin(t * 0.25) * 0.5 + Math.PI / 4
    }

    // Warp travel animation toward clicked node
    if (travel.active) {
      travel.progress = Math.min(travel.progress + 0.016, 1)
      const ease = 1 - Math.pow(1 - travel.progress, 3)

      cam.position.lerpVectors(travel.startPos, travel.targetPos, ease)
      cam.lookAt(travel.lookAtPos)

      if (travel.progress >= 0.8 && !travel.navigated) {
        travel.navigated = true
        router.push(travel.path)
      }

      if (travel.progress >= 1) {
        travel.active = false
      }
    }
  })

  const onEnter = useCallback(() => {
    if (!isDiscovered && !path) return
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [isDiscovered, path])

  const onLeave = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'grab'
  }, [])

  // onPointerDown: record screen position for click-vs-drag detection
  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    pointerDownAt.current = [e.clientX, e.clientY]
    console.log('=== POINTER DOWN ===', label, path)
  }, [label, path])

  // Shared navigation logic — used by sphere (onPointerUp) and HTML labels (onClick)
  const handleNodeClick = useCallback(() => {
    if (!path) return
    console.log('CLICK:', label, path, isCenter)

    if (onWarpStart) onWarpStart(node)

    const travel = travelRef.current
    travel.active = true
    travel.progress = 0
    travel.navigated = false
    travel.startPos = camera.position.clone()
    travel.path = path

    // Camera-relative direction — works for all nodes including center at [0,0,0]
    const planetPos = new THREE.Vector3(...position)
    const camToNode = planetPos.clone().sub(camera.position).normalize()
    const dist = camera.position.distanceTo(planetPos)
    travel.targetPos = camera.position.clone().add(camToNode.multiplyScalar(Math.max(dist - 2.5, 0.5)))
    travel.lookAtPos = planetPos.clone()
  }, [path, label, camera, position, node, router, onWarpStart, isDiscovered])

  // onPointerUp: fire navigation only if pointer moved < 5px (click, not drag)
  const onPointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const down = pointerDownAt.current
    pointerDownAt.current = null
    if (!down) return
    const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1])
    console.log('=== POINTER UP ===', label, path, '| moved:', moved.toFixed(1), 'px')
    if (moved >= 5) return // drag — ignore
    handleNodeClick()
  }, [label, path, handleNodeClick])

  return (
    <group position={position}>
      {/* Main planet sphere — all pointer events here */}
      <mesh
        ref={meshRef}
        onPointerOver={onEnter}
        onPointerOut={onLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {node.id === 'station'
          ? <octahedronGeometry args={[size * 1.4, 0]} />
          : <sphereGeometry args={[size, 48, 48]} />
        }
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isDiscovered ? emissiveIntensity : 0.3}
          toneMapped={false}
          transparent={!isDiscovered}
          opacity={isDiscovered ? 1 : 0.4}
          depthWrite={isDiscovered}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Outer glow sphere — excluded from raycasting so it can't block clicks */}
      <mesh ref={glowRef} scale={1.65} raycast={() => null}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={0.1}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light */}
      <pointLight
        color={emissive}
        intensity={isDiscovered ? (hovered ? 5.0 : isCenter ? 3.0 : 1.8) : 0.2}
        distance={isCenter ? 12 : 6}
        decay={2}
      />

      {/* Space station ring — only for station node */}
      {node.id === 'station' && (
        <mesh ref={stationRingRef} raycast={() => null} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[size * 2.2, 0.018, 8, 48]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      )}

      {/* Center orbital ring */}
      {isCenter && (
        <mesh ref={ringRef} raycast={() => null}>
          <torusGeometry args={[size * 2.6, 0.025, 8, 96]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.22} toneMapped={false} />
        </mesh>
      )}

      {/* Labels */}
      <Html
        center
        distanceFactor={16}
        position={[0, -(size + 0.55), 0]}
        style={{ pointerEvents: 'none', userSelect: 'none', textAlign: 'center' }}
      >
        <div
          onClick={handleNodeClick}
          style={{
            pointerEvents: isDiscovered ? 'auto' : 'none',
            cursor: isDiscovered ? 'pointer' : 'default',
            color: isDiscovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
            fontSize: isCenter ? '18px' : '15px',
            fontWeight: 600,
            fontFamily: 'var(--font-space, system-ui)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
            textShadow: isDiscovered
              ? `0 2px 12px rgba(0,0,0,0.9), 0 0 18px ${emissive}, 0 0 6px ${emissive}88`
              : '0 2px 8px rgba(0,0,0,0.8)',
            transition: 'color 0.2s',
            lineHeight: 1.2,
          }}
        >
          {label}{isDiscovered ? '' : ' ?'}
        </div>
        <div
          onClick={handleNodeClick}
          style={{
            pointerEvents: isDiscovered ? 'auto' : 'none',
            cursor: isDiscovered ? 'pointer' : 'default',
            color: isDiscovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
            fontSize: isCenter ? '14px' : '12px',
            fontWeight: 500,
            fontFamily: 'var(--font-inter, system-ui)',
            whiteSpace: 'nowrap',
            marginTop: 4,
            letterSpacing: '0.5px',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          {sublabel}
        </div>
      </Html>
    </group>
  )
}
