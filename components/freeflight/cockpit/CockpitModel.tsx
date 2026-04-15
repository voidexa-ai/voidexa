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

// Map each cockpit frame to its matching interior .glb on Supabase.
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

// Camera sits at world-origin of the cockpit group looking down -Z (forward).
// These offsets shift the whole assembly so the pilot's viewpoint lands at
// the front of the canopy — not buried inside the dashboard.
//
// The Y rotation (π) flips GLTFs that are authored +Z-forward into -Z-forward
// space, which aligns the dashboard with the camera's forward direction. Then
// the positive Z offset drops it behind / below the camera, NOT in front.
const FRAME_POS: [number, number, number] = [0, -0.9, 1.6]
const INTERIOR_POS: [number, number, number] = [0, -1.1, 2.0]
const ASSEMBLY_ROTATION: [number, number, number] = [0, Math.PI, 0]
const TARGET_MAX = 4.8 // larger frame → canopy edges sit at screen corners

function CockpitPiece({
  url,
  scale,
  center,
  offset,
}: {
  url: string
  scale: number
  center: THREE.Vector3
  offset: [number, number, number]
}) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  return (
    <group rotation={ASSEMBLY_ROTATION}>
      <group
        position={[
          -center.x * scale + offset[0],
          -center.y * scale + offset[1],
          -center.z * scale + offset[2],
        ]}
      >
        <primitive object={scene} scale={scale} />
      </group>
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
    return { scale: TARGET_MAX / maxDim, center }
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
      <group rotation={ASSEMBLY_ROTATION}>
        <group
          position={[
            -fit.center.x * fit.scale + FRAME_POS[0],
            -fit.center.y * fit.scale + FRAME_POS[1],
            -fit.center.z * fit.scale + FRAME_POS[2],
          ]}
        >
          <primitive object={scene} scale={fit.scale} />
        </group>
      </group>
      {interiorSpec && (
        <>
          <CockpitPiece
            url={interiorSpec.interior}
            scale={fit.scale}
            center={fit.center}
            offset={INTERIOR_POS}
          />
          {interiorSpec.extras.map(u => (
            <CockpitPiece
              key={u}
              url={u}
              scale={fit.scale}
              center={fit.center}
              offset={INTERIOR_POS}
            />
          ))}
        </>
      )}
    </group>
  )
}

useGLTF.preload(MODEL_URLS.hirez_cockpit01_interior)
useGLTF.preload(MODEL_URLS.hirez_equipments)
useGLTF.preload(MODEL_URLS.hirez_screens)
