# SKILL — AFS-18b: Rarity UX + Mythic Iridescent Frame (v2)

**Sprint:** AFS-18b
**Priority:** P2 (UX polish on top of AFS-18 deploy)
**Status:** v2 (decisions locked + pre-flight folded in; ready for Task 0 backup tag → Task 1)
**Backup tag:** `backup/pre-afs-18b-20260428` (set at Task 0)
**Sprint tag (on completion):** `sprint-afs-18b-complete`
**Depends on:** AFS-18 ✅ (Alpha 1000 webp deployed, AlphaCardFrame wired with imageUrl, /cards swap shipped)
**Unblocks:** AFS-26 (DK i18n of card UI strings — should land *after* this UX is final to avoid double translation)

---

## V1 → V2 RESHAPE RATIONALE

v1 paused for Jix to lock 20 OPEN DECISIONS. Pre-flight 0.1-0.6 confirmed v1 structure was sound (no premise wrong). v2 differs from v1 only in:

1. **OPEN DECISIONS replaced with LOCKED DECISIONS table** — all 20 answers + 3 concrete hex values
2. **Q13 mythic palette overridden** — magenta + cyan + **gold** (not yellow, "looks cheap"). Concrete hex: `#ec4899` · `#22d3ee` · `#d4af37`
3. **Q16 RPM fallback clarified** — static conic-gradient (same colors, no animation) rather than linear-gradient diagonal. Conic paints all 3 colors around the perimeter automatically.
4. **Pre-flight findings embedded** — patterns established (no `@property` or `prefers-reduced-motion` precedent in repo yet; AFS-18b establishes both)
5. **Stop-checkpoint off-by-one corrected** — visual review is between Task 5 (mythic ship) and Task 6 (tests), not "Task 4"

No file paths changed, no missing infrastructure, no work cancelled. Sprint scope unchanged.

---

## SCOPE

Three follow-ups from AFS-18 live verify:

1. **Rarity badge text** — `COMMON` / `UNCOMMON` / `RARE` / `EPIC` / `LEGENDARY` / `MYTHIC` visible on every card so users don't have to guess "magenta = mythic"
2. **Rarity filter** on `/cards` — second pill row, URL `?type=foo&rarity=bar&page=N`, AND-combine with existing type filter
3. **Mythic iridescent frame** — animated conic-gradient rainbow border (locked palette: magenta · cyan · gold), respects `prefers-reduced-motion`. Other 5 rarities keep `RARITY_GLOW` per AFS-6d/18 "do not touch" rule

### IN SCOPE

- Rarity badge text rendered in `AlphaCardFrame` with rarity color
- Rarity filter UI in `AlphaCatalog` (second pill row under existing type nav)
- Server-side rarity filter on `app/cards/page.tsx` + `app/dk/cards/page.tsx`
- New `isValidAlphaRarity` helper + `VALID_ALPHA_RARITIES` + `ALPHA_RARITY_LABELS` in `lib/cards/alpha-types.ts`
- Mythic special-case rendering in `AlphaCardFrame` + globals.css `mythic-frame` class with `@property --mythic-angle` + `mythic-rotate` keyframe
- `prefers-reduced-motion` static-conic fallback (first RPM precedent in repo)
- Tests +18-22 assertions across 4 split-by-concern files

### OUT OF SCOPE

- DK strings for rarity labels (English UI per AFS-26 deferral)
- AlphaDeckBuilder filter UI redesign (already has its own rarity dropdown — keep until convergence sprint)
- Pack-opening reveal animation (AFS-6c domain)
- Battle scene mythic visual treatment (AFS-6h domain)
- Audit of other animated surfaces for RPM compliance (follow-up sprint)

---

## LOCKED DECISIONS (Apr 28, after Jix review of v1)

### Rarity badge

| # | Decision | Locked value |
|---|---|---|
| Q1 | Placement | Header row, between TYPE pill and energy-cost circle |
| Q2 | Style | Outlined pill (border-only) using rarity color |
| Q3 | Text format | Uppercase ASCII (`COMMON` / `UNCOMMON` / ...) |
| Q4 | Always visible | Yes, on every render (no responsive hide) |

### Rarity filter

| # | Decision | Locked value |
|---|---|---|
| Q5 | UI pattern | Second pill row under existing type filter, same visual style |
| Q6 | URL param name | `?rarity=mythic` (matches DB column name) |
| Q7 | "All" pill | Yes, default-active when no rarity param |
| Q8 | Pill order | Power order: All · Common · Uncommon · Rare · Epic · Legendary · Mythic |
| Q9 | Combining with type | AND — both narrow result set independently |
| Q10 | Page reset on rarity change | Yes, jump to page 1 |
| Q11 | Apply to AlphaDeckBuilder | No — leave its dropdown as-is |

### Mythic iridescent frame

| # | Decision | Locked value |
|---|---|---|
| Q12 | Animation | Slow rotating conic gradient, 6s loop, linear |
| **Q13** | **Color palette** | **3-stop conic: `#ec4899` magenta → `#22d3ee` cyan → `#d4af37` metallic gold → `#ec4899` (loop)** |
| Q14 | Affects what | Border only (padding-box + border-box trick) |
| Q15 | Background under border | Solid `bg-zinc-950` (current) |
| **Q16** | **RPM fallback** | **Same conic-gradient, animation removed. Conic paints all 3 colors around the perimeter automatically — no need for linear-gradient.** |
| Q17 | Performance limit | None — 20 mythic max per page is trivial GPU load |
| Q18 | Touch other rarities | No — RARITY_GLOW stays per AFS-6d/18 "do not touch" |
| Q19 | CSS location | Inline `style` for the `isMythic` boolean branch + minimal CSS in `app/globals.css` for `@property` + `@keyframes` + RPM block |
| Q20 | Animation property | CSS custom property `--mythic-angle: <angle>` registered via `@property` so the conic angle interpolates smoothly. Browsers without `@property` support degrade to static gradient (graceful) |

### Hex palette rationale

- **`#ec4899` magenta** — matches existing `RARITY_GLOW.Mythic` exactly. The rarity badge text on a mythic card uses `frameColor(rarity)` → this same `#ec4899`. So the badge color is one of the three stops in the conic, keeping badge ↔ border visually coherent.
- **`#22d3ee` cyan** — Tailwind cyan-400. Vibrant sci-fi mid-tone. Distinct from the muted blue (`#3b82f6`) used by `RARITY_GLOW.Rare`.
- **`#d4af37` metallic gold** — distinct from `RARITY_GLOW.Legendary = #f59e0b` (amber). Reads "premium luxury" not "video game treasure". Far enough away from legendary's amber to avoid mid-rotation "legendary stripe" perception.

### Patterns AFS-18b establishes in the codebase (first usage)

1. **`@property` declaration** — registers `--mythic-angle` as `<angle>` for smooth keyframe interpolation. Progressive enhancement: unsupported browsers get static gradient (no bug).
2. **`prefers-reduced-motion` media query** — first repo usage. Future animated surfaces should adopt the same pattern.

Both additions live in `app/globals.css` (393 lines pre-sprint, 7 existing `@keyframes` blocks; ~30 line addition is well under budget).

---

## PRE-FLIGHT FINDINGS (DONE Apr 28)

| Step | Finding |
|---|---|
| 0.1 AlphaCardFrame header | `<header className="flex items-center justify-between gap-2 px-3 py-2">` at line 113 with TYPE pill (115) + cost circle (121). Three-child insert is clean — no restructure |
| 0.2 AlphaCatalog filter | `<nav aria-label="Card type filter">` + `VALID_ALPHA_TYPES.map` at line 72-93. `basePath` plumbed through. Pattern duplicates cleanly for rarity nav |
| 0.3 alpha_cards.rarity | Confirmed: `text NOT NULL CHECK (rarity IN (6 values))` + indexed via `idx_alpha_cards_rarity` |
| 0.4 globals.css | 393 lines, 7 existing `@keyframes`, **no `@property` usage anywhere yet** — AFS-18b establishes the pattern |
| 0.5 prefers-reduced-motion | **Zero existing usages in repo** — AFS-18b establishes the precedent |
| 0.6 RARITY_GLOW.Mythic | `#ec4899` (Tailwind pink-500) — used for rarity badge text on mythic cards |

---

## EXECUTION RULE

`claude --dangerously-skip-permissions` mode for sprint execution.

**Stop checkpoints:**
- ✅ SKILL v2 commit (now)
- ✅ Pre-flight findings (folded into LOCKED DECISIONS above)
- ⏸ **Task 5 mythic visual review** (Jix eyeballs the animation on production before Task 6 tests)
- ⏸ Task 7 live verify

---

## TASK 0 — SKILL v2 commit + backup tag

```bash
git add docs/skills/sprint-afs-18b-rarity-ux-and-mythic-frame.md
git commit -m "chore(afs-18b): SKILL v2 with locked decisions + pre-flight findings"
git push origin main

git tag backup/pre-afs-18b-20260428
git push origin backup/pre-afs-18b-20260428
```

---

## TASK 1 — Rarity helpers (lib)

Extend `lib/cards/alpha-types.ts` (currently 46 lines, well under 500-line cap):

```typescript
export const VALID_ALPHA_RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
] as const

export type AlphaRarityDb = (typeof VALID_ALPHA_RARITIES)[number]

export const ALPHA_RARITY_LABELS: Readonly<Record<AlphaRarityDb, string>> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
}

export function isValidAlphaRarity(r: string | undefined): r is AlphaRarityDb {
  return (VALID_ALPHA_RARITIES as readonly string[]).includes(r ?? '')
}
```

Note: `AlphaRarity` already exists in `AlphaCardFrame.tsx` as a structural-equivalent type. They have the same shape (`'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'`). Leave both for now — converging into a single type would require touching every consumer and is out of scope. The structural compatibility is sufficient for TS to accept assignments both ways.

---

## TASK 2 — Rarity badge on AlphaCardFrame

Insert badge between TYPE pill and energy-cost circle in the existing header:

```tsx
<header className="flex items-center justify-between gap-2 px-3 py-2">
  <span
    className="rounded-full px-2 py-0.5 text-sm font-semibold uppercase tracking-wider"
    style={{ backgroundColor: `${color}22`, color }}
  >
    {type}
  </span>

  {/* AFS-18b: Rarity badge - outlined pill, color matches frame */}
  <span
    data-testid="rarity-badge"
    aria-label={`Rarity ${rarity}`}
    className="rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider"
    style={{ borderColor: color, color }}
  >
    {rarity}
  </span>

  <span
    className="flex h-7 w-7 items-center justify-center rounded-full text-base font-bold"
    style={{ backgroundColor: color, color: '#0a0a0a' }}
    aria-label={`Energy cost ${energy_cost}`}
  >
    {energy_cost}
  </span>
</header>
```

If overflow on narrow viewports surfaces during live verify, swap header className to `flex-wrap items-center justify-between gap-2`.

---

## TASK 3 — Rarity filter UI (AlphaCatalog)

Extract a `pillClass` helper to dedupe active/inactive class strings, then render two navs:

```tsx
function pillClass(active: boolean): string {
  return (
    'rounded-full px-4 py-2 text-sm font-semibold transition-colors ' +
    (active
      ? 'bg-zinc-100 text-zinc-900'
      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800')
  )
}

function buildHref(
  basePath: string,
  type: AlphaTypeDb,
  rarity: AlphaRarityDb | null,
  page: number,
): string {
  const sp = new URLSearchParams()
  sp.set('type', type)
  if (rarity) sp.set('rarity', rarity)
  sp.set('page', String(page))
  return `${basePath}?${sp.toString()}`
}
```

Type nav (existing) preserves `activeRarity` when changing type:
```tsx
<Link href={buildHref(basePath, dbType, activeRarity, 1)} ... >
```

New rarity nav under it:
```tsx
<nav aria-label="Card rarity filter" className="mb-6 flex flex-wrap gap-2">
  <Link
    href={buildHref(basePath, activeType, null, 1)}
    aria-current={!activeRarity ? 'page' : undefined}
    className={pillClass(!activeRarity)}
  >
    All
  </Link>
  {VALID_ALPHA_RARITIES.map((r) => (
    <Link
      key={r}
      href={buildHref(basePath, activeType, r, 1)}
      aria-current={activeRarity === r ? 'page' : undefined}
      className={pillClass(activeRarity === r)}
    >
      {ALPHA_RARITY_LABELS[r]}
    </Link>
  ))}
</nav>
```

Pagination links also pass `activeRarity` so paging within a filtered view preserves it.

`AlphaCatalog` adds `activeRarity?: AlphaRarityDb | null` to its props (default null).

---

## TASK 4 — Server-side rarity filter (pages)

`app/cards/page.tsx` + `app/dk/cards/page.tsx`:

```tsx
type SearchParams = { type?: string; rarity?: string; page?: string }

const params = await searchParams
const type = isValidAlphaType(params.type) ? params.type : DEFAULT_ALPHA_TYPE
const rarity = isValidAlphaRarity(params.rarity) ? params.rarity : null
const requestedPage = parsePage(params.page)

let countQ = supabase
  .from('alpha_cards')
  .select('*', { count: 'exact', head: true })
  .eq('type', type)
  .eq('active', true)
if (rarity) countQ = countQ.eq('rarity', rarity)
const { count } = await countQ

// pagination math unchanged

let cardsQ = supabase
  .from('alpha_cards')
  .select(/* same column list */)
  .eq('type', type)
  .eq('active', true)
if (rarity) cardsQ = cardsQ.eq('rarity', rarity)
const { data: cards } = await cardsQ
  .order('id', { ascending: true })
  .range(offset, offset + ALPHA_PAGE_SIZE - 1)

return (
  <AlphaCatalog
    activeType={type}
    activeRarity={rarity}
    /* ...rest... */
  />
)
```

---

## TASK 5 — Mythic iridescent frame

### Sub-task 5.1 — AlphaCardFrame branch

```tsx
const isMythic = rarity === 'mythic'

return (
  <article
    data-rarity={rarity}
    data-type={type}
    data-mythic={isMythic ? 'true' : undefined}
    className={
      'relative flex w-full max-w-[280px] flex-col rounded-xl bg-zinc-950 text-zinc-100 shadow-lg transition-transform hover:scale-[1.02] ' +
      (isMythic ? 'mythic-frame' : 'border-2')
    }
    style={
      isMythic
        ? {
            boxShadow:
              '0 0 24px rgba(236, 72, 153, 0.45), 0 0 48px rgba(34, 211, 238, 0.25)',
          }
        : {
            borderColor: color,
            boxShadow: `0 0 12px ${color}55, inset 0 0 6px ${color}22`,
          }
    }
  >
    {/* header (with rarity badge from Task 2), art, body, comingSoon overlay - all unchanged */}
  </article>
)
```

Mythic outer glow uses pink-500 + cyan-400 RGBA values (matches 2 of 3 conic stops; gold stop is intentionally NOT in the glow because it would warm the halo too much and lose the iridescent feel).

### Sub-task 5.2 — globals.css block

Append to `app/globals.css`:

```css
/* AFS-18b - Mythic iridescent frame.
 * Border drawn via padding-box + border-box gradient trick: the inner
 * solid background fills padding-box, and the conic gradient paints
 * border-box, leaving a 2px colored ring. @property registration on
 * --mythic-angle makes the conic angle interpolate smoothly through
 * the keyframe loop.
 *
 * Palette locked AFS-18b: #ec4899 (matches RARITY_GLOW.Mythic +
 * rarity badge text), #22d3ee (cyan-400), #d4af37 (metallic gold,
 * far enough from legendary's #f59e0b to avoid stripe collision).
 */

@property --mythic-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.mythic-frame {
  border: 2px solid transparent;
  background:
    linear-gradient(#0a0a0a, #0a0a0a) padding-box,
    conic-gradient(
      from var(--mythic-angle),
      #ec4899,
      #22d3ee,
      #d4af37,
      #ec4899
    ) border-box;
  animation: mythic-rotate 6s linear infinite;
}

@keyframes mythic-rotate {
  to { --mythic-angle: 360deg; }
}

@media (prefers-reduced-motion: reduce) {
  .mythic-frame {
    animation: none;
    /* Same conic gradient, frozen at 0deg. Conic paints all 3 stops
     * around the full perimeter so every color is visible without rotation. */
  }
}
```

`#0a0a0a` is the literal hex for Tailwind zinc-950 (`bg-zinc-950`). Hardcoded to avoid relying on `theme()` fn availability in Tailwind v4 globals.css.

### STOP CHECKPOINT — Task 5 visual review

After committing + pushing T1-T5, wait for Vercel deploy, then ask Jix:

> Visit `/cards?rarity=mythic` on production. Eyeball check:
> - Border rotates smoothly through 3 colors (magenta → cyan → gold → magenta)
> - Each color is clearly visible, none feel "missing"
> - Outer glow is pinkish/cyan, not warm-yellow-tinted
> - On macOS System Settings → Display → "Reduce motion" enabled (or Windows Settings → Accessibility → Visual effects → Animation effects off): the border should freeze, but all 3 colors still visible around the perimeter
> - Other rarities (common/uncommon/rare/epic/legendary) UNCHANGED — solid color border per RARITY_GLOW
>
> Reply: "looks good, run tests" OR "fix [specific issue]" before I proceed.

---

## TASK 6 — Tests

Target +18-22 assertions across 4 files (split-by-concern, flat naming per AFS-18 precedent).

### tests/afs-18b-rarity-helpers.test.ts (~5)
- `VALID_ALPHA_RARITIES` lists 6 lowercase rarities in power order
- `ALPHA_RARITY_LABELS` maps each db key to titlecase label
- `isValidAlphaRarity` accepts all 6, rejects 'invalid', '', undefined
- AFS-6d invariants regression: `DEFAULT_ALPHA_TYPE === 'weapon'`, `ALPHA_PAGE_SIZE === 20`

### tests/afs-18b-rarity-badge.test.ts (~6)
- AlphaCardFrame source contains `data-testid="rarity-badge"` element
- Badge has `aria-label` referencing rarity
- Badge styling references `borderColor` derived from rarity color
- For each of 6 rarities, badge renders the lowercase value via JSX `{rarity}` (CSS uppercase comes from className)
- Header still preserves TYPE pill (regression)
- Header still preserves energy_cost circle (regression)

### tests/afs-18b-rarity-filter.test.ts (~6)
- AlphaCatalog imports `VALID_ALPHA_RARITIES` + `ALPHA_RARITY_LABELS` + `getAlphaCardImageUrl`
- AlphaCatalog renders second nav with `aria-label="Card rarity filter"`
- AlphaCatalog renders an "All" link with `aria-current="page"` semantics
- Pages (EN + DK) both import `isValidAlphaRarity` from alpha-types
- Pages apply `.eq('rarity', ...)` conditional on filter (string-grep)
- Page passes `activeRarity` prop to AlphaCatalog

### tests/afs-18b-mythic-frame.test.ts (~5)
- AlphaCardFrame source has `isMythic` branch + `data-mythic` attribute
- `mythic-frame` className appears in source
- `app/globals.css` contains `@property --mythic-angle`
- `app/globals.css` contains `@keyframes mythic-rotate`
- `app/globals.css` contains `prefers-reduced-motion: reduce` block
- All 3 hex palette stops present in globals.css: `#ec4899`, `#22d3ee`, `#d4af37`
- Other 5 rarities still receive `border-2` className (regression)

Total: ~22 assertions.

---

## TASK 7 — Live verification

| Check | Expected |
|---|---|
| `/cards` | Type pills visible + rarity pills below (All default-active) |
| `/cards?type=weapon&rarity=common&page=1` | Only common weapons, count subset, page 1 |
| `/cards?type=ai_routine&rarity=mythic` | Only mythic AI Routines, frames animated rainbow |
| Switch type while rarity=mythic active | URL changes type, rarity preserved, page resets to 1 |
| Switch rarity while type=field active | URL changes rarity, type preserved, page resets to 1 |
| Each card | Uppercase rarity badge between TYPE and energy cost |
| Mythic frame | Smooth conic rotation through magenta/cyan/gold |
| RPM toggle on (OS-level) | Animation freezes, all 3 colors visible around perimeter |
| `/dk/cards?rarity=epic` | DK shell with rarity filter applied, English UI labels |
| `/cards/alpha?rarity=mythic` | Backward-compat alias respects new filter (same component) |

Spot-check 6 cards (1 per rarity tier) to confirm badge text matches frame color.

---

## TASK 8 — Sprint close

```bash
git tag sprint-afs-18b-complete
git push origin sprint-afs-18b-complete

# CLAUDE.md row + SLUT entry
git add CLAUDE.md
git commit -m "docs(afs-18b): sprint history row + SLUT entry"
git push origin main
```

Final state:
- `git status` clean
- HEAD shows AFS-18b commits
- Tests green
- Build clean

---

## DEFINITION OF DONE

- [x] SKILL v2 committed (decisions locked + pre-flight findings folded)
- [ ] Backup tag `backup/pre-afs-18b-20260428` set + pushed
- [ ] Rarity badge text visible on every card
- [ ] Rarity filter pill row visible on `/cards` and `/dk/cards`
- [ ] URL `?type=foo&rarity=bar&page=N` parses correctly server-side
- [ ] Combining type + rarity narrows catalog (AND semantics)
- [ ] Mythic frames render rainbow/iridescent border (animated by default, locked palette `#ec4899` · `#22d3ee` · `#d4af37`)
- [ ] `prefers-reduced-motion` freezes animation, all 3 colors still visible
- [ ] Other 5 rarities visually unchanged
- [ ] Tests +18-22 green, no regressions
- [ ] Live verified on voidexa.com (10-row checklist)
- [ ] Tagged + pushed
- [ ] CLAUDE.md updated

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-18b-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-18b-complete
```

No Supabase changes in this sprint, so no DB rollback needed.

---

## RISKS

| Risk | Mitigation |
|---|---|
| Rarity badge crowds header on narrow widths | Live verify mobile portrait; if cramped, switch header to `flex-wrap` |
| `@property --mythic-angle` unsupported on older browsers | Falls back to static gradient (still rainbow, just no rotation). Equivalent to RPM mode |
| Mythic animation hurts framerate | 20 mythic max per page, 6s rotation, GPU-cheap. If issue: gate on `(prefers-reduced-motion: no-preference)` only |
| Tailwind v4 globals.css `theme()` fn unavailable | Hardcoded `#0a0a0a` for zinc-950 |
| AlphaCatalog basePath logic loses rarity when changing type | `buildHref` helper uses `URLSearchParams` constructor — guarantees correct preservation |
| AlphaDeckBuilder also renders mythic via AlphaCardFrame | Inherits the rainbow border automatically (single source of truth). Live-verify deck builder too |
| Mid-rotation "legendary stripe" perception | `#d4af37` is far from `#f59e0b` — verified during palette pick. Live verify confirms |

---

## NOTES FOR CLAUDE CODE

1. **Decisions are locked.** No further reshape unless an unexpected schema/library issue surfaces during implementation.
2. **Backup tag** — set right after SKILL v2 commit pushes.
3. **No Supabase migration** in this sprint.
4. **`<img>` stays** (per AFS-18 decision; do not regress to `next/image`).
5. **`'use client'` on AlphaCardFrame stays** (already required).
6. **Frame colors UNCHANGED** for the 5 non-mythic rarities — RARITY_GLOW stays.
7. **Test split-by-concern** — flat `tests/afs-18b-*.test.ts` naming, four files.
8. **Stop at Task 5 visual review** — after commit + push, wait for Jix eyeball check on production before running tests.
9. **CLAUDE.md update at end** — sprint history row + SLUT entry.
10. **Establish RPM + `@property` patterns cleanly** — first repo usages, future code should follow this template.
