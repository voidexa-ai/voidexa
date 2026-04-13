# VOIDEXA STAR SYSTEM — COMPLETE SPECIFICATION
**Version 1.0 — April 13, 2026**
**Sources: Quantum Deep Mode (ecosystem), ChatGPT (visual architecture), Quantum Deep Mode (technical), Claude (prioritization)**

---

## EXECUTIVE SUMMARY

The voidexa star system is a multi-level interactive 3D galaxy where businesses "claim planets" and participate in an interconnected AI-powered economy. It transforms voidexa from a hosting provider into an economic ecosystem where planet ownership creates genuine interdependence, revenue flows, and compounding value.

The system has three layers:
- **Visual Layer** — 3D star map with multi-level navigation (Galaxy → Company System → Page)
- **Economic Layer** — Service Mesh, Gravity Score, GHAI token flows, inter-planet commerce
- **Data Layer** — Supabase tables for planets, services, trade routes, scores

---

## PART 1: ECONOMIC ENGINE (from Quantum)

### 1.1 Core Problem
Planet ownership must be MORE than a website and a name. It must create genuine interdependence where businesses profit from other businesses' growth.

### 1.2 Inter-Planetary Service Mesh
Every planet CAN (not must — voluntary at start) offer API services to other planets via the voidexa infrastructure.

When Planet A's service is used by Planet B:
- Planet A earns 70% in GHAI
- Planet B earns 15% routing fee
- voidexa takes 15%

Examples:
- Planet "HealthAI" offers medical chatbot API
- Planet "EduBot" uses HealthAI's API for medical student features
- Both profit, voidexa takes cut

### 1.3 Gravity Score
Dynamic metric per planet. Determines planet size, visibility, search ranking, and governance weight.

**V1 Formula (simple — use this first):**
```
Gravity Score = transactions_count + active_services_count + (months_in_ecosystem * 10)
```

**V2 Formula (when 20+ planets):**
```
Gravity Score =
  0.35 * trade_activity +
  0.25 * ecosystem_connections +
  0.20 * profile_completeness +
  0.10 * recent_growth +
  0.10 * featured_weight
```

Normalize to 0-100. Clamp visual scale — don't let one planet dominate visually.

### 1.4 GHAI Token Economy
- All inter-planet commerce in GHAI
- Monthly fees in USD with 15% GHAI discount option
- GHAI velocity multiplier: spending within ecosystem = 1.5x credit toward fees
- No second token (no Stardust/SDU — keep it simple)

### 1.5 Pioneer Rewards (tiered)

| Planet # | GHAI Grant | Governance Weight | Featured Placement |
|----------|-----------|-------------------|-------------------|
| 1-10     | 10M       | 2x voting power   | 12 months featured |
| 11-25    | 7M        | 1.5x              | 6 months featured |
| 26-50    | 5M        | 1x                | 3 months featured |
| 51-100   | 3M        | 1x                | Auction only |
| 101+     | 1M        | 1x                | Auction only |

Vesting: 20% immediate, 80% over 18 months. Accelerates if planet hits revenue milestones.

### 1.6 Pioneer Royalties
When a later planet builds a derivative of an earlier planet's public model/service, 2% of derivative revenue flows back to the original pioneer. Creates compounding passive income for early adopters.

### 1.7 Revenue Model for voidexa

| Source | Mechanism | Scales with |
|--------|-----------|-------------|
| Base fees | $50/month × planets | Linear |
| Transaction fees | 7-15% of inter-planet commerce | Quadratic (n²) |
| KCP-90 licensing | 20% of planet resales | Linear, high margin |
| Quantum sessions | Per-session billing | Linear (usage) |
| GHAI appreciation | 200M treasury | Exponential (burn + utility) |

### 1.8 Governance
- Every 10 planets = 1 "constellation" for voting
- Vote on: ecosystem parameters, fee %, new infrastructure priorities
- Vote weight = Gravity Score × Pioneer multiplier
- Jix retains veto as "the sun" (51% override)

### 1.9 What Makes Someone Regret NOT Joining Early
- Financial: 10M vs 1M GHAI grant (if token appreciates 5x = $45k opportunity cost)
- Strategic: Network Authority deficit, reputation gap, governance influence
- Network: Early planets claim key marketplace niches first
- Visibility: Featured placement on star map for 12 months
- Royalties: Pioneer Royalties create permanent passive income stream

---

## PART 2: VISUAL ARCHITECTURE (from ChatGPT)

### 2.1 Multi-Level Hierarchy

**Level 1 — Galaxy View:** All company planets visible as system. voidexa as central sun. Industry constellations/sectors around it. "Claim Your Planet" at distant edge.

**Level 2 — Company System:** Click a company → enter its internal star system. Company becomes mini-sun. Its products/services orbit as planets. Trade routes visible to partner companies.

**Level 3 — Planet Surface:** Click a product planet → navigate to that page. Already exists today.

### 2.2 Anti-Clutter Solution

**Rule: Never show 500 labeled planets at once.**

| Scale | Rendering Strategy |
|-------|-------------------|
| 1-20 planets | All as proper planets, visible labels |
| 20-100 | Sector clustering, labels on focus only |
| 100-500 | Three-layer abstraction: sector → system marker → hero planet |

Maximum simultaneous detail: 8-12 sector constellations, 20-40 highlighted markers, 1 active hero planet.

### 2.3 Planet Rendering Tiers

**Tier A — Hero planets** (voidexa, selected company, Claim Your Planet):
- Actual sphere mesh, glow shell, rim light, animated atmosphere, label card

**Tier B — System markers** (most companies at Level 1):
- Bright billboard sprite, optional tiny sphere at close zoom

**Tier C — Sector stars** (dense clusters):
- Particle/star point, no labels unless focused

### 2.4 Sector Layout
Radial sector map around voidexa:
- AI / Automation
- Logistics / Mobility
- Finance / Trading
- Healthcare / Bio
- Infrastructure / Manufacturing
- Communications / Media
- Energy / Utilities
- Defense / Security

Each sector: subtle nebula tint, icon glyph, count badge, activity pulse.

### 2.5 Transition Design

**Level 1 → Level 2 (warp-lock zoom, ~1.6s):**
1. User clicks company (250ms pulse)
2. Camera eases toward target (400ms)
3. Surrounding systems dim
4. Starfield stretches into warp streaks (300ms)
5. Company name locks center
6. Scene crossfades into company system (400ms)

**Level 2 → Level 1 (reverse, ~1.2s):**
1. Pull back from company sun
2. Service planets collapse into compact light
3. Light rejoins galaxy map at company coordinate
4. Restore previous camera and filters

### 2.6 Trade Routes
- Level 1: Only visible for selected company, selected sector, or filtered
- Aggregate routes by sector-to-sector (faint arcing highways)
- Top 10-20 strongest highways visible globally
- Level 2: Full company routes visible with animated packets

### 2.7 "Claim Your Planet" CTA
- Mythic edge-system at galaxy boundary
- Iridescent violet/cyan glow, black core, faint beacon ring
- Click → approach animation → modal with benefits/examples/CTA buttons
- NOT a normal button — part of the universe's lore

### 2.8 Search / Directory
- Global search: company, service, industry, tag, Gravity Score, activity
- Results: Highlight on map / Fly to / Enter system / View profile
- Persistent toggle: Visual Map ⇄ Directory View
- Directory fully usable without 3D (accessibility)

### 2.9 Mobile
- Top half: simplified 3D map
- Bottom sheet: searchable directory + context actions
- Fewer labels, no persistent routes
- Tap to select, second tap to enter
- One-finger drag orbit, pinch zoom

---

## PART 3: DATA MODEL (merged, Supabase)

### 3.1 companies
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  industry_id UUID REFERENCES industries(id),
  brand_color TEXT DEFAULT '#4a9eff',
  logo_url TEXT,
  planet_texture_url TEXT,
  status TEXT DEFAULT 'active', -- active, hidden, pending
  claimed_at TIMESTAMPTZ,
  claimed_by UUID REFERENCES auth.users(id),
  gravity_score NUMERIC DEFAULT 0,
  trade_score NUMERIC DEFAULT 0,
  activity_score NUMERIC DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  is_voidexa BOOLEAN DEFAULT FALSE,
  is_claim_cta BOOLEAN DEFAULT FALSE,
  galaxy_x NUMERIC,
  galaxy_y NUMERIC,
  galaxy_z NUMERIC,
  sector_id UUID REFERENCES sectors(id),
  orbital_shell INTEGER DEFAULT 2, -- 1=inner, 2=mid, 3=outer
  size_tier TEXT DEFAULT 'standard', -- small, standard, major, legendary
  pioneer_tier INTEGER, -- 1=first 10, 2=11-25, 3=26-50, 4=51-100, 5=101+
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 industries
```sql
CREATE TABLE industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0
);
```

### 3.3 sectors
```sql
CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  industry_id UUID REFERENCES industries(id),
  color TEXT,
  nebula_style TEXT,
  anchor_x NUMERIC,
  anchor_y NUMERIC,
  anchor_z NUMERIC,
  radius NUMERIC
);
```

### 3.4 company_services (Level 2 planets)
```sql
CREATE TABLE company_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  page_url TEXT,
  service_type TEXT, -- product, page, service, app, api, docs
  orbit_index INT DEFAULT 0,
  orbit_radius NUMERIC,
  orbit_speed NUMERIC,
  planet_size NUMERIC DEFAULT 1,
  color TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  is_api_endpoint BOOLEAN DEFAULT FALSE, -- available in Service Mesh
  api_price_ghai NUMERIC, -- price per call in GHAI
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5 trade_routes
```sql
CREATE TABLE trade_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  target_company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  route_type TEXT, -- supplier, partner, integration, marketplace
  trade_volume NUMERIC DEFAULT 0,
  activity_7d NUMERIC DEFAULT 0,
  activity_30d NUMERIC DEFAULT 0,
  ghai_volume NUMERIC DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_company_id, target_company_id)
);
```

### 3.6 gravity_score_snapshots
```sql
CREATE TABLE gravity_score_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  trade_score NUMERIC,
  activity_score NUMERIC,
  reputation_score NUMERIC,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.7 gravity_events
```sql
CREATE TABLE gravity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_planet_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- trade_completed, service_used, upvote, visit
  gravity_delta INTEGER,
  related_company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update gravity_score
CREATE OR REPLACE FUNCTION update_gravity_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE companies
  SET gravity_score = (
    SELECT COALESCE(SUM(gravity_delta), 0)
    FROM gravity_events
    WHERE company_planet_id = NEW.company_planet_id
  )
  WHERE id = NEW.company_planet_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gravity_score_update
AFTER INSERT ON gravity_events
FOR EACH ROW EXECUTE FUNCTION update_gravity_score();
```

### 3.8 planet_claim_leads
```sql
CREATE TABLE planet_claim_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  contact_name TEXT,
  email TEXT,
  website TEXT,
  industry TEXT,
  message TEXT,
  source TEXT DEFAULT 'claim_your_planet',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.9 company_tags
```sql
CREATE TABLE company_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);
```

---

## PART 4: COMPONENT HIERARCHY (React + Three.js)

```
StarMapApp
├── StarMapShell
│   ├── TopNav
│   ├── SearchCommandBar
│   ├── FilterToolbar
│   ├── KCP90Terminal
│   ├── DirectoryDrawer
│   └── ViewModeToggle (Visual Map ⇄ Directory)
│
├── StarMapScene
│   ├── SceneController
│   ├── CameraController
│   ├── TransitionController
│   ├── PostProcessingController
│   │
│   ├── GalaxyScene (Level 1)
│   │   ├── BackgroundNebula
│   │   ├── Starfield
│   │   ├── VoidexaSunNode
│   │   ├── SectorLayer
│   │   │   ├── SectorHalo
│   │   │   ├── SectorLabel
│   │   │   └── SectorParticleCloud
│   │   ├── CompanyMarkerLayer
│   │   │   ├── CompanyMarker (Tier B/C)
│   │   │   └── CompanyHeroPlanet (Tier A)
│   │   ├── AggregatedTradeRouteLayer
│   │   └── ClaimPlanetNode
│   │
│   ├── CompanySystemScene (Level 2)
│   │   ├── CompanySunNode
│   │   ├── ServiceOrbitLayer
│   │   │   ├── OrbitRing
│   │   │   └── ServicePlanetNode
│   │   ├── CompanyTradeRoutesLayer
│   │   ├── LinkedCompanyEdgeMarkers
│   │   └── BackToGalaxyControl
│   │
│   └── NavigationEffects
│       ├── WarpTunnelFX
│       ├── SelectionPulseFX
│       └── LensDistortionFX
│
└── State (Zustand)
    ├── mapStore (level, camera, selection)
    ├── filtersStore (industry, score range, search)
    ├── selectionStore (focused planet, hovered)
    ├── transitionStore (animating, target)
    └── dataCache (companies, services, routes)
```

---

## PART 5: TECHNICAL IMPLEMENTATION

### 5.1 Migration Strategy
Current voidexa star map becomes Level 2 for voidexa. Do NOT rebuild from zero.

**Phase 1:** Refactor current map into reusable `CompanySystemScene(companyId)`.
**Phase 2:** Create new `GalaxyScene` as parent level.
**Phase 3:** Extract shared controllers (camera, raycasting, labels, glow materials).

### 5.2 Scene Composition
Single Three.js renderer, single app shell. Scene manager swaps active scene groups.
```
RootScene
├── persistent background layer
├── persistent starfield
├── galaxyGroup (Level 1)
└── companySystemGroup (Level 2)
```
Crossfade/animate visibility instead of destroying scenes.

### 5.3 Performance (500+ planets)
- `InstancedMesh` for distant company markers (single draw call)
- Frustum culling for off-screen planets
- LOD tiers: far=point/sprite, mid=glow marker, near=full mesh
- Labels: HTML/CSS overlays only for hovered/selected/searched
- Route lines: buffered geometry, only visible/relevant routes
- Lazy-load company system data only when entered

### 5.4 Spatial Distribution
Logarithmic spiral arms with industry clustering:
```javascript
const spiralArms = 8; // industry sectors
const armIndex = planet.industryId % spiralArms;
const theta = (armIndex * Math.PI * 2 / spiralArms) + (planet.indexInIndustry * 0.1);
const radius = 50 + (planet.indexInIndustry * 2.5);
const x = radius * Math.cos(theta);
const z = radius * Math.sin(theta);
const y = (Math.random() - 0.5) * 5;
```

Alternative: Fibonacci golden spiral for even packing.

---

## PART 6: BUILD PHASES

### Phase 1 — Architecture (build now)
- Extract current voidexa star map into reusable CompanySystemScene
- Centralize state with Zustand
- Preserve current navigation behavior
- Supabase tables created (all from Part 3)

### Phase 2 — Galaxy View MVP (build now)
- Render voidexa center sun
- Render sectors with nebula tints
- Render company markers (start with voidexa's own products as "inner system")
- Claim Your Planet node at edge
- Selection + focus + search
- Directory/list view toggle

### Phase 3 — Drill-down transitions (build now)
- Warp-lock animation Level 1 → Level 2
- Back-to-galaxy state restore
- Camera memory

### Phase 4 — Planet claiming flow (build now)
- Claim Your Planet click → approach animation → modal
- Claim form → Supabase insert
- Manual onboarding for first 10 planets (Jix personally)
- Planet appears in galaxy after approval

### Phase 5 — Service Mesh v0.1 (enable at 5+ planets)
- Gravity Wells marketplace page
- Planets list services offered
- GHAI payment for inter-planet API calls
- voidexa takes 7-15% cut
- Manual invoicing acceptable for v0.1

### Phase 6 — Gravity Score live (enable at 10+ planets)
- Score calculated from transactions + services + tenure
- Planet size in star map reflects score
- KCP-90 terminal shows score data
- Leaderboard in directory view

### Phase 7 — Trade routes visual (enable at 10+ planets with real trades)
- Animated lines between trading planets
- Pulse intensity = trade volume
- Aggregated sector routes at galaxy level
- Detailed routes at company level

### Phase 8 — Governance (enable at 20+ planets)
- Quarterly votes on ecosystem parameters
- Vote weight = Gravity Score × Pioneer multiplier
- Constellation groupings for voting blocks
- Jix veto power as "the sun"

### Phase 9 — Pioneer Royalties (enable at 20+ planets)
- Auto-route 2% of derivative service revenue to original pioneer
- Dashboard showing passive income streams
- Incentivizes early planets to create foundational tools

### Phase 10 — Advanced features (enable at 50+ planets)
- Quantum staking (planets run Quantum nodes)
- KCP-90 white-label licensing for planets
- Orbital Slot auctions (featured placement)
- Resource credit trading marketplace

---

## PART 7: NON-NEGOTIABLE DESIGN RULES

1. Never show 500 labeled planets at once
2. Only selected or nearby systems become full 3D planets
3. Trade route lines are contextual, not always-on
4. Search and list navigation are first-class, not fallback
5. Current voidexa star map is preserved as Level 2 for voidexa
6. Mobile prioritizes search/list over raw 3D precision
7. All commerce in GHAI — no second token
8. Service Mesh is voluntary, not mandatory
9. First 10 planets onboarded personally by Jix
10. Build everything now, enable features based on planet count thresholds

---

## PART 8: REVENUE PROJECTIONS

| Planets | Base Fees | Transaction Fees | KCP-90 | Quantum | Total/month |
|---------|-----------|-----------------|--------|---------|-------------|
| 10      | $500      | ~$500           | $200   | $300    | ~$1,500     |
| 50      | $2,500    | ~$5,000         | $1,000 | $1,500  | ~$10,000    |
| 100     | $5,000    | ~$15,000        | $2,000 | $3,000  | ~$25,000    |
| 500     | $25,000   | ~$125,000       | $10,000| $20,000 | ~$180,000   |

GHAI treasury (200M) appreciation potential: $0.01 = $2M, $0.10 = $20M, $0.50 = $100M.
