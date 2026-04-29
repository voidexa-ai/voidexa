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
    path: '/home',
    position: [0, 0, 0],
    color: '#041025',
    emissive: '#00ffff',       // bright cyan
    emissiveIntensity: 4.0,
    size: 0.6,
    isCenter: true,
    sublabel: 'Sovereign AI Infrastructure',
    isDiscovered: true,
    planetType: 'sun',
    texture: '/textures/planets/voidexa.png',
  },
  {
    id: 'trading',
    label: 'AI Trading',
    path: '/trading',
    position: [3, 2, -5],
    color: '#1a0a00',
    emissive: '#ff6600',       // pure orange
    emissiveIntensity: 2.5,
    size: 0.35,
    isCenter: false,
    sublabel: 'Autonomous Bot Systems',
    isDiscovered: true,
    planetType: 'volcanic',
    texture: '/textures/planets/orange.png',
  },
  {
    id: 'apps',
    label: 'Apps',
    path: '/apps',
    position: [-4, 1.5, -6],
    color: '#0f001a',
    emissive: '#cc00ff',       // neon magenta/purple
    emissiveIntensity: 2.5,
    size: 0.35,
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
    position: [0, -3, -8],
    color: '#001a0a',
    emissive: '#00ff44',       // neon green
    emissiveIntensity: 2.5,
    size: 0.35,
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
    position: [5, -1, -7],
    color: '#1a0005',
    emissive: '#ff0044',       // deep red
    emissiveIntensity: 2.5,
    size: 0.35,
    isCenter: false,
    sublabel: 'Custom AI · Data Intelligence',
    isDiscovered: true,
    planetType: 'volcanic',
    texture: '/textures/planets/red_rocky.png',
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    position: [-2, -2, -12],
    color: '#1a1a1a',
    emissive: '#64d2ff',       // ice blue
    emissiveIntensity: 2.0,
    size: 0.3,
    isCenter: false,
    sublabel: 'Born from the void',
    isDiscovered: true,
    planetType: 'ice',
    texture: '/textures/planets/goldenblue.png',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    position: [4, 3, -10],
    color: '#1a1200',
    emissive: '#ffaa00',       // warm amber (distinct from orange Trading)
    emissiveIntensity: 2.0,
    size: 0.3,
    isCenter: false,
    sublabel: 'Get in touch',
    isDiscovered: true,
    planetType: 'desert',
    texture: '/textures/planets/purpel-pink.png',
  },
  // ── Undiscovered mystery nodes ──────────────────────────────────────────
  {
    id: 'ghost-ai',
    label: 'Void Pro AI',
    path: '/void-pro-ai',
    position: [-5, 3, -14],
    color: '#0d0820',
    emissive: '#8b5cf6',
    emissiveIntensity: 2.2,
    size: 0.28,
    isCenter: false,
    sublabel: 'Multi-AI chat with KCP-90 compression. Claude, ChatGPT & Gemini.',
    isDiscovered: true,
    planetType: 'gas',
    texture: '/textures/planets/lilla.png',
  },
  {
    id: 'quantum',
    label: 'Quantum',
    path: '/quantum',
    position: [6, -3, -16],
    color: '#060618',
    emissive: '#a78bfa',
    emissiveIntensity: 2.8,
    size: 0.32,
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
    position: [-3, 4, -18],
    color: '#1a0e00',
    emissive: '#cc9955',
    emissiveIntensity: 1.8,
    size: 0.28,
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
    position: [1.5, 2, -10],
    color: '#001322',
    emissive: '#44aacc',
    emissiveIntensity: 1.6,
    size: 0.18,
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
    position: [-6, -2, -20],
    color: '#001a1a',
    emissive: '#00d4ff',
    emissiveIntensity: 0.4,
    size: 0.22,
    isCenter: false,
    sublabel: 'Claim your planet',
    isDiscovered: false,
    planetType: 'mystery',
    texture: '/textures/planets/pastel_green.png',
  },
]

// Legacy export for any components still using NODES
export const NODES = STAR_MAP_NODES.map(n => ({ ...n, href: n.path }))
