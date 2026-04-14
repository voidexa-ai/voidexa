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
const THIRD_MIN = 3
const THIRD_MAX = 20
const LERP_RATE = 8

export default function CameraManager({ ship, onModeChange }: Props) {
  const { camera, gl } = useThree()
  const currentOffset = useRef(new THREE.Vector3(0, 2, 8))
  const thirdDistance = useRef(8)
  const thirdHeight = useRef(2)

  // Free look: yaw/pitch around ship, active while right mouse held
  const freeLook = useRef(false)
  const freeYaw = useRef(0)
  const freePitch = useRef(0)
  const freeLookBlend = useRef(0) // 0 = behind ship, 1 = free

  useEffect(() => {
    const canvas = gl.domElement

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyV') {
        ship.current.firstPerson = !ship.current.firstPerson
        onModeChange?.(ship.current.firstPerson)
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (ship.current.firstPerson) return
      e.preventDefault()
      thirdDistance.current = Math.max(
        THIRD_MIN,
        Math.min(THIRD_MAX, thirdDistance.current + Math.sign(e.deltaY) * 1.2),
      )
      thirdHeight.current = thirdDistance.current * 0.25
    }

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2 && !ship.current.firstPerson) {
        freeLook.current = true
        freeYaw.current = 0
        freePitch.current = 0
      }
    }
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) freeLook.current = false
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!freeLook.current) return
      freeYaw.current -= e.movementX * 0.004
      freePitch.current -= e.movementY * 0.004
      freePitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, freePitch.current))
    }

    window.addEventListener('keydown', onKey)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl, ship, onModeChange])

  const tmp = useRef(new THREE.Vector3()).current
  const tmp2 = useRef(new THREE.Vector3()).current
  const lookAtTmp = useRef(new THREE.Vector3()).current
  const forward = useRef(new THREE.Vector3()).current
  const orbitOffset = useRef(new THREE.Vector3()).current

  useFrame((_, delta) => {
    const s = ship.current
    const dt = Math.min(delta, 0.05)
    const blend = 1 - Math.exp(-LERP_RATE * dt)

    // Target offset
    let targetX = 0, targetY = 2, targetZ = 8
    if (s.firstPerson) {
      targetX = FIRST_PERSON_OFFSET.x
      targetY = FIRST_PERSON_OFFSET.y
      targetZ = FIRST_PERSON_OFFSET.z
    } else {
      targetY = thirdHeight.current
      targetZ = thirdDistance.current
    }

    currentOffset.current.x += (targetX - currentOffset.current.x) * blend
    currentOffset.current.y += (targetY - currentOffset.current.y) * blend
    currentOffset.current.z += (targetZ - currentOffset.current.z) * blend

    // Free look blend
    const freeTarget = freeLook.current ? 1 : 0
    freeLookBlend.current += (freeTarget - freeLookBlend.current) * blend

    if (!s.firstPerson && freeLookBlend.current > 0.01) {
      // Orbit around ship
      const r = thirdDistance.current
      const orbitY = Math.sin(freePitch.current) * r
      const planeR = Math.cos(freePitch.current) * r
      orbitOffset.set(
        Math.sin(freeYaw.current) * planeR,
        orbitY + thirdHeight.current * 0.5,
        Math.cos(freeYaw.current) * planeR,
      )
      // Apply ship's quaternion so orbit is ship-local
      orbitOffset.applyQuaternion(s.quaternion)

      tmp.copy(currentOffset.current).applyQuaternion(s.quaternion)
      tmp2.copy(orbitOffset)
      // Lerp between behind-ship offset and orbit
      tmp.lerp(tmp2, freeLookBlend.current)
      camera.position.copy(s.position).add(tmp)
    } else {
      tmp.copy(currentOffset.current).applyQuaternion(s.quaternion)
      camera.position.copy(s.position).add(tmp)
    }

    // Camera shake
    if (s.shakeUntil > performance.now()) {
      camera.position.x += (Math.random() - 0.5) * s.shakeStrength
      camera.position.y += (Math.random() - 0.5) * s.shakeStrength
      camera.position.z += (Math.random() - 0.5) * s.shakeStrength
    }

    // Look at ship in free look, else look forward
    if (!s.firstPerson && freeLookBlend.current > 0.01) {
      lookAtTmp.copy(s.position)
    } else {
      forward.set(0, 0, -1).applyQuaternion(s.quaternion)
      lookAtTmp.copy(s.position).addScaledVector(forward, 10)
    }
    camera.lookAt(lookAtTmp)
  })

  return null
}
