// lib/cards/alpha-types.ts
//
// Shared constants for the AFS-6d Alpha catalog. Server pages
// (app/cards/alpha/page.tsx, app/dk/cards/alpha/page.tsx) read these
// to validate searchParams. The client catalog (components/cards/AlphaCatalog.tsx)
// reads them to render type tabs. Source of truth — do not inline elsewhere.

export const VALID_ALPHA_TYPES = [
  'weapon',
  'drone',
  'ai_routine',
  'defense',
  'module',
  'maneuver',
  'equipment',
  'field',
  'ship_core',
] as const

export type AlphaTypeDb = (typeof VALID_ALPHA_TYPES)[number]

export const ALPHA_PAGE_SIZE = 20

export const ALPHA_DB_TO_LABEL: Readonly<Record<AlphaTypeDb, string>> = {
  weapon: 'Weapon',
  drone: 'Drone',
  ai_routine: 'AI Routine',
  defense: 'Defense',
  module: 'Module',
  maneuver: 'Maneuver',
  equipment: 'Equipment',
  field: 'Field',
  ship_core: 'Ship Core',
}

export const DEFAULT_ALPHA_TYPE: AlphaTypeDb = 'weapon'

export function isValidAlphaType(t: string | undefined): t is AlphaTypeDb {
  return (VALID_ALPHA_TYPES as readonly string[]).includes(t ?? '')
}

export function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}
