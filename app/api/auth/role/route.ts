// app/api/auth/role/route.ts
// Returns the current user's role from profiles.
// Used by client components that can't reliably query profiles via anon key + RLS.

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ role: null })

  // Service role key is optional — if missing, we can't check admin role
  // but we don't want to crash the route. Non-admin is the safe default.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ role: null })
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  )

  const { data } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ role: data?.role ?? null })
}
