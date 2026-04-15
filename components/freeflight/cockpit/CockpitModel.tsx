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

// All 5 Hi-Rez cockpits share the same equipments + screens meshes — only the
// frame and interior change per cockpit. The four pieces were authored as a
// matched set: their local origins are identical, so they nest perfectly when
// rendered at the same transform.
const SHARED_EXTRAS = [MODEL_URLS.hirez_equipments, MODEL_URLS.hirez_screens]

const INTERIOR_FOR_FRAME: Record<string, { interior: string; extras: string[] }> = {
  [MODEL_URLS.hirez_cockpit01]: { interior: MODEL_URLS.hirez_cockpit01_interior, extras: SHARED_EXTRAS },
  [MODEL_URLS.hirez_cockpit02]: { interior: MODEL_URLS.hirez_cockpit02_interior, extras: SHARED_EXTRAS },
  [MODEL_URLS.hirez_cockpit03]: { interior: MODEL_URLS.hirez_cockpit03_interior, extras: SHARED_EXTRAS },
  [MODEL_URLS.hirez_cockpit04]: { interior: MODEL_URLS.hirez_cockpit04_interior, extras: SHARED_EXTRAS },
  [MODEL_URLS.hirez_cockpit05]: { interior: MODEL_URLS.hirez_cockpit05_interior, extras: SHARED_EXTRAS },
}

// The cockpit assembly is parented to the camera each frame. Camera looks
// down -Z, up +Y, right +X. ASSEMBLY_ROTATION (π around Y) maps local +Z to
// world -Z so any positive-Z offsets end up forward of the pilot.
const ASSEMBLY_ROTATION: [number, number, number] = [0, Math.PI, 0]

// Frame: centered on its own bbox, placed forward and slightly below so the
// canopy window surrounds the view. Rendered semi-transparent so struts don't
// block the pilot's forward sightline.
const FRAME_POS: [number, number, number] = [0, -0.5, 1.4]
const FRAME_TARGET_MAX = 3.4
const FRAME_OPACITY = 0.45

// Interior bundle (interior + equipments + screens): rendered under a single
// parent with one shared transform. NO per-piece bbox centering — that would
// pull the matched meshes apart. One bbox measurement is taken from the
// interior .glb and the resulting scale is applied to the whole bundle so the
// seat/dashboard/screens stay aligned as Hi-Rez authored them.
//
// Parent position drops the seat base below eye level and pushes the
// dashboard forward so the pilot's viewpoint lands at the headrest, looking
// forward through the main canopy.
const INTERIOR_PARENT_POS: [number, number, number] = [0, -1.35, 1.7]
const INTERIOR_TARGET_MAX = 2.8

function SceneClone({ url, opacity }: { url: string; opacity?: number }) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    if (opacity !== undefined) {
      cloned.traverse(obj => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh || !mesh.material) return
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach(src => {
          // Clone the material so opacity tweaks don't leak into the shared
          // GLTF cache and affect other instances.
          const cloneMat = src.clone() as THREE.Material & { opacity: number; transparent: boolean; depthWrite: boolean }
          cloneMat.transparent = true
          cloneMat.opacity = opacity
          cloneMat.depthWrite = false
          if (Array.isArray(mesh.material)) {
            const arr = mesh.material as THREE.Material[]
            const idx = arr.indexOf(src)
            if (idx >= 0) arr[idx] = cloneMat
          } else {
            mesh.material = cloneMat
          }
        })
      })
    }
    return cloned
  }, [gltf.scene, opacity])
  return <primitive object={scene} />
}

function FramePiece({ url }: { url: string }) {
  const gltf = useGLTF(url)
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    return { scale: FRAME_TARGET_MAX / maxDim, center }
  }, [gltf.scene])
  return (
    <group
      position={[
        -fit.center.x * fit.scale + FRAME_POS[0],
        -fit.center.y * fit.scale + FRAME_POS[1],
        -fit.center.z * fit.scale + FRAME_POS[2],
      ]}
    >
      <group scale={fit.scale}>
        <SceneClone url={url} opacity={FRAME_OPACITY} />
      </group>
    </group>
  )
}

function InteriorBundle({ interiorUrl, extras }: { interiorUrl: string; extras: string[] }) {
  const gltf = useGLTF(interiorUrl)
  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    return INTERIOR_TARGET_MAX / maxDim
  }, [gltf.scene])

  return (
    <group position={INTERIOR_PARENT_POS} scale={scale}>
      <SceneClone url={interiorUrl} />
      {extras.map(u => (
        <SceneClone key={u} url={u} />
      ))}
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
        <FramePiece url={url} />
        {interiorSpec && (
          <InteriorBundle interiorUrl={interiorSpec.interior} extras={interiorSpec.extras} />
        )}
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_URLS.hirez_cockpit01_interior)
useGLTF.preload(MODEL_URLS.hirez_equipments)
useGLTF.preload(MODEL_URLS.hirez_screens)
