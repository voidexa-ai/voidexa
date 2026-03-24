export interface StarNode {
  id: string
  label: string
  path: string
  position: [number, number, number]
  color: string
  emissive: string
  emissiveIntensity: number
  size: number
  isCenter: boolean
  sublabel: string
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
    size: 0.6,
    isCenter: true,
    sublabel: 'Sovereign AI Infrastructure',
  },
  {
    id: 'trading',
    label: 'Trading',
    path: '/trading',
    position: [3, 2, -5],
    color: '#1a0a00',
    emissive: '#ff6600',       // pure orange
    emissiveIntensity: 2.5,
    size: 0.35,
    isCenter: false,
    sublabel: 'Autonomous Trading Platform',
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
  },
]

// Legacy export for any components still using NODES
export const NODES = STAR_MAP_NODES.map(n => ({ ...n, href: n.path }))
