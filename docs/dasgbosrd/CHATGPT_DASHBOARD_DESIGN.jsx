import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CircleDollarSign,
  Cpu,
  Globe,
  Radio,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const kcpData = [
  { day: "01", compression: 41, saved: 1.8 },
  { day: "02", compression: 46, saved: 2.2 },
  { day: "03", compression: 45, saved: 2.1 },
  { day: "04", compression: 49, saved: 2.5 },
  { day: "05", compression: 52, saved: 2.9 },
  { day: "06", compression: 56, saved: 3.2 },
  { day: "07", compression: 59, saved: 3.6 },
  { day: "08", compression: 57, saved: 3.4 },
  { day: "09", compression: 60, saved: 3.8 },
  { day: "10", compression: 64, saved: 4.1 },
  { day: "11", compression: 63, saved: 4.0 },
  { day: "12", compression: 66, saved: 4.4 },
  { day: "13", compression: 69, saved: 4.8 },
  { day: "14", compression: 68, saved: 4.6 },
  { day: "15", compression: 71, saved: 5.0 },
  { day: "16", compression: 73, saved: 5.4 },
  { day: "17", compression: 72, saved: 5.2 },
  { day: "18", compression: 75, saved: 5.8 },
  { day: "19", compression: 77, saved: 6.1 },
  { day: "20", compression: 76, saved: 6.0 },
  { day: "21", compression: 78, saved: 6.3 },
  { day: "22", compression: 80, saved: 6.8 },
  { day: "23", compression: 81, saved: 7.0 },
  { day: "24", compression: 79, saved: 6.7 },
  { day: "25", compression: 83, saved: 7.4 },
  { day: "26", compression: 84, saved: 7.6 },
  { day: "27", compression: 86, saved: 8.0 },
  { day: "28", compression: 88, saved: 8.4 },
  { day: "29", compression: 87, saved: 8.2 },
  { day: "30", compression: 91, saved: 8.9 },
];

const tradingExposure = [
  { name: "BTC", value: 41 },
  { name: "ETH", value: 28 },
  { name: "ALT", value: 19 },
  { name: "RISK_OFF", value: 12 },
];

const ghaiVolume = [
  { name: "Mon", volume: 320000 },
  { name: "Tue", volume: 410000 },
  { name: "Wed", volume: 380000 },
  { name: "Thu", volume: 520000 },
  { name: "Fri", volume: 610000 },
  { name: "Sat", volume: 470000 },
  { name: "Sun", volume: 560000 },
];

const websiteData = [
  { name: "Man", visits: 2200, pages: 3.2 },
  { name: "Tir", visits: 2540, pages: 3.5 },
  { name: "Ons", visits: 3120, pages: 3.9 },
  { name: "Tor", visits: 2980, pages: 4.1 },
  { name: "Fre", visits: 3560, pages: 4.3 },
  { name: "Lør", visits: 2640, pages: 3.6 },
  { name: "Søn", visits: 2810, pages: 3.8 },
];

const systemHealth = [
  { name: "KCP-90", status: "Operational", latency: "18 ms", tone: "green" },
  { name: "Trading Bot", status: "Monitoring", latency: "42 ms", tone: "yellow" },
  { name: "GHAI Token", status: "Operational", latency: "24 ms", tone: "green" },
  { name: "Quantum Engine", status: "Operational", latency: "31 ms", tone: "green" },
  { name: "Void Chat", status: "Degraded", latency: "87 ms", tone: "red" },
  { name: "Website", status: "Operational", latency: "21 ms", tone: "green" },
];

const activityFeed = [
  {
    time: "20:41:07",
    source: "KCP-90",
    event: "Compression spike detected on enterprise batch cluster",
    level: "info",
  },
  {
    time: "20:40:44",
    source: "TRADING",
    event: "Season model rotated exposure from ETH to BTC",
    level: "success",
  },
  {
    time: "20:39:58",
    source: "VOID CHAT",
    event: "Concurrent messages crossed 12.4k, autoscaling engaged",
    level: "info",
  },
  {
    time: "20:38:12",
    source: "GHAI",
    event: "Burn event executed: 182,500 GHAI removed from supply",
    level: "success",
  },
  {
    time: "20:37:26",
    source: "QUANTUM",
    event: "Provider cost anomaly flagged on session route QN-4",
    level: "warn",
  },
  {
    time: "20:35:51",
    source: "SYSTEM",
    event: "Void Chat latency breached yellow threshold",
    level: "error",
  },
];

const smallStats = [
  {
    title: "KCP-90 Protocol",
    value: "91.0%",
    subtitle: "avg compression",
    delta: "+12.4%",
    icon: Cpu,
  },
  {
    title: "Trading Bot",
    value: "+12.84%",
    subtitle: "30d P&L",
    delta: "+3.1%",
    icon: TrendingUp,
  },
  {
    title: "GHAI Token",
    value: "$1.84",
    subtitle: "spot price",
    delta: "+7.8%",
    icon: CircleDollarSign,
  },
  {
    title: "Quantum Engine",
    value: "248k",
    subtitle: "sessions / 30d",
    delta: "+18.2%",
    icon: BrainCircuit,
  },
];

const healthTone = {
  green: "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]",
  yellow: "bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.55)]",
  red: "bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.55)]",
};

const feedTone = {
  info: "text-sky-300 border-sky-500/30 bg-sky-500/10",
  success: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
  warn: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  error: "text-rose-300 border-rose-500/30 bg-rose-500/10",
};

function GridCard({ title, eyebrow, right, children, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.18),transparent_28%)]" />
      <div className="relative z-10 h-full p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-sky-300/70">
                {eyebrow}
              </div>
            ) : null}
            <h3 className="font-mono text-sm uppercase tracking-[0.22em] text-white/90">{title}</h3>
          </div>
          {right}
        </div>
        {children}
      </div>
    </motion.section>
  );
}

function Metric({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/25 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">{label}</div>
      <div className="mt-2 font-mono text-2xl text-white">{value}</div>
      <div className="mt-1 text-xs text-white/45">{hint}</div>
    </div>
  );
}

function StatusPill({ children, tone = "sky" }) {
  const tones = {
    sky: "border-sky-400/25 bg-sky-500/10 text-sky-300",
    purple: "border-violet-400/25 bg-violet-500/10 text-violet-300",
    green: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    yellow: "border-amber-400/25 bg-amber-500/10 text-amber-300",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] ${tones[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function HeaderStat({ item }) {
  const Icon = item.icon;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">{item.title}</div>
          <div className="mt-3 font-mono text-3xl text-white">{item.value}</div>
          <div className="mt-1 text-sm text-white/55">{item.subtitle}</div>
        </div>
        <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-3 text-sky-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 font-mono text-xs text-emerald-300">
        <ArrowUpRight className="h-3.5 w-3.5" />
        {item.delta}
      </div>
    </div>
  );
}

export default function VoidexaControlPlaneDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.15),transparent_22%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_26%)]" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/35 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-500/10 shadow-[0_0_30px_rgba(59,130,246,0.18)]">
                <Shield className="h-6 w-6 text-sky-300" />
              </div>
              <div>
                <div className="font-mono text-lg uppercase tracking-[0.28em] text-white">Voidexa</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-sky-300/70">
                  Control Plane / Admin
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4 font-mono text-sm text-white/72">
            {[
              ["Overview", Activity],
              ["Protocol", Cpu],
              ["Markets", TrendingUp],
              ["Quantum", BrainCircuit],
              ["Chat", Radio],
              ["Analytics", Globe],
              ["Treasury", Wallet],
              ["System Health", Shield],
            ].map(([label, Icon], idx) => (
              <button
                key={label}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  idx === 0
                    ? "border-sky-400/25 bg-sky-500/12 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.08)]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`h-4 w-4 ${idx === 0 ? "text-sky-300" : "text-white/55"}`} />
                <span className="uppercase tracking-[0.18em]">{label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-white/80">
                <Zap className="h-4 w-4 text-violet-300" />
                Command Status
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-black/25 px-3 py-2">
                  <span className="text-xs text-white/55">Admin access</span>
                  <StatusPill tone="green">Verified</StatusPill>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/25 px-3 py-2">
                  <span className="text-xs text-white/55">Realtime sync</span>
                  <StatusPill tone="sky">Live</StatusPill>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/25 px-3 py-2">
                  <span className="text-xs text-white/55">Threat surface</span>
                  <StatusPill tone="yellow">Low</StatusPill>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-black/35 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-5 py-5 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-sky-300/70">
                  Voidexa Infrastructure // /control-plane
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                  Admin Command Dashboard
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-white/55">
                  Unified observability for protocol compression, trading systems, token economics,
                  quantum orchestration, chat throughput, site analytics, and infrastructure health.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill tone="purple">Admin-only</StatusPill>
                <StatusPill tone="sky">Realtime telemetry</StatusPill>
                <StatusPill tone="green">Cluster secure</StatusPill>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-5 lg:p-8">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {smallStats.map((item) => (
                <HeaderStat key={item.title} item={item} />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <GridCard title="KCP-90 Protocol" eyebrow="Section 01" className="xl:col-span-6">
                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Metric label="Compressions" value="14.2M" hint="30-day processed events" />
                  <Metric label="Avg rate" value="91.0%" hint="mean compression efficiency" />
                  <Metric label="Tokens saved" value="182M" hint="estimated token reduction" />
                </div>
                <div className="h-72 rounded-2xl border border-white/8 bg-black/25 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kcpData}>
                      <defs>
                        <linearGradient id="compressionFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="savedFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(10,10,10,0.95)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          color: "white",
                        }}
                      />
                      <Area type="monotone" dataKey="compression" stroke="#60a5fa" strokeWidth={2.2} fill="url(#compressionFill)" />
                      <Area type="monotone" dataKey="saved" stroke="#7c3aed" strokeWidth={2.2} fill="url(#savedFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GridCard>

              <GridCard
                title="Trading Bot"
                eyebrow="Section 02"
                className="xl:col-span-3"
                right={<StatusPill tone="green">Healthy</StatusPill>}
              >
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="Season" value="BTC" hint="dominant regime" />
                  <Metric label="P&L" value="+$184.2k" hint="last 30 days" />
                  <Metric label="Positions" value="18" hint="active across venues" />
                  <Metric label="Win rate" value="62.4%" hint="execution confidence" />
                </div>
                <div className="mt-4 h-64 rounded-2xl border border-white/8 bg-black/25 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tradingExposure}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={82}
                        paddingAngle={3}
                        stroke="rgba(255,255,255,0.08)"
                      >
                        {tradingExposure.map((entry, index) => {
                          const colors = ["#60a5fa", "#3b82f6", "#7c3aed", "#94a3b8"];
                          return <Cell key={entry.name} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "rgba(10,10,10,0.95)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          color: "white",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-white/55">
                  {tradingExposure.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: ["#60a5fa", "#3b82f6", "#7c3aed", "#94a3b8"][idx] }}
                        />
                        {item.name}
                      </div>
                      <span>{item.value}%</span>
                    </div>
                  ))}
                </div>
              </GridCard>

              <GridCard title="GHAI Token" eyebrow="Section 03" className="xl:col-span-3">
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="Price" value="$1.84" hint="spot market" />
                  <Metric label="Burned" value="24.8M" hint="supply retired" />
                  <Metric label="Liquidity" value="$6.2M" hint="aggregated pools" />
                  <Metric label="Volume" value="$3.27M" hint="24h turnover" />
                </div>
                <div className="mt-4 h-64 rounded-2xl border border-white/8 bg-black/25 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ghaiVolume}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(10,10,10,0.95)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          color: "white",
                        }}
                      />
                      <Bar dataKey="volume" radius={[8, 8, 0, 0]} fill="#7c3aed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GridCard>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <GridCard title="Quantum Engine" eyebrow="Section 04" className="xl:col-span-4">
                <div className="grid grid-cols-3 gap-3">
                  <Metric label="Sessions" value="248k" hint="30-day total" />
                  <Metric label="Providers" value="12" hint="active backends" />
                  <Metric label="Cost / session" value="$0.028" hint="blended average" />
                </div>
                <div className="mt-4 h-64 rounded-2xl border border-white/8 bg-black/25 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="28%"
                      outerRadius="92%"
                      data={[{ name: "Efficiency", value: 87, fill: "#60a5fa" }]}
                      startAngle={180}
                      endAngle={0}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={20} />
                      <text x="50%" y="54%" textAnchor="middle" className="fill-white font-mono text-4xl">
                        87%
                      </text>
                      <text x="50%" y="66%" textAnchor="middle" className="fill-white/45 font-mono text-xs uppercase tracking-[0.2em]">
                        route efficiency
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </GridCard>

              <GridCard title="Void Chat" eyebrow="Section 05" className="xl:col-span-4" right={<StatusPill tone="yellow">Scaled</StatusPill>}>
                <div className="grid grid-cols-3 gap-3">
                  <Metric label="Messages" value="1.84M" hint="7-day throughput" />
                  <Metric label="Active users" value="42.8k" hint="daily active" />
                  <Metric label="Cost" value="$18.2k" hint="weekly inference spend" />
                </div>
                <div className="mt-4 h-64 rounded-2xl border border-white/8 bg-black/25 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={websiteData}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(10,10,10,0.95)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          color: "white",
                        }}
                      />
                      <Line type="monotone" dataKey="visits" stroke="#60a5fa" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="pages" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GridCard>

              <GridCard title="Website Analytics" eyebrow="Section 06" className="xl:col-span-4">
                <div className="grid grid-cols-3 gap-3">
                  <Metric label="Visits" value="19.8k" hint="weekly traffic" />
                  <Metric label="Pages" value="3.8" hint="pages / session" />
                  <Metric label="Bounce" value="28.4%" hint="engagement leakage" />
                </div>
                <div className="mt-4 h-64 rounded-2xl border border-white/8 bg-black/25 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={websiteData}>
                      <defs>
                        <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.36} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(10,10,10,0.95)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 16,
                          color: "white",
                        }}
                      />
                      <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2.2} fill="url(#visitsFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GridCard>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <GridCard title="System Health" eyebrow="Section 07" className="xl:col-span-4">
                <div className="space-y-3">
                  {systemHealth.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${healthTone[item.tone]}`} />
                          <div>
                            <div className="font-mono text-sm uppercase tracking-[0.18em] text-white/90">{item.name}</div>
                            <div className="mt-1 text-xs text-white/45">{item.status}</div>
                          </div>
                        </div>
                        <div className="font-mono text-xs text-white/55">{item.latency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </GridCard>

              <GridCard title="Activity Feed" eyebrow="Section 08" className="xl:col-span-8" right={<StatusPill tone="sky">Streaming</StatusPill>}>
                <div className="space-y-3">
                  {activityFeed.map((item) => (
                    <div key={`${item.time}-${item.source}`} className={`rounded-2xl border px-4 py-3 ${feedTone[item.level]}`}>
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-xl border border-white/10 bg-black/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                            {item.source}
                          </div>
                          <div>
                            <div className="font-mono text-xs uppercase tracking-[0.16em] text-white/45">{item.time} UTC</div>
                            <div className="mt-1 text-sm text-white/90">{item.event}</div>
                          </div>
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">Realtime event</div>
                      </div>
                    </div>
                  ))}
                </div>
              </GridCard>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

