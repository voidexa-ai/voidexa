import { describe, it, expect } from 'vitest'
import {
  formatMissionTale,
  formatBattleTale,
  formatSpeedrunTale,
  formatHaulingTale,
  buildTalesFeed,
} from '../tales'

describe('Tale formatters', () => {
  it('mission tale reads "Completed mission X · Grade"', () => {
    const t = formatMissionTale({
      id: 'mi1',
      mission_id: 'local_parcel_run',
      outcome_grade: 'gold',
      completed_at: '2026-04-17T12:00:00Z',
    })
    expect(t.category).toBe('mission')
    expect(t.line).toContain('Completed mission')
    expect(t.line).toContain('Local Parcel Run')
    expect(t.line).toContain('Gold')
  })

  it('mission tale without grade omits the grade suffix', () => {
    const t = formatMissionTale({ id: 'm', mission_id: 'x', completed_at: '2026-04-17T12:00:00Z' })
    expect(t.line).not.toContain('·')
  })

  it('battle tale uses "Defeated X" for wins', () => {
    const t = formatBattleTale({
      id: 'b1',
      status: 'won',
      boss_template: 'varka',
      ended_at: '2026-04-17T12:00:00Z',
      turns_played: 7,
    })
    expect(t.line.startsWith('Defeated')).toBe(true)
    expect(t.line).toContain('Varka')
    expect(t.line).toContain('7 turns')
  })

  it('battle tale uses "Lost to X" for losses', () => {
    const t = formatBattleTale({
      id: 'b2',
      status: 'lost',
      boss_template: 'kestrel',
      ended_at: '2026-04-17T12:00:00Z',
    })
    expect(t.line.startsWith('Lost to')).toBe(true)
    expect(t.line).toContain('Kestrel')
  })

  it('battle tale without boss_template falls back to "an opponent"', () => {
    const t = formatBattleTale({
      id: 'b3',
      status: 'won',
      ended_at: '2026-04-17T12:00:00Z',
    })
    expect(t.line).toContain('an opponent')
  })

  it('speedrun tale formats duration as mm:ss.cc', () => {
    const t = formatSpeedrunTale({
      id: 's1',
      track_id: 'core_circuit',
      duration_ms: 183_450,
      created_at: '2026-04-17T12:00:00Z',
    })
    expect(t.category).toBe('speedrun')
    expect(t.line).toContain('03:03.45')
    expect(t.line).toContain('Core Circuit')
  })

  it('hauling tale includes destination + grade', () => {
    const t = formatHaulingTale({
      id: 'h1',
      mission_template: 'priority_courier',
      destination_planet: 'Beta Outpost',
      outcome_grade: 'silver',
      completed_at: '2026-04-17T12:00:00Z',
    })
    expect(t.line).toContain('Beta Outpost')
    expect(t.line).toContain('Silver')
  })
})

describe('buildTalesFeed', () => {
  it('merges and sorts descending by when', () => {
    const tales = buildTalesFeed({
      missions: [
        { id: 'm1', mission_id: 'x', completed_at: '2026-04-01T00:00:00Z' },
      ],
      battles: [
        { id: 'b1', status: 'won', ended_at: '2026-04-10T00:00:00Z' },
      ],
      speedrun: [
        { id: 's1', track_id: 'nebula_run', duration_ms: 1000, created_at: '2026-04-05T00:00:00Z' },
      ],
      hauling: [],
    })
    expect(tales.map(t => t.id)).toEqual(['battle_b1', 'speedrun_s1', 'mission_m1'])
  })

  it('respects the limit parameter', () => {
    const manyMissions = Array.from({ length: 30 }, (_, i) => ({
      id: `m${i}`, mission_id: 'x', completed_at: `2026-04-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
    }))
    const tales = buildTalesFeed({ missions: manyMissions }, 5)
    expect(tales).toHaveLength(5)
  })

  it('returns empty feed when no sources provided', () => {
    expect(buildTalesFeed({})).toEqual([])
  })
})
