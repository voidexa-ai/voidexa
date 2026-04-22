# voidexa — CLAUDE.md

**Project memory for Claude Code sessions on voidexa repo.**

Location: `C:\Users\Jixwu\Desktop\voidexa\CLAUDE.md`
Repo: `voidexa-ai/voidexa` (Public, TypeScript)
Owner: Jix (Jimmi Wulff, CVR 46343387, Vordingborg DK)
Model: `claude-opus-4-7` only (NOT 4.6)

---

## PROJECT IDENTITY

voidexa.com is a multi-product sovereign AI infrastructure platform combining:
- AI trading bot (live, regime-based, backtested +194.79%)
- Quantum multi-AI debate engine (4 providers: Claude, Gemini, GPT, Perplexity — 960 tests)
- Void Chat (3 providers: Claude, ChatGPT, Gemini)
- Quantum Forge (debate-to-build pipeline)
- Gaming universe (257-card battle, Free Flight, Star Map, 5 zones)
- GHAI virtual currency ($1 = 100 GHAI, V-Bucks model)
- Comlink encrypted messenger (parked)
- KCP-90 compression (v3 95.67% verified, 4-layer)
- Jarvis PC assistant (v4.1.0, 668 tests, 26 voice commands)
- AEGIS security monitor (hardware, AFS-43)
- Break Room social space (Universe dropdown position 8)

---

## CORE STACK

- **Framework:** Next.js 16 + React 19 + TypeScript
- **Deploy:** Vercel Pro (auto-deploy via GitHub)
- **Production branch:** `main` (since April 15 — master is STALE)
- **Database:** Supabase EU (`ihuljnekxkyqgroklurp`, 58 tables, RLS enabled)
- **Storage:** Supabase Storage bucket `models` (3D GLBs), `intro/` (cinematic)
- **Payments:** Stripe (webhook `we_1TLluLDVfBjAC4z8878uAbqXl`)
- **Auth:** Supabase SSR + AuthProvider

---

## CRITICAL RULES (never violate)

### Code delivery
- FULL copy-paste blackbox only — never line-edits
- NO a/b/c option menus — give direct answer
- Short first, expand on request

### Git (voidexa repo)
- `git push origin main` ONLY
- Post-push MANDATORY: `git status` clean + `git log origin/main --oneline -3`
- Commit SKILL.md FIRST in any sprint
- Explicit staging (not `git add .`)

### File size limits
- React components: MAX 300 lines
- page.tsx files: MAX 100 lines
- lib/ files: MAX 500 lines

### PowerShell (if needed)
- Use `;` not `&&`
- ASCII only — NO em-dashes (breaks scripts, proven twice)
- UTF-8 without BOM
- Danish Downloads = "Overførsler"

### Vercel env vars
- ALWAYS `.trim()` in API routes

### Model
- Always `claude-opus-4-7`

---

## SPRINT HISTORY

| Sprint | Commit | Tests | Feature |
|---|---|---|---|
| Sprint 13c | `19f4178` | 658 | Kling/Veo MP4 cinematic |
| Sprint 14a | `6d67a4d` | 718 | Auth-lock storm fix |
| Sprint 15 | `20231ce` | 766 | Flight foundation |
| Sprint 16 | `e833c73` | 800 | BoostTrail GPU |
| Sprint 17 SKILL | `e9d6efa` | — | Pushed, Tasks 2-8 NOT executed |
| Alpha set | `b47053e` | — | 1000-card alpha on main |
| **AFS-1 complete** | `8d3a1e6` | **825** | **Homepage cinematic repair** |
| **AFS-1d** | `357e1a9` | 825 | **Ultrawide backdrop PNG** |

---

## SESSION LOG

### Session 2026-04-22 — Sprint AFS-1 COMPLETE (+ 1b, 1c, 1d hotfixes)

**Status:** ✅ SHIPPED to production, live verified
**Tag:** `sprint-afs-1-complete`
**Tests:** 825/825 green
**Final HEAD:** `357e1a9`

**Full commit chain on main:**
```
357e1a9 feat(afs-1d): add ultrawide 1928x816 still frame, matches viewport aspect
fa01588 Revert "fix(afs-1c): still frame object-fit cover to contain, full scene visible"
dee8ffa fix(afs-1c): still frame object-fit cover to contain, full scene visible (reverted)
8d3a1e6 docs(sprint-afs-1): mark sprint complete, record 7 commits + 825 tests green
b8aed26 test(homepage): AFS-1 regression suite (25 tests)
85c830f fix(afs-1): checkbox + replay link contrast
228d79e fix(afs-1): Bespoke -> Custom-built apps
122ac57 fix(afs-1): per-session audio gate via sessionStorage
cb16c40 fix(afs-1): MUTE button deleted (IntroVideo 151 -> 73 lines)
fa5d379 fix(afs-1): matched-aspect still frame upload
a819608 chore(sprint-afs-1): SKILL.md + upload script
```

**6 tasks executed:**
1. FFmpeg extracted video last frame (WRONG — see AFS-1b)
2. MUTE button deleted from IntroVideo.tsx
3. Sound popup moved to sessionStorage
4. "Bespoke" → "Custom-built apps" (EN + DA)
5. Checkbox + Replay link contrast (opacity 0.95, weight 500, text-shadow)
6. Vitest regression suite (25 tests) — deviation from Playwright in SKILL (saved ~300MB deps)

**Hotfixes chain:**

**AFS-1b:** Restored Jix's original 1536×1024 Runway PNG to Supabase (overwrote video-frame extract which had wrong composition — camera-through-window reveal was cropped)

**AFS-1c:** Changed `object-fit: cover` to `contain` on still frame (`app/page.tsx:122`) — revealed full scene but introduced black pillar-bars on ultrawide

**AFS-1d:** Final fix. Jix generated new 1928×816 ultrawide PNG (aspect 2.363, matches viewport 2.386). Uploaded to Supabase, reverted AFS-1c (object-fit back to cover). Result: full screen + full composition + no bars.

**Live verified:** Jix confirmed "det virker nu" after Chrome cache clear.

**Known items out-of-scope (unchanged):**
- "We are live. Welcome to voidexa" banner still top of page (Sprint 17 Task 3)
- Starmap nebula zoom too close (AFS-10 Starmap Level 2)
- Video cinematic still ends on OLD still composition, not new ultrawide (Jix: "skal have ændret filmen til den nye baggrund på et tidspunkt — ikke vigtigt nu")
- 15 Dependabot advisories unrelated to AFS-1 (AFS-22 repo hygiene)
- `app/page.tsx` 166 lines (over 100 target)
- "Bespoke" still in HomeProducts.tsx + ProductPanels.tsx (different sections, explicitly excluded from AFS-1)

**Files changed (this sprint):**
- `docs/skills/sprint-afs-1-homepage-repair.md` (new)
- `scripts/upload-intro-frame.mjs` (new)
- `components/IntroVideo.tsx`
- `components/QuickMenuOverlay.tsx`
- `components/SoundPopup.tsx`
- `app/page.tsx` (line 122 reverted to cover after AFS-1d)
- `lib/i18n/en.ts`
- `lib/i18n/da.ts`
- `tests/homepage-flow.test.ts` (Vitest, 25 assertions)
- `CLAUDE.md` (session log)
- `assets/intro/stil_picture_intro_ultrawide.png` (new, committed for provenance)

**Supabase Storage:**
- `intro/stil_picture_intro.png` = 1928×816 ultrawide (current live)

**Rollback tags available:**
- `backup/pre-sprint-afs-1-20260422`
- `backup/pre-sprint-afs-1b-20260422`

---

### BATCH 1 SKILLs PUSHED (AFS-4, AFS-5, AFS-7 ready)

Sprint SKILL files committed but NOT executed. Claude Code can run them independently when Jix ready:

- `docs/skills/sprint-afs-4-admin-data-pipeline.md`
- `docs/skills/sprint-afs-5-cards-blank-art.md`
- `docs/skills/sprint-afs-7-legal-pages.md`

All 3 parallel-safe with each other (no shared files).

---

## ACTIVE P0 BUGS (remaining)

| Bug | Fix |
|---|---|
| ~~Homepage cinematic + quick menu~~ | ✅ **AFS-1 COMPLETE** |
| `/login`, `/signin`, `/wallet`, `/settings`, `/account` 404 | AFS-2 |
| `/game/card-battle`, `/game/deck-builder`, `/game/pilot-profile`, `/game/shop` 404 | AFS-3 |
| Admin Control Plane ZERO data | AFS-4 (SKILL ready) |
| 257 Cards blank art | AFS-5 (SKILL ready) |
| Shop 26 cosmetics "COMING SOON" | AFS-6a |
| `/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt` 404 | AFS-7 (SKILL ready) |
| Starmap Level 2 nebula zoom | AFS-10 |
| Cinematic video end-frame ≠ new backdrop | AFS-11 (future, low prio) |
| "We are live. Welcome" banner | AFS-12 (polish) |
| Danish i18n overflade-only | AFS-26 |

---

## DATA SAFETY CHECKLIST (every sprint)

Before marking sprint complete:
- [ ] `git status` clean
- [ ] `git log origin/main --oneline -3` shows our commit at HEAD
- [ ] Untracked reviewed
- [ ] Tag pushed: `git push origin sprint-afs-N-complete`
- [ ] If UI: live-verify on voidexa.com (incognito, hard-reload)
- [ ] CLAUDE.md updated
- [ ] SKILL.md committed first

---

## AUTHORITY HIERARCHY

1. Live audit (Claude in Chrome)
2. GROUND_TRUTH.md raw log
3. INDEX files (00-18)
4. userMemories
5. Claude session context

Never guess. Search INDEX → raw → past chats → only then ask Jix.
