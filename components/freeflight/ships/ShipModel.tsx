'use client'

import { forwardRef, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { ShipState } from '../types'

interface Props {
  visible: boolean
  ship: React.MutableRefObject<ShipState>
  url: string
  scale?: number
}

const ShipModel = forwardRef<THREE.Group, Props>(function ShipModel(
  { visible, ship, url, scale = 1.2 },
  ref,
) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  const engineLight = useRef<THREE.PointLight>(null)
  const engineMesh = useRef<THREE.Mesh>(null)
  const trailMesh = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const lodScale = useRef(1)

  useFrame(() => {
    if (ref && typeof ref !== 'function' && ref.current) {
      const dist = camera.position.distanceTo(ref.current.position)
      if (dist > 500) lodScale.current = 0.3
      else if (dist > 100) lodScale.current = 0.7
      else lodScale.current = 1
    }
    const s = ship.current
    const speedN = Math.min(1, s.speed / 160)
    const boost = s.boost ? 1 : 0
    if (engineLight.current) {
      engineLight.current.intensity = 2 + speedN * 4 + boost * 6
    }
    if (engineMesh.current) {
      const mat = engineMesh.current.material as THREE.MeshBasicMaterial
      const hot = s.boost ? new THREE.Color('#ffaa00') : new THREE.Color('#00ffff')
      mat.color.copy(hot)
    }
    if (trailMesh.current) {
      const len = 1 + speedN * 6 + boost * 8
      trailMesh.current.scale.set(1 + boost * 0.8, 1 + boost * 0.8, len)
      trailMesh.current.position.z = 1.5 + len / 2
      const mat = trailMesh.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.35 + speedN * 0.35 + boost * 0.25
      mat.color.set(s.boost ? '#ffaa55' : '#00d4ff')
    }
  })

  return (
    <group ref={ref} visible={visible}>
      <group rotation={[0, Math.PI, 0]}>
        <primitive object={scene} scale={scale} />
      </group>
      <pointLight
        ref={engineLight}
        position={[0, 0, 2]}
        color="#00d4ff"
        intensity={3}
        distance={14}
      />
      <mesh ref={engineMesh} position={[0, 0, 2]}>
        <sphereGeometry args={[0.45, 12, 12]} />
        <meshBasicMaterial color="#00ffff" toneMapped={false} />
      </mesh>
      <mesh ref={trailMesh} position={[0, 0, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.35, 1, 12, 1, true]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.4}
          toneMapped={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
})

export default ShipModel
