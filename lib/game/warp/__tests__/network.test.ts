import { describe, it, expect } from 'vitest'
import {
  buildWarpGraph,
  warpCost,
  warpDistance,
  findNode,
  WARP_MIN_COST,
  WARP_MAX_COST,
} from '../network'
import { LANDMARKS } from '@/lib/game/freeflight/landmarks'

describe('warp network', () => {
  it('graph has at least 10 warp-eligible nodes (Core + Inner Ring)', () => {
    const g = buildWarpGraph()
    expect(g.length).toBeGreaterThanOrEqual(10)
  })

  it('graph excludes Mid Ring / Outer Ring / Deep Void landmarks', () => {
    const g = buildWarpGraph()
    for (const node of g) {
      expect(['Core Zone', 'Inner Ring']).toContain(node.zone)
    }
  })

  it('graph includes the synthetic voidexa_hub at origin', () => {
    const g = buildWarpGraph()
    const hub = g.find(n => n.id === 'voidexa_hub')
    expect(hub).toBeDefined()
    expect(hub?.x).toBe(0)
    expect(hub?.y).toBe(0)
    expect(hub?.z).toBe(0)
  })

  it('includes all Core Zone landmarks from Sprint 2 catalog', () => {
    const g = buildWarpGraph()
    const coreLandmarks = LANDMARKS.filter(l => l.zone === 'Core Zone')
    for (const l of coreLandmarks) {
      expect(g.find(n => n.id === l.id)).toBeDefined()
    }
  })
})

describe('warpCost', () => {
  const g = buildWarpGraph()

  it('same-node cost is 0', () => {
    const a = g[0]
    expect(warpCost(a, a)).toBe(0)
  })

  it('respects the 30 minimum', () => {
    // Pick two close nodes.
    const a = g[0]
    const b = g.find(n => n.id !== a.id && warpDistance(a, n) < 60)!
    const cost = warpCost(a, b)
    expect(cost).toBeGreaterThanOrEqual(WARP_MIN_COST)
  })

  it('respects the 180 maximum', () => {
    // Farthest pair in the graph.
    let maxCost = 0
    for (const a of g) {
      for (const b of g) {
        if (a.id === b.id) continue
        maxCost = Math.max(maxCost, warpCost(a, b))
      }
    }
    expect(maxCost).toBeLessThanOrEqual(WARP_MAX_COST)
  })

  it('is symmetric', () => {
    const [a, b] = [g[0], g[g.length - 1]]
    expect(warpCost(a, b)).toBe(warpCost(b, a))
  })

  it('is deterministic for the same pair', () => {
    const [a, b] = [g[0], g[1]]
    const c1 = warpCost(a, b)
    const c2 = warpCost(a, b)
    expect(c1).toBe(c2)
  })
})

describe('findNode', () => {
  it('returns a node for a known id', () => {
    expect(findNode('voidexa_hub')?.name).toBe('voidexa Hub')
  })

  it('returns undefined for unknown ids', () => {
    expect(findNode('no_such_station')).toBeUndefined()
  })

  it('never returns a Deep Void node', () => {
    expect(findNode('deep_void_landmark')).toBeUndefined()
  })
})
