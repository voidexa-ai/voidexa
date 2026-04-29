import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, test } from 'vitest'

const GLOBAL_STARFIELD = readFileSync(
  resolve(__dirname, '../components/layout/GlobalStarfield.tsx'),
  'utf-8',
)
const STARMAP_SCENE = readFileSync(
  resolve(__dirname, '../components/starmap/StarMapScene.tsx'),
  'utf-8',
)
const GALAXY_SCENE = readFileSync(
  resolve(__dirname, '../components/galaxy/GalaxyScene.tsx'),
  'utf-8',
)

describe('AFS-10-FIX-5 — GlobalStarfield path guard', () => {
  test('GlobalStarfield skips on /starmap', () => {
    expect(GLOBAL_STARFIELD).toMatch(/pathname === '\/starmap'/)
  })

  test('GlobalStarfield skips on /starmap subroutes via startsWith', () => {
    expect(GLOBAL_STARFIELD).toMatch(/pathname\.startsWith\('\/starmap\/'\)/)
  })

  test('Original homepage skip preserved', () => {
    expect(GLOBAL_STARFIELD).toMatch(/pathname === '\/'/)
  })

  test('3 radial gradient divs and ParticleField still present (left intact for non-starmap routes)', () => {
    const matches = GLOBAL_STARFIELD.match(/radial-gradient/g) ?? []
    expect(matches.length).toBeGreaterThanOrEqual(3)
    expect(GLOBAL_STARFIELD).toMatch(/<ParticleField\s*\/>/)
  })
})

describe('AFS-10-FIX-5 — R3F StarField removal', () => {
  test('StarMapScene no longer defines function StarField', () => {
    expect(STARMAP_SCENE).not.toMatch(/^function StarField\(\)/m)
  })

  test('StarMapScene no longer renders <StarField />', () => {
    expect(STARMAP_SCENE).not.toMatch(/<StarField\b/)
  })

  test('GalaxyScene no longer defines function StarField', () => {
    expect(GALAXY_SCENE).not.toMatch(/^function StarField\(\)/m)
  })

  test('GalaxyScene no longer renders <StarField />', () => {
    expect(GALAXY_SCENE).not.toMatch(/<StarField\b/)
  })
})

describe('AFS-10-FIX-5 — AmbientDust removal (system view symmetry)', () => {
  test('StarMapScene no longer defines function AmbientDust', () => {
    expect(STARMAP_SCENE).not.toMatch(/^function AmbientDust\(\)/m)
  })

  test('StarMapScene no longer renders <AmbientDust />', () => {
    expect(STARMAP_SCENE).not.toMatch(/<AmbientDust\b/)
  })
})

describe('AFS-10-FIX-5 — load-bearing scene content preserved', () => {
  test('NebulaBg still rendered in StarMapScene', () => {
    expect(STARMAP_SCENE).toMatch(/<NebulaBg\s*\/>/)
  })

  test('NebulaBg still rendered in GalaxyScene', () => {
    expect(GALAXY_SCENE).toMatch(/<NebulaBg\s*\/>/)
  })

  test('Constellations stay in GalaxyScene', () => {
    expect(GALAXY_SCENE).toMatch(/<Constellations\b/)
  })

  test('ConstellationLines + EnergyPulses stay in StarMapScene', () => {
    expect(STARMAP_SCENE).toMatch(/<ConstellationLines\s*\/>/)
    expect(STARMAP_SCENE).toMatch(/<EnergyPulses\s*\/>/)
  })
})
