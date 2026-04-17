import { NextResponse } from 'next/server'
import { loadEncounters, filterByZone } from '@/lib/game/universe/loaders'
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
  const dangerParam = url.searchParams.get('maxDanger')
  const limitParam = url.searchParams.get('limit')

  const zone = (VALID_ZONES.has(zoneParam) ? zoneParam : 'all') as
    | UniverseZone
    | 'all'
  let items = filterByZone(loadEncounters(), zone)
  if (dangerParam) {
    const max = Math.max(1, Math.min(5, Number(dangerParam) | 0))
    items = items.filter((e) => e.danger_level <= max)
  }
  const limit = limitParam ? Math.max(1, Math.min(200, Number(limitParam) | 0)) : items.length
  return NextResponse.json({
    count: items.length,
    returned: Math.min(items.length, limit),
    zone,
    items: items.slice(0, limit),
  })
}
