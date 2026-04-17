---
name: sprint-13-homepage-cinematic
description: Replace the static parallax homepage with a 45-second Three.js cinematic film (shuttle → warp → door opens → voidexa Galaxy reveal) plus 4 box overlay end-state, skip button, voiceover auto-play, and Enter Free Flight CTA. Matches VOIDEXA_INTENT_SPEC.md section 2. Split into small files per Tom's code-review standards (max 300 lines per component, max 100 for page.tsx, max 500 for lib).
sprint: 13
priority: P0 (blocks public launch — current homepage does not match intent)
status: pending
estimated_effort: 1 session (2-4 hours)
file_size_rules:
  - React components max 300 lines each
  - app/page.tsx max 100 lines
  - lib files max 500 lines
  - hooks max 300 lines
  - If a file approaches the limit, split BEFORE hitting it
---

## Context

The April 17 autonomous Sprint 8 built a static shuttle parallax homepage with 4 glassmorphism cards below the hero. This does NOT match Jix's intent. The intent is a 45-second continuous Three.js realtime cinematic that tells voidexa's story and loads game assets in the background.

Sprint 8 received a corrupt docs/gpt_keywords_homepage.md (180 bytes, UTF-16 PowerShell artifact) as input and fell back to inferred content. This sprint builds the correct homepage per docs/VOIDEXA_INTENT_SPEC.md section 2.

**File-size discipline:** Jix is onboarding a code reviewer (Tom) who enforces strict file size limits. Sprint 13 MUST split cleanly from the start. Do not create one giant HomeCinematic.tsx — split into scene files, hooks, and orchestrator from the first commit.

## Inputs

**Required reads before starting:**
- docs/VOIDEXA_INTENT_SPEC.md section 2 (Homepage cinematic) — canonical spec
- docs/VOIDEXA_GAMING_COMBINED_V3.md part 2 (Universe tone) — visual style reference
- Existing warp shader in /app/freeflight/ — reuse for film warp effect
- Existing starmap assets in components/starmap/ — reuse for galaxy reveal composition
- public/images/shuttle-hero.png — current 2.5MB hero plate (may be reused as reference)

**3D assets needed:**
- Shuttle interior cockpit GLB — check public/models/cockpits/cockpit_free.glb or cockpit_premium.glb
- voidexa planet mesh — reuse from components/starmap/
- Claim Planet mesh — reuse from components/starmap/ or create simple sphere
- Cargo door mesh — procedural animated rotating plane as placeholder

## File structure (MANDATORY split)

### Main entry
- **app/page.tsx** (max 100 lines) — minimal orchestrator that renders HomeCinematic + CinematicOverlay + SkipButton

### Components directory: components/home/
- **HomeCinematic.tsx** (max 200 lines) — Canvas wrapper, scene orchestration, preload trigger, timeline state management. Delegates actual scenes to child components.
- **CinematicOverlay.tsx** (max 150 lines) — 2×2 grid of 4 boxes + Enter Free Flight CTA. Fades in at sec 42.
- **SkipButton.tsx** (max 50 lines) — Top-right skip button, visible from sec 3.
- **VoiceoverPlayer.tsx** (max 120 lines) — Audio element + unmute prompt handling.

### Scene components: components/home/scenes/
Each phase of the 45-sec timeline is its own file:

- **SceneApproach.tsx** (max 200 lines) — Phase 1 (sec 0-8): outside galaxy, distant stars, shuttle interior.
- **SceneWarp.tsx** (max 150 lines) — Phase 2 (sec 8-12): warp shader effect, blue tunnel, starlines.
- **SceneArrival.tsx** (max 200 lines) — Phase 3 (sec 12-25): inside voidexa Galaxy, voidexa star + Claim Planet + nebula.
- **SceneDoorOpen.tsx** (max 200 lines) — Phase 4-5 (sec 25-42): camera rotation, cargo door animation, galaxy reveal, gaming landmark silhouettes.

Each scene component receives phase and elapsedSeconds props from parent and renders only when active.

### Hooks: hooks/
- **useCinematicTimeline.ts** (max 250 lines) — GSAP timeline state, phase calculation, camera positioning helpers, skip handler.
- **useVoiceoverSync.ts** (max 100 lines) — Syncs voiceover playback with timeline, handles autoplay policy.

### Library: lib/
- **game/preload.ts** (max 300 lines) — Background asset preloader. Loads freeflight + starmap GLBs while film plays.
- **cinematic/config.ts** (max 150 lines) — Pure data: voiceover script with timestamps, phase timings, panel content.

### Public assets
- **public/audio/homepage-voiceover.mp3** — Eleven Labs generated OR silent placeholder

## Film timeline

```
Phase 1: Approach (sec 0-8)         → SceneApproach.tsx
Phase 2: Warp transition (sec 8-12) → SceneWarp.tsx
Phase 3: Arrival (sec 12-25)        → SceneArrival.tsx
Phase 4: Door opening (sec 25-35)   → SceneDoorOpen.tsx
Phase 5: Reveal (sec 35-42)         → SceneDoorOpen.tsx continues
Phase 6: End-state (sec 42-45)      → CinematicOverlay fades in
```

See docs/VOIDEXA_INTENT_SPEC.md section 2 for full film sequence details.

## Skip button behavior

hooks/useCinematicTimeline.ts exports skipToEnd(). When skip clicked:
1. Stop GSAP timeline at current position
2. Jump camera + scene state to sec 42 (freeze frame position)
3. VoiceoverPlayer.stop()
4. CinematicOverlay.fadeIn() immediately
5. User can interact

Skip button: top-right, 24px from edges. Visible from sec 3 (opacity 0 → 1 fade in over 0.5 sec).

## Voiceover script (for Eleven Labs)

Store in lib/cinematic/config.ts:

```typescript
export const VOICEOVER_SCRIPT = [
  { time: 1,  text: "Welcome to voidexa. This is not just a website — it's a universe we built." },
  { time: 14, text: "Out here, companies can claim their own planet and build their presence. Your business in the stars." },
  { time: 27, text: "We build websites, custom apps, AI tools — the things that make your business fly." },
  { time: 37, text: "And if you want to explore the universe itself — fly a ship, collect cards, race against pilots — free flight is one click away." },
  { time: 42, text: "Website Creation. Custom Apps. Universe. Tools. Or press Enter Free Flight to jump right in." },
];
```

Voice: calm, confident, warm. Eleven Labs Rachel or Adam. Single MP3, 45 sec, normalized to -16 LUFS.

**If Eleven Labs API not available:** Create silent placeholder MP3 at public/audio/homepage-voiceover.mp3. Leave TODO comment in VoiceoverPlayer.tsx with full script from config.ts.

## Browser autoplay handling

1. Start muted (no sound)
2. Show small "Click to unmute" prompt top-left, first 2 seconds
3. On any user interaction → unmute voiceover
4. If user never interacts: film plays silently, 4 boxes still appear at sec 42

## The 4 panels (overlay)

Store config in lib/cinematic/config.ts:

```typescript
export const HOMEPAGE_PANELS = [
  { title: "Website Creation", description: "From sketch to live in days.", cta: "Explore", route: "/products", icon: "Globe" },
  { title: "Custom Apps", description: "Bespoke solutions for any business.", cta: "Explore", route: "/apps", icon: "Wrench" },
  { title: "Universe", description: "A living sci-fi world to explore.", cta: "Enter", route: "/starmap", icon: "Compass" },
  { title: "Tools", description: "AI tools ready to use now.", cta: "Try", route: "/tools", icon: "Zap" },
];
```

Layout: 2×2 grid, centered on viewport. Each panel:
- background rgba(0,0,0,0.6)
- backdrop-filter blur(8px)
- border 1px solid rgba(255,255,255,0.1)
- rounded corners 12px
- padding 24px

**Enter Free Flight CTA:** Separate button below 2×2 grid, centered. Glow effect. Route /freeflight with 2-3 sec loading transition "Requisitioning your ship from docking bay..."

## Background asset preloading

```typescript
// lib/game/preload.ts
export async function preloadGameAssets(onProgress?: (pct: number) => void) {
  // Parallel load:
  // - Ship GLBs (Fighter, Cruiser, Stealth, Tank, Racer)
  // - Starmap textures
  // - Warp shader
  // - Card library JSON
  // - Audio SFX library
}
```

Call from HomeCinematic.tsx useEffect on mount. Non-blocking.

## Font and opacity rules

- Body text min 16px
- Labels/badges min 14px
- Opacity min 0.5 on user-facing text

Panel titles 18px, descriptions 14px, CTA 14px.

## Testing

1. npm run test — existing 642 tests must remain green
2. Add new tests:
   - __tests__/home/HomeCinematic.test.tsx — renders Canvas, preload called
   - __tests__/home/CinematicOverlay.test.tsx — 4 boxes render, CTAs link correctly
   - __tests__/home/SkipButton.test.tsx — click triggers skip handler
   - __tests__/hooks/useCinematicTimeline.test.ts — phase calculation, skipToEnd logic
3. Manual: load /, film plays, skip works, 4 boxes appear at sec 42, clicks route correctly
4. Mobile: 375x812 responsive (panels stack vertically)
5. Performance: first paint under 2s, film under 3s, 60 fps target

## Linting

Before commit:
```
npm run lint
```

All new files must pass ESLint. No eslint-disable without comment explaining why.

## Plan

1. Pre-flight:
   - Verify 642 tests green
   - Create backup tag git tag backup/pre-sprint-13-20260417
2. Create lib/cinematic/config.ts first (data, no dependencies)
3. Create hooks/useCinematicTimeline.ts + hooks/useVoiceoverSync.ts
4. Create lib/game/preload.ts
5. Create scene components (SceneApproach, SceneWarp, SceneArrival, SceneDoorOpen) — one at a time, test each
6. Create components/home/VoiceoverPlayer.tsx
7. Create components/home/SkipButton.tsx
8. Create components/home/CinematicOverlay.tsx
9. Create components/home/HomeCinematic.tsx (orchestrator)
10. Replace app/page.tsx (minimal, under 100 lines)
11. Add tests for new components + hooks
12. Run npm run build — must succeed
13. Run npm run lint — must pass
14. Run tests — must be 642 or more green
15. Visual sanity test in dev mode

## Deploy

```
cd C:\Users\Jixwu\Desktop\voidexa
git add .
git commit -m "feat(sprint-13): homepage cinematic — split into scenes per Tom's file-size rules"
git push origin main
```

Vercel auto-deploys. Verify on voidexa.com.

## Rollback plan

```
git reset --hard backup/pre-sprint-13-20260417
git push --force-with-lease origin main
```

## Success criteria

Homepage at voidexa.com shows:
- 45-sec Three.js cinematic playing on load
- Auto-play voiceover (or silent fallback with unmute prompt)
- Skip button in top-right from sec 3
- 4 boxes fade in as overlay at sec 42 (NOT below hero)
- Enter Free Flight CTA visible below grid
- No scrollable sections (single viewport)
- KCP-90 terminal removed from homepage
- Matches VOIDEXA_INTENT_SPEC.md section 2 exactly
- All files under Tom's size limits
- Tests 642 or more green
- Lint passes
- Commit pushed, Vercel deployed

## Stop conditions

- Build fails 3 times consecutively → halt, report
- Tests regress below 642 → halt, report
- A file exceeds size limit AND cannot be split cleanly → halt, report for refactor guidance

## Global rules

1. Font minima: 16px body, 14px labels, 0.5 opacity floor
2. All env reads .trim() (Vercel paste-artifact rule)
3. Deploy: git push origin main only (auto-deploys, no manual vercel --prod)
4. public/models/ is gitignored — never commit binary assets there
5. Use claude-opus-4-7 (NOT 4.6, deprecated)
6. File size rules — see top of this document. Split BEFORE hitting the limit.
