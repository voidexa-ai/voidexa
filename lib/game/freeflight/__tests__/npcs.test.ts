import { describe, it, expect } from 'vitest'
import { NPCS, NPC_GREET_RADIUS, NPC_WARN_RADIUS, NPC_ROLE_COLOR, getNPCById } from '../npcs'

const EXPECTED = 10
const ROLES = ['hauler', 'pirate', 'salvager', 'scout', 'mystery', 'wildcard'] as const
const CLASSES = ['hauler', 'fighter', 'salvager', 'explorer', 'bob'] as const
const ZONES = ['Core Zone', 'Inner Ring', 'Mid Ring', 'Outer Ring', 'Deep Void'] as const

describe('NPCs', () => {
  it('has exactly 10 entries', () => {
    expect(NPCS).toHaveLength(EXPECTED)
  })

  it('all ids are unique', () => {
    expect(new Set(NPCS.map(n => n.id)).size).toBe(EXPECTED)
  })

  it('covers at least 5 role buckets', () => {
    const roles = new Set(NPCS.map(n => n.role))
    expect(roles.size).toBeGreaterThanOrEqual(5)
  })

  it('has at least one pirate (for hostile-warning flow)', () => {
    expect(NPCS.some(n => n.role === 'pirate')).toBe(true)
  })

  it('has at least two haulers (friendly greeting baseline)', () => {
    expect(NPCS.filter(n => n.role === 'hauler').length).toBeGreaterThanOrEqual(2)
  })

  it('every NPC has a valid role, class, and home zone', () => {
    for (const n of NPCS) {
      expect(ROLES).toContain(n.role)
      expect(CLASSES).toContain(n.shipClass)
      expect(ZONES).toContain(n.homeZone)
    }
  })

  it('every NPC has greeting + combat + farewell lines', () => {
    for (const n of NPCS) {
      expect(n.dialogue.greeting.length).toBeGreaterThan(0)
      expect(n.dialogue.combat.length).toBeGreaterThan(0)
      expect(n.dialogue.farewell.length).toBeGreaterThan(0)
    }
  })

  it('every NPC has a reputation summary', () => {
    for (const n of NPCS) expect(n.reputation.length).toBeGreaterThan(0)
  })

  it('patrol radii and periods are sane', () => {
    for (const n of NPCS) {
      expect(n.patrolRadius).toBeGreaterThan(0)
      expect(n.patrolRadius).toBeLessThan(200)
      expect(n.patrolPeriod).toBeGreaterThan(5)
      expect(n.patrolPeriod).toBeLessThan(200)
    }
  })

  it('colors match the role palette', () => {
    for (const n of NPCS) expect(n.color).toBe(NPC_ROLE_COLOR[n.role])
  })

  it('getNPCById resolves and rejects unknown ids', () => {
    expect(getNPCById('tessa_vale')?.name).toBe('Tessa Vale')
    expect(getNPCById('no_such_npc')).toBeUndefined()
  })

  it('interaction radii are positive', () => {
    expect(NPC_GREET_RADIUS).toBeGreaterThan(0)
    expect(NPC_WARN_RADIUS).toBeGreaterThan(NPC_GREET_RADIUS)
  })
})
