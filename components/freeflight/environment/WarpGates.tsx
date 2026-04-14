'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { ShipState, WarpGateDef } from '../types'
import { WARP_GATES } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  onJump?: (fromId: string, toId: string) => void
}

const GATE_RADIUS = 8
const JUMP_THRESHOLD = GATE_RADIUS * 0.85

export default function WarpGates({ ship, onJump }: Props) {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([])
  const glowRefs = useRef<(THREE.Mesh | null)[]>([])
  const cooldown = useRef(0)

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    cooldown.current = Math.max(0, cooldown.current - delta)

    ringRefs.current.forEach((r, i) => {
      if (r) r.rotation.z = t * 0.6 * (i % 2 === 0 ? 1 : -1)
    })
    glowRefs.current.forEach((g, i) => {
      if (g) {
        const mat = g.material as THREE.MeshBasicMaterial
        mat.opacity = 0.35 + Math.sin(t * 2.4 + i) * 0.15
      }
    })

    if (cooldown.current > 0) return

    const s = ship.current
    for (let i = 0; i < WARP_GATES.length; i++) {
      const g = WARP_GATES[i]
      const d = s.position.distanceTo(g.position)
      if (d <= JUMP_THRESHOLD) {
        const target = WARP_GATES.find(x => x.id === g.pairId)
        if (!target) continue
        // Drop ship just outside the target gate along its facing (+X)
        const exitOffset = new THREE.Vector3(20, 0, 0)
        s.position.set(
          target.position.x + exitOffset.x,
          target.position.y + exitOffset.y,
          target.position.z + exitOffset.z,
        )
        // Preserve some velocity, redirect forward
        const speed = Math.max(30, s.velocity.length())
        s.velocity.set(speed, 0, 0)
        s.shakeUntil = performance.now() + 300
        s.shakeStrength = 0.3
        cooldown.current = 2.5
        onJump?.(g.id, target.id)
        break
      }
    }
  })

  return (
    <>
      {WARP_GATES.map((g, i) => (
        <group key={g.id} position={g.position.toArray()} rotation={g.rotation}>
          {/* Outer torus ring */}
          <mesh ref={(r) => { ringRefs.current[i] = r }}>
            <torusGeometry args={[GATE_RADIUS, 0.6, 12, 64]} />
            <meshStandardMaterial
              color="#6a4aff"
              emissive="#a866ff"
              emissiveIntensity={1.8}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Inner event-horizon disc */}
          <mesh ref={(m) => { glowRefs.current[i] = m }}>
            <circleGeometry args={[GATE_RADIUS - 0.8, 48]} />
            <meshBasicMaterial
              color="#d4aaff"
              transparent
              opacity={0.4}
              toneMapped={false}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Anchor struts */}
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((a, k) => (
            <mesh key={k} position={[0, Math.sin(a) * (GATE_RADIUS + 1.2), Math.cos(a) * (GATE_RADIUS + 1.2)]}>
              <boxGeometry args={[0.4, 1.2, 0.4]} />
              <meshStandardMaterial color="#3a2a60" emissive="#5522aa" emissiveIntensity={0.8} />
            </mesh>
          ))}
          <pointLight color="#a866ff" intensity={3} distance={40} />
          <Html
            center
            distanceFactor={50}
            position={[0, GATE_RADIUS + 3, 0]}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            <div style={{
              padding: '3px 10px',
              fontFamily: 'var(--font-space, monospace)',
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#e4c8ff',
              textShadow: '0 0 10px #a866ff, 0 0 20px #a866ff88',
              whiteSpace: 'nowrap',
            }}>
              {g.name}
            </div>
          </Html>
        </group>
      ))}
    </>
  )
}
