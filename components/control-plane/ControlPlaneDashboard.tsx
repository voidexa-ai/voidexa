'use client';

// components/control-plane/ControlPlaneDashboard.tsx
// voidexa Control Plane — full admin command center

import React, { useEffect, useState, useCallback } from 'react';

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
  avg_ratio: number;
  total_tokens_saved: number;
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

// ─── Style constants ──────────────────────────────────────────────────────────

const BG      = '#030308';
const BG_CARD = 'rgba(10,10,25,0.85)';
const BG_SIDE = '#07070f';
const BORDER  = '1px solid rgba(100,200,255,0.08)';
const BORDER_H = '1px solid rgba(100,200,255,0.22)';
const BLUE    = '#3b82f6';
const PURPLE  = '#7c3aed';
const GREEN   = '#10b981';
const YELLOW  = '#f59e0b';
const RED     = '#ef4444';
const MONO    = '"JetBrains Mono", "Fira Mono", "Courier New", monospace';
const SANS    = 'Inter, system-ui, sans-serif';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined): string {
  const v = n ?? 0;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Reusable card wrapper ────────────────────────────────────────────────────

function Card({
  children, style, className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: BG_CARD,
        border: BORDER,
        borderRadius: 12,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{
        fontFamily: SANS, fontSize: 16, fontWeight: 500,
        letterSpacing: '0.04em',
        color: '#e2e8f0',
      }}>
        {title}
      </span>
      {badge && (
        <span style={{
          fontFamily: MONO, fontSize: 9, fontWeight: 600,
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.25)',
          color: '#fca5a5',
          borderRadius: 4,
          padding: '1px 6px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── Status dot ───────────────────────────────────────────────────────────────

function Dot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: color,
      boxShadow: `0 0 6px ${color}`,
      flexShrink: 0,
      animation: pulse ? 'cp-pulse 2s ease-in-out infinite' : undefined,
    }} />
  );
}

// ─── Metric card ─────────────────────────────────────────────────────────────

function MetricCard({
  label, value, sub, accent, demo,
}: {
  label: string; value: string; sub?: string; accent?: string; demo?: boolean;
}) {
  return (
    <Card style={{ padding: '20px 22px', position: 'relative' }}>
      {demo && (
        <span style={{
          position: 'absolute', top: 10, right: 10,
          fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>demo</span>
      )}
      <div style={{
        fontFamily: SANS, fontSize: 13, fontWeight: 500,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: 'rgba(148,163,184,0.7)', marginBottom: 10,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: MONO, fontSize: 36, fontWeight: 300,
        color: accent ?? '#f1f5f9', lineHeight: 1.1, letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontFamily: SANS, fontSize: 12, color: 'rgba(148,163,184,0.5)',
          marginTop: 6,
        }}>
          {sub}
        </div>
      )}
    </Card>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: 'overview',    label: 'Overview',       icon: '⬡' },
  { id: 'kcp90',       label: 'KCP-90',          icon: '◈' },
  { id: 'trading',     label: 'Trading Bot',     icon: '◎' },
  { id: 'ghai',        label: 'GHAI Token',      icon: '◆' },
  { id: 'quantum',     label: 'Quantum',         icon: '◇' },
  { id: 'voidchat',    label: 'Void Chat',       icon: '◉' },
  { id: 'health',      label: 'System Health',   icon: '▣' },
  { id: 'activity',    label: 'Activity Feed',   icon: '≡' },
];

function Sidebar({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: BG_SIDE,
      borderRight: BORDER,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      height: '100%',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: BORDER }}>
        <div style={{
          fontFamily: MONO, fontSize: 16, fontWeight: 700,
          color: BLUE, letterSpacing: '0.06em',
        }}>
          voidexa
        </div>
        <div style={{
          fontFamily: MONO, fontSize: 10, color: 'rgba(100,200,255,0.35)',
          letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4,
        }}>
          control-plane://admin
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV_LINKS.map(link => (
          <button
            key={link.id}
            onClick={() => onNav(link.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 12px',
              borderRadius: 7, marginBottom: 2,
              background: active === link.id ? 'rgba(59,130,246,0.12)' : 'transparent',
              border: active === link.id ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{
              fontFamily: MONO, fontSize: 13,
              color: active === link.id ? BLUE : 'rgba(100,200,255,0.25)',
            }}>
              {link.icon}
            </span>
            <span style={{
              fontFamily: SANS, fontSize: 14, fontWeight: 500,
              color: active === link.id ? '#e2e8f0' : 'rgba(148,163,184,0.55)',
            }}>
              {link.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '14px 20px',
        borderTop: BORDER,
        fontFamily: MONO, fontSize: 9, color: 'rgba(100,200,255,0.2)',
        letterSpacing: '0.12em',
      }}>
        v1.0 · read-only
      </div>
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar({
  lastRefresh, refreshing, onRefresh,
}: {
  lastRefresh: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <div style={{
      height: 52, flexShrink: 0,
      background: 'rgba(3,3,8,0.95)',
      borderBottom: BORDER,
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 16,
    }}>
      <span style={{
        fontFamily: MONO, fontSize: 18, fontWeight: 600,
        color: '#e2e8f0', letterSpacing: '0.04em',
      }}>
        Control Plane
      </span>
      <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 14 }}>/</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Dot color={GREEN} pulse />
        <span style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(16,185,129,0.7)', letterSpacing: '0.08em' }}>
          systems nominal
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <span style={{
        fontFamily: MONO, fontSize: 12,
        color: 'rgba(148,163,184,0.4)',
      }}>
        {lastRefresh
          ? `updated ${formatTime(lastRefresh.toISOString())}`
          : 'loading…'}
      </span>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        style={{
          fontFamily: MONO, fontSize: 10,
          color: refreshing ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.7)',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 6, padding: '4px 12px',
          cursor: refreshing ? 'default' : 'pointer',
          letterSpacing: '0.08em',
          transition: 'all 0.15s',
        }}
      >
        {refreshing ? 'refreshing…' : '↺ refresh'}
      </button>
    </div>
  );
}

// ─── CSS Bar Chart (no external libs) ────────────────────────────────────────

function CssBarChart({ data }: { data: { day: string; compressions: number }[] }) {
  const max = Math.max(...data.map(d => d.compressions), 1);
  // Show at most 30 bars; if more, sample evenly
  const bars = data.length > 30 ? data.filter((_, i) => i % Math.ceil(data.length / 30) === 0) : data;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120, width: '100%' }}>
      {bars.map(({ day, compressions }) => {
        const pct = Math.max((compressions / max) * 100, 2);
        return (
          <div
            key={day}
            title={`${day}: ${compressions.toLocaleString()}`}
            style={{
              flex: 1,
              height: `${pct}%`,
              background: `linear-gradient(to top, ${BLUE}, rgba(96,165,250,0.4))`,
              borderRadius: '2px 2px 0 0',
              minWidth: 4,
              cursor: 'default',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.7'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
          />
        );
      })}
    </div>
  );
}

// ─── KCP-90 Panel ─────────────────────────────────────────────────────────────

function Kcp90Panel({ summary, daily, recent }: {
  summary: Summary | null;
  daily: DailyStat[];
  recent: RecentStat[];
}) {
  const dayMap: Record<string, number> = {};
  for (const row of daily) {
    const day = row.day.slice(0, 10);
    dayMap[day] = (dayMap[day] ?? 0) + row.total_compressions;
  }
  const trendData = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, compressions]) => ({ day: day.slice(5), compressions }));

  return (
    <section id="kcp90">
      <SectionHeader title="KCP-90 Protocol" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Card style={{ padding: '18px 22px' }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Total Compressions</div>
          <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 300, color: BLUE, letterSpacing: '-0.02em' }}>
            {summary ? fmt(summary.total_compressions) : '—'}
          </div>
        </Card>
        <Card style={{ padding: '18px 22px' }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Avg Compression Rate</div>
          <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 300, color: BLUE, letterSpacing: '-0.02em' }}>
            {summary ? `${((summary.overall_ratio ?? 0) * 100).toFixed(1)}%` : '—'}
          </div>
          {summary && (
            <div style={{ fontFamily: SANS, fontSize: 12, color: 'rgba(148,163,184,0.4)', marginTop: 6 }}>
              {fmt(summary.total_original_chars)} → {fmt(summary.total_compressed_chars)} chars
            </div>
          )}
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Card style={{ padding: '18px 22px' }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Tokens Saved</div>
          <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 300, color: PURPLE, letterSpacing: '-0.02em' }}>
            {summary ? fmt(summary.total_tokens_saved) : '—'}
          </div>
          {summary && (
            <div style={{ fontFamily: SANS, fontSize: 12, color: 'rgba(148,163,184,0.4)', marginTop: 6 }}>
              ≈ ${(summary.estimated_usd_saved ?? 0).toFixed(2)} saved
            </div>
          )}
        </Card>
        <Card style={{ padding: '18px 22px' }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Active Products</div>
          <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 300, color: PURPLE, letterSpacing: '-0.02em' }}>
            {summary ? `${summary.active_products} / 5` : '—'}
          </div>
        </Card>
      </div>

      {/* Daily trend — pure CSS bar chart, zero external dependencies */}
      {trendData.length > 0 && (
        <Card style={{ padding: '20px 22px', marginBottom: 12 }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.04em', marginBottom: 16 }}>
            Daily compressions — last 30 days
          </div>
          <CssBarChart data={trendData} />
        </Card>
      )}

      {/* Recent events table */}
      {recent.length > 0 && (
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.04em', marginBottom: 14 }}>
            Recent compression events
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Product', 'Encoder', 'Original', 'Compressed', 'Ratio', 'Tokens Saved', 'Time'].map(h => (
                    <th key={h} style={{
                      fontFamily: SANS, fontSize: 9, fontWeight: 600,
                      color: 'rgba(100,116,139,0.7)', letterSpacing: '0.14em',
                      textTransform: 'uppercase', textAlign: h === 'Product' || h === 'Encoder' ? 'left' : 'right',
                      paddingBottom: 10, paddingRight: h !== 'Time' ? 12 : 0,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ fontFamily: SANS, fontSize: 12, color: '#94a3b8', padding: '10px 12px 10px 0', textTransform: 'capitalize' }}>{row.product}</td>
                    <td style={{ paddingRight: 12 }}>
                      <span style={{
                        fontFamily: MONO, fontSize: 10,
                        color: row.encoder_used === 'ollama' ? '#a78bfa' : row.encoder_used === 'regex' ? '#4ade80' : '#fbbf24',
                        background: row.encoder_used === 'ollama' ? 'rgba(167,139,250,0.1)' : row.encoder_used === 'regex' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                        border: `1px solid ${row.encoder_used === 'ollama' ? 'rgba(167,139,250,0.25)' : row.encoder_used === 'regex' ? 'rgba(74,222,128,0.25)' : 'rgba(251,191,36,0.25)'}`,
                        borderRadius: 4, padding: '1px 6px',
                      }}>{row.encoder_used}</span>
                    </td>
                    <td style={{ fontFamily: MONO, fontSize: 11, color: '#64748b', textAlign: 'right', paddingRight: 12 }}>{fmt(row.original_chars)}</td>
                    <td style={{ fontFamily: MONO, fontSize: 11, color: '#64748b', textAlign: 'right', paddingRight: 12 }}>{fmt(row.compressed_chars)}</td>
                    <td style={{ fontFamily: MONO, fontSize: 11, color: row.compression_ratio > 0.3 ? '#4ade80' : '#fbbf24', textAlign: 'right', paddingRight: 12 }}>{((row.compression_ratio ?? 0) * 100).toFixed(1)}%</td>
                    <td style={{ fontFamily: MONO, fontSize: 11, color: BLUE, textAlign: 'right', paddingRight: 12 }}>{fmt(row.tokens_saved)}</td>
                    <td style={{ fontFamily: MONO, fontSize: 10, color: '#475569', textAlign: 'right' }}>{timeAgo(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  );
}

// ─── Trading Bot Panel ────────────────────────────────────────────────────────

function TradingBotPanel() {
  const data = [
    { label: 'season',    value: 'S-03', color: '#94a3b8' },
    { label: 'status',    value: 'ACTIVE', color: GREEN },
    { label: 'health',    value: 'GREEN', color: GREEN },
    { label: 'P&L (day)', value: '+$142.80', color: '#4ade80' },
    { label: 'P&L (total)', value: '+$3,241', color: '#4ade80' },
    { label: 'open positions', value: '3', color: '#f1f5f9' },
    { label: 'strategy', value: 'APEX + SCALPER', color: PURPLE },
    { label: 'uptime', value: '99.2%', color: '#94a3b8' },
  ];
  return (
    <Card style={{ padding: '20px 22px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 14, right: 14 }}>
        <span style={{
          fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>demo</span>
      </div>
      <SectionHeader title="Trading Bot" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {data.map(({ label, value, color }) => (
          <div key={label} style={{
            display: 'flex', flexDirection: 'column', gap: 2,
            padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: 'rgba(100,116,139,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontFamily: MONO, fontSize: 16, color, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── GHAI Token Panel ─────────────────────────────────────────────────────────

function GhaiPanel() {
  const data = [
    { label: 'price',    value: '$0.0042', color: BLUE },
    { label: '24h change', value: '+3.2%', color: '#4ade80' },
    { label: 'supply',   value: '100M GHAI', color: '#94a3b8' },
    { label: 'burned',   value: '2.4M GHAI', color: RED },
    { label: 'holders',  value: '847', color: '#f1f5f9' },
    { label: 'contract', value: 'Ch8Ek9P…x5gK', color: 'rgba(100,200,255,0.4)' },
  ];
  return (
    <Card style={{ padding: '20px 22px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 14, right: 14 }}>
        <span style={{
          fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>demo</span>
      </div>
      <SectionHeader title="GHAI Token" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {data.map(({ label, value, color }) => (
          <div key={label} style={{
            display: 'flex', flexDirection: 'column', gap: 2,
            padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: 'rgba(100,116,139,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontFamily: MONO, fontSize: 16, color, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Quantum Panel ────────────────────────────────────────────────────────────

function QuantumPanel() {
  const data = [
    { label: 'status',     value: 'LIVE',        color: GREEN },
    { label: 'tests passed', value: '960 / 960', color: '#4ade80' },
    { label: 'sessions',   value: '—',           color: '#94a3b8' },
    { label: 'providers',  value: '3 active',    color: '#94a3b8' },
    { label: 'avg latency', value: '142ms',      color: BLUE },
    { label: 'uptime',     value: '100%',        color: '#4ade80' },
  ];
  return (
    <Card style={{ padding: '20px 22px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 14, right: 14 }}>
        <span style={{
          fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>demo</span>
      </div>
      <SectionHeader title="Quantum" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {data.map(({ label, value, color }) => (
          <div key={label} style={{
            display: 'flex', flexDirection: 'column', gap: 2,
            padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: 'rgba(100,116,139,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontFamily: MONO, fontSize: 16, color, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Void Chat Panel ──────────────────────────────────────────────────────────

function VoidChatPanel() {
  const data = [
    { label: 'status',     value: 'BUILDING',    color: YELLOW },
    { label: 'messages',   value: '—',           color: '#94a3b8' },
    { label: 'users',      value: '—',           color: '#94a3b8' },
    { label: 'providers',  value: 'Claude · GPT · Gemini', color: '#94a3b8' },
    { label: 'free tier',  value: '10 msg/day',  color: BLUE },
    { label: 'pro plan',   value: '$5/mo',       color: PURPLE },
  ];
  return (
    <Card style={{ padding: '20px 22px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 14, right: 14 }}>
        <span style={{
          fontFamily: MONO, fontSize: 8, color: 'rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>demo</span>
      </div>
      <SectionHeader title="Void Chat" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {data.map(({ label, value, color }) => (
          <div key={label} style={{
            display: 'flex', flexDirection: 'column', gap: 2,
            padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{ fontFamily: SANS, fontSize: 9, color: 'rgba(100,116,139,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontFamily: MONO, fontSize: 13, color, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── System Health Panel ──────────────────────────────────────────────────────

const SYSTEMS = [
  { name: 'KCP-90 Protocol',    status: 'live',     color: GREEN,  note: 'Compression active across all products' },
  { name: 'Quantum',            status: 'live',     color: GREEN,  note: '960 tests passed — fully operational' },
  { name: 'Trading Bot',        status: 'live',     color: GREEN,  note: 'APEX + SCALPER running S-03' },
  { name: 'GHAI Token',         status: 'live',     color: GREEN,  note: 'Solana mainnet · Ch8Ek9P…x5gK' },
  { name: 'Void Chat',          status: 'building', color: YELLOW, note: 'Phase 2 in development' },
  { name: 'Trading Hub',        status: 'planned',  color: 'rgba(148,163,184,0.3)', note: 'Phase 3' },
  { name: 'Node System',        status: 'planned',  color: 'rgba(148,163,184,0.3)', note: 'Phase 4' },
  { name: 'Comlink',            status: 'testing',  color: '#a78bfa', note: 'Internal testing' },
  { name: 'BOSSO',              status: 'testing',  color: '#a78bfa', note: 'Internal testing' },
  { name: 'TINE Secretary AI',  status: 'testing',  color: '#a78bfa', note: 'Internal testing' },
  { name: 'Jarvis',             status: 'next',     color: BLUE,   note: 'Planned — next release' },
  { name: 'Supabase DB',        status: 'live',     color: GREEN,  note: 'ihuljnekxkyqgroklurp — EU region' },
  { name: 'Vercel Hosting',     status: 'live',     color: GREEN,  note: 'voidexa.com — edge network' },
];

function SystemHealthPanel() {
  return (
    <section id="health">
      <SectionHeader title="System Health" />
      <Card style={{ padding: '20px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {SYSTEMS.map(({ name, status, color, note }) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <Dot color={color} pulse={status === 'live'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontSize: 14, color: '#cbd5e1', fontWeight: 500 }}>{name}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: 'rgba(100,116,139,0.6)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note}</div>
              </div>
              <span style={{
                fontFamily: MONO, fontSize: 11, fontWeight: 600,
                color, opacity: 0.85, letterSpacing: '0.08em',
                textTransform: 'uppercase', flexShrink: 0,
              }}>{status}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

const ACTIVITY = [
  { icon: '◈', text: 'KCP-90 compression recorded — quantum product, 83% ratio', time: '2m ago', color: BLUE },
  { icon: '◎', text: 'Trading Bot opened position — APEX strategy, ETH/USDT', time: '8m ago', color: GREEN },
  { icon: '◈', text: 'KCP-90 compression recorded — trading-bot product, 79% ratio', time: '12m ago', color: BLUE },
  { icon: '▣', text: 'System health check passed — all 4 live products nominal', time: '18m ago', color: GREEN },
  { icon: '◎', text: 'Trading Bot closed position +$24.40 — SCALPER strategy', time: '34m ago', color: GREEN },
  { icon: '◈', text: 'KCP-90 batch compression — 14 events, avg 81% ratio', time: '1h ago', color: BLUE },
  { icon: '◇', text: 'Quantum session completed — provider response 142ms', time: '1h ago', color: PURPLE },
  { icon: '◈', text: 'KCP-90 compression recorded — void-chat product, 77% ratio', time: '2h ago', color: BLUE },
];

function ActivityFeedPanel() {
  return (
    <section id="activity">
      <SectionHeader title="Activity Feed" badge="demo" />
      <Card style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ACTIVITY.map(({ icon, text, time, color }, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '12px 0',
              borderBottom: i < ACTIVITY.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ fontFamily: MONO, fontSize: 14, color, flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: '#94a3b8', flex: 1, lineHeight: 1.5 }}>{text}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(100,116,139,0.5)', flexShrink: 0, marginTop: 1 }}>{time}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ControlPlaneDashboard({ initial }: { initial: { summary: Summary | null; daily: unknown[]; recent: unknown[] } }) {
  const [data, setData] = useState<StatsData>({ summary: initial.summary, daily: initial.daily as DailyStat[], recent: initial.recent as RecentStat[] });
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [activeNav, setActiveNav] = useState('overview');

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
    setLastRefresh(new Date());
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  const handleNav = (id: string) => {
    setActiveNav(id);
    const scroller = document.getElementById('cp-scroll');
    const el = document.getElementById(id);
    if (scroller && el) {
      scroller.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
    }
  };

  const { summary, daily, recent } = data;

  return (
    <div style={{ display: 'flex', height: '100%', color: '#e2e8f0', background: BG, overflow: 'hidden' }}>
      <Sidebar active={activeNav} onNav={handleNav} />

      {/* Right column: topbar + scrollable content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar lastRefresh={lastRefresh} refreshing={refreshing} onRefresh={refresh} />

        {/* Scrollable main content */}
        <div id="cp-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* ── Row 1: 4 Metric Cards ── */}
          <section id="overview">
            <SectionHeader title="Overview" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <MetricCard
                label="KCP-90 Compressions"
                value={summary ? fmt(summary.total_compressions) : '—'}
                sub={summary ? `${((summary.overall_ratio ?? 0) * 100).toFixed(1)}% avg rate` : undefined}
                accent={BLUE}
              />
              <MetricCard
                label="Trading P&L (total)"
                value="+$3,241"
                sub="Season 03 · APEX + SCALPER"
                accent="#4ade80"
                demo
              />
              <MetricCard
                label="GHAI Price"
                value="$0.0042"
                sub="+3.2% 24h"
                accent={PURPLE}
                demo
              />
              <MetricCard
                label="Active Systems"
                value="4 / 10"
                sub="Quantum · Trading · KCP-90 · GHAI"
                accent={GREEN}
              />
            </div>
          </section>

          {/* ── Row 2: KCP-90 ── */}
          <Kcp90Panel summary={summary} daily={daily} recent={recent} />

          {/* ── Row 3: Trading Bot + GHAI Token ── */}
          <section id="trading">
            <SectionHeader title="Products — Phase 1 & 2" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <TradingBotPanel />
              <GhaiPanel />
            </div>
          </section>

          {/* ── Row 4: Quantum + Void Chat ── */}
          <section id="quantum">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <QuantumPanel />
              <VoidChatPanel />
            </div>
          </section>

          {/* ── Row 5: System Health ── */}
          <SystemHealthPanel />

          {/* ── Row 6: Activity Feed ── */}
          <ActivityFeedPanel />

        </div>
        </div>{/* end scrollable */}
      </div>{/* end right column */}

      <style>{`
        @keyframes cp-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a12; }
        ::-webkit-scrollbar-thumb { background: rgba(100,200,255,0.15); border-radius: 3px; }
      `}</style>
    </div>
  );
}
