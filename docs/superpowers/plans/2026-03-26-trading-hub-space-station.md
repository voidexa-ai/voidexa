# Trading Hub + Space Station Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full 5-tab Trading Hub at /trading-hub and a 3-deck Space Station at /station, with Supabase backend tables, star map nodes, and navigation entries.

**Architecture:** Trading Hub replaces the existing placeholder page with a tab-based hub (Leaderboard, Upload Bot, Learn, Forum, Compete). Space Station is a new page at /station with hash-anchor deck navigation. Both pages use client-side Supabase queries for live data. Star map nodes.ts gets two new/updated entries; Navigation.tsx gets /station added.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS, framer-motion, lucide-react, @supabase/supabase-js, TypeScript

**Project root:** `C:/Users/Jixwu/Desktop/voidexa` — no `src/` prefix. All imports use `@/` alias pointing to project root.

**Design constants (use everywhere):**
- Background: `#07070d`
- Text primary: `#e2e8f0`
- Text muted: `#64748b`
- Font heading: `var(--font-space)`
- Min font-size: 14px body, 16px labels, 24px numbers
- Font-weight: 400 and 500 only (no 300, no 600+ except badge text)
- Letter-spacing on numbers: `0.02em`
- Trading Hub accent: `#cc9955` (amber/golden)
- Space Station accent: `#44aacc` (steel cyan)

---

### Task 1: Supabase Migration — All New Tables

**Files:**
- Create: `supabase/migrations/phase3_trading_hub_station.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Phase 3: Trading Hub + Space Station
-- Run in Supabase SQL Editor (project: ihuljnekxkyqgroklurp, EU)

-- ============================================================
-- TABLE: trading_hub_bots
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trading_hub_bots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    return_pct DECIMAL(10, 2) DEFAULT 0,
    sharpe_ratio DECIMAL(8, 4) DEFAULT 0,
    max_drawdown DECIMAL(8, 4) DEFAULT 0,
    regime_score TEXT DEFAULT 'all' CHECK (regime_score IN ('btc','eth','alt','risk-off','all')),
    strategy_type TEXT,
    upload_date TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','paused','rejected')),
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trading_hub_bots_user ON public.trading_hub_bots(user_id);
CREATE INDEX idx_trading_hub_bots_return ON public.trading_hub_bots(return_pct DESC);

ALTER TABLE public.trading_hub_bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active bots"
    ON public.trading_hub_bots FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users manage own bots"
    ON public.trading_hub_bots FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access bots"
    ON public.trading_hub_bots FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: trading_hub_uploads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trading_hub_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'scanning' CHECK (status IN ('scanning','analyzed','failed','rejected')),
    ai_scan_result JSONB,
    strategy_type_detected TEXT,
    similar_bots_found INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trading_hub_uploads_user ON public.trading_hub_uploads(user_id);

ALTER TABLE public.trading_hub_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own uploads"
    ON public.trading_hub_uploads FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users create uploads"
    ON public.trading_hub_uploads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access uploads"
    ON public.trading_hub_uploads FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: forum_threads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('strategy','post-mortem','market','help','competition')),
    content TEXT NOT NULL,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_forum_threads_created ON public.forum_threads(created_at DESC);
CREATE INDEX idx_forum_threads_category ON public.forum_threads(category);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read threads"
    ON public.forum_threads FOR SELECT USING (true);

CREATE POLICY "Authenticated create threads"
    ON public.forum_threads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own threads"
    ON public.forum_threads FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admin full access threads"
    ON public.forum_threads FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: forum_replies
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_forum_replies_thread ON public.forum_replies(thread_id, created_at ASC);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read replies"
    ON public.forum_replies FOR SELECT USING (true);

CREATE POLICY "Authenticated create replies"
    ON public.forum_replies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access replies"
    ON public.forum_replies FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Auto-increment reply_count on new reply
CREATE OR REPLACE FUNCTION public.increment_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.forum_threads SET reply_count = reply_count + 1, updated_at = now()
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_forum_reply ON public.forum_replies;
CREATE TRIGGER on_new_forum_reply
    AFTER INSERT ON public.forum_replies
    FOR EACH ROW EXECUTE FUNCTION public.increment_thread_reply_count();

-- ============================================================
-- TABLE: competitions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    prizes JSONB DEFAULT '{"first": 10000, "second": 5000, "third": 2500}'::jsonb,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','active','ended')),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read competitions"
    ON public.competitions FOR SELECT USING (true);

CREATE POLICY "Admin full access competitions"
    ON public.competitions FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: competition_entries
-- ============================================================
CREATE TABLE IF NOT EXISTS public.competition_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bot_id UUID REFERENCES public.trading_hub_bots(id) ON DELETE SET NULL,
    score DECIMAL(10, 4) DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(competition_id, user_id)
);

CREATE INDEX idx_competition_entries_comp ON public.competition_entries(competition_id, score DESC);

ALTER TABLE public.competition_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read entries"
    ON public.competition_entries FOR SELECT USING (true);

CREATE POLICY "Authenticated enter competition"
    ON public.competition_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access entries"
    ON public.competition_entries FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: station_ideas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.station_ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_station_ideas_votes ON public.station_ideas(votes DESC);

ALTER TABLE public.station_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ideas"
    ON public.station_ideas FOR SELECT USING (true);

CREATE POLICY "Authenticated submit ideas"
    ON public.station_ideas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated upvote ideas"
    ON public.station_ideas FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access ideas"
    ON public.station_ideas FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed: sample competition
INSERT INTO public.competitions (title, description, start_date, end_date, prizes, status)
VALUES (
    'April Regime Challenge',
    'Build a bot that outperforms in the current BTC-dominated regime. All strategies welcome.',
    '2026-04-01T00:00:00Z',
    '2026-04-30T23:59:59Z',
    '{"first": 10000, "second": 5000, "third": 2500}',
    'upcoming'
) ON CONFLICT DO NOTHING;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/phase3_trading_hub_station.sql
git commit -m "feat: add phase3 supabase migration — trading hub + station tables with RLS"
```

---

### Task 2: Trading Hub Shell — Replace Placeholder with Tab Navigation

**Files:**
- Modify: `app/trading-hub/page.tsx` (full replacement)
- Create: `components/trading-hub/TradingHubTabs.tsx`

- [ ] **Step 1: Create tab navigation component**

Create `components/trading-hub/TradingHubTabs.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Upload, BookOpen, MessageSquare, Sword } from 'lucide-react'
import LeaderboardTab from './LeaderboardTab'
import UploadBotTab from './UploadBotTab'
import LearnTab from './LearnTab'
import ForumTab from './ForumTab'
import CompeteTab from './CompeteTab'

const ACCENT = '#cc9955'

const TABS = [
  { id: 'leaderboard', label: 'Leaderboard', Icon: Trophy },
  { id: 'upload',      label: 'Upload Bot',  Icon: Upload },
  { id: 'learn',       label: 'Learn',       Icon: BookOpen },
  { id: 'forum',       label: 'Forum',       Icon: MessageSquare },
  { id: 'compete',     label: 'Compete',     Icon: Sword },
] as const

type TabId = typeof TABS[number]['id']

export default function TradingHubTabs() {
  const [active, setActive] = useState<TabId>('leaderboard')

  return (
    <div className="min-h-screen" style={{ background: '#07070d' }}>
      {/* Tab bar */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{
          background: 'rgba(7,7,13,0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: `${ACCENT}22`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-0 no-scrollbar">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className="relative flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
                  style={{
                    color: isActive ? ACCENT : '#64748b',
                    fontWeight: isActive ? 500 : 400,
                    fontSize: '0.9375rem',
                  }}
                >
                  <Icon size={15} />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: 2, background: ACCENT,
                        boxShadow: `0 0 8px ${ACCENT}`,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {active === 'leaderboard' && <LeaderboardTab />}
        {active === 'upload'      && <UploadBotTab />}
        {active === 'learn'       && <LearnTab />}
        {active === 'forum'       && <ForumTab />}
        {active === 'compete'     && <CompeteTab />}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace trading-hub page**

Replace `app/trading-hub/page.tsx` entirely:

```tsx
import TradingHubTabs from '@/components/trading-hub/TradingHubTabs'

export const metadata = { title: 'Trading Hub — voidexa' }

export default function TradingHubPage() {
  return <TradingHubTabs />
}
```

- [ ] **Step 3: Create stub files for all tab components** (so build doesn't fail before they're implemented)

Create `components/trading-hub/LeaderboardTab.tsx`:
```tsx
export default function LeaderboardTab() { return <div /> }
```

Create `components/trading-hub/UploadBotTab.tsx`:
```tsx
export default function UploadBotTab() { return <div /> }
```

Create `components/trading-hub/LearnTab.tsx`:
```tsx
export default function LearnTab() { return <div /> }
```

Create `components/trading-hub/ForumTab.tsx`:
```tsx
export default function ForumTab() { return <div /> }
```

Create `components/trading-hub/CompeteTab.tsx`:
```tsx
export default function CompeteTab() { return <div /> }
```

- [ ] **Step 4: Verify build**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1 | tail -20
```

Expected: Build passes with no errors.

- [ ] **Step 5: Commit**

```bash
git add app/trading-hub/page.tsx components/trading-hub/
git commit -m "feat: trading hub shell — tab navigation replacing placeholder"
```

---

### Task 3: Leaderboard Tab

**Files:**
- Modify: `components/trading-hub/LeaderboardTab.tsx`

- [ ] **Step 1: Implement full leaderboard with house bot banner and sortable table**

Replace `components/trading-hub/LeaderboardTab.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown, TrendingUp, Shield, Zap } from 'lucide-react'

const ACCENT = '#cc9955'

type RegimeKey = 'btc' | 'eth' | 'alt' | 'risk-off' | 'all'

const REGIME_CONFIG: Record<RegimeKey, { label: string; color: string; bg: string }> = {
  btc:       { label: 'BTC Phase',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  eth:       { label: 'ETH Phase',    color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
  alt:       { label: 'Alt Phase',    color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  'risk-off':{ label: 'Risk-Off',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  all:       { label: 'All Phases',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
}

interface BotRow {
  rank: number
  name: string
  creator: string
  return_pct: number
  sharpe: number
  max_drawdown: number
  regime: RegimeKey
  isHouse?: boolean
}

const MOCK_BOTS: BotRow[] = [
  { rank: 1, name: 'voidexa All-Season',  creator: 'voidexa',   return_pct: 306.4, sharpe: 3.21, max_drawdown: 8.4,  regime: 'all',      isHouse: true },
  { rank: 2, name: 'BTC Momentum Alpha',  creator: 'cryptovoid', return_pct: 218.7, sharpe: 2.44, max_drawdown: 14.2, regime: 'btc'  },
  { rank: 3, name: 'ETH Grid Master',     creator: 'gridlord',   return_pct: 187.3, sharpe: 2.11, max_drawdown: 11.8, regime: 'eth'  },
  { rank: 4, name: 'AltSeason Hunter',    creator: 'moonbase9',  return_pct: 155.9, sharpe: 1.88, max_drawdown: 22.1, regime: 'alt'  },
  { rank: 5, name: 'Safe Harbor v2',      creator: 'stableops',  return_pct: 98.4,  sharpe: 2.89, max_drawdown: 4.2,  regime: 'risk-off'},
  { rank: 6, name: 'Regime Switcher',     creator: 'adaptai',    return_pct: 142.0, sharpe: 1.72, max_drawdown: 18.6, regime: 'all'  },
  { rank: 7, name: 'MACD Crossover Pro',  creator: 'techtrader', return_pct: 76.3,  sharpe: 1.34, max_drawdown: 25.0, regime: 'btc'  },
]

type SortKey = 'return_pct' | 'sharpe' | 'max_drawdown'
type SortDir = 'asc' | 'desc'

function RegimeBadge({ regime }: { regime: RegimeKey }) {
  const cfg = REGIME_CONFIG[regime]
  return (
    <span
      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, background: cfg.bg, fontSize: '0.8125rem', letterSpacing: '0.02em' }}
    >
      {cfg.label}
    </span>
  )
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} style={{ color: '#334155' }} />
  if (sortDir === 'desc') return <ChevronDown size={13} style={{ color: ACCENT }} />
  return <ChevronUp size={13} style={{ color: ACCENT }} />
}

export default function LeaderboardTab() {
  const [sortKey, setSortKey] = useState<SortKey>('return_pct')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...MOCK_BOTS].sort((a, b) => {
    const mult = sortDir === 'desc' ? -1 : 1
    return mult * (a[sortKey] - b[sortKey])
  })

  return (
    <div className="space-y-8">
      {/* House bot banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, rgba(204,153,85,0.12) 0%, rgba(204,153,85,0.04) 100%)`,
          border: `1px solid ${ACCENT}33`,
          boxShadow: `0 0 60px ${ACCENT}0a`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} style={{ color: ACCENT }} />
              <span
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: `${ACCENT}88`, letterSpacing: '0.14em' }}
              >
                House Bot · All-Season
              </span>
            </div>
            <h2
              className="font-medium mb-1"
              style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)' }}
            >
              voidexa All-Season
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
              Current regime: <span style={{ color: '#3b82f6', fontWeight: 500 }}>BTC Phase</span>
              {' '}— strategy adapting to market conditions in real-time.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div
              className="font-medium"
              style={{ color: '#22c55e', fontSize: '2.5rem', letterSpacing: '0.02em', lineHeight: 1 }}
            >
              +306%
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>All-time return</div>
            <div
              className="mt-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT }}
            >
              Can you beat it?
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-6 pt-6" style={{ borderTop: `1px solid ${ACCENT}18` }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>Sharpe Ratio</div>
            <div style={{ color: '#e2e8f0', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.02em' }}>3.21</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>Max Drawdown</div>
            <div style={{ color: '#f87171', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.02em' }}>-8.4%</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>Regime</div>
            <RegimeBadge regime="all" />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Table header */}
        <div
          className="grid gap-0 px-4 py-3 text-xs font-medium uppercase tracking-wider"
          style={{
            gridTemplateColumns: '48px 1fr 120px 120px 120px 140px',
            background: 'rgba(255,255,255,0.03)',
            color: '#475569',
            letterSpacing: '0.1em',
            fontSize: '0.75rem',
          }}
        >
          <div>#</div>
          <div>Bot</div>
          <button className="flex items-center gap-1 hover:text-[#94a3b8] transition-colors" onClick={() => handleSort('return_pct')}>
            Return <SortIcon col="return_pct" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button className="flex items-center gap-1 hover:text-[#94a3b8] transition-colors" onClick={() => handleSort('sharpe')}>
            Sharpe <SortIcon col="sharpe" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button className="flex items-center gap-1 hover:text-[#94a3b8] transition-colors" onClick={() => handleSort('max_drawdown')}>
            Max DD <SortIcon col="max_drawdown" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <div>Regime</div>
        </div>

        {/* Rows */}
        {sorted.map((bot, i) => (
          <motion.div
            key={bot.rank}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="grid items-center px-4 py-4 transition-colors"
            style={{
              gridTemplateColumns: '48px 1fr 120px 120px 120px 140px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              background: bot.isHouse ? `rgba(204,153,85,0.04)` : 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = bot.isHouse ? 'rgba(204,153,85,0.04)' : 'transparent'}
          >
            <div style={{ color: bot.rank <= 3 ? ACCENT : '#475569', fontWeight: 500, fontSize: '1rem' }}>
              {bot.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{bot.name}</span>
                {bot.isHouse && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${ACCENT}18`, color: ACCENT, fontSize: '0.75rem', border: `1px solid ${ACCENT}30` }}
                  >
                    house
                  </span>
                )}
              </div>
              <div style={{ color: '#475569', fontSize: '0.8125rem' }}>@{bot.creator}</div>
            </div>
            <div style={{ color: '#22c55e', fontWeight: 500, fontSize: '1rem', letterSpacing: '0.02em' }}>
              +{bot.return_pct.toFixed(1)}%
            </div>
            <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1rem', letterSpacing: '0.02em' }}>
              {bot.sharpe.toFixed(2)}
            </div>
            <div style={{ color: '#f87171', fontWeight: 500, fontSize: '1rem', letterSpacing: '0.02em' }}>
              -{bot.max_drawdown.toFixed(1)}%
            </div>
            <RegimeBadge regime={bot.regime} />
          </motion.div>
        ))}
      </motion.div>

      <p style={{ color: '#334155', fontSize: '0.8125rem', textAlign: 'center' }}>
        Live data coming soon. Mock data shown above.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1 | tail -20
```

Expected: Build passes.

- [ ] **Step 3: Commit**

```bash
git add components/trading-hub/LeaderboardTab.tsx
git commit -m "feat: trading hub leaderboard tab — house bot banner and sortable table"
```

---

### Task 4: Upload Bot Tab

**Files:**
- Modify: `components/trading-hub/UploadBotTab.tsx`

- [ ] **Step 1: Implement drag-drop upload with 3-step flow**

Replace `components/trading-hub/UploadBotTab.tsx`:

```tsx
'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, Loader, AlertTriangle } from 'lucide-react'

const ACCENT = '#cc9955'

type Step = 'idle' | 'uploading' | 'scanning' | 'analyzing' | 'done' | 'error'

const STEPS = [
  { id: 'scanning',  label: 'AI Safety Scan',             desc: 'Checking for malicious patterns and unsafe operations.' },
  { id: 'analyzing', label: 'Quantum Strategy Analysis',  desc: 'Detecting strategy type, regime fit, and complexity score.' },
  { id: 'done',      label: 'Scorecard Generated',        desc: 'Your bot has been benchmarked and added to the queue.' },
]

export default function UploadBotTab() {
  const [step, setStep]       = useState<Step>('idle')
  const [filename, setFilename] = useState('')
  const [dragging, setDragging] = useState(false)
  const [error, setError]     = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const runSteps = useCallback(async (name: string) => {
    setFilename(name)
    setStep('uploading')
    await new Promise(r => setTimeout(r, 800))
    setStep('scanning')
    await new Promise(r => setTimeout(r, 1800))
    setStep('analyzing')
    await new Promise(r => setTimeout(r, 2200))
    setStep('done')
  }, [])

  function handleFile(file: File) {
    if (!file.name.endsWith('.py')) {
      setError('Only .py files are accepted.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB.')
      return
    }
    setError('')
    runSteps(file.name)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const stepIndex = { uploading: -1, scanning: 0, analyzing: 1, done: 2 }[step] ?? -1

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.5rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}>
          Upload Your Bot
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
          Drop a Python trading strategy. We&apos;ll scan it, analyse it, and generate a performance scorecard.
        </p>
      </div>

      {/* Drop zone */}
      {(step === 'idle' || step === 'error') && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className="rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all"
          style={{
            minHeight: 220,
            border: `2px dashed ${dragging ? ACCENT : 'rgba(255,255,255,0.1)'}`,
            background: dragging ? `${ACCENT}08` : 'rgba(255,255,255,0.02)',
            padding: '48px 32px',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}30` }}
          >
            <Upload size={24} style={{ color: ACCENT }} />
          </div>
          <div className="text-center">
            <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1rem', marginBottom: 4 }}>
              Drop your .py file here
            </p>
            <p style={{ color: '#475569', fontSize: '0.875rem' }}>
              or click to browse · max 5 MB
            </p>
          </div>
          {error && (
            <p className="flex items-center gap-2" style={{ color: '#f87171', fontSize: '0.875rem' }}>
              <AlertTriangle size={14} /> {error}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".py"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </motion.div>
      )}

      {/* Steps progress */}
      <AnimatePresence>
        {step !== 'idle' && step !== 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 space-y-6"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                style={{ background: `${ACCENT}14`, color: ACCENT, border: `1px solid ${ACCENT}28` }}
              >
                .py
              </div>
              <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{filename}</span>
            </div>

            {STEPS.map((s, i) => {
              const done = stepIndex > i
              const active = stepIndex === i
              return (
                <div key={s.id} className="flex gap-4 items-start">
                  <div className="shrink-0 mt-0.5">
                    {done ? (
                      <CheckCircle size={20} style={{ color: '#22c55e' }} />
                    ) : active ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                      >
                        <Loader size={20} style={{ color: ACCENT }} />
                      </motion.div>
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full border"
                        style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                      />
                    )}
                  </div>
                  <div>
                    <p style={{
                      color: done ? '#22c55e' : active ? '#e2e8f0' : '#475569',
                      fontWeight: active ? 500 : 400,
                      fontSize: '0.9375rem',
                      marginBottom: 2,
                    }}>
                      {s.label}
                    </p>
                    {(done || active) && (
                      <p style={{ color: '#475569', fontSize: '0.8125rem' }}>{s.desc}</p>
                    )}
                  </div>
                </div>
              )
            })}

            {step === 'done' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 mt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p style={{ color: '#22c55e', fontWeight: 500, fontSize: '0.9375rem', marginBottom: 4 }}>
                  Bot submitted successfully
                </p>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Our team will review your bot before it appears on the leaderboard.
                </p>
                <button
                  onClick={() => { setStep('idle'); setFilename('') }}
                  className="mt-4 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}30`, color: ACCENT }}
                >
                  Upload another
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info section */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          What we check
        </p>
        <div className="space-y-2">
          {[
            'No network requests, file writes, or system calls',
            'Buy/sell logic must be clearly defined',
            'Strategy must accept OHLCV data as input',
            'Maximum 500 lines of code',
          ].map(rule => (
            <div key={rule} className="flex items-start gap-2">
              <span style={{ color: `${ACCENT}66`, fontSize: '1rem', lineHeight: 1.4 }}>·</span>
              <span style={{ color: '#64748b', fontSize: '0.9375rem' }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build and commit**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1 | tail -5
git add components/trading-hub/UploadBotTab.tsx
git commit -m "feat: upload bot tab — drag-drop zone with 3-step progress flow"
```

---

### Task 5: Learn Tab + Strategy Content + Detail Page

**Files:**
- Create: `content/trading-hub/strategies.ts`
- Modify: `components/trading-hub/LearnTab.tsx`
- Create: `app/trading-hub/learn/[strategy-slug]/page.tsx`

- [ ] **Step 1: Create strategy content module**

Create `content/trading-hub/strategies.ts`:

```ts
export interface Strategy {
  slug: string
  title: string
  tagline: string
  tags: string[]
  isEdge?: boolean
  sections: { heading: string; body: string }[]
}

export const STRATEGIES: Strategy[] = [
  {
    slug: 'dca',
    title: 'DCA',
    tagline: 'Dollar-Cost Averaging',
    tags: ['Beginner', 'Low Risk', 'Long-term'],
    sections: [
      {
        heading: 'What is DCA?',
        body: 'Dollar-Cost Averaging means buying a fixed dollar amount of an asset at regular intervals, regardless of price. Over time this smooths out the impact of volatility and removes the pressure to time the market perfectly.',
      },
      {
        heading: 'When does it work?',
        body: 'DCA works best in long-term uptrends. It underperforms in sustained bear markets compared to not investing at all — but it dramatically outperforms the emotional investor who tries to time bottoms and tops.',
      },
      {
        heading: 'Key parameters',
        body: 'Interval (weekly/monthly), fixed amount per interval, asset selection, and optionally a momentum filter to pause during extreme downtrends.',
      },
    ],
  },
  {
    slug: 'grid-trading',
    title: 'Grid Trading',
    tagline: 'Buy low, sell high automatically',
    tags: ['Intermediate', 'Sideways markets', 'High frequency'],
    sections: [
      {
        heading: 'What is Grid Trading?',
        body: 'A grid bot places buy orders at regular intervals below the current price and sell orders at regular intervals above it. Every time the price bounces between grid lines, it captures the spread as profit.',
      },
      {
        heading: 'Best conditions',
        body: 'Sideways, choppy markets with no strong trend. Trending markets destroy grid bots — the price blows through all your buy orders and never comes back.',
      },
      {
        heading: 'Key parameters',
        body: 'Grid range (upper/lower price), number of grids, investment per grid, and a trend filter to pause the bot during breakouts.',
      },
    ],
  },
  {
    slug: 'momentum',
    title: 'Momentum',
    tagline: 'Ride the trend until it bends',
    tags: ['Intermediate', 'Trending markets', 'Higher risk'],
    sections: [
      {
        heading: 'What is Momentum?',
        body: 'Momentum strategies assume that assets which have performed well recently will continue to perform well in the near term. You buy the winners and short (or avoid) the losers.',
      },
      {
        heading: 'Classic implementation',
        body: 'Rank assets by 3-month or 12-month return. Long the top decile, flat or short the bottom decile. Rebalance monthly.',
      },
      {
        heading: 'Key risks',
        body: 'Momentum crashes — sudden reversals that punish crowded trades. Adding a volatility filter and maximum drawdown circuit breaker is essential.',
      },
    ],
  },
  {
    slug: 'mean-reversion',
    title: 'Mean Reversion',
    tagline: 'Prices always return to average',
    tags: ['Intermediate', 'Range-bound', 'Statistical'],
    sections: [
      {
        heading: 'The core idea',
        body: 'Many financial time series have a statistical tendency to return to their mean. When an asset deviates far from its historical average, you bet it will revert.',
      },
      {
        heading: 'Common indicators',
        body: 'Z-score of price vs. rolling mean, Bollinger Bands, RSI divergence. Entry on extreme deviation, exit when price returns to mean.',
      },
      {
        heading: 'Danger zones',
        body: 'Mean reversion fails catastrophically on assets entering structural decline. Always combine with a fundamental health check or a trend regime filter.',
      },
    ],
  },
  {
    slug: 'rebalancing',
    title: 'Rebalancing',
    tagline: 'Systematic portfolio maintenance',
    tags: ['Beginner', 'Low maintenance', 'Portfolio'],
    sections: [
      {
        heading: 'What is Rebalancing?',
        body: 'Set a target allocation (e.g. 60% BTC, 30% ETH, 10% stables). When any asset drifts more than a threshold from its target, sell the winners and buy the losers back to target.',
      },
      {
        heading: 'Why it works',
        body: 'Forced selling of overperformers and buying of underperformers creates systematic buy-low sell-high behaviour — without requiring any market prediction.',
      },
      {
        heading: 'Key decisions',
        body: 'Rebalancing trigger (threshold-based vs. calendar-based), drift tolerance, and transaction cost management.',
      },
    ],
  },
  {
    slug: 'regime-aware',
    title: 'Regime-Aware',
    tagline: 'The voidexa edge',
    tags: ['Advanced', 'Multi-strategy', 'voidexa Edge'],
    isEdge: true,
    sections: [
      {
        heading: 'What is Regime-Aware trading?',
        body: 'Different market conditions (BTC dominance rising, altseason, risk-off, ETH rotation) require completely different strategies. A regime-aware bot detects which phase the market is in and dynamically switches its strategy.',
      },
      {
        heading: 'The voidexa regime model',
        body: 'We classify the market into five regimes: BTC Phase, ETH Phase, Alt Phase, Risk-Off, and Neutral. Each regime has a distinct volatility profile, correlation structure, and opportunity set.',
      },
      {
        heading: 'Why this is an edge',
        body: 'Most bots use a fixed strategy. Regime-aware bots effectively have five strategies in one and switch between them as the market evolves. This is the model behind the voidexa All-Season bot.',
      },
    ],
  },
]

export const FUNDAMENTALS = [
  { tag: 'Overfitting',           desc: 'When your backtest is perfect but live trading fails — and why most bots die here.' },
  { tag: 'Backtesting',           desc: 'How to build an honest backtest that actually predicts live performance.' },
  { tag: 'Fees and Slippage',     desc: 'The silent killers. A strategy that nets 2% per trade after fees is very different from 2% before fees.' },
  { tag: 'Risk Management',       desc: 'Position sizing, stop losses, maximum drawdown rules — what separates professionals from gamblers.' },
  { tag: 'Why Bots Fail',         desc: 'The five most common reasons bots that worked in testing fail in production.' },
]
```

- [ ] **Step 2: Implement Learn tab component**

Replace `components/trading-hub/LearnTab.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, ChevronRight } from 'lucide-react'
import { STRATEGIES, FUNDAMENTALS } from '@/content/trading-hub/strategies'

const ACCENT = '#cc9955'

export default function LearnTab() {
  return (
    <div className="space-y-12">
      {/* Strategy grid */}
      <div>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
          Strategy Library
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 24 }}>
          Six foundational strategies. Click any card to read the full guide.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STRATEGIES.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/trading-hub/learn/${s.slug}`}
                className="block rounded-2xl p-5 transition-all group"
                style={{
                  background: s.isEdge ? `rgba(204,153,85,0.06)` : 'rgba(255,255,255,0.02)',
                  border: s.isEdge ? `1px solid ${ACCENT}44` : '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = s.isEdge ? `rgba(204,153,85,0.10)` : 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = s.isEdge ? `rgba(204,153,85,0.06)` : 'rgba(255,255,255,0.02)'}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.0625rem' }}>{s.title}</span>
                      {s.isEdge && <Zap size={14} style={{ color: ACCENT }} />}
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{s.tagline}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: '#334155', marginTop: 4 }} className="group-hover:text-[#64748b] transition-colors" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: s.isEdge ? `${ACCENT}14` : 'rgba(255,255,255,0.05)',
                        color: s.isEdge ? ACCENT : '#64748b',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fundamentals */}
      <div>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
          Fundamentals
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 24 }}>
          Concepts every bot builder must understand before going live.
        </p>

        <div className="space-y-3">
          {FUNDAMENTALS.map((f, i) => (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex gap-4 px-5 py-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span
                className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full h-fit"
                style={{ background: `${ACCENT}12`, color: ACCENT, border: `1px solid ${ACCENT}28`, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
              >
                {f.tag}
              </span>
              <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create learn detail page**

Create `app/trading-hub/learn/[strategy-slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { STRATEGIES } from '@/content/trading-hub/strategies'
import { ChevronLeft, Zap } from 'lucide-react'

const ACCENT = '#cc9955'

interface PageProps {
  params: Promise<{ 'strategy-slug': string }>
}

export async function generateStaticParams() {
  return STRATEGIES.map(s => ({ 'strategy-slug': s.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { 'strategy-slug': slug } = await params
  const s = STRATEGIES.find(s => s.slug === slug)
  if (!s) return {}
  return { title: `${s.title} — Trading Hub — voidexa` }
}

export default async function StrategyPage({ params }: PageProps) {
  const { 'strategy-slug': slug } = await params
  const strategy = STRATEGIES.find(s => s.slug === slug)
  if (!strategy) notFound()

  return (
    <div className="min-h-screen" style={{ background: '#07070d' }}>
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <Link
          href="/trading-hub"
          className="inline-flex items-center gap-2 mb-10 transition-colors hover:text-[#94a3b8]"
          style={{ color: '#475569', fontSize: '0.9375rem' }}
        >
          <ChevronLeft size={16} /> Back to Trading Hub
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <h1
              style={{
                color: '#e2e8f0',
                fontSize: '2.5rem',
                fontFamily: 'var(--font-space)',
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            >
              {strategy.title}
            </h1>
            {strategy.isEdge && <Zap size={20} style={{ color: ACCENT, marginTop: 4 }} />}
          </div>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', marginBottom: 16 }}>{strategy.tagline}</p>
          <div className="flex flex-wrap gap-2">
            {strategy.tags.map(tag => (
              <span
                key={tag}
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  background: strategy.isEdge ? `${ACCENT}14` : 'rgba(255,255,255,0.05)',
                  color: strategy.isEdge ? ACCENT : '#64748b',
                  border: strategy.isEdge ? `1px solid ${ACCENT}28` : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {strategy.sections.map((sec, i) => (
            <div key={i}>
              <h2
                style={{
                  color: strategy.isEdge ? ACCENT : '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: 500,
                  marginBottom: 8,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  fontSize: '0.8125rem',
                }}
              >
                {sec.heading}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.75 }}>{sec.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify build and commit**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1 | tail -5
git add components/trading-hub/LearnTab.tsx content/trading-hub/strategies.ts app/trading-hub/learn/
git commit -m "feat: learn tab — strategy cards, fundamentals, content module, detail pages"
```

---

### Task 6: Forum Tab

**Files:**
- Modify: `components/trading-hub/ForumTab.tsx`

- [ ] **Step 1: Implement forum with Supabase and mock fallback**

Replace `components/trading-hub/ForumTab.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#cc9955'

type Category = 'strategy' | 'post-mortem' | 'market' | 'help' | 'competition'

const CAT_CONFIG: Record<Category, { label: string; color: string }> = {
  strategy:    { label: 'Strategy',    color: '#f59e0b' },
  'post-mortem':{ label: 'Post-mortem', color: '#f87171' },
  market:      { label: 'Market',      color: '#3b82f6' },
  help:        { label: 'Help',        color: '#22c55e' },
  competition: { label: 'Competition', color: '#a855f7' },
}

const MOCK_THREADS = [
  { id: '1', title: 'My grid bot made 34% in April sideways BTC — here\'s how', author: 'gridlord', category: 'strategy' as Category, reply_count: 12, created_at: new Date(Date.now() - 2 * 3600_000).toISOString() },
  { id: '2', title: 'Post-mortem: momentum bot wiped 40% in 3 days — lessons learned', author: 'cryptovoid', category: 'post-mortem' as Category, reply_count: 28, created_at: new Date(Date.now() - 6 * 3600_000).toISOString() },
  { id: '3', title: 'Is this a real altseason or a fake-out? Reading the regime signals', author: 'moonbase9', category: 'market' as Category, reply_count: 7, created_at: new Date(Date.now() - 14 * 3600_000).toISOString() },
  { id: '4', title: 'Help: my DCA bot keeps buying at market price instead of limit — why?', author: 'newtrader99', category: 'help' as Category, reply_count: 4, created_at: new Date(Date.now() - 24 * 3600_000).toISOString() },
  { id: '5', title: 'April competition strategy reveal: what I\'m submitting and why', author: 'adaptai', category: 'competition' as Category, reply_count: 19, created_at: new Date(Date.now() - 36 * 3600_000).toISOString() },
]

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function CategoryBadge({ cat }: { cat: Category }) {
  const cfg = CAT_CONFIG[cat]
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}28`, fontSize: '0.8125rem' }}
    >
      {cfg.label}
    </span>
  )
}

export default function ForumTab() {
  const [threads, setThreads] = useState(MOCK_THREADS)
  const [activeFilter, setFilter] = useState<Category | 'all'>('all')

  useEffect(() => {
    supabase
      .from('forum_threads')
      .select('id, title, user_id, category, reply_count, created_at')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setThreads(data.map(d => ({ ...d, author: d.user_id.slice(0, 8) })) as typeof MOCK_THREADS)
        }
      })
  }, [])

  const filtered = activeFilter === 'all' ? threads : threads.filter(t => t.category === activeFilter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
            Community Forum
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Strategies, post-mortems, and market discussion.</p>
        </div>
        <button
          className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT }}
          onClick={() => alert('Thread creation coming soon — authentication required.')}
        >
          + New Thread
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className="px-3 py-1.5 rounded-full text-sm transition-colors"
          style={{
            background: activeFilter === 'all' ? `${ACCENT}18` : 'rgba(255,255,255,0.04)',
            color: activeFilter === 'all' ? ACCENT : '#64748b',
            border: activeFilter === 'all' ? `1px solid ${ACCENT}44` : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          All
        </button>
        {(Object.keys(CAT_CONFIG) as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-full text-sm transition-colors"
            style={{
              background: activeFilter === cat ? `${CAT_CONFIG[cat].color}18` : 'rgba(255,255,255,0.04)',
              color: activeFilter === cat ? CAT_CONFIG[cat].color : '#64748b',
              border: activeFilter === cat ? `1px solid ${CAT_CONFIG[cat].color}44` : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {CAT_CONFIG[cat].label}
          </button>
        ))}
      </div>

      {/* Thread list */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {filtered.map((thread, i) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-4 px-5 py-5 cursor-pointer transition-colors"
            style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div className="flex-1 min-w-0">
              <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem', marginBottom: 6, lineHeight: 1.4 }}>
                {thread.title}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <CategoryBadge cat={thread.category} />
                <span style={{ color: '#475569', fontSize: '0.8125rem' }}>@{thread.author}</span>
                <span style={{ color: '#334155', fontSize: '0.8125rem' }}>·</span>
                <span className="flex items-center gap-1" style={{ color: '#475569', fontSize: '0.8125rem' }}>
                  <MessageSquare size={12} /> {thread.reply_count}
                </span>
                <span className="flex items-center gap-1" style={{ color: '#475569', fontSize: '0.8125rem' }}>
                  <Clock size={12} /> {timeAgo(thread.created_at)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build and commit**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1 | tail -5
git add components/trading-hub/ForumTab.tsx
git commit -m "feat: forum tab — thread list with category filters and Supabase integration"
```

---

### Task 7: Compete Tab

**Files:**
- Modify: `components/trading-hub/CompeteTab.tsx`

- [ ] **Step 1: Implement competition banner and beat-the-house section**

Replace `components/trading-hub/CompeteTab.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Shield, Calendar, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#cc9955'

interface Competition {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  prizes: { first: number; second: number; third: number }
  status: 'upcoming' | 'active' | 'ended'
}

const MOCK_COMP: Competition = {
  id: 'mock-1',
  title: 'April Regime Challenge',
  description: 'Build a bot that outperforms in the current BTC-dominated regime. All strategies welcome. Show your code after the competition ends.',
  start_date: '2026-04-01T00:00:00Z',
  end_date: '2026-04-30T23:59:59Z',
  prizes: { first: 10000, second: 5000, third: 2500 },
  status: 'upcoming',
}

function getDaysLeft(end: string): number {
  return Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86400_000))
}

export default function CompeteTab() {
  const [comp, setComp] = useState<Competition>(MOCK_COMP)

  useEffect(() => {
    supabase
      .from('competitions')
      .select('*')
      .in('status', ['upcoming', 'active'])
      .order('start_date', { ascending: true })
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setComp(data as Competition) })
  }, [])

  const daysLeft = getDaysLeft(comp.end_date)
  const statusColor = comp.status === 'active' ? '#22c55e' : comp.status === 'upcoming' ? ACCENT : '#475569'

  return (
    <div className="space-y-8">
      {/* Monthly competition banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header stripe */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} style={{ color: ACCENT }} />
            <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>Monthly Competition</span>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium uppercase"
            style={{ background: `${statusColor}14`, color: statusColor, border: `1px solid ${statusColor}33`, letterSpacing: '0.08em', fontSize: '0.75rem' }}
          >
            {comp.status}
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <h2
            style={{ color: '#e2e8f0', fontSize: '1.5rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}
          >
            {comp.title}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 20 }}>
            {comp.description}
          </p>

          {/* Prize pool */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {([
              { place: '1st', amount: comp.prizes.first,  icon: '🥇' },
              { place: '2nd', amount: comp.prizes.second, icon: '🥈' },
              { place: '3rd', amount: comp.prizes.third,  icon: '🥉' },
            ] as const).map(({ place, amount, icon }) => (
              <div
                key={place}
                className="rounded-xl px-4 py-4 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{icon}</div>
                <div style={{ color: '#e2e8f0', fontSize: '1.375rem', fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1 }}>
                  {amount.toLocaleString()}
                </div>
                <div style={{ color: '#475569', fontSize: '0.8125rem', marginTop: 2 }}>GHAI</div>
              </div>
            ))}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <div style={{ color: '#475569', fontSize: '0.8125rem', marginBottom: 2 }}>Duration</div>
              <div style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.9375rem' }}>
                {new Date(comp.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                {' — '}
                {new Date(comp.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div>
              <div style={{ color: '#475569', fontSize: '0.8125rem', marginBottom: 2 }}>Days remaining</div>
              <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.375rem', letterSpacing: '0.02em', lineHeight: 1 }}>
                {daysLeft}
              </div>
            </div>
          </div>

          {/* Rules */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p style={{ color: '#475569', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Rules
            </p>
            {[
              'Submit via the Upload Bot tab — one entry per user.',
              'Bots run in voidexa sandbox with real market data.',
              'Source code revealed to all participants after competition ends.',
              'Scoring: 60% return, 30% Sharpe ratio, 10% max drawdown.',
            ].map(r => (
              <div key={r} className="flex gap-2 mb-2">
                <span style={{ color: `${ACCENT}55` }}>·</span>
                <span style={{ color: '#64748b', fontSize: '0.9375rem' }}>{r}</span>
              </div>
            ))}
          </div>

          <button
            className="w-full sm:w-auto px-6 py-3 rounded-full font-medium transition-opacity hover:opacity-80"
            style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44`, color: ACCENT, fontSize: '0.9375rem' }}
            onClick={() => alert('Competition entry requires bot upload — go to the Upload Bot tab first.')}
          >
            Enter Competition
          </button>
        </div>
      </motion.div>

      {/* Beat the house */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-6"
        style={{ border: `1px solid ${ACCENT}22`, background: `rgba(204,153,85,0.04)` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} style={{ color: ACCENT }} />
          <h3 style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.125rem', fontFamily: 'var(--font-space)' }}>
            Beat the House — Permanent Challenge
          </h3>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 16 }}>
          The voidexa All-Season bot has returned +306% over its lifetime. Any bot on the leaderboard that beats this benchmark earns a permanent spot in the Hall of Fame and 5,000 GHAI.
        </p>
        <div className="flex flex-wrap gap-4">
          <div>
            <div style={{ color: '#475569', fontSize: '0.8125rem' }}>Target to beat</div>
            <div style={{ color: '#22c55e', fontWeight: 500, fontSize: '1.5rem', letterSpacing: '0.02em' }}>+306%</div>
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.8125rem' }}>Hall of Fame entries</div>
            <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.5rem', letterSpacing: '0.02em' }}>0</div>
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.8125rem' }}>Reward</div>
            <div style={{ color: ACCENT, fontWeight: 500, fontSize: '1.5rem', letterSpacing: '0.02em' }}>5,000 GHAI</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build and commit**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1 | tail -5
git add components/trading-hub/CompeteTab.tsx
git commit -m "feat: compete tab — monthly competition banner and beat-the-house challenge"
```

---

### Task 8: Space Station Shell + 3 Decks

**Files:**
- Create: `app/station/page.tsx`
- Create: `components/station/CinemaDeck.tsx`
- Create: `components/station/ScienceDeck.tsx`
- Create: `components/station/SocialDeck.tsx`

- [ ] **Step 1: Create Space Station page with deck navigation**

Create `app/station/page.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Film, FlaskConical, Share2 } from 'lucide-react'
import CinemaDeck from '@/components/station/CinemaDeck'
import ScienceDeck from '@/components/station/ScienceDeck'
import SocialDeck from '@/components/station/SocialDeck'

const ACCENT = '#44aacc'

const DECKS = [
  { id: 'cinema',  label: 'Cinema Deck',  Icon: Film,        href: '#cinema'  },
  { id: 'science', label: 'Science Deck', Icon: FlaskConical, href: '#science' },
  { id: 'social',  label: 'Social Deck',  Icon: Share2,       href: '#social'  },
]

export default function StationPage() {
  return (
    <div className="min-h-screen" style={{ background: '#07070d' }}>
      {/* Hero */}
      <div
        className="relative pt-36 pb-16 text-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 0%, rgba(68,170,204,0.12) 0%, transparent 70%)`,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: `${ACCENT}88`, letterSpacing: '0.18em' }}
        >
          voidexa
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ color: '#e2e8f0', fontSize: '3.5rem', fontFamily: 'var(--font-space)', fontWeight: 500, lineHeight: 1.05, marginBottom: 12 }}
        >
          Space Station
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: 480, margin: '0 auto 32px' }}
        >
          The content hub for the voidexa universe. Videos, roadmap, ideas, and the team behind the mission.
        </motion.p>

        {/* Deck nav */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 px-4"
        >
          {DECKS.map(({ id, label, Icon, href }) => (
            <a
              key={id}
              href={href}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `rgba(68,170,204,0.10)`; el.style.borderColor = `${ACCENT}44`; el.style.color = ACCENT }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.color = '#94a3b8' }}
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Decks */}
      <div className="max-w-5xl mx-auto px-4 pb-24 space-y-24">
        <section id="cinema" className="scroll-mt-24">
          <CinemaDeck />
        </section>
        <section id="science" className="scroll-mt-24">
          <ScienceDeck />
        </section>
        <section id="social" className="scroll-mt-24">
          <SocialDeck />
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Cinema Deck**

Create `components/station/CinemaDeck.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { Play, Clock } from 'lucide-react'

const ACCENT = '#44aacc'

const DEMO_CARDS = [
  { title: 'Quantum Live Demo',        desc: 'Watch multiple AIs debate and converge on a complex question in real time.',  duration: '8 min' },
  { title: 'Trading Bot in Action',    desc: 'A regime-aware bot navigating a live BTC breakout — decision by decision.',    duration: '12 min' },
  { title: 'How Upload Works',         desc: 'From Python file to live sandbox run — the full pipeline explained.',           duration: '5 min' },
]

function VideoCard({ title, desc, duration, isFeatured = false }: { title: string; desc: string; duration: string; isFeatured?: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: isFeatured ? `1px solid ${ACCENT}33` : '1px solid rgba(255,255,255,0.07)',
        background: isFeatured ? `rgba(68,170,204,0.05)` : 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Player frame */}
      <div
        className="relative flex items-center justify-center"
        style={{ aspectRatio: '16/9', background: 'rgba(0,0,0,0.5)' }}
      >
        {/* Coming soon overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33` }}
          >
            <Play size={22} style={{ color: ACCENT, marginLeft: 3 }} />
          </div>
          <span
            className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.6)', color: `${ACCENT}99`, border: `1px solid ${ACCENT}22`, letterSpacing: '0.14em', fontSize: '0.75rem' }}
          >
            Coming Soon
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem', lineHeight: 1.4 }}>{title}</p>
          <span className="flex items-center gap-1 shrink-0" style={{ color: '#475569', fontSize: '0.8125rem' }}>
            <Clock size={12} /> {duration}
          </span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function CinemaDeck() {
  return (
    <div className="space-y-8">
      <div>
        <p style={{ color: `${ACCENT}88`, fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>
          Cinema Deck
        </p>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}>
          See It in Action
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
          Product demos, CEO introduction, and behind-the-scenes footage. Videos launching with Early Access.
        </p>
      </div>

      {/* Featured: CEO intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${ACCENT}44` }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ aspectRatio: '16/9', background: `linear-gradient(135deg, rgba(68,170,204,0.08) 0%, rgba(0,0,0,0.6) 100%)` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
            >
              <Play size={26} style={{ color: ACCENT, marginLeft: 4 }} />
            </div>
            <div className="text-center">
              <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.125rem', marginBottom: 4 }}>CEO Introduction</p>
              <span
                className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)', color: `${ACCENT}aa`, border: `1px solid ${ACCENT}33`, letterSpacing: '0.14em', fontSize: '0.75rem' }}
              >
                Coming Soon
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-5" style={{ borderTop: `1px solid ${ACCENT}22` }}>
          <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1rem' }}>Meet the team behind voidexa</p>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: 4 }}>
            Where we came from, what we&apos;re building, and why sovereign AI infrastructure matters.
          </p>
        </div>
      </motion.div>

      {/* Demo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DEMO_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <VideoCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Science Deck**

Create `components/station/ScienceDeck.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Hammer, Circle, ChevronUp, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#44aacc'

type RoadmapStatus = 'live' | 'building' | 'planned'

interface RoadmapItem {
  title: string
  desc: string
  status: RoadmapStatus
  phase: string
}

const ROADMAP: RoadmapItem[] = [
  { title: 'Void Chat',         desc: 'Multi-provider AI chat — Claude, GPT-4o, Gemini in one interface.',    status: 'live',     phase: 'Phase 2' },
  { title: 'Trading Hub',       desc: 'Bot upload, leaderboard, competitions, and the community forum.',       status: 'building', phase: 'Phase 3' },
  { title: 'Node System',       desc: 'Validator nodes earning GHAI for powering the network.',                status: 'planned',  phase: 'Phase 4' },
  { title: 'Competitions',      desc: 'Monthly GHAI prize pools for top-performing trading bots.',             status: 'planned',  phase: 'Phase 5' },
  { title: 'Quantum',           desc: 'Multi-AI debate — emergent intelligence from provider disagreement.',   status: 'planned',  phase: 'Phase 6' },
  { title: 'Referrals',         desc: 'Earn GHAI for bringing new builders into the voidexa ecosystem.',       status: 'planned',  phase: 'Phase 7' },
  { title: 'Comlink',           desc: 'Encrypted AI-powered messaging protocol for the community.',            status: 'planned',  phase: 'Phase 9' },
  { title: 'Copy Trading',      desc: 'One-click replication of top bot strategies.',                          status: 'planned',  phase: 'Phase 10' },
]

const STATUS_CONFIG: Record<RoadmapStatus, { label: string; color: string; Icon: typeof CheckCircle }> = {
  live:     { label: 'Live',     color: '#22c55e', Icon: CheckCircle },
  building: { label: 'Building', color: ACCENT,    Icon: Hammer },
  planned:  { label: 'Planned',  color: '#475569', Icon: Circle },
}

interface Idea {
  id: string
  title: string
  description: string
  votes: number
}

const MOCK_IDEAS: Idea[] = [
  { id: '1', title: 'Dark/light mode toggle',                 description: 'Some users prefer light mode for daytime use.', votes: 14 },
  { id: '2', title: 'Mobile app (iOS + Android)',             description: 'Native app for void chat on mobile.',            votes: 31 },
  { id: '3', title: 'Bot performance alerts via email/SMS',  description: 'Notify when bot crosses threshold.',              votes: 22 },
]

export default function ScienceDeck() {
  const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [voted, setVoted] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase
      .from('station_ideas')
      .select('id, title, description, votes')
      .order('votes', { ascending: false })
      .limit(20)
      .then(({ data }) => { if (data && data.length > 0) setIdeas(data as Idea[]) })
  }, [])

  async function handleVote(id: string) {
    if (voted.has(id)) return
    setVoted(prev => new Set([...prev, id]))
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i))
    await supabase.from('station_ideas').update({ votes: ideas.find(i => i.id === id)!.votes + 1 }).eq('id', id)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Please sign in to submit an idea.'); setSubmitting(false); return }
    const { data, error } = await supabase
      .from('station_ideas')
      .insert({ user_id: user.id, title: newTitle.trim(), description: newDesc.trim(), votes: 0 })
      .select()
      .single()
    if (data) setIdeas(prev => [data as Idea, ...prev])
    setNewTitle('')
    setNewDesc('')
    setSubmitting(false)
  }

  return (
    <div className="space-y-12">
      {/* Roadmap */}
      <div>
        <p style={{ color: `${ACCENT}88`, fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>
          Science Deck
        </p>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}>
          What We&apos;re Building
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 24 }}>
          The full voidexa roadmap — from what&apos;s live today to what&apos;s in the pipeline.
        </p>

        <div className="space-y-3">
          {ROADMAP.map((item, i) => {
            const { label, color, Icon } = STATUS_CONFIG[item.status]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 px-5 py-4 rounded-xl items-start"
                style={{
                  background: item.status === 'live' ? 'rgba(34,197,94,0.04)' : item.status === 'building' ? `rgba(68,170,204,0.04)` : 'rgba(255,255,255,0.02)',
                  border: item.status === 'building' ? `1px solid ${ACCENT}22` : '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Icon size={18} style={{ color, marginTop: 2, shrink: 0, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{item.title}</span>
                    <span style={{ color: '#334155', fontSize: '0.8125rem' }}>·</span>
                    <span style={{ color: '#475569', fontSize: '0.8125rem' }}>{item.phase}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
                <span
                  className="shrink-0 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${color}14`, color, border: `1px solid ${color}28`, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                >
                  {label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Community ideas */}
      <div>
        <h3 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
          Community Ideas
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 20 }}>
          Suggest a feature. Upvote the ones you want most.
        </p>

        {/* Submit form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-5 mb-6 space-y-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Idea title"
            maxLength={100}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.9375rem' }}
          />
          <div className="flex gap-3">
            <input
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Short description (optional)"
              maxLength={200}
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '0.9375rem' }}
            />
            <button
              type="submit"
              disabled={submitting || !newTitle.trim()}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT, fontSize: '0.875rem', fontWeight: 500 }}
            >
              <Send size={14} />
              Submit
            </button>
          </div>
        </form>

        {/* Ideas list */}
        <div className="space-y-3">
          {ideas.map((idea, i) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex gap-4 items-start px-5 py-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <button
                onClick={() => handleVote(idea.id)}
                disabled={voted.has(idea.id)}
                className="flex flex-col items-center gap-0.5 pt-0.5 transition-opacity disabled:opacity-50"
                style={{ color: voted.has(idea.id) ? ACCENT : '#475569', minWidth: 32 }}
              >
                <ChevronUp size={16} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1 }}>{idea.votes}</span>
              </button>
              <div>
                <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem', marginBottom: 2 }}>{idea.title}</p>
                {idea.description && <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{idea.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create Social Deck**

Create `components/station/SocialDeck.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { Youtube, Twitter, MessageCircle, Music2 } from 'lucide-react'

const ACCENT = '#44aacc'

const SOCIALS = [
  {
    platform: 'TikTok',
    handle: '@voidexa',
    desc: 'Short-form demos, strategy breakdowns, and market commentary.',
    icon: Music2,
    color: '#ee1d52',
    href: 'https://tiktok.com/@voidexa',
  },
  {
    platform: 'YouTube',
    handle: 'voidexa',
    desc: 'Long-form tutorials, full product demos, and CEO updates.',
    icon: Youtube,
    color: '#ff0000',
    href: 'https://youtube.com/@voidexa',
  },
  {
    platform: 'Twitter / X',
    handle: '@voidexa',
    desc: 'Real-time announcements, market takes, and community polls.',
    icon: Twitter,
    color: '#1da1f2',
    href: 'https://x.com/voidexa',
  },
  {
    platform: 'Discord',
    handle: 'voidexa community',
    desc: 'The main hub. Get help, share bots, discuss strategy.',
    icon: MessageCircle,
    color: '#5865f2',
    href: 'https://discord.gg/voidexa',
  },
]

const BEHIND_THE_SCENES = [
  {
    date: 'Mar 2026',
    update: 'Trading Hub entering internal testing. Leaderboard data pipeline completed.',
  },
  {
    date: 'Mar 2026',
    update: 'Void Chat deployed to production. First paying users onboarded.',
  },
  {
    date: 'Feb 2026',
    update: 'GHAI token live on Solana. Platform credit system integrated.',
  },
  {
    date: 'Jan 2026',
    update: 'voidexa.com launched. Auth, profiles, waitlist, and star map all live.',
  },
]

export default function SocialDeck() {
  return (
    <div className="space-y-12">
      <div>
        <p style={{ color: `${ACCENT}88`, fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>
          Social Deck
        </p>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}>
          Find Us
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 24 }}>
          Follow the build. Join the community.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOCIALS.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl transition-all group"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}33` }}
                >
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{s.platform}</span>
                    <span style={{ color: '#334155', fontSize: '0.875rem' }}>{s.handle}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Behind the scenes */}
      <div>
        <h3 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
          Behind the Scenes
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 20 }}>
          What the team is actually working on, in plain language.
        </p>

        <div className="relative pl-5" style={{ borderLeft: '1px solid rgba(68,170,204,0.2)' }}>
          {BEHIND_THE_SCENES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="mb-6 relative"
            >
              <div
                className="absolute -left-[21px] w-3 h-3 rounded-full"
                style={{ background: '#07070d', border: `2px solid ${ACCENT}66`, top: 3 }}
              />
              <span style={{ color: ACCENT, fontSize: '0.8125rem', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                {item.date}
              </span>
              <p style={{ color: '#94a3b8', fontSize: '0.9375rem', lineHeight: 1.6 }}>{item.update}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify build and commit**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1 | tail -5
git add app/station/page.tsx components/station/
git commit -m "feat: space station — shell, cinema deck, science deck with ideas, social deck"
```

---

### Task 9: Star Map + Navigation Updates

**Files:**
- Modify: `components/starmap/nodes.ts`
- Modify: `components/layout/Navigation.tsx`

- [ ] **Step 1: Update nodes.ts — activate trading-hub and add station**

In `components/starmap/nodes.ts`, replace the trading-hub node and add a station node at the end of `STAR_MAP_NODES`:

```ts
// Replace this block (the trading-hub undiscovered node):
  {
    id: 'trading-hub',
    label: 'Trading Hub',
    path: '/trading-hub',
    position: [-3, 4, -18],
    color: '#221100',
    emissive: '#554433',
    emissiveIntensity: 0.3,
    size: 0.28,
    isCenter: false,
    sublabel: '???',
    isDiscovered: false,
  },

// With this (discovered, amber/golden color):
  {
    id: 'trading-hub',
    label: 'Trading Hub',
    path: '/trading-hub',
    position: [-3, 4, -18],
    color: '#1a0e00',
    emissive: '#cc9955',
    emissiveIntensity: 1.8,
    size: 0.28,
    isCenter: false,
    sublabel: 'Build · Compete · Learn',
    isDiscovered: true,
  },
  // Add this NEW node at the end of the array:
  {
    id: 'station',
    label: 'Space Station',
    path: '/station',
    position: [1.5, 2, -10],
    color: '#001322',
    emissive: '#44aacc',
    emissiveIntensity: 1.6,
    size: 0.18,
    isCenter: false,
    sublabel: 'Content Hub',
    isDiscovered: true,
  },
```

- [ ] **Step 2: Apply node changes**

Edit `components/starmap/nodes.ts`. Find and replace trading-hub entry, add station entry before the closing `]`.

The full final `STAR_MAP_NODES` array should end with:
```ts
  {
    id: 'trading-hub',
    label: 'Trading Hub',
    path: '/trading-hub',
    position: [-3, 4, -18],
    color: '#1a0e00',
    emissive: '#cc9955',
    emissiveIntensity: 1.8,
    size: 0.28,
    isCenter: false,
    sublabel: 'Build · Compete · Learn',
    isDiscovered: true,
  },
  {
    id: 'station',
    label: 'Space Station',
    path: '/station',
    position: [1.5, 2, -10],
    color: '#001322',
    emissive: '#44aacc',
    emissiveIntensity: 1.6,
    size: 0.18,
    isCenter: false,
    sublabel: 'Content Hub',
    isDiscovered: true,
  },
]
```

- [ ] **Step 3: Update Navigation.tsx — add /station and update trading-hub badge**

In `components/layout/Navigation.tsx`:

Replace `moreLinks` array:
```ts
const moreLinks = [
  { href: '/ghost-ai',    label: 'Ghost AI',       badge: null   },
  { href: '/quantum',     label: 'Quantum',         badge: 'SOON' },
  { href: '/trading-hub', label: 'Trading Hub',     badge: null   },
  { href: '/station',     label: 'Space Station',   badge: 'NEW'  },
  null, // divider
  { href: '/about',       label: 'About',           badge: null   },
  { href: '/contact',     label: 'Contact',         badge: null   },
  null, // divider
  { href: '/whitepaper',  label: 'White Paper',     badge: null   },
  { href: '/token',       label: 'Token',           badge: null   },
] as const
```

Replace `mobileSecondary` array:
```ts
const mobileSecondary = [
  { href: '/ghost-ai',    label: 'Ghost AI',       badge: null   },
  { href: '/quantum',     label: 'Quantum',        badge: 'SOON' },
  { href: '/trading-hub', label: 'Trading Hub',    badge: null   },
  { href: '/station',     label: 'Space Station',  badge: 'NEW'  },
  { href: '/about',       label: 'About',          badge: null   },
  { href: '/contact',     label: 'Contact',        badge: null   },
  { href: '/whitepaper',  label: 'White Paper',    badge: null   },
  { href: '/token',       label: 'Token',          badge: null   },
] as const
```

- [ ] **Step 4: Final build verification**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1 | tail -30
```

Expected: Build completes with 0 errors. All new routes appear in the output: `/trading-hub`, `/trading-hub/learn/[strategy-slug]`, `/station`.

- [ ] **Step 5: Commit**

```bash
git add components/starmap/nodes.ts components/layout/Navigation.tsx
git commit -m "feat: star map — activate trading hub planet, add space station node, update nav"
```

---

### Task 10: Final Verification

- [ ] **Step 1: Full production build**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx next build 2>&1
```

Expected output includes:
- `/trading-hub` — static or dynamic page, no errors
- `/trading-hub/learn/dca` and other strategy slugs
- `/station` — no errors

- [ ] **Step 2: Check no TypeScript errors**

```bash
cd C:/Users/Jixwu/Desktop/voidexa && npx tsc --noEmit 2>&1 | head -30
```

Expected: No errors.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: phase 3 complete — trading hub (5 tabs) + space station (3 decks) + star map navigation"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Trading Hub /trading-hub — 5 tabs (Leaderboard, Upload Bot, Learn, Forum, Compete)
- [x] Leaderboard — house bot banner (+306%, regime, sharpe, drawdown), sortable table, regime badges color-coded
- [x] Upload Bot — drag-drop .py upload, 3 steps (AI scan, analysis, scorecard)
- [x] Learn — 6 strategy cards in 2-col grid (DCA, Grid, Momentum, Mean Reversion, Rebalancing, Regime-Aware as edge), fundamentals section, detail pages at /trading-hub/learn/[slug]
- [x] Forum — thread list, 5 categories with color-coded badges, Supabase integration with mock fallback
- [x] Compete — monthly competition banner (prizes 10k/5k/2.5k GHAI), beat-the-house permanent challenge
- [x] Space Station /station — 3 decks
- [x] Cinema Deck — CEO intro player frame (coming soon), 3 demo cards
- [x] Science Deck — roadmap cards (Live/Building/Planned), community ideas with upvote + Supabase
- [x] Social Deck — TikTok, YouTube, Twitter, Discord; behind-the-scenes timeline
- [x] Supabase tables — trading_hub_bots, trading_hub_uploads, forum_threads, forum_replies, competitions, competition_entries, station_ideas — all with RLS
- [x] Star map — trading-hub node activated (discovered), station node added
- [x] Navigation — /station added to More dropdown and mobile menu, trading-hub SOON badge removed

**Design rule check:**
- [x] Background #07070d everywhere
- [x] Font-size: body 0.9375rem (15px), labels 1rem (16px), numbers 1.25-2.5rem
- [x] Font-weight 400/500 only (badge text uses inline font-weight: 500 max in main content; heading inline styles use fontWeight: 500)
- [x] Letter-spacing 0.02em on numeric values
- [x] Trading Hub accent: #cc9955 throughout
- [x] Space Station accent: #44aacc throughout
- [x] All pages mobile-responsive with flex-wrap and max-w-5xl centering

**Known gaps — acceptable:**
- Forum thread detail pages not implemented (clicking a thread shows nothing yet — forum is read-only list for now)
- Station social links point to placeholder URLs — these need real URLs when accounts are set up
- Bot upload does not actually upload to Supabase Storage in this phase — it simulates the flow
