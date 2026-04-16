# CLAUDE.md — Ship Tagger Internal Tool

## What This Is
An internal-only admin page at /admin/ship-tagger that lets Jix see all ship models side-by-side with 3D previews, then tag each one with:
- Tier (Free / Achievement / Paid Medium / Paid High / Legendary)
- Role (Scout / Fighter / Tank / Striker / Capital / Explorer)
- Suggested price (USD + GHAI)
- Achievement requirement (if Achievement tier)
- Balance notes (free text)

Saves decisions to a JSON file that becomes the source of truth for ship pricing/tiering going forward.

## Why
Jix needs to SEE every ship before deciding tier/price. Text descriptions aren't enough — "AstroEagle" and "CosmicShark" look flashy in renders but hard to judge from name alone. All 62 ship types + 425 skins exist as .glb files. Show them, let him tag them, save decisions.

## Read SKILL.md for full build.

## Rules
- Git backup first
- Build must pass: npx next build
- Deploy: git push origin main
- Admin-only route (use existing admin middleware if present, otherwise just /admin/* not linked in nav)
- Data saves to lib/data/shipTagging.json — commit that file so decisions persist
- Do NOT replace existing shipTiers.ts yet — that's a second step after tagging is done

## Scope boundaries
- This is a TOOL for making decisions, not a final implementation
- After Jix tags ships, we do a follow-up SKILL that migrates shipTiers.ts, ShipPicker.tsx, shop prices, achievement unlocks from the shipTagging.json data
