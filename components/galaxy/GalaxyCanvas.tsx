'use client'

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import gsap from 'gsap'
import * as THREE from 'three'
import GalaxyScene from './GalaxyScene'

interface Props {
  highlightedId: string | null
  onHoverChange?: (id: string | null) => void
  onWarpChange?: (warping: boolean) => void
  focusTarget: [number, number, number] | null
  onFocusConsumed?: () => void
}

// Inside-canvas controller: on focusTarget change, tween the camera toward the target planet
function FocusController({ target, onDone }: { target: [number, number, number] | null; onDone?: () => void }) {
  const { camera } = useThree()
  const lastTarget = useRef<string | null>(null)

  useFrame(() => {})

  useEffect(() => {
    if (!target) return
    const key = target.join(',')
    if (lastTarget.current === key) return
    lastTarget.current = key

    const targetVec = new THREE.Vector3(...target)
    const dir = targetVec.clone().sub(camera.position).normalize()
    const dist = camera.position.distanceTo(targetVec)
    const desiredDist = Math.min(Math.max(12, dist * 0.6), 30)
    const newCamPos = targetVec.clone().sub(dir.multiplyScalar(desiredDist))

    gsap.killTweensOf(camera.position)
    gsap.to(camera.position, {
      x: newCamPos.x,
      y: newCamPos.y,
      z: newCamPos.z,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(targetVec),
      onComplete: () => onDone?.(),
    })
  }, [target, camera, onDone])

  return null
}

export default function GalaxyCanvas({ highlightedId, onHoverChange, onWarpChange, focusTarget, onFocusConsumed }: Props) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 3, 28], fov: 60, near: 0.1, far: 20000 }}
    >
      <GalaxyScene
        highlightedId={highlightedId}
        onHoverChange={onHoverChange}
        onWarpChange={onWarpChange}
      />
      <FocusController target={focusTarget} onDone={onFocusConsumed} />
      <Suspense fallback={null}>
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.9}
            luminanceSmoothing={0.4}
            intensity={1.8}
            mipmapBlur
          />
          <ChromaticAberration
            offset={new Vector2(0.0004, 0.0004)}
            blendFunction={BlendFunction.NORMAL}
          />
          <Noise
            opacity={0.03}
            blendFunction={BlendFunction.OVERLAY}
          />
          <Vignette
            offset={0.3}
            darkness={0.7}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
