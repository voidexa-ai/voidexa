import { MODEL_URLS } from '@/lib/config/modelUrls'

export interface ShipCatalogEntry {
  id: string
  name: string
  url: string
  tier: 'starter' | 'premium'
  description: string
  previewScale: number
  ingameScale: number
}

export const SHIP_CATALOG: ShipCatalogEntry[] = [
  {
    id: 'qs_bob',
    name: 'Bob · Starter',
    url: MODEL_URLS.qs_bob,
    tier: 'starter',
    description: 'Reliable rookie frame. Balanced stats, free for all pilots.',
    previewScale: 1.0,
    ingameScale: 1.2,
  },
  {
    id: 'usc_astroeagle',
    name: 'AstroEagle',
    url: MODEL_URLS.usc_astroeagle01,
    tier: 'premium',
    description: 'Swift interceptor. Sharp silhouette, agile handling.',
    previewScale: 0.6,
    ingameScale: 0.75,
  },
  {
    id: 'usc_cosmicshark',
    name: 'CosmicShark',
    url: MODEL_URLS.usc_cosmicshark01,
    tier: 'premium',
    description: 'Predator profile, aggressive strike craft.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },
  {
    id: 'usc_voidwhale',
    name: 'VoidWhale',
    url: MODEL_URLS.usc_voidwhale01,
    tier: 'premium',
    description: 'Capital-class hauler. Massive, slow, imposing.',
    previewScale: 0.25,
    ingameScale: 0.4,
  },
  {
    id: 'uscx_galacticokamoto',
    name: 'GalacticOkamoto',
    url: MODEL_URLS.uscx_galacticokamoto1,
    tier: 'premium',
    description: 'Signature skin, handcrafted paneling.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },
  {
    id: 'uscx_starforce',
    name: 'StarForce',
    url: MODEL_URLS.uscx_starforce01,
    tier: 'premium',
    description: 'Elite squadron livery. Turn-key dogfighter.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },
]

export const DEFAULT_SHIP_ID = 'qs_bob'
export const SHIP_STORAGE_KEY = 'voidexa_freeflight_ship_v1'

export function getStoredShipId(): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(SHIP_STORAGE_KEY) } catch { return null }
}

export function saveShipId(id: string) {
  try { localStorage.setItem(SHIP_STORAGE_KEY, id) } catch {}
}

export function findShip(id: string | null | undefined): ShipCatalogEntry {
  return SHIP_CATALOG.find(s => s.id === id) ?? SHIP_CATALOG[0]
}
