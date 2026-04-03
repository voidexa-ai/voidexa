import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY || 'salt')).digest('hex').slice(0, 16);
}

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
}

export async function GET(req: NextRequest) {
  const trackId = req.nextUrl.searchParams.get('track');
  if (!trackId) return NextResponse.json({ error: 'Missing track' }, { status: 400 });

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('jukebox_ratings')
    .select('rating')
    .eq('track_id', trackId);

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });

  const ratings = data || [];
  const avg = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  return NextResponse.json({ avg: Math.round(avg * 10) / 10, count: ratings.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { track_id, rating } = body;

    if (!track_id || typeof track_id !== 'string') {
      return NextResponse.json({ error: 'Invalid track' }, { status: 400 });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const ipHash = hashIP(ip);

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('jukebox_ratings')
      .upsert(
        { track_id, rating, ip_hash: ipHash },
        { onConflict: 'track_id,ip_hash' }
      );

    if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
