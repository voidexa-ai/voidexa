// app/control-plane/page.tsx
// KCP-90 Control Plane — admin-only, access via /control-plane directly

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
// DashboardLoader is a Client Component that wraps ControlPlaneDashboard with
// dynamic(ssr:false) — dynamic() with ssr:false cannot be used in Server Components.
import DashboardLoader from '@/components/control-plane/DashboardLoader';

export const metadata = { title: 'KCP-90 Control Plane — voidexa' };

export default async function ControlPlanePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  // AFS-4: dashboard fetches /api/kcp90/stats on mount (new aggregation shape
  // from kcp90_compression_events). Empty initial — avoids double-fetch and
  // decouples SSR from the runtime data contract.
  const initial = {
    summary: null as null,
    daily: [] as unknown[],
    recent: [] as unknown[],
  };

  return <DashboardLoader initial={initial} />;
}
