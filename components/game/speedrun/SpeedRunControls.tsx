'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ShipState } from '@/components/freeflight/types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  shipGroup: React.RefObject<THREE.Group | null>
  enabled: boolean
  speedMultiplier: number
  onPowerUpKey: () => void
}

const MAX_SPEED = 80
const BOOST_SPEED = 200
const ACCELERATION = 80
const BOOST_ACCEL_MULT = 3
const DRIFT_DAMP = 0.994
const ROT_SENSITIVITY = 0.0022

/**
 * Speed Run flight controls — adapted from FreeFlight's FlightControls but
 * Space now triggers the next power-up instead of braking. Shift-left is hold-to-boost.
 */
export default function SpeedRunControls({ ship, shipGroup, enabled, speedMultiplier, onPowerUpKey }: Props) {
  const { gl } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const yaw = useRef(0)
  const pitch = useRef(0)
  const pointerLocked = useRef(false)
  const spaceLatch = useRef(false)
  const onPowerUpRef = useRef(onPowerUpKey)

  useEffect(() => { onPowerUpRef.current = onPowerUpKey }, [onPowerUpKey])

  useEffect(() => {
    if (!enabled) return
    const canvas = gl.domElement

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (e.code === 'Space' && !spaceLatch.current) {
        spaceLatch.current = true
        onPowerUpRef.current()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
      if (e.code === 'Space') spaceLatch.current = false
    }

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

  // Initialize yaw from incoming quaternion once.
  const initDone = useRef(false)
  useEffect(() => {
    if (initDone.current) return
    const e = new THREE.Euler().setFromQuaternion(ship.current.quaternion, 'YXZ')
    yaw.current = e.y
    pitch.current = e.x
    initDone.current = true
  }, [ship])

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
    s.brake = false // Space is reserved for power-ups in Speed Run

    const baseMax = (s.boost ? BOOST_SPEED : MAX_SPEED) * speedMultiplier
    const accel = ACCELERATION * (s.boost ? BOOST_ACCEL_MULT : 1) * speedMultiplier

    s.velocity.addScaledVector(thrust, accel * dt)
    s.velocity.multiplyScalar(DRIFT_DAMP)
    if (s.velocity.length() > baseMax) s.velocity.setLength(baseMax)

    s.position.addScaledVector(s.velocity, dt)
    s.speed = s.velocity.length()

    if (shipGroup.current) {
      shipGroup.current.position.copy(s.position)
      shipGroup.current.quaternion.copy(s.quaternion)
    }
  })

  return null
}
