import { describe, it, expect } from 'vitest'
import { existsSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-6g — Source-level invariants for components/three/SpaceSkybox.tsx
// Plus presence checks for the bundled CC-BY 4.0 skybox asset.
// Vitest runs in `environment: node` per vitest.config.ts — same pattern
// used by tests/afs-6d-*.test.ts.

const SKYBOX_SRC = readFileSync(
  join(process.cwd(), 'components', 'three', 'SpaceSkybox.tsx'),
  'utf8',
)

const ASSET_PATH = join(process.cwd(), 'public', 'skybox', 'deep_space_01.png')
const README_PATH = join(process.cwd(), 'public', 'skybox', 'README.md')

describe('AFS-6g SpaceSkybox — component contract', () => {
  it('declares the "use client" directive (required for R3F)', () => {
    expect(SKYBOX_SRC.startsWith("'use client'")).toBe(true)
  })

  it('exports the SpaceSkybox named function', () => {
    expect(SKYBOX_SRC).toMatch(/export\s+function\s+SpaceSkybox\s*\(/)
  })

  it('exports DEFAULT_TEXTURE as a named constant', () => {
    expect(SKYBOX_SRC).toMatch(/export\s*\{\s*DEFAULT_TEXTURE\s*\}/)
  })

  it('DEFAULT_TEXTURE points at /skybox/ in /public (not /jpg)', () => {
    expect(SKYBOX_SRC).toMatch(
      /const\s+DEFAULT_TEXTURE\s*=\s*['"]\/skybox\/deep_space_01\.png['"]/,
    )
  })

  it('imports useLoader and useFrame from @react-three/fiber', () => {
    expect(SKYBOX_SRC).toMatch(
      /import\s*\{\s*[^}]*useLoader[^}]*useFrame[^}]*\}\s*from\s*['"]@react-three\/fiber['"]/,
    )
  })

  it('imports TextureLoader, BackSide, and SRGBColorSpace from three', () => {
    expect(SKYBOX_SRC).toMatch(/from\s*['"]three['"]/)
    expect(SKYBOX_SRC).toContain('TextureLoader')
    expect(SKYBOX_SRC).toContain('BackSide')
    expect(SKYBOX_SRC).toContain('SRGBColorSpace')
  })
})

describe('AFS-6g SpaceSkybox — props interface', () => {
  it('declares all 4 props (texture, radius, rotateWithCamera, intensity)', () => {
    expect(SKYBOX_SRC).toMatch(/texture\s*\?\s*:\s*string/)
    expect(SKYBOX_SRC).toMatch(/radius\s*\?\s*:\s*number/)
    expect(SKYBOX_SRC).toMatch(/rotateWithCamera\s*\?\s*:\s*boolean/)
    expect(SKYBOX_SRC).toMatch(/intensity\s*\?\s*:\s*number/)
  })

  it('uses default radius = 1000', () => {
    expect(SKYBOX_SRC).toMatch(/radius\s*=\s*1000/)
  })

  it('uses default intensity = 1', () => {
    expect(SKYBOX_SRC).toMatch(/intensity\s*=\s*1[\s,)]/)
  })

  it('defaults rotateWithCamera to false (battle backdrop is the common case)', () => {
    expect(SKYBOX_SRC).toMatch(/rotateWithCamera\s*=\s*false/)
  })
})

describe('AFS-6g SpaceSkybox — render contract', () => {
  it('renders a sphereGeometry with the radius prop and 60x40 segmentation', () => {
    expect(SKYBOX_SRC).toMatch(/<sphereGeometry\s+args=\{\[\s*radius\s*,\s*60\s*,\s*40\s*\]\}/)
  })

  it('uses BackSide on the meshBasicMaterial (renders interior of sphere)', () => {
    expect(SKYBOX_SRC).toMatch(/side=\{BackSide\}/)
  })

  it('disables depthWrite so the skybox does not occlude scene geometry', () => {
    expect(SKYBOX_SRC).toMatch(/depthWrite=\{false\}/)
  })

  it('sets renderOrder to -1 so the skybox draws first', () => {
    expect(SKYBOX_SRC).toMatch(/renderOrder=\{-1\}/)
  })

  it('toggles transparent based on intensity < 1', () => {
    expect(SKYBOX_SRC).toMatch(/transparent=\{intensity\s*<\s*1\}/)
  })

  it('implements rotateWithCamera by copying camera position in a useFrame hook', () => {
    expect(SKYBOX_SRC).toMatch(/useFrame\(/)
    expect(SKYBOX_SRC).toMatch(/rotateWithCamera/)
    expect(SKYBOX_SRC).toMatch(/camera\.position/)
  })
})

describe('AFS-6g SpaceSkybox — bundled asset', () => {
  it('public/skybox/deep_space_01.png exists', () => {
    expect(existsSync(ASSET_PATH)).toBe(true)
  })

  it('asset is a non-trivial PNG (>= 1MB) consistent with an 8K equirectangular', () => {
    const size = statSync(ASSET_PATH).size
    expect(size).toBeGreaterThan(1_000_000)
  })

  it('README.md documents CC-BY 4.0 attribution and source', () => {
    expect(existsSync(README_PATH)).toBe(true)
    const readme = readFileSync(README_PATH, 'utf8')
    expect(readme).toMatch(/CC-BY\s*4\.0/i)
    expect(readme).toMatch(/spacespheremaps\.com/i)
  })
})
