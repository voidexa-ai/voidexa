'use client'

import { useRef, useState } from 'react'
import * as THREE from 'three'
import { Stars } from '@react-three/drei'
import ShipModel from './ships/ShipModel'
import FlightControls from './controls/FlightControls'
import CameraManager from './controls/CameraManager'
import AsteroidField from './environment/AsteroidField'
import SpaceStations from './environment/SpaceStation'
import NPCManager from './environment/NPCManager'
import { PLANETS, createShipState } from './types'

interface Props {
  onShipState: (ship: React.MutableRefObject<ReturnType<typeof createShipState>>) => void
  onDockPromptChange?: (name: string | null) => void
  onFirstPersonChange?: (fp: boolean) => void
}

export default function FreeFlightScene({ onShipState, onDockPromptChange, onFirstPersonChange }: Props) {
  const shipRef = useRef(createShipState())
  const shipGroupRef = useRef<THREE.Group>(null)
  const [firstPerson, setFirstPerson] = useState(false)

  // Register ship ref upward once
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

      {/* Planets */}
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

      <ShipModel ref={shipGroupRef} visible={!firstPerson} />

      <FlightControls ship={shipRef} shipGroup={shipGroupRef} enabled={true} />
      <CameraManager
        ship={shipRef}
        onModeChange={(fp) => { setFirstPerson(fp); onFirstPersonChange?.(fp) }}
      />

      <AsteroidField ship={shipRef} />
      <SpaceStations ship={shipRef} onDockPromptChange={onDockPromptChange} />
      <NPCManager />
    </>
  )
}
