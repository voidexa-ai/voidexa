// app/api/quantum/log-session/route.ts
// AFS-4: proxy endpoint so the client-side Quantum SSE loop can log KCP-90
// events without the service-role key ever reaching the browser bundle.

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { logKcp90Event } from '@/lib/kcp90/log-event';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function toInt(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const sessionId =
      typeof body.sessionId === 'string' ? body.sessionId.slice(0, 128) : null;
    const layerUsed =
      typeof body.layerUsed === 'string' ? body.layerUsed.slice(0, 64) : null;
    const meta =
      body.meta && typeof body.meta === 'object'
        ? (body.meta as Record<string, unknown>)
        : null;

    logKcp90Event({
      product: 'quantum',
      userId: user?.id ?? null,
      sessionId,
      tokensIn: toInt(body.tokensIn),
      tokensOut: toInt(body.tokensOut),
      layerUsed,
      success: body.success !== false,
      meta,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[quantum/log-session] error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
