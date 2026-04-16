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

// Ship tier metadata (starter vs locked cosmetic) lives in `lib/data/shipTiers.ts`
// and is the source of truth for the Free Flight picker gating + shop links.
// The `tier: 'starter' | 'premium'` flag here is kept for backwards
// compatibility with older callers; prefer `getShipTier(id)` going forward.
export const SHIP_CATALOG: ShipCatalogEntry[] = [
  // ── Free starter ships — rookie pool for new pilots ─────────────────────
  {
    id: 'qs_bob',
    name: 'Bob',
    url: MODEL_URLS.qs_bob,
    tier: 'starter',
    description: 'Reliable rookie frame. Balanced stats, free for all pilots.',
    previewScale: 1.0,
    ingameScale: 1.2,
  },
  {
    id: 'qs_challenger',
    name: 'Challenger',
    url: MODEL_URLS.qs_challenger,
    tier: 'starter',
    description: 'Patrol fighter — tight turns, forgiving handling.',
    previewScale: 1.0,
    ingameScale: 1.15,
  },
  {
    id: 'qs_striker',
    name: 'Striker',
    url: MODEL_URLS.qs_striker,
    tier: 'starter',
    description: 'Attack fighter — punchy throttle, short chassis.',
    previewScale: 1.0,
    ingameScale: 1.15,
  },
  {
    id: 'qs_imperial',
    name: 'Imperial',
    url: MODEL_URLS.qs_imperial,
    tier: 'starter',
    description: 'Escort frame — stable cruise, steady under pressure.',
    previewScale: 1.0,
    ingameScale: 1.15,
  },
  {
    id: 'usc_astroeagle',
    name: 'AstroEagle',
    url: MODEL_URLS.usc_astroeagle01,
    tier: 'starter',
    description: 'Medium USC fighter — swift interceptor, agile handling.',
    previewScale: 0.6,
    ingameScale: 0.75,
  },
  {
    id: 'usc_cosmicshark',
    name: 'CosmicShark',
    url: MODEL_URLS.usc_cosmicshark01,
    tier: 'starter',
    description: 'Medium USC fighter — predator profile, aggressive strike craft.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },

  // ── Locked cosmetic ships — unlock via /shop ────────────────────────────
  {
    id: 'usc_voidwhale',
    name: 'VoidWhale',
    url: MODEL_URLS.usc_voidwhale01,
    tier: 'premium',
    description: 'Capital-class hauler. Massive, slow, imposing. Legendary tier.',
    previewScale: 0.25,
    ingameScale: 0.4,
  },
  {
    id: 'uscx_galacticokamoto',
    name: 'GalacticOkamoto',
    url: MODEL_URLS.uscx_galacticokamoto1,
    tier: 'premium',
    description: 'Signature skin, handcrafted paneling. Legendary tier.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },
  {
    id: 'uscx_starforce',
    name: 'StarForce',
    url: MODEL_URLS.uscx_starforce01,
    tier: 'premium',
    description: 'Elite squadron livery. Turn-key dogfighter. Epic tier.',
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
