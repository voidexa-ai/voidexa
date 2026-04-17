# voidexa POWER PLAN — autonomous sprint chain (2026-04-17)

This is the master plan for the 8-sprint autonomous run. Every sprint has a SKILL file
in `docs/skills/` describing scope, inputs, gates, and rollback plan. Sprint 10 is owned
externally (Vast.ai card art) and skipped here — see `docs/skills/sprint-10-baseline-art-handoff.md`
for the handoff brief.

## Inputs verified at scan (commit f16d7eb baseline)
- `docs/gemini_universe_content_complete.json` — 80KB, JSON: landmarks/encounters/NPCs/quests
- `docs/sounds/` — 67 numbered MP3s + 1 stray .zip (will be ignored at move time)
- `public/images/shuttle-hero.png` — 2.5MB hero asset for Sprint 8
- `docs/gpt_keywords_homepage.md` — **CORRUPT** (180 bytes UTF-16 PowerShell artifact).
  Sprint 8 falls back to the 4 panel headings supplied in the run prompt
  (Website Creation, Custom Apps, Universe, Tools) plus inferred sub-keywords.
- Test baseline: 599/599 green across 49 suites.
- `claude-opus-4-6` occurrences: 5 (Sprint 0 target).

## Sprint chain
| # | Skill file | Title | Tag on completion |
|---|---|---|---|
| 0 | `sprint-0-model-id-swap.md` | Replace Opus 4.6 IDs with 4.7 | `sprint-0-complete` |
| 6 | `sprint-6-universe-import.md` | Import gemini universe content | `sprint-6-complete` |
| 7 | `sprint-7-sound-system.md` | Rename + sound manager + wiring | `sprint-7-complete` |
| 8 | `sprint-8-homepage-redesign.md` | Shuttle parallax + 4 panels | `sprint-8-complete` |
| 9 | `sprint-9-mtg-mechanics-audit.md` | 257 cards vs MTG keywords | `sprint-9-complete` |
| 10 | `sprint-10-baseline-art-handoff.md` | (skipped — Vast.ai handoff) | — |
| 11 | `sprint-11-mobile-responsive.md` | Mobile audit at 375/768/1024 | `sprint-11-complete` |
| 12 | `sprint-12-final-polish.md` | Font/opacity/error/Lighthouse | `sprint-12-complete` + `mvp-launch-ready` |

## Global rules (apply to every sprint)
1. Backup tag before start: `git tag backup/pre-sprint-N-YYYYMMDD`.
2. `npx next build` clean before deploy.
3. `node node_modules/vitest/vitest.mjs run` — all green or revert.
4. Font minima: 16px body, 14px labels, 0.5 opacity floor on user-facing text.
5. All env reads `.trim()` (Vercel paste-artifact rule, see CLAUDE.md 2026-04-13).
6. Deploy = `git push origin main` only (Vercel auto-deploys, no `vercel --prod`).
7. Tag on completion + push tags.
8. `public/models/` is gitignored content — never commit binary assets there.

## Stop conditions
- Build fails 3 times consecutively after fix attempts → halt, report.
- Test regression vs the 599 baseline → halt, report.
- A critical input file is missing or corrupt that no skill can route around → halt, report.

## Rollback
Each sprint commits a single feature commit on top of the backup tag. To revert:
`git reset --hard backup/pre-sprint-N-YYYYMMDD && git push --force-with-lease`.
Force push only with explicit user approval per CLAUDE.md safety protocol.
