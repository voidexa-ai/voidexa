import { describe, it, expect } from 'vitest'
import {
  FIRST_DAY_STEPS,
  FIRST_DAY_FINAL_REWARD,
  FIRST_DAY_REAL_SKY_CHAIN_ID,
  getStepById,
  nextStep,
  isChainComplete,
  triggerMatches,
} from '../chains/firstDayRealSky'

const VALID_ISSUERS = new Set(['jix', 'claude', 'gpt', 'gemini', 'perplexity', 'llama'])
const VALID_TRIGGERS = new Set([
  'speedrun_complete', 'mission_complete', 'landmark_scan', 'battle_victory',
])

describe('First Day Real Sky chain', () => {
  it('has exactly 4 steps in correct order', () => {
    expect(FIRST_DAY_STEPS).toHaveLength(4)
    for (let i = 0; i < 4; i++) {
      expect(FIRST_DAY_STEPS[i].stepNumber).toBe(i + 1)
    }
  })

  it('all step ids are unique and prefixed first_day_', () => {
    const ids = FIRST_DAY_STEPS.map(s => s.id)
    expect(new Set(ids).size).toBe(4)
    for (const id of ids) expect(id.startsWith('first_day_')).toBe(true)
  })

  it('every step has Cast dialogue + valid issuer', () => {
    for (const s of FIRST_DAY_STEPS) {
      expect(VALID_ISSUERS.has(s.issuer)).toBe(true)
      expect(s.castLine.length).toBeGreaterThan(10)
    }
  })

  it('every step has a unique trigger type+target combination', () => {
    const keys = FIRST_DAY_STEPS.map(s => `${s.trigger.type}:${s.trigger.target}`)
    expect(new Set(keys).size).toBe(4)
    for (const s of FIRST_DAY_STEPS) {
      expect(VALID_TRIGGERS.has(s.trigger.type)).toBe(true)
      expect(s.trigger.target.length).toBeGreaterThan(0)
    }
  })

  it('final reward is 600 GHAI + "Licensed Breather" title', () => {
    expect(FIRST_DAY_FINAL_REWARD.ghai).toBe(600)
    expect(FIRST_DAY_FINAL_REWARD.title).toBe('Licensed Breather')
  })

  it('chain id is stable', () => {
    expect(FIRST_DAY_REAL_SKY_CHAIN_ID).toBe('first_day_real_sky')
  })

  it('getStepById resolves and rejects unknown', () => {
    expect(getStepById('first_day_loop')?.name).toBe('Loop Once, Breathe Once')
    expect(getStepById('no_such_step')).toBeUndefined()
  })

  it('nextStep returns the first uncompleted, null when all done', () => {
    expect(nextStep(new Set())?.stepNumber).toBe(1)
    expect(nextStep(new Set(['first_day_loop']))?.stepNumber).toBe(2)
    expect(nextStep(new Set(FIRST_DAY_STEPS.map(s => s.id)))).toBeNull()
  })

  it('isChainComplete true only after every step is in the set', () => {
    expect(isChainComplete(new Set())).toBe(false)
    expect(isChainComplete(new Set(['first_day_loop']))).toBe(false)
    expect(isChainComplete(new Set(FIRST_DAY_STEPS.map(s => s.id)))).toBe(true)
  })

  it('triggerMatches only returns true for exact type+target', () => {
    const step = FIRST_DAY_STEPS[0]
    expect(triggerMatches(step, { type: 'speedrun_complete', target: 'core_circuit' })).toBe(true)
    expect(triggerMatches(step, { type: 'speedrun_complete', target: 'nebula_run' })).toBe(false)
    expect(triggerMatches(step, { type: 'mission_complete', target: 'core_circuit' })).toBe(false)
  })
})
