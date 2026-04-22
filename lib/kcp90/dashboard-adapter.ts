// AFS-4: client-side adapters that map the /api/kcp90/stats response shape
// (new kcp90_compression_events aggregation) onto the legacy Summary /
// RecentStat shapes that ControlPlaneDashboard UI still consumes.

export type Kcp90Product = 'void-chat' | 'quantum' | 'trading-bot' | 'break-room';
export type WindowKey = '24h' | '7d' | '30d';

export interface ProductCounters {
  events: number;
  tokensIn: number;
  tokensOut: number;
  bytesRaw: number;
  bytesCompressed: number;
  successes: number;
}

export interface RecentEvent {
  id: string;
  ts: string;
  product: Kcp90Product;
  tokens_in: number;
  tokens_out: number;
  bytes_raw: number | null;
  bytes_compressed: number | null;
  compression_ratio: number | null;
  layer_used: string | null;
  success: boolean;
}

export interface StatsApiResponse {
  generatedAt: string;
  windows: Record<WindowKey, Record<Kcp90Product, ProductCounters>>;
  recent: RecentEvent[];
}

export interface LegacySummary {
  total_compressions: number;
  total_original_chars: number;
  total_compressed_chars: number;
  overall_ratio: number;
  total_tokens_saved: number;
  estimated_usd_saved: number;
  ollama_count: number;
  regex_count: number;
  raw_count: number;
  active_products: number;
}

export interface LegacyRecentStat {
  id: string;
  product: string;
  encoder_used: string;
  original_chars: number;
  compressed_chars: number;
  compression_ratio: number;
  tokens_saved: number;
  created_at: string;
}

export function toLegacySummary(
  win: Record<Kcp90Product, ProductCounters> | undefined,
): LegacySummary | null {
  if (!win) return null;
  let totalEvents = 0;
  let totalBytesRaw = 0;
  let totalBytesCompressed = 0;
  let totalTokens = 0;
  let activeProducts = 0;
  for (const counters of Object.values(win)) {
    if (counters.events > 0) activeProducts += 1;
    totalEvents += counters.events;
    totalBytesRaw += counters.bytesRaw;
    totalBytesCompressed += counters.bytesCompressed;
    totalTokens += counters.tokensIn + counters.tokensOut;
  }
  const overallRatio =
    totalBytesRaw > 0
      ? (totalBytesRaw - totalBytesCompressed) / totalBytesRaw
      : 0;
  return {
    total_compressions: totalEvents,
    total_original_chars: totalBytesRaw,
    total_compressed_chars: totalBytesCompressed,
    overall_ratio: Math.max(0, Math.min(1, overallRatio)),
    total_tokens_saved: totalTokens,
    estimated_usd_saved: 0,
    ollama_count: 0,
    regex_count: 0,
    raw_count: 0,
    active_products: activeProducts,
  };
}

export function toLegacyRecent(
  events: RecentEvent[] | undefined,
): LegacyRecentStat[] {
  if (!events) return [];
  return events.map(e => ({
    id: e.id,
    product: e.product,
    encoder_used: e.layer_used ?? 'none',
    original_chars: e.bytes_raw ?? 0,
    compressed_chars: e.bytes_compressed ?? 0,
    compression_ratio: e.compression_ratio ?? 0,
    tokens_saved: (e.tokens_in ?? 0) + (e.tokens_out ?? 0),
    created_at: e.ts,
  }));
}
