import { describe, it, expect } from 'vitest'
import {
  CHAINS,
  getChainById,
  getStepByIdAcrossChains,
  computeChainCompletion,
  getActiveSteps,
  triggerMatches,
} from '../chains'
import { getMissionById } from '@/lib/game/missions/board'
import { getLandmarkById } from '@/lib/game/freeflight/landmarks'

describe('chain registry', () => {
  it('has exactly 5 chains', () => {
    expect(CHAINS).toHaveLength(5)
  })

  it('chain ids are unique', () => {
    expect(new Set(CHAINS.map(c => c.id)).size).toBe(5)
  })

  it('first chain has no prerequisite; rest form a strict linear chain', () => {
    expect(CHAINS[0].prerequisiteChainId).toBeNull()
    for (let i = 1; i < CHAINS.length; i++) {
      expect(CHAINS[i].prerequisiteChainId).toBe(CHAINS[i - 1].id)
    }
  })

  it('no duplicate step ids across chains', () => {
    const ids = CHAINS.flatMap(c => c.steps.map(s => s.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every chain has a title and ghai reward > 0', () => {
    for (const c of CHAINS) {
      expect(c.finalReward.title.length).toBeGreaterThan(0)
      expect(c.finalReward.ghai).toBeGreaterThan(0)
    }
  })

  it('every step has a valid trigger targeting a real mission / landmark / speed-run track / battle tier', () => {
    for (const c of CHAINS) {
      for (const s of c.steps) {
        switch (s.trigger.type) {
          case 'mission_complete':
            expect(getMissionById(s.trigger.target), `mission ${s.trigger.target} in ${s.id}`).toBeDefined()
            break
          case 'landmark_scan':
            expect(getLandmarkById(s.trigger.target), `landmark ${s.trigger.target} in ${s.id}`).toBeDefined()
            break
          case 'speedrun_complete':
            expect(['core_circuit', 'nebula_run', 'void_prix']).toContain(s.trigger.target)
            break
          case 'battle_victory': {
            const valid = /^(tier_[1-5]|kestrel|lantern_auditor|varka|choir_sight|patient_wreck)$/
            expect(valid.test(s.trigger.target)).toBe(true)
            break
          }
        }
      }
    }
  })

  it('getChainById + getStepByIdAcrossChains work', () => {
    const c = getChainById('shape_of_safe')
    expect(c?.name).toContain('Shape of Safe')
    const lookup = getStepByIdAcrossChains('shape_of_safe_paint')
    expect(lookup?.step.stepNumber).toBe(1)
    expect(lookup?.chain.id).toBe('shape_of_safe')
  })
})

describe('chain progress computation', () => {
  it('no steps completed → only first chain is active', () => {
    const active = getActiveSteps(new Set())
    expect(active).toHaveLength(1)
    expect(active[0].id).toBe('first_day_loop')
  })

  it('completing first chain unlocks second', () => {
    const completed = new Set(CHAINS[0].steps.map(s => s.id))
    const active = getActiveSteps(completed)
    expect(active).toHaveLength(1)
    expect(active[0].id).toBe('shape_of_safe_paint')
  })

  it('partial completion of chain 1 keeps only chain 1 active', () => {
    const completed = new Set(['first_day_loop'])
    const active = getActiveSteps(completed)
    expect(active).toHaveLength(1)
    expect(active[0].id).toBe('first_day_coffee')
  })

  it('all 5 chains complete → no active steps', () => {
    const allIds = CHAINS.flatMap(c => c.steps.map(s => s.id))
    const active = getActiveSteps(new Set(allIds))
    expect(active).toHaveLength(0)
  })

  it('computeChainCompletion marks chain complete only when all steps done', () => {
    expect(computeChainCompletion(new Set()).size).toBe(0)
    const partial = new Set(CHAINS[0].steps.slice(0, 3).map(s => s.id))
    expect(computeChainCompletion(partial).size).toBe(0)
    const full = new Set(CHAINS[0].steps.map(s => s.id))
    expect(computeChainCompletion(full).has(CHAINS[0].id)).toBe(true)
  })
})

describe('triggerMatches', () => {
  it('matches only on exact type+target', () => {
    const step = CHAINS[0].steps[0] // speedrun:core_circuit
    expect(triggerMatches(step, { type: 'speedrun_complete', target: 'core_circuit' })).toBe(true)
    expect(triggerMatches(step, { type: 'speedrun_complete', target: 'nebula_run' })).toBe(false)
    expect(triggerMatches(step, { type: 'mission_complete', target: 'core_circuit' })).toBe(false)
  })
})
