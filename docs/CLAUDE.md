# VOIDEXA CLAUDE.md

## CURRENT SPRINT
**Sprint 16 — Performance + Asset Pipeline + Visual Polish** (April 19, 2026)
Skill file: `docs/skills/sprint-16-performance-and-asset-pipeline.md`

## MODEL
Always use `claude-opus-4-7`. Opus 4.6 is deprecated. Use `/effort xhigh` for this sprint.

## NON-NEGOTIABLE STANDARDS
- Body text >=16px, labels >=14px, opacity >=0.5 — every page, no exceptions
- All voidexa AI products display "Powered by Claude + GPT + Gemini — orchestrated by voidexa"
- All Vercel env vars use `.trim()` in API routes (trailing whitespace bug)
- File size limits (Tom's rules): React components max 300 lines, `page.tsx` max 100, lib files max 500, hooks max 300
- UTF-8 without BOM on all file writes
- PowerShell uses semicolons, not `&&`, no em-dashes in scripts

## GIT DISCIPLINE
- Backup tag before major changes: `git tag backup/pre-sprint-N-YYYYMMDD`
- Never commit binary 3D assets (`public/models/` gitignored)
- Run tests + build before committing
- Deploy: `git push origin main` only — auto-deploys via Vercel+GitHub
- Never `main:master`, never `npx vercel --prod`
- 3D models live on Supabase Storage bucket `models`

## SINGLE SOURCES OF TRUTH
- `docs/VOIDEXA_INTENT_SPEC.md` — canonical product spec, supersedes older docs on overlap
- `docs/VOIDEXA_GAMING_COMBINED_V3.md` — gameplay mechanics bible
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` — landmarks, NPCs, encounters, quest chains

## GHAI POLICY (never conflate)
- Platform-GHAI = in-game V-Bucks, active, $1 = 100 GHAI, Stripe top-up, no real-world value
- Crypto-GHAI = Solana token, separate project, parked pending ADVORA legal review
- Different things. Never blend in UI or audit.

## CRITICAL CONFIDENTIAL
- BWOWC and other crypto/gaming projects: NEVER discussed publicly or placed on any website until Jix explicitly authorizes launch

## WORKFLOW
- Plan in chat with Jix before writing skill files
- Build in Claude Code per skill file instructions
- PowerShell for ops
- Read files with `view` before editing — do not guess file contents
- After changes, Jix verifies live via Chrome extension before next sprint begins

## STOP CONDITIONS (universal)
- Never modify files outside sprint scope without explicit approval
- Never commit with failing tests
- Never invent file paths — grep first if unsure
- Never add new dependencies without noting them in the report

## CURRENT KNOWN LIMITATIONS (post-Sprint-15)
- BoostTrail GPU thrashing under sustained boost (FIXED in Sprint 16 Task 1)
- USC (289 stk), Expansion, Hi-Rez full ships not loaded — texture binding broken (FIXED in Sprint 16 Task 2)
- Ship hangar rarity badges all show STARTER (FIXED in Sprint 16 Task 3)
- Quick menu text barely visible (FIXED in Sprint 16 Task 4)
- Controls legend not premium look (FIXED in Sprint 16 Task 5)
- Starmap bottom-right HUD clutter (FIXED in Sprint 16 Task 6)
- NPCs render as cones — Sprint 18
- Tutorial chat-popup + GHAI gate — Sprint 18
- Space Station is flat 2D image — Sprint 17 (star map visual match)
- Star map does not match quick menu reference image — Sprint 17 (dedicated design sprint)
- 2D SVG holographic map — full 3D rework parked as FEATURE-10
- The Hive not built — dedicated Sprint 21 project
- Void Prix partial (waypoint chain visible live) — dedicated Sprint 22 project

## NEXT SPRINT PREVIEW
- Sprint 17: Star Map Visual Match — planet textures, station-ring around voidexa sun, nebula backdrop matching quick menu reference image. Iterative design sprint with screenshot comparison against reference.
