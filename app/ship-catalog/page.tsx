'use client'

import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import catalogData from '@/public/data/ship-catalog.json'

interface ShipEntry {
  name: string
  displayName: string
  filename: string
  path: string
  category: 'hirez' | 'usc' | 'uscx' | 'qs'
  skinsCount: number
  fileSizeMb: number
}

const CATEGORY_LABEL: Record<string, string> = {
  hirez: 'Hi-Rez',
  usc: 'USC',
  uscx: 'USC Expansion',
  qs: 'Quaternius',
}
const CATEGORY_ORDER = ['hirez', 'usc', 'uscx', 'qs']
const CATEGORY_COLOR: Record<string, string> = {
  hirez: '#a855f7',
  usc: '#00d4ff',
  uscx: '#ff8b97',
  qs: '#66ff99',
}

function AutoRotateModel({ url }: { url: string }) {
  const { scene: gltfScene } = useGLTF(url)
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  const cloned = useMemo(() => {
    const c = gltfScene.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3())
      c.position.sub(center)
    }
    return c
  }, [gltfScene])

  useEffect(() => {
    if (!groupRef.current) return
    const box = new THREE.Box3().setFromObject(groupRef.current)
    if (box.isEmpty()) return
    const size = box.getSize(new THREE.Vector3())
    const r = Math.max(size.x, size.y, size.z) || 1
    const d = r * 2.0
    camera.position.set(d * 0.7, d * 0.35, d)
    camera.lookAt(0, 0, 0)
    ;(camera as THREE.PerspectiveCamera).near = Math.max(0.01, r * 0.02)
    ;(camera as THREE.PerspectiveCamera).far = r * 30
    ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
  }, [camera, cloned])

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.4
  })

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  )
}

function ShipCard({ ship }: { ship: ShipEntry }) {
  const color = CATEGORY_COLOR[ship.category] ?? '#00d4ff'
  return (
    <div
      style={{
        background: 'rgba(10, 8, 25, 0.95)',
        border: `1px solid ${color}40`,
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ width: '100%', height: 200, background: 'linear-gradient(180deg, #0d0a1f 0%, #060412 100%)' }}>
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 40 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 5]} intensity={0.8} />
          <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#a855f7" />
          <Suspense fallback={null}>
            <AutoRotateModel url={ship.path} />
          </Suspense>
        </Canvas>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#e5e5f0', marginBottom: 4 }}>{ship.displayName}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13, color: '#a9b4d0' }}>
          <span style={{ color, fontWeight: 500 }}>{CATEGORY_LABEL[ship.category]}</span>
          <span>{ship.skinsCount} skin{ship.skinsCount > 1 ? 's' : ''}</span>
          <span>{ship.fileSizeMb} MB</span>
        </div>
        <div style={{ fontSize: 12, color: '#707890', marginTop: 4, fontFamily: 'monospace' }}>{ship.filename}</div>
      </div>
    </div>
  )
}

export default function ShipCatalogPage() {
  const [filterCat, setFilterCat] = useState<string | null>(null)
  const ships = catalogData as ShipEntry[]

  const filtered = useMemo(() => {
    if (!filterCat) return ships
    return ships.filter((s) => s.category === filterCat)
  }, [ships, filterCat])

  const grouped = useMemo(() => {
    const g = new Map<string, ShipEntry[]>()
    for (const s of filtered) {
      const arr = g.get(s.category) ?? []
      arr.push(s)
      g.set(s.category, arr)
    }
    return g
  }, [filtered])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0d0a1f 0%, #060412 100%)',
        color: '#e5e5f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#00d4ff', letterSpacing: 1.5, margin: 0 }}>
            Ship Catalog
          </h1>
          <p style={{ fontSize: 14, color: '#a9b4d0', margin: '6px 0 20px', opacity: 0.75 }}>
            {ships.length} unique ship types · {ships.reduce((s, e) => s + e.skinsCount, 0)} total skins · Internal reference
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <FilterPill active={!filterCat} onClick={() => setFilterCat(null)} label="All" color="#e5e5f0" />
            {CATEGORY_ORDER.map((cat) => (
              <FilterPill
                key={cat}
                active={filterCat === cat}
                onClick={() => setFilterCat(filterCat === cat ? null : cat)}
                label={CATEGORY_LABEL[cat]}
                color={CATEGORY_COLOR[cat]}
              />
            ))}
          </div>
        </header>

        {CATEGORY_ORDER.filter((cat) => grouped.has(cat)).map((cat) => (
          <section key={cat} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, color: CATEGORY_COLOR[cat], fontWeight: 600, marginBottom: 14, letterSpacing: 0.8 }}>
              {CATEGORY_LABEL[cat]} <span style={{ opacity: 0.5, fontWeight: 400 }}>({grouped.get(cat)!.length})</span>
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              {grouped.get(cat)!.map((ship) => (
                <ShipCard key={ship.name} ship={ship} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function FilterPill({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        border: active ? `1px solid ${color}` : '1px solid rgba(168, 85, 247, 0.35)',
        background: active ? `${color}22` : 'transparent',
        color: active ? color : '#cbd2e6',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
