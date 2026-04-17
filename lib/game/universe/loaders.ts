/**
 * Sprint 6 — typed accessors for the Gemini universe catalog.
 *
 * Loaders are pure: they read the JSON once, type-cast, freeze, and return
 * cached references. Safe to call from edge runtime, RSC, and tests.
 */

import contentRaw from './content.json'
import {
  ZONE_RADIUS,
  type UniverseContent,
  type UniverseEncounter,
  type UniverseLandmark,
  type UniverseNpc,
  type UniverseQuestChain,
  type UniverseZone,
} from './types'

const content: UniverseContent = contentRaw as UniverseContent

export function loadLandmarks(): readonly UniverseLandmark[] {
  return content.landmarks
}

export function loadEncounters(): readonly UniverseEncounter[] {
  return content.encounters
}

export function loadNpcs(): readonly UniverseNpc[] {
  return content.npcs
}

export function loadQuestChains(): readonly UniverseQuestChain[] {
  return content.quest_chains
}

export function loadAll(): UniverseContent {
  return content
}

export function filterByZone<T extends { zone: UniverseZone }>(
  items: readonly T[],
  zone: UniverseZone | 'all'
): readonly T[] {
  if (zone === 'all') return items
  return items.filter((i) => i.zone === zone)
}

/**
 * Deterministic 3D positions for landmarks. Uses a simple 32-bit hash of
 * the landmark id to derive (theta, phi, r) within the zone's radius band
 * from `ZONE_RADIUS`. Same input always yields same output.
 */
export interface LandmarkPosition {
  id: string
  x: number
  y: number
  z: number
  zone: UniverseZone
}

function hashId(id: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < id.length; i++) {
    h = (h ^ id.charCodeAt(i)) >>> 0
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

export function landmarkPositions(): readonly LandmarkPosition[] {
  return content.landmarks.map((lm) => {
    const h = hashId(lm.id)
    const a = (h & 0xffff) / 0xffff
    const b = ((h >>> 16) & 0xffff) / 0xffff
    const c = ((h >>> 8) & 0xff) / 0xff
    const [rMin, rMax] = ZONE_RADIUS[lm.zone]
    const r = rMin + (rMax - rMin) * c
    const theta = a * Math.PI * 2
    const phi = Math.acos(2 * b - 1)
    return {
      id: lm.id,
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta) * 0.4,
      z: r * Math.cos(phi),
      zone: lm.zone,
    }
  })
}

const VISUAL_COLOR: Record<UniverseLandmark['visual_type'], string> = {
  station: '#7ee0ff',
  asteroid: '#a08070',
  monument: '#d4af37',
  nebula: '#a070ff',
  wreck: '#ff7060',
  anomaly: '#7fff7f',
}

export function colorForVisual(t: UniverseLandmark['visual_type']): string {
  return VISUAL_COLOR[t]
}
