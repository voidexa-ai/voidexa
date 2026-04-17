# Sprint 13b — Cinematic Fix Pass

## Context

Sprint 13 shipped the homepage cinematic structure correctly (16 files, Tom's size limits respected, 654 tests green, overlay system working). But the live site reveals the Three.js scene is only partially rendering. Live audit via Chrome extension found these gaps:

**Working:**
- Phase 3 Arrival scene renders (cyan voidexa star + purple/orange/teal planets visible)
- Overlay fades in at sec 42 (4 boxes in 2x2 grid, Enter Free Flight CTA with glow)
- Title tag correct, no scroll, no KCP-90, no console errors
- File structure matches spec

**Broken or incomplete:**
1. Phase 1 Approach (sec 0-8) renders as black screen — no starfield, no shuttle interior visible
2. Phase 2 Warp (sec 8-12) warp shader does not fire visually
3. Phase 4-5 Door Open shows cyan placeholder rectangle but no galaxy visible through the open door — camera appears to face dark cabin only
4. Skip button is NOT visible anywhere (spec requires top-right from sec 3)
5. After reload, timeline jumps directly to sec 42 end-state instead of replaying from sec 0 (possibly sessionStorage persistence that should be removed for now)
6. Break Room appears in top nav — verify this is intentional placement or leftover from earlier sprint

## Goal

Make every phase of the 45-second cinematic render visibly correct so Jix can experience the film as specified in docs/VOIDEXA_INTENT_SPEC.md section 2. This is a fix pass — do NOT restructure the files. Keep the 16-file split intact.

## Required reads

- docs/VOIDEXA_INTENT_SPEC.md section 2 (film sequence definition)
- docs/skills/sprint-13-homepage-cinematic.md (original sprint brief)
- components/home/HomeCinematic.tsx and all scenes/*.tsx files
- hooks/useCinematicTimeline.ts
- lib/cinematic/config.ts

## Fixes required

### Fix 1: Phase 1 Approach scene content

File: components/home/scenes/SceneApproach.tsx

The scene should show:
- A dense starfield particle system (at least 2000 particles, white/cyan tinted)
- A faint nebula shader or gradient background layer
- voidexa as a distant small light point near center of view
- Camera positioned outside the galaxy, slowly drifting forward
- Shuttle interior framing visible at screen edges (can be a simple dark foreground mesh suggesting cockpit frame if GLB not available)

If the starfield is already in code but invisible, check:
- Points geometry positions are populated
- PointsMaterial size is at least 1.5 with sizeAttenuation true
- Camera near/far planes include the particle positions
- Scene background is set to black, not left as null

### Fix 2: Phase 2 Warp effect must fire visually

File: components/home/scenes/SceneWarp.tsx

Between sec 8 and 12, the warp must be clearly visible:
- Blue tunnel shader OR fallback: radial blue streaks emanating from center
- Starfield stretches into lines (can modify PointsMaterial or use instanced mesh)
- Camera accelerates forward (FOV widens slightly then snaps back)
- Screen tint shifts to blue briefly

If the warp shader from /freeflight exists, import and reuse. If it doesn't exist or is too complex to reuse, implement a minimal version:
- Full-screen shader plane with radial gradient + time-based uniform for line stretching
- Starts at 0 opacity sec 8.0, peaks sec 10.0, fades to 0 at sec 12.0

### Fix 3: Galaxy view through open door

File: components/home/scenes/SceneDoorOpen.tsx

Currently: cargo door opens (cyan rectangle placeholder) but only dark cabin visible.

Should be:
- Through the open door frame, render the SAME galaxy composition as SceneArrival (voidexa star center, Claim Planet distant, stars, nebula)
- Add subtle silhouette meshes in the far distance suggesting gaming landmarks:
  - A dark irregular blob for Hive (at position roughly behind and to the left of voidexa)
  - A faint ring structure for racing track (subtle glow)
  - A small cube/cylinder for Break Room station
- These should be LOW-POLY and DARK — just silhouettes, not detailed

The camera at sec 35-42 should be positioned so the door frame is visible at edges but most of the view is the galaxy beyond it.

### Fix 4: Skip button must be visible

File: components/home/SkipButton.tsx

The button exists in code but is not rendering visibly. Debug:
- Check z-index is higher than Canvas (should be at least 100)
- Check opacity transition logic — should go from 0 to 1 between sec 3 and sec 3.5
- Check position: fixed; top: 24px; right: 24px
- Text should be white with 0.7 opacity, font-size 14px minimum
- Background: rgba(0,0,0,0.5) with border: 1px solid rgba(255,255,255,0.2)
- Simple hover state: opacity 1, scale 1.05

Verify the button is actually mounted in app/page.tsx or HomeRoot.tsx — not just created as a file but never rendered.

### Fix 5: Make the 4 panels feel like glass windows

File: components/home/CinematicOverlay.tsx

Current implementation uses background rgba(0,0,0,0.6) which is too opaque. The panels should feel like semi-transparent glass windows you can see universe through. Update:

- background: rgba(10, 15, 30, 0.35) — dark blue tint, much more transparent
- backdrop-filter: blur(6px) — subtle blur so universe remains visible
- border: 1px solid rgba(150, 200, 255, 0.25) — lighter, slightly blue glass edge
- box-shadow: 0 0 20px rgba(0, 180, 255, 0.08) inset — very subtle inner glow
- Reduce panel size to approximately 300x160px max (from whatever current size is)
- Keep 2x2 grid centered
- Title font 18px, description 14px, CTA 14px — all white with opacity 0.9 for titles and 0.75 for body

The goal is: user sees voidexa Galaxy behind the overlay AS THE MAIN visual, with 4 subtle glass navigation panels floating over it.

### Fix 6: Keep universe animated after overlay fades in

File: components/home/HomeCinematic.tsx or useCinematicTimeline.ts

Currently the entire scene freezes at sec 42 when overlay appears. Instead:
- Stop camera movement and voiceover at sec 42 (correct)
- But keep starfield particle drift continuing (slow rotation of particle cloud)
- Keep planet rotation continuing (voidexa and Claim Planet slowly rotating on their axes)
- This makes the universe feel alive behind the glass panels

### Fix 7: Remove or fix timeline persistence

Problem: reloading the page jumps directly to sec 42 instead of replaying from sec 0.

Debug:
- Check if sessionStorage or localStorage is storing a "seen" flag that skips the film
- Either remove that logic entirely (always play from sec 0) OR set expiry to 24 hours minimum
- For now, remove it so we can test the full film on each reload

### Fix 8: Verify Break Room nav placement

File: components/layout/Nav.tsx or similar top nav component

Top nav currently shows: Home, Products, Universe, About, Break Room

Per Intent Spec section 2, Break Room is planned but not built. It should either:
- Be removed from top nav until Break Room is actually built, OR
- Link to a "Coming Soon" page at /break-room

Check what the current Break Room link does. If it 404s or goes to a stub, remove it from nav. If it goes to a real landing page, leave it but confirm with a comment in the code.

## Non-goals (do not do these in this sprint)

- Do not generate Eleven Labs voiceover (Jix will do manually)
- Do not swap procedural cargo door for real GLB (later sprint)
- Do not refactor the 16-file split (structure is correct)
- Do not add new tests unless fixing a test that broke
- Do not change the 4 panel content or routes

## Pre-flight

1. Verify current state: npm run dev, visit localhost:3000, confirm the bugs above exist
2. Create backup tag: git tag backup/pre-sprint-13b-20260417
3. Confirm tests: npm run test (should be 654 green from Sprint 13)

## Execution

Work through fixes 1-8 in order. After each fix, verify visually in dev mode. Do not batch all fixes and then test — test each one.

Use claude-opus-4-7. Font rules still apply: body 16px minimum, labels 14px minimum, opacity 0.5 minimum (except for intentional subtle overlay tints which can go lower for visual effect only).

File size rules still apply. If a scene file grows above 200 lines during fixes, split.

## Post-flight

1. Run npm run build — must succeed clean
2. Run npm run lint — no new lint errors
3. Run npm run test — must remain at 654 or higher
4. Visual verification at localhost:3000:
   - Load page, observe full 45-sec film from sec 0
   - Phase 1 shows starfield + voidexa dot
   - Phase 2 shows warp visually
   - Phase 3 shows full galaxy
   - Phase 4 shows door opening
   - Phase 5 shows galaxy through door with landmark silhouettes
   - Phase 6 fades in glass panels overlay with universe visible behind
   - Skip button visible top-right from sec 3
   - Reload and confirm film replays from sec 0
5. Commit and push:

```
git add .
git commit -m "fix(sprint-13b): cinematic rendering — all phases visible, skip button, glass panels, nav audit"
git push origin main
```

Report:
- Files changed (with line counts)
- Which fixes resolved which bugs
- Test count
- Commit hash
- Any blockers (e.g., missing assets, shader issues)

## Stop conditions

- Build fails 3 consecutive times after fix attempts → halt, report
- Tests regress below 654 → halt, report
- Cannot find root cause of a bug after reasonable investigation → halt, describe what you tried

## Rollback

```
git reset --hard backup/pre-sprint-13b-20260417
git push --force-with-lease origin main
```

GO.
