# AFS-10 — Starmap Level 2 Repair (Planet Ecosystem Lockdown)

**Sprint type:** Multi-task feature build (estimated 1-2 sessions)
**Priority:** P1 — Flagged important by Jix
**Depends on:** None (all decisions locked SLUT 21)
**Parallel-safe with:** AFS-MICRO-FIX-2 (test count drift)

---

## SCOPE (LOCKED — DO NOT EXPAND)

Complete Starmap Level 2 ecosystem repair:

1. Wire 12 planet PNG textures to Three.js scene (currently 0 wired)
2. Fix Level 2 label-clustering (planeter klumpet i midten)
3. Rebuild Space Station node from flat 2D diamond → 3D node m/ orbital ring
4. Fix default camera zoom (voidexa-sun ~6% viewport → ~25-35%)
5. Star renderer distinct from nebula (additive blending, point material)
6. Build `/quantum` landing page (3-card layout)
7. Rename current `/quantum` → `/quantum/chat` (Quantum Council)
8. Build `/trading-hub` merged platform (6 sektioner grid)
9. Build `/game-hub` MVP platform (6 sektioner)
10. Add 308 redirects: `/space-station` → `/station`, `/tools` → `/ai-tools`, `/ai-trading` → `/trading-hub`
11. Wire `/station` to existing ScienceDeck component (planet → Space Station node)

**OUT OF SCOPE (do NOT touch):**
- `/station`, `/ai-tools`, `/quantum/chat` already exist — verify only, do not rebuild
- DK ruter (i18n rebuild = AFS-26)
- Galaxy view (Level 1) — only Level 2 fixes
- Free Flight (BUG-04 separate sprint AFS-9)
- Test count drift (separate sprint AFS-MICRO-FIX-2 — should ship FIRST)

---

## LOCKED DECISIONS (REFERENCE — DO NOT RE-DEBATE)

### Planet mapping (12 textures, 10 nodes, 2 reserved)

| # | Node | Texture | Route |
|---|---|---|---|
| 1 | voidexa sun | `voidexa.png` | `/` |
| 2 | Space Station | `spacestation_planet.png` | `/station` (EXISTS) |
| 3 | Apps | `pink.png` | `/apps` |
| 4 | Quantum (samlet) | `saturen_like_rings.png` | `/quantum` (NEW landing) |
| 5 | Trading (samlet) | `icy_blue.png` | `/trading-hub` (NEW merged) |
| 6 | Services | `lilla.png` | `/services` |
| 7 | Game Hub | `red_rocky.png` | `/game-hub` (NEW) |
| 8 | AI Tools | `earth.png` | `/ai-tools` (EXISTS) |
| 9 | Contact | `purpel-pink.png` | `/contact` |
| 10 | Claim Your Planet | `pastel_green.png` | `/claim-your-planet` |

**Reserved (NOT placed on starmap this sprint):**
- `orange.png` — fri til fremtidig node
- `goldenblue.png` — første Pioneer planet-claim (kræver lookAtSun rotation lock)

### Routes & redirects

| Route | Status | Action |
|---|---|---|
| `/quantum` | EXISTS as debate-engine | **MOVE** debate-engine to `/quantum/chat` (rename to "Quantum Council") + build NEW landing page |
| `/quantum/chat` | EXISTS (verify content) | Wire as "Quantum Council" target |
| `/quantum-forge` | EXISTS (unchanged) | No change |
| `/void-pro-ai` | EXISTS (unchanged) | No change |
| `/trading-hub` | EXISTS (5-tabs) | **REPLACE** with new 6-card grid platform |
| `/ai-trading` | EXISTS (redirects to `/trading`) | **CHANGE** redirect target → `/trading-hub` (308) |
| `/game-hub` | NEW | Build from scratch (MVP) |
| `/space-station` | 404 | Add 308 redirect → `/station` |
| `/tools` | 404 | Add 308 redirect → `/ai-tools` |
| `/station` | EXISTS (Content Hub) | Wire ScienceDeck wires to Space Station planet (planet click → /station) |
| `/ai-tools` | EXISTS (Creator Suite) | Verify, no rebuild |
| `/apps`, `/services`, `/contact`, `/claim-your-planet` | EXIST | No change |

### `/quantum` landing page (3-card layout)

3 cards introducing 3 sub-products:
- **Quantum Council** (multi-AI debate: Claude, GPT, Gemini, Perplexity → consensus) — RENAMED from "Quantum Chat" — links to `/quantum/chat`
- **Quantum Forge** (build-request → AI debate → execution via Claude Agent SDK) — links to `/quantum-forge`
- **Void Pro AI** (premium gateway, pay-per-message) — links to `/void-pro-ai`

User clicks Quantum-planet on starmap → lands here → user picks where to go.

### `/trading-hub` merged platform (6-card grid)

Grid layout (NOT linear scroll). 6 cards:
1. **The Bot** — hvordan virker den, performance, [Køb] CTA
2. **Live Trading** — live volume + trade feed
3. **Leaderboard** — top traders + house bot (Bob Astroeagle)
4. **Backtesting** — test strategier historisk
5. **Beat the House** — slå Bob Astroeagle
6. **Konkurrence** — månedlig præmie til top trader

**Header:** Live trading volume + no. of trades today.
**Extensibility:** Future sektioner som nye cards (no rebuild needed).
**Replaces:** Both `/ai-trading` (redirect) AND existing `/trading-hub` 5-tabs (overwrite).

### `/game-hub` MVP (6 sektioner)

1. **Hero** — tagline: "Spil. Skab. Konkurrer. Tjen."
2. **Play Now** — Sovereign Sky + 4 Break Room games
3. **Coming Soon roadmap** — Marketplace, Tournaments, Forums, Leaderboards, Affiliate (med Coming Soon pulses)
4. **"Are you a Game Developer?"** — email-tilmelding (gemmer i `leads` table)
5. **Affiliate placeholder** — Coming Soon
6. **Rolling promo banner** — voidexa egne promos først

**Coming Soon style:** Pulses (matches voidexa-tone, signalerer "ikke klar endnu" tydeligt).

---

## PRE-FLIGHT (TASK 0 — STOP FOR APPROVAL)

**Mandatory verify-first. Do NOT proceed past Task 0 without explicit Jix approval.**

### 0.1 Repo state verification

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status                                    # must be clean
git log origin/main --oneline -3              # HEAD = a332baf (or AFS-MICRO-FIX-2 commit if shipped first)
git pull origin main
npm test 2>&1 | tail -5                       # must show 1377+ passing
```

**STOP if:** working tree dirty, tests failing, or HEAD doesn't match.

### 0.2 Locate StarMap Three.js source files

```bash
grep -rn "StarMapScene\|NebulaBg\|CSSStarfield\|HolographicMap" src/components/ --include="*.tsx" --include="*.ts"
find src -name "*.tsx" -path "*starmap*"
find src -name "*planet*" -o -name "*Planet*"
```

**Document:** Exact paths of:
- StarMap scene component (Three.js R3F)
- Planet config / data file
- Nebula component
- Starfield component
- Camera/controls setup

### 0.3 Read current baseline values from source

```bash
grep -n "sphereRadius\|sphere radius\|<Sphere\|args=\[" src/components/starmap/
grep -n "far=\|<PerspectiveCamera\|fov=" src/components/starmap/
grep -n "<Stars\|points\|<Points" src/components/starmap/
grep -n "position=\|cameraPosition" src/components/starmap/
```

**Report tabular:**

| Parameter | Current value | Source file:line |
|---|---|---|
| Skybox sphere radius | ? | ? |
| Camera far plane | ? | ? |
| Camera FOV | ? | ? |
| Camera default position (z) | ? | ? |
| Star renderer type | ? | ? |
| Nebula source/component | ? | ? |

### 0.4 Locate planet textures on disk

```bash
ls -la /mnt/user-data/uploads/ 2>/dev/null | grep -i ".png"
ls -la public/assets/planets/ 2>/dev/null
ls -la public/textures/planets/ 2>/dev/null
find . -name "voidexa.png" -o -name "saturen_like_rings.png" 2>/dev/null
```

**Document:** Where the 12 PNGs currently live and confirm filenames match the locked mapping above.

### 0.5 Verify existing routes (no rebuild needed)

```bash
ls src/app/station/page.tsx
ls src/app/ai-tools/page.tsx
ls src/app/quantum/chat/page.tsx
```

**Report:** All 3 exist, confirmed via SLUT 22 live audit. Do NOT rebuild.

### 0.6 Check existing components for reuse

```bash
grep -rn "ScienceDeck\|CinemaDeck\|SocialDeck" src/components/ --include="*.tsx" -l
grep -rn "ShipBuyButton\|TradingLeaderboard" src/components/ --include="*.tsx" -l
grep -rn "ComingSoonPulse\|RollingPromo" src/components/ --include="*.tsx" -l
```

**Document:** What exists, what needs to be built fresh, what can be wired.

### 0.7 Check existing redirect mechanism

```bash
cat next.config.js 2>/dev/null | grep -A 20 "redirects"
cat next.config.ts 2>/dev/null | grep -A 20 "redirects"
ls src/middleware.ts 2>/dev/null
```

**Document:** How redirects are currently configured (next.config vs middleware) — use existing pattern.

### 0.8 Test framework baseline

```bash
npx vitest --reporter=verbose 2>&1 | tail -10   # confirm test count + framework
ls tests/ src/__tests__/                         # find test layout
```

**Confirm:** Vitest is the test framework (per userMemories). Document where tests live.

---

### 🔴 CHECKPOINT 1 (mandatory STOP)

After completing 0.1-0.8, STOP. Output:

1. Repo state confirmed
2. All source paths discovered
3. Baseline tal table (8 parameters)
4. Planet texture locations
5. Existing routes confirmed
6. Existing components inventoried
7. Redirect mechanism identified
8. Test framework + path confirmed

**Wait for Jix approval on:**
- Skybox/camera scaling proposal (Claude proposes 8-10x baseline based on numbers found)
- Any path corrections needed in this SKILL
- Any scope ambiguity discovered

**Do NOT proceed to Task 1 without explicit "go" from Jix.**

---

## TASK 1 — Skybox + camera baseline upgrade

**Files modified (anticipated, verify in 0.2):**
- `src/components/starmap/StarMapScene.tsx`
- `src/components/starmap/NebulaBg.tsx` or equivalent

**Changes:**
- Skybox sphere radius: baseline → ~8-10x (Jix-approved value from Checkpoint 1)
- Camera far plane: must be > sphere radius
- Camera FOV: 55 → ~40-48 (cinematic, "telescope" feel)
- Default camera z-position: pull back so voidexa-sun fylder ~25-35% af viewport

**No regressions:** Existing planet positions, nebula colors, starfield density unchanged.

**Tests:** +3-5 assertions (camera config, sphere radius, FOV)

---

## TASK 2 — Wire 12 planet textures

**Files created:**
- `public/assets/planets/README.md` — texture mapping documentation
- 12 PNG files moved from `/mnt/user-data/uploads/` (or wherever 0.4 found them) → `public/assets/planets/`

**Files modified:**
- `src/data/starmap-planets.ts` (or wherever planet config lives, found in 0.2)
- StarMap scene component to apply textures via Three.js TextureLoader

**Changes per planet:**
- Replace plain colored sphere with `MeshStandardMaterial` + texture map
- 8 wired this sprint, 2 reserved (orange.png + goldenblue.png — saved on disk, not placed)

**Tests:** +12 assertions (one per planet config — texture path, route, label)

---

## TASK 3 — Fix label-clustering + Space Station 3D upgrade

**Files modified:**
- StarMap scene component
- Planet position data

**Changes:**
- Spread planeter ud så Apps/Trading Hub/Void Pro AI ikke overlapper top-venstre
- Spread Contact/AI Trading/Space Station ikke overlapper top-center
- Space Station node: replace flat 2D diamond with 3D mesh + orbital ring (TorusGeometry)
- Star renderer: switch to additive blending (`THREE.AdditiveBlending`) + Point material so stars are distinct from nebula

**Tests:** +5-8 assertions (positions, Space Station 3D presence, blending mode)

---

## TASK 4 — Build `/quantum` landing page (3-card layout)

**Files created:**
- `src/app/quantum/page.tsx` (REPLACE existing — current is debate-engine, that moves to `/quantum/chat`)
- `src/components/quantum/QuantumLandingCard.tsx` (3-card component)

**Files modified:**
- `src/app/quantum/chat/page.tsx` — verify Quantum Council content (rename strings from "Quantum Chat" → "Quantum Council")

**Card content (3 cards):**
1. Quantum Council → `/quantum/chat` — multi-AI debate, sub-tagline "Consensus from Claude, GPT, Gemini, Perplexity"
2. Quantum Forge → `/quantum-forge` — build pipeline, sub-tagline "From request to deploy in minutes"
3. Void Pro AI → `/void-pro-ai` — premium gateway, sub-tagline "Pay-per-message access to top models"

**No backend needed** — pure landing page.

**Tests:** +5 assertions (3 cards render, links correct, page renders without errors)

---

## TASK 5 — Build `/trading-hub` merged platform

**Files created:**
- `src/app/trading-hub/page.tsx` (REPLACE existing 5-tabs)
- `src/components/trading/TradingHubHeader.tsx` (live volume + trades count)
- `src/components/trading/TradingHubGrid.tsx` (6-card grid)
- 6 card components (or 1 flexible card with prop variants)

**Header data sources:**
- Live trading volume: stub for MVP (display "Coming Soon" or hardcoded placeholder), or wire to existing volume endpoint if exists (verify in 0.6)
- Trades today: same approach

**6 cards:**
1. The Bot — link to `/ai-trading-bot/details` or similar (verify route exists)
2. Live Trading — placeholder card with Coming Soon pulse
3. Leaderboard — link to existing leaderboard route (find in 0.6)
4. Backtesting — Coming Soon
5. Beat the House — Coming Soon
6. Konkurrence — Coming Soon

**Tests:** +8 assertions (page renders, 6 cards present, header structure, links resolve)

---

## TASK 6 — Build `/game-hub` MVP

**Files created:**
- `src/app/game-hub/page.tsx`
- `src/components/game-hub/GameHubHero.tsx`
- `src/components/game-hub/PlayNow.tsx` (links to Sovereign Sky + 4 Break Room games)
- `src/components/game-hub/ComingSoonRoadmap.tsx` (5 items with Coming Soon pulses)
- `src/components/game-hub/DevSignup.tsx` (email form → `leads` table)
- `src/components/game-hub/RollingPromo.tsx` (voidexa-eget promos)

**Database (if not exists):**
- Verify `leads` table exists (Supabase). If not, add migration:
  ```sql
  create table if not exists leads (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    source text not null default 'game-hub',
    created_at timestamptz default now()
  );
  alter table leads enable row level security;
  -- no select policy (admin only via service role)
  ```
- Run via Supabase SQL Editor (manual, per user rules)

**Server action:**
- `src/app/actions/leads.ts` — `submitDevLead(email: string)` with rate-limit + validation

**Tests:** +10 assertions (page renders, all 6 sektioner present, dev form submits, Coming Soon pulses count = 5, rolling promo cycles)

---

## TASK 7 — Add 308 redirects

**File modified:**
- `next.config.js` (or `next.config.ts` — found in 0.7)

**Add to `redirects()`:**
```js
{ source: '/space-station', destination: '/station', permanent: true },
{ source: '/tools', destination: '/ai-tools', permanent: true },
{ source: '/ai-trading', destination: '/trading-hub', permanent: true },
```

**Note:** `/ai-trading` currently redirects to `/trading` — UPDATE target to `/trading-hub`.

**Tests:** +3 assertions (each redirect returns 308 with correct destination — Vitest with mock or Playwright E2E)

---

## TASK 8 — Wire `/station` to Space Station planet

**File modified:**
- `src/data/starmap-planets.ts` (or wherever Space Station node is configured)

**Change:**
- Space Station node `route` field: confirm = `/station` (not `/space-station`)
- Planet click handler routes correctly

**No new code needed for `/station` page itself** — already exists as Content Hub (Cinema/Science/Social Decks per SLUT 22).

**Tests:** +1 assertion (Space Station planet config has route `/station`)

---

## TASK 9 — Tests + final verification

**Files created/modified:**
- `tests/afs-10-starmap-config.test.ts` (planet mapping, routes)
- `tests/afs-10-quantum-landing.test.ts`
- `tests/afs-10-trading-hub.test.ts`
- `tests/afs-10-game-hub.test.ts`
- `tests/afs-10-redirects.test.ts`

**Cumulative target:**
- Baseline: 1377 (or 1377+N if AFS-MICRO-FIX-2 shipped first)
- Sprint adds: ~45-55 assertions
- Target end: ~1422-1432

**Run:**
```bash
npm test 2>&1 | tail -10
npm run build
```

Both must pass. Zero TypeScript errors. No new console warnings in dev.

---

### 🔴 CHECKPOINT 2 (before commit)

After Tasks 1-9 complete:

1. All tests green
2. `npm run build` succeeds
3. No new console warnings/errors
4. Working tree shows expected files only (no scope creep)

**STOP. Output diff summary. Wait for Jix to confirm before committing.**

---

## GIT WORKFLOW

### Before any code (after SKILL approval at Checkpoint 1)

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status                                    # clean
git tag backup/pre-sprint-afs-10-YYYYMMDD
git push origin backup/pre-sprint-afs-10-YYYYMMDD

# Commit SKILL FIRST
git add docs/skills/sprint-afs-10-starmap-level-2-repair.md
git commit -m "chore(afs-10): add sprint SKILL documentation"
git push origin main
```

### During (one logical commit per task)

```bash
git add <files>
git commit -m "feat(afs-10): <task description>"
# Don't push between tasks — push at end with full chain
```

### After Checkpoint 2 approval

```bash
git push origin main
git tag sprint-afs-10-complete
git push origin sprint-afs-10-complete

# Verification (mandatory)
git status                                    # clean
git log origin/main --oneline -10             # confirm chain on remote
sleep 90                                       # wait for Vercel deploy
```

### Live verify (mandatory before tagging complete)

Hard-refresh incognito on:
- voidexa.com/starmap/voidexa — Level 2 Apr 20 issues fixed
- voidexa.com/quantum — 3-card landing page renders
- voidexa.com/quantum/chat — Quantum Council (renamed)
- voidexa.com/trading-hub — 6-card grid
- voidexa.com/ai-trading — 308s to /trading-hub
- voidexa.com/space-station — 308s to /station
- voidexa.com/tools — 308s to /ai-tools
- voidexa.com/game-hub — MVP renders, dev signup works

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST (before any code)
- [ ] Backup tag pushed before starting
- [ ] All 9 tasks complete
- [ ] Tests green: 1377 + 45-55 = ~1422-1432
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No new console warnings
- [ ] Committed + tagged `sprint-afs-10-complete` + pushed to origin/main
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -10` shows commits on remote
- [ ] Wait ≥90s for Vercel deploy
- [ ] Hard-refresh incognito live-verify (8 routes above)
- [ ] All 12 planet textures rendering on `/starmap/voidexa`
- [ ] Space Station node 3D with orbital ring
- [ ] Default zoom shows voidexa-sun ~25-35% of viewport
- [ ] Stars distinct from nebula
- [ ] No regressions on previously-shipped features
- [ ] CLAUDE.md updated with sprint summary
- [ ] INDEX deltas prepared for SLUT delivery

---

## RISKS

1. **Three.js side-effects** — texture loading async, dispose() patterns. Use Suspense + cleanup.
2. **Existing `/trading-hub` 5-tabs** — overwriting may break existing user flows. Snapshot current page first.
3. **Existing `/quantum` debate-engine** — moving to `/quantum/chat` requires verifying chat route doesn't have its own debate-engine already (live audit said it exists — confirm content match).
4. **`/ai-trading` redirect change** — current users may have bookmarked `/trading`. Document in CLAUDE.md that `/trading-hub` is canonical.
5. **Game Hub `leads` table** — if it doesn't exist, migration needed before form works. Check 0.6 / Supabase.
6. **Skybox scaling** — too aggressive scale-up may cull planets behind far plane. Camera far must be set first, then sphere radius.
7. **Test count drift** — if AFS-MICRO-FIX-2 NOT shipped first, hardcoded test counts on `/quantum` (1324) and `/trading` (839+) will still be wrong post-AFS-10. Recommend shipping AFS-MICRO-FIX-2 BEFORE this sprint.

---

## REFERENCES

- SLUT 21 scope lockdown: `16_AUDIT_ROADMAP_DELTA_APR29_SLUT21.md` (full mapping table)
- SLUT 22 audit: `16_AUDIT_ROADMAP_DELTA_APR29_SLUT22.md` (3 routes already exist)
- SLUT 22 live verification: `11_DAILY_VERIFICATION_DELTA_APR29_SLUT22.md`
- Trading-merge resolution: `09_WISHES_PENDING_DELTA_APR29_SLUT21.md` (6 sektioner locked)
- Quantum-merge resolution: `09_WISHES_PENDING_DELTA_APR29_SLUT21.md` (1 planet, 3 sub-products, /quantum landing)
- Quantum Council rename: `09_WISHES_PENDING_DELTA_APR29_SLUT21.md`
- Reserved textures: `09_WISHES_PENDING_DELTA_APR29_SLUT21.md` (orange.png + goldenblue.png)

---

# END SKILL — AFS-10 STARMAP LEVEL 2 REPAIR
