import { NextResponse } from 'next/server'
import { loadLandmarks, filterByZone } from '@/lib/game/universe/loaders'
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
  const limitParam = url.searchParams.get('limit')

  const zone = (VALID_ZONES.has(zoneParam) ? zoneParam : 'all') as
    | UniverseZone
    | 'all'
  const all = loadLandmarks()
  const filtered = filterByZone(all, zone)
  const limit = limitParam ? Math.max(1, Math.min(200, Number(limitParam) | 0)) : filtered.length
  return NextResponse.json({
    count: filtered.length,
    returned: Math.min(filtered.length, limit),
    zone,
    items: filtered.slice(0, limit),
  })
}
