import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_GAMES = ['ghai-invaders', 'ghost-jump', 'void-pong', 'kcp-stacker'];
const RATE_LIMIT_MS = 10000;
const rateLimitMap = new Map<string, number>();

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
}

export async function GET(req: NextRequest) {
  const game = req.nextUrl.searchParams.get('game');
  if (!game || !VALID_GAMES.includes(game)) {
    return NextResponse.json({ error: 'Invalid game' }, { status: 400 });
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('arcade_highscores')
    .select('player_name, score, created_at')
    .eq('game', game)
    .order('score', { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  return NextResponse.json({ scores: data });
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const lastSubmit = rateLimitMap.get(ip) || 0;
  if (now - lastSubmit < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'Too fast. Wait 10 seconds.' }, { status: 429 });
  }
  rateLimitMap.set(ip, now);

  try {
    const body = await req.json();
    const { game, player_name, score } = body;

    if (!game || !VALID_GAMES.includes(game)) {
      return NextResponse.json({ error: 'Invalid game' }, { status: 400 });
    }
    if (typeof score !== 'number' || score < 0 || score > 999999) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    const name = String(player_name || 'Anonymous').slice(0, 20).replace(/[<>&"']/g, '');

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('arcade_highscores')
      .insert({ game, player_name: name, score });

    if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
