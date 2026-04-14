'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import NebulaBg from '../starmap/NebulaBg'
import WarpStreaks from '../starmap/WarpStreaks'
import CompanyPlanetMesh from './CompanyPlanet'
import Constellations from './Constellations'
import { GALAXY_PLANETS } from './companies'

// Local starfield — same style as Level 2
function StarField() {
  const count = 5000
  const { positions, sizes, twinkleFlags, phaseOffsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const twinkleFlags = new Float32Array(count)
    const phaseOffsets = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 55 + Math.random() * 15
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = 0.3 + Math.random() * 1.7
      twinkleFlags[i] = Math.random() < 0.1 ? 1 : 0
      phaseOffsets[i] = Math.random() * Math.PI * 2
    }
    return { positions, sizes, twinkleFlags, phaseOffsets }
  }, [])

  const sizesRef = useRef<THREE.BufferAttribute>(null)

  useFrame(({ clock }) => {
    if (!sizesRef.current) return
    const t = clock.elapsedTime
    const arr = sizesRef.current.array as Float32Array
    for (let i = 0; i < count; i++) {
      if (twinkleFlags[i] === 1) {
        arr[i] = sizes[i] * (0.6 + 0.4 * Math.sin(t * 2.5 + phaseOffsets[i]))
      }
    }
    sizesRef.current.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute ref={sizesRef} attach="attributes-size" args={[sizes.slice(), 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} color="#e8f0ff" transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

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

      <StarField />
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
          maxDistance={70}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
          target={[0, 0, 0]}
          makeDefault
        />
      )}
    </>
  )
}
