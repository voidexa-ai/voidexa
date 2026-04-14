'use client'

import { useRef, useState, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import type { CompanyPlanet } from './companies'

interface Props {
  planet: CompanyPlanet
  onWarpStart?: (planet: CompanyPlanet) => void
  onHoverChange?: (id: string | null) => void
  highlightedId?: string | null
}

// LOD thresholds based on camera distance to planet
// far: dot only    medium: shape + atmosphere + fading label    close: full detail + sublabel
const LOD_FAR_MIN    = 45
const LOD_MED_MIN    = 22
// below LOD_MED_MIN = close

function computeLod(dist: number) {
  if (dist > LOD_FAR_MIN) return 'far' as const
  if (dist > LOD_MED_MIN) return 'medium' as const
  return 'close' as const
}

export default function CompanyPlanetMesh({ planet, onWarpStart, onHoverChange, highlightedId }: Props) {
  const { camera } = useThree()
  const router = useRouter()
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const atmoRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const [hovered, setHovered] = useState(false)
  const [lod, setLod] = useState<'far' | 'medium' | 'close'>('medium')
  const phaseOffset = useRef(Math.random() * Math.PI * 2).current

  const pointerDownAt = useRef<[number, number] | null>(null)
  const warpRef = useRef({ active: false, progress: 0 })

  const planetPos = useMemo(
    () => new THREE.Vector3(...planet.position),
    [planet.position]
  )

  const isHighlighted = highlightedId === planet.id

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const dist = camera.position.distanceTo(planetPos)
    const nextLod = computeLod(dist)
    if (nextLod !== lod) setLod(nextLod)

    const pulse = 0.88 + Math.sin(t * 1.4 + phaseOffset) * 0.12
    const warp = warpRef.current
    const warpFade = warp.active ? Math.max(0.08, 1 - warp.progress * 0.92) : 1

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      const base = planet.emissiveIntensity * pulse * warpFade
      mat.emissiveIntensity = (hovered || isHighlighted) ? planet.emissiveIntensity * 1.6 * warpFade : base
      const targetScale = (hovered || isHighlighted) ? 1.25 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = ((hovered || isHighlighted) ? 0.35 : pulse * 0.12) * warpFade
    }

    if (atmoRef.current) {
      const mat = atmoRef.current.material as THREE.MeshBasicMaterial
      const breath = 0.85 + Math.sin(t * 0.8 + phaseOffset) * 0.15
      // Atmosphere fades in at medium zoom, fully visible at close
      const lodAtmo = nextLod === 'far' ? 0 : nextLod === 'medium' ? 0.5 : 1.0
      const base = planet.isSun ? 0.22 : planet.isMystery ? 0.08 : 0.18
      mat.opacity = base * breath * lodAtmo * warpFade
    }

    if (ringRef.current && planet.isSun) {
      ringRef.current.rotation.y = t * 0.25
      ringRef.current.rotation.x = Math.sin(t * 0.15) * 0.3 + 0.4
    }
  })

  const onEnter = useCallback(() => {
    setHovered(true)
    onHoverChange?.(planet.id)
    document.body.style.cursor = 'pointer'
  }, [onHoverChange, planet.id])

  const onLeave = useCallback(() => {
    setHovered(false)
    onHoverChange?.(null)
    document.body.style.cursor = 'grab'
  }, [onHoverChange])

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    pointerDownAt.current = [e.clientX, e.clientY]
  }, [])

  const handleClick = useCallback(() => {
    if (!planet.path) return
    if (warpRef.current.active) return

    onWarpStart?.(planet)

    const camToNode = planetPos.clone().sub(camera.position).normalize()
    const dist = camera.position.distanceTo(planetPos)
    const targetPos = camera.position.clone().add(
      camToNode.multiplyScalar(Math.max(dist - 3.0, 0.5))
    )

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
      duration: 1.1,
      ease: 'power3.in',
      onUpdate: () => {
        warpRef.current.progress = state.progress
        persp.fov = state.fov
        persp.updateProjectionMatrix()
        if (state.progress >= 0.75 && !navigated) {
          navigated = true
          router.push(planet.path)
        }
      },
    }).to(camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 1.1,
      ease: 'power3.in',
      onUpdate: () => {
        look.copy(planetPos)
        camera.lookAt(look)
      },
    }, 0)
  }, [camera, planet, planetPos, router, onWarpStart])

  const onPointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const down = pointerDownAt.current
    pointerDownAt.current = null
    if (!down) return
    const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1])
    if (moved >= 5) return
    handleClick()
  }, [handleClick])

  const { size, color, emissive, emissiveIntensity, isSun, isMystery } = planet

  const showLabel    = lod !== 'far' || isSun || isHighlighted
  const showSublabel = lod === 'close' || isHighlighted
  const labelOpacity = lod === 'far' ? (isSun ? 0.9 : 0) : lod === 'medium' ? 0.85 : 1

  return (
    <group ref={groupRef} position={planet.position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={onEnter}
        onPointerOut={onLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Outer glow (always visible — this is what shows as a "dot" at far LOD) */}
      <mesh ref={glowRef} scale={isSun ? 2.2 : 1.7} raycast={() => null}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* Atmosphere shell — fades with LOD */}
      <mesh ref={atmoRef} scale={isSun ? 1.9 : 1.6} raycast={() => null}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.BackSide}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sun corona ring */}
      {isSun && (
        <mesh ref={ringRef} raycast={() => null}>
          <torusGeometry args={[size * 2.4, 0.04, 8, 96]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.3} toneMapped={false} />
        </mesh>
      )}

      {/* Point light */}
      <pointLight
        color={emissive}
        intensity={isSun ? 4.0 : (hovered ? 4.5 : 1.6)}
        distance={isSun ? 20 : 8}
        decay={2}
      />

      {/* Mystery dashed ring */}
      {isMystery && (
        <Html
          center
          distanceFactor={14}
          position={[0, 0, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          zIndexRange={[1, 2]}
        >
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            border: '1.5px dashed rgba(0,212,255,0.4)',
            boxShadow: '0 0 14px rgba(0,212,255,0.22), inset 0 0 10px rgba(0,212,255,0.08)',
            animation: 'galaxyMysteryPulse 2.6s ease-in-out infinite',
          }}>
            <style>{`
              @keyframes galaxyMysteryPulse {
                0%,100%{box-shadow:0 0 10px rgba(0,212,255,0.18),inset 0 0 8px rgba(0,212,255,0.06)}
                50%{box-shadow:0 0 26px rgba(0,212,255,0.5),inset 0 0 14px rgba(0,212,255,0.12)}
              }
            `}</style>
          </div>
        </Html>
      )}

      {/* Label */}
      {showLabel && (
        <Html
          center
          distanceFactor={isSun ? 22 : 16}
          position={[0, -(size + 0.55), 0]}
          style={{ pointerEvents: 'none', userSelect: 'none', textAlign: 'center' }}
        >
          <div
            onClick={handleClick}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              color: isMystery ? 'rgba(0,212,255,0.7)' : 'rgba(255,255,255,0.95)',
              fontSize: isSun ? '20px' : '16px',
              fontWeight: 600,
              fontFamily: 'var(--font-space, system-ui)',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
              textShadow: `0 2px 12px rgba(0,0,0,0.9), 0 0 18px ${emissive}, 0 0 6px ${emissive}88`,
              transition: 'opacity 0.4s',
              opacity: labelOpacity,
              lineHeight: 1.2,
            }}
          >
            {planet.name}{isMystery ? ' ?' : ''}
          </div>
          {showSublabel && (
            <div
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'var(--font-inter, system-ui)',
                whiteSpace: 'nowrap',
                marginTop: 4,
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                transition: 'opacity 0.4s',
                opacity: showSublabel ? 0.9 : 0,
              }}
            >
              {planet.sublabel}
            </div>
          )}
        </Html>
      )}
    </group>
  )
}
