export interface QuickMenuPanel {
  key: 'website' | 'apps' | 'universe' | 'tools'
  title: string
  description: string
  icon: string
  href?: string
}

export const QUICK_MENU_PANELS: QuickMenuPanel[] = [
  { key: 'website',  title: 'Website Creation', description: 'AI-assisted websites delivered fast and affordable.', icon: '🌐' },
  { key: 'apps',     title: 'Custom Apps',      description: 'Bespoke software tailored to your business workflow.', icon: '🛠', href: '/products/apps' },
  { key: 'universe', title: 'Universe',         description: 'Explore the living voidexa sci-fi universe.',         icon: '🧭', href: '/universe' },
  { key: 'tools',    title: 'Tools',            description: 'Production-grade AI tools engineered at voidexa.',    icon: '⚡', href: '/products/ai-tools' },
]

export const PRIMARY_CTA = { label: 'Enter Free Flight', href: '/freeflight' as const }
export const SECONDARY_CTA = { label: 'Enter Star Map', href: '/starmap' as const }

export const SKIP_BUTTON_THRESHOLD_SEC = 3
export const OVERLAY_FADE_IN_DELAY_MS = 2000
