// app/control-plane/page.tsx
// KCP-90 Control Plane — admin-only, access via /control-plane directly

import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import ControlPlaneDashboard from '@/components/control-plane/ControlPlaneDashboard';

export const metadata = { title: 'KCP-90 Control Plane — voidexa' };

export default async function ControlPlanePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  // Initial SSR data fetch
  const [summaryRes, dailyRes, recentRes] = await Promise.all([
    serviceClient.from('kcp90_summary').select('*').single(),
    serviceClient
      .from('kcp90_daily_stats')
      .select('*')
      .order('day', { ascending: true })
      .limit(30),
    serviceClient
      .from('kcp90_stats')
      .select('id, product, encoder_used, original_chars, compressed_chars, compression_ratio, tokens_saved, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const initial = {
    summary: summaryRes.data ?? null,
    daily:   dailyRes.data   ?? [],
    recent:  recentRes.data  ?? [],
  };

  return <ControlPlaneDashboard initial={initial} />;
}
