'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  visible: boolean
  url?: string
}

const DEFAULT_URL = '/models/glb-ready/hirez_cockpit01.glb'

export default function CockpitModel({ visible, url = DEFAULT_URL }: Props) {
  const { camera } = useThree()
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  const groupRef = useRef<THREE.Group>(null)

  // Compute bounds once so we can auto-scale + position the cockpit sensibly.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    // Target depth (Z extent) ~ 2.4 units so the canopy surrounds a small camera near-plane
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const targetMax = 2.4
    const scale = targetMax / maxDim
    return { scale, center }
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.visible = visible
    if (!visible) return
    groupRef.current.position.copy(camera.position)
    groupRef.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={groupRef} renderOrder={999}>
      {/* Inner transform: center the model around origin + apply scale.
          Nudge the camera viewpoint slightly forward inside the canopy so the player
          sees out through the glass rather than through the seat. */}
      <group
        position={[-fit.center.x * fit.scale, -fit.center.y * fit.scale, -fit.center.z * fit.scale + 0.2]}
      >
        <primitive object={scene} scale={fit.scale} />
      </group>
    </group>
  )
}

useGLTF.preload(DEFAULT_URL)
