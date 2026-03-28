// app/api/kcp90/stats/route.ts
// KCP-90 stats API — used by the Control Plane dashboard for auto-refresh

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

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

  return NextResponse.json({
    summary: summaryRes.data,
    daily: dailyRes.data ?? [],
    recent: recentRes.data ?? [],
  });
}
