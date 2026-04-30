'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import StarMapScene from './StarMapScene'
import HoverHUD from './HoverHUD'
import type { StarNode } from './nodes'

export default function StarMapCanvas() {
  // FIX-15 hover state owner — drilled down to NodeMesh via StarMapScene,
  // surfaced up to HoverHUD as a sibling DOM overlay.
  const [hoveredNode, setHoveredNode] = useState<StarNode | null>(null)
  const [hoveredScreenPos, setHoveredScreenPos] = useState<{ x: number; y: number } | null>(null)
  const [vp, setVp] = useState({ w: 1, h: 1 })

  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 5, -90], fov: 60, near: 0.1, far: 20000 }}
      >
        <StarMapScene
          hoveredNodeId={hoveredNode?.id ?? null}
          onHoverStart={(node, pos) => {
            setHoveredNode(node)
            setHoveredScreenPos(pos)
          }}
          onHoverEnd={() => {
            setHoveredNode(null)
            setHoveredScreenPos(null)
          }}
          onHoverUpdate={(pos) => setHoveredScreenPos(pos)}
        />
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
      <HoverHUD
        node={hoveredNode}
        screenPos={hoveredScreenPos}
        viewportWidth={vp.w}
        viewportHeight={vp.h}
      />
    </div>
  )
}
