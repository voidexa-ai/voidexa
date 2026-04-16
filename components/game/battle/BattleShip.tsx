'use client'

import { forwardRef, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  url: string
  position: [number, number, number]
  rotationY: number
  scale?: number
  damaged?: boolean
}

const BattleShip = forwardRef<THREE.Group, Props>(function BattleShip(
  { url, position, rotationY, scale = 1.3, damaged = false },
  ref,
) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  const localRef = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const g = (ref && typeof ref !== 'function' && ref.current) || localRef.current
    if (!g) return
    // Idle bob + slight sway for a "breathing" feel.
    const t = performance.now() * 0.001
    g.position.y = position[1] + Math.sin(t * 0.9) * 0.08
    g.rotation.z = Math.sin(t * 0.4) * 0.03
    // Shake when damaged flag is set — the parent toggles this for ~420ms.
    if (damaged) {
      g.position.x = position[0] + (Math.random() - 0.5) * 0.25
    } else {
      g.position.x += (position[0] - g.position.x) * Math.min(1, dt * 6)
    }
  })

  return (
    <group ref={ref ?? localRef} position={position} rotation={[0, rotationY, 0]}>
      <primitive object={scene} scale={scale} />
      <pointLight position={[0, 0, 2]} color="#00d4ff" intensity={2} distance={8} />
    </group>
  )
})

export default BattleShip
