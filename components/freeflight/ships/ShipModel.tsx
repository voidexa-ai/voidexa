'use client'

import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { ShipState } from '../types'

interface Props {
  visible: boolean
  ship: React.MutableRefObject<ShipState>
  url: string
  scale?: number
  /** Fires once after the ship GLTF loads with the max world-space bbox extent. */
  onSize?: (size: number) => void
}

const ShipModel = forwardRef<THREE.Group, Props>(function ShipModel(
  { visible, ship, url, scale = 1.2, onSize },
  ref,
) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  const engineLight = useRef<THREE.PointLight>(null)
  const engineMesh = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const measuredSize = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    return Math.max(size.x, size.y, size.z) * scale
  }, [scene, scale])

  useEffect(() => {
    onSize?.(measuredSize)
  }, [measuredSize, onSize])

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
    // Boost trail is now a sibling Points system rendered in world space.
    void boost
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
    </group>
  )
})

export default ShipModel
