/**
 * Sprint 4 — chain #4: The Lantern Grave Rebuild.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 4, chain #4.
 * Issuer: Jix, supporting Perplexity.
 * Unlocks after: small_rescue_matters.
 *
 * 5-mission arc: Recovery → Courier → Signal → Hunt → Rush.
 */

import type { QuestStep, QuestChainFinalReward } from './firstDayRealSky'

export const LANTERN_GRAVE_CHAIN_ID = 'lantern_grave_rebuild'

export const LANTERN_GRAVE_STEPS: readonly QuestStep[] = [
  {
    id: 'lantern_grave_recover',
    stepNumber: 1,
    name: 'Recover the Cores',
    category: 'Hunt',
    issuer: 'jix',
    timeEstimate: '11–15 min',
    rewardGhai: 620,
    objective: 'Retrieve intact beacon cores from the Lantern Grave drift field.',
    castLine: 'Grab the good ones. Leave the cursed-looking junk.',
    trigger: { type: 'mission_complete', target: 'm011_lantern_grave_pickup' },
  },
  {
    id: 'lantern_grave_return_crates',
    stepNumber: 2,
    name: 'Return the Crates',
    category: 'Courier',
    issuer: 'claude',
    timeEstimate: '8–11 min',
    rewardGhai: 360,
    objective: 'Deliver the empty freight shells back to Pelican Loft for refits.',
    castLine: 'Symmetry matters. Even with empty crates.',
    trigger: { type: 'mission_complete', target: 'm006_return_crates_from_pelican_loft' },
  },
  {
    id: 'lantern_grave_saffron',
    stepNumber: 3,
    name: 'Signal from Saffron',
    category: 'Signal',
    issuer: 'perplexity',
    timeEstimate: '6–8 min',
    rewardGhai: 420,
    objective: 'Align the cores with Saffron Relay so the rebuild stays synchronised.',
    castLine: 'Telemetry first. Ceremony second.',
    trigger: { type: 'landmark_scan', target: 'saffron_relay' },
  },
  {
    id: 'lantern_grave_hunt',
    stepNumber: 4,
    name: 'Clear the Drift',
    category: 'Hunt',
    issuer: 'gpt',
    timeEstimate: '12–15 min',
    rewardGhai: 620,
    objective: 'Scavengers are circling. Thin their numbers before the rebuild crew arrives.',
    castLine: 'Scavengers respect posture. Show some.',
    trigger: { type: 'battle_victory', target: 'tier_3' },
  },
  {
    id: 'lantern_grave_rush',
    stepNumber: 5,
    name: 'Relit Run',
    category: 'Rush',
    issuer: 'jix',
    timeEstimate: '10–14 min',
    rewardGhai: 900,
    objective: 'Ceremonial first run through the rebuilt beacon corridor.',
    castLine: 'Fast enough the lanterns still look alive. That is the point.',
    trigger: { type: 'speedrun_complete', target: 'void_prix' },
  },
] as const

export const LANTERN_GRAVE_FINAL_REWARD: QuestChainFinalReward = {
  ghai: 1200,
  title: 'Beacon Keeper',
  cosmetic: 'Relit Wake Beacon Trail',
}
