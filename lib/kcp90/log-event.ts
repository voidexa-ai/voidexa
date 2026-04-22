import 'server-only';
import { supabaseAdmin } from '@/lib/supabase-admin';

export type Kcp90Product =
  | 'void-chat'
  | 'quantum'
  | 'trading-bot'
  | 'break-room';

export interface Kcp90Event {
  product: Kcp90Product;
  userId?: string | null;
  sessionId?: string | null;
  tokensIn: number;
  tokensOut: number;
  bytesRaw?: number;
  bytesCompressed?: number;
  layerUsed?: string | null;
  success?: boolean;
  meta?: Record<string, unknown> | null;
}

export function computeRatio(
  bytesRaw: number | undefined | null,
  bytesCompressed: number | undefined | null,
): number | null {
  if (
    typeof bytesRaw !== 'number' ||
    typeof bytesCompressed !== 'number' ||
    !Number.isFinite(bytesRaw) ||
    !Number.isFinite(bytesCompressed) ||
    bytesRaw <= 0
  ) {
    return null;
  }
  const raw = bytesCompressed / bytesRaw;
  if (raw < 0) return 0;
  if (raw > 1) return 1;
  return Number(raw.toFixed(4));
}

/**
 * Fire-and-forget logging of a KCP-90 compression event.
 * Never throws. Errors go to console only so the hot path
 * (chat / quantum / trading responses) is never blocked.
 */
export function logKcp90Event(event: Kcp90Event): void {
  void (async () => {
    try {
      const ratio = computeRatio(event.bytesRaw, event.bytesCompressed);
      const { error } = await supabaseAdmin
        .from('kcp90_compression_events')
        .insert({
          product: event.product,
          user_id: event.userId ?? null,
          session_id: event.sessionId ?? null,
          tokens_in: event.tokensIn,
          tokens_out: event.tokensOut,
          bytes_raw: event.bytesRaw ?? null,
          bytes_compressed: event.bytesCompressed ?? null,
          compression_ratio: ratio,
          layer_used: event.layerUsed ?? null,
          success: event.success ?? true,
          meta: event.meta ?? null,
        });
      if (error) {
        console.error('[kcp90/log-event] insert failed:', error.message);
      }
    } catch (err) {
      console.error('[kcp90/log-event] unexpected:', err);
    }
  })();
}
