'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface PreviewProps {
  url: string
  name: string
  x: number
  y: number
}

// Fits the camera to the loaded model and starts it auto-rotating.
// We only render one model at a time, in a tiny off-DOM canvas, so the cost
// is bounded.
function AutoRotate({ url }: { url: string }) {
  const { scene, camera } = useThree()
  const { scene: gltfScene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  const cloned = useMemo(() => {
    const c = gltfScene.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3())
      c.position.sub(center)
    }
    return c
  }, [gltfScene])

  // After the model mounts, size + point the camera based on its bounds.
  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    const box = new THREE.Box3().setFromObject(group)
    if (box.isEmpty()) return
    const size = box.getSize(new THREE.Vector3())
    const radius = Math.max(size.x, size.y, size.z) || 1
    const distance = radius * 2.2
    camera.position.set(distance * 0.8, distance * 0.5, distance)
    camera.near = Math.max(0.01, radius * 0.05)
    camera.far = radius * 20
    camera.lookAt(0, 0, 0)
    ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
  }, [camera, cloned])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  )
}

export function ModelPreview({ url, name, x, y }: PreviewProps) {
  // Clamp position so the popup never leaves the viewport.
  const PREVIEW = 200
  const PADDING = 12
  let left = x + 22
  let top = y + 12
  if (typeof window !== 'undefined') {
    if (left + PREVIEW + PADDING > window.innerWidth) left = x - PREVIEW - 22
    if (top + PREVIEW + 40 > window.innerHeight) top = Math.max(PADDING, y - PREVIEW - 40)
  }

  const content = (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        width: PREVIEW,
        height: PREVIEW + 26,
        zIndex: 500,
        pointerEvents: 'none',
        background: 'rgba(6, 4, 18, 0.96)',
        border: '1px solid rgba(0, 212, 255, 0.45)',
        borderRadius: 8,
        boxShadow: '0 12px 32px rgba(0,0,0,0.55)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ width: PREVIEW, height: PREVIEW, background: 'linear-gradient(180deg, #0d0a1f 0%, #060412 100%)' }}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 3], fov: 40 }}
          gl={{ antialias: true, preserveDrawingBuffer: false }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={0.9} />
          <directionalLight position={[-3, 2, -4]} intensity={0.35} color="#a855f7" />
          <Suspense fallback={null}>
            <AutoRotate url={url} />
          </Suspense>
        </Canvas>
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#e5e5f0',
          padding: '4px 8px',
          textAlign: 'center',
          letterSpacing: 0.4,
          borderTop: '1px solid rgba(168, 85, 247, 0.22)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {name}
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
