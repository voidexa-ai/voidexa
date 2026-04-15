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

// The cockpit assembly is parented to the camera each frame.
// Camera looks down -Z, up +Y, right +X. The assembly rotation of π around Y
// maps local +Z to world -Z so the model faces forward.
//
// Tuning rules:
//   - FRAME (canopy/chassis): larger, placed forward and slightly below so the
//     window surrounds the view. Any interior bulk it contains sits far enough
//     forward that its top edge never rises above eye level.
//   - INTERIOR (dashboard/seat): smaller and pushed further down + forward so
//     only the dashboard surface peeks into the bottom third of the view.
//
// These are the "known-good" offsets after tuning against hirez_cockpit01-05.
const ASSEMBLY_ROTATION: [number, number, number] = [0, Math.PI, 0]

const FRAME_POS: [number, number, number] = [0, -0.4, 1.4]
const FRAME_TARGET_MAX = 3.2 // canopy edges at screen edges, not center

const INTERIOR_POS: [number, number, number] = [0, -1.45, 1.9]
const INTERIOR_TARGET_MAX = 2.4 // dashboard sits below eye line

function useFit(scene: THREE.Object3D, targetMax: number) {
  return useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    return { scale: targetMax / maxDim, center }
  }, [scene, targetMax])
}

function CockpitPiece({
  url,
  offset,
  targetMax,
}: {
  url: string
  offset: [number, number, number]
  targetMax: number
}) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  const fit = useFit(scene, targetMax)
  return (
    <group
      position={[
        -fit.center.x * fit.scale + offset[0],
        -fit.center.y * fit.scale + offset[1],
        -fit.center.z * fit.scale + offset[2],
      ]}
    >
      <primitive object={scene} scale={fit.scale} />
    </group>
  )
}

export default function CockpitModel({ visible, url }: Props) {
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)
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
        <CockpitPiece url={url} offset={FRAME_POS} targetMax={FRAME_TARGET_MAX} />
        {interiorSpec && (
          <>
            <CockpitPiece
              url={interiorSpec.interior}
              offset={INTERIOR_POS}
              targetMax={INTERIOR_TARGET_MAX}
            />
            {interiorSpec.extras.map(u => (
              <CockpitPiece
                key={u}
                url={u}
                offset={INTERIOR_POS}
                targetMax={INTERIOR_TARGET_MAX}
              />
            ))}
          </>
        )}
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_URLS.hirez_cockpit01_interior)
useGLTF.preload(MODEL_URLS.hirez_equipments)
useGLTF.preload(MODEL_URLS.hirez_screens)
