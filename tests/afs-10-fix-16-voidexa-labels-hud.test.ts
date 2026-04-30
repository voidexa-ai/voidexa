import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

const STARMAP_DIR = resolve(__dirname, '..', 'components', 'starmap')
const NODE_MESH_SRC = readFileSync(resolve(STARMAP_DIR, 'NodeMesh.tsx'), 'utf-8')
const HUD_SRC = readFileSync(resolve(STARMAP_DIR, 'HoverHUD.tsx'), 'utf-8')

describe('AFS-10-FIX-16 — voidexa bump + label readability + HUD same-side', () => {
  it('voidexa size is 5.0 (aggressive bump from FIX-15 3.5)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(5.0, 1)
  })

  it('voidexa is strictly larger than every satellite', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    const satellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeLessThan(voidexa.size)
    }
  })

  it('apps no longer ties with voidexa (3.5 < 5.0)', () => {
    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)

    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(apps.size).toBeLessThan(voidexa.size)
  })

  it('NodeMesh.tsx uses 48px sun and 42px satellite fontSize (1.33x bump from FIX-15 36/30)', () => {
    expect(NODE_MESH_SRC).toMatch(/fontSize:\s*isCenter\s*\?\s*'48px'\s*:\s*'42px'/)
    // Old FIX-15 main-label values should be gone
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*isCenter\s*\?\s*'36px'\s*:\s*'30px'/)
  })

  it('NodeMesh.tsx still has distanceFactor=16 (NOT removed — FIX-14 lesson)', () => {
    // This regression guard catches an accidental removal of distanceFactor
    // like the one that broke FIX-14. The decorative ring AND the label both
    // keep distanceFactor=16, so we expect at least 2 occurrences.
    const matches = NODE_MESH_SRC.match(/distanceFactor=\{16\}/g) || []
    expect(matches.length).toBeGreaterThanOrEqual(2)
  })

  it('HoverHUD.tsx uses SAME-SIDE logic (planet left -> HUD left)', () => {
    // New same-side logic: isPlanetOnLeft ? 'left' : 'right'
    expect(HUD_SRC).toMatch(/isPlanetOnLeft\s*\?\s*['"]left['"]\s*:\s*['"]right['"]/)
    // Old FIX-15 opposite-side logic should NOT be present
    expect(HUD_SRC).not.toMatch(/isPlanetOnLeft\s*\?\s*['"]right['"]\s*:\s*['"]left['"]/)
  })

  it('HoverHUD design tokens UNCHANGED from FIX-15 (only side logic flipped)', () => {
    expect(HUD_SRC).toMatch(/#00d4ff/)              // line + accent color
    expect(HUD_SRC).toMatch(/rgba\(10,\s*14,\s*28/) // panel background
    expect(HUD_SRC).toMatch(/360/)                  // panel width
    expect(HUD_SRC).toMatch(/rgba\(0,\s*212,\s*255/) // border / glow accents
  })

  it('positions UNCHANGED from FIX-13', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])

    const contact = STAR_MAP_NODES.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])

    const station = STAR_MAP_NODES.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])

    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.position).toEqual([-12, 4.5, -18])
  })

  it('all 10 nodes preserved', () => {
    expect(STAR_MAP_NODES.length).toBe(10)
  })
})
