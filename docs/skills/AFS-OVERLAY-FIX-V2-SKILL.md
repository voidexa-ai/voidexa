# SKILL — AFS-OVERLAY-FIX-V2: Overlay Fix + 960 Audit + Void Pro AI Rename

**Sprint:** AFS-OVERLAY-FIX-V2
**Status:** 🔴 Ready to execute
**Priority:** P1 (visible UX bugs + brand clarity)
**Depends on:** AFS-FIX-COMBO ✅ (`64975b2`)
**Estimated:** 1 session, 4 fix groups
**Tag on complete:** `sprint-afs-overlay-fix-v2-complete`
**Backup tag before start:** `backup/pre-afs-overlay-fix-v2-20260428` → `64975b2`

**v2 changes vs v1:**
- DROPPED Fix 2 (UniverseChat route-skip on /void-chat) — Void Chat is not a chat, it's a premium AI provider gateway
- ADDED Fix 4 (Void Chat → Void Pro AI rename) — naming reflects actual function
- Fix 1 (Jarvis route-skip /break-room) and Fix 3 (5× 960 → 1324) unchanged

---

## SCOPE

Four fix groups consolidated:

| # | Type | Action |
|---|---|---|
| 1 | overlap | /break-room — route-skip Jarvis (matches `aae6b64` /starmap precedent) |
| 2 | rename | Void Chat → Void Pro AI overall (route + UI strings + nav + redirects) |
| 3 | audit | 5× hardcoded `960` → `1324` (verified all stale per pre-flight v1) |

**Out of scope:**
- /starmap optical issues → moved to AFS-10 expanded scope
- Real-world product shop (AFS-6c) — declined by Jix this session
- Sovereign Sky branding (waiting on animation video)

---

## CONTEXT — Why Void Pro AI rename

`/void-chat` currently misrepresents what the product is:

**What it actually is:**
- Pay-per-use access to Claude (Sonnet/Opus), ChatGPT, Gemini
- $0.01-0.02 per message
- Premium AI provider gateway / reseller model

**What "Void Chat" name suggests:**
- Social/messaging surface
- User-to-user or community feature

**Why "Void Pro AI" works:**
- "Void" = brand
- "Pro" = premium tier (matches existing "Upgrade to Pro" CTA on the page)
- "AI" = consistent with Quantum AI / Ghost AI brand pattern

This rename was decided this session (Apr 28). Originally Fix 2 was "route-skip UniverseChat on /void-chat because it's already a chat surface" — that argument collapses once we recognize this isn't a chat. UniverseChat should remain available on the renamed page like every other product page.

---

## VERIFY-FIRST PRE-FLIGHT (MANDATORY)

**Stop for Jix approval after pre-flight before any code change.**

### Pre-flight Task 0.1 — confirm git state

```powershell
git status
git log origin/main --oneline -3
# Expected HEAD: 64975b2
```

### Pre-flight Task 0.2 — Fix 1 grep (Jarvis route-skip)

Already mapped in v1 pre-flight:
- `components/ui/JarvisAssistant.tsx` — has hide list (currently includes `/`, `/freeflight`, `/assembly-editor`, `/starmap`, `/dk/starmap`)
- Pattern for fix: add `/break-room` (and `/dk/break-room` if exists) to that list

```powershell
# Confirm hide list location + format
git grep -nE "freeflight|assembly-editor" -- "components/ui/JarvisAssistant.tsx"

# Check if DK break-room exists
git grep -rn "/dk/break-room" -- "*.tsx" "*.ts"
```

### Pre-flight Task 0.3 — Fix 2 grep (Void Chat → Void Pro AI rename)

This rename is wide. Catalog ALL surfaces before editing.

```powershell
# Find all "Void Chat" string occurrences (case-insensitive)
git grep -in "void chat" -- "*.tsx" "*.ts" "*.json" "*.md" "*.mdx"

# Find all /void-chat route references
git grep -n "/void-chat" -- "*.tsx" "*.ts" "*.json"

# Find route file
ls app/void-chat/ 2>$null
ls app/dk/void-chat/ 2>$null

# Find sitemap entry
git grep -n "void-chat" -- "app/sitemap.ts" "app/sitemap.xml"

# Find nav menu / dropdown references
git grep -in "void chat\|void-chat" -- "components/nav/**" "components/header/**" "components/footer/**"

# Find page metadata
git grep -in "voidexa Void Chat" -- "*.tsx" "*.ts"

# Check redirects in next.config.ts (we'll need to add 308 redirects)
git grep -n "redirects\|308\|permanent" -- "next.config.ts" "next.config.mjs"
```

Produce a complete inventory before any change:

| Surface | File:line | Current text | Action |
|---|---|---|---|
| Route folder | app/void-chat/ | — | rename to app/void-pro-ai/ |
| Page H1 | TBD | "Void Chat" | "Void Pro AI" |
| Page subtitle | TBD | "Choose a provider and model, then start chatting." | "Premium access to Claude, ChatGPT, and Gemini. Pay per message." |
| Sidebar header | TBD | "Void Chat" | "Void Pro AI" |
| Page metadata title | TBD | "voidexa Void Chat — Multi-AI Chat" | "voidexa Void Pro AI — Premium AI Access" |
| Page metadata description | TBD | TBD | TBD |
| Preview banner | TBD | "...experience Void Chat" | "...experience Void Pro AI" |
| Top nav link (if any) | TBD | "Void Chat" | "Void Pro AI" |
| Footer link (if any) | TBD | "Void Chat" | "Void Pro AI" |
| Sitemap | TBD | /void-chat | /void-pro-ai |
| DK route (if exists) | app/dk/void-chat/ | — | rename to app/dk/void-pro-ai/ + DK strings |
| 308 redirects | next.config.ts | — | /void-chat → /void-pro-ai (permanent) + DK equivalent |
| Internal links | various | href="/void-chat" | href="/void-pro-ai" |

### Pre-flight Task 0.4 — Fix 3 grep (960 audit)

Already classified in v1 pre-flight as ALL 5 hardcoded stale marketing copy:
- `components/station/ScienceDeck.tsx:38` — Quantum card desc
- `components/station/ScienceDeck.tsx:39` — Quantum card tooltip
- `components/starmap/nodes.ts:152` — Starmap sublabel
- `components/control-plane/ControlPlaneDashboard.tsx:589` — QuantumPanel data
- `components/control-plane/ControlPlaneDashboard.tsx:660` — SYSTEMS const note

All 5 fix to `1324`. No reclassification needed.

### Pre-flight Task 0.5 — produce report

Deliver complete inventory to Jix. Stop. Wait for explicit approval before continuing to Tasks.

---

## TASKS (post pre-flight approval)

### Task 1 — Backup tag

```powershell
git tag backup/pre-afs-overlay-fix-v2-20260428 64975b2
git push origin backup/pre-afs-overlay-fix-v2-20260428
```

### Task 2 — Commit this SKILL

```powershell
git add docs/skills/afs-overlay-fix-v2-SKILL.md
git commit -m "skill(afs-overlay-fix-v2): overlap + 960 audit + void pro ai rename"
git push origin main
```

### Task 3 — Fix 1: /break-room Jarvis route-skip

Add `/break-room` (and `/dk/break-room` if exists per pre-flight) to JarvisAssistant.tsx hide list.

Commit:
```
fix(afs-overlay-fix-v2): /break-room — route-skip jarvis (matches aae6b64 starmap pattern)
```

### Task 4 — Fix 2: Void Chat → Void Pro AI rename

**Step 1: Route folder rename**
```powershell
git mv app/void-chat app/void-pro-ai
# DK if exists:
git mv app/dk/void-chat app/dk/void-pro-ai
```

**Step 2: UI string updates (per pre-flight inventory)**
- Page H1: "Void Chat" → "Void Pro AI"
- Subtitle: "Choose a provider and model, then start chatting." → "Premium access to Claude, ChatGPT, and Gemini. Pay per message."
- Sidebar header: "Void Chat" → "Void Pro AI"
- Page metadata title: "voidexa Void Chat — Multi-AI Chat" → "voidexa Void Pro AI — Premium AI Access"
- Page metadata description: rewrite to match new positioning
- Preview banner: "...experience Void Chat" → "...experience Void Pro AI"
- Top nav link text + href update
- Footer link text + href update
- DK page strings (if route exists) — keep existing translation pattern, just swap names

**Step 3: 308 redirects in next.config.ts**

```typescript
{
  source: '/void-chat',
  destination: '/void-pro-ai',
  permanent: true,
},
{
  source: '/void-chat/:path*',
  destination: '/void-pro-ai/:path*',
  permanent: true,
},
// DK equivalents if route exists
{
  source: '/dk/void-chat',
  destination: '/dk/void-pro-ai',
  permanent: true,
},
{
  source: '/dk/void-chat/:path*',
  destination: '/dk/void-pro-ai/:path*',
  permanent: true,
},
```

**Step 4: Internal link href updates**
Replace all `href="/void-chat"` and `href="/void-chat/...` with new path. Same for DK.

**Step 5: Sitemap update**
Update `app/sitemap.ts` (or equivalent) entries.

**Step 6: Search internal docs**
`grep -rn "void-chat\|Void Chat"` across docs/, README.md, CLAUDE.md — update as appropriate (these may be historical references that should stay; use judgment per file).

**Commits (granular):**
```
refactor(afs-overlay-fix-v2): rename app/void-chat to app/void-pro-ai
refactor(afs-overlay-fix-v2): update UI strings to Void Pro AI
fix(afs-overlay-fix-v2): add 308 redirects /void-chat → /void-pro-ai
refactor(afs-overlay-fix-v2): update internal href references to /void-pro-ai
chore(afs-overlay-fix-v2): sitemap + metadata updates for void-pro-ai
```

### Task 5 — Fix 3: 5× 960 → 1324

Update all 5 hardcoded occurrences per pre-flight v1 classification:

- `components/station/ScienceDeck.tsx:38, 39` — both lines
- `components/starmap/nodes.ts:152`
- `components/control-plane/ControlPlaneDashboard.tsx:589, 660`

Commits (one per file):
```
fix(afs-overlay-fix-v2): science deck — 960 → 1324 marketing copy
fix(afs-overlay-fix-v2): starmap node — 960 → 1324 sublabel
fix(afs-overlay-fix-v2): control plane dashboard — 960 → 1324 hardcoded data
```

### Task 6 — Test additions

Add Vitest assertions:

`tests/afs-overlay-fix-v2.test.ts`:
- JarvisAssistant hide list contains `/break-room`
- /void-chat returns 308 redirect to /void-pro-ai (or test config presence)
- /void-pro-ai page contains "Void Pro AI" heading
- /void-pro-ai page does NOT contain "Void Chat" anywhere
- /void-pro-ai metadata title is "voidexa Void Pro AI — Premium AI Access"
- ScienceDeck.tsx test count assertions: contains 1324, NOT 960
- starmap nodes test count: contains 1324, NOT 960
- ControlPlaneDashboard test count assertions: contains 1324, NOT 960

Target test count delta: ~+12-18 assertions.

Commit:
```
test(afs-overlay-fix-v2): lock overlay fix + rename + 960 cleanup
```

### Task 7 — Final tag + push

```powershell
git tag sprint-afs-overlay-fix-v2-complete
git push origin main
git push origin sprint-afs-overlay-fix-v2-complete

git status
git log origin/main --oneline -10
```

### Task 8 — Live verification (≥90s after push)

Wait minimum 90 seconds for Vercel deploy. Then via Claude in Chrome (incognito + hard reload):

1. `/break-room` — Jarvis bubble GONE, Leaderboard pill no longer overlapped
2. `/void-chat` — should 308 redirect to `/void-pro-ai`
3. `/void-pro-ai` — page renders with "Void Pro AI" branding throughout
4. `/dk/void-chat` (if exists) — 308 redirects to `/dk/void-pro-ai`
5. `/dk/void-pro-ai` (if exists) — DK page renders correctly
6. Browse to /void-pro-ai via top nav — link goes to new path
7. Confirm 960 → 1324 on:
   - /admin (Control Plane Dashboard)
   - any starmap node showing test count
   - any Station ScienceDeck instance

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST (before any code)
- [ ] Backup tag `backup/pre-afs-overlay-fix-v2-20260428` pushed
- [ ] Pre-flight inventory shown to Jix and approved
- [ ] All 4 fix groups implemented per approved scope
- [ ] Tests green (1341 baseline + ~12-18 new = ~1353-1359)
- [ ] Build succeeds (`npm run build`) — verify no broken imports from rename
- [ ] Lint baseline unchanged
- [ ] Committed + tagged + pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -10` shows commits on remote
- [ ] Tag `sprint-afs-overlay-fix-v2-complete` on remote
- [ ] Wait ≥90s for Vercel deploy
- [ ] Hard-refresh incognito live-verify (7 checkpoints above)
- [ ] CLAUDE.md updated + uploaded to Project Knowledge at SLUT
- [ ] INDEX deltas delivered at SLUT (04, 08, 11)
- [ ] No regressions on AFS-FIX-COMBO fixes (re-verify /products, /trading-hub, /quantum, /home)
- [ ] No broken external links pointing to /void-chat (308 redirect catches them)

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-overlay-fix-v2-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-overlay-fix-v2-complete
```

No data migrations. No schema changes. Pure code + folder rename.

---

## RISKS

- **Folder rename = highest risk in this sprint.** `git mv app/void-chat app/void-pro-ai` is straightforward but every internal import path, link, and reference must be updated. Build will fail loudly if anything missed. Pre-flight inventory must be exhaustive.
- **308 redirects critical** — if not added, every existing external link breaks. Dependabot, social shares, bookmarks, search engine indexes all hit `/void-chat`.
- **DK route ambiguity** — pre-flight verifies whether `/dk/void-chat` exists. If yes, treat as full second rename. If no, skip DK steps cleanly.
- **Untranslated DK content** — per CLAUDE.md, DK routes are surface-only translated. New `/dk/void-pro-ai` likely re-exports English. Acceptable for v2 rename — full DK translation is AFS-26 territory.
- **Jarvis route-skip pattern collision** — already proven by `aae6b64`, low risk.
- **960 audit fully classified** — already done in v1 pre-flight, low risk.

---

## CLAUDE CODE EXECUTION COMMAND

After Jix approves SKILL:

```powershell
claude --dangerously-skip-permissions
```

Then point Claude Code at this SKILL.md.
