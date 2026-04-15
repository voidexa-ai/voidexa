export interface CockpitCatalogEntry {
  id: string
  name: string
  url: string
}

export const COCKPIT_CATALOG: CockpitCatalogEntry[] = [
  { id: 'hirez_01', name: 'Cockpit 01', url: '/models/glb-ready/hirez_cockpit01.glb' },
  { id: 'hirez_02', name: 'Cockpit 02', url: '/models/glb-ready/hirez_cockpit02.glb' },
  { id: 'hirez_03', name: 'Cockpit 03', url: '/models/glb-ready/hirez_cockpit03.glb' },
  { id: 'hirez_04', name: 'Cockpit 04', url: '/models/glb-ready/hirez_cockpit04.glb' },
  { id: 'hirez_05', name: 'Cockpit 05', url: '/models/glb-ready/hirez_cockpit05.glb' },
]

export const DEFAULT_COCKPIT_ID = 'hirez_01'
export const COCKPIT_STORAGE_KEY = 'voidexa_freeflight_cockpit_v1'

export function getStoredCockpitId(): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(COCKPIT_STORAGE_KEY) } catch { return null }
}

export function saveCockpitId(id: string) {
  try { localStorage.setItem(COCKPIT_STORAGE_KEY, id) } catch {}
}

export function findCockpit(id: string | null | undefined): CockpitCatalogEntry {
  return COCKPIT_CATALOG.find(c => c.id === id) ?? COCKPIT_CATALOG[0]
}
