'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import CameraManager from '@/components/freeflight/controls/CameraManager'
import ShipModel from '@/components/freeflight/ships/ShipModel'
import SpeedRunControls from '@/components/game/speedrun/SpeedRunControls'
import { createShipState, type ShipState } from '@/components/freeflight/types'
import WaypointMarker, { type WaypointStatus } from './WaypointMarker'
import type { Route, Waypoint } from '@/lib/game/hauling/contracts'

export type FlightPhase = 'cruising' | 'encounter_paused' | 'finished'

interface Props {
  route: Route
  shipUrl: string
  shipScale: number
  speedMultiplier: number
  paused: boolean
  phase: FlightPhase
  onCheckpointReached: (index: number, total: number) => void
  onDelivered: () => void
  onShipPosition: (pos: THREE.Vector3) => void
}

const REACH_DIST = 22

export default function HaulingScene(props: Props) {
  const { route, shipUrl, shipScale, speedMultiplier, paused, phase, onCheckpointReached, onDelivered, onShipPosition } = props

  const shipGroup = useRef<THREE.Group>(null)
  const shipState = useRef<ShipState>(createShipState())
  const [shipSize, setShipSize] = useState(4)

  const waypoints: Waypoint[] = useMemo(
    () => [route.origin, ...route.checkpoints, route.destination],
    [route]
  )

  const [statuses, setStatuses] = useState<WaypointStatus[]>(() => {
    const arr: WaypointStatus[] = waypoints.map(() => 'pending')
    if (arr.length > 0) arr[0] = 'cleared' // origin starts cleared (player spawned there)
    if (arr.length > 1) arr[1] = 'next'
    return arr
  })
  const nextIndex = useRef(1)

  // Reset when route changes
  useEffect(() => {
    const s = createShipState()
    s.position.set(route.origin.x, route.origin.y, route.origin.z)
    s.quaternion.setFromEuler(new THREE.Euler(0, 0, 0, 'YXZ'))
    shipState.current = s
    const initial: WaypointStatus[] = waypoints.map(() => 'pending')
    if (initial.length > 0) initial[0] = 'cleared'
    if (initial.length > 1) initial[1] = 'next'
    setStatuses(initial)
    nextIndex.current = 1
  }, [route, waypoints])

  const handleNoop = useCallback(() => {}, [])

  useFrame(() => {
    if (phase === 'finished') return
    const pos = shipState.current.position
    onShipPosition(pos)
    if (nextIndex.current < waypoints.length) {
      const target = waypoints[nextIndex.current]
      const dx = pos.x - target.x
      const dy = pos.y - target.y
      const dz = pos.z - target.z
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < REACH_DIST) {
        const reached = nextIndex.current
        const total = waypoints.length - 1
        setStatuses(prev => {
          const next = [...prev]
          next[reached] = 'cleared'
          if (reached + 1 < next.length) next[reached + 1] = 'next'
          return next
        })
        nextIndex.current = reached + 1
        if (reached >= waypoints.length - 1) {
          onDelivered()
        } else {
          onCheckpointReached(reached, total)
        }
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[100, 200, 50]} intensity={0.8} />
      <Stars radius={1400} depth={200} count={3500} factor={5} fade />

      <Suspense fallback={null}>
        <ShipModel
          ref={shipGroup}
          ship={shipState}
          url={shipUrl}
          scale={shipScale}
          visible
          onSize={setShipSize}
        />
      </Suspense>

      <CameraManager ship={shipState} shipSize={shipSize} />
      <SpeedRunControls
        ship={shipState}
        shipGroup={shipGroup}
        enabled={!paused && phase === 'cruising'}
        speedMultiplier={speedMultiplier}
        onPowerUpKey={handleNoop}
      />

      {waypoints.map((w, i) => (
        <WaypointMarker
          key={i}
          position={[w.x, w.y, w.z]}
          status={statuses[i]}
          label={w.label}
          kind={i === 0 ? 'origin' : i === waypoints.length - 1 ? 'destination' : 'checkpoint'}
        />
      ))}
    </>
  )
}
