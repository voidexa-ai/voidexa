import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

describe('AFS-10-FIX-8 — planet scale increase', () => {
  it('voidexa sun has the largest apparent screen size (camera-distance-aware)', () => {
    // After AFS-10-FIX-8 asymmetric multipliers (1.5x sun, 3.5x satellites),
    // raw node-size sun (0.9) is smaller than the largest satellite (1.23).
    // Sun stays visually dominant only because it sits at origin while the
    // system camera at [0, 0, 12] is much closer to the sun than to any
    // satellite (which all sit at z ≤ -10). Apparent screen size ∝
    // node.size / camera_distance.
    const cam: [number, number, number] = [0, 0, 12]
    const apparent = (n: { size: number; position: [number, number, number] }) => {
      const [x, y, z] = n.position
      const d = Math.sqrt(
        (x - cam[0]) ** 2 + (y - cam[1]) ** 2 + (z - cam[2]) ** 2,
      )
      return n.size / d
    }
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    const voidexaApparent = apparent(voidexa)
    for (const node of satellites) {
      expect(voidexaApparent).toBeGreaterThan(apparent(node))
    }
  })

  it('raw size ratio voidexa:avg-satellite is in expected post-FIX-8 band', () => {
    // 1.5x sun + 3.5x satellites narrows the raw-size ratio below 1.
    // Pre-FIX-8 was 0.6 / 0.30 = 2.0; post-FIX-8 is 0.9 / ~1.05 ≈ 0.86.
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    const avgSatelliteSize = satellites.reduce((s, n) => s + n.size, 0) / satellites.length
    const ratio = voidexa.size / avgSatelliteSize
    expect(ratio).toBeGreaterThan(0.7)
    expect(ratio).toBeLessThan(1.0)
  })

  it('satellite planets are bigger than 0.5 unit (post FIX-8 floor)', () => {
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeGreaterThan(0.5)
    }
  })

  it('satellite distances from origin are scaled (no clustering at center)', () => {
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      const [x, y, z] = node.position
      const distance = Math.sqrt(x * x + y * y + z * z)
      expect(distance).toBeGreaterThan(2.0)
    }
  })

  it('voidexa size is exactly 0.9 (was 0.6, x1.5 multiplier)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBe(0.9)
  })

  it('voidexa position unchanged at [0, 0, 0]', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
  })

  it('apps node is at scaled position with size 1.23', () => {
    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(1.23, 2)
    expect(apps.position).toEqual([-8, 3, -12])
  })

  it('claim-your-planet (farthest) sits within scaled OrbitControls reach', () => {
    const cyp = STAR_MAP_NODES.find(n => n.id === 'claim-your-planet')!
    const [x, y, z] = cyp.position
    const distance = Math.sqrt(x * x + y * y + z * z)
    // After 2x position multiplier, must stay under StarMapScene
    // OrbitControls maxDistance (bumped to 80 in this sprint).
    expect(distance).toBeLessThan(80)
  })
})
