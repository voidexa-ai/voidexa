# CLAUDE.md — Remap Cockpit In-World HUD Screens for Vattalus

## What This Is
Fix 1 (seat height) landed and verified — user can now see forward through canopy.

Now: user reports that in-world HUD screens ARE being rendered (visible in screenshot — top strip with flight data, bottom-center two graph panels) but they're positioned for the OLD Hi-Rez cockpit layout. On Vattalus they sit in wrong spots — mostly above the canopy frame and in bottom corners, while the actual physical dashboard screens of the Vattalus model (central dark rectangle panels) remain empty/black.

## What We Discovered

The codebase already has in-world HUD rendering — 3D planes with live textures attached to the cockpit group, NOT separate 2D DOM overlays. Canvas count = 2 on the page but HUD elements are NOT in DOM (they're in the Three.js scene).

This means we don't need to build new HUD-in-cockpit from scratch. We just need to:
1. Find the existing in-world HUD plane positions  
2. Add per-cockpit-type position overrides (Vattalus gets its own positions)
3. Re-align planes to sit ON the Vattalus physical screen surfaces

## Read SKILL.md for investigation + fix plan.

## Rules
- Git backup first
- Build must pass: `npx next build`
- Deploy: `git push origin main`
- Do NOT break Hi-Rez cockpit HUD positions (they work)
- Do NOT modify the .glb files
- First step is RECON — find where HUD planes are defined. Report back with paths/positions BEFORE guessing new coordinates.
