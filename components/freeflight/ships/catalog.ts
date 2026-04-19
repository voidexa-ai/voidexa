import { MODEL_URLS } from '@/lib/config/modelUrls'

// Sprint 16 Task 3 — rarity taxonomy drives the hangar badge. Gameplay /
// unlock state is still governed by `lib/data/shipTiers.ts` (starter-free
// vs shop-locked) so this is purely a display concern.
export type Rarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

export type ShipClass = 'fighter' | 'hauler' | 'explorer' | 'salvager' | 'capital' | 'bob'

export interface ShipCatalogEntry {
  id: string
  name: string
  url: string
  /**
   * Legacy gate — `starter` ships are playable from the hangar, `premium`
   * route to /shop. Source of truth is `lib/data/shipTiers.ts`. The field is
   * retained so older code paths keep compiling.
   */
  tier: 'starter' | 'premium'
  /** Sprint 16 — drives the badge label / color in the hangar. */
  rarity: Rarity
  /** Broad role classifier — used by future matchmaking + card effects. */
  shipClass: ShipClass
  description: string
  previewScale: number
  ingameScale: number
}

// Rule (master plan Part 3): gameplay earns stats, shop sells looks. The
// legacy `tier: 'starter' | 'premium'` flag here is kept for backwards
// compatibility with older callers; prefer `getShipTier(id)` going forward.
export const SHIP_CATALOG: ShipCatalogEntry[] = [
  // ── Bob — only truly Starter ship ────────────────────────────────────────
  {
    id: 'qs_bob',
    name: 'Bob',
    url: MODEL_URLS.qs_bob,
    tier: 'starter',
    rarity: 'starter',
    shipClass: 'bob',
    description: 'Reliable rookie frame. Balanced stats, free for all pilots.',
    previewScale: 1.0,
    ingameScale: 1.2,
  },

  // ── Common — Quaternius basic fleet (playable, free) ─────────────────────
  {
    id: 'qs_challenger',
    name: 'Challenger',
    url: MODEL_URLS.qs_challenger,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'fighter',
    description: 'Patrol fighter — tight turns, forgiving handling.',
    previewScale: 1.0,
    ingameScale: 1.15,
  },
  {
    id: 'qs_striker',
    name: 'Striker',
    url: MODEL_URLS.qs_striker,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'fighter',
    description: 'Attack fighter — punchy throttle, short chassis.',
    previewScale: 1.0,
    ingameScale: 1.15,
  },
  {
    id: 'qs_imperial',
    name: 'Imperial',
    url: MODEL_URLS.qs_imperial,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'fighter',
    description: 'Escort frame — stable cruise, steady under pressure.',
    previewScale: 1.0,
    ingameScale: 1.15,
  },
  {
    id: 'qs_executioner',
    name: 'Executioner',
    url: MODEL_URLS.qs_executioner,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'fighter',
    description: 'Heavy fighter — slow turn but punishing broadside.',
    previewScale: 1.0,
    ingameScale: 1.18,
  },
  {
    id: 'qs_omen',
    name: 'Omen',
    url: MODEL_URLS.qs_omen,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'fighter',
    description: 'Interceptor — long range, best at hit-and-run.',
    previewScale: 1.0,
    ingameScale: 1.12,
  },
  {
    id: 'qs_spitfire',
    name: 'Spitfire',
    url: MODEL_URLS.qs_spitfire,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'fighter',
    description: 'Dogfighter — nimble, burns fast, forgiving to learn.',
    previewScale: 1.0,
    ingameScale: 1.13,
  },
  {
    id: 'qs_dispatcher',
    name: 'Dispatcher',
    url: MODEL_URLS.qs_dispatcher,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'hauler',
    description: 'Courier frame — fast cargo, modest armour, route runner.',
    previewScale: 1.0,
    ingameScale: 1.14,
  },
  {
    id: 'qs_insurgent',
    name: 'Insurgent',
    url: MODEL_URLS.qs_insurgent,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'fighter',
    description: 'Raider profile — unpredictable in a brawl.',
    previewScale: 1.0,
    ingameScale: 1.15,
  },
  {
    id: 'qs_zenith',
    name: 'Zenith',
    url: MODEL_URLS.qs_zenith,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'explorer',
    description: 'Scout — long legs, wide sensor cone.',
    previewScale: 1.0,
    ingameScale: 1.18,
  },
  {
    id: 'qs_pancake',
    name: 'Pancake',
    url: MODEL_URLS.qs_pancake,
    tier: 'starter',
    rarity: 'common',
    shipClass: 'fighter',
    description: 'Flat, wide, oddly charming — the pilot favourite.',
    previewScale: 1.0,
    ingameScale: 1.16,
  },

  // ── Uncommon — one representative per USC family ─────────────────────────
  {
    id: 'usc_hyperfalcon',
    name: 'HyperFalcon',
    url: MODEL_URLS.usc_hyperfalcon01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'Slim USC interceptor — thin margins, top-end speed.',
    previewScale: 0.55,
    ingameScale: 0.7,
  },
  {
    id: 'usc_lightfox',
    name: 'LightFox',
    url: MODEL_URLS.usc_lightfox01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'Nimble USC skirmisher — designed for cut-and-run.',
    previewScale: 0.55,
    ingameScale: 0.72,
  },
  {
    id: 'usc_starsparrow',
    name: 'StarSparrow',
    url: MODEL_URLS.usc_starsparrow01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'explorer',
    description: 'USC scout — broad solar panels, deep range.',
    previewScale: 0.55,
    ingameScale: 0.7,
  },
  {
    id: 'usc_striderox',
    name: 'Striderox',
    url: MODEL_URLS.usc_striderox01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'hauler',
    description: 'USC freighter — oversized cargo pod, armoured spine.',
    previewScale: 0.45,
    ingameScale: 0.58,
  },
  {
    id: 'usc_nightaye',
    name: 'NightAye',
    url: MODEL_URLS.usc_nightaye01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC strike craft — low profile, night-ops livery.',
    previewScale: 0.5,
    ingameScale: 0.66,
  },
  {
    id: 'usc_meteormantis',
    name: 'MeteorMantis',
    url: MODEL_URLS.usc_meteormantis01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC mantis-shaped skirmisher — alien in silhouette.',
    previewScale: 0.5,
    ingameScale: 0.66,
  },
  {
    id: 'usc_craizanstar',
    name: 'CraizanStar',
    url: MODEL_URLS.usc_craizanstar01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC heavy — armoured up, burns slow, hits hard.',
    previewScale: 0.4,
    ingameScale: 0.52,
  },
  {
    id: 'usc_forcebadger',
    name: 'ForceBadger',
    url: MODEL_URLS.usc_forcebadger01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC brawler — designed to absorb damage and keep pushing.',
    previewScale: 0.42,
    ingameScale: 0.54,
  },
  {
    id: 'usc_protonlegacy',
    name: 'ProtonLegacy',
    url: MODEL_URLS.usc_protonlegacy01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC legacy class — reliable frame, well-trusted by vets.',
    previewScale: 0.55,
    ingameScale: 0.7,
  },
  {
    id: 'usc_galacticleopard',
    name: 'GalacticLeopard',
    url: MODEL_URLS.usc_galacticleopard1,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC predator class — sleek panels, burst acceleration.',
    previewScale: 0.45,
    ingameScale: 0.58,
  },
  {
    id: 'usc_galaxyraptor',
    name: 'GalaxyRaptor',
    url: MODEL_URLS.usc_galaxyraptor01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC raptor profile — hooks its prey with razor-sharp dives.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },
  {
    id: 'usc_spacesphinx',
    name: 'SpaceSphinx',
    url: MODEL_URLS.usc_spacesphinx01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC sphinx silhouette — riddling manoeuvrability.',
    previewScale: 0.55,
    ingameScale: 0.7,
  },
  {
    id: 'usc_spaceexcalibur',
    name: 'SpaceExcalibur',
    url: MODEL_URLS.usc_spaceexcalibur01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC sword-class — vertical blade profile, heavy forward armour.',
    previewScale: 0.55,
    ingameScale: 0.7,
  },
  {
    id: 'usc_genericspaceship',
    name: 'Generic Spaceship',
    url: MODEL_URLS.usc_genericspaceship01,
    tier: 'premium',
    rarity: 'uncommon',
    shipClass: 'fighter',
    description: 'USC utility frame — for pilots who prefer to paint their own.',
    previewScale: 0.55,
    ingameScale: 0.7,
  },

  // ── Rare — named hero USC ships (earnable via gameplay) ──────────────────
  {
    id: 'usc_astroeagle',
    name: 'AstroEagle',
    url: MODEL_URLS.usc_astroeagle01,
    tier: 'starter',
    rarity: 'rare',
    shipClass: 'fighter',
    description: 'Medium USC fighter — swift interceptor, agile handling.',
    previewScale: 0.6,
    ingameScale: 0.75,
  },
  {
    id: 'usc_cosmicshark',
    name: 'CosmicShark',
    url: MODEL_URLS.usc_cosmicshark01,
    tier: 'starter',
    rarity: 'rare',
    shipClass: 'fighter',
    description: 'Medium USC fighter — predator profile, aggressive strike craft.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },
  {
    id: 'usc_voidwhale',
    name: 'VoidWhale',
    url: MODEL_URLS.usc_voidwhale01,
    tier: 'premium',
    rarity: 'rare',
    shipClass: 'capital',
    description: 'Capital-class hauler. Massive, slow, imposing — rare sighting.',
    previewScale: 0.25,
    ingameScale: 0.4,
  },

  // ── Epic — Hi-Rez full hulls (high-GHAI tier) ────────────────────────────
  {
    id: 'hirez_mainbody01',
    name: 'Hi-Rez Mainbody I',
    url: MODEL_URLS.hirez_mainbody01,
    tier: 'premium',
    rarity: 'epic',
    shipClass: 'fighter',
    description: 'Hi-Rez studio hull — aggressive silhouette, full PBR lighting.',
    previewScale: 0.7,
    ingameScale: 0.9,
  },
  {
    id: 'hirez_mainbody02',
    name: 'Hi-Rez Mainbody II',
    url: MODEL_URLS.hirez_mainbody02,
    tier: 'premium',
    rarity: 'epic',
    shipClass: 'fighter',
    description: 'Hi-Rez studio hull — sleeker variant, tournament-tier.',
    previewScale: 0.7,
    ingameScale: 0.9,
  },
  {
    id: 'hirez_mainbody05',
    name: 'Hi-Rez Mainbody V',
    url: MODEL_URLS.hirez_mainbody05,
    tier: 'premium',
    rarity: 'epic',
    shipClass: 'fighter',
    description: 'Hi-Rez studio hull — heavy fighter, front-facing broadside.',
    previewScale: 0.7,
    ingameScale: 0.9,
  },

  // ── Legendary — USCX expansion (signature cosmetics) ─────────────────────
  {
    id: 'uscx_galacticokamoto',
    name: 'GalacticOkamoto',
    url: MODEL_URLS.uscx_galacticokamoto1,
    tier: 'premium',
    rarity: 'legendary',
    shipClass: 'fighter',
    description: 'Signature skin, handcrafted paneling. Legendary drop.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },
  {
    id: 'uscx_starforce',
    name: 'StarForce',
    url: MODEL_URLS.uscx_starforce01,
    tier: 'premium',
    rarity: 'legendary',
    shipClass: 'fighter',
    description: 'Elite squadron livery. Turn-key dogfighter.',
    previewScale: 0.5,
    ingameScale: 0.65,
  },
  {
    id: 'uscx_nova',
    name: 'Nova',
    url: MODEL_URLS.uscx_nova,
    tier: 'premium',
    rarity: 'legendary',
    shipClass: 'fighter',
    description: 'Burst-drive frame — charges, releases, resets.',
    previewScale: 0.6,
    ingameScale: 0.78,
  },
  {
    id: 'uscx_scorpionship',
    name: 'Scorpion',
    url: MODEL_URLS.uscx_scorpionship,
    tier: 'premium',
    rarity: 'legendary',
    shipClass: 'fighter',
    description: 'Articulated tail-lance. Rare boss-tier silhouette.',
    previewScale: 0.6,
    ingameScale: 0.78,
  },
  {
    id: 'uscx_spidership',
    name: 'Spidership',
    url: MODEL_URLS.uscx_spidership,
    tier: 'premium',
    rarity: 'legendary',
    shipClass: 'salvager',
    description: 'Many-legged salvage frame — grippy manoeuvring.',
    previewScale: 0.6,
    ingameScale: 0.78,
  },
  {
    id: 'uscx_pullora',
    name: 'Pullora',
    url: MODEL_URLS.uscx_pullora,
    tier: 'premium',
    rarity: 'legendary',
    shipClass: 'fighter',
    description: 'Exotic curvature — reads like organic geometry.',
    previewScale: 0.65,
    ingameScale: 0.82,
  },
  {
    id: 'uscx_arrowship',
    name: 'Arrowship',
    url: MODEL_URLS.uscx_arrowship,
    tier: 'premium',
    rarity: 'legendary',
    shipClass: 'fighter',
    description: 'Arrow-sleek racer — all speed, no forgiveness.',
    previewScale: 0.65,
    ingameScale: 0.82,
  },
  {
    id: 'uscx_starship',
    name: 'Starship',
    url: MODEL_URLS.uscx_starship,
    tier: 'premium',
    rarity: 'legendary',
    shipClass: 'capital',
    description: 'Flagship-class USCX — parade piece with real teeth.',
    previewScale: 0.45,
    ingameScale: 0.6,
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

// ── Rarity badge metadata — consumed by ShipPicker.tsx ───────────────────
export const RARITY_LABEL: Record<Rarity, string> = {
  starter:   'STARTER',
  common:    'COMMON',
  uncommon:  'UNCOMMON',
  rare:      'RARE',
  epic:      'EPIC',
  legendary: 'LEGENDARY',
  mythic:    'MYTHIC',
}

// Primary badge stroke + glow colour. `text` is the foreground for solid
// badges, `bg` is the tinted background fill.
export interface RarityStyle {
  text: string
  bg: string
  border: string
  glow: string
  /** True → solid filled badge (starter/rare/epic). False → outlined chip. */
  solid: boolean
  /** Iridescent gradient overrides the above for Mythic. */
  gradient?: string
}

export const RARITY_STYLE: Record<Rarity, RarityStyle> = {
  starter: {
    text: '#0a0a0a',
    bg: '#66ff99',
    border: '#66ff99',
    glow: 'rgba(102,255,153,0.55)',
    solid: true,
  },
  common: {
    text: '#7fd8ff',
    bg: 'rgba(127,216,255,0.14)',
    border: 'rgba(127,216,255,0.55)',
    glow: 'rgba(127,216,255,0.35)',
    solid: false,
  },
  uncommon: {
    text: '#5eead4',
    bg: 'rgba(94,234,212,0.12)',
    border: 'rgba(94,234,212,0.55)',
    glow: 'rgba(94,234,212,0.35)',
    solid: false,
  },
  rare: {
    text: '#ffffff',
    bg: '#a855f7',
    border: '#a855f7',
    glow: 'rgba(168,85,247,0.55)',
    solid: true,
  },
  epic: {
    text: '#ffffff',
    bg: '#ec4899',
    border: '#ec4899',
    glow: 'rgba(236,72,153,0.55)',
    solid: true,
  },
  legendary: {
    text: '#0a0a0a',
    bg: '#f5b642',
    border: '#f5b642',
    glow: 'rgba(245,182,66,0.55)',
    solid: true,
  },
  mythic: {
    text: '#ffffff',
    bg: 'transparent',
    border: 'rgba(255,255,255,0.8)',
    glow: 'rgba(255,200,255,0.6)',
    solid: true,
    gradient: 'linear-gradient(120deg, #ff7ac6, #7f8fff, #5eead4, #ffd166)',
  },
}

export function getShipRarity(id: string): Rarity {
  return SHIP_CATALOG.find(s => s.id === id)?.rarity ?? 'common'
}
