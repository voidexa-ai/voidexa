# CLAUDE.md — voidexa Round B High-Priority Fixes
## April 16, 2026

## What This Is
Six high-priority fixes from SKILL_FINAL_POLISH.md Round B. These polish the site's visible surface: homepage, shop, achievements, white paper, starter ships, and galaxy footer.

## Project
- C:\Users\Jixwu\Desktop\voidexa (Next.js 16, Vercel Pro)
- Deploy: `git push origin main` (auto-deploy via Vercel+GitHub)
- NEVER use `main:master` or `npx vercel --prod`
- .trim() env vars defensively (recurring whitespace bug)

## Round A (landed apr 16) — DO NOT re-touch
- CC-A1 Cockpit interior repositioning — DONE
- CC-A2 Ship loading fallback — DONE
- CW-A5 Apps (BETA) in Products dropdown — DONE

## The 6 Round B Fixes

### CC-A3: Shop "All" Tab [HIGH]
Add "All" tab that shows every item across all categories.

### CC-A4: Homepage Sections [HIGH]
Homepage is ONLY star map. Add below: stats counter, product cards grid, "Built from Denmark", footer.

### CC-A5: Footer Sizing on Galaxy View [HIGH]
"Operating globally from Denmark. CVR-nr: 46343387" too prominent on /starmap. Reduce font to 12px, opacity 0.5.

### CC-A6: Achievements Visual Polish [HIGH]
Page looks dull vs shop. Apply rarity glow borders, larger icons, gradient progress bars, gold shimmer on completed, locked/greyed style.

### CC-A7: White Paper GHAI Section [HIGH]
/white-paper is blank. Add GHAI token image + teaser text + "Coming soon pending ADVORA" note.

### CC-A8: Starter Ship Selection [HIGH]
6 FREE starter ships defined. Large ships LOCKED with price.

## Read SKILL.md for detailed implementation instructions.

## Rules
- Git backup first (always)
- Build all 6 fixes in ONE Claude Code run
- Minimum font: 16px body, 14px labels, opacity 0.5+
- Do NOT touch: lib/game/, lib/cards/, lib/chat/, lib/achievements/, lib/race/, lib/missions/
- After build clean: `git push origin main`

## NOT in this build
- Danish translations (CW-A1, CW-A2) — separate Cowork task
- Round C gameplay fixes (card entry, collision, roll thrusters, etc.)
- Round D model uploads
