'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MODEL_URLS } from '@/lib/config/modelUrls'

interface Props {
  visible: boolean
  url: string
}

// Inner piece — auto-centers around the main frame's bounding box and shares its scale.
function CockpitPiece({ url, scale, center }: { url: string; scale: number; center: THREE.Vector3 }) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  return (
    <group position={[-center.x * scale, -center.y * scale, -center.z * scale + 0.2]}>
      <primitive object={scene} scale={scale} />
    </group>
  )
}

export default function CockpitModel({ visible, url }: Props) {
  const { camera } = useThree()
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
    const targetMax = 2.4
    return { scale: targetMax / maxDim, center }
  }, [scene])

  // Only the cockpit01 frame has matched interior/equipments/screens assets.
  const showInterior = url === MODEL_URLS.hirez_cockpit01

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.visible = visible
    if (!visible) return
    groupRef.current.position.copy(camera.position)
    groupRef.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={groupRef} renderOrder={999}>
      <group
        position={[-fit.center.x * fit.scale, -fit.center.y * fit.scale, -fit.center.z * fit.scale + 0.2]}
      >
        <primitive object={scene} scale={fit.scale} />
      </group>
      {showInterior && (
        <>
          <CockpitPiece url={MODEL_URLS.hirez_cockpit01_interior} scale={fit.scale} center={fit.center} />
          <CockpitPiece url={MODEL_URLS.hirez_equipments} scale={fit.scale} center={fit.center} />
          <CockpitPiece url={MODEL_URLS.hirez_screens} scale={fit.scale} center={fit.center} />
        </>
      )}
    </group>
  )
}

useGLTF.preload(MODEL_URLS.hirez_cockpit01_interior)
useGLTF.preload(MODEL_URLS.hirez_equipments)
useGLTF.preload(MODEL_URLS.hirez_screens)
