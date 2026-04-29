import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, test } from 'vitest'

const NODE_MESH = readFileSync(
  resolve(__dirname, '../components/starmap/NodeMesh.tsx'),
  'utf-8',
)
const NODES = readFileSync(
  resolve(__dirname, '../components/starmap/nodes.ts'),
  'utf-8',
)

describe('AFS-10-FIX-2 — Quantum Saturn rings', () => {
  test('Quantum branch renders <ringGeometry>', () => {
    expect(NODE_MESH).toMatch(/node\.id === 'quantum'[\s\S]*?ringGeometry/)
  })

  test('Ring args use size * 1.6 inner and size * 2.4 outer with 64 segments', () => {
    expect(NODE_MESH).toMatch(
      /ringGeometry args=\{\[size \* 1\.6, size \* 2\.4, 64\]\}/,
    )
  })

  test('Ring uses tan double-sided meshBasicMaterial with opacity 0.75', () => {
    const block = NODE_MESH.match(
      /node\.id === 'quantum'[\s\S]*?<\/mesh>/,
    )?.[0] ?? ''
    expect(block).toContain('color="#d4b88a"')
    expect(block).toContain('side={THREE.DoubleSide}')
    expect(block).toContain('opacity={0.75}')
    expect(block).toContain('depthWrite={false}')
  })
})

describe('AFS-10-FIX-2 — Space Station 3D upgrade', () => {
  test('Station node has texture path in nodes.ts', () => {
    expect(NODES).toMatch(
      /id: 'station'[\s\S]*?texture: '\/textures\/planets\/spacestation_planet\.png'/,
    )
  })

  test('Station HTML thumbnail and /images/space-station.jpg are removed', () => {
    expect(NODE_MESH).not.toContain('/images/space-station.jpg')
    expect(NODE_MESH).not.toContain('alt="Space Station"')
  })

  test('Station has new metallic torus orbital ring at size * 1.8', () => {
    expect(NODE_MESH).toMatch(
      /torusGeometry args=\{\[size \* 1\.8, size \* 0\.08, 16, 64\]\}/,
    )
    expect(NODE_MESH).toContain('color="#88aabb"')
  })

  test('Station has 4 module boxes at cardinal angles', () => {
    expect(NODE_MESH).toMatch(/\[0, Math\.PI \/ 2, Math\.PI, Math\.PI \* 1\.5\]/)
    expect(NODE_MESH).toMatch(
      /boxGeometry args=\{\[size \* 0\.2, size \* 0\.15, size \* 0\.2\]\}/,
    )
    expect(NODE_MESH).toContain('color="#aaccdd"')
  })

  test('Existing thin stationRingRef torus is preserved', () => {
    expect(NODE_MESH).toMatch(/torusGeometry args=\{\[size \* 2\.2, 0\.018, 8, 48\]\}/)
    expect(NODE_MESH).toContain('ref={stationRingRef}')
  })
})
