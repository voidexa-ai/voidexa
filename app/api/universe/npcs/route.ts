import { NextResponse } from 'next/server'
import { loadNpcs, filterByZone } from '@/lib/game/universe/loaders'
import type { UniverseZone } from '@/lib/game/universe/types'

export const runtime = 'edge'

const VALID_ZONES: ReadonlySet<string> = new Set([
  'all',
  'inner_ring',
  'outer_rim',
  'contested_space',
  'deep_void',
])

export function GET(req: Request) {
  const url = new URL(req.url)
  const zoneParam = (url.searchParams.get('zone') ?? 'all').trim()
  const hostileParam = url.searchParams.get('hostile')
  const limitParam = url.searchParams.get('limit')

  const zone = (VALID_ZONES.has(zoneParam) ? zoneParam : 'all') as
    | UniverseZone
    | 'all'
  let items = filterByZone(loadNpcs(), zone)
  if (hostileParam === 'true') items = items.filter((n) => n.hostile)
  else if (hostileParam === 'false') items = items.filter((n) => !n.hostile)
  const limit = limitParam ? Math.max(1, Math.min(200, Number(limitParam) | 0)) : items.length
  return NextResponse.json({
    count: items.length,
    returned: Math.min(items.length, limit),
    zone,
    items: items.slice(0, limit),
  })
}
