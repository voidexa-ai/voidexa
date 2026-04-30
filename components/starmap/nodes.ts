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

export const STAR_MAP_NODES: StarNode[] = [
  {
    id: 'voidexa',
    label: 'voidexa',
    path: '/',
    position: [0, 0, 0],
    color: '#041025',
    emissive: '#00ffff',       // bright cyan
    emissiveIntensity: 4.0,
    size: 1.8,
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
    position: [-12, 4.5, -18],
    color: '#0f001a',
    emissive: '#cc00ff',       // neon magenta/purple
    emissiveIntensity: 2.5,
    size: 2.46,
    isCenter: false,
    sublabel: 'Secure Tools · Private by Design',
    isDiscovered: true,
    planetType: 'tech',
    texture: '/textures/planets/pink.png',
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    path: '/ai-tools',
    position: [0, -9, -24],
    color: '#001a0a',
    emissive: '#00ff44',       // neon green
    emissiveIntensity: 2.5,
    size: 2.46,
    isCenter: false,
    sublabel: 'Multi-AI Orchestration Suite',
    isDiscovered: true,
    planetType: 'jungle',
    texture: '/textures/planets/earth.png',
  },
  {
    id: 'services',
    label: 'Services',
    path: '/services',
    position: [15, -3, -21],
    color: '#1a0005',
    emissive: '#ff0044',       // deep red
    emissiveIntensity: 2.5,
    size: 2.46,
    isCenter: false,
    sublabel: 'Custom AI · Data Intelligence',
    isDiscovered: true,
    planetType: 'volcanic',
    texture: '/textures/planets/lilla.png',
  },
  {
    id: 'game-hub',
    label: 'Game Hub',
    path: '/game-hub',
    position: [9, 6, -15],
    color: '#1a0a05',
    emissive: '#ff4422',       // red-orange volcanic — distinct from services emissive
    emissiveIntensity: 2.5,
    size: 2.46,
    isCenter: false,
    sublabel: 'Card Battle · Free Flight · Universe',
    isDiscovered: true,
    planetType: 'volcanic',
    texture: '/textures/planets/red_rocky.png',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    position: [12, 9, -30],
    color: '#1a1200',
    emissive: '#ffaa00',       // warm amber (distinct from orange Trading)
    emissiveIntensity: 2.0,
    size: 2.10,
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
    position: [18, -9, -48],
    color: '#060618',
    emissive: '#a78bfa',
    emissiveIntensity: 2.8,
    size: 2.24,
    isCenter: false,
    sublabel: 'Live — 1324 Tests Passed',
    isDiscovered: true,
    planetType: 'gas',
    texture: '/textures/planets/saturen_like_rings.png',
  },
  {
    id: 'trading-hub',
    label: 'Trading Hub',
    path: '/trading-hub',
    position: [-9, 12, -54],
    color: '#1a0e00',
    emissive: '#cc9955',
    emissiveIntensity: 1.8,
    size: 1.96,
    isCenter: false,
    sublabel: 'Build · Compete · Learn',
    isDiscovered: true,
    planetType: 'desert',
    texture: '/textures/planets/icy_blue.png',
  },
  {
    id: 'station',
    label: 'Space Station',
    path: '/station',
    position: [4.5, 6, -30],
    color: '#001322',
    emissive: '#44aacc',
    emissiveIntensity: 1.6,
    size: 1.26,
    isCenter: false,
    sublabel: 'Content Hub',
    isDiscovered: true,
    planetType: 'station',
    texture: '/textures/planets/spacestation_planet.png',
  },
  {
    id: 'claim-your-planet',
    label: 'Yours?',
    path: '/claim-your-planet',
    position: [-18, -6, -60],
    color: '#001a1a',
    emissive: '#00d4ff',
    emissiveIntensity: 0.4,
    size: 1.54,
    isCenter: false,
    sublabel: 'Claim your planet',
    isDiscovered: false,
    planetType: 'mystery',
    texture: '/textures/planets/pastel_green.png',
  },
]

// Legacy export for any components still using NODES
export const NODES = STAR_MAP_NODES.map(n => ({ ...n, href: n.path }))
