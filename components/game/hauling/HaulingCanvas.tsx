'use client'

import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import HaulingScene from './HaulingScene'
import type { FlightPhase } from './HaulingScene'
import type { Route } from '@/lib/game/hauling/contracts'
import * as THREE from 'three'

interface Props {
  route: Route
  shipUrl: string
  shipScale: number
  speedMultiplier: number
  paused: boolean
  phase: FlightPhase
  onCheckpointReached: (index: number, total: number) => void
  onDelivered: () => void
  onShipPosition: (pos: THREE.Vector3) => void
}

export default function HaulingCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 4, 14], fov: 75, near: 0.1, far: 5000 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05030f']} />
      <fog attach="fog" args={['#05030f', 400, 1400]} />
      <HaulingScene {...props} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.8} luminanceThreshold={0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
