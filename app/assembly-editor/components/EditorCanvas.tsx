'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Grid, useGLTF, Outlines } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '../hooks/useEditorStore'
import { GizmoWrapper } from './GizmoWrapper'
import { FlyControls, type FlyControlsHandle } from './FlyControls'
import type { PlacedModel } from '../lib/editorTypes'

function WireframeBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.5} />
    </mesh>
  )
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    // Recenter geometry so visual center sits at [0,0,0].
    // Source GLTFs often have baked-in offsets — without this, all placed
    // models at position [0,0,0] would spread apart.
    const box = new THREE.Box3().setFromObject(c)
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3())
      c.position.sub(center)
    }
    return c
  }, [scene])
  return <primitive object={cloned} />
}

function ModelInScene({
  model,
  isSelected,
  orbitRef,
}: {
  model: PlacedModel
  isSelected: boolean
  orbitRef: React.MutableRefObject<FlyControlsHandle | null>
}) {
  const selectModel = useEditorStore(s => s.selectModel)
  const groupRef = useRef<THREE.Group>(null)
  const [ready, setReady] = useState(false)

  // Sync from store to group (when not dragging gizmo — gizmo writes directly)
  useEffect(() => {
    const g = groupRef.current
    if (!g) return
    g.position.set(...model.position)
    g.rotation.set(...model.rotation)
    g.scale.set(...model.scale)
  }, [model.position, model.rotation, model.scale])

  useEffect(() => { setReady(true) }, [])

  if (!model.visible) return null

  return (
    <>
      <group
        ref={groupRef}
        userData={{ modelId: model.id }}
        onClick={(e) => { e.stopPropagation(); selectModel(model.id) }}
        onPointerDown={(e) => { e.stopPropagation(); selectModel(model.id) }}
      >
        <Suspense fallback={<WireframeBox />}>
          <GLTFModel url={model.modelUrl} />
          {isSelected && <Outlines thickness={3} color="#00d4ff" />}
        </Suspense>
      </group>
      {isSelected && ready && groupRef.current && (
        <GizmoWrapper
          orbitRef={orbitRef}
          targetRef={groupRef as React.MutableRefObject<THREE.Object3D | null>}
          modelId={model.id}
        />
      )}
    </>
  )
}

const PRESETS: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  top:   { position: [0, 10, 0.001], target: [0, 0, 0] },
  front: { position: [0, 1, 8],      target: [0, 0, 0] },
  side:  { position: [8, 1, 0],      target: [0, 0, 0] },
  pilot: { position: [0, 0.5, 0],    target: [0, 0.5, 5] },
}

function ClickSelector() {
  const { camera, gl, scene } = useThree()
  const selectModel = useEditorStore(s => s.selectModel)

  useEffect(() => {
    const dom = gl.domElement
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const down = { x: 0, y: 0 }

    const onDown = (e: PointerEvent) => {
      down.x = e.clientX; down.y = e.clientY
    }

    const onUp = (e: PointerEvent) => {
      // Ignore if it was a drag (fly-look or gizmo drag).
      const dx = Math.abs(e.clientX - down.x)
      const dy = Math.abs(e.clientY - down.y)
      if (dx > 4 || dy > 4) return
      if (e.button !== 0) return

      const rect = dom.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(scene.children, true)
      for (const hit of hits) {
        // Walk up to find a group tagged with modelId
        let obj: THREE.Object3D | null = hit.object
        while (obj) {
          const id = obj.userData?.modelId as string | undefined
          if (id) {
            selectModel(id)
            return
          }
          obj = obj.parent
        }
      }
      // Clicked empty space → deselect
      selectModel(null)
    }

    dom.addEventListener('pointerdown', onDown)
    dom.addEventListener('pointerup', onUp)
    return () => {
      dom.removeEventListener('pointerdown', onDown)
      dom.removeEventListener('pointerup', onUp)
    }
  }, [camera, gl, scene, selectModel])

  return null
}

function CameraController({ orbitRef }: { orbitRef: React.MutableRefObject<FlyControlsHandle | null> }) {
  const preset = useEditorStore(s => s.cameraPreset)
  const tick = useEditorStore(s => s.presetTick)
  const { camera } = useThree()
  useEffect(() => {
    if (!preset) return
    const p = PRESETS[preset]
    camera.position.set(...p.position)
    const target = new THREE.Vector3(...p.target)
    camera.lookAt(target)
    if (orbitRef.current) {
      orbitRef.current.target.copy(target)
      orbitRef.current.update()
    }
  }, [preset, tick, camera, orbitRef])
  return null
}

export function EditorCanvas() {
  const placedModels = useEditorStore(s => s.placedModels)
  const selectedId = useEditorStore(s => s.selectedId)
  const selectModel = useEditorStore(s => s.selectModel)
  const orbitRef = useRef<FlyControlsHandle | null>(null)

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [5, 4, 7], fov: 50, near: 0.1, far: 1000 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ background: 'linear-gradient(180deg, #0d0a1f 0%, #060412 100%)' }}
        onPointerMissed={() => selectModel(null)}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 4, -3]} intensity={0.3} color="#a855f7" />

        <Grid
          infiniteGrid
          cellSize={0.5}
          sectionSize={5}
          cellColor="#2a2147"
          sectionColor="#4a3f7a"
          fadeDistance={40}
          fadeStrength={1.2}
          followCamera={false}
        />

        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>

        {placedModels.map(m => (
          <ModelInScene
            key={m.id}
            model={m}
            isSelected={m.id === selectedId}
            orbitRef={orbitRef}
          />
        ))}

        <FlyControls controlRef={orbitRef} />

        <ClickSelector />
        <CameraController orbitRef={orbitRef} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          fontSize: 13,
          color: '#a9b4d0',
          background: 'rgba(6, 4, 18, 0.78)',
          border: '1px solid rgba(0, 212, 255, 0.25)',
          padding: '6px 12px',
          borderRadius: 6,
          letterSpacing: 0.4,
          fontFamily: 'Inter, system-ui, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        WASD to move · Q/E up·down · Right-click + drag to look · Scroll = speed
      </div>
    </>
  )
}
