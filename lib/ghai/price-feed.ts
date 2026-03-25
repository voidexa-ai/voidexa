// lib/ghai/price-feed.ts
// GHAI price via DexScreener (no API key required)

const DEXSCREENER_URL =
  'https://api.dexscreener.com/latest/dex/tokens/Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK';

const FALLBACK_PRICE_USD = 0.000004;
const CACHE_TTL_MS = 60_000; // 60 seconds

interface PriceCache {
  priceUsd: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  timestamp: number;
}

let _cache: PriceCache | null = null;

export async function fetchGhaiMarketData(): Promise<PriceCache> {
  if (_cache && Date.now() - _cache.timestamp < CACHE_TTL_MS) {
    return _cache;
  }

  try {
    const res = await fetch(DEXSCREENER_URL, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`DexScreener HTTP ${res.status}`);

    const data = await res.json();
    const pair = data?.pairs?.[0];

    if (!pair) throw new Error('No pairs returned');

    const priceUsd = parseFloat(pair.priceUsd ?? '0') || FALLBACK_PRICE_USD;

    _cache = {
      priceUsd,
      priceChange24h: pair.priceChange?.h24 ?? 0,
      volume24h: pair.volume?.h24 ?? 0,
      liquidity: pair.liquidity?.usd ?? 0,
      marketCap: pair.marketCap ?? 0,
      timestamp: Date.now(),
    };

    return _cache;
  } catch {
    // Return cached data if available, otherwise fallback
    if (_cache) return _cache;
    return {
      priceUsd: FALLBACK_PRICE_USD,
      priceChange24h: 0,
      volume24h: 0,
      liquidity: 0,
      marketCap: 0,
      timestamp: Date.now(),
    };
  }
}

export async function getGhaiPriceUSD(): Promise<number> {
  const data = await fetchGhaiMarketData();
  return data.priceUsd;
}

export async function getGhaiPerUSD(usdAmount: number): Promise<number> {
  const price = await getGhaiPriceUSD();
  return usdAmount / price;
}
