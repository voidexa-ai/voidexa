import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, test } from 'vitest'

const NEBULA_BG = readFileSync(
  resolve(__dirname, '../components/starmap/NebulaBg.tsx'),
  'utf-8',
)
const STAR_MAP_PAGE = readFileSync(
  resolve(__dirname, '../components/starmap/StarMapPage.tsx'),
  'utf-8',
)
const GALAXY_PAGE = readFileSync(
  resolve(__dirname, '../components/galaxy/GalaxyPage.tsx'),
  'utf-8',
)

describe('AFS-10-FIX-4 — nebula sphere shrink', () => {
  test('NebulaBg SPHERE_RADIUS constant is 800', () => {
    expect(NEBULA_BG).toMatch(/const\s+SPHERE_RADIUS\s*=\s*800\b/)
  })

  test('NebulaBg no longer references SPHERE_RADIUS = 5000', () => {
    expect(NEBULA_BG).not.toMatch(/SPHERE_RADIUS\s*=\s*5000/)
  })

  test('NebulaBg sphereGeometry still consumes SPHERE_RADIUS constant', () => {
    expect(NEBULA_BG).toMatch(/sphereGeometry\s+args=\{\[SPHERE_RADIUS,\s*64,\s*32\]\}/)
  })

  test('NebulaBg material flags preserved (BackSide + fog disabled)', () => {
    expect(NEBULA_BG).toContain('side={THREE.BackSide}')
    expect(NEBULA_BG).toContain('fog={false}')
  })
})

describe('AFS-10-FIX-4 — CSSStarfield overlay removal', () => {
  test('StarMapPage does not import CSSStarfield', () => {
    expect(STAR_MAP_PAGE).not.toMatch(/^\s*import\s+CSSStarfield/m)
  })

  test('StarMapPage does not render <CSSStarfield />', () => {
    expect(STAR_MAP_PAGE).not.toMatch(/<CSSStarfield\b/)
  })

  test('GalaxyPage does not import CSSStarfield', () => {
    expect(GALAXY_PAGE).not.toMatch(/^\s*import\s+CSSStarfield/m)
  })

  test('GalaxyPage does not render <CSSStarfield />', () => {
    expect(GALAXY_PAGE).not.toMatch(/<CSSStarfield\b/)
  })
})
