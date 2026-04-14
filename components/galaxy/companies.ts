export type Industry =
  | 'infrastructure'
  | 'finance'
  | 'tech'
  | 'creative'
  | 'commerce'
  | 'unknown'

export interface CompanyPlanet {
  id: string
  name: string
  slug: string
  sublabel: string
  path: string
  position: [number, number, number]
  color: string
  emissive: string
  emissiveIntensity: number
  size: number
  industry: Industry
  isSun: boolean
  isMystery: boolean
  isReal: boolean
  gravityScore: number
}

// v1: only voidexa is real. Claim Your Planet is always present as the mystery node.
// Supabase `companies` table will later populate additional planets.
export const GALAXY_PLANETS: CompanyPlanet[] = [
  {
    id: 'voidexa',
    name: 'voidexa',
    slug: 'voidexa',
    sublabel: 'Sovereign AI Infrastructure',
    path: '/starmap/voidexa',
    position: [0, 0, 0],
    color: '#041025',
    emissive: '#00ffff',
    emissiveIntensity: 5.0,
    size: 1.2,
    industry: 'infrastructure',
    isSun: true,
    isMystery: false,
    isReal: true,
    gravityScore: 100,
  },
  {
    id: 'claim-your-planet',
    name: 'Your Planet?',
    slug: 'claim-your-planet',
    sublabel: 'Claim your planet in the galaxy',
    path: '/claim-your-planet',
    position: [-14, -3, -18],
    color: '#001a1a',
    emissive: '#00d4ff',
    emissiveIntensity: 0.6,
    size: 0.35,
    industry: 'unknown',
    isSun: false,
    isMystery: true,
    isReal: false,
    gravityScore: 0,
  },
]

export const INDUSTRY_META: Record<Industry, { label: string; color: string }> = {
  infrastructure: { label: 'Infrastructure', color: '#00ffff' },
  finance:        { label: 'Finance',        color: '#ffaa00' },
  tech:           { label: 'Tech',           color: '#a78bfa' },
  creative:       { label: 'Creative',       color: '#ff6699' },
  commerce:       { label: 'Commerce',       color: '#66ff99' },
  unknown:        { label: 'Unclaimed',      color: '#00d4ff' },
}
