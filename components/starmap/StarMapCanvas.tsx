'use client'

import { Canvas } from '@react-three/fiber'
import StarMapScene from './StarMapScene'

export default function StarMapCanvas() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 2, 13], fov: 58 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <StarMapScene />
    </Canvas>
  )
}
