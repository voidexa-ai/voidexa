'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import FreeFlightScene from './FreeFlightScene'
import type { ShipState, StationDef, DerelictDef } from './types'
import type { CockpitModelSpec } from '@/lib/data/shipCockpits'
import type { MissionWaypoint } from '@/lib/game/missions/waypoints'
import type { LandmarkDef } from '@/lib/game/freeflight/landmarks'
import type { NPCDef } from '@/lib/game/freeflight/npcs'

interface Props {
  onShipState: (ship: React.MutableRefObject<ShipState>) => void
  onDockStationChange?: (station: StationDef | null) => void
  onNearDerelictChange?: (derelict: DerelictDef | null) => void
  onNebulaChange?: (color: string | null) => void
  onWarpJump?: (fromId: string, toId: string) => void
  onFirstPersonChange?: (fp: boolean) => void
  onNearLandmarkChange?: (landmark: LandmarkDef | null) => void
  onNearNPCChange?: (npc: NPCDef | null, hostile: boolean) => void
  shipUrl: string
  shipScale: number
  cockpitUrl: string
  cockpitSpec?: CockpitModelSpec
  missionWaypoints?: readonly MissionWaypoint[]
  missionWaypointIndex?: number
  onMissionWaypointCleared?: (index: number) => void
}

export default function FreeFlightCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [60, 15, 80], fov: 72, near: 0.1, far: 3000 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100vw', height: '100vh', background: '#02030a' }}
    >
      <Suspense fallback={null}>
        <FreeFlightScene
          {...props}
          missionWaypoints={props.missionWaypoints}
          missionWaypointIndex={props.missionWaypointIndex}
          onMissionWaypointCleared={props.onMissionWaypointCleared}
          onNearLandmarkChange={props.onNearLandmarkChange}
          onNearNPCChange={props.onNearNPCChange}
        />
      </Suspense>
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur radius={0.7} />
        <Vignette darkness={0.55} offset={0.25} />
      </EffectComposer>
    </Canvas>
  )
}
