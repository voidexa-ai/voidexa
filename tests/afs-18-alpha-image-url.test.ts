import { describe, it, expect, beforeAll } from 'vitest'

// AFS-18 - URL helper unit tests. The helper reads NEXT_PUBLIC_SUPABASE_URL
// at module evaluation, so the env var is set BEFORE the dynamic import.

const TEST_URL = 'https://test.supabase.co'

let getAlphaCardImageUrl: (id: string, rarity: string) => string

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = TEST_URL
  // Dynamic import so the module captures the test env, not whatever the
  // runner inherited from .env.local.
  const mod = await import('@/lib/cards/alpha-image-url')
  getAlphaCardImageUrl = mod.getAlphaCardImageUrl
})

const RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
] as const

describe('AFS-18 getAlphaCardImageUrl - deterministic Supabase Storage URL', () => {
  it('builds the locked Option A path: cards/alpha/{rarity}/{id}.webp', () => {
    const url = getAlphaCardImageUrl('spark_discharge', 'common')
    expect(url).toBe(
      `${TEST_URL}/storage/v1/object/public/cards/alpha/common/spark_discharge.webp`,
    )
  })

  for (const r of RARITIES) {
    it(`builds a URL for rarity "${r}"`, () => {
      const url = getAlphaCardImageUrl('test_card', r)
      expect(url).toContain(`/cards/alpha/${r}/test_card.webp`)
    })
  }

  it('preserves snake_case slugs without re-encoding underscores', () => {
    const url = getAlphaCardImageUrl('prime_directive', 'common')
    expect(url).toContain('prime_directive.webp')
    expect(url).not.toContain('prime%5Fdirective')
  })

  it('returns a public-read URL (no signed token query string)', () => {
    const url = getAlphaCardImageUrl('any_card', 'rare')
    expect(url).toMatch(/\/storage\/v1\/object\/public\/cards\//)
    expect(url).not.toContain('token=')
  })

  it('does not double-slash between bucket path and rarity folder', () => {
    const url = getAlphaCardImageUrl('any_card', 'rare')
    expect(url).not.toMatch(/\/cards\/\/alpha/)
    expect(url).not.toMatch(/\/alpha\/\/rare/)
  })
})
