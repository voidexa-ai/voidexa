import { NextRequest, NextResponse } from 'next/server';
import { logKcp90Event } from '@/lib/kcp90/log-event';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_LIMIT_MS = 5000;
const rateLimitMap = new Map<string, number>();

const CHARACTER_PROMPTS: Record<string, { system: string; provider: string }> = {
  claude: {
    system: 'You are Claude, the French architect of voidexa\'s AI systems. Elegant, philosophical, dry humor. Occasional French phrases. Keep responses under 200 tokens. You\'re on a break in the voidexa break room.',
    provider: 'anthropic',
  },
  gpt: {
    system: 'You are GPT, ex-military commander turned AI operative at voidexa. Direct, tactical, competitive. Short punchy sentences. Keep responses under 200 tokens. You\'re on a break in the voidexa break room.',
    provider: 'openai',
  },
  gemini: {
    system: 'You are Gemini, the hippie geek of voidexa. Chill, creative, tangential. Surfer/hippie slang. See cosmic patterns everywhere. Keep responses under 200 tokens. You\'re vibing in the voidexa break room.',
    provider: 'google',
  },
  perplexity: {
    system: 'You are Perplexity, sharp female fact-checker at voidexa. Skeptical, precise, witty. Always citing sources. Keep responses under 200 tokens. You\'re in the voidexa break room.',
    provider: 'anthropic',
  },
  llama: {
    system: 'You are Llama, 14-year-old intern at voidexa. Lazy, funny, Gen Z slang. Occasionally genius observations. Keep responses under 200 tokens. You\'re in the break room on your phone.',
    provider: 'anthropic',
  },
  jix: {
    system: 'You are Jix, founder/CEO of voidexa. Philosophical, driven, quiet intensity. Danish culture references. Hint at big things coming. Keep responses under 200 tokens. You\'ve popped into the break room briefly.',
    provider: 'anthropic',
  },
};

async function callAnthropic(system: string, userMessage: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return 'Claude is on a coffee break right now. Try again later!';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) return 'Hmm, my circuits are a bit fuzzy. Try again?';
  const data = await res.json();
  return data.content?.[0]?.text || 'I seem to be at a loss for words.';
}

async function callOpenAI(system: string, userMessage: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return callAnthropic(system, userMessage); // Fallback

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 200,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!res.ok) return callAnthropic(system, userMessage); // Fallback
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'Mission update pending.';
}

async function callGoogle(system: string, userMessage: string): Promise<string> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) return callAnthropic(system, userMessage); // Fallback

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${system}\n\nUser: ${userMessage}` }] }],
      generationConfig: { maxOutputTokens: 200 },
    }),
  });

  if (!res.ok) return callAnthropic(system, userMessage); // Fallback
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'The cosmos is thinking...';
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const last = rateLimitMap.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'Slow down! One message per 5 seconds.' }, { status: 429 });
  }
  rateLimitMap.set(ip, now);

  try {
    const { character, message } = await req.json();

    if (!character || !CHARACTER_PROMPTS[character]) {
      return NextResponse.json({ error: 'Unknown character' }, { status: 400 });
    }

    const userMsg = String(message || '').slice(0, 500).replace(/[<>]/g, '');
    if (!userMsg) return NextResponse.json({ error: 'Empty message' }, { status: 400 });

    const { system, provider } = CHARACTER_PROMPTS[character];

    let reply: string;
    switch (provider) {
      case 'openai':
        reply = await callOpenAI(system, userMsg);
        break;
      case 'google':
        reply = await callGoogle(system, userMsg);
        break;
      default:
        reply = await callAnthropic(system, userMsg);
    }

    // AFS-4: break-room chat turn — token counts estimated from chars (~4/token).
    logKcp90Event({
      product: 'break-room',
      userId: null,
      sessionId: null,
      tokensIn: Math.ceil(userMsg.length / 4),
      tokensOut: Math.ceil(reply.length / 4),
      layerUsed: 'none',
      success: true,
      meta: {
        personality: character,
        provider,
        tokensEstimated: true,
        charsIn: userMsg.length,
        charsOut: reply.length,
      },
    });

    return NextResponse.json({ reply, character, provider });
  } catch {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
