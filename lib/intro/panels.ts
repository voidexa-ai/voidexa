export interface QuickMenuPanel {
  key: 'website' | 'apps' | 'universe' | 'tools'
  title: string
  description: string
  icon: string
  href?: string
}

export const QUICK_MENU_PANELS: QuickMenuPanel[] = [
  { key: 'website',  title: 'Website Creation', description: 'AI-assisted websites delivered fast and affordable.', icon: '🌐' },
  { key: 'apps',     title: 'Custom Apps',      description: 'Bespoke software tailored to your business workflow.', icon: '🛠', href: '/apps' },
  { key: 'universe', title: 'Universe',         description: 'Explore the living voidexa sci-fi universe.',         icon: '🧭', href: '/starmap' },
  { key: 'tools',    title: 'Tools',            description: 'Production-grade AI tools engineered at voidexa.',    icon: '⚡', href: '/ai-tools' },
]

export const PRIMARY_CTA = { label: 'Enter Free Flight', href: '/freeflight' as const }
// Sprint 15 Task 7: both CTAs now route to Level 1 Galaxy View. The Universe
// panel already points at /starmap; unifying the secondary CTA here means
// pilots always enter via the wide view and zoom into Level 2 by picking
// the voidexa planet.
export const SECONDARY_CTA = { label: 'Enter Star Map', href: '/starmap' as const }

export const SKIP_BUTTON_THRESHOLD_SEC = 3
export const OVERLAY_FADE_IN_DELAY_MS = 2000
