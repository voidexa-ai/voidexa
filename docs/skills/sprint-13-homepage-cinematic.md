---
name: sprint-13-homepage-cinematic
description: Replace the static parallax homepage with a 45-second Three.js cinematic film (shuttle → warp → door opens → voidexa Galaxy reveal) plus 4 box overlay end-state, skip button, voiceover auto-play, and Enter Free Flight CTA. Matches VOIDEXA_INTENT_SPEC.md section 2.
sprint: 13
priority: P0 (blocks public launch — current homepage does not match intent)
status: pending
estimated_effort: 1 session (2-4 hours)
---

## Context

The April 17 autonomous Sprint 8 built a static shuttle parallax homepage with 4 glassmorphism cards below the hero. This does NOT match Jix's intent. The intent is a 45-second continuous Three.js realtime cinematic that tells voidexa's story and loads game assets in the background.

Sprint 8 received a corrupt `docs/gpt_keywords_homepage.md` (180 bytes, UTF-16 PowerShell artifact) as input and fell back to inferred content. This sprint builds the correct homepage per `docs/VOIDEXA_INTENT_SPEC.md` section 2.

## Inputs

**Required reads before starting:**
- `docs/VOIDEXA_INTENT_SPEC.md` section 2 (Homepage cinematic) — canonical spec
- `docs/VOIDEXA_GAMING_COMBINED_V3.md` part 2 (Universe tone) — visual style reference
- Existing warp shader in `/app/freeflight/` — reuse for film warp effect
- Existing starmap assets in `components/starmap/` — reuse for galaxy reveal composition
- `public/images/shuttle-hero.png` — current 2.5MB hero plate (may be reused as reference for cockpit interior)

**3D assets needed:**
- Shuttle interior cockpit GLB — use existing if available, else search `public/models/cockpits/` (cockpit_free.glb or cockpit_premium.glb)
- voidexa planet mesh — reuse from `components/starmap/`
- Claim Planet mesh — reuse from `components/starmap/` or create simple sphere
- Cargo door mesh — may need to create (simple hinged plane with texture)

## Deliverables

1. **`components/home/HomeCinematic.tsx`** — Three.js scene (React Three Fiber) running full-viewport, 45 sec timeline
2. **`components/home/CinematicOverlay.tsx`** — 2×2 grid of semi-transparent black boxes + Enter Free Flight CTA, appears sec 42-45
3. **`components/home/SkipButton.tsx`** — Top-right, visible from sec 3, jumps to freeze frame on click
4. **`components/home/VoiceoverPlayer.tsx`** — Auto-play voiceover with muted-first fallback + unmute prompt (browser autoplay policy)
5. **`public/audio/homepage-voiceover.mp3`** — Eleven Labs generated (script in this SKILL, section "Voiceover script")
6. **`app/page.tsx`** — Replace entire current home component. Homepage becomes single-screen (no scroll), viewport height 100vh, overflow hidden
7. **`lib/game/preload.ts`** — Background asset preloader that runs during film playback (loads starmap + freeflight assets)

## Film timeline (45 sec total)

### Timeline implementation

Use GSAP timeline or useFrame with elapsed time. Each phase below is a keyframe block.

```
Phase 1: Approach (sec 0-8)
- Camera: outside voidexa Galaxy, slowly drifting forward
- Scene: distant stars (particle system), faint nebula (shader), voidexa as small light point
- Inside shuttle: pilot silhouette in front seat, stars drifting past panorama windows
- Voiceover starts sec 1: "Welcome to voidexa. This is not just a website — it's a universe we built."

Phase 2: Warp transition (sec 8-12)
- Trigger warp shader (reuse from /freeflight)
- Blue tunnel + starlines + camera accelerate forward
- 4 seconds of pure warp visuals
- Voiceover pauses (silence lets visuals breathe)

Phase 3: Arrival at voidexa Galaxy (sec 12-25)
- Warp fades out
- Camera now positioned INSIDE voidexa Galaxy
- Through shuttle windows: voidexa star centered, Claim Planet distant at edge, constellation hints
- This composition MUST match what user sees on /starmap Level 1 (consistency is mandatory)
- Voiceover resumes sec 14: "Out here, companies can claim their own planet and build their presence. Your business in the stars."

Phase 4: Door opening (sec 25-35)
- Camera rotates inside shuttle from front-facing to rear-facing
- Rear cargo door begins opening slowly downward (animated rotation)
- Galaxy light floods cabin (increase ambient + directional light from door direction)
- Voiceover sec 27: "We build websites, custom apps, AI tools — the things that make your business fly."

Phase 5: Reveal (sec 35-42)
- Door fully open
- Through door frame: voidexa Galaxy view, Claim Planet visible
- Add subtle silhouettes in distance: Hive distant mass, racing track faint glow, Break Room station
- (Silhouettes are placeholder meshes — low-poly dark shapes, not detailed)
- Voiceover sec 37: "And if you want to explore the universe itself — fly a ship, collect cards, race against pilots — free flight is one click away."

Phase 6: Interactive end-state (sec 42-45)
- Camera freezes (stop all animation, this frame becomes canonical end-state)
- CinematicOverlay fades in (opacity 0 → 1 over 1.5 sec)
  - 4 boxes in 2×2 grid, black with 0.6 opacity
  - Enter Free Flight CTA below grid
- Voiceover sec 42: "Website Creation. Custom Apps. Universe. Tools. Or press Enter Free Flight to jump right in."
- After sec 45: user can interact
```

## Skip button behavior

```typescript
// When skip clicked:
1. Stop GSAP timeline at current position
2. Jump camera + scene state to sec 42 (freeze frame position)
3. Voiceover.stop()
4. CinematicOverlay.fadeIn() immediately
5. User can interact
```

Skip button position: top-right corner, 24px from edges. Visible from sec 3 onwards (opacity 0 → 1 fade in over 0.5 sec).

## Voiceover script (for Eleven Labs generation)

```
[sec 1]   Welcome to voidexa. This is not just a website — it's a universe we built.
[sec 14]  Out here, companies can claim their own planet and build their presence. Your business in the stars.
[sec 27]  We build websites, custom apps, AI tools — the things that make your business fly.
[sec 37]  And if you want to explore the universe itself — fly a ship, collect cards, race against pilots — free flight is one click away.
[sec 42]  Website Creation. Custom Apps. Universe. Tools. Or press Enter Free Flight to jump right in.
```

**Voice selection:** Calm, confident, warm. Like a friend showing you their workshop. NOT corporate announcer. Eleven Labs "Rachel" or "Adam" voices work well.

**Audio file:** Single MP3, 45 sec, silence between lines, normalized to -16 LUFS.

## Browser autoplay handling

Modern browsers block auto-playing audio without user interaction. Strategy:
1. Start video muted (no voiceover sound)
2. Show small "🔊 Click to unmute" prompt in top-left, first 2 seconds
3. On any user interaction (click anywhere, move mouse) → unmute voiceover
4. If user never interacts: film still plays silently, 4 boxes still appear at sec 42

## The 4 panels (overlay)

Layout: 2×2 grid, centered on viewport. Each panel:

```
┌─────────────────────┐
│  [icon]             │
│  Title              │
│  1-line description │
│  [CTA button]       │
└─────────────────────┘
```

Box styling: `background: rgba(0,0,0,0.6)`, `backdrop-filter: blur(8px)`, `border: 1px solid rgba(255,255,255,0.1)`, rounded corners 12px, padding 24px.

**Panel content:**

| Position | Title | Description | CTA | Route | Icon |
|----------|-------|-------------|-----|-------|------|
| Top-left | Website Creation | From sketch to live in days. | Explore | /products | lucide Globe |
| Top-right | Custom Apps | Bespoke solutions for any business. | Explore | /apps | lucide Wrench |
| Bottom-left | Universe | A living sci-fi world to explore. | Enter | /starmap | lucide Compass |
| Bottom-right | Tools | AI tools ready to use now. | Try | /tools | lucide Zap |

**Enter Free Flight CTA:** Separate button below the 2×2 grid, centered. Style: glow effect, prominent. Route: /freeflight with 2-3 sec loading transition (text: "Requisitioning your ship from docking bay...").

## Background asset preloading

During film playback, preload game assets so Free Flight entry is instant:

```typescript
// lib/game/preload.ts
export async function preloadGameAssets() {
  // Start immediately on film load
  // Load in parallel:
  - Ship GLBs (Fighter, Cruiser, Stealth, Tank, Racer)
  - Starmap textures
  - Warp shader
  - Card library JSON
  - Audio SFX library
}
```

Call preload from HomeCinematic useEffect on mount.

## Font and opacity rules (GLOBAL, see VOIDEXA_INTENT_SPEC.md section 12)

- Body text ≥16px
- Labels/badges ≥14px
- Opacity ≥0.5 on user-facing text

All overlay text must pass these rules. Panel titles = 18px, descriptions = 14px, CTA = 14px.

## Testing

1. `npm run test` — existing 642 tests must remain green
2. Manual test: load /, verify film plays, skip works, voiceover plays (or silent fallback), 4 boxes appear, clicks go to correct routes
3. Mobile test: resize to 375×812, verify film still plays (may drop quality), boxes stack vertically if screen too narrow
4. Performance: first meaningful paint <2s, film starts <3s, no frame drops (60 fps target)

## Deploy

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git add .
git commit -m "feat(sprint-13): homepage cinematic — Three.js 45-sec film + voiceover + 4 box overlay + skip button"
git push origin main
```

Vercel auto-deploys. Verify on production at voidexa.com.

## Rollback plan

If film breaks or performance is unacceptable:
```powershell
git reset --hard HEAD~1
git push --force-with-lease origin main
```

Current static parallax homepage becomes fallback until issues resolved.

## Global rules (apply to every sprint)

1. Font minima: 16px body, 14px labels, 0.5 opacity floor
2. All env reads `.trim()` (Vercel paste-artifact rule)
3. Deploy: `git push origin main` only (auto-deploys, no manual vercel --prod)
4. `public/models/` is gitignored — never commit binary assets there
5. Use `claude-opus-4-7` (NOT 4.6, deprecated)

## Success criteria

Homepage at voidexa.com shows:
- ✅ 45-sec Three.js cinematic playing on load
- ✅ Auto-play voiceover (or silent fallback with unmute prompt)
- ✅ Skip button in top-right from sec 3
- ✅ 4 boxes fade in as overlay at sec 42 (NOT below hero)
- ✅ Enter Free Flight CTA visible below grid
- ✅ No scrollable sections (single viewport)
- ✅ KCP-90 terminal removed from homepage (to be moved to /starmap Level 1 in later sprint)
- ✅ Matches VOIDEXA_INTENT_SPEC.md section 2 exactly
- ✅ 642 tests still green
- ✅ Commits pushed, Vercel deployed
