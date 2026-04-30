import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

describe('AFS-10-FIX-10 — planet size + label bump', () => {
  it('all satellite sizes are >= 1.25 (after 2x bump from FIX-9)', () => {
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeGreaterThanOrEqual(1.25)
    }
  })

  it('largest satellite size is between 2.0 and 4.0 (apps bumped to 3.5 in FIX-12)', () => {
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    const max = Math.max(...satellites.map(n => n.size))
    expect(max).toBeGreaterThanOrEqual(2.0)
    expect(max).toBeLessThanOrEqual(4.0)
  })

  it('voidexa sun size at 5.0 (FIX-16 bumped from 3.5 for sun dominance)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(5.0, 1)
  })

  it('voidexa position unchanged at origin', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
  })

  it('positions UNCHANGED from FIX-9 state — game-hub still at [9, 6, -15]', () => {
    const gameHub = STAR_MAP_NODES.find(n => n.id === 'game-hub')!
    expect(gameHub.position[0]).toBeCloseTo(9, 1)
    expect(gameHub.position[1]).toBeCloseTo(6, 1)
    expect(gameHub.position[2]).toBeCloseTo(-15, 1)
  })

  it('positions UNCHANGED — claim-your-planet still at [-18, -6, -60]', () => {
    const claim = STAR_MAP_NODES.find(n => n.id === 'claim-your-planet')!
    expect(claim.position[0]).toBeCloseTo(-18, 1)
    expect(claim.position[1]).toBeCloseTo(-6, 1)
    expect(claim.position[2]).toBeCloseTo(-60, 1)
  })

  it('all 10 nodes preserved', () => {
    expect(STAR_MAP_NODES.length).toBe(10)
  })

  it('no satellite is bigger than sun raw size × 4 (sanity)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeLessThan(voidexa.size * 4)
    }
  })
})
