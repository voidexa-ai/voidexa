const SUPABASE_MODELS = 'https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/models'

export const MODEL_URLS = {
  // ── Starter / Common Quaternius ───────────────────────────────────────────
  qs_bob:          `${SUPABASE_MODELS}/qs_bob.glb`,
  qs_challenger:   `${SUPABASE_MODELS}/qs_challenger.glb`,
  qs_executioner:  `${SUPABASE_MODELS}/qs_executioner.glb`,
  qs_striker:      `${SUPABASE_MODELS}/qs_striker.glb`,
  qs_imperial:     `${SUPABASE_MODELS}/qs_imperial.glb`,
  qs_omen:         `${SUPABASE_MODELS}/qs_omen.glb`,
  qs_spitfire:     `${SUPABASE_MODELS}/qs_spitfire.glb`,
  qs_dispatcher:   `${SUPABASE_MODELS}/qs_dispatcher.glb`,
  qs_insurgent:    `${SUPABASE_MODELS}/qs_insurgent.glb`,
  qs_zenith:       `${SUPABASE_MODELS}/qs_zenith.glb`,
  qs_pancake:      `${SUPABASE_MODELS}/qs_pancake.glb`,

  // ── Rare named-hero USC ships ─────────────────────────────────────────────
  usc_astroeagle01:     `${SUPABASE_MODELS}/usc_astroeagle01.glb`,
  usc_cosmicshark01:    `${SUPABASE_MODELS}/usc_cosmicshark01.glb`,
  usc_voidwhale01:      `${SUPABASE_MODELS}/usc_voidwhale01.glb`,

  // ── Uncommon USC family representatives — one per family ──────────────────
  usc_hyperfalcon01:      `${SUPABASE_MODELS}/usc_hyperfalcon01.glb`,
  usc_lightfox01:         `${SUPABASE_MODELS}/usc_lightfox01.glb`,
  usc_starsparrow01:      `${SUPABASE_MODELS}/usc_starsparrow01.glb`,
  usc_striderox01:        `${SUPABASE_MODELS}/usc_striderox01.glb`,
  usc_nightaye01:         `${SUPABASE_MODELS}/usc_nightaye01.glb`,
  usc_meteormantis01:     `${SUPABASE_MODELS}/usc_meteormantis01.glb`,
  usc_craizanstar01:      `${SUPABASE_MODELS}/usc_craizanstar01.glb`,
  usc_forcebadger01:      `${SUPABASE_MODELS}/usc_forcebadger01.glb`,
  usc_protonlegacy01:     `${SUPABASE_MODELS}/usc_protonlegacy01.glb`,
  usc_galacticleopard1:   `${SUPABASE_MODELS}/usc_galacticleopard1.glb`,
  usc_galaxyraptor01:     `${SUPABASE_MODELS}/usc_galaxyraptor01.glb`,
  usc_spacesphinx01:      `${SUPABASE_MODELS}/usc_spacesphinx01.glb`,
  usc_spaceexcalibur01:   `${SUPABASE_MODELS}/usc_spaceexcalibur01.glb`,
  usc_genericspaceship01: `${SUPABASE_MODELS}/usc_genericspaceship01.glb`,

  // ── Legendary USCX expansion ──────────────────────────────────────────────
  uscx_galacticokamoto1:  `${SUPABASE_MODELS}/uscx_galacticokamoto1.glb`,
  uscx_starforce01:       `${SUPABASE_MODELS}/uscx_starforce01.glb`,
  uscx_nova:              `${SUPABASE_MODELS}/uscx_nova.glb`,
  uscx_scorpionship:      `${SUPABASE_MODELS}/uscx_scorpionship.glb`,
  uscx_spidership:        `${SUPABASE_MODELS}/uscx_spidership.glb`,
  uscx_pullora:           `${SUPABASE_MODELS}/uscx_pullora.glb`,
  uscx_arrowship:         `${SUPABASE_MODELS}/uscx_arrowship.glb`,
  uscx_starship:          `${SUPABASE_MODELS}/uscx_starship.glb`,

  // ── Epic Hi-Rez hulls ─────────────────────────────────────────────────────
  hirez_mainbody01:       `${SUPABASE_MODELS}/hirez_mainbody01.glb`,
  hirez_mainbody02:       `${SUPABASE_MODELS}/hirez_mainbody02.glb`,
  hirez_mainbody05:       `${SUPABASE_MODELS}/hirez_mainbody05.glb`,

  // ── Hi-Rez cockpits + equipment (unchanged — used by the flight view) ────
  hirez_cockpit01:          `${SUPABASE_MODELS}/hirez_cockpit01.glb`,
  hirez_cockpit01_interior: `${SUPABASE_MODELS}/hirez_cockpit01_interior.glb`,
  hirez_cockpit02:          `${SUPABASE_MODELS}/hirez_cockpit02.glb`,
  hirez_cockpit02_interior: `${SUPABASE_MODELS}/hirez_cockpit02_interior.glb`,
  hirez_cockpit03:          `${SUPABASE_MODELS}/hirez_cockpit03.glb`,
  hirez_cockpit03_interior: `${SUPABASE_MODELS}/hirez_cockpit03_interior.glb`,
  hirez_cockpit04:          `${SUPABASE_MODELS}/hirez_cockpit04.glb`,
  hirez_cockpit04_interior: `${SUPABASE_MODELS}/hirez_cockpit04_interior.glb`,
  hirez_cockpit05:          `${SUPABASE_MODELS}/hirez_cockpit05.glb`,
  hirez_cockpit05_interior: `${SUPABASE_MODELS}/hirez_cockpit05_interior.glb`,
  hirez_equipments:         `${SUPABASE_MODELS}/hirez_equipments.glb`,
  hirez_screens:            `${SUPABASE_MODELS}/hirez_screens.glb`,

  // ── Cockpit standalone ────────────────────────────────────────────────────
  vattalus_fighter_cockpit:           `${SUPABASE_MODELS}/cockpits/vattalus_fighter_cockpit.glb`,
  vattalus_fighter_cockpit_with_seat: `${SUPABASE_MODELS}/cockpits/vattalus_fighter_cockpit_with_seat.glb`,
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
