'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { STAR_MAP_NODES } from './nodes'

interface CameraRigProps {
  hoveredId: string | null
  disabled: boolean
}

// Applies parallax + hover dolly as a relative offset on top of OrbitControls.
// Subtracts the previously applied offset each frame to avoid drift.
export default function CameraRig({ hoveredId, disabled }: CameraRigProps) {
  const { camera, gl } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef(new THREE.Vector3())

  useEffect(() => {
    const el = gl.domElement
    const handle = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    }
    el.addEventListener('pointermove', handle)
    return () => el.removeEventListener('pointermove', handle)
  }, [gl])

  useFrame((_, delta) => {
    // Remove previous offset first — lets OrbitControls see the real camera
    camera.position.sub(current.current)

    if (disabled) {
      current.current.set(0, 0, 0)
      return
    }

    // Target offset — camera-local parallax (right/up axes)
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1)
    const forward = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 2).negate()

    const target = new THREE.Vector3()
      .addScaledVector(right, mouse.current.x * 0.35)
      .addScaledVector(up, -mouse.current.y * 0.22)

    const hovered = hoveredId ? STAR_MAP_NODES.find(n => n.id === hoveredId) : null
    if (hovered) {
      const toNode = new THREE.Vector3(...hovered.position).sub(camera.position).normalize()
      const dollyAmount = Math.max(0.15, Math.min(0.55, toNode.dot(forward) * 0.5 + 0.25))
      target.addScaledVector(forward, dollyAmount)
    }

    current.current.lerp(target, Math.min(delta * 4, 1))
    camera.position.add(current.current)
  })

  return null
}
