'use client'

import { Canvas } from '@react-three/fiber'
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

export default function BattleCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 16], fov: 55, near: 0.1, far: 800 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <BattleScene {...props} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.85} luminanceThreshold={0.25} mipmapBlur />
        <ChromaticAberration offset={new THREE.Vector2(0.0007, 0.0007)} radialModulation={false} modulationOffset={0} />
        <Vignette eskil={false} offset={0.22} darkness={0.78} />
      </EffectComposer>
    </Canvas>
  )
}
