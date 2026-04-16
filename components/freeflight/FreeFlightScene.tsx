'use client'

import { useRef, useState } from 'react'
import * as THREE from 'three'
import { Stars } from '@react-three/drei'
import ShipLoader from './ships/ShipLoader'
import BoostTrail from './ships/BoostTrail'
import FlightControls from './controls/FlightControls'
import CameraManager from './controls/CameraManager'
import AsteroidField from './environment/AsteroidField'
import PlanetCollision from './environment/PlanetCollision'
import SpaceStations from './environment/SpaceStation'
import NPCManager from './environment/NPCManager'
import NebulaZones from './environment/NebulaZones'
import DerelictShips from './environment/DerelictShips'
import WarpGates from './environment/WarpGates'
import CockpitModel from './cockpit/CockpitModel'
import ModelErrorBoundary from './ModelErrorBoundary'
import MissionRunner from './MissionRunner'
import Landmarks from './environment/Landmarks'
import NamedNPCs from './environment/NamedNPCs'
import ExplorationEncounters from './environment/ExplorationEncounters'
import { PLANETS, createShipState, type StationDef, type DerelictDef } from './types'
import type { CockpitModelSpec } from '@/lib/data/shipCockpits'
import type { MissionWaypoint } from '@/lib/game/missions/waypoints'
import type { LandmarkDef } from '@/lib/game/freeflight/landmarks'
import type { NPCDef } from '@/lib/game/freeflight/npcs'
import type { ExplorationEncounter } from '@/lib/game/freeflight/explorationEncounters'

interface Props {
  onShipState: (ship: React.MutableRefObject<ReturnType<typeof createShipState>>) => void
  onDockStationChange?: (station: StationDef | null) => void
  onNearDerelictChange?: (derelict: DerelictDef | null) => void
  onNebulaChange?: (color: string | null) => void
  onWarpJump?: (fromId: string, toId: string) => void
  onFirstPersonChange?: (fp: boolean) => void
  onNearLandmarkChange?: (landmark: LandmarkDef | null) => void
  onNearNPCChange?: (npc: NPCDef | null, hostile: boolean) => void
  onEncounterTrigger?: (enc: ExplorationEncounter) => void
  resolvedEncounterIds?: ReadonlySet<string>
  shipUrl: string
  shipScale: number
  cockpitUrl: string
  cockpitSpec?: CockpitModelSpec
  missionWaypoints?: readonly MissionWaypoint[]
  missionWaypointIndex?: number
  onMissionWaypointCleared?: (index: number) => void
}

export default function FreeFlightScene({
  onShipState,
  onDockStationChange,
  onNearDerelictChange,
  onNebulaChange,
  onWarpJump,
  onFirstPersonChange,
  shipUrl,
  shipScale,
  cockpitUrl,
  cockpitSpec,
  missionWaypoints,
  missionWaypointIndex = 0,
  onMissionWaypointCleared,
  onNearLandmarkChange,
  onNearNPCChange,
  onEncounterTrigger,
  resolvedEncounterIds,
}: Props) {
  const shipRef = useRef(createShipState())
  const shipGroupRef = useRef<THREE.Group>(null)
  const [firstPerson, setFirstPerson] = useState(false)
  const [shipSize, setShipSize] = useState(4)

  const registered = useRef(false)
  if (!registered.current) {
    registered.current = true
    onShipState(shipRef)
  }

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[50, 40, 30]} intensity={0.8} color="#ffe6c8" />

      <Stars radius={1200} depth={600} count={3500} factor={4} saturation={0} fade speed={0.5} />

      {PLANETS.map(p => (
        <group key={p.id} position={p.position.toArray()}>
          <mesh>
            <sphereGeometry args={[p.radius, 32, 32]} />
            <meshStandardMaterial
              color={p.id === 'voidexa' ? '#041025' : '#1a2a40'}
              emissive={p.id === 'voidexa' ? '#00ffff' : '#0040aa'}
              emissiveIntensity={p.id === 'voidexa' ? 2.5 : 0.6}
              roughness={0.6}
              toneMapped={false}
            />
          </mesh>
          <mesh scale={1.15} raycast={() => null}>
            <sphereGeometry args={[p.radius, 24, 24]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.08} side={THREE.BackSide} toneMapped={false} />
          </mesh>
        </group>
      ))}

      <ShipLoader
        ref={shipGroupRef}
        ship={shipRef}
        visible={!firstPerson}
        url={shipUrl}
        scale={shipScale}
        onSize={setShipSize}
      />

      <BoostTrail ship={shipRef} />

      <FlightControls ship={shipRef} shipGroup={shipGroupRef} enabled={true} />
      <CameraManager
        ship={shipRef}
        shipSize={shipSize}
        onModeChange={(fp) => { setFirstPerson(fp); onFirstPersonChange?.(fp) }}
      />

      <ModelErrorBoundary>
        <CockpitModel visible={firstPerson} url={cockpitUrl} spec={cockpitSpec} />
      </ModelErrorBoundary>

      <PlanetCollision ship={shipRef} />
      <AsteroidField ship={shipRef} />
      <NebulaZones ship={shipRef} onNebulaChange={onNebulaChange} />
      <SpaceStations ship={shipRef} onDockStationChange={onDockStationChange} />
      <ModelErrorBoundary>
        <DerelictShips ship={shipRef} onNearChange={onNearDerelictChange} />
      </ModelErrorBoundary>
      <WarpGates ship={shipRef} onJump={onWarpJump} />
      <ModelErrorBoundary>
        <NPCManager />
      </ModelErrorBoundary>

      {missionWaypoints && missionWaypoints.length > 0 && onMissionWaypointCleared && (
        <MissionRunner
          ship={shipRef}
          waypoints={missionWaypoints}
          currentIndex={missionWaypointIndex}
          onCleared={onMissionWaypointCleared}
        />
      )}

      <Landmarks ship={shipRef} onNearChange={onNearLandmarkChange} />
      <NamedNPCs ship={shipRef} onNearChange={onNearNPCChange} />
      <ExplorationEncounters
        ship={shipRef}
        resolvedIds={resolvedEncounterIds ?? new Set()}
        onTrigger={onEncounterTrigger}
      />
    </>
  )
}
