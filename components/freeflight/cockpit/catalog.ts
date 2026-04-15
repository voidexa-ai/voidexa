import { MODEL_URLS } from '@/lib/config/modelUrls'

export interface CockpitCatalogEntry {
  id: string
  name: string
  url: string
}

// Only cockpits hosted on Supabase Storage are listed. Additional cockpit skins
// will be enabled as their .glb files are uploaded to the `models` bucket.
export const COCKPIT_CATALOG: CockpitCatalogEntry[] = [
  { id: 'hirez_01', name: 'Cockpit 01', url: MODEL_URLS.hirez_cockpit01 },
  { id: 'hirez_02', name: 'Cockpit 02', url: MODEL_URLS.hirez_cockpit02 },
  { id: 'hirez_03', name: 'Cockpit 03', url: MODEL_URLS.hirez_cockpit03 },
  { id: 'hirez_04', name: 'Cockpit 04', url: MODEL_URLS.hirez_cockpit04 },
  { id: 'hirez_05', name: 'Cockpit 05', url: MODEL_URLS.hirez_cockpit05 },
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
