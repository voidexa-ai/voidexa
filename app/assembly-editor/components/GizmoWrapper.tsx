'use client'

import { useEffect, useRef } from 'react'
import { TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '../hooks/useEditorStore'

interface Props {
  orbitRef: React.MutableRefObject<any>
  targetRef: React.MutableRefObject<THREE.Object3D | null>
  modelId: string
}

export function GizmoWrapper({ orbitRef, targetRef, modelId }: Props) {
  const transformMode = useEditorStore(s => s.transformMode)
  const snapEnabled = useEditorStore(s => s.snapEnabled)
  const snapValue = useEditorStore(s => s.snapValue)
  const updateTransform = useEditorStore(s => s.updateTransform)
  const commitHistory = useEditorStore(s => s.commitHistory)
  const controlsRef = useRef<any>(null)
  const wasDragging = useRef(false)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const onDrag = (e: any) => {
      if (orbitRef.current) orbitRef.current.enabled = !e.value
      if (e.value) {
        wasDragging.current = true
      } else if (wasDragging.current) {
        wasDragging.current = false
        commitHistory()
      }
    }
    const onChange = () => {
      const obj = targetRef.current
      if (!obj) return
      updateTransform(modelId, {
        position: [obj.position.x, obj.position.y, obj.position.z],
        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
        scale: [obj.scale.x, obj.scale.y, obj.scale.z],
      })
    }
    controls.addEventListener('dragging-changed', onDrag)
    controls.addEventListener('objectChange', onChange)
    return () => {
      controls.removeEventListener('dragging-changed', onDrag)
      controls.removeEventListener('objectChange', onChange)
    }
  }, [orbitRef, targetRef, modelId, updateTransform, commitHistory])

  if (!targetRef.current) return null

  return (
    <TransformControls
      ref={controlsRef}
      object={targetRef.current}
      mode={transformMode}
      translationSnap={snapEnabled ? snapValue : null}
      rotationSnap={snapEnabled ? Math.PI / 24 : null}
      scaleSnap={snapEnabled ? 0.1 : null}
    />
  )
}
