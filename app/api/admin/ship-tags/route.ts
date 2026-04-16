import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import type { ShipTag, ShipTaggingFile } from '@/lib/data/shipTagging'

// Internal admin tagger storage. Reads/writes lib/data/shipTagging.json.
//
// Auth: every mutating request must carry an `x-admin-secret` header that
// matches process.env.ADMIN_SECRET. GET is also gated so a casual visitor
// can't read in-progress pricing decisions. Vercel's filesystem is ephemeral
// in serverless functions but Next 15 app-router with Node runtime can write
// to the bundled cwd at runtime — for production tagging Jix should commit
// the JSON via the Export button + git push.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FILE = path.join(process.cwd(), 'lib/data/shipTagging.json')

function authorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_SECRET?.trim()
  if (!expected) return false
  const provided = req.headers.get('x-admin-secret')?.trim()
  return !!provided && provided === expected
}

async function loadFile(): Promise<ShipTaggingFile> {
  try {
    const raw = await fs.readFile(FILE, 'utf-8')
    return JSON.parse(raw) as ShipTaggingFile
  } catch {
    return { version: 1, lastUpdated: new Date().toISOString(), ships: {} }
  }
}

async function saveFile(data: ShipTaggingFile): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await loadFile()
  return NextResponse.json(data)
}

interface PostBody {
  shipId?: unknown
  tag?: unknown
}

function isShipTag(value: unknown): value is ShipTag {
  if (!value || typeof value !== 'object') return false
  const t = value as Record<string, unknown>
  return 'tier' in t && 'role' in t && 'priceUSD' in t && 'priceGHAI' in t && 'achievementId' in t && 'notes' in t
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: PostBody
  try {
    body = (await req.json()) as PostBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (typeof body.shipId !== 'string' || !body.shipId) {
    return NextResponse.json({ error: 'shipId required' }, { status: 400 })
  }
  if (!isShipTag(body.tag)) {
    return NextResponse.json({ error: 'invalid tag shape' }, { status: 400 })
  }
  const data = await loadFile()
  data.ships[body.shipId] = body.tag
  data.lastUpdated = new Date().toISOString()
  try {
    await saveFile(data)
  } catch (err) {
    return NextResponse.json({ error: 'write failed', detail: String(err) }, { status: 500 })
  }
  return NextResponse.json({ ok: true, lastUpdated: data.lastUpdated })
}
