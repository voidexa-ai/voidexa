'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  onModeChange?: (firstPerson: boolean) => void
}

const FIRST_PERSON_OFFSET = new THREE.Vector3(0, 0.4, -0.2)
const THIRD_PERSON_OFFSET = new THREE.Vector3(0, 2, 8)
const LERP_RATE = 8

export default function CameraManager({ ship, onModeChange }: Props) {
  const { camera } = useThree()
  const currentOffset = useRef(new THREE.Vector3().copy(THIRD_PERSON_OFFSET))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyV') {
        ship.current.firstPerson = !ship.current.firstPerson
        onModeChange?.(ship.current.firstPerson)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ship, onModeChange])

  const tmp = useRef(new THREE.Vector3()).current
  const lookAtTmp = useRef(new THREE.Vector3()).current
  const forward = useRef(new THREE.Vector3()).current

  useFrame((_, delta) => {
    const s = ship.current
    const dt = Math.min(delta, 0.05)
    const targetOffset = s.firstPerson ? FIRST_PERSON_OFFSET : THIRD_PERSON_OFFSET
    const blend = 1 - Math.exp(-LERP_RATE * dt)
    currentOffset.current.lerp(targetOffset, blend)

    tmp.copy(currentOffset.current).applyQuaternion(s.quaternion)
    camera.position.copy(s.position).add(tmp)

    // Camera shake
    if (s.shakeUntil > performance.now()) {
      camera.position.x += (Math.random() - 0.5) * s.shakeStrength
      camera.position.y += (Math.random() - 0.5) * s.shakeStrength
      camera.position.z += (Math.random() - 0.5) * s.shakeStrength
    }

    forward.set(0, 0, -1).applyQuaternion(s.quaternion)
    lookAtTmp.copy(s.position).addScaledVector(forward, 10)
    camera.lookAt(lookAtTmp)
  })

  return null
}
