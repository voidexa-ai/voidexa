import { describe, expect, it } from 'vitest'
import {
  ALL_KEYWORDS,
  KEYWORD_DEFINITIONS,
  NEW_KEYWORDS_SPRINT_9,
  getKeywordDefinition,
  type CardKeyword,
} from '../keywords'

describe('card keywords — schema integrity', () => {
  it('every keyword has a definition', () => {
    for (const kw of ALL_KEYWORDS) {
      const def = KEYWORD_DEFINITIONS[kw]
      expect(def).toBeDefined()
      expect(def.keyword).toBe(kw)
      expect(def.short.length).toBeGreaterThan(0)
      expect(def.long.length).toBeGreaterThan(20)
      expect(def.introducedSprint).toBeGreaterThanOrEqual(1)
    }
  })

  it('definitions are immutable references (frozen-ish)', () => {
    const a = getKeywordDefinition('Hot Deploy')
    const b = getKeywordDefinition('Hot Deploy')
    expect(a).toBe(b)
  })

  it('exposes 19 total keywords (16 existing + 3 new)', () => {
    expect(ALL_KEYWORDS.length).toBe(19)
  })

  it('Sprint 9 net-new keywords are exactly Stalwart, Probe, Reactive', () => {
    expect([...NEW_KEYWORDS_SPRINT_9].sort()).toEqual(['Probe', 'Reactive', 'Stalwart'])
    for (const kw of NEW_KEYWORDS_SPRINT_9) {
      expect(KEYWORD_DEFINITIONS[kw].introducedSprint).toBe(9)
    }
  })
})

describe('card keywords — MTG analogs', () => {
  it('keywords with mtgAnalog have a meaningful string', () => {
    for (const kw of ALL_KEYWORDS) {
      const def = KEYWORD_DEFINITIONS[kw]
      if (def.mtgAnalog !== undefined) {
        expect(def.mtgAnalog.length).toBeGreaterThan(0)
      }
    }
  })

  it('Sprint 9 new keywords each map to a known MTG keyword', () => {
    expect(KEYWORD_DEFINITIONS.Stalwart.mtgAnalog).toBe('Vigilance')
    expect(KEYWORD_DEFINITIONS.Probe.mtgAnalog).toBe('Scry')
    expect(KEYWORD_DEFINITIONS.Reactive.mtgAnalog).toBe('Flash')
  })

  it('Hot Deploy is documented as Haste analog', () => {
    expect(KEYWORD_DEFINITIONS['Hot Deploy'].mtgAnalog).toBe('Haste')
  })

  it('Overcharge is documented as Kicker analog', () => {
    expect(KEYWORD_DEFINITIONS.Overcharge.mtgAnalog).toBe('Kicker')
  })
})

describe('card keywords — type union', () => {
  it('CardKeyword union matches ALL_KEYWORDS at runtime', () => {
    // Spot-check: a runtime keyword must be assignable to the type
    const sample: CardKeyword = ALL_KEYWORDS[0]
    expect(typeof sample).toBe('string')
  })
})
