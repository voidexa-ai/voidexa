# CLAUDE.md — Cockpit Orientation Fix

## What This Is
User reports the Vattalus fighter cockpit is oriented wrong — pilot looks at the BACK of the seat instead of forward through canopy. Classic Blender-to-Three.js coordinate mismatch.

## The Fix (simplest first)

Edit `lib/data/shipCockpits.ts`:
```typescript
fighter_light: {
  // ...
  rotation: [0, Math.PI, 0],  // change from [0, 0, 0] — 180° Y rotation
}
```

Read SKILL.md for full troubleshooting and alternative rotations if first fix doesn't work.

## Rules
- Git backup first
- Build must pass: `npx next build`
- Deploy: `git push origin main`
- Do NOT modify the .glb file (already uploaded to Supabase)
- Do NOT touch the Blender conversion script
- Add dev-mode tuning helper if first fix doesn't immediately work

## Status
- Vattalus light fighter cockpit deployed in commit 9b3af26 (works, loads 200 OK)
- Ship mapping works (qs_* → fighter_light)
- ONLY orientation is wrong
- Cached .glb loaded in 193ms — no re-upload needed, just transform change
