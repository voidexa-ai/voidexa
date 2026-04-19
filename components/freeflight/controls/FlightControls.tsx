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

// Sprint 15 — rotation inertia tuning constants.
// Mouse sensitivity drops (0.0022 → 0.003 per px but into angular velocity,
// not direct pitch/yaw) so a quick flick keeps spinning briefly after release.
const MOUSE_SENSITIVITY = 0.003
// Roll rate applied per frame when Q/E are held, before damping.
const ROLL_INPUT = 18
// Per-frame multiplicative damping on angular velocity. ~0.92 gives a crisp
// yet weighty feel at 60fps (decays to ~10% over ~28 frames ≈ 0.46 s).
const ANGULAR_DAMPING = 0.92
// Absolute cap on any axis of angular velocity (rad/s). 3 rad/s ≈ 170°/s.
const MAX_ANGULAR_VELOCITY = 3
// Max pitch to keep the horizon sane (ship can still invert via roll).
const PITCH_LIMIT = Math.PI / 2.1

export default function FlightControls({ ship, shipGroup, enabled }: Props) {
  const { gl } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const yaw = useRef(0)
  const pitch = useRef(0)
  const roll = useRef(0)
  // Angular velocity integrated into pitch/yaw/roll every frame.
  const angularVelocity = useRef(new THREE.Vector3(0, 0, 0))
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
      // Mouse pushes angular velocity instead of snapping orientation.
      angularVelocity.current.y -= e.movementX * MOUSE_SENSITIVITY * 60
      angularVelocity.current.x -= e.movementY * MOUSE_SENSITIVITY * 60
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
    const k = keys.current

    // Q / E roll input — feeds angular velocity's Z axis so roll also has inertia.
    if (k['KeyQ']) angularVelocity.current.z += ROLL_INPUT * dt
    if (k['KeyE']) angularVelocity.current.z -= ROLL_INPUT * dt

    // Clamp every axis.
    angularVelocity.current.x = clamp(angularVelocity.current.x, -MAX_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY)
    angularVelocity.current.y = clamp(angularVelocity.current.y, -MAX_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY)
    angularVelocity.current.z = clamp(angularVelocity.current.z, -MAX_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY)

    // Integrate into orientation.
    pitch.current += angularVelocity.current.x * dt
    yaw.current   += angularVelocity.current.y * dt
    roll.current  += angularVelocity.current.z * dt

    // Clamp pitch to avoid gimbal flip.
    if (pitch.current > PITCH_LIMIT) {
      pitch.current = PITCH_LIMIT
      if (angularVelocity.current.x > 0) angularVelocity.current.x = 0
    }
    if (pitch.current < -PITCH_LIMIT) {
      pitch.current = -PITCH_LIMIT
      if (angularVelocity.current.x < 0) angularVelocity.current.x = 0
    }

    // Per-frame damping — applied last so the effective damping rate stays
    // roughly constant regardless of frame cadence.
    const dampFactor = Math.pow(ANGULAR_DAMPING, dt * 60)
    angularVelocity.current.multiplyScalar(dampFactor)

    // Build ship quaternion. 'YXZ' keeps yaw → pitch → roll ordering so that
    // roll rotates around the ship's local forward axis after yaw/pitch.
    tmpEuler.set(pitch.current, yaw.current, roll.current, 'YXZ')
    s.quaternion.setFromEuler(tmpEuler)

    tmpForward.set(0, 0, -1).applyQuaternion(s.quaternion)
    tmpRight.set(1, 0, 0).applyQuaternion(s.quaternion)
    tmpUp.set(0, 1, 0).applyQuaternion(s.quaternion)

    const thrust = new THREE.Vector3()
    if (k['KeyW']) thrust.add(tmpForward)
    if (k['KeyS']) thrust.sub(tmpForward)
    if (k['KeyA']) thrust.sub(tmpRight)
    if (k['KeyD']) thrust.add(tmpRight)
    // Sprint 15 Task 4: vertical translation moved off Q/E. R/F remain for
    // pilots who want manual ascend/descend.
    if (k['KeyR']) thrust.add(tmpUp)
    if (k['KeyF']) thrust.sub(tmpUp)
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

function clamp(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n
}

export const FLIGHT_CONTROLS_CONSTANTS = {
  MAX_SPEED,
  BOOST_SPEED,
  ACCELERATION,
  BRAKE_DECEL,
  DRIFT_DAMP,
  MOUSE_SENSITIVITY,
  ROLL_INPUT,
  ANGULAR_DAMPING,
  MAX_ANGULAR_VELOCITY,
  PITCH_LIMIT,
}
