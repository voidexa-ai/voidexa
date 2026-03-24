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
    emissive: '#00d4ff',
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
    emissive: '#ff8c00',
    emissiveIntensity: 2.5,
    size: 0.35,
    isCenter: false,
    sublabel: 'All-Season Bot · Scalper',
  },
  {
    id: 'apps',
    label: 'Apps',
    path: '/apps',
    position: [-4, 1.5, -6],
    color: '#0f001a',
    emissive: '#bf5af2',
    emissiveIntensity: 2.5,
    size: 0.35,
    isCenter: false,
    sublabel: 'Comlink · Encrypted Messenger',
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    path: '/ai-tools',
    position: [0, -3, -8],
    color: '#001a0a',
    emissive: '#30d158',
    emissiveIntensity: 2.5,
    size: 0.35,
    isCenter: false,
    sublabel: 'Book Creator · Web Builder',
  },
  {
    id: 'services',
    label: 'Services',
    path: '/services',
    position: [5, -1, -7],
    color: '#1a0005',
    emissive: '#ff375f',
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
    color: '#000a1a',
    emissive: '#0a84ff',
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
    color: '#1a1a00',
    emissive: '#ffd60a',
    emissiveIntensity: 2.0,
    size: 0.3,
    isCenter: false,
    sublabel: 'Get in touch',
  },
]

// Legacy export for any components still using NODES
export const NODES = STAR_MAP_NODES.map(n => ({ ...n, href: n.path }))
