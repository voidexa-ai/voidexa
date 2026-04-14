'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  shipGroup: React.RefObject<THREE.Group | null>
  enabled: boolean
}

const MAX_SPEED = 60
const BOOST_SPEED = 160
const ACCELERATION = 60
const BOOST_ACCEL_MULT = 4
const BRAKE_DECEL = 50
const DRIFT_DAMP = 0.992
const ROT_SENSITIVITY = 0.0022

export default function FlightControls({ ship, shipGroup, enabled }: Props) {
  const { gl } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const yaw = useRef(0)
  const pitch = useRef(0)
  const pointerLocked = useRef(false)

  useEffect(() => {
    if (!enabled) return
    const canvas = gl.domElement

    const onKey = (e: KeyboardEvent, down: boolean) => {
      keys.current[e.code] = down
    }
    const onKeyDown = (e: KeyboardEvent) => onKey(e, true)
    const onKeyUp = (e: KeyboardEvent) => onKey(e, false)

    const onMouseMove = (e: MouseEvent) => {
      if (!pointerLocked.current) return
      yaw.current -= e.movementX * ROT_SENSITIVITY
      pitch.current -= e.movementY * ROT_SENSITIVITY
      pitch.current = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, pitch.current))
    }

    const onClick = () => {
      if (!pointerLocked.current) canvas.requestPointerLock?.()
    }

    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === canvas
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onPointerLockChange)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      if (document.pointerLockElement === canvas) document.exitPointerLock()
    }
  }, [gl, enabled])

  const tmpForward = useRef(new THREE.Vector3()).current
  const tmpRight = useRef(new THREE.Vector3()).current
  const tmpUp = useRef(new THREE.Vector3()).current
  const tmpEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ')).current

  useFrame((_, delta) => {
    if (!enabled) return
    const dt = Math.min(delta, 0.05)
    const s = ship.current

    tmpEuler.set(pitch.current, yaw.current, 0, 'YXZ')
    s.quaternion.setFromEuler(tmpEuler)

    tmpForward.set(0, 0, -1).applyQuaternion(s.quaternion)
    tmpRight.set(1, 0, 0).applyQuaternion(s.quaternion)
    tmpUp.set(0, 1, 0).applyQuaternion(s.quaternion)

    const k = keys.current
    const thrust = new THREE.Vector3()
    if (k['KeyW']) thrust.add(tmpForward)
    if (k['KeyS']) thrust.sub(tmpForward)
    if (k['KeyA']) thrust.sub(tmpRight)
    if (k['KeyD']) thrust.add(tmpRight)
    if (k['KeyQ'] || k['ControlLeft']) thrust.sub(tmpUp)
    if (k['KeyE'] || k['ShiftRight']) thrust.add(tmpUp)
    if (thrust.lengthSq() > 0) thrust.normalize()

    s.boost = !!k['ShiftLeft']
    s.brake = !!k['Space']

    const maxSpeed = s.boost ? BOOST_SPEED : MAX_SPEED
    const accel = ACCELERATION * (s.boost ? BOOST_ACCEL_MULT : 1)

    s.velocity.addScaledVector(thrust, accel * dt)

    if (s.brake) {
      s.velocity.multiplyScalar(Math.max(0, 1 - BRAKE_DECEL * dt / Math.max(1, s.velocity.length())))
    } else {
      s.velocity.multiplyScalar(DRIFT_DAMP)
    }

    if (s.velocity.length() > maxSpeed) s.velocity.setLength(maxSpeed)

    s.position.addScaledVector(s.velocity, dt)
    s.speed = s.velocity.length()

    if (shipGroup.current) {
      shipGroup.current.position.copy(s.position)
      shipGroup.current.quaternion.copy(s.quaternion)
    }
  })

  return null
}
