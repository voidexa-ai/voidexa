---
name: round-a-critical-fixes
description: Execute Round A of SKILL_FINAL_POLISH — three critical fixes that unblock gameplay testing on voidexa.com. Use this skill when fixing the cockpit interior blocking pilot view, the ship model loading fallback, or the Apps dropdown visibility. Triggers on mentions of "Round A", "cockpit interior fix", "ship loading fallback", "Apps visibility", or "critical polish" in the voidexa context.
---

# Round A — Critical Fixes for voidexa

## Context
Part of SKILL_FINAL_POLISH.md 28-issue plan. These 3 fixes unblock gameplay testing. Do ALL three in one build. Git backup before, git push origin main after.

## FIX 1 — CC-A1: Cockpit Interior Repositioning

### Problem
When user enters cockpit view (V key in Free Flight), the interior model renders directly in front of the camera. User sees a metal wall/dashboard wall instead of the canopy window and space beyond.

### Root Cause
The cockpit interior .glb files (hirez_cockpit01_interior through hirez_cockpit05_interior) have their geometry baked at origin with the interior surface facing forward. When mounted at [0,0,0] with pilot camera at [0,0,0], the interior blocks the view.

### Fix Approach (try in this order)

**Approach 1: Hardcoded offsets (try first — quickest)**

Apply these transform offsets to ALL cockpit interiors when rendered in Free Flight pilot view:
- Position: [0, -0.8, -1.5]  (move down 0.8 units, move behind camera 1.5 units)
- Rotation: [0, 0, 0]  (no rotation change)
- Scale: [1, 1, 1]  (no scale change)

File to edit: `components/freeflight/CockpitView.tsx` or wherever the cockpit is mounted in pilot mode.

Look for the code that loads the selected cockpit's .glb and applies transforms. Add:
```typescript
const COCKPIT_INTERIOR_OFFSET = {
  position: [0, -0.8, -1.5] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: [1, 1, 1] as [number, number, number],
}
```

Apply these to the interior model's group transform.

**Approach 2: Per-cockpit offsets (if Approach 1 doesn't work for all 5)**

If cockpit01 looks right but cockpit02 doesn't, create a lookup table:
```typescript
const COCKPIT_OFFSETS: Record<string, { position: [number,number,number], rotation: [number,number,number] }> = {
  'hirez_cockpit01': { position: [0, -0.8, -1.5], rotation: [0, 0, 0] },
  'hirez_cockpit02': { position: [0, -0.7, -1.3], rotation: [0, 0, 0] },
  // etc.
}
```

**Approach 3: Fallback — use assembly editor**

If neither works, add a note in the code: "Use /assembly-editor to find correct offsets, export JSON, paste back here."

### Additional Requirements
- ALL 5 cockpits must be selectable in Change Cockpit menu (currently only 1)
- Update the ship picker UI to show all 5 cockpit options
- Each cockpit gets the same offset treatment (via Approach 1 or 2)

### Success Criteria
- Pilot sees clear forward view through canopy
- Dashboard visible at bottom of screen (below eye level)
- Frame/canopy edges visible at screen edges
- All 5 cockpits selectable and render correctly

---

## FIX 2 — CC-A2: Ship Model Loading Fallback

### Problem
When a ship model fails to load from Supabase Storage CDN, the game shows a blocky cyan column (Three.js default mesh) instead of the textured ship. Happens in Free Flight and possibly Ship Catalog.

### Root Cause
No loading state or retry logic when GLTFLoader fetches from Supabase CDN. Network failures or slow loads = fallback to default geometry.

### Fix Approach

Create a reusable `SafeShipLoader.tsx` component (or similar) that:

1. **Shows wireframe silhouette while loading**
   - Use a simple BoxGeometry + MeshBasicMaterial with wireframe: true
   - Colored cyan to match voidexa aesthetic
   - Pulses slowly (opacity animation) to show it's loading

2. **Retry logic**
   - Attempt 1: immediate fetch
   - If fails, wait 2000ms, attempt 2
   - If fails, wait 2000ms, attempt 3
   - If all 3 fail, show placeholder with "Loading ship..." text

3. **Final fallback**
   - Clean text placeholder: "Loading ship..." in cyan
   - Optional: small voidexa logo
   - Button: "Retry" that restarts the fetch cycle

### Implementation
Location: `components/shared/SafeShipLoader.tsx`

Wrap existing ship loading in Free Flight with this component. Pass the Supabase URL, fallback name, and optional onLoadComplete callback.

Example usage in Free Flight:
```tsx
<SafeShipLoader 
  url={selectedShip.modelUrl}
  shipName={selectedShip.name}
  onLoaded={(model) => setShipMesh(model)}
  onFailed={() => console.error("Ship failed to load")}
/>
```

### Success Criteria
- No more blocky cyan columns visible to users
- Wireframe silhouette during load
- Graceful degradation if network fails
- User gets feedback (not silent failure)

---

## FIX 3 — CW-A5: Apps Visibility

### Problem
The Apps page (/apps with Comlink, voidexa apps listing) is buried in the About dropdown menu. Users looking for apps won't find it there.

### Fix

In `components/Navigation.tsx` (or wherever the main nav is defined):

1. Find the Products dropdown items
2. Add new item: "Apps (BETA)" linking to /apps
3. Position: after "Custom Apps" entry
4. Badge: small "BETA" tag next to "Apps" text (cyan background)
5. Remove Apps from About dropdown (or keep as duplicate — user's choice)

### Success Criteria
- Apps is visible in Products dropdown
- Clear BETA indicator
- Clicking navigates to /apps

---

## BUILD ORDER

1. Git backup: `git add -A; git commit -m "backup before Round A critical fixes" --allow-empty`
2. Fix 3 first (CW-A5 Apps dropdown — 2 minutes, low risk)
3. Fix 2 next (CC-A2 Ship loading fallback — isolated component)
4. Fix 1 last (CC-A1 Cockpit interior — most complex, needs testing)
5. Run `npx next build` — must pass
6. After build clean: `git push origin main`

## TESTING CHECKLIST

- [ ] Products dropdown shows "Apps (BETA)"
- [ ] /apps loads correctly
- [ ] Free Flight: select ship, fly — no cyan columns
- [ ] Free Flight: disconnect network briefly during ship select — see wireframe fallback
- [ ] Free Flight: V key enters cockpit view
- [ ] Cockpit view: can see forward through canopy
- [ ] Cockpit view: dashboard below eye level
- [ ] Change Cockpit menu: all 5 cockpits selectable
- [ ] Each cockpit renders correctly without blocking view

## WHAT NOT TO DO

- Do NOT touch lib/game/, lib/cards/, lib/chat/, lib/achievements/, lib/race/, lib/missions/
- Do NOT rebuild the cockpit models themselves (just apply offsets)
- Do NOT change the assembly editor or VoidForge
- Do NOT deploy via npx vercel --prod (use git push only)
- Do NOT modify env vars in Vercel manually

## IF THINGS GO WRONG

- Cockpit still blocks view: note it in output, mark CC-A1 as "needs Blender session", proceed with CC-A2 + CW-A5
- Ship loader breaks existing Free Flight: revert CC-A2 commit, keep CW-A5 and CC-A1
- Build fails: paste error output, do NOT deploy
- Deploy succeeds but site breaks: revert with `git revert HEAD` and push

## AFTER COMPLETION

Report back:
1. Which fixes landed successfully
2. Any that needed fallback approaches
3. Build time and test results
4. Anything unexpected

Memory updates will happen in chat based on your report.
