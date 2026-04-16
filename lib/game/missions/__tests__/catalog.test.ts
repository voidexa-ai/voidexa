import { describe, it, expect } from 'vitest'
import { MISSION_CATALOG, getCatalogedMission } from '../catalog'
import { MISSION_TEMPLATES, STARTER_MISSION_TEMPLATES, MISSION_CATEGORIES, getMissionById } from '../board'

const VALID_ISSUERS = new Set(['jix', 'claude', 'gpt', 'gemini', 'perplexity', 'llama'])
const VALID_RISKS = new Set(['Safe', 'Low', 'Medium', 'Contested', 'Wreck Risk', 'Timed', 'Ranked'])
const REQUIRED_CATEGORIES = ['Courier', 'Rush', 'Hunt', 'Recovery', 'Signal'] as const

describe('mission catalog (90 missions)', () => {
  it('has exactly 90 entries', () => {
    expect(MISSION_CATALOG).toHaveLength(90)
  })

  it('all ids are unique in the catalog', () => {
    expect(new Set(MISSION_CATALOG.map(m => m.id)).size).toBe(90)
  })

  it('every mission has all required fields filled', () => {
    for (const m of MISSION_CATALOG) {
      expect(m.id.length).toBeGreaterThan(0)
      expect(m.name.length).toBeGreaterThan(0)
      expect(m.timeEstimate.length).toBeGreaterThan(0)
      expect(m.objective.length).toBeGreaterThan(0)
      expect(m.description.length).toBeGreaterThan(0)
      expect(m.quote.length).toBeGreaterThan(0)
      expect(m.encounterChance.length).toBeGreaterThan(0)
    }
  })

  it('every mission has a valid category', () => {
    for (const m of MISSION_CATALOG) {
      expect(MISSION_CATEGORIES).toContain(m.category)
    }
  })

  it('every mission has a valid Cast issuer', () => {
    for (const m of MISSION_CATALOG) {
      expect(VALID_ISSUERS.has(m.issuer)).toBe(true)
    }
  })

  it('every mission has a valid risk badge', () => {
    for (const m of MISSION_CATALOG) {
      expect(VALID_RISKS.has(m.risk)).toBe(true)
    }
  })

  it('rewardMin ≤ rewardMax on every mission', () => {
    for (const m of MISSION_CATALOG) {
      expect(m.rewardMax).toBeGreaterThanOrEqual(m.rewardMin)
      expect(m.rewardMin).toBeGreaterThan(0)
    }
  })

  it('at least 10 missions per required category', () => {
    for (const cat of REQUIRED_CATEGORIES) {
      const count = MISSION_CATALOG.filter(m => m.category === cat).length
      expect(count).toBeGreaterThanOrEqual(10)
    }
  })

  it('getCatalogedMission resolves known ids and rejects unknown', () => {
    const first = MISSION_CATALOG[0]
    expect(getCatalogedMission(first.id)?.name).toBe(first.name)
    expect(getCatalogedMission('no_such_mission')).toBeUndefined()
  })
})

describe('merged mission board', () => {
  it('MISSION_TEMPLATES merges starter + catalog with starter winning id collisions', () => {
    expect(MISSION_TEMPLATES.length).toBeGreaterThanOrEqual(90)
    // Every starter mission must still be present.
    for (const s of STARTER_MISSION_TEMPLATES) {
      const found = MISSION_TEMPLATES.find(m => m.id === s.id)
      expect(found).toBeDefined()
      expect(found?.name).toBe(s.name)
    }
    // No duplicate ids after merge.
    expect(new Set(MISSION_TEMPLATES.map(m => m.id)).size).toBe(MISSION_TEMPLATES.length)
  })

  it('getMissionById finds missions from both starter and catalog', () => {
    expect(getMissionById('local_parcel_run')?.category).toBe('Courier')
    const catalogSample = MISSION_CATALOG[0]
    expect(getMissionById(catalogSample.id)?.name).toBe(catalogSample.name)
  })
})
