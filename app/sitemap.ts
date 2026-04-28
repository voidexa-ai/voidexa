import type { MetadataRoute } from 'next'

const SITE_URL = 'https://voidexa.com'

// Public English routes. Keep alphabetised by path for easy diffing.
const EN_ROUTES: readonly string[] = [
  '/',
  '/about',
  '/achievements',
  '/ai-tools',
  '/ai-trading',
  '/apps',
  '/assembly-editor',
  '/break-room',
  '/cards',
  '/cards/deck-builder',
  '/manual',
  '/manual/foundation',
  '/manual/battle',
  '/manual/cards',
  '/manual/pilots',
  '/manual/glossary',
  '/claim-your-planet',
  '/contact',
  '/cookies',
  '/freeflight',
  '/ghost-ai',
  '/home',
  '/privacy',
  '/products',
  '/quantum',
  '/services',
  '/ship-catalog',
  '/shop',
  '/shop/packs',
  '/starmap',
  '/starmap/voidexa',
  '/station',
  '/team',
  '/terms',
  '/token',
  '/trading',
  '/trading-hub',
  '/white-paper',
  '/whitepaper',
]

// Danish locale mirrors. Only routes with a real /dk/* page.tsx are listed.
const DK_ROUTES: readonly string[] = [
  '/dk',
  '/dk/about',
  '/dk/achievements',
  '/dk/break-room',
  '/dk/cards',
  '/dk/contact',
  '/dk/manual',
  '/dk/manual/foundation',
  '/dk/manual/battle',
  '/dk/manual/cards',
  '/dk/manual/pilots',
  '/dk/manual/glossary',
  '/dk/cookies',
  '/dk/freeflight',
  '/dk/privacy',
  '/dk/quantum',
  '/dk/services',
  '/dk/shop',
  '/dk/starmap',
  '/dk/team',
  '/dk/terms',
]

function priorityFor(path: string): number {
  if (path === '/' || path === '/dk') return 1.0
  if (['/home', '/about', '/services', '/products'].includes(path)) return 0.9
  if (['/privacy', '/terms', '/cookies'].includes(path)) return 0.5
  if (path.startsWith('/dk/')) return 0.6
  return 0.7
}

function changeFreqFor(path: string): 'weekly' | 'monthly' | 'yearly' {
  if (['/privacy', '/terms', '/cookies'].includes(path)) return 'yearly'
  if (path.startsWith('/dk/') && ['/dk/privacy', '/dk/terms', '/dk/cookies'].includes(path)) {
    return 'yearly'
  }
  if (path === '/' || path === '/home' || path === '/shop') return 'weekly'
  return 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const all = [...EN_ROUTES, ...DK_ROUTES]
  return all.map(path => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: changeFreqFor(path),
    priority: priorityFor(path),
  }))
}
