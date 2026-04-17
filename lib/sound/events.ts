/**
 * Sprint 7 — semantic event → sound key mapping.
 *
 * Higher-level code calls `playEvent('combat.weapon.fire')` instead of binding
 * to a raw filename. This indirection lets us reskin sounds without touching
 * gameplay code.
 */

import { getSoundManager } from './manager'
import type { PlayOptions, SoundEventKey } from './types'

export const EVENT_MAP = {
  // Combat
  'combat.weapon.laser': 'weapon-fire-laser-beam',
  'combat.weapon.kinetic': 'weapon-fire-kinetic-slug',
  'combat.weapon.missile': 'weapon-fire-missile-launch',
  'combat.weapon.flak': 'weapon-fire-flak-burst',
  'combat.shield.hit': 'shield-hit-absorbed',
  'combat.shield.broken': 'shield-hit-broken-through',
  'combat.shield.activate': 'shield-activate',
  'combat.drone.deploy': 'drone-deploy',
  'combat.emp': 'emp-pulse',
  'combat.hullBreach': 'hull-breach',
  'combat.explosion.small': 'explosion-small',
  'combat.explosion.large': 'explosion-large',
  'combat.criticalFailure': 'critical-failure',
  'combat.playerDeath': 'player-death',

  // Cards
  'card.play.weapon': 'card-play-weapon',
  'card.play.shield': 'card-play-shield',
  'card.draw': 'card-draw',
  'card.discard': 'card-discard',
  'card.turn.start': 'turn-start',
  'card.turn.end': 'turn-end',
  'card.reveal.mythic': 'mythic-card-reveal',
  'card.reveal.legendary': 'legendary-card-reveal',

  // Match outcome
  'match.victory': 'victory-fanfare',
  'match.defeat': 'defeat-sound',

  // UI
  'ui.click': 'menu-click',
  'ui.hover': 'menu-hover',
  'ui.notification': 'notification-ping',
  'ui.tutorial': 'tutorial-prompt',
  'ui.warning': 'warning-alarm',

  // Economy
  'econ.ghai.earned': 'ghai-earned-chime',
  'econ.pack.standard': 'pack-opening-standard',
  'econ.pack.legendary': 'pack-opening-legendary',
  'econ.trade.complete': 'trade-complete',
  'econ.item.crafted': 'item-crafted',
  'econ.rareFind': 'rare-find',

  // Free Flight
  'ff.ambient.calm': 'freeflight-calm-space',
  'ff.ambient.nebula': 'freeflight-nebula-zone',
  'ff.ambient.asteroid': 'freeflight-asteroid-field',
  'ff.ambient.station': 'freeflight-near-station',
  'ff.ambient.deepVoid': 'freeflight-deep-void',
  'ff.engine.start': 'ship-engine-start',
  'ff.scanner.ping': 'scanner-ping',
  'ff.warp': 'warp-travel',
  'ff.dock': 'docking-at-station',
  'ff.npc.hail': 'npc-hail',
  'ff.encounter.alert': 'encounter-alert',
  'ff.wreck.detected': 'wreck-detected',

  // Battle ambience
  'battle.tension': 'battle-tension-loop',
  'battle.intense': 'battle-intense-loop',
  'screen.missionBoard': 'mission-board-ambient',
  'screen.shop': 'shop-ambient',

  // Boss themes
  'boss.appear': 'boss-appear',
  'boss.phaseChange': 'boss-phase-change',
  'boss.defeated': 'boss-defeated',
  'boss.rage': 'boss-rage-mode',
  'boss.special': 'boss-special-attack',

  // Boss tracks (looping music)
  'music.boss.kestrel': 'kestrel-reclaimer-theme',
  'music.boss.lantern': 'lantern-auditor-theme',
  'music.boss.varka': 'varka-the-unmoored-theme',
  'music.boss.choir': 'choir-sight-envoy-theme',
  'music.boss.wreck': 'patient-wreck-theme',

  // Quest + progression
  'quest.complete': 'quest-complete',
  'progression.levelUp': 'level-up',
  'progression.achievement': 'achievement-unlock',
  'progression.reputation': 'reputation-gain',

  // Race
  'race.countdown': 'race-countdown-beep',
} as const satisfies Record<string, SoundEventKey>

export type SemanticEvent = keyof typeof EVENT_MAP

export function playEvent(event: SemanticEvent, opts?: PlayOptions): void {
  getSoundManager().play(EVENT_MAP[event], opts)
}

export function stopEvent(event: SemanticEvent): void {
  getSoundManager().stop(EVENT_MAP[event])
}
