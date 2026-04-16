# CLAUDE.md — Cockpit Integration (Vattalus Light Fighter)

## What This Is
Import the Vattalus Sci-Fi Light Fighter Cockpit (purchased April 16, 2026 from CGTrader for $20) into voidexa Free Flight. Maps all small fighter ships (qs_*) to this new cockpit so pilots see a fighter-appropriate interior instead of the generic Hi-Rez industrial bridge.

## Read SKILL.md for full implementation instructions.

## Quick Overview
- **Input:** `C:\Users\Jixwu\Desktop\voidexa\assets\cockpit-vattalus\` (contains cockpit.fbx + textures/)
- **Pipeline:** FBX → Blender conversion → GLB with Draco → Supabase Storage → ship mapping
- **Output:** qs_* ships get fighter cockpit, others keep generic

## Prerequisites
- Blender installed (for FBX→GLB conversion)
- Supabase SUPABASE_SERVICE_ROLE_KEY in .env (for upload script)
- npm/tsx installed

## License
- Vattalus Royalty Free License (CGTrader)
- Commercial use OK (voidexa game monetization OK)
- NO AI training (we just use it as visual asset — compliant)
- NO redistribution of source files

## Key Files Created
- `scripts/convert-cockpit-fbx.py` — Blender conversion script
- `scripts/upload-cockpit-to-supabase.ts` — Upload + DB register
- `lib/data/shipCockpits.ts` — Ship → cockpit mapping
- Updated: Free Flight cockpit view component

## Rules
- Git backup first
- Vattalus assets → `.gitignore` (FBX/PSD sources, only GLB goes public)
- Deploy: `git push origin main`
- Defensive `.trim()` on env vars
- Minimum font sizes still apply if UI changes
