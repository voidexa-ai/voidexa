# CLAUDE.md — voidexa Round A Critical Fixes
## April 16, 2026

## What This Is
Three critical fixes from SKILL_FINAL_POLISH.md Round A that must land before any gameplay testing can continue.

## Project
- C:\Users\Jixwu\Desktop\voidexa (Next.js 16, Vercel Pro)
- Deploy: `git push origin main` (auto-deploy via Vercel+GitHub)
- Never use `main:master` or `npx vercel --prod`

## The 3 Fixes

### CC-A1: Cockpit Interior Repositioning [CRITICAL]
Currently: cockpit interior renders in front of camera, blocks pilot view.
Fix: move interior DOWN and BEHIND. Dashboard below eye level. Frame at edges only.
Try hardcoded offsets first. If that fails, fallback to manual positioning via /assembly-editor.

### CC-A2: Ship Model Loading Fallback [CRITICAL]
Currently: ship sometimes appears as blocky cyan column.
Fix: proper loading state, retry logic, graceful fallback.

### CW-A5: Apps Visibility [MEDIUM]
Currently: Apps buried in About dropdown.
Fix: add Apps (BETA) to Products dropdown for visibility.

## Read SKILL.md for detailed implementation instructions.

## Rules
- Git backup first (always)
- One build = one command
- Defensive .trim() on all env vars in API routes
- Minimum font: 16px body, 14px labels, opacity 0.5+
- Do NOT touch: lib/game/, lib/cards/, lib/chat/, lib/achievements/, lib/race/, lib/missions/
- Tests must pass: npx next build (60+ pages)
- After build clean: git push origin main
