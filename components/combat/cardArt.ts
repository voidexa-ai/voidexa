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

/**
 * CW-2 mapping rules (star-system-polish SKILL.md):
 *   Attack     → weapons/
 *   Defense    → cockpits/ (exteriors + interiors)
 *   Tactical   → uncommon/
 *   Deployment → starter/ or uncommon/
 *   Alien      → legendary/
 *
 * Every one of the 40 starter cards has a real render. No procedural fallbacks needed.
 * Within a category cards may share the same render — the UI layer distinguishes them
 * via VFX overlay (muzzle flash colour, shield dome hue, etc).
 */
const CARD_ART: Readonly<Record<string, string>> = {
  // ── Attack (13) → weapons/ ────────────────────────────────────────────────
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
  'stellar-annihilator': '/images/renders/weapons/hirez_weapon_biglauncher.png',

  // ── Defense (9) → cockpits/ + cockpit-interiors/ ─────────────────────────
  'energy-shield-small':    '/images/renders/cockpits/hirez_cockpit01.png',
  'emergency-weld':         '/images/renders/cockpits/hirez_cockpit02.png',
  'decoy-flare':            '/images/renders/cockpits/hirez_cockpit03.png',
  'evasive-roll':           '/images/renders/cockpits/hirez_cockpit04.png',
  'magnetic-shield':        '/images/renders/cockpits/hirez_cockpit05.png',
  'nano-repair':            '/images/renders/cockpit-interiors/hirez_cockpit01_interior.png',
  'mirror-shield':          '/images/renders/cockpit-interiors/hirez_cockpit02_interior.png',
  'phase-shift-defense':    '/images/renders/cockpit-interiors/hirez_cockpit03_interior.png',
  'plasma-ablative-shield': '/images/renders/cockpit-interiors/hirez_cockpit04_interior.png',

  // ── Tactical (8) → uncommon/ ─────────────────────────────────────────────
  'speed-boost':     '/images/renders/uncommon/usc_hyperfalcon01.png',
  'jam-weapons':     '/images/renders/uncommon/usc_nightaye01.png',
  'scan-target':     '/images/renders/uncommon/usc_lightfox01.png',
  'damage-booster':  '/images/renders/uncommon/usc_galaxyraptor01.png',
  'blind-pulse':     '/images/renders/uncommon/usc_meteormantis01.png',
  'crit-amplifier':  '/images/renders/uncommon/usc_forcebadger01.png',
  'create-nebula':   '/images/renders/uncommon/usc_craizanstar01.png',
  'mind-read':       '/images/renders/uncommon/usc_striderox01.png',

  // ── Deployment (6) → starter/ + uncommon/ ────────────────────────────────
  'laser-drone':     '/images/renders/starter/qs_bob.png',
  'point-defense':   '/images/renders/uncommon/usc_astroeagle01.png',
  'missile-drone':   '/images/renders/uncommon/usc_cosmicshark01.png',
  'shield-drone':    '/images/renders/uncommon/usc_galacticleopard1.png',
  'kamikaze-drone':  '/images/renders/uncommon/usc_voidwhale01.png',
  'fortress-turret': '/images/renders/uncommon/usc_protonlegacy01.png',

  // ── Alien (4) → legendary/ ───────────────────────────────────────────────
  'minor-phase-ripple': '/images/renders/legendary/hirez_ship01_full.png',
  'void-pulse':         '/images/renders/legendary/hirez_ship06_full.png',
  'time-reverse':       '/images/renders/legendary/hirez_ship09_full.png',
  'reality-warp':       '/images/renders/legendary/hirez_ship16_full.png',
}
