import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

describe('AFS-10-FIX-8 — planet scale increase', () => {
  it('voidexa is the largest body by raw size or matched by 1 satellite (apps)', () => {
    // FIX-12 flipped camera to depth-perspective POV [0, 5, -90] looking
    // toward voidexa at [0, 0, 0]. From this side, claim/trading-hub/quantum
    // sit BETWEEN camera and voidexa, so they appear larger on screen by
    // depth perspective (intentional). The original "voidexa apparent-largest"
    // invariant no longer holds — it was camera-dependent.
    //
    // Replacement: raw-size invariant. From geometry alone (camera-independent),
    // at most 1 satellite (apps, matched at 3.5) is as large as voidexa (3.5).
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    const biggerOrEqual = satellites.filter(n => n.size >= voidexa.size)
    expect(biggerOrEqual.length).toBeLessThanOrEqual(1)
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

  it('voidexa size is exactly 3.5 (FIX-12 bumped from 1.8 for new POV)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBe(3.5)
  })

  it('voidexa position unchanged at [0, 0, 0]', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
  })

  it('apps node is at scaled position with size 3.5', () => {
    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    // FIX-12 bumped apps to 3.5 (matches voidexa — pink gas giant
    // prominence per Jix reference image).
    expect(apps.size).toBeCloseTo(3.5, 1)
    // FIX-9 rebalanced position from [-8,3,-12] to [-12,4.5,-18]
    // (current x 1.5 = original x 3 — pulls near cluster away from sun).
    expect(apps.position).toEqual([-12, 4.5, -18])
  })

  it('claim-your-planet (farthest) sits within scaled OrbitControls reach', () => {
    const cyp = STAR_MAP_NODES.find(n => n.id === 'claim-your-planet')!
    const [x, y, z] = cyp.position
    const distance = Math.sqrt(x * x + y * y + z * z)
    // FIX-12 bumped maxDistance to 150 (camera at distance ~90 from
    // origin target on the negative-z side). claim-your-planet is at
    // distance ~62.94 from origin — well within.
    expect(distance).toBeLessThan(150)
  })
})
