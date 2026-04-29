'use client'

import { useMemo, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const TEXTURE_URL = '/textures/nebula-backdrop.png'
const SPHERE_RADIUS = 12000

export default function NebulaBg() {
  const { gl } = useThree()

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(TEXTURE_URL)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearMipMapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = true
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    return tex
  }, [gl])

  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  return (
    <mesh frustumCulled={false} renderOrder={-1000}>
      <sphereGeometry args={[SPHERE_RADIUS, 64, 32]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  )
}
