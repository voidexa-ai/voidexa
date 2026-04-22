// app/api/kcp90/stats/route.ts
// AFS-4: KCP-90 stats API, rewired to kcp90_compression_events.
//
//   POST — Machine-to-machine compression-event ingest (Bearer KCP90_API_SECRET).
//          Accepts the legacy body shape used by external callers:
//            { product, encoder_used, original_chars, compressed_chars,
//              compression_ratio, tokens_saved, session_id? }
//          Translates to the new kcp90_compression_events schema and writes
//          via the shared logKcp90Event helper. The legacy kcp90_stats table
//          is left in place for historical data but no longer written.
//
//   GET  — Admin-only dashboard aggregation. Returns
//            { generatedAt, windows: { '24h' | '7d' | '30d' : byProduct } }
//          where byProduct maps the 4 known products to counters. The public
//          consumer path is /api/kcp90/public-stats and is untouched.

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  logKcp90Event,
  type Kcp90Product,
} from '@/lib/kcp90/log-event';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── POST — ingest a compression event ───────────────────────────────────────

const VALID_PRODUCTS: readonly Kcp90Product[] = [
  'void-chat',
  'quantum',
  'trading-bot',
  'break-room',
];

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const secret = process.env.KCP90_API_SECRET?.trim();

  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    product,
    encoder_used,
    original_chars,
    compressed_chars,
    tokens_saved,
    session_id,
  } = body;

  if (
    typeof product !== 'string' ||
    !VALID_PRODUCTS.includes(product as Kcp90Product)
  ) {
    return NextResponse.json(
      { error: `product must be one of: ${VALID_PRODUCTS.join(', ')}` },
      { status: 422 },
    );
  }
  if (typeof original_chars !== 'number' || original_chars < 0) {
    return NextResponse.json(
      { error: 'original_chars must be a non-negative number' },
      { status: 422 },
    );
  }
  if (typeof compressed_chars !== 'number' || compressed_chars < 0) {
    return NextResponse.json(
      { error: 'compressed_chars must be a non-negative number' },
      { status: 422 },
    );
  }

  logKcp90Event({
    product: product as Kcp90Product,
    userId: null,
    sessionId: typeof session_id === 'string' ? session_id.slice(0, 128) : null,
    tokensIn: 0,
    tokensOut: 0,
    bytesRaw: Math.round(original_chars),
    bytesCompressed: Math.round(compressed_chars),
    layerUsed: typeof encoder_used === 'string' ? encoder_used : null,
    success: true,
    meta: {
      tokensSaved:
        typeof tokens_saved === 'number' ? Math.round(tokens_saved) : null,
      ingestVia: 'kcp90/stats POST',
    },
  });

  return NextResponse.json({ ok: true }, { status: 202 });
}

// ─── GET — admin dashboard aggregation ───────────────────────────────────────

type Window = '24h' | '7d' | '30d';
interface ProductCounters {
  events: number;
  tokensIn: number;
  tokensOut: number;
  bytesRaw: number;
  bytesCompressed: number;
  successes: number;
}

const WINDOW_HOURS: Record<Window, number> = {
  '24h': 24,
  '7d': 24 * 7,
  '30d': 24 * 30,
};

function emptyByProduct(): Record<Kcp90Product, ProductCounters> {
  return {
    'void-chat':   { events: 0, tokensIn: 0, tokensOut: 0, bytesRaw: 0, bytesCompressed: 0, successes: 0 },
    'quantum':     { events: 0, tokensIn: 0, tokensOut: 0, bytesRaw: 0, bytesCompressed: 0, successes: 0 },
    'trading-bot': { events: 0, tokensIn: 0, tokensOut: 0, bytesRaw: 0, bytesCompressed: 0, successes: 0 },
    'break-room':  { events: 0, tokensIn: 0, tokensOut: 0, bytesRaw: 0, bytesCompressed: 0, successes: 0 },
  };
}

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const now = Date.now();
  const windows: Record<Window, Record<Kcp90Product, ProductCounters>> = {
    '24h': emptyByProduct(),
    '7d':  emptyByProduct(),
    '30d': emptyByProduct(),
  };

  for (const label of Object.keys(WINDOW_HOURS) as Window[]) {
    const since = new Date(now - WINDOW_HOURS[label] * 3600 * 1000).toISOString();
    const { data, error } = await supabaseAdmin
      .from('kcp90_compression_events')
      .select('product, tokens_in, tokens_out, bytes_raw, bytes_compressed, success')
      .gte('ts', since);

    if (error) {
      console.error('[kcp90/stats GET] window', label, 'error:', error.message);
      continue;
    }

    for (const row of data ?? []) {
      const p = row.product as Kcp90Product;
      if (!windows[label][p]) continue;
      const c = windows[label][p];
      c.events += 1;
      c.tokensIn += row.tokens_in ?? 0;
      c.tokensOut += row.tokens_out ?? 0;
      c.bytesRaw += row.bytes_raw ?? 0;
      c.bytesCompressed += row.bytes_compressed ?? 0;
      if (row.success) c.successes += 1;
    }
  }

  const { data: recent } = await supabaseAdmin
    .from('kcp90_compression_events')
    .select('id, ts, product, tokens_in, tokens_out, bytes_raw, bytes_compressed, compression_ratio, layer_used, success')
    .order('ts', { ascending: false })
    .limit(20);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    windows,
    recent: recent ?? [],
  });
}
