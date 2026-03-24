'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import StarMapScene from './StarMapScene'

export default function StarMapCanvas() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1, 12], fov: 60 }}
    >
      <StarMapScene />
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
