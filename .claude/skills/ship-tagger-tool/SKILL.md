---
name: ship-tagger-tool
description: Build an internal admin tool at /admin/ship-tagger that renders all ship models in a grid with live 3D previews, and lets the CEO tag each one with tier (Free/Achievement/Paid Medium/Paid High/Legendary), role (Scout/Fighter/Tank/Striker/Capital/Explorer), suggested price in USD + GHAI, achievement requirement, and notes. Saves to lib/data/shipTagging.json which becomes source of truth for future pricing migration. Use when the user needs to visually review all ship models at once to make pricing/tiering decisions, or when building admin tools for ship catalog management.
---

# Ship Tagger Internal Admin Tool

## Goal
CEO needs to see every ship model rendered as a 3D preview, then tag each with tier/role/price/achievement. Text descriptions + shipTiers.ts are insufficient because ship visual coolness drives pricing decisions. Show them, tag them, save decisions.

## Architecture

```
/admin/ship-tagger (new page)
├── Grid layout: 3 columns × N rows of ShipTagCard components
├── Each card shows:
│   ├── Live 3D preview (react-three-fiber + the ship .glb)
│   ├── Ship name + model ID
│   ├── Current tier badge (if already tagged)
│   ├── Tag controls:
│   │   ├── Tier radio: Free / Achievement / Paid Medium / Paid High / Legendary
│   │   ├── Role dropdown: Scout / Fighter / Tank / Striker / Capital / Explorer
│   │   ├── Price USD input (auto-fills suggested from tier)
│   │   ├── Price GHAI input (auto-calculates from USD × 100)
│   │   ├── Achievement requirement input (only shown if tier = Achievement)
│   │   └── Notes textarea
│   └── Save button (saves to JSON file via API route)
├── Filters at top: show only untagged, only starter candidates, by manufacturer
├── Summary bar at bottom: "12/62 tagged — 3 Free, 5 Achievement, 4 Paid"
└── Export button: downloads current shipTagging.json
```

## Suggested Tier Defaults (for the auto-fill)

Based on Fortnite + Elite Dangerous benchmarking:

| Tier | Suggested USD | Suggested GHAI | Example Fortnite equiv |
|------|---------------|----------------|------------------------|
| Free | $0 | 0 | Default skin |
| Achievement | $0 (locked) | 0 (locked) | Battle Pass tier reward |
| Paid Medium | $12 | 1,200 | Rare skin |
| Paid High | $20 | 2,000 | Legendary skin |
| Legendary | $30 | 3,000 | Premium bundle |

These are SUGGESTIONS that auto-fill when tier is selected. Jix can override per ship.

Note: Elite Dangerous has only ONE free starter (Sidewinder). Per Jix's latest direction, that's the model — Bob is the only Free ship. AstroEagle/CosmicShark which currently have STARTER badge must be retaggable.

## Implementation

### 1. Data model — `lib/data/shipTagging.json`

```json
{
  "version": 1,
  "lastUpdated": "2026-04-16T12:00:00Z",
  "ships": {
    "qs_bob": {
      "tier": "free",
      "role": "scout",
      "priceUSD": 0,
      "priceGHAI": 0,
      "achievementId": null,
      "notes": "Default starter. Balanced stats. Reliable rookie frame."
    },
    "qs_challenger": {
      "tier": null,
      "role": null,
      "priceUSD": null,
      "priceGHAI": null,
      "achievementId": null,
      "notes": ""
    }
  }
}
```

Start with an empty object `{}` and fill in as Jix tags.

### 2. Types — `lib/data/shipTagging.ts`

```typescript
export type ShipTier = 'free' | 'achievement' | 'paid-medium' | 'paid-high' | 'legendary';
export type ShipRole = 'scout' | 'fighter' | 'tank' | 'striker' | 'capital' | 'explorer';

export type ShipTag = {
  tier: ShipTier | null;
  role: ShipRole | null;
  priceUSD: number | null;
  priceGHAI: number | null;
  achievementId: string | null;
  notes: string;
};

export type ShipTaggingFile = {
  version: number;
  lastUpdated: string;
  ships: Record<string, ShipTag>;
};

export const TIER_DEFAULTS: Record<ShipTier, { priceUSD: number; priceGHAI: number }> = {
  'free': { priceUSD: 0, priceGHAI: 0 },
  'achievement': { priceUSD: 0, priceGHAI: 0 },
  'paid-medium': { priceUSD: 12, priceGHAI: 1200 },
  'paid-high': { priceUSD: 20, priceGHAI: 2000 },
  'legendary': { priceUSD: 30, priceGHAI: 3000 },
};

export const TIER_LABELS: Record<ShipTier, string> = {
  'free': 'Free',
  'achievement': 'Achievement',
  'paid-medium': 'Paid — Medium',
  'paid-high': 'Paid — High',
  'legendary': 'Legendary',
};

export const ROLE_LABELS: Record<ShipRole, string> = {
  'scout': 'Scout (agile, fragile)',
  'fighter': 'Fighter (balanced combat)',
  'tank': 'Tank (heavy hull, slow)',
  'striker': 'Striker (high damage, medium speed)',
  'capital': 'Capital (massive, slow, expensive to run)',
  'explorer': 'Explorer (long-range, cargo)',
};
```

### 3. Page — `app/admin/ship-tagger/page.tsx`

Wrap in simple admin check. If voidexa already has admin middleware, use that. Otherwise just rely on the unlinked /admin/ route being security-through-obscurity for now (document this limitation).

```tsx
import { ShipTaggerClient } from './ShipTaggerClient';

export const metadata = {
  title: 'Ship Tagger — voidexa Admin',
  robots: { index: false, follow: false },  // Never indexed
};

export default function ShipTaggerPage() {
  return <ShipTaggerClient />;
}
```

### 4. Client component — `app/admin/ship-tagger/ShipTaggerClient.tsx`

Load the ship list from existing `MODEL_URLS` in lib/data/models.ts (or wherever the 62 ship types are defined). For each ship, render a ShipTagCard.

```tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { MODEL_URLS } from '@/lib/data/models'; // or wherever ships live
import { TIER_DEFAULTS, TIER_LABELS, ROLE_LABELS, type ShipTag, type ShipTier, type ShipRole } from '@/lib/data/shipTagging';

export function ShipTaggerClient() {
  const [tags, setTags] = useState<Record<string, ShipTag>>({});
  const [filter, setFilter] = useState<'all' | 'untagged' | 'free' | 'achievement' | 'paid'>('all');
  const [loading, setLoading] = useState(true);

  // Load existing tags
  useEffect(() => {
    fetch('/api/admin/ship-tags')
      .then(r => r.json())
      .then(data => { setTags(data.ships || {}); setLoading(false); });
  }, []);

  const shipIds = Object.keys(MODEL_URLS).filter(k => k.startsWith('qs_') || k.startsWith('usc_') || k.startsWith('hirez_ship')); // whatever pattern identifies ships

  const visibleShips = shipIds.filter(id => {
    if (filter === 'untagged') return !tags[id]?.tier;
    if (filter === 'free') return tags[id]?.tier === 'free';
    if (filter === 'achievement') return tags[id]?.tier === 'achievement';
    if (filter === 'paid') return tags[id]?.tier?.startsWith('paid') || tags[id]?.tier === 'legendary';
    return true;
  });

  const updateTag = (shipId: string, patch: Partial<ShipTag>) => {
    const next = { ...tags[shipId], ...patch } as ShipTag;
    // Auto-fill price when tier changes
    if (patch.tier && (!tags[shipId]?.priceUSD || tags[shipId]?.priceUSD === TIER_DEFAULTS[tags[shipId]?.tier]?.priceUSD)) {
      next.priceUSD = TIER_DEFAULTS[patch.tier].priceUSD;
      next.priceGHAI = TIER_DEFAULTS[patch.tier].priceGHAI;
    }
    setTags(prev => ({ ...prev, [shipId]: next }));
    // Auto-save debounced
    fetch('/api/admin/ship-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipId, tag: next })
    });
  };

  // Stats
  const taggedCount = Object.values(tags).filter(t => t?.tier).length;
  const tierCounts = {
    free: Object.values(tags).filter(t => t?.tier === 'free').length,
    achievement: Object.values(tags).filter(t => t?.tier === 'achievement').length,
    paidMedium: Object.values(tags).filter(t => t?.tier === 'paid-medium').length,
    paidHigh: Object.values(tags).filter(t => t?.tier === 'paid-high').length,
    legendary: Object.values(tags).filter(t => t?.tier === 'legendary').length,
  };

  if (loading) return <div style={{padding:40}}>Loading ship catalog...</div>;

  return (
    <div style={{minHeight:'100vh', background:'#0a0a0f', color:'#e2e8f0', padding:'20px'}}>
      <header style={{marginBottom:20}}>
        <h1 style={{fontSize:28, fontFamily:'monospace'}}>SHIP TAGGER · ADMIN</h1>
        <p style={{opacity:0.7, fontSize:14}}>Tag each ship with tier, role, price. Auto-saved.</p>
      </header>

      {/* Filter bar */}
      <div style={{display:'flex', gap:8, marginBottom:20, flexWrap:'wrap'}}>
        {(['all','untagged','free','achievement','paid'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{padding:'8px 16px', background: filter===f?'#00d4ff':'#1a1a24', color: filter===f?'#000':'#e2e8f0', border:'1px solid #2a2a3a', cursor:'pointer', fontFamily:'monospace', fontSize:14}}>
            {f.toUpperCase()} {f==='all' && `(${shipIds.length})`}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{padding:12, background:'#12121a', border:'1px solid #2a2a3a', marginBottom:20, fontSize:14, fontFamily:'monospace'}}>
        Tagged: {taggedCount}/{shipIds.length} · 
        Free: {tierCounts.free} · 
        Achievement: {tierCounts.achievement} · 
        Paid Medium: {tierCounts.paidMedium} · 
        Paid High: {tierCounts.paidHigh} · 
        Legendary: {tierCounts.legendary}
      </div>

      {/* Grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(380px, 1fr))', gap:20}}>
        {visibleShips.map(shipId => (
          <ShipTagCard 
            key={shipId}
            shipId={shipId}
            modelUrl={MODEL_URLS[shipId]}
            tag={tags[shipId]}
            onChange={(patch) => updateTag(shipId, patch)}
          />
        ))}
      </div>

      {/* Export */}
      <div style={{marginTop:40, textAlign:'center'}}>
        <button onClick={async () => {
          const res = await fetch('/api/admin/ship-tags');
          const data = await res.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'shipTagging.json'; a.click();
        }} style={{padding:'12px 24px', background:'#00d4ff', color:'#000', border:'none', cursor:'pointer', fontFamily:'monospace'}}>
          EXPORT shipTagging.json
        </button>
      </div>
    </div>
  );
}

function ShipTagCard({ shipId, modelUrl, tag, onChange }: {
  shipId: string;
  modelUrl: string;
  tag: ShipTag | undefined;
  onChange: (patch: Partial<ShipTag>) => void;
}) {
  const t = tag ?? {} as Partial<ShipTag>;
  
  return (
    <div style={{background:'#12121a', border:`1px solid ${t.tier ? '#00d4ff' : '#2a2a3a'}`, padding:16}}>
      {/* 3D Preview */}
      <div style={{height:220, background:'#0a0a0f', marginBottom:12, border:'1px solid #1a1a24'}}>
        <Canvas camera={{ position: [0, 0, 4], fov: 35 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, -3, -3]} intensity={0.5} color="#00d4ff" />
          <Suspense fallback={null}>
            <ShipModel url={modelUrl} />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1.5} enableZoom={true} />
        </Canvas>
      </div>

      {/* Ship ID + tier badge */}
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12, fontFamily:'monospace'}}>
        <span style={{fontSize:16, fontWeight:'bold'}}>{shipId}</span>
        {t.tier && <span style={{fontSize:12, padding:'4px 8px', background:'#00d4ff', color:'#000'}}>{TIER_LABELS[t.tier]}</span>}
      </div>

      {/* Tier radios */}
      <div style={{marginBottom:10}}>
        <label style={{fontSize:12, opacity:0.7, fontFamily:'monospace'}}>TIER</label>
        <div style={{display:'flex', gap:4, flexWrap:'wrap', marginTop:4}}>
          {(Object.keys(TIER_LABELS) as ShipTier[]).map(tier => (
            <button key={tier} onClick={() => onChange({ tier })}
              style={{padding:'4px 8px', background: t.tier===tier?'#00d4ff':'#1a1a24', color: t.tier===tier?'#000':'#e2e8f0', border:'1px solid #2a2a3a', cursor:'pointer', fontSize:11, fontFamily:'monospace'}}>
              {TIER_LABELS[tier]}
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <div style={{marginBottom:10}}>
        <label style={{fontSize:12, opacity:0.7, fontFamily:'monospace'}}>ROLE</label>
        <select value={t.role || ''} onChange={(e) => onChange({ role: e.target.value as ShipRole })}
          style={{width:'100%', padding:6, background:'#1a1a24', color:'#e2e8f0', border:'1px solid #2a2a3a', fontFamily:'monospace', fontSize:12}}>
          <option value="">— Choose role —</option>
          {(Object.keys(ROLE_LABELS) as ShipRole[]).map(r => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10}}>
        <div>
          <label style={{fontSize:12, opacity:0.7, fontFamily:'monospace'}}>USD</label>
          <input type="number" value={t.priceUSD ?? ''} onChange={(e) => {
            const usd = parseFloat(e.target.value) || 0;
            onChange({ priceUSD: usd, priceGHAI: usd * 100 });
          }} style={{width:'100%', padding:6, background:'#1a1a24', color:'#e2e8f0', border:'1px solid #2a2a3a', fontFamily:'monospace', fontSize:12}} />
        </div>
        <div>
          <label style={{fontSize:12, opacity:0.7, fontFamily:'monospace'}}>GHAI</label>
          <input type="number" value={t.priceGHAI ?? ''} onChange={(e) => onChange({ priceGHAI: parseInt(e.target.value) || 0 })}
            style={{width:'100%', padding:6, background:'#1a1a24', color:'#e2e8f0', border:'1px solid #2a2a3a', fontFamily:'monospace', fontSize:12}} />
        </div>
      </div>

      {/* Achievement ID (only if tier is achievement) */}
      {t.tier === 'achievement' && (
        <div style={{marginBottom:10}}>
          <label style={{fontSize:12, opacity:0.7, fontFamily:'monospace'}}>ACHIEVEMENT REQUIREMENT</label>
          <input type="text" value={t.achievementId || ''} onChange={(e) => onChange({ achievementId: e.target.value })}
            placeholder="e.g. complete_5_docks, reach_rank_3"
            style={{width:'100%', padding:6, background:'#1a1a24', color:'#e2e8f0', border:'1px solid #2a2a3a', fontFamily:'monospace', fontSize:12}} />
        </div>
      )}

      {/* Notes */}
      <div>
        <label style={{fontSize:12, opacity:0.7, fontFamily:'monospace'}}>NOTES</label>
        <textarea value={t.notes || ''} onChange={(e) => onChange({ notes: e.target.value })}
          rows={2}
          placeholder="Visual description, balance concerns, why this tier..."
          style={{width:'100%', padding:6, background:'#1a1a24', color:'#e2e8f0', border:'1px solid #2a2a3a', fontFamily:'monospace', fontSize:11}} />
      </div>
    </div>
  );
}

function ShipModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.01} />;  // Tune scale per model family
}
```

### 5. API route — `app/api/admin/ship-tags/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'lib/data/shipTagging.json');

async function loadFile() {
  try {
    const raw = await fs.readFile(FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { version: 1, lastUpdated: new Date().toISOString(), ships: {} };
  }
}

export async function GET() {
  const data = await loadFile();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { shipId, tag } = await req.json();
  const data = await loadFile();
  data.ships[shipId] = tag;
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}
```

**⚠️ Security note:** This API route has no auth. Document this in a comment. Since /admin isn't linked in nav and deployment is private-ish, it's acceptable for an internal tool, but ADD A BASIC AUTH CHECK — e.g. check for an `ADMIN_SECRET` env var in the header:

```typescript
const ADMIN_SECRET = process.env.ADMIN_SECRET;
export async function POST(req: NextRequest) {
  const auth = req.headers.get('x-admin-secret');
  if (!ADMIN_SECRET || auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... rest
}
```

And from the client, pass the secret (stored in localStorage after Jix enters it once). Simple gate but blocks random browsers.

### 6. Initial JSON — `lib/data/shipTagging.json`

Create with empty ships. Jix fills it by tagging.

```json
{
  "version": 1,
  "lastUpdated": "2026-04-16T12:00:00Z",
  "ships": {}
}
```

## Build Order

1. Git backup: `git add -A && git commit -m "backup before ship tagger tool" --allow-empty`
2. Create lib/data/shipTagging.ts (types + constants)
3. Create lib/data/shipTagging.json (empty initial)
4. Create app/admin/ship-tagger/page.tsx + ShipTaggerClient.tsx
5. Create app/api/admin/ship-tags/route.ts (with ADMIN_SECRET gate)
6. Add ADMIN_SECRET to Vercel env vars (generate random string, set same in .env.local for dev)
7. Build: `npx next build` must pass
8. Commit + deploy: `git push origin main`
9. Document usage for Jix in build report: URL, how to auth, how tagging flows

## Success Criteria

- Jix can visit voidexa.com/admin/ship-tagger
- Page renders all 62 ship types (or however many .glb files exist for ships) in a grid
- Each card has a rotating 3D preview of the ship
- Jix can click tier, select role, see auto-filled price, adjust, add notes
- Changes auto-save to lib/data/shipTagging.json via API
- Export button downloads current JSON for git commit
- Filter bar lets him focus on untagged ships
- Stats bar shows counts per tier

## What NOT to Do

- Do NOT replace shipTiers.ts yet — that's the next SKILL after tagging is complete
- Do NOT replace ShipPicker.tsx STARTER badge logic yet
- Do NOT modify any existing public-facing pages
- Do NOT link /admin in main nav
- Do NOT use localStorage for the tag data (use the JSON file via API — multi-session persistent)
- Do NOT block Jix behind a full auth system — basic ADMIN_SECRET header is enough for now

## Follow-Up (for LATER SKILL)

Once shipTagging.json is populated with decisions, a follow-up SKILL will:
1. Generate new shipTiers.ts from shipTagging.json
2. Rebuild ShipPicker.tsx to show correct locks/prices based on tags
3. Add locked-ship preview (show 3D model + unlock path instead of redirecting to shop)
4. Update shop prices from ship tags
5. Wire achievement unlocks from achievementId field
6. Improve shop 3D camera default zoom

## Report Back

1. URL Jix should visit
2. ADMIN_SECRET value (show it once, Jix saves it)
3. How to authenticate from browser (paste secret into localStorage key, e.g. `localStorage.setItem('admin_secret', 'xxx')`)
4. Number of ships detected and rendered
5. Build + deploy confirmation
