/**
 * Sprint 4 — Task 3: quest chain registry + linear unlock order.
 *
 * Chains unlock in order. Chain N becomes active only after chain N-1 has
 * all steps completed. First Day Real Sky has no prerequisite.
 */

import {
  FIRST_DAY_REAL_SKY_CHAIN_ID,
  FIRST_DAY_STEPS,
  FIRST_DAY_FINAL_REWARD,
  type QuestStep,
  type QuestChainFinalReward,
} from './firstDayRealSky'
import {
  SHAPE_OF_SAFE_CHAIN_ID,
  SHAPE_OF_SAFE_STEPS,
  SHAPE_OF_SAFE_FINAL_REWARD,
} from './shapeOfSafe'
import {
  SMALL_RESCUE_CHAIN_ID,
  SMALL_RESCUE_STEPS,
  SMALL_RESCUE_FINAL_REWARD,
} from './smallRescueMatters'
import {
  LANTERN_GRAVE_CHAIN_ID,
  LANTERN_GRAVE_STEPS,
  LANTERN_GRAVE_FINAL_REWARD,
} from './lanternGraveRebuild'
import {
  BENT_QUORUM_CHAIN_ID,
  BENT_QUORUM_STEPS,
  BENT_QUORUM_FINAL_REWARD,
} from './bentQuorum'

export interface QuestChain {
  id: string
  name: string
  summary: string
  steps: readonly QuestStep[]
  finalReward: QuestChainFinalReward
  prerequisiteChainId: string | null
}

export const CHAINS: readonly QuestChain[] = [
  {
    id: FIRST_DAY_REAL_SKY_CHAIN_ID,
    name: 'First Day, Real Sky',
    summary: 'Tutorial. One loop, one delivery, three scans, one clean kill.',
    steps: FIRST_DAY_STEPS,
    finalReward: FIRST_DAY_FINAL_REWARD,
    prerequisiteChainId: null,
  },
  {
    id: SHAPE_OF_SAFE_CHAIN_ID,
    name: 'The Shape of Safe',
    summary: 'Claude teaches lane discipline. Boring cargo is the point.',
    steps: SHAPE_OF_SAFE_STEPS,
    finalReward: SHAPE_OF_SAFE_FINAL_REWARD,
    prerequisiteChainId: FIRST_DAY_REAL_SKY_CHAIN_ID,
  },
  {
    id: SMALL_RESCUE_CHAIN_ID,
    name: 'A Small Rescue Matters',
    summary: 'Gemini + GPT. Find the tug, track the bleed, bring them home.',
    steps: SMALL_RESCUE_STEPS,
    finalReward: SMALL_RESCUE_FINAL_REWARD,
    prerequisiteChainId: SHAPE_OF_SAFE_CHAIN_ID,
  },
  {
    id: LANTERN_GRAVE_CHAIN_ID,
    name: 'The Lantern Grave Rebuild',
    summary: 'Recover, return, scan, clear, ceremonial first run. 5 acts.',
    steps: LANTERN_GRAVE_STEPS,
    finalReward: LANTERN_GRAVE_FINAL_REWARD,
    prerequisiteChainId: SMALL_RESCUE_CHAIN_ID,
  },
  {
    id: BENT_QUORUM_CHAIN_ID,
    name: 'Bent Quorum, Unfinished Meeting',
    summary: 'A legal thread pulled. A quorum closed. A motion signed.',
    steps: BENT_QUORUM_STEPS,
    finalReward: BENT_QUORUM_FINAL_REWARD,
    prerequisiteChainId: LANTERN_GRAVE_CHAIN_ID,
  },
] as const

export function getChainById(id: string): QuestChain | undefined {
  return CHAINS.find(c => c.id === id)
}

export function getStepByIdAcrossChains(stepId: string): { chain: QuestChain; step: QuestStep } | undefined {
  for (const chain of CHAINS) {
    const step = chain.steps.find(s => s.id === stepId)
    if (step) return { chain, step }
  }
  return undefined
}

/** Returns the chain-complete set for a pilot given their raw completed step ids. */
export function computeChainCompletion(completedStepIds: ReadonlySet<string>): Set<string> {
  const completeChains = new Set<string>()
  for (const chain of CHAINS) {
    if (chain.steps.every(s => completedStepIds.has(s.id))) {
      completeChains.add(chain.id)
    }
  }
  return completeChains
}

/** Returns the first uncompleted step per active chain (linear unlock aware). */
export function getActiveSteps(completedStepIds: ReadonlySet<string>): readonly QuestStep[] {
  const completeChains = computeChainCompletion(completedStepIds)
  const active: QuestStep[] = []
  for (const chain of CHAINS) {
    if (completeChains.has(chain.id)) continue
    if (chain.prerequisiteChainId && !completeChains.has(chain.prerequisiteChainId)) continue
    const next = chain.steps.find(s => !completedStepIds.has(s.id))
    if (next) active.push(next)
  }
  return active
}

export type { QuestStep, QuestStepTriggerType, QuestChainFinalReward } from './firstDayRealSky'
export { triggerMatches } from './firstDayRealSky'
