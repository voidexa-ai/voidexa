'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import BattleScene from './BattleScene'
import type { BattleEffect } from '@/lib/game/battle/types'
import * as THREE from 'three'

interface Props {
  playerShipUrl: string
  enemyShipUrl: string
  activeEffect: BattleEffect | null
  playerDamaged: boolean
  enemyDamaged: boolean
  playerBlocking: boolean
  enemyBlocking: boolean
}

// AFS-6g — far plane bumped from 800 to 4000 so SpaceSkybox sphere
// (radius 1500) renders. minDistance/maxDistance keep the existing
// camera at z=16 inside a narrow zoom envelope (10-24); azimuth limited
// to ±20° so right-click rotation can't fight CardHand at the bottom.
// AFS-6g-skybox-fix — gl.alpha=false forces opaque framebuffer; without
// it WebGL clears to alpha 0 each frame and post-processing chain
// (Bloom/CA/Vignette) drops scene.background's alpha contribution,
// making the canvas read as transparent (avg alpha 0.5/255 in live audit).
export default function BattleCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 16], fov: 55, near: 0.1, far: 4000 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.75]}
      gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
    >
      <BattleScene {...props} />
      <OrbitControls
        enableZoom={true}
        enableRotate={true}
        enablePan={false}
        minDistance={10}
        maxDistance={24}
        minAzimuthAngle={-Math.PI / 9}
        maxAzimuthAngle={Math.PI / 9}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
        zoomSpeed={0.6}
        rotateSpeed={0.4}
      />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.85} luminanceThreshold={0.25} mipmapBlur />
        <ChromaticAberration offset={new THREE.Vector2(0.0007, 0.0007)} radialModulation={false} modulationOffset={0} />
        <Vignette eskil={false} offset={0.22} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  )
}
