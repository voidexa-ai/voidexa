import { describe, it, expect } from 'vitest'
import {
  EXPLORATION_ENCOUNTERS,
  ENCOUNTER_PING_RADIUS,
  ENCOUNTER_TRIGGER_RADIUS,
  getEncounterById,
} from '../explorationEncounters'

const EXPECTED = 15
const TRIGGERS = ['visual', 'audio', 'scanner_ping', 'proximity'] as const
const ZONES = ['Core Zone', 'Inner Ring'] as const
const OUTCOMES = ['ghai', 'lore', 'reputation', 'nothing'] as const

describe('exploration encounters', () => {
  it('has exactly 15 entries', () => {
    expect(EXPLORATION_ENCOUNTERS).toHaveLength(EXPECTED)
  })

  it('all ids are unique', () => {
    expect(new Set(EXPLORATION_ENCOUNTERS.map(e => e.id)).size).toBe(EXPECTED)
  })

  it('every encounter has 2–4 choices', () => {
    for (const e of EXPLORATION_ENCOUNTERS) {
      expect(e.choices.length).toBeGreaterThanOrEqual(2)
      expect(e.choices.length).toBeLessThanOrEqual(4)
    }
  })

  it('every choice has a label + valid outcome kind + non-empty note', () => {
    for (const e of EXPLORATION_ENCOUNTERS) {
      for (const c of e.choices) {
        expect(c.label.length).toBeGreaterThan(0)
        expect(OUTCOMES).toContain(c.outcomeKind)
        expect(c.note.length).toBeGreaterThan(0)
        if (c.outcomeKind === 'ghai') {
          expect(c.reward).toBeDefined()
          expect(c.reward).toBeGreaterThan(0)
        }
      }
    }
  })

  it('all 4 trigger types are represented', () => {
    const usedTriggers = new Set(EXPLORATION_ENCOUNTERS.map(e => e.trigger))
    for (const t of TRIGGERS) expect(usedTriggers).toContain(t)
  })

  it('zones are all Core or Inner Ring', () => {
    for (const e of EXPLORATION_ENCOUNTERS) expect(ZONES).toContain(e.zone)
  })

  it('rarity is one of the expected tiers', () => {
    const allowed = ['common', 'uncommon', 'rare']
    for (const e of EXPLORATION_ENCOUNTERS) expect(allowed).toContain(e.rarity)
  })

  it('coords are finite', () => {
    for (const e of EXPLORATION_ENCOUNTERS) {
      expect(Number.isFinite(e.x)).toBe(true)
      expect(Number.isFinite(e.y)).toBe(true)
      expect(Number.isFinite(e.z)).toBe(true)
    }
  })

  it('no two encounters are at the same exact position', () => {
    const positions = new Set(EXPLORATION_ENCOUNTERS.map(e => `${e.x}:${e.y}:${e.z}`))
    expect(positions.size).toBe(EXPECTED)
  })

  it('trigger radius is smaller than ping radius', () => {
    expect(ENCOUNTER_TRIGGER_RADIUS).toBeGreaterThan(0)
    expect(ENCOUNTER_PING_RADIUS).toBeGreaterThan(ENCOUNTER_TRIGGER_RADIUS)
  })

  it('getEncounterById resolves and rejects unknown ids', () => {
    expect(getEncounterById('loose_breakfast_crate')?.name).toBe('Loose Breakfast Crate')
    expect(getEncounterById('no_such_encounter')).toBeUndefined()
  })
})
