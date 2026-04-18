import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

interface Body {
  contact?: unknown
  type?: unknown
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const contact = typeof body.contact === 'string' ? body.contact.trim() : ''
  const type = body.type === 'phone' ? 'phone' : body.type === 'email' ? 'email' : null

  if (!contact || !type) {
    return NextResponse.json({ error: 'contact and type are required' }, { status: 400 })
  }

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

  if (!url || !serviceKey) {
    console.error('[website-lead] missing supabase env')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey)
  const { error } = await supabase
    .from('leads')
    .insert({ contact, type, source: 'website_creation' })

  if (error) {
    console.error('[website-lead] supabase insert failed', error)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  console.log('[website-lead] new lead →', { type, contact })
  return NextResponse.json({ success: true })
}
