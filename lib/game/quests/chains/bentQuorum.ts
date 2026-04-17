/**
 * Sprint 4 — chain #5: Bent Quorum, Unfinished Meeting.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 4, chain #5.
 * Issuer: Claude, supporting Perplexity.
 * Unlocks after: lantern_grave_rebuild.
 *
 * 5-mission arc: Signal → Recovery → Hunt → Courier → Signal.
 */

import type { QuestStep, QuestChainFinalReward } from './firstDayRealSky'

export const BENT_QUORUM_CHAIN_ID = 'bent_quorum'

export const BENT_QUORUM_STEPS: readonly QuestStep[] = [
  {
    id: 'bent_quorum_ledger',
    stepNumber: 1,
    name: 'The Hollow Ledger',
    category: 'Signal',
    issuer: 'claude',
    timeEstimate: '7–10 min',
    rewardGhai: 520,
    objective: 'Scan the Hollow Ledger archive for the unfinished motion.',
    castLine: 'Every vote left open is a decision everyone is still making.',
    trigger: { type: 'landmark_scan', target: 'hollow_ledger' },
  },
  {
    id: 'bent_quorum_insurance',
    stepNumber: 2,
    name: 'Glass Anchor Insurance Form 7',
    category: 'Hunt',
    issuer: 'perplexity',
    timeEstimate: '7–10 min',
    rewardGhai: 420,
    objective: 'Recover the missing claim pod from a debris pocket near Glass Anchor.',
    castLine: 'The form is minor. The signatures on it are not.',
    trigger: { type: 'mission_complete', target: 'm062_glass_anchor_insurance_form_7' },
  },
  {
    id: 'bent_quorum_hunt',
    stepNumber: 3,
    name: 'Close the Opposition',
    category: 'Hunt',
    issuer: 'claude',
    timeEstimate: '13–18 min',
    rewardGhai: 820,
    objective: 'A competing faction is jamming the relay. Neutralise them.',
    castLine: 'We prefer consensus. When that fails, posture.',
    trigger: { type: 'battle_victory', target: 'tier_4' },
  },
  {
    id: 'bent_quorum_courier',
    stepNumber: 4,
    name: 'Carry the Minutes',
    category: 'Courier',
    issuer: 'perplexity',
    timeEstimate: '7–9 min',
    rewardGhai: 360,
    objective: 'Deliver the verified meeting minutes along the lawful corridor.',
    castLine: 'Clean record, clean route, clean outcome.',
    trigger: { type: 'mission_complete', target: 'm024_copper_wicket_departure_test' },
  },
  {
    id: 'bent_quorum_final_scan',
    stepNumber: 5,
    name: 'Motion to Close',
    category: 'Signal',
    issuer: 'claude',
    timeEstimate: '5–7 min',
    rewardGhai: 600,
    objective: 'Broadcast the final motion from Copper Wicket — the Inner Ring gate.',
    castLine: 'The meeting was never unfinished. It was waiting.',
    trigger: { type: 'landmark_scan', target: 'copper_wicket' },
  },
] as const

export const BENT_QUORUM_FINAL_REWARD: QuestChainFinalReward = {
  ghai: 1500,
  title: 'Closer of Motions',
  cosmetic: 'Quorum White Hull Inlay',
}
