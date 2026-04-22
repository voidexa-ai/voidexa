// app/api/trading-bot/events/route.ts
// AFS-4: receiving endpoint for the external Trading Bot repo (AFS-16 wires
// the outbound calls). Uses the shared KCP90_API_SECRET + Bearer convention
// already in place on /api/kcp90/stats so there is ONE machine-to-machine
// secret for all voidexa product ingest.

import { NextRequest, NextResponse } from 'next/server';
import { logKcp90Event } from '@/lib/kcp90/log-event';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function stringField(v: unknown, max: number): string | null {
  return typeof v === 'string' && v.length > 0 ? v.slice(0, max) : null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.KCP90_API_SECRET?.trim();
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  logKcp90Event({
    product: 'trading-bot',
    userId: null,
    sessionId: stringField(body.runId, 128),
    tokensIn: Number(body.tokensIn) || 0,
    tokensOut: Number(body.tokensOut) || 0,
    layerUsed: stringField(body.engine, 64),
    success: body.success !== false,
    meta: {
      decision: body.decision ?? null,
      symbol: body.symbol ?? null,
      regime: body.regime ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
