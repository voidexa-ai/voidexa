import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function ProfileRedirectPage() {
  const sb = await createServerSupabaseClient()
  const { data } = await sb.auth.getUser()
  const uid = data.user?.id
  if (!uid) redirect('/auth/login')
  redirect(`/game/profile/${uid}`)
}
