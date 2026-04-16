'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PowerUpId } from '@/lib/game/speedrun/tracks'
import { POWERUPS } from '@/lib/game/speedrun/tracks'

export interface ActivePowerUp {
  id: PowerUpId
  activatedAt: number
  expiresAt: number
  /** One-shot power-ups are consumed on first collision/gate, then cleared. */
  oneShotConsumed?: boolean
}

export interface PowerUpInventory {
  slots: PowerUpId[]
  active: ActivePowerUp | null
  usedIds: PowerUpId[]
}

export function createInventory(selected: PowerUpId[]): PowerUpInventory {
  return {
    slots: [...selected],
    active: null,
    usedIds: [],
  }
}

export function activateNextPowerUp(inv: PowerUpInventory, now: number): PowerUpInventory {
  if (inv.active) return inv
  if (inv.slots.length === 0) return inv
  const next = inv.slots[0]
  const def = POWERUPS[next]
  return {
    slots: inv.slots.slice(1),
    active: { id: next, activatedAt: now, expiresAt: now + def.durationMs },
    usedIds: [...inv.usedIds, next],
  }
}

export function expireIfDue(inv: PowerUpInventory, now: number): PowerUpInventory {
  if (!inv.active) return inv
  if (now >= inv.active.expiresAt) return { ...inv, active: null }
  return inv
}

export function consumeOneShot(inv: PowerUpInventory, id: PowerUpId): PowerUpInventory {
  if (!inv.active || inv.active.id !== id || inv.active.oneShotConsumed) return inv
  return { ...inv, active: { ...inv.active, oneShotConsumed: true, expiresAt: performance.now() } }
}

/**
 * Visual overlay — rendered inside the R3F scene as a sibling to the ship.
 * Follows the ship position via ref.
 */
export function PowerUpVisual({
  shipGroup,
  active,
}: {
  shipGroup: React.RefObject<THREE.Group | null>
  active: ActivePowerUp | null
}) {
  const bubbleRef = useRef<THREE.Mesh>(null)
  const flameRef = useRef<THREE.Mesh>(null)
  const flameMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const bubbleMatRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    if (!shipGroup.current) return
    const pos = shipGroup.current.position
    const q = shipGroup.current.quaternion

    const now = performance.now()

    // Phase Shell bubble
    if (bubbleRef.current && bubbleMatRef.current) {
      const on = active?.id === 'phase_shell' && !active.oneShotConsumed
      bubbleRef.current.visible = on
      if (on) {
        bubbleRef.current.position.copy(pos)
        const t = Math.sin(now * 0.004) * 0.1
        bubbleRef.current.scale.setScalar(3.2 + t)
        bubbleMatRef.current.opacity = 0.28 + Math.sin(now * 0.006) * 0.08
      }
    }

    // Thruster Surge flame trail
    if (flameRef.current && flameMatRef.current) {
      const on = active?.id === 'thruster_surge'
      flameRef.current.visible = on
      if (on) {
        flameRef.current.position.copy(pos)
        flameRef.current.quaternion.copy(q)
        const lifeN = (active.expiresAt - now) / Math.max(1, active.expiresAt - active.activatedAt)
        flameMatRef.current.opacity = 0.7 * Math.max(0, lifeN)
        flameRef.current.scale.set(1.6, 1.6, 4 + Math.sin(now * 0.02) * 0.6)
      }
    }
  })

  // Apply transparency to ship root for Null Drift
  useEffect(() => {
    if (!shipGroup.current) return
    const transparent = active?.id === 'null_drift' && !active.oneShotConsumed
    shipGroup.current.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        const mat = mesh.material as THREE.Material | THREE.Material[]
        if (Array.isArray(mat)) {
          mat.forEach(m => {
            m.transparent = true
            ;(m as THREE.Material & { opacity: number }).opacity = transparent ? 0.35 : 1
          })
        } else if (mat) {
          mat.transparent = true
          ;(mat as THREE.Material & { opacity: number }).opacity = transparent ? 0.35 : 1
        }
      }
    })
  }, [active?.id, active?.oneShotConsumed, shipGroup])

  return (
    <group>
      <mesh ref={bubbleRef} visible={false}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          ref={bubbleMatRef}
          color="#7fd8ff"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={flameRef} visible={false} position={[0, 0, 2]}>
        <coneGeometry args={[1.2, 5, 16, 1, true]} />
        <meshBasicMaterial
          ref={flameMatRef}
          color="#00aaff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
