// middleware.ts
// Next.js middleware — runs on every matched request.
//
// Responsibilities:
//   1. Rate-limit /api/* routes: max 10 requests per IP per minute.
//   2. Inject security headers on all responses.

import { NextRequest, NextResponse } from 'next/server';

// ─── Rate Limiter ─────────────────────────────────────────────────────────────

const RATE_LIMIT = 10;          // max requests per window
const WINDOW_MS = 60_000;       // 1 minute

// In-memory store: IP → array of request timestamps within the window.
// NOTE: This is per-process. On serverless it resets per cold start, which is
// acceptable for basic abuse prevention. Upgrade to Redis for distributed rate
// limiting when needed.
const ipWindows = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1'
  );
}

/**
 * Returns { allowed, remaining } for the given IP.
 * Mutates ipWindows as a side effect.
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (ipWindows.get(ip) ?? []).filter(ts => ts > windowStart);
  const remaining = Math.max(0, RATE_LIMIT - timestamps.length);

  if (timestamps.length >= RATE_LIMIT) {
    ipWindows.set(ip, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  ipWindows.set(ip, timestamps);
  return { allowed: true, remaining: remaining - 1 };
}

// ─── Security Headers ─────────────────────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options':    'nosniff',
  'X-Frame-Options':           'DENY',
  'X-XSS-Protection':          '1; mode=block',
  'Referrer-Policy':           'strict-origin-when-cross-origin',
  'Permissions-Policy':        'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https:;",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

// ─── Middleware Entry Point ───────────────────────────────────────────────────

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Rate-limit API routes only
  if (pathname.startsWith('/api/')) {
    const ip = getClientIp(req);
    const { allowed, remaining } = checkRateLimit(ip);

    if (!allowed) {
      const res = NextResponse.json(
        { error: 'Too many requests. Please wait before retrying.' },
        { status: 429 }
      );
      res.headers.set('X-RateLimit-Limit',     String(RATE_LIMIT));
      res.headers.set('X-RateLimit-Remaining', '0');
      res.headers.set('Retry-After',           '60');
      return applySecurityHeaders(res);
    }

    const res = NextResponse.next();
    res.headers.set('X-RateLimit-Limit',     String(RATE_LIMIT));
    res.headers.set('X-RateLimit-Remaining', String(remaining));
    return applySecurityHeaders(res);
  }

  // All other routes — just add security headers
  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all page routes (for security headers), excluding Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
