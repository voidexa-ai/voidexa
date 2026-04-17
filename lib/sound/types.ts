/**
 * Sprint 7 — typed event keys for all 67 sounds in public/sounds/.
 *
 * Generated from public/sounds/sound-map.json (run scripts/rename-sounds.js
 * to regenerate). Adding/removing a sound means: drop the file in
 * docs/sounds/, re-run the script, then sync this union.
 */

export type SoundEventKey =
  | 'weapon-fire-laser-beam'
  | 'weapon-fire-kinetic-slug'
  | 'weapon-fire-missile-launch'
  | 'weapon-fire-flak-burst'
  | 'shield-hit-absorbed'
  | 'shield-hit-broken-through'
  | 'shield-activate'
  | 'drone-deploy'
  | 'drone-swarm-buzz'
  | 'emp-pulse'
  | 'hull-breach'
  | 'explosion-small'
  | 'explosion-large'
  | 'card-play-weapon'
  | 'card-play-shield'
  | 'card-draw'
  | 'card-discard'
  | 'turn-start'
  | 'turn-end'
  | 'victory-fanfare'
  | 'defeat-sound'
  | 'menu-click'
  | 'menu-hover'
  | 'notification-ping'
  | 'ghai-earned-chime'
  | 'pack-opening-standard'
  | 'pack-opening-legendary'
  | 'freeflight-calm-space'
  | 'freeflight-nebula-zone'
  | 'freeflight-asteroid-field'
  | 'freeflight-near-station'
  | 'freeflight-deep-void'
  | 'battle-tension-loop'
  | 'battle-intense-loop'
  | 'mission-board-ambient'
  | 'shop-ambient'
  | 'warp-travel'
  | 'scanner-ping'
  | 'npc-hail'
  | 'encounter-alert'
  | 'quest-complete'
  | 'docking-at-station'
  | 'kestrel-reclaimer-theme'
  | 'lantern-auditor-theme'
  | 'varka-the-unmoored-theme'
  | 'choir-sight-envoy-theme'
  | 'patient-wreck-theme'
  | 'boss-appear'
  | 'boss-phase-change'
  | 'boss-defeated'
  | 'boss-rage-mode'
  | 'boss-special-attack'
  | 'mythic-card-reveal'
  | 'legendary-card-reveal'
  | 'level-up'
  | 'achievement-unlock'
  | 'reputation-gain'
  | 'tutorial-prompt'
  | 'warning-alarm'
  | 'wreck-detected'
  | 'trade-complete'
  | 'race-countdown-beep'
  | 'player-death'
  | 'item-crafted'
  | 'rare-find'
  | 'ship-engine-start'
  | 'critical-failure'

/** All 67 keys as a runtime array (for tests + iteration). */
export const ALL_SOUND_KEYS: readonly SoundEventKey[] = [
  'weapon-fire-laser-beam',
  'weapon-fire-kinetic-slug',
  'weapon-fire-missile-launch',
  'weapon-fire-flak-burst',
  'shield-hit-absorbed',
  'shield-hit-broken-through',
  'shield-activate',
  'drone-deploy',
  'drone-swarm-buzz',
  'emp-pulse',
  'hull-breach',
  'explosion-small',
  'explosion-large',
  'card-play-weapon',
  'card-play-shield',
  'card-draw',
  'card-discard',
  'turn-start',
  'turn-end',
  'victory-fanfare',
  'defeat-sound',
  'menu-click',
  'menu-hover',
  'notification-ping',
  'ghai-earned-chime',
  'pack-opening-standard',
  'pack-opening-legendary',
  'freeflight-calm-space',
  'freeflight-nebula-zone',
  'freeflight-asteroid-field',
  'freeflight-near-station',
  'freeflight-deep-void',
  'battle-tension-loop',
  'battle-intense-loop',
  'mission-board-ambient',
  'shop-ambient',
  'warp-travel',
  'scanner-ping',
  'npc-hail',
  'encounter-alert',
  'quest-complete',
  'docking-at-station',
  'kestrel-reclaimer-theme',
  'lantern-auditor-theme',
  'varka-the-unmoored-theme',
  'choir-sight-envoy-theme',
  'patient-wreck-theme',
  'boss-appear',
  'boss-phase-change',
  'boss-defeated',
  'boss-rage-mode',
  'boss-special-attack',
  'mythic-card-reveal',
  'legendary-card-reveal',
  'level-up',
  'achievement-unlock',
  'reputation-gain',
  'tutorial-prompt',
  'warning-alarm',
  'wreck-detected',
  'trade-complete',
  'race-countdown-beep',
  'player-death',
  'item-crafted',
  'rare-find',
  'ship-engine-start',
  'critical-failure',
]

export interface PlayOptions {
  /** 0–1 multiplier on master volume. Default 1. */
  volume?: number
  /** Loop the sound. Default false. */
  loop?: boolean
}
