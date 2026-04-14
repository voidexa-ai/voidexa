'use client'

import { forwardRef, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  visible: boolean
  url?: string
}

const DEFAULT_URL = '/models/glb-ready/qs_bob.glb'

const ShipModel = forwardRef<THREE.Group, Props>(function ShipModel(
  { visible, url = DEFAULT_URL },
  ref,
) {
  const gltf = useGLTF(url)
  const engineRef = useRef<THREE.PointLight>(null)
  const { camera } = useThree()

  const lodScale = useRef(1)

  useFrame(() => {
    if (!ref || typeof ref === 'function' || !ref.current) return
    const dist = camera.position.distanceTo(ref.current.position)
    if (dist > 500) lodScale.current = 0.3
    else if (dist > 100) lodScale.current = 0.7
    else lodScale.current = 1
  })

  return (
    <group ref={ref} visible={visible}>
      <primitive object={gltf.scene.clone()} scale={1.2} />
      {/* Engine glow */}
      <pointLight
        ref={engineRef}
        position={[0, 0, 2]}
        color="#00d4ff"
        intensity={3}
        distance={10}
      />
      <mesh position={[0, 0, 2]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshBasicMaterial color="#00ffff" toneMapped={false} />
      </mesh>
    </group>
  )
})

useGLTF.preload(DEFAULT_URL)

export default ShipModel
