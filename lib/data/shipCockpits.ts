import { MODEL_URLS } from '@/lib/config/modelUrls'

export type CockpitType = 'fighter_light' | 'fighter_medium' | 'bridge_command' | 'hirez_generic'

// Ship → cockpit tier. Ship IDs match `components/freeflight/ships/catalog.ts`.
// Unmapped ships fall back to `hirez_generic` (the Hi-Rez cockpit01 frame used
// before this mapping existed).
export const SHIP_COCKPIT_MAP: Record<string, CockpitType> = {
  qs_bob:               'fighter_light',
  qs_challenger:        'fighter_light',
  qs_striker:           'fighter_light',
  qs_imperial:          'fighter_light',
  qs_executioner:       'fighter_light',
  qs_omen:              'fighter_light',
  qs_spitfire:          'fighter_light',
  usc_astroeagle:       'fighter_light',
  usc_cosmicshark:      'fighter_light',
  uscx_starforce:       'fighter_medium',
  uscx_galacticokamoto: 'fighter_medium',
  usc_voidwhale:        'bridge_command',
}

export interface CockpitModelSpec {
  url: string
  withSeatUrl?: string
  scale: number
  offset: [number, number, number]
  rotation: [number, number, number]
  standalone: boolean
}

// `standalone: true` means the GLB already contains the full cockpit interior
// (dashboard + canopy + seat optional) and `CockpitModel` renders it directly.
// `standalone: false` means the GLB is a Hi-Rez frame that needs the matched
// interior + equipments + screens bundle wired in via INTERIOR_FOR_FRAME.
export const COCKPIT_MODELS: Record<CockpitType, CockpitModelSpec> = {
  fighter_light: {
    url: MODEL_URLS.vattalus_fighter_cockpit,
    withSeatUrl: MODEL_URLS.vattalus_fighter_cockpit_with_seat,
    scale: 1.0,
    // Drop the cockpit lower under the camera so the pilot sits at canopy
    // eye level instead of below the dashboard. The model's origin is at
    // the seat base; -1.4 ≈ 0.9 units below the previous mount, roughly the
    // seat-to-eye distance for a human pilot in game units.
    offset: [0, -1.4, -0.3],
    // Vattalus model was authored with +Z forward (Blender convention). The
    // cockpit group is parented to the camera, which looks down -Z. Without
    // this 180° Y rotation the pilot sees the back of the seat instead of
    // the canopy.
    rotation: [0, Math.PI, 0],
    standalone: true,
  },
  fighter_medium: {
    url: MODEL_URLS.vattalus_fighter_cockpit,
    withSeatUrl: MODEL_URLS.vattalus_fighter_cockpit_with_seat,
    scale: 1.3,
    offset: [0, -0.6, -0.4],
    rotation: [0, Math.PI, 0],
    standalone: true,
  },
  bridge_command: {
    url: MODEL_URLS.hirez_cockpit01,
    scale: 1.0,
    offset: [0, 0, 0],
    rotation: [0, 0, 0],
    standalone: false,
  },
  hirez_generic: {
    url: MODEL_URLS.hirez_cockpit01,
    scale: 1.0,
    offset: [0, 0, 0],
    rotation: [0, 0, 0],
    standalone: false,
  },
}

export function getCockpitForShip(shipSlug: string): CockpitType {
  return SHIP_COCKPIT_MAP[shipSlug] ?? 'hirez_generic'
}

export function getCockpitSpec(shipSlug: string): CockpitModelSpec {
  return COCKPIT_MODELS[getCockpitForShip(shipSlug)]
}
