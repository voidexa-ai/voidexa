---
name: sprint-15-flight-foundation
description: Fix flight controls, encounter render-kill, homepage video UX, and entry routing. Replaces blocking exploration modals with a holographic HUD call panel. Rebinds Q/E from translation to roll. Adds rotation inertia. Adds session-based video skip logic and audio gate popup. Unifies homepage CTA routing. Debugs boost trail particle rendering.
sprint: 15
priority: P0 (unlocks all downstream sprints — game loop must feel correct before any further work)
status: pending
estimated_effort: 1 session (6-10 hours)
model: claude-opus-4-7
effort: xhigh
---

## CONTEXT

Live audit completed April 19, 2026 with Chrome extension. Audit confirmed multiple interlocking issues that together make free flight feel broken. Root cause analysis revealed that "planet lag" reported across multiple sprints is actually encounter-modal render-kill (FPS drops from 114 to 0 when exploration modal opens, recovers to 115 after dismiss). Fixing the modal fixes lag, "hovering asteroids," and UX flow-breaking in one stroke.

This sprint unblocks every downstream sprint. After this, flight controls match user expectations, entry flow is consistent, and encounters no longer destroy game feel.

## REQUIRED READING BEFORE STARTING

- `docs/VOIDEXA_INTENT_SPEC.md` sections 2, 4, 5 (homepage, starmap, freeflight intent)
- `docs/VOIDEXA_GAMING_COMBINED_V3.md` part 3 (free flight), part 6 (controls spec)
- Current code state of these files (read with view tool first):
  - `components/freeflight/controls/FlightControls.tsx` — rotation + translation logic
  - `components/freeflight/FreeFlightPage.tsx` — find the W→map keydown listener
  - `components/freeflight/FreeFlightScene.tsx` — secondary candidate for W→map handler
  - `components/freeflight/ExplorationChoiceModal.tsx` — current blocking modal to replace
  - `components/freeflight/ships/BoostTrail.tsx` — particles claim, cone render live
  - `components/starmap/StarMapPage.tsx` — Level 1 entry page
  - `app/starmap/voidexa/page.tsx` — Level 2 page (needs Enter Free Flight CTA)
  - `app/page.tsx` — homepage, video + quick menu
  - `components/home/*` — video player component, quick menu component

## PRE-FLIGHT

1. Create git backup tag: `git tag backup/pre-sprint-15-20260419`
2. Push tag: `git push origin backup/pre-sprint-15-20260419`
3. Run existing tests to confirm baseline: must pass 642+ tests before any changes

## TASK ORDER (dependencies matter)

Execute in this exact order. Each task builds on the previous.

---

### TASK 1 — Create shared HUD call panel component

**File to create:** `components/freeflight/hud/HUDCallPanel.tsx`

This is the single component replacing all blocking overlays going forward.

**Requirements:**
- Absolute-positioned HTML/CSS overlay
- Position: top-left corner, offset 24px from edges (cockpit-style)
- Dimensions: max 320px wide, 140px tall
- Background: rgba(0, 20, 40, 0.75), backdrop-blur 4px MAX (no heavier blur — performance)
- Cyan border 1px solid rgba(0, 212, 255, 0.6), border-radius 8px
- Subtle scan-line pattern overlay (CSS linear-gradient repeating)
- NEVER use full-screen overlays
- NEVER use fixed inset:0 backdrop
- Does not touch the Three.js canvas or block render loop
- Internal structure:
  - Left: icon/portrait (48x48, rounded)
  - Right: title + subtitle + action buttons
- Props interface:

```typescript
interface HUDCall {
  id: string
  type: 'exploration' | 'npc' | 'hostile' | 'mission' | 'system'
  title: string          // e.g., "Loose Breakfast Crate"
  subtitle?: string      // e.g., "EXPLORATION · CORE ZONE"
  iconUrl?: string       // portrait for NPC, icon for others
  flavor?: string        // italic quote line
  body?: string          // main description
  choices: Array<{
    id: string
    label: string
    reward?: string      // e.g., "+30 GHAI"
    onSelect: () => void
    variant?: 'primary' | 'secondary' | 'danger'
  }>
  autoDismissMs?: number // default 8000 for low priority, undefined = stay
  onDismiss: () => void
}
```

- Type → styling map:
  - `exploration` = cyan border, no urgency
  - `npc` = cyan border, portrait prominent
  - `hostile` = red pulsing border (CSS animation), audio beep
  - `mission` = gold border
  - `system` = orange border
- Audio: play short cyan "incoming" beep on mount (use existing `/public/sounds/scanner-ping.mp3` for now; proper ElevenLabs voice preview in Sprint 23)
- Accept via Enter key OR clicking primary choice
- Dismiss via Escape key OR clicking outside panel
- If `autoDismissMs` set and no interaction → fade out after timeout, call `onDismiss`
- Dismissal must log to a "missed transmissions" store for later recall (Zustand store `useMissedCalls`)
- Ensure Tom's file limits: max 300 lines

**Acceptance test:** Component renders standalone, no backdrop-blur, no fullscreen overlay, FPS stays at baseline when mounted.

---

### TASK 2 — Replace ExplorationChoiceModal usage with HUDCallPanel

**Files to modify:**
- `components/freeflight/ExplorationChoiceModal.tsx` — keep file but deprecate, or delete and replace callers
- `components/freeflight/useExplorationResolved.ts` — update if it references the old modal
- All callers that currently render `<ExplorationChoiceModal>` must switch to the new panel
- The encounter content (flavor, body, choices, GHAI rewards) stays identical — only the shell changes

**FPS test requirement:** After replacement, trigger an exploration encounter in dev mode and measure FPS via `performance.now()` delta. FPS must NOT drop below 60 during encounter display. Baseline is 102-120 FPS. If FPS drops, the panel is using heavy CSS — strip `backdrop-filter` entirely, use flat opacity background.

---

### TASK 3 — Fix W→Holographic Map keydown binding

**Investigation first:**
- `grep -r "KeyW\|'w'\|\"w\"" components/freeflight/ app/freeflight/ lib/game/`
- Find ALL keydown listeners that reference W
- Expected: one in `FlightControls.tsx` for thrust (keep), another somewhere (likely `FreeFlightPage.tsx` or `useWarp.ts`) that opens the warp map (remove or rebind)

**Fix:**
- Remove the W→map handler completely
- Rebind map-open to `KeyM` (explicit, documented)
- Also add `Tab` as secondary map-open key (convention for map in space games)
- Map closes on ESC (already works but verify)

**Regression test:** Pressing W only thrusts forward. Pressing M opens map. Pressing ESC closes map.

---

### TASK 4 — Rebind Q/E from translation to roll rotation

**File:** `components/freeflight/controls/FlightControls.tsx`

**Current broken code (lines ~79-80):**
```typescript
if (k['KeyQ'] || k['ControlLeft']) thrust.sub(tmpUp)
if (k['KeyE'] || k['ShiftRight']) thrust.add(tmpUp)
```

**Replace with roll logic:**
- Add `roll` ref alongside existing `yaw` and `pitch`
- Q = roll left (counter-clockwise when viewed from behind)
- E = roll right (clockwise)
- Roll rate: smooth, max ~1.5 rad/sec
- Roll is rotational — ship visually rolls around Z-axis, does not translate
- Update Euler order to `'YXZ'` → include roll as Z component in euler set: `tmpEuler.set(pitch.current, yaw.current, roll.current, 'YXZ')`
- Vertical translation (up/down) moves to new keybinds: R = up, F = down (document in legend) — or leave out entirely if unused

**Regression test:** Holding Q visually rolls ship left (star background rotates), does not translate downward. E rolls right.

---

### TASK 5 — Add rotation inertia (angular velocity + damping)

**File:** `components/freeflight/controls/FlightControls.tsx`

**Current broken code (line ~87):**
```typescript
tmpEuler.set(pitch.current, yaw.current, 0, 'YXZ')
s.quaternion.setFromEuler(tmpEuler)
```
This sets quaternion directly from input → instant snap, no inertia.

**Replace with angular velocity integration:**
- Add `angularVelocity` ref: `{ x: 0, y: 0, z: 0 }` (pitch rate, yaw rate, roll rate)
- Mouse movement no longer sets pitch/yaw directly — it pushes to `angularVelocity`
- Each frame:
  - Integrate `angularVelocity` into `pitch/yaw/roll` refs: `yaw += angularVelocity.y * dt`
  - Apply damping: `angularVelocity.x *= 0.92; angularVelocity.y *= 0.92; angularVelocity.z *= 0.92`
  - Q/E rolls contribute to `angularVelocity.z` not direct roll ref
- Tuning constants:
  - Mouse sensitivity: 0.003 rad per px of movement (damping absorbs instant spikes)
  - Angular damping: 0.92 per frame at 60fps (fast enough to feel responsive, slow enough to feel weighty)
  - Max angular velocity: 3 rad/sec per axis (clamp)

**Regression test:** Quick mouse flick → ship continues rotating briefly after mouse stops. 180° flip takes roughly 1-1.5 seconds (not instant). Matches FPV drone feel described in game context doc.

---

### TASK 6 — Update keybind legend to show all keys

**File:** find the legend component (likely in `FreeFlightPage.tsx` or new `components/freeflight/ControlsLegend.tsx`)

**New legend content (must match reality after Tasks 3-5):**

```
WASD · THRUST
Q / E · ROLL LEFT / RIGHT
R / F · ASCEND / DESCEND (if used)
MOUSE · LOOK (CLICK CANVAS TO LOCK)
RMB · FREE LOOK · SCROLL · ZOOM
SHIFT · BOOST · SPACE · BRAKE
M / TAB · WARP MAP
V · COCKPIT · E · DOCK · F · SCAN
ESC · MENU
```

Styling stays as-is. Minimum font 14px per voidexa UI standards.

---

### TASK 7 — Fix homepage CTA routing consistency

**Files:**
- `app/page.tsx` (homepage with video + quick menu)
- Find the "Enter Star Map" button component

**Current inconsistency:**
- "Enter Star Map" button (on quick menu) → `/starmap/voidexa` (Level 2)
- Universe panel card (on quick menu) → `/starmap` (Level 1)

**Fix:**
- Both route to `/starmap` (Level 1 galaxy view)
- Users zoom into Level 2 by clicking voidexa planet (existing mechanic)
- Rationale: Level 1 = mystery + claim-your-planet + scalability. Users should always enter via the wide view.

---

### TASK 8 — Add Enter Free Flight CTA to Level 2 starmap

**File:** `app/starmap/voidexa/page.tsx` (or the component it uses)

**Add:** button "ENTER FREE FLIGHT" matching the same styling as the Level 1 `/starmap` button, positioned bottom-center.
- Route: `/freeflight`
- Loading transition: 2-3 sec "Requisitioning your ship from docking bay..." per V3 intent spec section 11
- Behavior: identical to Level 1's "EXPLORE THE UNIVERSE" CTA

---

### TASK 9 — ESC input debounce

**File:** wherever ESC handlers live (likely multiple files — `FlightControls.tsx`, `HolographicMap.tsx`, `FlightMenu.tsx`, new `HUDCallPanel.tsx`)

**Problem:** ESC inputs are buffered. User presses ESC to close map, nothing happens, then later a Flight Menu appears unexpectedly.

**Fix:**
- Centralize ESC handling into a single Zustand store: `useEscStack`
- Each modal/overlay registers itself to the stack on mount, unregisters on unmount
- Single global ESC handler pops the topmost registered modal
- Debounce ESC to 150ms (ignore repeated presses within that window)
- Priority order: HUD call panel → Holographic map → Flight menu → (root) Flight menu open

---

### TASK 10 — Debug BoostTrail particle rendering

**File:** `components/freeflight/ships/BoostTrail.tsx`

**Symptom:** Code uses `<points>` with additive blending. Live rendering shows solid cyan cylinder/column, not particle spray.

**Investigation steps:**
1. Open the file, confirm it's actually mounted in the scene graph (add console.log on mount)
2. Check if `BufferGeometry` attributes are populated — the `position`/`color`/`size` arrays may be zeroed out, causing all particles to render at origin
3. Verify `PointsMaterial` has `sizeAttenuation: true` and proper `size` — if size is 0.35 world units, particles may be rendering as tiny dots that look like a beam
4. Check the vertex shader for size attribute — Three.js `PointsMaterial` does NOT read custom `size` attribute by default; needs custom ShaderMaterial OR scale via `sizeAttenuation`
5. Check if there's a SECOND unrelated mesh being rendered behind the ship (deprecated cone geometry never removed)

**Likely root cause:** The custom `size` attribute is set but ignored because `PointsMaterial` uses uniform size not attribute size. Fix by either:
- A) Using a custom `ShaderMaterial` that reads `attribute float size`
- B) Giving up on per-particle size, use uniform size + multiple `<points>` systems for size variation
- C) Check if the cone is a separate legacy mesh elsewhere — delete it

**Verification:** Third-person view, press Shift to boost, particles should visibly spread and fade. Should NOT look like a solid cylinder.

---

### TASK 11 — Homepage audio gate + session-based video skip

**Files to modify:**
- `app/page.tsx` OR homepage video component (likely `components/home/HomepageVideo.tsx` or similar)
- New component: `components/home/AudioGatePopup.tsx`

**Part A — Audio gate popup (BUG-13):**

Before video begins playing, show popup:
- Black semi-transparent background rgba(0,0,0,0.85)
- Fills 70% width, 50% height, centered
- Large heading: "ENABLE SOUND FOR BEST EXPERIENCE" (48px bold)
- Two big buttons side by side:
  - YES — solid green background (#22c55e), white text, 200×60px
  - NO — solid red background (#ef4444), white text, 200×60px
- Video is paused/not started until user clicks
- YES → video plays with audio unmuted
- NO → video plays muted
- Choice saved to `localStorage.voidexaAudioPreference` as 'enabled' | 'muted'
- Returning users with existing preference do NOT see popup again

**Part B — Session-based video skip:**

Current behavior: video plays every visit to `/` unless localStorage flag set.

New behavior:
- On mount of `/`, check `sessionStorage.hasSeenIntroThisSession`
- If true → skip video, go directly to quick menu
- If false → play video, then set `sessionStorage.hasSeenIntroThisSession = 'true'`, then show quick menu
- `sessionStorage` clears when browser closes → next day user sees video again (as desired)

**Part C — Separate skip controls:**

Current: single "Don't show quick menu next time" checkbox skips BOTH video AND quick menu.

New: two independent localStorage flags:
- `voidexaSkipIntroVideo` (boolean) — permanently skip video even in fresh sessions
- `voidexaSkipQuickMenu` (boolean) — permanently skip quick menu, go directly to `/starmap`

Quick menu UI:
- Two checkboxes labeled:
  - "Don't show intro video on future visits"
  - "Skip quick menu on future visits (go directly to star map)"
- Plus a small text link at bottom: "Replay intro video" — manually triggers video playback without affecting preferences

**Logic table:**

| skipVideo | skipQuickMenu | sessionSeen | Flow |
|---|---|---|---|
| false | false | false | Video → quick menu |
| false | false | true | Quick menu only |
| false | true | — | Video once, then direct to starmap always |
| true | false | — | Quick menu only, never video |
| true | true | — | Direct to `/starmap`, no video, no menu |

If both skipVideo and skipQuickMenu are true, user can always reach quick menu manually at `/?menu=1` or by clearing preferences. Include a "Reset onboarding preferences" link somewhere in settings (future sprint if settings page doesn't exist yet).

---

## BUILD STEPS

1. Read all required files listed in REQUIRED READING
2. Execute Task 1 (HUD panel component)
3. Execute Task 2 (replace modal)
4. Run tests, verify no regressions
5. Execute Tasks 3-5 (flight controls + W-map + Q/E + inertia)
6. Run tests
7. Execute Task 6 (legend)
8. Execute Tasks 7-8 (routing)
9. Execute Task 9 (ESC debounce)
10. Execute Task 10 (boost trail debug)
11. Execute Task 11 (audio gate + video skip)
12. Run full test suite — must remain 642+ green (may grow if new tests added)
13. `npm run build` — zero errors
14. `npm run lint` — no new errors
15. Manual verification at `localhost:3000`:
    - Visit `/` fresh → audio gate popup appears, choose YES, video plays with sound
    - After video, quick menu shows
    - Click "Enter Star Map" → lands on `/starmap` (Level 1)
    - Click voidexa planet → zooms to Level 2
    - On Level 2, click "Enter Free Flight" → lands on `/freeflight`
    - In free flight, press W → thrust forward (NOT map open)
    - Press M → map opens
    - Press ESC → map closes
    - Press Q → ship rolls left
    - Press E → ship rolls right
    - Quick mouse flick → ship continues rotating briefly (inertia)
    - Trigger an exploration encounter → HUD panel appears top-left, FPS stays at baseline, flight continues
    - Shift-boost → particle trail visible (not cone)
    - Navigate back to `/` → quick menu shows directly, no video (same session)
    - Close browser, reopen, visit `/` → video plays again (new session)
16. Mobile check at 375×812

## DEPLOY

1. `git add .`
2. `git commit -m "feat(sprint-15): flight foundation - HUD call panel replaces blocking encounter modal, Q/E roll, rotation inertia, M for map, audio gate popup, session-based video skip, Level 2 freeflight CTA, routing unification, boost trail debug"`
3. `git push origin main`
4. Wait for Vercel deploy
5. Test on production in incognito
6. `git tag sprint-15-complete`
7. `git push origin --tags`

## STOP CONDITIONS

Halt and report if:
- Tests regress below 642 green
- Build fails 3 times consecutively
- FPS during encounter HUD panel drops below 60 (Task 2 acceptance criterion)
- Task 3 grep finds no W-key handler outside FlightControls (means the binding comes from an unexpected place — report before guessing)
- Task 10 cannot determine why boost trail renders as cone (report with findings, don't delete and rebuild blindly)

## REPORT BACK

After completion, provide:
- List of files created / modified / deleted with line counts
- Test count (before / after)
- Build status
- Commit hash
- Vercel deployment URL
- Any blockers or unknowns encountered
- Screenshot recommendations for what Jix should verify manually on production
