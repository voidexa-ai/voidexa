export type StarNode = {
  id: string
  label: string
  sublabel: string
  href: string
  position: [number, number, number]
  size: number
  color: string
  isCenter?: boolean
}

export const NODES: StarNode[] = [
  {
    id: 'core',
    label: 'voidexa',
    sublabel: 'intelligent systems',
    href: '/',
    position: [0, 0, 0],
    size: 1.0,
    color: '#00d4ff',
    isCenter: true,
  },
  {
    id: 'trading',
    label: 'Trading',
    sublabel: 'All-Season Bot · Scalper',
    href: '/trading',
    position: [5.5, 0.8, 0],
    size: 0.55,
    color: '#f59e0b',
  },
  {
    id: 'apps',
    label: 'Apps',
    sublabel: 'Comlink · Encrypted Messenger',
    href: '/apps',
    position: [-4, 2.5, 1],
    size: 0.5,
    color: '#8b5cf6',
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    sublabel: 'Book Creator · Web Builder',
    href: '/ai-tools',
    position: [2, -3.5, 2.5],
    size: 0.5,
    color: '#10b981',
  },
  {
    id: 'services',
    label: 'Services',
    sublabel: 'Custom AI · Data Intelligence',
    href: '/services',
    position: [-3.5, -2, -2],
    size: 0.5,
    color: '#f43f5e',
  },
  {
    id: 'about',
    label: 'About',
    sublabel: 'Born from the void',
    href: '/about',
    position: [3.5, -2.5, -3],
    size: 0.45,
    color: '#06b6d4',
  },
  {
    id: 'contact',
    label: 'Contact',
    sublabel: 'Get in touch',
    href: '/contact',
    position: [-2, 3.5, -2.5],
    size: 0.45,
    color: '#a78bfa',
  },
]
