import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { basePrice, riskTierForZone, timerWindow } from '@/lib/game/wrecks/economics'
import type { ShipTier } from '@/lib/game/wrecks/types'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

function admin() { return createClient(SUPABASE_URL, SERVICE_KEY) }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const shipId = body.shipId as string
    const shipTier = (body.shipTier ?? 'common') as ShipTier
    const position = body.position as { x: number; y: number; z: number }
    const zone = (body.zone ?? null) as string | null

    if (!shipId || !position || typeof position.x !== 'number') {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
    }

    const sb = await createServerSupabaseClient()
    const { data: userData } = await sb.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) return NextResponse.json({ error: 'not signed in' }, { status: 401 })

    const risk = riskTierForZone(zone)
    const window = timerWindow(risk)
    const now = Date.now()

    const adminSb = admin()
    const { data: inserted, error } = await adminSb.from('wrecks').insert({
      owner_user_id: userId,
      ship_id: shipId,
      ship_class: null,
      ship_tier: shipTier,
      base_price_ghai: basePrice(shipTier),
      position,
      sector: zone,
      risk_level: risk,
      phase: 'protected',
      protected_until: new Date(now + window.protectedMs).toISOString(),
      expires_at: new Date(now + window.totalMs).toISOString(),
    }).select('*').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, wreck: inserted })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'server error' }, { status: 500 })
  }
}
