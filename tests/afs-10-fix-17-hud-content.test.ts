import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

const STARMAP_DIR = resolve(__dirname, '..', 'components', 'starmap')
const NODE_MESH_SRC = readFileSync(resolve(STARMAP_DIR, 'NodeMesh.tsx'), 'utf-8')
const HUD_SRC = readFileSync(resolve(STARMAP_DIR, 'HoverHUD.tsx'), 'utf-8')

describe('AFS-10-FIX-17 — HUD content map + label fontSize bump', () => {
  it('NodeMesh.tsx uses 64px sun and 56px satellite fontSize', () => {
    expect(NODE_MESH_SRC).toMatch(/fontSize:\s*isCenter\s*\?\s*'64px'\s*:\s*'56px'/)
    // Old FIX-16 values should be gone from main label
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*isCenter\s*\?\s*'48px'\s*:\s*'42px'/)
  })

  it('NodeMesh.tsx still has distanceFactor=16 (NOT removed — FIX-14 lesson)', () => {
    // The decorative ring AND the label both keep distanceFactor=16, so
    // we expect at least 2 occurrences. Catches accidental removal.
    const matches = NODE_MESH_SRC.match(/distanceFactor=\{16\}/g) || []
    expect(matches.length).toBeGreaterThanOrEqual(2)
  })

  it('HoverHUD.tsx has HUD_CONTENT map with all 10 node ids as keys', () => {
    expect(HUD_SRC).toMatch(/HUD_CONTENT/)
    const expectedIds = [
      'voidexa', 'apps', 'quantum', 'trading-hub', 'services',
      'game-hub', 'ai-tools', 'contact', 'station', 'claim-your-planet',
    ]
    // Quotes are optional — bare-identifier ids (voidexa, apps, ...) are
    // unquoted in the object literal; hyphenated ids (trading-hub, ...)
    // must be quoted. Match either form.
    for (const id of expectedIds) {
      expect(HUD_SRC).toMatch(new RegExp(`['"\`]?${id}['"\`]?\\s*:\\s*\\{`))
    }
  })

  it('HoverHUD.tsx mentions ecosystem mission (voidexa body) and Quantum sub-products', () => {
    expect(HUD_SRC).toMatch(/Sovereign AI Infrastructure/)
    expect(HUD_SRC).toMatch(/4 AIs/)
    expect(HUD_SRC).toMatch(/Council/)
    expect(HUD_SRC).toMatch(/Forge/)
    expect(HUD_SRC).toMatch(/Void Pro AI/)
  })

  it('HoverHUD.tsx renders content.title / content.body / content.cta (per-node lookup)', () => {
    expect(HUD_SRC).toMatch(/\{content\.title\}/)
    expect(HUD_SRC).toMatch(/\{content\.body\}/)
    expect(HUD_SRC).toMatch(/\{content\.cta\}/)
    // Old hardcoded "Click to enter" CTA should be gone — replaced by per-node value.
    expect(HUD_SRC).not.toMatch(/→\s*Click to enter\s*</)
  })

  it('HoverHUD.tsx still uses same-side logic from FIX-16', () => {
    expect(HUD_SRC).toMatch(/isPlanetOnLeft\s*\?\s*['"]left['"]\s*:\s*['"]right['"]/)
  })

  it('HoverHUD.tsx design tokens UNCHANGED from FIX-15/16', () => {
    expect(HUD_SRC).toMatch(/#00d4ff/)
    expect(HUD_SRC).toMatch(/rgba\(10,\s*14,\s*28/)
    expect(HUD_SRC).toMatch(/360/)
    expect(HUD_SRC).toMatch(/rgba\(0,\s*212,\s*255/)
  })

  it('all 10 nodes preserved + voidexa size 5.0 (FIX-16 invariant) + positions UNCHANGED', () => {
    expect(STAR_MAP_NODES.length).toBe(10)

    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(5.0, 1)

    const contact = STAR_MAP_NODES.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])

    const station = STAR_MAP_NODES.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])

    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.position).toEqual([-12, 4.5, -18])
  })
})
