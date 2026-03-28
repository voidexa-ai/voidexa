// app/api/kcp90/stats/route.ts
// KCP-90 stats API
//   GET  — Control Plane dashboard auto-refresh (admin session required)
//   POST — Ingest compression event from local products (Bearer token required)
//          Body: { product, encoder_used, original_chars, compressed_chars,
//                  compression_ratio, tokens_saved, session_id? }

import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// ─── POST — ingest a compression event ───────────────────────────────────────

const VALID_ENCODERS = ['ollama', 'regex', 'raw'] as const;
type EncoderUsed = typeof VALID_ENCODERS[number];

export async function POST(request: NextRequest) {
  // Auth: shared secret for machine-to-machine calls
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const secret = process.env.KCP90_API_SECRET;

  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Validate required fields
  const { product, encoder_used, original_chars, compressed_chars, compression_ratio, tokens_saved, session_id } = body;

  if (typeof product !== 'string' || !product.trim()) {
    return NextResponse.json({ error: 'product is required' }, { status: 422 });
  }
  if (!VALID_ENCODERS.includes(encoder_used as EncoderUsed)) {
    return NextResponse.json({ error: `encoder_used must be one of: ${VALID_ENCODERS.join(', ')}` }, { status: 422 });
  }
  if (typeof original_chars !== 'number' || original_chars < 0) {
    return NextResponse.json({ error: 'original_chars must be a non-negative number' }, { status: 422 });
  }
  if (typeof compressed_chars !== 'number' || compressed_chars < 0) {
    return NextResponse.json({ error: 'compressed_chars must be a non-negative number' }, { status: 422 });
  }
  if (typeof compression_ratio !== 'number' || compression_ratio < 0 || compression_ratio > 1) {
    return NextResponse.json({ error: 'compression_ratio must be a number between 0 and 1' }, { status: 422 });
  }
  if (typeof tokens_saved !== 'number' || tokens_saved < 0) {
    return NextResponse.json({ error: 'tokens_saved must be a non-negative number' }, { status: 422 });
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await serviceClient
    .from('kcp90_stats')
    .insert({
      product:           String(product).trim(),
      encoder_used:      encoder_used as EncoderUsed,
      original_chars:    Math.round(original_chars as number),
      compressed_chars:  Math.round(compressed_chars as number),
      compression_ratio: compression_ratio as number,
      tokens_saved:      Math.round(tokens_saved as number),
      ...(typeof session_id === 'string' && session_id ? { session_id } : {}),
    })
    .select('id, created_at')
    .single();

  if (error) {
    console.error('[kcp90/stats POST]', error);
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id, created_at: data.created_at }, { status: 201 });
}

// ─── GET — dashboard data ─────────────────────────────────────────────────────

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
