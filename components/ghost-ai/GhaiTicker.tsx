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
      <div className="animate-pulse space-y-1">
        <div className="h-3 bg-gray-800 rounded w-20" />
        <div className="h-3 bg-gray-800 rounded w-14" />
      </div>
    );
  }

  if (!data) return null;

  const up = data.priceChange24h >= 0;
  const changeColor = up ? '#22c55e' : '#ef4444';
  const arrow = up ? '▲' : '▼';

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
            style={{ background: 'rgba(139,92,246,0.4)', color: '#c4b5fd' }}
          >
            G
          </div>
          <span className="text-xs font-semibold text-gray-300">GHAI</span>
        </div>
        <span
          className="text-[10px] font-medium flex items-center gap-0.5"
          style={{ color: changeColor }}
        >
          {arrow} {Math.abs(data.priceChange24h).toFixed(2)}%
        </span>
      </div>

      {/* Price */}
      <div>
        <p className="text-sm font-bold text-white">
          ${data.priceUsd.toFixed(6)}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-1 pt-1 border-t border-gray-800/60">
        <div>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Vol 24h</p>
          <p className="text-[10px] text-gray-300 font-medium">{formatCompact(data.volume24h)}</p>
        </div>
        <div>
          <p className="text-[9px] text-gray-500 uppercase tracking-wider">Liquidity</p>
          <p className="text-[10px] text-gray-300 font-medium">{formatCompact(data.liquidity)}</p>
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
