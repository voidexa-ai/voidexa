# CLAUDE.md — Cockpit Immersive HUD + Seat Height Fix

## What This Is
Two connected fixes for the Vattalus fighter cockpit experience:

### Fix 1: Pilot seat height (urgent — quick)
User reports "sitting way too low inside the spaceship." Camera is below dashboard level. Needs to be raised to canopy eye-level.

### Fix 2: Immersive HUD on cockpit screens (big feature)
User's vision — and it's a good one: the HUD data (hull, shield, velocity, nearest target, dock prompt, etc.) that currently floats as 2D overlays on screen should instead render INSIDE the cockpit on the physical screens you can see in the model. 

When in first-person cockpit view → HUD is baked into cockpit screens as live textures.
When in third-person view → HUD stays as 2D overlays (as it is now).

This matches how Star Citizen, Elite Dangerous, No Man's Sky handle cockpit immersion.

## Read SKILL.md for full implementation.

## Rules
- Git backup first
- Build must pass: `npx next build`
- Deploy: `git push origin main`
- Keep third-person 2D HUD untouched — only first-person gets immersive HUD
- Do NOT re-upload cockpit .glb
- Do NOT touch ship loading logic (that's working)
- If immersive HUD is too ambitious in one build, land Fix 1 separately first

## Decision Point
SKILL.md includes BOTH fixes. If Claude Code judges the immersive HUD too complex for one run, land Fix 1 (seat height) first, then tackle Fix 2 as follow-up. Report back what landed.
