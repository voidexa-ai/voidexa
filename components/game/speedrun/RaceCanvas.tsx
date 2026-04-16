'use client'

import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import RaceScene from './RaceScene'
import type { TrackDef } from '@/lib/game/speedrun/tracks'
import type { PowerUpInventory } from './PowerUpSystem'
import type { GateStatus } from './GateRing'
import type { RaceStatus } from './RaceScene'

interface Props {
  track: TrackDef
  shipUrl: string
  shipScale: number
  inventory: PowerUpInventory
  onInventoryChange: (inv: PowerUpInventory) => void
  onRaceStateChange: (state: {
    status: RaceStatus
    elapsedMs: number
    clearedGates: number
    missedGates: number
    gateStatuses: GateStatus[]
  }) => void
}

export default function RaceCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 4, 14], fov: 75, near: 0.1, far: 5000 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05030f']} />
      <fog attach="fog" args={['#05030f', 400, 1400]} />
      <RaceScene {...props} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.9} luminanceThreshold={0.25} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
