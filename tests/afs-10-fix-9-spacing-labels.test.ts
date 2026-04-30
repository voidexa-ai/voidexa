import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

describe('AFS-10-FIX-9 — spacing rebalance', () => {
  it('all satellite distances are between 15 and 65 from origin', () => {
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      const [x, y, z] = node.position
      const distance = Math.sqrt(x * x + y * y + z * z)
      expect(distance).toBeGreaterThan(15)
      expect(distance).toBeLessThan(65)
    }
  })

  it('no satellite sits closer than 15 units to origin (no sun crowding)', () => {
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      const [x, y, z] = node.position
      const distance = Math.sqrt(x * x + y * y + z * z)
      expect(distance).toBeGreaterThan(15)
    }
  })

  it('no satellite sits beyond 65 units from origin (no isolation)', () => {
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      const [x, y, z] = node.position
      const distance = Math.sqrt(x * x + y * y + z * z)
      expect(distance).toBeLessThan(65)
    }
  })

  it('voidexa position unchanged at origin (size bumped to 3.5 in FIX-12)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
    expect(voidexa.size).toBeCloseTo(3.5, 1)
  })

  it('all 10 nodes preserved (no cleanup regression)', () => {
    expect(STAR_MAP_NODES.length).toBe(10)
    const expectedIds = [
      'voidexa', 'station', 'apps', 'quantum', 'trading-hub',
      'services', 'game-hub', 'ai-tools', 'contact', 'claim-your-planet',
    ]
    expect(STAR_MAP_NODES.map(n => n.id).sort()).toEqual(expectedIds.sort())
  })
})

describe('AFS-10-FIX-9 — label readability bump (current state via FIX-12)', () => {
  const NODE_MESH_SRC = readFileSync(
    join(__dirname, '..', 'components', 'starmap', 'NodeMesh.tsx'),
    'utf-8',
  )

  it('main label fontSize at FIX-12 values — center 45px / satellite 39px', () => {
    expect(NODE_MESH_SRC).toMatch(/fontSize:\s*isCenter\s*\?\s*'45px'\s*:\s*'39px'/)
  })

  it('subtitle fontSize at FIX-12 value 35px', () => {
    expect(NODE_MESH_SRC).toMatch(/fontSize:\s*'35px'/)
  })

  it('previous FIX-8/9/10 fontSize values no longer present (regression guard)', () => {
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*isCenter\s*\?\s*'18px'\s*:\s*'15px'/)
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*isCenter\s*\?\s*'27px'\s*:\s*'23px'/)
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*isCenter\s*\?\s*'35px'\s*:\s*'30px'/)
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*'14px'/)
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*'21px'/)
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*'27px'/)
  })
})
