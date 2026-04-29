'use client'

import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import NebulaBg from '../starmap/NebulaBg'
import WarpStreaks from '../starmap/WarpStreaks'
import CompanyPlanetMesh from './CompanyPlanet'
import Constellations from './Constellations'
import { GALAXY_PLANETS } from './companies'

interface Props {
  highlightedId: string | null
  onHoverChange?: (id: string | null) => void
  onWarpChange?: (warping: boolean) => void
}

export default function GalaxyScene({ highlightedId, onHoverChange, onWarpChange }: Props) {
  const [warping, setWarping] = useState(false)

  const handleWarpStart = () => {
    setWarping(true)
    onWarpChange?.(true)
  }

  return (
    <>
      <NebulaBg />
      <ambientLight intensity={0.08} />
      <directionalLight position={[10, 10, 5]} intensity={0.2} color="#ffffff" />

      <WarpStreaks active={warping} />

      <Constellations planets={GALAXY_PLANETS} />

      {GALAXY_PLANETS.map(planet => (
        <CompanyPlanetMesh
          key={planet.id}
          planet={planet}
          onWarpStart={handleWarpStart}
          onHoverChange={onHoverChange}
          highlightedId={highlightedId}
        />
      ))}

      {!warping && (
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.15}
          enableZoom
          enablePan={false}
          minDistance={8}
          maxDistance={100}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
          target={[0, 0, 0]}
          makeDefault
        />
      )}
    </>
  )
}
