import { describe, it, expect } from 'vitest'
import { COSMETIC_CATALOG, COSMETIC_TABS, cosmeticsByCategory, getCosmetic } from '../catalog'

const CATEGORIES = ['racing', 'combat', 'pilot', 'premium'] as const

describe('cosmetic catalog', () => {
  it('has entries for all 4 new tabs', () => {
    for (const cat of CATEGORIES) {
      expect(cosmeticsByCategory(cat).length).toBeGreaterThan(0)
    }
  })

  it('all cosmetic ids are unique', () => {
    expect(new Set(COSMETIC_CATALOG.map(c => c.id)).size).toBe(COSMETIC_CATALOG.length)
  })

  it('every cosmetic has id / name / category / slot / priceGhai / description', () => {
    for (const c of COSMETIC_CATALOG) {
      expect(c.id.length).toBeGreaterThan(0)
      expect(c.name.length).toBeGreaterThan(0)
      expect(CATEGORIES).toContain(c.category)
      expect(c.slot.length).toBeGreaterThan(0)
      expect(c.priceGhai).toBeGreaterThan(0)
      expect(c.description.length).toBeGreaterThan(0)
    }
  })

  it('all prices are in 100–5000 GHAI', () => {
    for (const c of COSMETIC_CATALOG) {
      expect(c.priceGhai).toBeGreaterThanOrEqual(100)
      expect(c.priceGhai).toBeLessThanOrEqual(5000)
    }
  })

  it('non-premium prices stay under 1500', () => {
    for (const c of COSMETIC_CATALOG) {
      if (c.category === 'premium') continue
      expect(c.priceGhai).toBeLessThan(1500)
    }
  })

  it('premium prices are 1500+', () => {
    for (const c of COSMETIC_CATALOG.filter(x => x.category === 'premium')) {
      expect(c.priceGhai).toBeGreaterThanOrEqual(1500)
    }
  })

  it('at least 5 items per non-premium tab', () => {
    for (const cat of ['racing', 'combat', 'pilot'] as const) {
      expect(cosmeticsByCategory(cat).length).toBeGreaterThanOrEqual(5)
    }
  })

  it('premium tab has at least 4 items', () => {
    expect(cosmeticsByCategory('premium').length).toBeGreaterThanOrEqual(4)
  })

  it('TAB list includes ships + packs + 4 cosmetic tabs', () => {
    const ids = new Set(COSMETIC_TABS.map(t => t.id))
    for (const id of ['ships', 'racing', 'combat', 'pilot', 'packs', 'premium']) {
      expect(ids.has(id as 'ships')).toBe(true)
    }
  })

  it('getCosmetic resolves known + rejects unknown ids', () => {
    expect(getCosmetic('premium_named_asteroid')?.priceGhai).toBe(5000)
    expect(getCosmetic('not_a_real_cosmetic')).toBeUndefined()
  })
})
