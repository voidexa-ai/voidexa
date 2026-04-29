export type PlanetType =
  | 'sun'
  | 'desert'
  | 'ocean'
  | 'ice'
  | 'jungle'
  | 'gas'
  | 'volcanic'
  | 'tech'
  | 'mystery'
  | 'station'

export interface StarNode {
  id: string
  label: string
  path: string | null
  position: [number, number, number]
  color: string
  emissive: string
  emissiveIntensity: number
  size: number
  isCenter: boolean
  sublabel: string
  isDiscovered: boolean
  planetType?: PlanetType
  texture?: string
}

// AFS-10 — 10 placed planets per locked SLUT 21 mapping. orange.png and
// goldenblue.png remain on disk at /textures/planets/ as reserved future
// nodes (orange = TBD, goldenblue = first Pioneer planet-claim) and are
// intentionally NOT wired here.
export const STAR_MAP_NODES: StarNode[] = [
  {
    id: 'voidexa',
    label: 'voidexa',
    path: '/home',
    position: [0, 0, 0],
    color: '#ffd97a',
    emissive: '#ffb347',
    emissiveIntensity: 1.6,
    size: 0.95,
    isCenter: true,
    sublabel: 'Sovereign AI Infrastructure',
    isDiscovered: true,
    planetType: 'sun',
    texture: '/textures/planets/voidexa.png',
  },
  {
    id: 'apps',
    label: 'Apps',
    path: '/apps',
    position: [-6, 2.5, -8],
    color: '#ffffff',
    emissive: '#cc66ff',
    emissiveIntensity: 0.55,
    size: 0.34,
    isCenter: false,
    sublabel: 'Secure Tools · Private by Design',
    isDiscovered: true,
    planetType: 'tech',
    texture: '/textures/planets/pink.png',
  },
  {
    id: 'services',
    label: 'Services',
    path: '/services',
    position: [6, -1, -8],
    color: '#ffffff',
    emissive: '#aa55ff',
    emissiveIntensity: 0.55,
    size: 0.34,
    isCenter: false,
    sublabel: 'Custom AI · Data Intelligence',
    isDiscovered: true,
    planetType: 'volcanic',
    texture: '/textures/planets/lilla.png',
  },
  {
    id: 'station',
    label: 'Space Station',
    path: '/station',
    position: [-3, -2, -7],
    color: '#ffffff',
    emissive: '#44aacc',
    emissiveIntensity: 0.45,
    size: 0.28,
    isCenter: false,
    sublabel: 'Content Hub',
    isDiscovered: true,
    planetType: 'station',
    texture: '/textures/planets/spacestation_planet.png',
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    path: '/ai-tools',
    position: [0, -4, -10],
    color: '#ffffff',
    emissive: '#3399ff',
    emissiveIntensity: 0.55,
    size: 0.36,
    isCenter: false,
    sublabel: 'Multi-AI Orchestration Suite',
    isDiscovered: true,
    planetType: 'jungle',
    texture: '/textures/planets/earth.png',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    position: [5, 3.5, -12],
    color: '#ffffff',
    emissive: '#ff77bb',
    emissiveIntensity: 0.55,
    size: 0.32,
    isCenter: false,
    sublabel: 'Get in touch',
    isDiscovered: true,
    planetType: 'desert',
    texture: '/textures/planets/purpel-pink.png',
  },
  {
    id: 'quantum',
    label: 'Quantum',
    path: '/quantum',
    position: [3.5, 0, -14],
    color: '#ffffff',
    emissive: '#a78bfa',
    emissiveIntensity: 0.6,
    size: 0.42,
    isCenter: false,
    sublabel: 'Council · Forge · Void Pro AI',
    isDiscovered: true,
    planetType: 'gas',
    texture: '/textures/planets/saturen_like_rings.png',
  },
  {
    id: 'trading-hub',
    label: 'Trading Hub',
    path: '/trading-hub',
    position: [-5.5, -3, -14],
    color: '#ffffff',
    emissive: '#66ccff',
    emissiveIntensity: 0.55,
    size: 0.36,
    isCenter: false,
    sublabel: 'Bot · Live · Leaderboard · Compete',
    isDiscovered: true,
    planetType: 'ice',
    texture: '/textures/planets/icy_blue.png',
  },
  {
    id: 'game-hub',
    label: 'Game Hub',
    path: '/game-hub',
    position: [4, -3.5, -16],
    color: '#ffffff',
    emissive: '#ff5544',
    emissiveIntensity: 0.55,
    size: 0.34,
    isCenter: false,
    sublabel: 'Play · Build · Compete · Earn',
    isDiscovered: true,
    planetType: 'volcanic',
    texture: '/textures/planets/red_rocky.png',
  },
  {
    id: 'claim-your-planet',
    label: 'Yours?',
    path: '/claim-your-planet',
    position: [-2, 4.5, -20],
    color: '#ffffff',
    emissive: '#88ffaa',
    emissiveIntensity: 0.4,
    size: 0.26,
    isCenter: false,
    sublabel: 'Claim your planet',
    isDiscovered: false,
    planetType: 'mystery',
    texture: '/textures/planets/pastel_green.png',
  },
]

// Legacy export for any components still using NODES
export const NODES = STAR_MAP_NODES.map(n => ({ ...n, href: n.path }))
