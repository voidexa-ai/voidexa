// app/api/ghai/price/route.ts
// Public endpoint — GHAI live market data from DexScreener (cached 60s server-side)
// No auth required — price data is public

import { NextResponse } from 'next/server';
import { fetchGhaiMarketData } from '@/lib/ghai/price-feed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchGhaiMarketData();
    return NextResponse.json({
      priceUsd: data.priceUsd,
      priceChange24h: data.priceChange24h,
      volume24h: data.volume24h,
      liquidity: data.liquidity,
      marketCap: data.marketCap,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}
