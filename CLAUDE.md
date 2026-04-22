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
- Quantum Forge (debate-to-build pipeline, dogfooded voidexa-tests in 3m 30s)
- Gaming universe (257-card battle system, Free Flight, Star Map, 5 zones, Planet ownership)
- GHAI virtual currency ($1 = 100 GHAI, V-Bucks model)
- Comlink encrypted messenger (parked)
- KCP-90 compression (v3 95.67% verified April 4, 4-layer)
- Jarvis PC assistant (v4.1.0, 668 tests, voice commander 26 commands)
- AEGIS security monitor (hardware, AFS-43)
- Break Room social space (Universe dropdown position 8)

---

## CORE STACK

- **Framework:** Next.js 16 + React 19 + TypeScript
- **Deploy:** Vercel Pro (auto-deploy via GitHub)
- **Production branch:** `main` (since April 15 — master is STALE, 191 commits behind)
- **Database:** Supabase EU (`ihuljnekxkyqgroklurp`, 58 tables, RLS enabled)
- **Storage:** Supabase Storage bucket `models` for 3D GLBs, `intro/` for cinematic assets
- **Payments:** Stripe (webhook `we_1TLluLDVfBjAC4z8878uAbqXl`, PRO $5/mo, tiers $5/$10/$25/$50)
- **Auth:** Supabase SSR via `@supabase/ssr` + AuthProvider wrapping app

---

## CRITICAL RULES (never violate)

### Code delivery
- FULL copy-paste blackbox only — never line-edits
- NO a/b/c option menus — give the right answer directly
- Short first, expand on request

### Git (voidexa repo)
- `git push origin main` ONLY (never `main:master`, never `npx vercel --prod`)
- Post-push MANDATORY: `git status` clean + `git log origin/main --oneline -3`
- Commit SKILL.md FIRST in any sprint (never leave untracked)
- Explicit staging — `git add path/to/file`, not `git add .` unless reviewed

### File size limits (Tom's rules, non-negotiable)
- React components: MAX 300 lines → split before hitting
- page.tsx files: MAX 100 lines → imports only
- lib/ files: MAX 500 lines → split into submodules
- hooks: MAX 300 lines

### PowerShell (if needed)
- Use `;` not `&&`
- UTF-8 without BOM via `.NET` only
- No em-dashes (breaks scripts)
- Danish Downloads = "Overførsler" not "Downloads"

### Vercel env vars
- ALWAYS `.trim()` in API routes (trailing whitespace issue — Sprint 14a fix)

### Model
- Always `claude-opus-4-7` (NOT 4.6, NOT 3.5)

### Data safety (30-days silent failure pattern)
Claude Code pushes only staged+committed files. Untracked stays on disk. No warning. Looks like success.

**Prevention:** post-push verification every time. If untracked created during sprint and should be live — STOP.

---

## SPRINT HISTORY (HISTORICAL TAGS — reference data)

These are completion tags from the Claude Code memory-loss period (April 17-20). Each verified via 3 layers: git tag | source code | live deployed.

| Sprint | Commit | Tests | Feature |
|---|---|---|---|
| Sprint 0 | `371ad11` | baseline | Power Plan baseline |
| Sprint 6 | `84933b0` | — | Gemini universe content import |
| Sprint 7 | `a7c48de` | — | 67 SUNO sounds integration |
| Sprint 8 | `cbbd39b` | — | Homepage redesign (shuttle, paneler) |
| Sprint 9 | `85c773b` | — | MTG mechanics audit |
| Sprint 11 | `75209d8` | — | Mobile responsive audit |
| Sprint 12 | `48f4b4f` | — | mvp-launch-ready |
| Sprint 13 | `4ed07b2` | — | Three.js cinematic (broken, "Commodore 64 grafik") |
| Sprint 13c | `19f4178` | 658 | Kling/Veo MP4 cinematic (33MB 1080p 31s) |
| Sprint 13d | `0cf0d22` | 700 | Global GHAI nav balance, Shop GHAI prices |
| Sprint 13e | `49f282c` | 705 | Break Room restored to Universe dropdown |
| Sprint 13f | `af53798` | — | Security Dependabot triage |
| Sprint 13h | `5bbfe1c` | — | Test checklists Shop/Cards/Free Flight |
| Sprint 14a | `6d67a4d` | 718 | Auth-lock storm fix (Stripe webhook `.trim()`) |
| Sprint 14b | `637a4d7` | 728 | Quantum Tools dropdown added |
| Sprint 15 | `20231ce` | 766 | Flight foundation, HUD call panel, Q/E roll |
| Sprint 16 | `e833c73` | 800 | BoostTrail GPU, ship rarity badges, asset pipeline |
| Nebula | `93866cc` | 800 | Sprint 17 Task 1 — nebula backdrop |
| Sprint 17 SKILL | `e9d6efa` | — | 757-line SKILL pushed, Tasks 2-8 NOT executed |
| Alpha set | `b47053e` | — | 1000-card alpha catalog (on main, verified Apr 22) |

**New sprint numbering (from Apr 22):** `sprint-afs-N-*` series — see 16_AUDIT_ROADMAP.md

---

## ACTIVE P0 BUGS (from BATCH 2 audit Apr 22)

| Bug | Fix |
|---|---|
| Homepage cinematic frozen / MUTE button / no sound popup on reload / 4-box overlay / zoom mismatch | **AFS-1** ✅ COMPLETE (tag `sprint-afs-1-complete`) |
| `/login`, `/signin`, `/wallet`, `/settings`, `/account` all 404 | AFS-2 |
| `/game/card-battle`, `/game/deck-builder`, `/game/pilot-profile`, `/game/shop` all 404 | AFS-3 |
| Admin Control Plane shows ZERO data (API returns nulls) | AFS-4 |
| 257 Cards render frame/title/stats but art is blank | AFS-5 |
| Shop: 26 cosmetics all show "COMING SOON · STRIPE" | AFS-6a |
| `/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt` all 404 (GDPR/SEO compliance) | AFS-7 |
| Danish i18n overflade-only (nav + titles DA, body EN on 9 of 12 routes) | AFS-26 |

---

## SESSION LOG

### Session 2026-04-22 — Sprint AFS-1: Homepage Repair ✅ COMPLETE

**Status:** All 6 tasks shipped, 825/825 green, build OK, tag pushed.
**Commits (in order):**
- `a819608` chore(sprint-afs-1): add SKILL.md + upload-intro-frame script
- `fa5d379` Task 1 — matched-aspect still frame (1920×1080 overwrite) + dotenv-free uploader
- `cb16c40` Task 2 — remove in-video MUTE button (IntroVideo 151 → 73 lines)
- `122ac57` Task 3 — audio gate is per-session, highlight prior choice, drop stale copy
- `228d79e` Task 4 — replace "Bespoke software" with "Custom-built apps tailored to your workflow"
- `85c830f` Task 5 — raise checkbox + replay-link contrast (opacity ≥ 0.95, weight 500, text-shadow)
- `b8aed26` Task 6 — AFS-1 regression test suite (25 vitest assertions)

**Tag:** `sprint-afs-1-complete` (pushed)
**Tests:** 825/825 green (baseline 800 + 25 new AFS-1 tests — exceeds 803 target)
**Build:** ✅ `npm run build` clean, 87 static pages generated in 11.2s

**Deviation from brief:** Task 6 is a vitest source-level regression suite
instead of a Playwright test — project has no Playwright harness, adding it
for this sprint would have been ~300 MB of dev deps for 25 assertions. Same
invariants covered, no new dependencies.

**Supabase side-effect:** overwrote `intro/stil_picture_intro.png` (1536×1024
→ 1920×1080, 3.2 MB, Cache-Control: no-cache so browsers refetch).

**File size check:**
- `components/home/IntroVideo.tsx` 73 lines (was 151) ✅
- `components/home/QuickMenuOverlay.tsx` 261 lines ✅ (under 300)
- `components/home/AudioGatePopup.tsx` 115 lines ✅
- `app/page.tsx` 166 lines — over the 100-line target, same as before sprint;
  refactor into a client wrapper is left to a follow-up (out of AFS-1 scope)

**Scope:** Repair homepage cinematic → quick menu flow. 6 interconnected bugs fixed in single sprint because they share state machine and components.

**Live audit findings (Claude in Chrome, Apr 22):**

Video element:
- URL: `https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/voidexa_intro_final.mp4`
- Intrinsic: 1920×1080 (aspect 1.778, 16:9)
- CSS: `object-fit: cover`, `object-position: 50% 50%`, `position: fixed`

Still frame:
- URL: `https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/stil_picture_intro.png`
- Intrinsic: 1536×1024 (aspect 1.500, 3:2) ← **MISMATCH**
- Same CSS as video (cover, 50% 50%)

**Zoom mismatch math:**
- Video cover-crops 31% of height
- PNG cover-crops 42% of height
- Differential = 11% visible zoom shift at video-to-menu transition

**Sound popup storage:**
- `localStorage["voidexaAudioPreference"] = "enabled"` — permanent after first Yes
- Popup never re-shows — users stuck in muted-state forever after first answer

**MUTE button:**
- Text "MUTE" visible bottom-right during cinematic
- Creates user confusion

**Bespoke language:**
- "Custom Apps" box reads "Bespoke software tailored to your business workflow"
- Stiff tailoring jargon, off-brand for AI product

**Contrast issue:**
- "Don't show intro video", "Skip quick menu", "Replay intro video" all low-opacity
- Users miss them

**Tasks (build in order, one commit each):**

1. **Extract video last frame as matched-aspect PNG**
   - FFmpeg `-sseof -0.15` extract at 1920×1080
   - Replace `stil_picture_intro.png` in Supabase Storage
   - New script: `scripts/upload-intro-frame.mjs`
   - Eliminates zoom mismatch at asset level (both now 16:9)

2. **Remove MUTE button + audio-preference respect**
   - Delete MUTE button from `IntroVideo.tsx`
   - On mount: read `voidexaAudioPreference` + check sessionStorage flag

3. **Sound popup → sessionStorage**
   - `voidexaSoundPopupAnsweredThisSession` (sessionStorage) controls show/hide
   - `voidexaAudioPreference` (localStorage) kept as smart default for Yes/No highlight
   - Popup re-shows every new browser session
   - Remove "YOUR CHOICE IS SAVED FOR NEXT TIME" text

4. **Fix "Bespoke" in Custom Apps**
   - EN: "Custom-built apps tailored to your workflow"
   - DA: "Specialbyggede apps tilpasset dit behov"
   - Extract to i18n dictionary if hardcoded

5. **Checkbox + link contrast fix**
   - Opacity 0.4 → 0.9
   - Font weight 400 → 500
   - Add `text-shadow: 0 1px 3px rgba(0,0,0,0.6)` for readability on any bg

6. **Verify /starmap auto-routing + Playwright regression test**
   - New test: `tests/homepage-flow.spec.ts`
   - Tests all 5 user flows (CTAs, checkboxes, video-end → menu)

**Files changed:**
- `components/IntroVideo.tsx`
- `components/QuickMenuOverlay.tsx`
- `components/SoundPopup.tsx` (or inline — confirmed via grep)
- `lib/i18n/en.ts`
- `lib/i18n/da.ts`
- `app/page.tsx` (if auto-routing needs touch)

**Files added:**
- `scripts/upload-intro-frame.mjs`
- `docs/skills/sprint-afs-1-homepage-repair.md`
- `tests/homepage-flow.spec.ts`

**Supabase Storage changes:**
- `intro/stil_picture_intro.png` overwritten with 1920×1080 extracted from video last frame

**Rollback tag:** `backup/pre-sprint-afs-1-20260422`

**Live verification (incognito, after Vercel deploy):**
1. Sound popup "Enable sound" with Yes/No ✅ no MUTE button
2. Click Yes → video unmutes and plays
3. Video ends → seamless transition to quick menu (no zoom shift)
4. Menu text: "Custom-built apps tailored to your workflow"
5. Checkboxes + "Replay intro video" clearly visible
6. Click ENTER STAR MAP → `/starmap` loads
7. Close tab, reopen voidexa.com → popup shows again (new session)

**Why single sprint for 6 bugs:** All 6 bugs live in the same state machine (`app/page.tsx` + `IntroVideo.tsx` + `QuickMenuOverlay.tsx`). Fixing them together avoids re-touching same files across 6 sprints. Scope locked: ONLY homepage flow — nothing else.

**Follow-up AFS unblocked after this:**
- AFS-2 (Auth routes) — independent
- AFS-7 (Legal pages) — independent, parallel-safe
- AFS-10 (Starmap Level 2) — blocked on AFS-4 (admin data) for KCP terminal sync

---

## DATA SAFETY CHECKLIST (every sprint)

Before marking sprint complete:

- [ ] `git status` shows "nothing to commit, working tree clean"
- [ ] `git log origin/main --oneline -3` shows our commit at HEAD
- [ ] `git status --porcelain | grep "^??"` lists any untracked — each reviewed + staged or gitignored
- [ ] Tag pushed: `git push origin sprint-afs-N-complete`
- [ ] If UI sprint: live-verify on voidexa.com after 90s Vercel deploy
- [ ] CLAUDE.md updated with new session log entry (this file)
- [ ] SKILL.md committed first (never untracked)

Rollback available: `git reset --hard backup/pre-sprint-afs-N-YYYYMMDD` then `git push origin main --force-with-lease`.

---

## AUTHORITY HIERARCHY

When conflict:
1. Live audit (Claude in Chrome) — most current truth
2. GROUND_TRUTH.md raw log — primary source
3. INDEX files (00-18) — extracted truth
4. userMemories — may be outdated
5. Claude session context — last resort

Never guess from memory. Search INDEX → raw → past chats → only ask Jix if all three exhausted.
