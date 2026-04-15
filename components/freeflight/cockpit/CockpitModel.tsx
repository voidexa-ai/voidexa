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

// Map each cockpit frame to its matching interior .glb on Supabase. Equipments +
// screens are authored for the cockpit01 set only; other frames get interior only.
const INTERIOR_FOR_FRAME: Record<string, { interior: string; extras: string[] }> = {
  [MODEL_URLS.hirez_cockpit01]: {
    interior: MODEL_URLS.hirez_cockpit01_interior,
    extras: [MODEL_URLS.hirez_equipments, MODEL_URLS.hirez_screens],
  },
  [MODEL_URLS.hirez_cockpit02]: { interior: MODEL_URLS.hirez_cockpit02_interior, extras: [] },
  [MODEL_URLS.hirez_cockpit03]: { interior: MODEL_URLS.hirez_cockpit03_interior, extras: [] },
  [MODEL_URLS.hirez_cockpit04]: { interior: MODEL_URLS.hirez_cockpit04_interior, extras: [] },
  [MODEL_URLS.hirez_cockpit05]: { interior: MODEL_URLS.hirez_cockpit05_interior, extras: [] },
}

// Interior pieces share the frame's scale but sit lower + further back so the
// dashboard drops below eye level and the front canopy stays clear for the
// player to see through.
const INTERIOR_OFFSET = { y: -0.55, z: 0.9 }

function CockpitPiece({ url, scale, center }: { url: string; scale: number; center: THREE.Vector3 }) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  return (
    <group
      position={[
        -center.x * scale,
        -center.y * scale + INTERIOR_OFFSET.y,
        -center.z * scale + INTERIOR_OFFSET.z,
      ]}
    >
      <primitive object={scene} scale={scale} />
    </group>
  )
}

export default function CockpitModel({ visible, url }: Props) {
  const { camera } = useThree()
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  const groupRef = useRef<THREE.Group>(null)

  // Fit frame so canopy edges sit at the screen corners, not directly in front.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    // Larger target so the frame reads as surrounding the viewport rather than
    // blocking it — camera sits further "inside" the cockpit.
    const targetMax = 3.6
    return { scale: targetMax / maxDim, center }
  }, [scene])

  const interiorSpec = INTERIOR_FOR_FRAME[url]

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.visible = visible
    if (!visible) return
    groupRef.current.position.copy(camera.position)
    groupRef.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={groupRef} renderOrder={999}>
      {/* Frame — shifted down + back so the camera sits inside the canopy,
          looking out through the windshield instead of at the dashboard. */}
      <group
        position={[
          -fit.center.x * fit.scale,
          -fit.center.y * fit.scale - 0.4,
          -fit.center.z * fit.scale + 0.7,
        ]}
      >
        <primitive object={scene} scale={fit.scale} />
      </group>
      {interiorSpec && (
        <>
          <CockpitPiece url={interiorSpec.interior} scale={fit.scale} center={fit.center} />
          {interiorSpec.extras.map(u => (
            <CockpitPiece key={u} url={u} scale={fit.scale} center={fit.center} />
          ))}
        </>
      )}
    </group>
  )
}

useGLTF.preload(MODEL_URLS.hirez_cockpit01_interior)
useGLTF.preload(MODEL_URLS.hirez_equipments)
useGLTF.preload(MODEL_URLS.hirez_screens)
