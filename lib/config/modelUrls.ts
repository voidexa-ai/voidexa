const SUPABASE_MODELS = 'https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/models'

export const MODEL_URLS = {
  qs_bob:                `${SUPABASE_MODELS}/qs_bob.glb`,
  usc_astroeagle01:      `${SUPABASE_MODELS}/usc_astroeagle01.glb`,
  usc_cosmicshark01:     `${SUPABASE_MODELS}/usc_cosmicshark01.glb`,
  usc_voidwhale01:       `${SUPABASE_MODELS}/usc_voidwhale01.glb`,
  uscx_galacticokamoto1: `${SUPABASE_MODELS}/uscx_galacticokamoto1.glb`,
  uscx_starforce01:      `${SUPABASE_MODELS}/uscx_starforce01.glb`,
  hirez_cockpit01:          `${SUPABASE_MODELS}/hirez_cockpit01.glb`,
  hirez_cockpit01_interior: `${SUPABASE_MODELS}/hirez_cockpit01_interior.glb`,
  hirez_equipments:         `${SUPABASE_MODELS}/hirez_equipments.glb`,
  hirez_screens:            `${SUPABASE_MODELS}/hirez_screens.glb`,
  qs_challenger:         `${SUPABASE_MODELS}/qs_challenger.glb`,
  qs_executioner:        `${SUPABASE_MODELS}/qs_executioner.glb`,
} as const

export type ModelKey = keyof typeof MODEL_URLS

// Legacy local paths → Supabase URLs. Any path not in this map is returned unchanged
// (so callers still see the original string if we haven't migrated that asset yet).
const LEGACY_MAP: Record<string, string> = {
  '/models/glb-ready/qs_bob.glb':                MODEL_URLS.qs_bob,
  '/models/glb-ready/usc_astroeagle01.glb':      MODEL_URLS.usc_astroeagle01,
  '/models/glb-ready/usc_cosmicshark01.glb':     MODEL_URLS.usc_cosmicshark01,
  '/models/glb-ready/usc_voidwhale01.glb':       MODEL_URLS.usc_voidwhale01,
  '/models/glb-ready/uscx_galacticokamoto1.glb': MODEL_URLS.uscx_galacticokamoto1,
  '/models/glb-ready/uscx_starforce01.glb':      MODEL_URLS.uscx_starforce01,
  '/models/glb-ready/hirez_cockpit01.glb':       MODEL_URLS.hirez_cockpit01,
  '/models/glb-ready/qs_challenger.glb':         MODEL_URLS.qs_challenger,
  '/models/glb-ready/qs_executioner.glb':        MODEL_URLS.qs_executioner,
}

export function resolveModelUrl(path: string): string {
  return LEGACY_MAP[path] ?? path
}
