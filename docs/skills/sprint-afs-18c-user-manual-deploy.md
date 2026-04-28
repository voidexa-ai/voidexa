# SKILL — AFS-18c: Voidexa User Manual Deploy (v1)

**Sprint:** AFS-18c
**Priority:** P2 (player onboarding — unblocks "How do the cards work?" friction)
**Status:** v1 (paused for Jix review of decisions + task structure before T1 pre-flight)
**Backup tag:** `backup/pre-afs-18c-20260428` (set at end of T0 / start of T1)
**Sprint tag (on completion):** `sprint-afs-18c-complete`
**Depends on:** AFS-18 ✅ + AFS-18b ✅ (`/cards` Alpha catalog live + filter UI working — cross-links from manual into `/cards?type=X` only make sense on top of those)
**Unblocks:** any future onboarding flow that references the manual (tutorial overlays, FAQ, "Read the rules" CTAs across other surfaces)

---

## SCOPE

Render the existing 5-etape user manual at `docs/VOIDEXA_USER_MANUAL/` as readable, server-rendered web pages on voidexa.com. Wire bidirectional cross-links between the manual and `/cards` so a player reading about card types can click straight into the catalog filtered to that type, and a player browsing `/cards` has a one-click jump to the rules.

### IN SCOPE

- `/manual` landing route with overview + links to 5 etapes
- 5 etape routes: `/manual/foundation`, `/manual/battle`, `/manual/cards`, `/manual/pilots`, `/manual/glossary`
- DK locale mirrors at `/dk/manual` + 5 sub-routes (EN content per AFS-26 deferral, DK metadata only)
- Sticky left sidebar nav listing landing + 5 etapes (responsive — collapses on mobile)
- Server-rendered markdown via the renderer the pre-flight identifies (preference: `react-markdown` if already installed; otherwise install or pick a different already-present option)
- Cross-link auto-substitution in etape 03 (the 9 card type names → `/cards?type={slug}` links, word-boundary regex to avoid false positives)
- "Read the rules" / "Læs reglerne" button at the top of `/cards` and `/dk/cards` linking into the manual
- "How to Play" entry in the Universe dropdown nav (`components/layout/Navigation.tsx`)
- Image asset: copy `battle_scene_v3_reference.png` from `docs/design/` (or wherever pre-flight finds it) to `public/manual/` if etape 03 actually references it
- SEO: per-route `<title>` + description, sitemap.xml entries, alternates: { en: ..., da: ... } in metadata
- Tests: route existence, sidebar nav contents, cross-link substitution, button presence on `/cards`, "How to Play" in Navigation

### OUT OF SCOPE

- Search functionality (Q11 locked: skip in v1; markdown headings give in-page scroll nav for now)
- PDF / Print download (Q12 locked: defer to AFS-18d if requested)
- Real DK translation of manual content (AFS-26 owns; this sprint mirrors EN markdown verbatim)
- Edit-on-GitHub buttons / contributor flow (out of scope; markdown lives in repo, edits via PR)
- Tutorial overlays / interactive walkthrough (separate sprint)
- Comments / discussion / annotations (out of scope)
- New manual content authoring (sprint deploys *existing* content; rewrites or expansions are separate)
- Battle / pilots / cards in-game tooltip integration (out of scope)
- Light-mode theme (voidexa.com is dark-only by design)

---

## LOCKED DECISIONS (12 — locked by Jix at sprint kickoff)

| # | Decision | Locked value |
|---|---|---|
| Q1 | Public route | `/manual` |
| Q2 | DK locale | Mirror route at `/dk/manual` (next-intl-style wrapper), EN content (per AFS-26 deferral) |
| Q3 | Rendering | Server-rendered markdown, static where possible, SEO-friendly |
| Q4 | Layout | Sticky left sidebar with chapter nav, content centered |
| Q5 | Landing page | `/manual` shows overview + links to the 5 etapes |
| Q6 | Etape route slugs | `/manual/foundation`, `/manual/battle`, `/manual/cards`, `/manual/pilots`, `/manual/glossary` |
| Q7 | Cross-link semantics | When etape 03 mentions one of the 9 card types, the inline mention links to `/cards?type={slug}` |
| Q8 | Link from `/cards` | Top of page, "📖 Read the rules" (EN) / "📖 Læs reglerne" (DK) → `/manual` (or `/dk/manual` on DK) |
| Q9 | Link from homepage nav | Add "How to Play" entry in the Universe dropdown menu |
| Q10 | Image embeds | Copy `battle_scene_v3_reference.png` (or equivalent) to `public/manual/` and embed in etape 03 if referenced |
| Q11 | Search | Skip in v1 — markdown headings provide in-page scroll nav |
| Q12 | PDF / Print | Skip in v1 — defer to AFS-18d if requested |

### Etape slug → file mapping (locked)

| Slug | Markdown file | Rough KB | Topic |
|---|---|---|---|
| `foundation` | `01_UNIVERSE_FOUNDATION.md` | 14.8 | Lore, factions, sector geography |
| `battle` | `02_BATTLE_MECHANICS.md` | 15.9 | Turn structure, phases, win conditions |
| `cards` | `03_THE_9_CARD_TYPES.md` | 29.5 | The 9 types in detail (cross-link target) |
| `pilots` | `04_PILOTS_CORES_ARCHETYPES.md` | 19.4 | Pilot bios, core abilities, archetypes |
| `glossary` | `05_KEYWORD_GLOSSARY.md` | 22.6 | Keyword definitions (alphabetical reference) |

Source files already exist in `docs/VOIDEXA_USER_MANUAL/` (currently untracked per `git status`; T1 pre-flight confirms presence + line counts + first heading).

### The 9 card types for cross-link substitution

| Display name (titlecase, used in markdown prose) | DB slug (target of `/cards?type=`) |
|---|---|
| Weapon | weapon |
| Drone | drone |
| AI Routine | ai_routine |
| Defense | defense |
| Module | module |
| Maneuver | maneuver |
| Equipment | equipment |
| Field | field |
| Ship Core | ship_core |

Word-boundary regex strategy: match titlecase term as a whole word (`\bWeapon\b`), case-sensitive, but ONLY in body prose (not inside existing links, code blocks, or headings). Implementation: a `remark`-style plugin or `react-markdown` `components.text` interceptor — pre-flight picks the path.

---

## EXECUTION RULE

`claude --dangerously-skip-permissions` mode for sprint execution.

**Stop checkpoints:**
- T0 SKILL v1 commit (now — wait for Jix to acknowledge before T1)
- T1 pre-flight findings (potential v2 reshape if a key assumption is wrong)
- T9 Jix live verify

---

## TASK 0 — SKILL v1 commit (current step)

```bash
git add docs/skills/sprint-afs-18c-user-manual-deploy.md
git commit -m "chore(afs-18c): SKILL v1 - user manual deploy plan"
git push origin main
```

Stop here. Wait for Jix to ack.

(Backup tag is set at the start of T1 instead of T0 because T0 is itself reversible just by removing the SKILL file.)

---

## TASK 1 — Pre-flight (mandatory, STOP after for Jix approval)

Per AFS-6b / AFS-18 / AFS-18b lessons: even short SKILLs ride on stale assumptions. Verify before any code.

### Step 1.1 — Inventory the manual source

```bash
ls -la docs/VOIDEXA_USER_MANUAL/
wc -l docs/VOIDEXA_USER_MANUAL/*.md
head -1 docs/VOIDEXA_USER_MANUAL/*.md
```

Confirm the 5 files exist, capture line counts, capture first heading of each (used as `<h1>` / metadata title).

### Step 1.2 — Markdown renderer state in repo

```bash
grep -E '"react-markdown"|"@next/mdx"|"next-mdx-remote"|"marked"|"remark"|"unified"' package.json
```

Identify what's already installed. Preference order:
1. `next-mdx-remote` (best for server-rendered MDX with React components — supports our cross-link substitution)
2. `react-markdown` (simpler, pure markdown + components prop)
3. `marked` + custom React wrapper (manual)
4. None present → install `react-markdown` (smallest dep tree, easiest path)

### Step 1.3 — next-intl / locale routing

```bash
grep -E '"next-intl"|"@vercel/edge"' package.json
ls -la app/dk/cards/ 2>/dev/null
```

Confirm whether `next-intl` is actually a dependency (Q2 mentions "next-intl wrapper") or if the existing pattern is just `app/dk/*/page.tsx` mirror routes (per AFS-18 + AFS-18b precedent). The latter is cheaper and matches existing code.

**Likely finding:** AFS-18 / AFS-18b used plain mirror routes, not next-intl. If `next-intl` is not installed, build mirror routes for `/manual` to match. Document this as a SKILL v2 clarification.

### Step 1.4 — Navigation.tsx structure

```bash
grep -nE 'Universe|dropdown|How to Play' components/layout/Navigation.tsx | head -20
```

Find the Universe dropdown insert point. Per AFS-6a-fix precedent, the dropdown items are an array literal — a "How to Play" entry at the right position is a one-line insert. Capture:
- Current item count (per AFS-6a-fix: 9 items — Shop, Cards, Inventory, Break Room, etc.)
- Order convention (alphabetical / power / curated)
- DK label key location (`lib/i18n/da.ts`)

### Step 1.5 — `/cards` top header structure

```bash
grep -n 'Alpha Card Library\|<header' components/cards/AlphaCatalog.tsx | head -10
```

Find where to insert the "Read the rules" button. The `<header>` block at the top of AlphaCatalog (which I shipped in AFS-18b/5b restructure) is the obvious spot. Decide: button goes inside the same `<header>` (right side of the H1) or as a separate row above the type filter.

### Step 1.6 — Image asset reference check

```bash
grep -lE 'battle_scene_v3_reference|\.png|\.jpg|\.gif' docs/VOIDEXA_USER_MANUAL/*.md
ls -la docs/design/ 2>/dev/null | grep -i battle
```

Confirm whether etape 03 (or any etape) actually references images. If yes, find the source and decide whether to copy to `public/manual/` (Q10 default) or leave the markdown unreferenced. Capture the exact filenames so T2/T3 can wire them.

### Step 1.7 — Sitemap + robots existing config

```bash
grep -nE 'manual|/cards|sitemap' app/sitemap.ts 2>/dev/null
cat app/robots.ts 2>/dev/null
```

Confirm AFS-7's `app/sitemap.ts` is the canonical sitemap source, capture its current entries, plan the 12 new entries (6 EN + 6 DK) for sprint-close.

### STOP CHECKPOINT — Pre-flight findings report

Format:

```
PRE-FLIGHT FINDINGS

1. Manual source: 5 files, [LOC totals], first heading per file
2. Markdown renderer in repo: [react-markdown / next-mdx-remote / marked / NONE - install needed]
3. next-intl: [installed / not installed; mirror-route precedent applies]
4. Navigation.tsx Universe dropdown: [current item count, insertion point]
5. /cards header insertion point: [inside existing header / new row above filters]
6. Image references in manual: [list of filenames OR "no image references"]
7. Sitemap: [current entry count, planned 12 additions]

PROPOSED SKILL v2 RESHAPE (if any):
- [bullet list]

WAITING FOR JIX APPROVAL TO PROCEED.
```

If a finding contradicts the locked decisions, write SKILL v2 with corrections + commit before T2.

---

## TASK 2 — `/manual` landing route

`app/manual/page.tsx`:
- Server component
- Renders an overview / "What is voidexa?" preface + 5 cards (one per etape)
- Each card: title (from etape `<h1>`), 1-line description (manually written here, ~15 words), link to the etape route
- Layout: same shell as etape pages (sidebar + centered content) for consistency

Mirror at `app/dk/manual/page.tsx` (DK metadata, same content).

---

## TASK 3 — 5 etape routes

`app/manual/[slug]/page.tsx` (dynamic route) OR 5 explicit route files (`app/manual/foundation/page.tsx` etc.). Decision in pre-flight — depends on whether dynamic-route SEO + `generateStaticParams` is the cleaner fit. Default proposal: **5 explicit route files** so each can have hand-tuned metadata + sitemap entries without indirection.

Per route:
- Read the matching markdown file at request time via `fs.readFileSync(join(process.cwd(), 'docs', 'VOIDEXA_USER_MANUAL', '<file>.md'))`
- Pass to a shared `<ManualEtapePage markdown={...} slug="..." />` client component (or server, depending on renderer choice)
- Render via the chosen markdown renderer
- Apply cross-link substitution (T7) on etape 03 only

DK mirror at `app/dk/manual/[slug]/page.tsx` (or 5 explicit files), EN content, DK metadata.

---

## TASK 4 — Sidebar + content layout

`components/manual/ManualLayout.tsx` (client or server depending on whether we need scroll-spy active state — pre-flight decides):

- `<aside>` left, sticky on `md:` and up, lists landing + 5 etapes with hrefs
- `<main>` centered, max-width like `max-w-3xl` for readable line length
- Mobile: `<aside>` collapses into a top dropdown / accordion (or just renders above content; final pick after live-verify)
- Active state: highlight the current route's sidebar entry via pathname check
- Tailwind only — no new design system primitives

Layout file imported by both `/manual/page.tsx` (landing) and each etape route.

---

## TASK 5 — "Read the rules" / "Læs reglerne" button on `/cards`

In `components/cards/AlphaCatalog.tsx`, at the top of the existing `<header>` block (above the H1 or right-aligned next to it):

```tsx
<Link
  href={basePath.startsWith('/dk/') ? '/dk/manual' : '/manual'}
  className="inline-flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-700"
>
  📖 {basePath.startsWith('/dk/') ? 'Læs reglerne' : 'Read the rules'}
</Link>
```

Visible on both `/cards` and `/dk/cards` (and `/cards/alpha` + `/dk/cards/alpha` since they share `<AlphaCatalog>`). Emoji is part of the label per Q8.

---

## TASK 6 — "How to Play" in Universe dropdown nav

`components/layout/Navigation.tsx`:
- Add a new entry in the Universe dropdown items array
- Position: pre-flight determines the order convention; default proposal is to place it right after "Cards" since it's contextually adjacent
- EN label "How to Play" + DK label "Sådan spiller du" (i18n via existing `lib/i18n/en.ts` + `lib/i18n/da.ts`)
- Href: `/manual` (resolves through `localizeHref` if that helper is in use)
- AFS-6a-fix `tests/nav-dropdown.test.ts` flipped from "Inventory is last" to "How to Play is last" — re-flip if needed; otherwise insert at a non-tail position so existing assertion still holds

---

## TASK 7 — Cross-link substitution in etape 03

For markdown body text in `03_THE_9_CARD_TYPES.md` only:

- Each whole-word titlecase mention of the 9 card types becomes a Markdown-style link
- Pattern `\b(Weapon|Drone|AI Routine|Defense|Module|Maneuver|Equipment|Field|Ship Core)\b` (case-sensitive)
- Replacement: `[Match](/cards?type=<slug>)` where slug comes from a hard-coded map
- BUT only outside code blocks, headings (`^#`), and existing links (`[X](Y)`)

Implementation depends on renderer:
- **react-markdown:** custom `components` map with a `p`/`text` plugin
- **next-mdx-remote:** remark plugin (`unified.use(remarkPlugin).use(remarkRehype)...`)
- **plain regex preprocess:** simplest, but brittle on edge cases

Pre-flight picks the path. Skip etapes 01, 02, 04, 05 from substitution to keep the rule scoped.

Test expectations (T8):
- The phrase "Drone" in etape 03 prose renders as a link to `/cards?type=drone`
- "AI Routine" in etape 03 prose renders as a link to `/cards?type=ai_routine`
- "Drone" inside a code block (` ```Drone``` `) is NOT a link
- "Drone Card" heading is NOT a link

---

## TASK 8 — Tests

Target ~15-20 assertions across 3 split-by-concern files (matching AFS-18 / AFS-18b naming).

### tests/afs-18c-manual-routes.test.ts (~6)

- `app/manual/page.tsx` exists + imports the manual layout
- 5 etape route files (`app/manual/foundation/page.tsx` etc.) all exist
- DK mirrors at `app/dk/manual/...` all exist
- Each etape route reads the correct markdown file (string-grep for the filename)
- Sitemap (`app/sitemap.ts`) lists all 12 manual routes
- Landing-page metadata canonical points at `/manual`

### tests/afs-18c-cross-links.test.ts (~6)

- AlphaCatalog source contains the "Read the rules" / "Læs reglerne" Link (both label strings present)
- The Link href routes to `/manual` (basePath-aware: `/dk/manual` when DK)
- `components/layout/Navigation.tsx` contains a "How to Play" item with href `/manual`
- DK i18n key for "Sådan spiller du" present in `lib/i18n/da.ts`
- EN i18n key for "How to Play" present in `lib/i18n/en.ts`
- AFS-6a-fix nav-dropdown test still passes (no regression on existing entries)

### tests/afs-18c-etape03-typelinks.test.ts (~5)

- The chosen renderer / preprocess function maps "Weapon" → `[Weapon](/cards?type=weapon)`
- All 9 type names produce the right slug (parametric test loop)
- "AI Routine" with the space gets correctly mapped to `ai_routine`
- "Ship Core" similarly gets `ship_core`
- Code-block content is not transformed (regression test using a fixture string)

(If the cross-link is implemented as a renderer plugin rather than a pure function, tests grep the source instead of running the function.)

---

## TASK 9 — Jix live verify

After commit + push + Vercel deploy, ask Jix to verify:

| Check | Expected |
|---|---|
| `/manual` | Landing page renders, sidebar visible on desktop, 5 etape cards listed |
| `/manual/foundation` | Etape 01 markdown renders cleanly (headings, lists, paragraphs) |
| `/manual/battle` | Etape 02 renders |
| `/manual/cards` | Etape 03 renders, type names like "Weapon" / "Drone" are clickable links |
| Click "Drone" link in etape 03 | Lands at `/cards?type=drone` with drones filtered |
| `/manual/pilots` | Etape 04 renders |
| `/manual/glossary` | Etape 05 renders, alphabetical keyword list scrolls |
| `/cards` top | "📖 Read the rules" button visible, clicking goes to `/manual` |
| `/dk/cards` top | "📖 Læs reglerne" button visible, clicking goes to `/dk/manual` |
| Universe dropdown | "How to Play" entry visible, clicks navigate to `/manual` |
| Mobile (375 wide) | Sidebar collapses or moves above content, manual still readable |
| `/dk/manual` and 5 sub-routes | All render (EN content + DK metadata) |

---

## TASK 10 — Sprint close

```bash
git tag sprint-afs-18c-complete
git push origin sprint-afs-18c-complete

# CLAUDE.md sprint history row + SLUT 18c entry
git add CLAUDE.md
git commit -m "docs(afs-18c): sprint history row + SLUT entry"
git push origin main
```

Final state:
- `git status` clean
- HEAD on `main` shows AFS-18c commits in sequence
- Tests green (full suite + new AFS-18c)
- Build clean
- Lint zero new issues

---

## DEFINITION OF DONE

- [ ] SKILL v2 (if reshape needed) committed before any code
- [ ] Backup tag `backup/pre-afs-18c-20260428` set + pushed
- [ ] `/manual` landing renders with overview + 5 etape links
- [ ] 5 etape routes render their markdown cleanly
- [ ] DK mirror routes (6 total) render same content with DK metadata
- [ ] Sticky left sidebar nav on desktop, responsive on mobile
- [ ] "Read the rules" / "Læs reglerne" button on `/cards` and `/dk/cards`, both labels present
- [ ] "How to Play" entry in Universe dropdown nav (EN + DK i18n keys)
- [ ] Etape 03 cross-links route to `/cards?type=<slug>` for all 9 types
- [ ] Sitemap includes 12 new manual URLs
- [ ] Tests +15-20 green, no regressions
- [ ] Live verified by Jix on production
- [ ] Tagged + pushed
- [ ] CLAUDE.md updated

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-18c-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-18c-complete
```

No Supabase changes in this sprint — DB rollback unnecessary. If `public/manual/` got committed binary assets, those revert automatically with the git reset.

---

## RISKS

| Risk | Mitigation |
|---|---|
| Markdown renderer not in repo → install adds dep | Pre-flight identifies; if install needed, pick smallest tree (`react-markdown` is ~10 KB gzipped) |
| `next-intl` not actually used in repo | Pre-flight confirms; default to AFS-18 mirror-route pattern (already locked precedent) |
| Manual content references images we don't have | Pre-flight scans for image refs; copy to `public/manual/` only what's actually referenced; broken refs replaced with placeholder + flagged for follow-up |
| Cross-link regex catches false positives ("Drone" inside "Dronefield" or in a heading) | Word-boundary `\b` + skip code blocks/headings; tests cover the 4 main edge cases |
| Sidebar layout breaks on mobile | Live-verify at 375px width; collapse to top accordion if cramped |
| `app/sitemap.ts` (AFS-7) format requires specific shape | Pre-flight reads the existing structure before adding 12 entries |
| 9 type cross-link handler is rendered into the same DOM as the catalog (which already uses same query strings) | Already-tested in AFS-18b — `/cards?type=foo` is the canonical filter URL, no collision |
| AFS-6a-fix nav-dropdown test asserts "Inventory is last" — adding "How to Play" might break it | Insert "How to Play" mid-list, not at end; OR re-flip the assertion (mid-sprint test update precedent: AFS-18 catalog test) |
| Markdown headings produce `id=...` slugs that conflict with route paths | Renderer's default heading-id strategy is fine; no manual scroll-anchor authoring needed |
| Pre-existing dirty CLAUDE.md state (per AFS-18 / AFS-18b precedent) | T10 stages CLAUDE.md explicitly so only my AFS-18c additions ride along; transparent in commit message |
| File-read at request time costs Vercel cold-start latency | Markdown files are small (~22 KB max); read is fast. If needed, switch to `import` of pre-built JSON via a build script — out of scope for v1 |

---

## NOTES FOR CLAUDE CODE

1. **SKILL v1 is paused.** Do not run T1 pre-flight until Jix acks this commit.
2. **Backup tag** at start of T1, not T0 (T0 is reversible by removing the SKILL file alone).
3. **No Supabase migration** in this sprint.
4. **Mirror-route pattern** for DK (per AFS-18 / AFS-18b precedent), unless pre-flight shows next-intl is actually in use.
5. **Server components by default.** Markdown renders server-side; only the layout / sidebar might need `'use client'` for active-state highlighting (decide in T4).
6. **No new Stripe / payment / auth code.**
7. **Test split-by-concern** — flat `tests/afs-18c-*.test.ts` naming, three files.
8. **CLAUDE.md update at end** — sprint history row + SLUT entry.
9. **Emoji 📖 is allowed** because Jix explicitly requested it in Q8 (project rule: emojis only when user explicitly requests).
10. **Cross-link substitution scoped to etape 03 only.** Etapes 01, 02, 04, 05 render markdown straight.
