import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import SettingsPageClient from '@/components/settings/SettingsPageClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/settings')

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('name, role, referral_code')
    .eq('id', user.id)
    .single()

  return (
    <SettingsPageClient
      email={user.email ?? ''}
      userId={user.id}
      initialName={profile?.name ?? ''}
      role={profile?.role ?? 'user'}
    />
  )
}
