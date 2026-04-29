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
  onHoverChange?: (id: string | null) => void
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

export default function NodeMesh({ node, onWarpStart, onHoverChange }: NodeMeshProps) {
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
  const { camera } = useThree()
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
      // Station body still uses meshStandardMaterial (invisible box, opacity 0)
      // and accepts emissiveIntensity. Other nodes now use meshBasicMaterial,
      // which has no emissive — hover/pulse feedback is carried by the
      // separate atmosphere shell, glow sphere, and pointLight below.
      if (node.id === 'station') {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial
        if (isDiscovered) {
          const baseIntensity = emissiveIntensity * pulse * warpFade
          mat.emissiveIntensity = hovered ? emissiveIntensity * 1.5 * warpFade : baseIntensity
        }
      }
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

  })

  const onEnter = useCallback(() => {
    if (!isDiscovered && !path && node.id !== 'claim-your-planet') return
    if (!path) return
    setHovered(true)
    onHoverChange?.(node.id)
    document.body.style.cursor = 'pointer'
  }, [isDiscovered, path, node.id, onHoverChange])

  const onLeave = useCallback(() => {
    setHovered(false)
    onHoverChange?.(null)
    document.body.style.cursor = 'grab'
  }, [onHoverChange])

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
        {node.id === 'station' ? (
          <>
            <boxGeometry args={[size * 2.8, size * 1.8, size * 0.3]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={0}
              toneMapped={false}
              transparent
              opacity={0}
              depthWrite={false}
              roughness={0.3}
              metalness={0.1}
            />
          </>
        ) : node.texture ? (
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

      {/* Station: rectangular image thumbnail instead of a planet shape */}
      {node.id === 'station' && (
        <Html
          center
          distanceFactor={16}
          position={[0, 0, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          zIndexRange={[1, 2]}
        >
          <div
            onClick={handleNodeClick}
            style={{
              pointerEvents: isDiscovered ? 'auto' : 'none',
              cursor: isDiscovered ? 'pointer' : 'default',
              width: 60,
              height: 40,
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${emissive}66`,
              boxShadow: `0 0 12px ${emissive}55, 0 0 4px ${emissive}33`,
              background: '#001322',
              transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.boxShadow = `0 0 20px ${emissive}99, 0 0 8px ${emissive}66`
              el.style.borderColor = `${emissive}cc`
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.boxShadow = `0 0 12px ${emissive}55, 0 0 4px ${emissive}33`
              el.style.borderColor = `${emissive}66`
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/space-station.jpg"
              alt="Space Station"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </Html>
      )}

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
            pointerEvents: (isDiscovered || node.id === 'claim-your-planet') ? 'auto' : 'none',
            cursor: (isDiscovered || node.id === 'claim-your-planet') ? 'pointer' : 'default',
            color: isDiscovered ? 'rgba(255,255,255,0.95)' : node.id === 'claim-your-planet' ? 'rgba(0,212,255,0.55)' : 'rgba(255,255,255,0.4)',
            fontSize: isCenter ? '18px' : '15px',
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
        <div
          onClick={handleNodeClick}
          style={{
            pointerEvents: isDiscovered ? 'auto' : 'none',
            cursor: isDiscovered ? 'pointer' : 'default',
            color: isDiscovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
            fontSize: '14px',
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
