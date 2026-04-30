'use client'

import { Suspense, useRef, useState, useCallback } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import gsap from 'gsap'
import type { StarNode, PlanetType } from './nodes'

// Textured planet body — suspends on texture load. Color held at white so the
// PNG renders unmodified; meshBasicMaterial ignores lighting so the texture
// shows as authored regardless of scene lights.
function TexturedPlanetBody({
  texturePath,
  size,
  isDiscovered,
}: {
  texturePath: string
  size: number
  isDiscovered: boolean
}) {
  const tex = useLoader(THREE.TextureLoader, texturePath)
  return (
    <>
      <sphereGeometry args={[size, 48, 48]} />
      <meshBasicMaterial
        map={tex}
        color="#ffffff"
        transparent
        opacity={isDiscovered ? 1 : 0.4}
        depthWrite={isDiscovered}
        toneMapped={false}
      />
    </>
  )
}

interface NodeMeshProps {
  node: StarNode
  onWarpStart?: (node: StarNode) => void
  isHovered?: boolean
  onHoverStart?: (screenPos: { x: number; y: number }) => void
  onHoverEnd?: () => void
  onHoverUpdate?: (screenPos: { x: number; y: number }) => void
}

const ATMOSPHERE_BY_TYPE: Record<PlanetType, { scale: number; opacity: number; color?: string }> = {
  sun:      { scale: 2.0, opacity: 0.18 },
  desert:   { scale: 1.55, opacity: 0.14 },
  ocean:    { scale: 1.70, opacity: 0.20 },
  ice:      { scale: 1.75, opacity: 0.22, color: '#a8d8ff' },
  jungle:   { scale: 1.60, opacity: 0.18 },
  gas:      { scale: 1.95, opacity: 0.26 },
  volcanic: { scale: 1.55, opacity: 0.22 },
  tech:     { scale: 1.65, opacity: 0.18 },
  mystery:  { scale: 1.50, opacity: 0.08 },
  station:  { scale: 1.00, opacity: 0.00 },
}

export default function NodeMesh({
  node,
  onWarpStart,
  isHovered = false,
  onHoverStart,
  onHoverEnd,
  onHoverUpdate,
}: NodeMeshProps) {
  const { position, size, color, emissive, emissiveIntensity, label, sublabel, path, isCenter, isDiscovered } = node
  const planetType: PlanetType = node.planetType ?? 'desert'
  const atmo = ATMOSPHERE_BY_TYPE[planetType]
  const meshRef  = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const atmoRef  = useRef<THREE.Mesh>(null)
  const ringRef  = useRef<THREE.Mesh>(null)
  const stationRingRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  const { camera, size: viewportSize } = useThree()
  const phaseOffset = useRef(Math.random() * Math.PI * 2).current

  // Click guard: track pointer-down position to distinguish click from drag
  const pointerDownAt = useRef<[number, number] | null>(null)

  // Warp state — progress drives emissive fade; GSAP handles camera
  const warpRef = useRef({ active: false, progress: 0 })

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pulse = Math.sin(t * 1.4 + phaseOffset) * 0.12 + 0.88
    const warp = warpRef.current

    // Fade emissive/glow during warp approach to prevent bloom overflow
    const warpFade = warp.active ? Math.max(0.08, 1 - warp.progress * 0.92) : 1

    if (meshRef.current) {
      // All planet bodies now use meshBasicMaterial (textured), which has no
      // emissiveIntensity. Hover/pulse feedback is carried by the glow sphere,
      // atmosphere shell, and pointLight elsewhere in the group.
      const targetScale = (isDiscovered && hovered) ? 1.2 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = isDiscovered ? (hovered ? 0.28 : pulse * 0.1) * warpFade : 0
    }

    if (atmoRef.current && planetType !== 'station') {
      const mat = atmoRef.current.material as THREE.MeshBasicMaterial
      const base = atmo.opacity
      const breath = 0.85 + Math.sin(t * 0.8 + phaseOffset) * 0.15
      mat.opacity = isDiscovered
        ? (hovered ? base * 1.6 : base * breath) * warpFade
        : base * 0.3 * warpFade
    }

    if (ringRef.current && isCenter) {
      ringRef.current.rotation.y = t * 0.25
      ringRef.current.rotation.x = Math.sin(t * 0.15) * 0.3 + 0.4
    }

    if (stationRingRef.current && node.id === 'station') {
      stationRingRef.current.rotation.y = t * 0.4
      stationRingRef.current.rotation.x = Math.sin(t * 0.25) * 0.5 + Math.PI / 4
    }

    // FIX-15 — per-frame screen-space projection while hovered, so the HUD
    // line follows the planet as user drags or auto-rotation moves it.
    if (isHovered && meshRef.current && onHoverUpdate) {
      const worldVec = new THREE.Vector3()
      meshRef.current.getWorldPosition(worldVec)
      worldVec.project(camera)
      const x = (worldVec.x * 0.5 + 0.5) * viewportSize.width
      const y = (-worldVec.y * 0.5 + 0.5) * viewportSize.height
      onHoverUpdate({ x, y })
    }
  })

  const onEnter = useCallback(() => {
    if (!isDiscovered && !path && node.id !== 'claim-your-planet') return
    if (!path) return
    setHovered(true)
    document.body.style.cursor = 'pointer'
    if (meshRef.current && onHoverStart) {
      const worldVec = new THREE.Vector3()
      meshRef.current.getWorldPosition(worldVec)
      worldVec.project(camera)
      const x = (worldVec.x * 0.5 + 0.5) * viewportSize.width
      const y = (-worldVec.y * 0.5 + 0.5) * viewportSize.height
      onHoverStart({ x, y })
    }
  }, [isDiscovered, path, node.id, onHoverStart, camera, viewportSize])

  const onLeave = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'grab'
    onHoverEnd?.()
  }, [onHoverEnd])

  // onPointerDown: record screen position for click-vs-drag detection
  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    pointerDownAt.current = [e.clientX, e.clientY]
    console.log('=== POINTER DOWN ===', label, path)
  }, [label, path])

  // Shared navigation logic — used by sphere (onPointerUp) and HTML labels (onClick)
  const handleNodeClick = useCallback(() => {
    if (!path) return
    if (warpRef.current.active) return
    console.log('CLICK:', label, path, isCenter)

    onWarpStart?.(node)

    const planetPos = new THREE.Vector3(...position)
    const camToNode = planetPos.clone().sub(camera.position).normalize()
    const dist = camera.position.distanceTo(planetPos)
    const targetPos = camera.position.clone().add(camToNode.multiplyScalar(Math.max(dist - 2.5, 0.5)))

    const persp = camera as THREE.PerspectiveCamera
    const startFov = persp.fov ?? 60

    const state = { progress: 0, fov: startFov }
    warpRef.current.active = true
    warpRef.current.progress = 0

    const look = new THREE.Vector3()
    let navigated = false

    gsap.killTweensOf(state)
    gsap.killTweensOf(camera.position)

    const tl = gsap.timeline({
      onComplete: () => {
        warpRef.current.active = false
        warpRef.current.progress = 0
        persp.fov = startFov
        persp.updateProjectionMatrix()
      },
    })

    tl.to(state, {
      progress: 1,
      fov: 92,
      duration: 1.0,
      ease: 'power3.in',
      onUpdate: () => {
        warpRef.current.progress = state.progress
        persp.fov = state.fov
        persp.updateProjectionMatrix()
        if (state.progress >= 0.75 && !navigated) {
          navigated = true
          router.push(path)
        }
      },
    })
      .to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.0,
        ease: 'power3.in',
        onUpdate: () => {
          look.copy(planetPos)
          camera.lookAt(look)
        },
      }, 0)
  }, [path, label, camera, position, node, router, onWarpStart, isCenter])

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
        {node.texture ? (
          <Suspense fallback={
            <>
              <sphereGeometry args={[size, 48, 48]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isDiscovered ? 1 : 0.4}
                depthWrite={isDiscovered}
                toneMapped={false}
              />
            </>
          }>
            <TexturedPlanetBody
              texturePath={node.texture}
              size={size}
              isDiscovered={isDiscovered}
            />
          </Suspense>
        ) : (
          <>
            <sphereGeometry args={[size, 48, 48]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isDiscovered ? 1 : 0.4}
              depthWrite={isDiscovered}
              toneMapped={false}
            />
          </>
        )}
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
          toneMapped={false}
        />
      </mesh>

      {/* Planet-type atmosphere shell */}
      {planetType !== 'station' && (
        <mesh ref={atmoRef} scale={atmo.scale} raycast={() => null}>
          <sphereGeometry args={[size, 24, 24]} />
          <meshBasicMaterial
            color={atmo.color ?? emissive}
            transparent
            opacity={atmo.opacity}
            depthWrite={false}
            side={THREE.BackSide}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

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

      {/* Space station metallic orbital ring + 4 module boxes */}
      {node.id === 'station' && (
        <>
          <mesh raycast={() => null} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[size * 1.8, size * 0.08, 16, 64]} />
            <meshBasicMaterial color="#88aabb" />
          </mesh>
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
            <mesh
              key={i}
              raycast={() => null}
              position={[
                Math.cos(angle) * size * 1.8,
                0,
                Math.sin(angle) * size * 1.8,
              ]}
            >
              <boxGeometry args={[size * 0.2, size * 0.15, size * 0.2]} />
              <meshBasicMaterial color="#aaccdd" />
            </mesh>
          ))}
        </>
      )}

      {/* Saturn-style rings for Quantum gas giant */}
      {node.id === 'quantum' && (
        <mesh raycast={() => null} rotation={[Math.PI / 2.2, 0, 0.15]}>
          <ringGeometry args={[size * 1.6, size * 2.4, 64]} />
          <meshBasicMaterial
            color="#d4b88a"
            side={THREE.DoubleSide}
            transparent
            opacity={0.75}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Center orbital ring */}
      {isCenter && (
        <mesh ref={ringRef} raycast={() => null}>
          <torusGeometry args={[size * 2.6, 0.025, 8, 96]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.22} toneMapped={false} />
        </mesh>
      )}

      {/* Dashed ring overlay for claim-your-planet mystery node */}
      {node.id === 'claim-your-planet' && (
        <Html
          center
          distanceFactor={16}
          position={[0, 0, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          zIndexRange={[1, 2]}
        >
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1.5px dashed rgba(0,212,255,0.35)',
            boxShadow: '0 0 12px rgba(0,212,255,0.18), inset 0 0 8px rgba(0,212,255,0.06)',
            animation: 'claimPulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}>
            <style>{`
              @keyframes claimPulse {
                0%,100%{box-shadow:0 0 8px rgba(0,212,255,0.15),inset 0 0 6px rgba(0,212,255,0.04)}
                50%{box-shadow:0 0 22px rgba(0,212,255,0.45),inset 0 0 12px rgba(0,212,255,0.1)}
              }
            `}</style>
          </div>
        </Html>
      )}

      {/* Name label only — subtitle moved to HoverHUD on hover (FIX-15) */}
      <Html
        center
        distanceFactor={16}
        position={[0, -(size + 0.55), 0]}
        style={{ pointerEvents: 'none', userSelect: 'none', textAlign: 'center' }}
      >
        <div
          onClick={handleNodeClick}
          style={{
            pointerEvents: (isDiscovered || node.id === 'claim-your-planet') ? 'auto' : 'none',
            cursor: (isDiscovered || node.id === 'claim-your-planet') ? 'pointer' : 'default',
            color: isDiscovered ? 'rgba(255,255,255,0.95)' : node.id === 'claim-your-planet' ? 'rgba(0,212,255,0.55)' : 'rgba(255,255,255,0.4)',
            fontSize: isCenter ? '64px' : '56px',
            fontWeight: 600,
            fontFamily: 'var(--font-space, system-ui)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
            textShadow: isDiscovered
              ? `0 2px 12px rgba(0,0,0,0.9), 0 0 18px ${emissive}, 0 0 6px ${emissive}88`
              : node.id === 'claim-your-planet' ? '0 0 14px rgba(0,212,255,0.4), 0 2px 8px rgba(0,0,0,0.8)' : '0 2px 8px rgba(0,0,0,0.8)',
            transition: 'color 0.2s',
            lineHeight: 1.2,
          }}
        >
          {label}{isDiscovered ? '' : ' ?'}
        </div>
      </Html>
    </group>
  )
}
