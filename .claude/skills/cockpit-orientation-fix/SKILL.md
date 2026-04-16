---
name: cockpit-orientation-fix
description: Fix Vattalus fighter cockpit orientation in Free Flight. Current issue — pilot camera is looking at the BACK of the seat instead of forward through the canopy. The cockpit model is either rotated 180° wrong or camera is positioned behind the seat. Use this skill when the user reports that the cockpit view shows them looking backward, seeing the seat backrest, or not seeing the canopy window.
---

# Vattalus Cockpit Orientation Fix

## The Problem
User loaded `qs_challenger` with `fighter_light` cockpit. Expected view: sit in pilot seat, look forward through canopy. Actual view: looking at the BACK of the pilot seat (dashboard panels on left/right are correct, but seat backrest fills center of view, no canopy, no space visible ahead).

This is a classic coordinate system mismatch:
- **Blender/FBX native forward:** +Z or +Y (model author dependent)
- **Three.js forward:** -Z
- **glTF spec forward:** -Z

The Vattalus model was authored with its "forward" facing the wrong Three.js direction when exported via our Blender script.

## The Diagnosis (do first)

Open Free Flight with qs_challenger selected. Press V for first-person. Load browser console and run:

```javascript
// Find the cockpit object in the scene
const scene = window.__THREE_SCENE__ || document.querySelector('canvas').__r3f?.state?.scene;
// or via React Fiber
```

If scene inspection is hard, skip to direct fix below.

## The Fix

Edit `lib/data/shipCockpits.ts`. Find `COCKPIT_MODELS.fighter_light`. Change the rotation:

```typescript
fighter_light: {
  url: 'https://[supabase-url]/storage/v1/object/public/models/cockpits/vattalus_fighter_cockpit.glb',
  withSeat: '...',
  scale: 1.0,
  offset: [0, -0.5, -0.3],
  // OLD: rotation: [0, 0, 0]
  // NEW: rotate 180° around Y axis so cockpit faces correct direction
  rotation: [0, Math.PI, 0],  // 180° around Y (horizontal flip)
},
```

**If that still shows seat backrest, try alternative rotations:**

```typescript
// Alternative 1 — cockpit was authored with +Y forward (rare, but some artists do this)
rotation: [-Math.PI / 2, 0, 0],  // tilt -90° around X

// Alternative 2 — combined rotation
rotation: [0, Math.PI, 0],       // 180° around Y (most likely fix)

// Alternative 3 — author used +X forward
rotation: [0, Math.PI / 2, 0],   // 90° around Y
```

**Try Alternative 2 first (`[0, Math.PI, 0]`).** It's the most common coordinate bug and matches what the screenshot shows (seat backrest where canopy should be = cockpit rotated 180°).

## Second issue to fix — camera position vs seat

Even with correct rotation, if the camera is physically behind the seat (negative Z behind backrest), you still won't see through canopy. The camera should be IN FRONT of the seat (where pilot's head is), not behind it.

Look at where FreeFlightPage places the camera relative to cockpit group:

- Camera local position should be approximately `[0, eye_height, slight_forward_offset]` RELATIVE to cockpit
- For Vattalus cockpit specifically: camera should sit at roughly `[0, 1.2, 0.3]` in cockpit-local space

If FreeFlightPage currently positions camera at `[0, 0, 0]` (cockpit origin), and the cockpit model's origin is at the BACK of the seat (not at pilot's head), that explains the "looking at seat back" issue.

**Possible fix in CockpitModel / StandaloneCockpit branch:**

```typescript
// Inside StandaloneCockpit component in components/freeflight/CockpitModel.tsx
// After loading the GLB:

// Offset the cockpit geometry so pilot eye position is at world origin
useEffect(() => {
  if (cockpitRef.current) {
    // Move cockpit geometry backward/downward so camera (at 0,0,0) is at pilot's eye level
    cockpitRef.current.position.set(spec.offset[0], spec.offset[1], spec.offset[2])
    cockpitRef.current.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2])
  }
}, [spec])
```

## Best approach — temporary tuning overlay

Add a developer console helper so user can tune live without rebuilding:

```typescript
// In CockpitModel.tsx — only in dev mode
useEffect(() => {
  if (process.env.NODE_ENV === 'development' && cockpitRef.current) {
    // Expose ref globally for console tuning
    (window as any).__cockpit = cockpitRef.current
    console.log('Cockpit ref exposed as window.__cockpit')
    console.log('Try: window.__cockpit.rotation.set(0, Math.PI, 0)')
    console.log('Try: window.__cockpit.position.set(0, -1.5, -0.8)')
  }
}, [])
```

This lets user tune rotation and offset in real-time in browser console, find working values, then bake them into shipCockpits.ts.

## Recommended Build Order

1. Git backup: `git add -A && git commit -m "backup before cockpit orientation fix" --allow-empty`
2. **Try simplest fix first:** Change `rotation: [0, 0, 0]` to `rotation: [0, Math.PI, 0]` in shipCockpits.ts
3. Build: `npx next build` (must pass)
4. Deploy: `git push origin main`
5. Ask user to reload /freeflight and press V — check if view is correct now
6. If still wrong, add the dev-mode tuning helper from above so user can find working values live
7. Once values work, bake them into shipCockpits.ts and deploy

## What NOT to Do

- Do NOT modify the .glb file itself (it's already on Supabase, re-conversion is expensive)
- Do NOT touch the Blender conversion script
- Do NOT re-upload the .glb
- Do NOT change CC-A1 (old Hi-Rez cockpit offset `[0, -0.8, -1.5]`) — that's separate and working
- Do NOT touch the seat-separated variant yet (`vattalus_fighter_cockpit_with_seat.glb`) — we're using the base one

## Success Criteria

- User reloads /freeflight with qs_challenger selected
- Presses V
- Sees: canopy frame at screen edges, dashboard at bottom, clear forward view to stars/planets/hub
- Does NOT see: seat backrest, ceiling panels, or "looking backward" view

## Report Back

After fix:
1. Which rotation/offset values worked
2. Build + deploy confirmation  
3. If dev-mode tuning helper was needed
4. Final working values for `shipCockpits.ts` — baked in and deployed
