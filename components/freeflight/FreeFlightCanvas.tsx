'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import FreeFlightScene from './FreeFlightScene'
import type { ShipState } from './types'

interface Props {
  onShipState: (ship: React.MutableRefObject<ShipState>) => void
  onDockPromptChange?: (name: string | null) => void
  onFirstPersonChange?: (fp: boolean) => void
}

export default function FreeFlightCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [60, 15, 80], fov: 72, near: 0.1, far: 3000 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100vw', height: '100vh', background: '#02030a' }}
    >
      <Suspense fallback={null}>
        <FreeFlightScene {...props} />
      </Suspense>
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur radius={0.7} />
        <Vignette darkness={0.55} offset={0.25} />
      </EffectComposer>
    </Canvas>
  )
}
