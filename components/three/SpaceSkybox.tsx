'use client'

import { useLoader, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, TextureLoader, BackSide, SRGBColorSpace, type Mesh } from 'three'

interface SpaceSkyboxProps {
  /** Path to equirectangular texture in /public. Defaults to /skybox/deep_space_01.png. */
  texture?: string
  /** Sphere radius — 1000+ recommended for backdrop. */
  radius?: number
  /** When true, skybox follows camera position so the player never reaches it (use for first-person scenes like freeflight). */
  rotateWithCamera?: boolean
  /** Texture intensity 0-1. Anything below 1 enables transparency. */
  intensity?: number
  /** Multiplier on material color. 1.0 = unchanged. Values > 1 boost dim textures past Bloom luminanceThreshold and over the scene.background fallback. With toneMapped={false} the boosted color is clamped at framebuffer write so visible cap is white. */
  brightness?: number
}

const DEFAULT_TEXTURE = '/skybox/deep_space_01.png'

export function SpaceSkybox({
  texture = DEFAULT_TEXTURE,
  radius = 1000,
  rotateWithCamera = false,
  intensity = 1,
  brightness = 1,
}: SpaceSkyboxProps) {
  const tex = useLoader(TextureLoader, texture)
  const meshRef = useRef<Mesh>(null)

  // Cache sRGB encoding on the texture itself so swaps don't reset it.
  useMemo(() => {
    tex.colorSpace = SRGBColorSpace
    tex.needsUpdate = true
  }, [tex])

  // Memoize the brightness color so it is allocated once per brightness change,
  // not per render. THREE.Color accepts r,g,b > 1 with toneMapped=false.
  const colorMul = useMemo(() => new Color(brightness, brightness, brightness), [brightness])

  // For first-person scenes, lock the skybox to the camera origin every frame
  // so the player can never approach the sphere.
  useFrame((state) => {
    if (!rotateWithCamera || !meshRef.current) return
    meshRef.current.position.copy(state.camera.position)
  })

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <sphereGeometry args={[radius, 60, 40]} />
      <meshBasicMaterial
        map={tex}
        color={colorMul}
        side={BackSide}
        depthWrite={false}
        opacity={intensity}
        transparent={intensity < 1}
        toneMapped={false}
      />
    </mesh>
  )
}

export { DEFAULT_TEXTURE }
