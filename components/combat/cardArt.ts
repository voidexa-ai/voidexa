/**
 * components/combat/cardArt.ts
 *
 * Maps card ids to the preview render PNGs under public/images/renders/.
 * Mirrors docs/CARD_ART_MAPPING.md.
 *
 * Cards without a 3D source fall back to a procedural gradient generated
 * via CSS (returned as `null` here; the consumer renders the fallback).
 */

import { CardRarity } from '@/lib/game/cards'

/** Returns the render path for a card id, or null if it has no 3D source. */
export function cardArtPath(cardId: string): string | null {
  return CARD_ART[cardId] ?? null
}

/** Per-rarity glow color for card border + accent. */
export const RARITY_GLOW: Readonly<Record<CardRarity, string>> = {
  [CardRarity.Common]:    '#9ca3af', // grey
  [CardRarity.Uncommon]:  '#22c55e', // green
  [CardRarity.Rare]:      '#3b82f6', // blue
  [CardRarity.Epic]:      '#a855f7', // purple
  [CardRarity.Legendary]: '#f59e0b', // gold
}

/** Per-category accent color (used on icon + tag chip). */
export const CATEGORY_COLORS: Readonly<Record<string, string>> = {
  Attack:     '#ef4444',
  Defense:    '#3b82f6',
  Tactical:   '#eab308',
  Deployment: '#22c55e',
  Alien:      '#a855f7',
}

const CARD_ART: Readonly<Record<string, string>> = {
  // Attack
  'laser-pulse':         '/images/renders/weapons/hirez_weapon_blaster.png',
  'plasma-bolt':         '/images/renders/weapons/hirez_weapon_blaster.png',
  'micro-missile':       '/images/renders/weapons/hirez_weapon_missile.png',
  'gatling-burst':       '/images/renders/weapons/hirez_weapon_smallmachinegun.png',
  'thermal-lance':       '/images/renders/weapons/hirez_weapon_blaster.png',
  'railgun-shot':        '/images/renders/weapons/hirez_weapon_bigmachinegun.png',
  'acid-cloud':          '/images/renders/weapons/hirez_weapon_smalllauncher.png',
  'homing-missile':      '/images/renders/weapons/hirez_weapon_missile.png',
  'torpedo-barrage':     '/images/renders/weapons/hirez_weapon_trilauncher.png',
  'phase-beam':          '/images/renders/weapons/hirez_weapon_bigmachinegun.png',
  'void-lance':          '/images/renders/weapons/hirez_weapon_biglauncher.png',
  'nova-barrage':        '/images/renders/weapons/hirez_weapon_trilauncher.png',
  'stellar-annihilator': '/images/renders/legendary/hirez_ship09_full.png',

  // Defense (mostly cockpit interiors + ship)
  'energy-shield-small':    '/images/renders/cockpit-interiors/hirez_cockpit01_interior.png',
  'emergency-weld':         '/images/renders/cockpit-interiors/hirez_cockpit02_interior.png',
  'decoy-flare':            '/images/renders/cockpits/hirez_cockpit03.png',
  'evasive-roll':           '/images/renders/uncommon/usc_lightfox01.png',
  'magnetic-shield':        '/images/renders/cockpit-interiors/hirez_cockpit03_interior.png',
  'nano-repair':            '/images/renders/cockpits/hirez_cockpit04.png',
  'mirror-shield':          '/images/renders/epic/hirez_ship04_full.png',
  'phase-shift-defense':    '/images/renders/uncommon/usc_nightaye01.png',
  'plasma-ablative-shield': '/images/renders/cockpit-interiors/hirez_cockpit05_interior.png',

  // Tactical (mostly procedural — provide a few fallbacks)
  'speed-boost':     '/images/renders/uncommon/usc_hyperfalcon01.png',
  'jam-weapons':     '/images/renders/cockpits/hirez_cockpit02.png',
  'damage-booster':  '/images/renders/weapons/hirez_weapon_blaster.png',
  'create-nebula':   '/images/renders/epic/hirez_ship03_full.png',

  // Deployment (drones + turret)
  'laser-drone':     '/images/renders/soulbound/qs_dispatcher.png',
  'point-defense':   '/images/renders/weapons/hirez_weapon_smallmachinegun.png',
  'missile-drone':   '/images/renders/starter/qs_bob.png',
  'shield-drone':    '/images/renders/uncommon/usc_lightfox01.png',
  'kamikaze-drone':  '/images/renders/uncommon/usc_cosmicshark01.png',
  'fortress-turret': '/images/renders/weapons/hirez_weapon_biglauncher.png',

  // Alien (uscx uniques)
  'void-pulse':   '/images/renders/rare/uscx_pullora.png',
  'time-reverse': '/images/renders/rare/uscx_nova.png',
  'reality-warp': '/images/renders/rare/uscx_spidership.png',
}
