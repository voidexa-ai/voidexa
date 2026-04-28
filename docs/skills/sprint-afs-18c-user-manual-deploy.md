# SKILL — AFS-18c: Voidexa User Manual Deploy (v2)

**Sprint:** AFS-18c
**Priority:** P2 (player onboarding)
**Status:** v2 (pre-flight findings folded in; ready for Task 0 backup tag → T2)
**Backup tag:** `backup/pre-afs-18c-20260428` (set immediately after this v2 commit)
**Sprint tag (on completion):** `sprint-afs-18c-complete`
**Depends on:** AFS-18 ✅ + AFS-18b ✅
**Unblocks:** future onboarding flows (tutorial overlays, FAQ, "Read the rules" CTAs)

---

## V1 → V2 RESHAPE RATIONALE

Pre-flight 1.1-1.7 turned up two material findings:

1. **Etape titles cannot be derived from H1.** All 5 markdown files share an identical H1 (`# VOIDEXA — USER MANUAL & UNIVERSE GUIDE`). Hard-code per-slug titles + descriptions in the route layer (Correction A). Strip the shared H1 from each markdown body during render so the displayed page title is the hard-coded one.
2. **Manual contains zero image embeds.** `grep -E '\.png|\.jpg|\.gif|\.svg|!\['` returned no matches across all 5 files. Q10 (copy `battle_scene_v3_reference.png` to `public/manual/`) is a no-op. Drop image-copy work entirely (Correction B).

Other pre-flight confirmations (no reshape needed):
- `react-markdown@10.1.0` is installed → use it, no install
- `next-intl` not installed → mirror-route pattern applies (matches AFS-18 / AFS-18b)
- Universe nav has 9 items; insert "How to Play" between Cards (idx 4) and Achievements (idx 5) so Inventory stays last (AFS-6a-fix `tests/nav-dropdown.test.ts:78` assertion stays green)
- `/cards` header is `<header className="mb-8">` with `<h1>Alpha Card Library</h1>` — restructure into flex row so H1 sits left and "Read the rules" Link sits right
- Sitemap is `app/sitemap.ts` with `EN_ROUTES` + `DK_ROUTES` arrays + `priorityFor` / `changeFreqFor` helper fns; add 12 entries (6 EN + 6 DK)

D1 cross-link strategy locked: link every titlecase whole-word match in etape 03 prose. Visual density acceptable.

---

## SCOPE

### IN SCOPE

- `/manual` landing route + 5 etape routes (`/manual/foundation`, `/manual/battle`, `/manual/cards`, `/manual/pilots`, `/manual/glossary`)
- DK locale mirrors at `/dk/manual` + 5 sub-routes (EN content per AFS-26 deferral, DK metadata)
- Sticky left sidebar nav listing landing + 5 etapes (server-rendered, active state from pathname)
- Server-rendered markdown via `react-markdown` (with `remark-gfm` for GFM tables — install if not already present)
- `ETAPE_META` map: hard-coded slug → `{ title, description, file }` (Correction A)
- Shared H1 stripper in markdown loader (`# VOIDEXA — USER MANUAL & UNIVERSE GUIDE` removed before render)
- Cross-link substitution in etape 03 only: case-sensitive whole-word titlecase match for the 9 type names → `[Match](/cards?type={slug})`. Skips code blocks, headings, existing markdown links (D1 — link every match)
- "Read the rules" / "Læs reglerne" button at the top of `/cards` (and `/dk/cards`) linking into the manual
- "How to Play" entry in Universe dropdown nav (`components/layout/Navigation.tsx` + `lib/i18n/en.ts` + `lib/i18n/da.ts`)
- Sitemap: 12 new entries (6 EN + 6 DK) in `app/sitemap.ts`
- Tests: ~15-20 assertions across 3 split-by-concern files

### OUT OF SCOPE

- Search functionality (Q11 locked: skip in v1)
- PDF / Print download (Q12 locked: defer)
- Real DK translation of manual content (AFS-26 owns)
- Image embeds (Correction B: no image references in source manual)
- Edit-on-GitHub buttons / annotations / comments
- New manual content authoring
- Tutorial overlays / interactive walkthrough
- Light-mode theme

---

## LOCKED DECISIONS

### Q1-Q12 (Jix locked at sprint kickoff)

| # | Decision | Locked value |
|---|---|---|
| Q1 | Public route | `/manual` |
| Q2 | DK locale | Mirror route at `/dk/manual` (mirror pattern, no next-intl) |
| Q3 | Rendering | Server-rendered markdown (react-markdown, SSR) |
| Q4 | Layout | Sticky left sidebar with chapter nav, content centered |
| Q5 | Landing page | `/manual` shows overview + links to 5 etapes |
| Q6 | Etape route slugs | `foundation`, `battle`, `cards`, `pilots`, `glossary` |
| Q7 | Cross-link semantics | Etape 03 type names → `/cards?type={slug}` |
| Q8 | Link from `/cards` | Top of header, "📖 Read the rules" / "📖 Læs reglerne" |
| Q9 | Link from homepage nav | "How to Play" entry in Universe dropdown |
| Q10 | Image embeds | **Skipped (Correction B — no images in source manual)** |
| Q11 | Search | Skip in v1 |
| Q12 | PDF / Print | Skip in v1 |

### Implementation choices (locked at pre-flight ack)

| Choice | Locked value |
|---|---|
| Markdown renderer | `react-markdown@10.1.0` (already installed) + `remark-gfm` plugin (install if absent) |
| Locale routing | Mirror routes (`app/dk/manual/*` mirrors `app/manual/*`) — matches AFS-18 / AFS-18b precedent |
| Etape route shape | 5 explicit `app/manual/{slug}/page.tsx` files (NOT a `[slug]` dynamic route) so each gets hand-tuned metadata + sitemap entry |
| Sidebar | Server component; pathname comes via prop; client only if a future scroll-spy need surfaces |
| Cross-link impl | Pre-process regex on the markdown string before passing to react-markdown |
| "How to Play" position | Universe dropdown idx 5 (between Cards and Achievements) — keeps Inventory last |
| Cross-link density | D1 — link every titlecase match (case-sensitive whole-word) |

### ETAPE_META (Correction A)

```typescript
export const ETAPE_META = {
  foundation: {
    title: 'Universe Foundation',
    description: 'Lore, factions, sector geography — the world before the rules.',
    file: '01_UNIVERSE_FOUNDATION.md',
  },
  battle: {
    title: 'Battle Mechanics',
    description: 'Turn structure, phases, win conditions.',
    file: '02_BATTLE_MECHANICS.md',
  },
  cards: {
    title: 'The 9 Card Types',
    description: 'Weapon, Drone, AI Routine, Defense, Module, Maneuver, Equipment, Field, Ship Core.',
    file: '03_THE_9_CARD_TYPES.md',
  },
  pilots: {
    title: 'Pilots, Cores & Archetypes',
    description: 'Pilot bios, ship-core abilities, archetype playstyles.',
    file: '04_PILOTS_CORES_ARCHETYPES.md',
  },
  glossary: {
    title: 'Keyword Glossary',
    description: 'Alphabetical reference for every keyword in the game.',
    file: '05_KEYWORD_GLOSSARY.md',
  },
} as const

export type EtapeSlug = keyof typeof ETAPE_META
```

Lives in `lib/manual/etapes.ts` alongside the slug type, the helper to load + strip-H1, and the cross-link constants.

---

## EXECUTION RULE

`claude --dangerously-skip-permissions` mode for execution.

**Stop checkpoints:**
- ✅ T0 SKILL v1 commit (done)
- ✅ T1 pre-flight findings (done, folded into v2 above)
- ✅ T0 SKILL v2 commit (this commit)
- ⏸ **T9 Jix live verify** (only remaining stop before T10 sprint close)

T2-T8 execute without further intermediate stops per Jix instruction.

---

## TASKS

### T0 — SKILL v2 commit + backup tag (current step)

```bash
git add docs/skills/sprint-afs-18c-user-manual-deploy.md
git commit -m "chore(afs-18c): SKILL v2 - locked decisions + pre-flight findings"
git push origin main

git tag backup/pre-afs-18c-20260428
git push origin backup/pre-afs-18c-20260428
```

### T2 — Lib helpers + landing route

Files to create:
- `lib/manual/etapes.ts` — ETAPE_META + EtapeSlug + ETAPE_ORDER
- `lib/manual/load-markdown.ts` — `loadEtapeMarkdown(filename)` reads file, strips shared H1
- `lib/manual/cross-links.ts` — `injectTypeCrossLinks(markdown)` for etape 03 only
- `app/manual/page.tsx` — landing route, server component
- `app/dk/manual/page.tsx` — DK mirror, EN content, DK metadata

### T3 — 5 etape routes (EN) + 5 etape routes (DK)

10 files: `app/manual/{slug}/page.tsx` + `app/dk/manual/{slug}/page.tsx`. Each:
- Reads file via `loadEtapeMarkdown(ETAPE_META[slug].file)`
- For `slug === 'cards'` ONLY, applies `injectTypeCrossLinks` after H1-strip
- Renders via `<ManualEtapePage />` shared component with right props
- Per-route metadata: title from `ETAPE_META[slug].title`, description from `ETAPE_META[slug].description`, alternates locked

### T4 — Layout + content components

Files to create:
- `components/manual/ManualLayout.tsx` — main grid (sidebar + content), server
- `components/manual/ManualSidebar.tsx` — nav list with active highlight, server
- `components/manual/ManualContent.tsx` — react-markdown renderer with custom Tailwind components map, server (verify SSR works)
- Mobile: sidebar moves above content via `md:` breakpoint (no JS toggle in v1)

### T5 — "Read the rules" / "Læs reglerne" button on /cards

Modify `components/cards/AlphaCatalog.tsx`:
- Restructure existing `<header className="mb-8">` to flex row (h1 left, button right)
- Button text + href derived from `basePath`:
  - DK: `'/dk/manual'` + "📖 Læs reglerne"
  - EN: `'/manual'` + "📖 Read the rules"

### T6 — "How to Play" in Universe dropdown nav

Modify:
- `components/layout/Navigation.tsx` — insert at Universe idx 5 (after `/cards`, before `/achievements`):
  ```ts
  { href: '/manual', label: tLink('/manual', 'How to Play'), description: tDesc('/manual') }
  ```
- `lib/i18n/en.ts` — add `'/manual': { label: 'How to Play', description: '5-etape player manual' }` under `nav.items`
- `lib/i18n/da.ts` — add `'/manual': { label: 'Sådan spiller du', description: '5-etape spiller-manual' }` under `nav.items`

### T7 — Cross-link substitution (covered by T2 `cross-links.ts` + T3 etape-cards usage)

Strategy:
1. Tokenize: replace ` ```...``` ` and `` `...` `` blocks with placeholders
2. Process line-by-line: skip lines starting with `#` (headings)
3. For each remaining line, run regex pass per type term, ordered compound-first (`AI Routine`, `Ship Core` before single words) to avoid partial matches
4. Boundaries: case-sensitive, `(?<![A-Za-z\[])` and `(?![A-Za-z\]])` so existing markdown links (`[Weapon](...)`) and word-mid mentions (`Droneship`) are skipped
5. Replacement: `[Match](/cards?type={slug})`
6. Restore code-block placeholders

### T8 — Tests

3 split-by-concern test files (~15-20 assertions):

- `tests/afs-18c-manual-routes.test.ts` (~6) — 12 page.tsx files exist, sitemap entries, etape route reads correct file (string-grep), landing-page metadata canonical
- `tests/afs-18c-cross-links.test.ts` (~6) — AlphaCatalog has both label strings, Navigation has `/manual` href + label, EN+DK i18n keys present, AFS-6a-fix `Inventory is last` regression
- `tests/afs-18c-etape03-typelinks.test.ts` (~5) — `injectTypeCrossLinks` runtime: maps each of 9 types to correct slug, code blocks unchanged, "AI Routine" → ai_routine, "Ship Core" → ship_core, headings unchanged

### T9 — Jix live verify (STOP)

Verify on production:
- `/manual` landing renders, sidebar visible, 5 etape cards
- Each `/manual/{slug}` renders cleanly
- Etape 03: clicking "Drone" in prose lands at `/cards?type=drone` with Drones filtered
- `/cards` top: 📖 button visible, navigates to `/manual`
- `/dk/cards` top: 📖 button visible (DK label), navigates to `/dk/manual`
- Universe dropdown: "How to Play" entry visible
- Mobile (375 wide): sidebar moves above content, content readable
- DK mirror routes work (EN content + DK metadata)

### T10 — Sprint close (after Jix ack)

```bash
git tag sprint-afs-18c-complete
git push origin sprint-afs-18c-complete

git add CLAUDE.md
git commit -m "docs(afs-18c): sprint history row + SLUT entry"
git push origin main
```

---

## DEFINITION OF DONE

- [x] SKILL v2 committed
- [x] Backup tag set + pushed
- [ ] All 12 manual routes render (6 EN + 6 DK)
- [ ] Sticky sidebar with active highlight
- [ ] Etape 03 cross-links to `/cards?type=<slug>`
- [ ] "Read the rules" / "Læs reglerne" button on `/cards` + `/dk/cards`
- [ ] "How to Play" in Universe dropdown (EN + DK i18n)
- [ ] Sitemap includes 12 new manual URLs
- [ ] Tests +15-20 green
- [ ] Live verified
- [ ] Tagged + pushed
- [ ] CLAUDE.md updated

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-18c-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-18c-complete
```

No Supabase changes — DB rollback unnecessary.

---

## RISKS

| Risk | Mitigation |
|---|---|
| `remark-gfm` not installed | Install as small dep (~30 KB), required for GFM tables in etape 03 |
| react-markdown SSR issue in server component | Library supports SSR; if it errors at build, switch ManualContent to client component |
| Cross-link regex catches `Weapon` inside `Weapons` | `(?![A-Za-z])` boundary covers it (next char `s` is alpha → no match) |
| `[Weapon](url)` in source markdown gets re-linked | `(?![A-Za-z\]])` skips the match (next char `]` is in negative class) |
| Headings `## TYPE 1: WEAPON` gets a link inserted | Line-skip on `^#` filters all headings |
| `# VOIDEXA — USER MANUAL & UNIVERSE GUIDE` H1 still leaks into render | Strip in `loadEtapeMarkdown` via exact-line regex |
| AFS-6a-fix `Inventory is last` test breaks | Insert "How to Play" mid-list (idx 5), Inventory stays last |
| Mobile sidebar layout breaks | `md:` breakpoint moves sidebar above content; no JS toggle in v1 |
| File-read at request time hurts cold-start | 22 KB max file, single read per request, negligible |
| react-markdown 10.x API change vs older docs | Lock version in package.json, no behavior change expected |

---

## NOTES FOR CLAUDE CODE

1. **Decisions locked.** No further reshape unless implementation surfaces a blocker.
2. **Backup tag** set immediately after this commit, before T2.
3. **No Supabase migration** in this sprint.
4. **`react-markdown` is the renderer.** No MDX. No next-mdx-remote.
5. **`remark-gfm`** required for GFM tables — install if not present, add to package.json.
6. **5 explicit etape routes**, NOT `[slug]` dynamic.
7. **Server components by default.** ManualContent might need `'use client'` if react-markdown 10 + remark-gfm doesn't SSR cleanly in Next.js 16 — verified at build time.
8. **Cross-link regex scoped to etape 03 only.** Etapes 01, 02, 04, 05 render straight.
9. **`📖` emoji in button label** is allowed because Q8 explicitly requested it.
10. **CLAUDE.md update at end** — sprint history row + SLUT entry.
11. **Test split-by-concern**: flat `tests/afs-18c-*.test.ts` naming, three files.
