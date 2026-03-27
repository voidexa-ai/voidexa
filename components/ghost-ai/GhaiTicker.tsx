// components/ghost-ai/GhaiTicker.tsx
// Live GHAI price ticker — polls /api/ghai/price every 60s

'use client';

import { useEffect, useState } from 'react';

interface GhaiPrice {
  priceUsd: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
}

export function GhaiTicker() {
  const [data, setData] = useState<GhaiPrice | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchPrice() {
    try {
      const res = await fetch('/api/ghai/price');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2 p-1">
        <div className="h-5 bg-gray-800 rounded w-28" />
        <div className="h-4 bg-gray-800 rounded w-20" />
        <div className="h-3 bg-gray-800 rounded w-24" />
      </div>
    );
  }

  if (!data) return null;

  const up = data.priceChange24h >= 0;
  const changeColor = up ? '#22c55e' : '#ef4444';
  const arrow = up ? '▲' : '▼';

  return (
    <div
      className="rounded-xl space-y-3"
      style={{
        background: 'rgba(139,92,246,0.07)',
        border: '1px solid rgba(139,92,246,0.25)',
        padding: '12px 14px',
        boxShadow: '0 0 20px rgba(139,92,246,0.06)',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff' }}
          >
            G
          </div>
          <span className="text-sm font-bold text-gray-200">GHAI</span>
          <span className="text-sm uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
            Live
          </span>
        </div>
        <span className="text-sm font-semibold flex items-center gap-1" style={{ color: changeColor }}>
          {arrow} {Math.abs(data.priceChange24h).toFixed(2)}%
        </span>
      </div>

      {/* Price */}
      <div>
        <p className="font-bold text-white tabular-nums" style={{ fontSize: 18 }}>
          ${data.priceUsd.toFixed(8)}
        </p>
        <p className="text-sm mt-0.5" style={{ color: '#475569' }}>per GHAI · Solana</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p className="uppercase tracking-wider mb-0.5" style={{ fontSize: 14, color: '#334155' }}>Vol 24h</p>
          <p className="font-medium text-gray-300 tabular-nums" style={{ fontSize: 14 }}>{formatCompact(data.volume24h)}</p>
        </div>
        <div>
          <p className="uppercase tracking-wider mb-0.5" style={{ fontSize: 14, color: '#334155' }}>Liquidity</p>
          <p className="font-medium text-gray-300 tabular-nums" style={{ fontSize: 14 }}>{formatCompact(data.liquidity)}</p>
        </div>
      </div>
    </div>
  );
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}
