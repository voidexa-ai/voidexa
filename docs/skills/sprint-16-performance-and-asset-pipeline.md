---
name: sprint-16-performance-and-asset-pipeline
description: Fix BoostTrail GPU thrashing (root cause of FPS collapse under sustained boost). Wire up USC, Expansion, and Hi-Rez ship GLBs via texture-binding-safe loader pipeline. Assign correct rarity badges to ship hangar (Bob = Starter free, rest by rarity tier). Polish quick menu text readability against video background. Redesign controls legend into premium visual hierarchy.
sprint: 16
priority: P0 (BoostTrail fix unblocks all future flight-based testing; asset pipeline unblocks NPCs + ship progression)
status: pending
estimated_effort: 1 session (6-10 hours)
model: claude-opus-4-7
effort: xhigh
---

## CONTEXT

Sprint 15 shipped successfully April 19, 2026. Live audit via Chrome extension confirmed:
- Homepage audio gate, quick menu, routing, keybind legend, ESC debounce, HUD call panel all working
- BUT critical new finding: FPS collapses from 118 to 1 under sustained Shift-boost
- Root cause isolated: BoostTrail.tsx particle emission. Memory stable at ~240MB. GPU-side thrashing, NOT memory leak.

Additionally Jix reported 5 visual/polish issues during audit:
1. Quick menu 4-panel text barely readable against video background
2. Controls legend (all cyan text, no visual hierarchy) doesn't feel premium
3. Ship hangar shows Challenger/Striker/Imperial/AstroEagle/CosmicShark as "STARTER" — only Bob should be Starter-free; rest need rarity badges per catalog
4. Bottom-right starmap HUD clutter: KCP-90 terminal + Jarvis chat + DK flag + company info collide
5. USC ships (289), Expansion ships, Hi-Rez full ships on disk but not loaded (texture binding broken from FBX→GLB conversion)

Sprint 16 bundles all of this into a single performance + asset pipeline + visual polish run. Star map visual redesign (planet textures, station ring, nebula backdrop matching quick menu reference image) is intentionally deferred to Sprint 17 as its own dedicated design sprint.

## REQUIRED READING BEFORE STARTING

- `docs/CLAUDE.md` — current standards
- `docs/VOIDEXA_INTENT_SPEC.md` section 5 (freeflight), section 13 (known limitations)
- `docs/VOIDEXA_GAMING_COMBINED_V3.md` part 4 (ship classes), part 11 (visual effects)
- Current code state of these files (read with view tool first):
  - `components/freeflight/ships/BoostTrail.tsx` — GPU thrashing source
  - `components/freeflight/ships/ShipLoader.tsx` — GLB loader
  - `components/freeflight/ships/catalog.ts` — ship catalog + rarity
  - `components/freeflight/ships/ShipPicker.tsx` — hangar UI
  - `lib/config/modelUrls.ts` — asset URL manifest
  - `components/home/QuickMenuOverlay.tsx` — quick menu panels
  - `components/freeflight/ControlsLegend.tsx` — keybind legend (created in Sprint 15)
  - `components/starmap/StarMapPage.tsx` + related — for HUD declutter

## PRE-FLIGHT

1. Create git backup tag: `git tag backup/pre-sprint-16-20260419`
2. Push tag: `git push origin backup/pre-sprint-16-20260419`
3. Verify baseline: `npm test` must pass 766+ tests before any changes
4. Verify Supabase models bucket is accessible (bucket name: `models`)

## TASK ORDER (dependencies matter)

Execute in this exact order.

---

### TASK 1 — Fix BoostTrail GPU thrashing (highest priority, unblocks all flight testing)

**File:** `components/freeflight/ships/BoostTrail.tsx`

**Diagnosed behavior (from live audit):**
- Baseline idle FPS: 105-120 avg
- W-only flight 15s: stable 90-120, memory 224-244MB
- W+Shift boost 1-3s: stable 108-120
- W+Shift boost 6s: collapses to 26 FPS
- W+Shift boost 9s+: dies at 1 FPS
- Release Shift: recovers to 117 avg within 2-3 seconds
- Memory stable throughout (~240MB) — **NOT a memory leak, this is GPU/CPU compute overload**

**Root causes identified:**

1. Emission rate too aggressive during boost: 600 particles/sec is unsustainable for 150-particle pool with per-frame attribute rewrites
2. All three BufferAttributes (position, color, size) flagged `needsUpdate = true` EVERY frame regardless of whether values changed
3. `PointsMaterial` is used with a custom `size` attribute but `PointsMaterial` does not read per-vertex `size` — it uses uniform size only. The `size` attribute is allocated, written every frame, and never consumed. Pure waste.
4. Per-particle color computation runs in JS every frame for all 150 particles even when many are past their life and should be skipped
5. Additive blending over 150 simultaneous points with sizeAttenuation on = heavy fragment shader work

**Fixes to apply:**

- **Reduce PARTICLE_COUNT** from 150 to 80
- **Cap emission rate:**
  - Idle (no boost): 120/sec max (was 180 + speed modifier)
  - Boost: 250/sec max (was 600 — big reduction)
- **Remove dead `size` attribute entirely.** Delete:
  - `const sizes = useMemo(...)` allocation
  - size writes in the per-frame loop
  - `<bufferAttribute attach="attributes-size" ...>` JSX element
- **Gate BufferAttribute updates:**
  - Only set `posAttr.needsUpdate = true` if any particle moved this frame (track with a dirty flag set when emission happens or particle ages)
  - Only set `colAttr.needsUpdate = true` when colors actually change (same dirty flag)
- **Skip dead particles in the update loop:** If `ages[i] >= lifes[i]` AND already faded (colors already zero), `continue` without re-zeroing — small but real saving at 80 particles × 60fps
- **Throttle emission accumulator:** Current code `while (emitAccum >= 1 && emitted < 20)` — keep the 20 cap (good), but recompute `toEmit` less aggressively:
  - Use `emitPerSec = boost ? 250 : 120 + speedN * 80` (capped)
- **Optional visual improvement (do only if time permits):** replace `PointsMaterial` with a simple shader material that reads per-vertex `size` AND color — makes particles actually look like a fat boost plume instead of tiny dots. If too much scope, skip and keep current visual as-is.

**Acceptance test:**
- Sustained boost for 15 seconds → FPS stays above 60 for entire duration (baseline was 1 FPS after 9s)
- Release boost → FPS returns to baseline immediately
- Idle flight without boost → FPS unchanged from Sprint 15 baseline

**Test how:** Add a temporary dev-only FPS meter component (or use browser perf API in test) that logs FPS during boost. Verify 15s sustained boost averages > 60 FPS. Remove dev meter before commit.

---

### TASK 2 — Wire USC, Expansion, and Hi-Rez full ship GLBs via safe loader pipeline

**Files:**
- `components/freeflight/ships/ShipLoader.tsx` — loader logic
- `components/freeflight/ships/catalog.ts` — ship catalog
- `lib/config/modelUrls.ts` — asset URL manifest
- Supabase Storage bucket `models` (via Supabase MCP or dashboard — ensure GLBs are uploaded)

**Problem:**

From live audit Network tab inspection, only 10 GLBs load in `/freeflight`:
- 6 Quaternius ships (qs_challenger, qs_striker, qs_imperial, qs_executioner, qs_omen, qs_spitfire)
- hirez_cockpit01_interior.glb, hirez_equipments.glb, hirez_screens.glb
- vattalus_fighter_cockpit.glb

Missing from live scene:
- USC ships (289 files): AstroEagle, CosmicShark, VoidWhale, plus 286 others
- Expansion ships (~50)
- Hi-Rez full ships (not cockpits — the actual ship bodies)

Memory says root cause is "FBX→GLB conversion lost texture binding."

**Investigation steps first:**

1. List files in `public/models/glb-ready/` (or wherever converted GLBs live) — run `Get-ChildItem -Recurse` if PowerShell available, else use Node filesystem read
2. For 3-5 representative USC GLBs, test-load them in a standalone node script (or a hidden React route) to see the exact failure mode:
   - Does the GLB load? (DRACOLoader handles it?)
   - Does the mesh appear? (geometry present?)
   - Are textures missing? (materials are flat/white?)
   - Are bone/skeleton references broken? (if the FBX had rigging)
3. Based on findings, choose one of:
   - **A) Texture paths are relative and broken** → embed textures via gltf-transform CLI: `gltf-transform inspect` + `gltf-transform resize` + `gltf-transform copy --embed-textures`
   - **B) Texture binding references were named not indexed** → use `@gltf-transform/functions` `textureCompress` + `flatten` to fix material references
   - **C) PBR material map types are wrong** (e.g. baseColorTexture in wrong slot) → script that rewrites material slot assignments

**Pipeline implementation:**

Create `scripts/fix-ship-glbs.mjs` that:
1. Scans `public/models/glb-ready/` for unconverted/broken GLBs
2. For each, runs the appropriate fix from above
3. Outputs fixed GLBs to `public/models/glb-fixed/`
4. Generates a manifest JSON listing: `{ id, displayName, url, rarity, class, thumbnailUrl }`

Upload fixed GLBs to Supabase Storage bucket `models` via script (use Supabase service role key from env, ensure it's `.trim()`d).

**Update `lib/config/modelUrls.ts`** to point at the fixed GLB URLs (Supabase CDN).

**Update `components/freeflight/ships/catalog.ts`** to:
- Include all 300+ ships with correct metadata
- Set `rarity` field per ship (see Task 3 for rarity assignment rules)
- Set `class` field (Fighter / Hauler / Explorer / Salvager / Bob) per ship

**Stop condition for this task:** If more than 10% of USC GLBs cannot be fixed by any of paths A/B/C, halt and report with specific GLB filenames and error messages. Do not proceed to force-load broken ships.

---

### TASK 3 — Ship hangar rarity badges (fix the "all STARTER" bug)

**File:** `components/freeflight/ships/ShipPicker.tsx` + `components/freeflight/ships/catalog.ts`

**Current wrong behavior:** Challenger, Striker, Imperial, AstroEagle, CosmicShark all show STARTER badge. Only Bob should be Starter.

**Correct rarity assignment rules:**

| Class of ships | Rarity | Badge color | Unlock |
|---|---|---|---|
| Bob (1 ship) | STARTER | green | Free, default for new players |
| Quaternius basic (Challenger, Striker, Imperial, Executioner, Omen, Spitfire) | COMMON | light blue | Free tier / easy to obtain |
| USC standard (most of 289) | UNCOMMON | teal | Earnable via gameplay / cheap shop |
| USC premium subset (AstroEagle, CosmicShark, VoidWhale) | RARE | purple | GHAI purchase |
| Hi-Rez full ships | EPIC | pink | High GHAI or tournament prize |
| Expansion ships (curated) | LEGENDARY | gold | Rare drops / Mythic events |
| Limited/event-only ships | MYTHIC | iridescent | Void Prix champions / Hive challenges |

**Implementation:**

- Add `Rarity` type to `catalog.ts`:
  ```typescript
  export type Rarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  ```
- Extend ship catalog entries with `rarity: Rarity` field
- In `ShipPicker.tsx`, replace hardcoded "STARTER" badge with rarity-to-badge mapping:
  - starter: green solid, label "STARTER"
  - common: light-blue outlined, label "COMMON"
  - uncommon: teal outlined, label "UNCOMMON"
  - rare: purple solid, label "RARE"
  - epic: pink solid, label "EPIC"
  - legendary: gold solid with subtle glow, label "LEGENDARY"
  - mythic: iridescent gradient, label "MYTHIC"
- Minimum label text size 14px per voidexa UI standards

**Test:** Hangar now shows Bob as STARTER, Challenger/Striker/Imperial/Executioner/Omen/Spitfire as COMMON, AstroEagle/CosmicShark/VoidWhale as RARE, rest per rules.

---

### TASK 4 — Quick menu text visibility polish

**File:** `components/home/QuickMenuOverlay.tsx` (and/or panel subcomponents)

**Problem:** Jix reports text in the 4 panels (Website Creation, Custom Apps, Universe, Tools) is barely visible against the video background freeze-frame.

**Fixes:**

- Panel background opacity: increase from current to `rgba(8, 12, 28, 0.72)` with `backdrop-filter: blur(12px)` (use blur here because it's a static overlay — not a perf issue, only 4 panels)
- Panel border: `1px solid rgba(0, 212, 255, 0.25)` for subtle tech feel
- Title text: 18px, weight 600, color `#ffffff`, opacity 1.0
- Subtitle/body text: 14-15px, weight 400, color `#e0e8f0`, opacity 0.92
- Icon: 24x24, full opacity, monochrome cyan `#00d4ff`
- Subtle drop shadow on panel: `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4)`

**Verify against voidexa UI standards:**
- Body text ≥16px ✓ (we're using 14-15px for body — bump to 16px minimum)
- Labels ≥14px ✓
- Opacity ≥0.5 ✓ (we're at 0.92, well above)

**Actually use 16px for body text** — spec is hard floor, not suggestion.

---

### TASK 5 — Controls legend premium redesign

**File:** `components/freeflight/ControlsLegend.tsx`

**Current issue:** All cyan text on dark background. No visual hierarchy. Keys not distinguishable from actions. Jix says "doesn't look premium."

**Redesign spec:**

- **Key-chip styling:** Each key (WASD, Q/E, Shift, etc.) rendered as a small rounded rectangle with subtle border and raised feel. Chip background `rgba(0, 212, 255, 0.12)`, border `1px solid rgba(0, 212, 255, 0.4)`, text white bold 13px, padding 2-4px 8px, border-radius 4px
- **Action text:** Regular weight, color `rgba(220, 230, 245, 0.82)`, 14px, separated from chip with middle dot (`·`) or em space
- **Category groups with dividers:**
  - THRUST & MOVEMENT: WASD, Q/E, R/F
  - CAMERA: Mouse, RMB, Scroll
  - SYSTEMS: Shift, Space
  - NAVIGATION: M/Tab, V, E, F
  - MENU: ESC
- Each category has a small amber/cyan label header (11px uppercase letter-spacing 0.1em)
- Subtle horizontal divider between categories: `1px solid rgba(255, 255, 255, 0.06)`
- Panel background: `rgba(5, 8, 18, 0.75)` with `backdrop-blur(8px)`
- Panel border: `1px solid rgba(0, 212, 255, 0.2)`, rounded 10px
- Optional subtle outer glow: `box-shadow: 0 0 20px rgba(0, 212, 255, 0.08)`

**Text hierarchy rules:**
- Keys = bright white in tinted chip = the "what you press"
- Actions = slightly muted light gray = the "what it does"
- Categories = dim amber/cyan = the "organization"

**Typography:**
- Font: same `var(--font-sans)` as rest of voidexa
- Font-weight mix: 600 for keys, 400 for actions, 500 for category labels

**Ensure Tom's file limit: max 300 lines.** If component grows, split into `ControlsLegend.tsx` + `ControlsLegendCategory.tsx`.

---

### TASK 6 — Starmap HUD declutter (bottom-right stack)

**Files:** Various components that render to bottom-right zone:
- `components/starmap/StarMapPage.tsx` — the `Kcp90FloatingPanel`
- Global Jarvis AI chat bubble component (likely in layout or root)
- Language/flag selector (DK flag)
- Company info line

**Problem:** All four elements live in bottom-right and overlap on standard desktop viewport (1280-1920 wide).

**Fix — Visual priority and positioning rules:**

| Element | New position | Z-index | Behavior |
|---|---|---|---|
| KCP-90 terminal panel | Bottom-right, offset 20px | 50 | Collapsible (existing `x` button); auto-collapses to small icon below 1280px viewport width |
| Jarvis AI chat bubble | **Bottom-LEFT**, offset 20px | 60 | Moved from bottom-right to bottom-left to avoid KCP collision |
| DK language flag | Top-right header bar (already there per Sprint 15 screenshots) | 100 | No change if already in header |
| Company info ("Operating globally from Denmark · CVR 46343387") | Footer bar spanning bottom, z-index 10, low opacity 0.5 | 10 | Behind other elements, full-width thin strip |

**Implementation:**

- Move Jarvis chat bubble from right to left in its layout component. Search: `bottom-right` / `right: 20` / `right: 0` in component files
- Add z-index hierarchy so KCP-90 (z:50) never overlaps Jarvis (z:60)
- Company info: ensure it's in a footer strip at `position: fixed; bottom: 0; left: 0; right: 0; height: 28px;` with low opacity, text-align center, font-size 12px, `pointer-events: none` so it doesn't block clicks
- Responsive: below 1280px viewport width, auto-collapse KCP-90 panel to a small cyan circle icon that expands on click

**Test matrix:**
- Desktop 1920×1080: all elements visible, no overlap
- Laptop 1440×900: all elements visible, no overlap
- Small 1280×720: KCP collapses to icon, Jarvis bubble + flag + company footer all readable
- Mobile 375×812: KCP icon only, Jarvis bubble, no flag needed (language via nav dropdown), company footer collapsed

---

### TASK 7 — Bob ship default fallback if USC not loaded

**File:** `components/freeflight/ships/ShipLoader.tsx`

**Defensive fix:** If a player selected a ship whose GLB fails to load (even after Task 2 pipeline), auto-fallback to `qs_bob` so game never freezes on a black scene. Log the failed ship ID for telemetry.

```typescript
try {
  const gltf = await useGLTF.preload(shipUrl)
  // ...
} catch (err) {
  console.warn(`Ship GLB failed: ${shipId}, falling back to qs_bob`, err)
  return await useGLTF.preload('/models/qs_bob.glb')
}
```

This prevents Sprint 15's ship hangar from causing a broken state if any of the 300 ships still has issues.

---

## BUILD STEPS

1. Read all required files listed in REQUIRED READING
2. Execute Task 1 (BoostTrail fix) — VERIFY FPS stays >60 during 15s sustained boost before proceeding
3. Execute Task 2 (asset pipeline) — may take significant time for GLB fix scripting
4. Run tests, verify no regressions
5. Execute Task 3 (rarity badges)
6. Execute Task 4 (quick menu polish)
7. Execute Task 5 (controls legend premium)
8. Execute Task 6 (starmap declutter)
9. Execute Task 7 (ship fallback)
10. Run full test suite — target 766+ green (may grow with new tests)
11. `npm run build` — zero errors
12. `npm run lint` — no new errors
13. Manual verification at `localhost:3000`:
    - `/freeflight`: hold W+Shift for 15s, confirm FPS stays above 60 (use browser DevTools FPS meter)
    - `/freeflight`: open ship hangar, confirm Bob = STARTER, Challenger/Striker/Imperial = COMMON, AstroEagle/CosmicShark = RARE
    - `/freeflight`: confirm USC/Expansion/Hi-Rez ships appear in catalog and can be selected without errors
    - `/freeflight`: confirm controls legend has key chips, categories, visual hierarchy
    - `/`: open homepage, confirm quick menu panel text is readable against video background
    - `/starmap` or `/starmap/voidexa`: confirm bottom-right KCP-90 panel and bottom-left Jarvis bubble do not overlap; DK flag in top header bar; company footer at page bottom
    - Resize to 1280px width: KCP-90 collapses to icon
14. Mobile check at 375×812

## DEPLOY

1. `git add .`
2. `git commit -m "feat(sprint-16): BoostTrail GPU fix, USC/Expansion/Hi-Rez asset pipeline, ship rarity badges, quick menu + legend polish, starmap HUD declutter"`
3. `git push origin main`
4. Wait for Vercel deploy
5. Test on production in incognito
6. `git tag sprint-16-complete`
7. `git push origin --tags`

## STOP CONDITIONS

Halt and report if:
- Tests regress below 766 green
- Build fails 3 times consecutively
- Task 1 acceptance fails: FPS still drops below 60 during 15s boost after optimization (means root cause is deeper than particle system — needs profiling session)
- Task 2 GLB fix pipeline cannot recover more than 90% of USC ships (means FBX originals may be corrupted or need different toolchain)
- Task 6 cannot locate Jarvis chat bubble component (means it's injected from a different origin and scope may need expanding — report before guessing)

## REPORT BACK

After completion, provide:
- List of files created / modified / deleted with line counts
- Test count (before / after)
- Build status
- Commit hash
- Vercel deployment URL
- FPS measurement during sustained boost (before fix vs after fix, with numbers)
- Count of USC/Expansion/Hi-Rez ships successfully wired vs failed (with failure reasons if any)
- Any blockers or unknowns encountered
- Screenshots recommendations for Jix to verify manually on production
