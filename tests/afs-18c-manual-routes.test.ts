import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-18c - Walker tests for the 12 manual routes (6 EN + 6 DK), the
// shared layout/content components, and the sitemap additions.

const ETAPE_SLUGS = [
  'foundation',
  'battle',
  'cards',
  'pilots',
  'glossary',
] as const

function manualPath(...parts: string[]): string {
  return join(process.cwd(), 'app', 'manual', ...parts, 'page.tsx')
}

function manualPathDk(...parts: string[]): string {
  return join(process.cwd(), 'app', 'dk', 'manual', ...parts, 'page.tsx')
}

const SITEMAP_SRC = readFileSync(
  join(process.cwd(), 'app', 'sitemap.ts'),
  'utf8',
)

describe('AFS-18c manual routes (EN) - 6 page.tsx files exist', () => {
  it('app/manual/page.tsx (landing) exists', () => {
    expect(existsSync(join(process.cwd(), 'app', 'manual', 'page.tsx'))).toBe(
      true,
    )
  })

  for (const slug of ETAPE_SLUGS) {
    it(`app/manual/${slug}/page.tsx exists and reads the right SLUG`, () => {
      const filepath = manualPath(slug)
      expect(existsSync(filepath)).toBe(true)
      const src = readFileSync(filepath, 'utf8')
      expect(src).toMatch(new RegExp(`SLUG\\s*=\\s*['"]${slug}['"]`))
      expect(src).toContain('basePath="/manual"')
    })
  }
})

describe('AFS-18c manual routes (DK) - 6 mirror page.tsx files exist', () => {
  it('app/dk/manual/page.tsx (DK landing) exists', () => {
    expect(
      existsSync(join(process.cwd(), 'app', 'dk', 'manual', 'page.tsx')),
    ).toBe(true)
  })

  for (const slug of ETAPE_SLUGS) {
    it(`app/dk/manual/${slug}/page.tsx exists and uses /dk/manual basePath`, () => {
      const filepath = manualPathDk(slug)
      expect(existsSync(filepath)).toBe(true)
      const src = readFileSync(filepath, 'utf8')
      expect(src).toMatch(new RegExp(`SLUG\\s*=\\s*['"]${slug}['"]`))
      expect(src).toContain('basePath="/dk/manual"')
    })
  }
})

describe('AFS-18c sitemap - 12 new routes added', () => {
  it('lists /manual + 5 etape routes in EN_ROUTES', () => {
    expect(SITEMAP_SRC).toContain("'/manual'")
    for (const slug of ETAPE_SLUGS) {
      expect(SITEMAP_SRC).toContain(`'/manual/${slug}'`)
    }
  })

  it('lists /dk/manual + 5 etape routes in DK_ROUTES', () => {
    expect(SITEMAP_SRC).toContain("'/dk/manual'")
    for (const slug of ETAPE_SLUGS) {
      expect(SITEMAP_SRC).toContain(`'/dk/manual/${slug}'`)
    }
  })
})

describe('AFS-18c manual landing - canonical metadata', () => {
  it('EN landing canonical points at /manual', () => {
    const src = readFileSync(
      join(process.cwd(), 'app', 'manual', 'page.tsx'),
      'utf8',
    )
    expect(src).toMatch(/canonical:\s*['"]\/manual['"]/)
    expect(src).toMatch(/da:\s*['"]\/dk\/manual['"]/)
  })

  it('DK landing canonical points at /dk/manual', () => {
    const src = readFileSync(
      join(process.cwd(), 'app', 'dk', 'manual', 'page.tsx'),
      'utf8',
    )
    expect(src).toMatch(/canonical:\s*['"]\/dk\/manual['"]/)
  })
})
