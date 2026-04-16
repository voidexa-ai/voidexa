'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import CameraManager from '@/components/freeflight/controls/CameraManager'
import ShipModel from '@/components/freeflight/ships/ShipModel'
import type { ShipState } from '@/components/freeflight/types'
import { createShipState } from '@/components/freeflight/types'
import GateRing, { type GateStatus } from './GateRing'
import SpeedRunControls from './SpeedRunControls'
import {
  GATE_COLLISION_DIST,
  type TrackDef,
} from '@/lib/game/speedrun/tracks'
import {
  PowerUpVisual,
  activateNextPowerUp,
  consumeOneShot,
  expireIfDue,
  type PowerUpInventory,
} from './PowerUpSystem'

export type RaceStatus = 'countdown' | 'running' | 'finished'

interface Props {
  track: TrackDef
  shipUrl: string
  shipScale: number
  inventory: PowerUpInventory
  onInventoryChange: (inv: PowerUpInventory) => void
  onRaceStateChange: (state: {
    status: RaceStatus
    elapsedMs: number
    clearedGates: number
    missedGates: number
    gateStatuses: GateStatus[]
  }) => void
}

export default function RaceScene(props: Props) {
  const { track, shipUrl, shipScale, inventory, onInventoryChange, onRaceStateChange } = props

  const shipGroup = useRef<THREE.Group>(null)
  const shipState = useRef<ShipState>(createShipState())
  const prevShipPos = useRef(new THREE.Vector3())
  const shipPosRef = useRef(new THREE.Vector3())
  const [shipSize, setShipSize] = useState(4)

  const [status, setStatus] = useState<RaceStatus>('countdown')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [gateStatuses, setGateStatuses] = useState<GateStatus[]>(
    () => track.gates.map((): GateStatus => 'pending')
  )
  const nextGateIndex = useRef(0)
  const raceStartRef = useRef<number | null>(null)
  const inventoryRef = useRef(inventory)

  // Reset on track change
  useEffect(() => {
    const s = createShipState()
    s.position.set(track.startPosition.x, track.startPosition.y, track.startPosition.z)
    s.quaternion.setFromEuler(new THREE.Euler(0, track.startYaw, 0, 'YXZ'))
    shipState.current = s
    prevShipPos.current.copy(s.position)
    shipPosRef.current.copy(s.position)
    nextGateIndex.current = 0
    setGateStatuses(track.gates.map((): GateStatus => 'pending'))
    setElapsedMs(0)
    setStatus('countdown')
    raceStartRef.current = null

    // 3-second countdown → running
    const t = window.setTimeout(() => {
      setStatus('running')
      raceStartRef.current = performance.now()
    }, 3000)
    return () => clearTimeout(t)
  }, [track])

  useEffect(() => { inventoryRef.current = inventory }, [inventory])

  const activePowerUpId = inventory.active?.id ?? null
  const speedMultiplier = activePowerUpId === 'thruster_surge' ? 2 : 1

  // Frame-level race logic: timer, gate checks, power-up expiry.
  useFrame(() => {
    const now = performance.now()

    // Expire + report power-up changes.
    const expired = expireIfDue(inventoryRef.current, now)
    if (expired !== inventoryRef.current) {
      inventoryRef.current = expired
      onInventoryChange(expired)
    }

    shipPosRef.current.copy(shipState.current.position)

    if (status === 'running' && raceStartRef.current !== null) {
      setElapsedMs(now - raceStartRef.current)

      // Gate pass/miss detection for the NEXT pending gate.
      const gIdx = nextGateIndex.current
      if (gIdx < track.gates.length) {
        const g = track.gates[gIdx]
        const ringPos = new THREE.Vector3(g.x, g.y, g.z)
        const ringForward = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(0, g.yaw ?? 0, 0))

        const curRel = new THREE.Vector3().copy(shipState.current.position).sub(ringPos)
        const prevRel = new THREE.Vector3().copy(prevShipPos.current).sub(ringPos)
        const dNow = curRel.dot(ringForward)
        const dPrev = prevRel.dot(ringForward)

        // crossed the ring plane this frame (either direction)
        const crossedPlane = Math.sign(dNow) !== Math.sign(dPrev) && Math.abs(dPrev - dNow) > 0.001

        // distance to ring centre in ring plane
        const planarDist = curRel.clone().addScaledVector(ringForward, -dNow).length()

        if (crossedPlane && planarDist <= GATE_COLLISION_DIST) {
          // Cleared!
          clearedGateAt(gIdx)
        } else if (activePowerUpId === 'null_drift' && !inventoryRef.current.active?.oneShotConsumed) {
          // Null Drift: auto-clear next gate when within 40 units.
          const d = shipState.current.position.distanceTo(ringPos)
          if (d < 40) {
            clearedGateAt(gIdx)
            const consumed = consumeOneShot(inventoryRef.current, 'null_drift')
            inventoryRef.current = consumed
            onInventoryChange(consumed)
          }
        } else {
          // Missed if we passed the gate plane outside the ring radius.
          if (crossedPlane && planarDist > GATE_COLLISION_DIST) {
            setGateStatuses(prev => {
              if (prev[gIdx] !== 'pending') return prev
              const next = [...prev]
              next[gIdx] = 'missed'
              return next
            })
          }
        }
      }

      prevShipPos.current.copy(shipState.current.position)
    }
  })

  function clearedGateAt(idx: number) {
    setGateStatuses(prev => {
      if (prev[idx] !== 'pending' && prev[idx] !== 'missed') return prev
      const next = [...prev]
      next[idx] = 'cleared'
      return next
    })
    nextGateIndex.current = idx + 1
    if (idx + 1 >= track.gates.length) {
      setStatus('finished')
    }
  }

  // Publish race state up to wrapper whenever it changes.
  useEffect(() => {
    const cleared = gateStatuses.filter(s => s === 'cleared').length
    const missed = gateStatuses.filter(s => s === 'missed').length
    onRaceStateChange({ status, elapsedMs, clearedGates: cleared, missedGates: missed, gateStatuses })
  }, [status, elapsedMs, gateStatuses, onRaceStateChange])

  function handlePowerUpKey() {
    const now = performance.now()
    const activated = activateNextPowerUp(inventoryRef.current, now)
    if (activated !== inventoryRef.current) {
      inventoryRef.current = activated
      onInventoryChange(activated)
    }
  }

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

      <PowerUpVisual shipGroup={shipGroup} active={inventory.active} />

      <CameraManager ship={shipState} shipSize={shipSize} />
      <SpeedRunControls
        ship={shipState}
        shipGroup={shipGroup}
        enabled={status === 'running'}
        speedMultiplier={speedMultiplier}
        onPowerUpKey={handlePowerUpKey}
      />

      {track.gates.map((g, i) => (
        <GateRing
          key={i}
          index={i}
          position={[g.x, g.y, g.z]}
          yaw={g.yaw ?? 0}
          status={gateStatuses[i]}
          isNext={i === nextGateIndex.current}
          shipPosition={shipPosRef}
        />
      ))}
    </>
  )
}
