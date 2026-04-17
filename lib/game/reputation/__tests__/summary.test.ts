import { describe, it, expect } from 'vitest'
import { computeReputation } from '../summary'

describe('computeReputation', () => {
  it('returns zeroed summary for empty input', () => {
    const r = computeReputation({ missions: [], battles: [], hauling: [], speedrun: [] })
    expect(r).toEqual({
      successfulHauls: 0,
      pilotsRescued: 0,
      bossesDefeated: 0,
      speedrunWins: 0,
      missionsCompleted: 0,
      tier5BossesDefeated: 0,
    })
  })

  it('counts only completed missions', () => {
    const r = computeReputation({
      missions: [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'failed' },
        { status: 'accepted' },
      ],
      battles: [], hauling: [], speedrun: [],
    })
    expect(r.missionsCompleted).toBe(2)
  })

  it('counts only completed hauling contracts', () => {
    const r = computeReputation({
      missions: [],
      battles: [],
      hauling: [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'completed' },
        { status: 'failed' },
      ],
      speedrun: [],
    })
    expect(r.successfulHauls).toBe(3)
  })

  it('counts boss victories separately from tier victories', () => {
    const r = computeReputation({
      missions: [],
      battles: [
        { status: 'won', boss_template: 'tier_3' },       // not a boss
        { status: 'won', boss_template: 'kestrel' },
        { status: 'won', boss_template: 'varka' },
        { status: 'won', boss_template: 'choir_sight' },  // tier-5
        { status: 'won', boss_template: 'patient_wreck' },// tier-5+
        { status: 'lost', boss_template: 'varka' },
      ],
      hauling: [],
      speedrun: [],
    })
    expect(r.bossesDefeated).toBe(4)
    expect(r.tier5BossesDefeated).toBe(2)
  })

  it('counts speedrun entries', () => {
    const r = computeReputation({
      missions: [], battles: [], hauling: [],
      speedrun: [
        { track_id: 'core_circuit', duration_ms: 180_000 },
        { track_id: 'nebula_run', duration_ms: 300_000 },
      ],
    })
    expect(r.speedrunWins).toBe(2)
  })

  it('pilotsRescued is 0 in Sprint 3 (placeholder)', () => {
    const r = computeReputation({ missions: [], battles: [], hauling: [], speedrun: [] })
    expect(r.pilotsRescued).toBe(0)
  })
})
