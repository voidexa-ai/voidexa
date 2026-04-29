import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

const NODES_SRC = readFileSync(
  join(process.cwd(), 'components', 'starmap', 'nodes.ts'),
  'utf8',
)
const SCENE_SRC = readFileSync(
  join(process.cwd(), 'components', 'starmap', 'StarMapScene.tsx'),
  'utf8',
)
const CANVAS_SRC = readFileSync(
  join(process.cwd(), 'components', 'starmap', 'StarMapCanvas.tsx'),
  'utf8',
)
const NODE_MESH_SRC = readFileSync(
  join(process.cwd(), 'components', 'starmap', 'NodeMesh.tsx'),
  'utf8',
)

const EXPECTED_PLANETS = [
  { id: 'voidexa',          path: '/home',                texture: 'voidexa.png',             isCenter: true,  size: 0.95 },
  { id: 'apps',             path: '/apps',                texture: 'pink.png',                isCenter: false },
  { id: 'services',         path: '/services',            texture: 'lilla.png',               isCenter: false },
  { id: 'station',          path: '/station',             texture: 'spacestation_planet.png', isCenter: false },
  { id: 'ai-tools',         path: '/ai-tools',            texture: 'earth.png',               isCenter: false },
  { id: 'contact',          path: '/contact',             texture: 'purpel-pink.png',         isCenter: false },
  { id: 'quantum',          path: '/quantum',             texture: 'saturen_like_rings.png',  isCenter: false },
  { id: 'trading-hub',      path: '/trading-hub',         texture: 'icy_blue.png',            isCenter: false },
  { id: 'game-hub',         path: '/game-hub',            texture: 'red_rocky.png',           isCenter: false },
  { id: 'claim-your-planet', path: '/claim-your-planet',  texture: 'pastel_green.png',        isCenter: false },
] as const

describe('AFS-10 starmap node config', () => {
  it('exports exactly 10 placed nodes', () => {
    expect(STAR_MAP_NODES).toHaveLength(10)
  })

  for (const expected of EXPECTED_PLANETS) {
    it(`node "${expected.id}" has the locked path + texture`, () => {
      const node = STAR_MAP_NODES.find(n => n.id === expected.id)
      expect(node, `node "${expected.id}" missing`).toBeDefined()
      expect(node!.path).toBe(expected.path)
      expect(node!.texture).toBe(`/textures/planets/${expected.texture}`)
      expect(node!.isCenter).toBe(expected.isCenter)
    })
  }

  it('voidexa-sun size bumped to 0.95 (was 0.6)', () => {
    const sun = STAR_MAP_NODES.find(n => n.id === 'voidexa')
    expect(sun?.size).toBe(0.95)
  })

  it('does not include retired nodes (trading, about, ghost-ai)', () => {
    const ids = STAR_MAP_NODES.map(n => n.id)
    expect(ids).not.toContain('trading')
    expect(ids).not.toContain('about')
    expect(ids).not.toContain('ghost-ai')
  })

  it('all 10 textures resolve to files on disk under public/textures/planets/', () => {
    for (const node of STAR_MAP_NODES) {
      expect(node.texture, `${node.id} missing texture field`).toBeDefined()
      const rel = node.texture!.replace(/^\//, '')
      const abs = join(process.cwd(), 'public', rel)
      expect(existsSync(abs), `${node.texture} does not exist on disk`).toBe(true)
    }
  })

  it('reserved textures orange.png + goldenblue.png stay on disk untouched', () => {
    const orange = join(process.cwd(), 'public', 'textures', 'planets', 'orange.png')
    const golden = join(process.cwd(), 'public', 'textures', 'planets', 'goldenblue.png')
    expect(existsSync(orange)).toBe(true)
    expect(existsSync(golden)).toBe(true)
  })

  it('reserved textures are NOT wired to any STAR_MAP_NODES entry', () => {
    const wired = STAR_MAP_NODES.map(n => n.texture)
    expect(wired).not.toContain('/textures/planets/orange.png')
    expect(wired).not.toContain('/textures/planets/goldenblue.png')
  })

  it('StarNode interface exposes optional texture field', () => {
    expect(NODES_SRC).toMatch(/texture\?\s*:\s*string/)
  })
})

describe('AFS-10 camera + zoom baseline', () => {
  it('StarMapCanvas camera starts at z=4 with FOV 48 (was z=8 fov=60)', () => {
    expect(CANVAS_SRC).toMatch(/position:\s*\[\s*0\s*,\s*0\s*,\s*4\s*\]/)
    expect(CANVAS_SRC).toMatch(/fov:\s*48/)
  })

  it('camera far plane stays at 20000 (unchanged)', () => {
    expect(CANVAS_SRC).toMatch(/far:\s*20000/)
  })

  it('OrbitControls minDistance lowered from 5 to 2.5', () => {
    expect(SCENE_SRC).toMatch(/minDistance=\{2\.5\}/)
  })

  it('OrbitControls maxDistance stays at 30 (unchanged)', () => {
    expect(SCENE_SRC).toMatch(/maxDistance=\{30\}/)
  })
})

describe('AFS-10 star renderer additive blending', () => {
  it('StarField pointsMaterial uses AdditiveBlending', () => {
    expect(SCENE_SRC).toMatch(/blending=\{THREE\.AdditiveBlending\}/)
  })

  it('StarField opacity bumped to 0.95 + depthWrite false', () => {
    expect(SCENE_SRC).toMatch(/opacity=\{0\.95\}/)
    expect(SCENE_SRC).toMatch(/depthWrite=\{false\}/)
  })
})

describe('AFS-10 NodeMesh texture wiring + Space Station 3D', () => {
  it('NodeMesh loads node.texture via THREE.TextureLoader', () => {
    expect(NODE_MESH_SRC).toMatch(/THREE\.TextureLoader\(\)/)
    expect(NODE_MESH_SRC).toMatch(/loader\.load\(node\.texture\)/)
  })

  it('NodeMesh applies texture as map on meshStandardMaterial', () => {
    expect(NODE_MESH_SRC).toMatch(/map=\{texture\s*\?\?\s*undefined\}/)
  })

  it('Space Station rendered as sphereGeometry, not boxGeometry', () => {
    expect(NODE_MESH_SRC).not.toMatch(/<boxGeometry/)
    expect(NODE_MESH_SRC).toMatch(/<sphereGeometry/)
  })

  it('Space Station orbital ring still rendered (TorusGeometry)', () => {
    expect(NODE_MESH_SRC).toMatch(/node\.id\s*===\s*'station'/)
    expect(NODE_MESH_SRC).toMatch(/<torusGeometry/)
  })

  it('legacy Html 2D thumbnail for station removed', () => {
    expect(NODE_MESH_SRC).not.toMatch(/space-station\.jpg/)
  })

  it('texture is disposed on unmount', () => {
    expect(NODE_MESH_SRC).toMatch(/texture\?\.dispose\(\)/)
  })
})
