'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, useGLTF, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

interface Props {
  url: string
  scale?: number
  orbit?: boolean
  rotateSpeed?: number
  accent?: string
}

function AutoFitModel({ url, scale = 1, rotateSpeed = 0.4 }: { url: string; scale?: number; rotateSpeed?: number }) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  const groupRef = useRef<THREE.Group>(null)

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const targetMax = 4.5
    return {
      scale: (targetMax / maxDim) * scale,
      center,
    }
  }, [scene, scale])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * rotateSpeed
  })

  return (
    <group ref={groupRef}>
      <group position={[-fit.center.x * fit.scale, -fit.center.y * fit.scale, -fit.center.z * fit.scale]}>
        <primitive object={scene} scale={fit.scale} />
      </group>
    </group>
  )
}

export default function ShopItemPreviewCanvas({
  url,
  scale = 1,
  orbit = false,
  rotateSpeed = 0.4,
  accent = '#00d4ff',
}: Props) {
  return (
    <Canvas
      camera={{ position: [4, 2, 6], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#050813']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, 2, -3]} intensity={0.6} color={accent} />
      <pointLight position={[0, -4, 2]} intensity={0.7} color="#a866ff" />

      <Stars radius={60} depth={40} count={900} factor={3} saturation={0} fade speed={0.3} />

      <Suspense fallback={null}>
        <AutoFitModel url={url} scale={scale} rotateSpeed={rotateSpeed} />
      </Suspense>

      {orbit && (
        <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={14} target={[0, 0, 0]} />
      )}

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.9} intensity={0.9} mipmapBlur radius={0.6} />
      </EffectComposer>
    </Canvas>
  )
}
