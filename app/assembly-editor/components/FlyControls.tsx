'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Public shape the rest of the editor treats as the "camera control" handle.
// GizmoWrapper still sets `.enabled` on drag to suppress camera input.
export interface FlyControlsHandle {
  enabled: boolean
  // Used by CameraController to re-orient after a preset change.
  // We approximate the old OrbitControls API so callers don't care which
  // implementation is mounted.
  target: THREE.Vector3
  update: () => void
}

interface Props {
  controlRef: React.MutableRefObject<FlyControlsHandle | null>
  initialSpeed?: number
}

// First-person fly camera. WASD for strafe/forward, Q/E for vertical,
// right-mouse-drag to yaw+pitch, scroll wheel to tune speed.
// Designed to feel like Sims/Unity's scene-view navigation.
export function FlyControls({ controlRef, initialSpeed = 0.5 }: Props) {
  const { camera, gl } = useThree()

  const keys = useRef<Record<string, boolean>>({})
  const speed = useRef(initialSpeed)
  const isLooking = useRef(false)
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const yaw = useRef(0)
  const pitch = useRef(0)
  const enabled = useRef(true)

  // Expose handle. We keep a Vector3 so the preset logic can still set a
  // point-of-interest; we use it on preset apply to orient the camera.
  useEffect(() => {
    const handle: FlyControlsHandle = {
      get enabled() {
        return enabled.current
      },
      set enabled(v: boolean) {
        enabled.current = v
      },
      target: new THREE.Vector3(0, 0, 0),
      update: () => {
        const target = handle.target
        camera.lookAt(target)
        // Sync yaw/pitch from the resulting quaternion so mouselook picks up
        // smoothly from the new orientation.
        const eul = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
        yaw.current = eul.y
        pitch.current = eul.x
      },
    }
    controlRef.current = handle
    return () => {
      controlRef.current = null
    }
  }, [camera, controlRef])

  // Initialise yaw/pitch from current camera rotation on mount.
  useEffect(() => {
    const eul = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
    yaw.current = eul.y
    pitch.current = eul.x
  }, [camera])

  // Key handlers. Fly-control keys (WASDQE) are consumed here — we call
  // preventDefault+stopPropagation so page-level hotkeys (D = duplicate,
  // S = scale mode, etc.) don't fire while navigating.
  useEffect(() => {
    const FLY_KEYS = new Set(['w', 'a', 's', 'd', 'q', 'e'])
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      const k = e.key.toLowerCase()
      keys.current[k] = true
      if (FLY_KEYS.has(k)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      keys.current[k] = false
      if (FLY_KEYS.has(k)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    // Use capture phase so we intercept WASDQE BEFORE the page-level keydown
    // listener sees them — stopPropagation on capture prevents bubble reach.
    window.addEventListener('keydown', down, true)
    window.addEventListener('keyup', up, true)
    return () => {
      window.removeEventListener('keydown', down, true)
      window.removeEventListener('keyup', up, true)
    }
  }, [])

  // Mouse look (right-click drag) + wheel speed control.
  useEffect(() => {
    const dom = gl.domElement

    const onContextMenu = (e: MouseEvent) => e.preventDefault()

    const onDown = (e: MouseEvent) => {
      if (e.button === 2) {
        isLooking.current = true
        lastMouse.current = { x: e.clientX, y: e.clientY }
      }
    }
    const onUp = (e: MouseEvent) => {
      if (e.button === 2) isLooking.current = false
    }
    const onMove = (e: MouseEvent) => {
      if (!isLooking.current || !enabled.current) return
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }
      const sensitivity = 0.0025
      yaw.current -= dx * sensitivity
      pitch.current -= dy * sensitivity
      // Clamp pitch to avoid gimbal flip.
      const limit = Math.PI / 2 - 0.05
      if (pitch.current > limit) pitch.current = limit
      if (pitch.current < -limit) pitch.current = -limit
    }

    const onWheel = (e: WheelEvent) => {
      if (!enabled.current) return
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      speed.current = Math.max(0.05, Math.min(5, speed.current * factor))
    }

    dom.addEventListener('contextmenu', onContextMenu)
    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)
    dom.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      dom.removeEventListener('contextmenu', onContextMenu)
      dom.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
      dom.removeEventListener('wheel', onWheel)
    }
  }, [gl])

  // Apply rotation + translation every frame.
  useFrame((_, delta) => {
    if (!enabled.current) return
    // Update camera rotation from yaw/pitch.
    const eul = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
    camera.quaternion.setFromEuler(eul)

    // Translation — scaled by delta so it's framerate-independent, and by
    // the current speed setting so the wheel can tune responsiveness.
    const k = keys.current
    const forward = (k['w'] ? 1 : 0) - (k['s'] ? 1 : 0)
    const strafe = (k['d'] ? 1 : 0) - (k['a'] ? 1 : 0)
    const vertical = (k['e'] ? 1 : 0) - (k['q'] ? 1 : 0)
    if (forward === 0 && strafe === 0 && vertical === 0) return

    const step = speed.current * Math.min(60, 1 / Math.max(delta, 0.0001)) * delta
    const dir = new THREE.Vector3()
    if (forward) {
      camera.getWorldDirection(dir)
      camera.position.addScaledVector(dir, forward * step)
    }
    if (strafe) {
      const right = new THREE.Vector3()
      camera.getWorldDirection(right)
      right.cross(camera.up).normalize()
      camera.position.addScaledVector(right, strafe * step)
    }
    if (vertical) {
      // Absolute world up — avoids odd behaviour when the pilot is pitched.
      camera.position.addScaledVector(new THREE.Vector3(0, 1, 0), vertical * step)
    }
  })

  return null
}
