'use client';

// components/control-plane/ControlPlaneDashboard.tsx
// KCP-90 Control Plane — client dashboard with auto-refresh and charts

import { useEffect, useState, useCallback } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Summary {
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

interface DailyStat {
  day: string;
  product: string;
  total_compressions: number;
  total_original_chars: number;
  total_compressed_chars: number;
  avg_ratio: number;
  total_tokens_saved: number;
  ollama_count: number;
  regex_count: number;
  raw_count: number;
}

interface RecentStat {
  id: string;
  product: string;
  encoder_used: string;
  original_chars: number;
  compressed_chars: number;
  compression_ratio: number;
  tokens_saved: number;
  created_at: string;
}

interface StatsData {
  summary: Summary | null;
  daily: DailyStat[];
  recent: RecentStat[];
}

// ─── Colours ──────────────────────────────────────────────────────────────────

const ENCODER_COLORS: Record<string, string> = {
  ollama: '#7777bb',
  regex:  '#4ade80',
  raw:    '#f59e0b',
};

const PRODUCT_COLORS: Record<string, string> = {
  quantum:     '#7777bb',
  'trading-bot': '#4ade80',
  'void-chat': '#60a5fa',
  jarvis:      '#f59e0b',
  other:       '#94a3b8',
};

const TOTAL_PRODUCTS = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function encoderBadgeClass(encoder: string): string {
  const map: Record<string, string> = {
    ollama: 'bg-indigo-900/60 text-indigo-300 border border-indigo-700',
    regex:  'bg-green-900/60 text-green-300 border border-green-700',
    raw:    'bg-yellow-900/60 text-yellow-300 border border-yellow-700',
  };
  return map[encoder] ?? 'bg-gray-800 text-gray-300 border border-gray-700';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({
  label, value, sub,
}: {
  label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-1 hover:border-indigo-800 transition-colors">
      <p className="text-gray-400 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-sm">{sub}</p>}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="text-6xl mb-6 opacity-30">⚡</div>
      <p className="text-gray-400 text-lg font-medium">No compression data yet.</p>
      <p className="text-gray-600 text-sm mt-2">KCP-90 will start logging when products are active.</p>
    </div>
  );
}

function RefreshBadge({ lastRefresh, refreshing }: { lastRefresh: Date | null; refreshing: boolean }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-xs">
      <span
        className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}
      />
      {refreshing
        ? 'Refreshing…'
        : lastRefresh
          ? `Last updated ${formatTime(lastRefresh.toISOString())}`
          : 'Loading…'}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ControlPlaneDashboard({ initial }: { initial: StatsData }) {
  const [data, setData] = useState<StatsData>(initial);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(new Date());

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/kcp90/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefresh(new Date());
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  const { summary, daily, recent } = data;
  const isEmpty = !summary || summary.total_compressions === 0;

  // ── Encoder donut data ──
  const encoderData = summary
    ? [
        { name: 'Ollama', value: summary.ollama_count, color: ENCODER_COLORS.ollama },
        { name: 'Regex',  value: summary.regex_count,  color: ENCODER_COLORS.regex },
        { name: 'Raw',    value: summary.raw_count,     color: ENCODER_COLORS.raw },
      ].filter(d => d.value > 0)
    : [];

  // ── Per-product bar data from daily stats ──
  const productMap: Record<string, number> = {};
  for (const row of daily) {
    const key = row.product ?? 'other';
    productMap[key] = (productMap[key] ?? 0) + row.total_compressions;
  }
  const productData = Object.entries(productMap).map(([product, total]) => ({
    product,
    total,
    color: PRODUCT_COLORS[product] ?? PRODUCT_COLORS.other,
  }));

  // ── Daily trend: aggregate across products per day ──
  const dayMap: Record<string, number> = {};
  for (const row of daily) {
    const day = row.day.slice(0, 10);
    dayMap[day] = (dayMap[day] ?? 0) + row.total_compressions;
  }
  const trendData = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, compressions]) => ({ day, compressions }));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Hero ── */}
      <div className="relative border-b border-gray-800/50 bg-gradient-to-b from-gray-900 to-gray-950 px-8 py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-900/40 border border-indigo-800 px-3 py-1 rounded-full uppercase tracking-widest">
                  Admin Only
                </span>
                <span className="text-xs font-mono text-gray-500">voidexa control plane</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                KCP-90
                <span className="text-indigo-400"> Control Plane</span>
              </h1>
              <p className="text-gray-400 mt-3 text-base max-w-xl">
                Real-time compression analytics across all voidexa products.
                KCP-90 reduces context overhead, saving tokens and cost on every AI call.
              </p>
            </div>
            <RefreshBadge lastRefresh={lastRefresh} refreshing={refreshing} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Summary Cards ── */}
            <section>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                  label="Total Compressions"
                  value={fmt(summary!.total_compressions)}
                />
                <SummaryCard
                  label="Overall Compression Ratio"
                  value={`${(summary!.overall_ratio * 100).toFixed(1)}%`}
                  sub={`${fmt(summary!.total_original_chars)} → ${fmt(summary!.total_compressed_chars)} chars`}
                />
                <SummaryCard
                  label="Tokens Saved"
                  value={fmt(summary!.total_tokens_saved)}
                  sub={`≈ $${summary!.estimated_usd_saved.toFixed(2)} saved`}
                />
                <SummaryCard
                  label="Active Products"
                  value={`${summary!.active_products} / ${TOTAL_PRODUCTS}`}
                />
              </div>
            </section>

            {/* ── Encoder Breakdown + Product Breakdown ── */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-6">Encoder Breakdown</h2>
                {encoderData.length === 0 ? (
                  <p className="text-gray-600 text-sm">No data</p>
                ) : (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={180} height={180}>
                      <PieChart>
                        <Pie
                          data={encoderData}
                          cx="50%" cy="50%"
                          innerRadius={55} outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {encoderData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                          itemStyle={{ color: '#e5e7eb' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-3">
                      {encoderData.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                          <span className="text-gray-300 text-sm">{d.name}</span>
                          <span className="text-gray-500 text-sm ml-auto pl-4">{fmt(d.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product bar chart */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-6">Per-Product Compressions</h2>
                {productData.length === 0 ? (
                  <p className="text-gray-600 text-sm">No data</p>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={productData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis
                        dataKey="product"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={false} tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        axisLine={false} tickLine={false}
                        tickFormatter={fmt}
                      />
                      <Tooltip
                        contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                        itemStyle={{ color: '#e5e7eb' }}
                        cursor={{ fill: '#1f2937' }}
                      />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {productData.map((entry) => (
                          <Cell key={entry.product} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            {/* ── Daily Trend ── */}
            <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-6">
                Daily Compressions — Last 30 Days
              </h2>
              {trendData.length === 0 ? (
                <p className="text-gray-600 text-sm">No data</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      axisLine={false} tickLine={false}
                      tickFormatter={(v) => v.slice(5)} // MM-DD
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      axisLine={false} tickLine={false}
                      tickFormatter={fmt}
                    />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                      itemStyle={{ color: '#e5e7eb' }}
                      labelStyle={{ color: '#9ca3af' }}
                    />
                    <Legend
                      wrapperStyle={{ color: '#9ca3af', fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="compressions"
                      stroke="#7777bb"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#7777bb' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </section>

            {/* ── Recent Activity ── */}
            <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-6">Recent Compression Events</h2>
              {recent.length === 0 ? (
                <p className="text-gray-600 text-sm">No events</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                        <th className="text-left pb-3 pr-4 font-medium">Product</th>
                        <th className="text-left pb-3 pr-4 font-medium">Encoder</th>
                        <th className="text-right pb-3 pr-4 font-medium">Original</th>
                        <th className="text-right pb-3 pr-4 font-medium">Compressed</th>
                        <th className="text-right pb-3 pr-4 font-medium">Ratio</th>
                        <th className="text-right pb-3 pr-4 font-medium">Tokens Saved</th>
                        <th className="text-right pb-3 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {recent.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3 pr-4 text-gray-300 capitalize">{row.product}</td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${encoderBadgeClass(row.encoder_used)}`}>
                              {row.encoder_used}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-right text-gray-400 font-mono">{fmt(row.original_chars)}</td>
                          <td className="py-3 pr-4 text-right text-gray-400 font-mono">{fmt(row.compressed_chars)}</td>
                          <td className="py-3 pr-4 text-right font-mono">
                            <span className={row.compression_ratio > 0.3 ? 'text-green-400' : 'text-yellow-400'}>
                              {(row.compression_ratio * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-right text-indigo-400 font-mono">{fmt(row.tokens_saved)}</td>
                          <td className="py-3 text-right text-gray-500 text-xs">{formatTime(row.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
