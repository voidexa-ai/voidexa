'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { ShipState, StationDef, StationKind } from '../types'
import { STATIONS } from '../types'

interface Props {
  ship: React.MutableRefObject<ShipState>
  onDockStationChange?: (station: StationDef | null) => void
}

const KIND_COLOR: Record<StationKind, string> = {
  hub:       '#00d4ff',
  repair:    '#66ff99',
  trading:   '#ffaa33',
  abandoned: '#ff3355',
}

export default function SpaceStations({ ship, onDockStationChange }: Props) {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([])
  const outerRingRefs = useRef<(THREE.Mesh | null)[]>([])
  const beaconRefs = useRef<(THREE.PointLight | null)[]>([])
  const beaconMeshRefs = useRef<(THREE.Mesh | null)[]>([])
  const flickerRefs = useRef<(THREE.PointLight | null)[]>([])
  const debrisRefs = useRef<(THREE.Group | null)[]>([])
  const lastStation = useRef<string | null>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ringRefs.current.forEach((r, i) => {
      if (r) r.rotation.y = t * (0.25 + (i % 3) * 0.08)
    })
    outerRingRefs.current.forEach((r, i) => {
      if (r) {
        r.rotation.z = t * 0.12
        r.rotation.x = t * 0.08
      }
    })
    beaconRefs.current.forEach((b, i) => {
      if (b) b.intensity = 4 + Math.sin(t * 1.8 + i) * 3
    })
    beaconMeshRefs.current.forEach((m, i) => {
      if (m) {
        const s = 1 + Math.sin(t * 1.8 + i) * 0.25
        m.scale.setScalar(s)
      }
    })
    flickerRefs.current.forEach((f) => {
      if (f) {
        const n = Math.sin(t * 13.1) * Math.sin(t * 7.3) * Math.sin(t * 2.9)
        f.intensity = Math.max(0, 1.5 + n * 2.5)
      }
    })
    debrisRefs.current.forEach((g, i) => {
      if (g) {
        g.rotation.y = t * (0.05 + i * 0.02)
        g.rotation.x = t * 0.03
      }
    })

    // Dock proximity
    const s = ship.current
    let inRange: StationDef | null = null
    let nearestDist = Infinity
    for (const st of STATIONS) {
      const d = s.position.distanceTo(st.position)
      if (d <= st.dockRadius && d < nearestDist) {
        inRange = st
        nearestDist = d
      }
    }
    const id = inRange?.id ?? null
    if (id !== lastStation.current) {
      lastStation.current = id
      onDockStationChange?.(inRange)
    }
  })

  return (
    <>
      {STATIONS.map((st, i) => {
        const color = KIND_COLOR[st.kind]
        const scale = st.kind === 'hub' ? 1.8 : st.kind === 'trading' ? 1.2 : 1.0

        return (
          <group key={st.id} position={st.position.toArray()}>
            {/* Body — larger + more detail for hub */}
            <mesh>
              <cylinderGeometry args={[2 * scale, 2 * scale, 6 * scale, 16]} />
              <meshStandardMaterial
                color={st.kind === 'abandoned' ? '#2a2020' : '#4a5a70'}
                metalness={0.7}
                roughness={st.kind === 'abandoned' ? 0.8 : 0.4}
                emissive={st.kind === 'abandoned' ? '#180808' : '#0a1420'}
                emissiveIntensity={st.kind === 'abandoned' ? 0.2 : 0.5}
              />
            </mesh>

            {/* Primary ring */}
            <mesh ref={(r) => { ringRefs.current[i] = r }}>
              <torusGeometry args={[6 * scale, 0.4 * scale, 8, 48]} />
              <meshStandardMaterial
                color="#5a6a80"
                metalness={0.6}
                roughness={0.5}
                emissive={color}
                emissiveIntensity={st.kind === 'abandoned' ? 0.15 : 0.9}
              />
            </mesh>

            {/* Hub gets a second counter-rotating ring + extra antennas */}
            {st.kind === 'hub' && (
              <>
                <mesh ref={(r) => { outerRingRefs.current[i] = r }}>
                  <torusGeometry args={[9, 0.25, 8, 64]} />
                  <meshStandardMaterial color="#3a4a60" metalness={0.7} roughness={0.3} emissive="#00d4ff" emissiveIntensity={0.7} />
                </mesh>
                {/* Docking bay lights — small emissive spheres around the ring */}
                {Array.from({ length: 8 }).map((_, k) => {
                  const a = (k / 8) * Math.PI * 2
                  return (
                    <mesh key={k} position={[Math.cos(a) * 6 * scale, 0, Math.sin(a) * 6 * scale]}>
                      <sphereGeometry args={[0.18, 10, 10]} />
                      <meshBasicMaterial color="#00ffff" toneMapped={false} />
                    </mesh>
                  )
                })}
                {/* Antenna spires */}
                {[[-1.2, 0], [1.2, 0], [0, 1.2], [0, -1.2]].map(([x, z], k) => (
                  <group key={k} position={[x, 5 * scale, z]}>
                    <mesh>
                      <cylinderGeometry args={[0.08, 0.08, 3.5, 6]} />
                      <meshStandardMaterial color="#9aa5b0" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 1.8, 0]}>
                      <sphereGeometry args={[0.14, 10, 10]} />
                      <meshBasicMaterial color="#00ffff" toneMapped={false} />
                    </mesh>
                  </group>
                ))}
              </>
            )}

            {/* Antenna (standard stations) */}
            {st.kind !== 'hub' && st.kind !== 'abandoned' && (
              <mesh position={[0, 4.5 * scale, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 3 * scale, 6]} />
                <meshStandardMaterial color="#9aa5b0" />
              </mesh>
            )}

            {/* Beacon — pulses on functioning stations */}
            {st.kind !== 'abandoned' && (
              <>
                <pointLight
                  ref={(l) => { beaconRefs.current[i] = l }}
                  position={[0, (st.kind === 'hub' ? 8 : 6) * scale * 0.8, 0]}
                  color={color}
                  intensity={4}
                  distance={80}
                />
                <mesh
                  ref={(m) => { beaconMeshRefs.current[i] = m }}
                  position={[0, (st.kind === 'hub' ? 8 : 6) * scale * 0.8, 0]}
                >
                  <sphereGeometry args={[0.3 * scale, 14, 14]} />
                  <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
              </>
            )}

            {/* Abandoned: flickering interior light + debris field */}
            {st.kind === 'abandoned' && (
              <>
                <pointLight
                  ref={(l) => { flickerRefs.current[i] = l }}
                  position={[0, 1, 0]}
                  color="#ff4455"
                  intensity={1.5}
                  distance={30}
                />
                <mesh position={[0, 1, 0]}>
                  <sphereGeometry args={[0.18, 10, 10]} />
                  <meshBasicMaterial color="#ff6677" toneMapped={false} />
                </mesh>
                <group ref={(g) => { debrisRefs.current[i] = g }}>
                  {Array.from({ length: 18 }).map((_, k) => {
                    // deterministic debris placement
                    const a = (k / 18) * Math.PI * 2 + k * 0.37
                    const r = 8 + (k % 4) * 2.2
                    const y = ((k * 13) % 7) - 3
                    const sz = 0.12 + (k % 5) * 0.08
                    return (
                      <mesh key={k} position={[Math.cos(a) * r, y, Math.sin(a) * r]}>
                        <boxGeometry args={[sz, sz, sz * 1.6]} />
                        <meshStandardMaterial color="#3a3030" metalness={0.5} roughness={0.8} />
                      </mesh>
                    )
                  })}
                </group>
              </>
            )}

            {/* Label (floating, always faces camera) */}
            <Html
              center
              distanceFactor={st.kind === 'hub' ? 60 : 40}
              position={[0, (st.kind === 'hub' ? 12 : 8) * scale, 0]}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              <div style={{
                padding: '4px 10px',
                fontFamily: 'var(--font-space, monospace)',
                fontSize: st.kind === 'hub' ? 14 : 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ffffff',
                textShadow: `0 0 8px ${color}, 0 0 16px ${color}aa, 0 2px 6px rgba(0,0,0,0.9)`,
                whiteSpace: 'nowrap',
                opacity: st.kind === 'abandoned' ? 0.55 : 0.92,
              }}>
                {st.name.toUpperCase()}
              </div>
            </Html>
          </group>
        )
      })}
    </>
  )
}
