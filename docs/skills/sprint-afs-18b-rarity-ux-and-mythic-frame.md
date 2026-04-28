# SKILL — AFS-18b: Rarity UX + Mythic Iridescent Frame

**Sprint:** AFS-18b
**Priority:** P2 (UX polish on top of AFS-18 deploy)
**Status:** v1 (pre-flight required before Task 0; this SKILL is itself paused for Jix review of locked decisions before any code)
**Backup tag:** `backup/pre-afs-18b-{YYYYMMDD}` (set at Task 0)
**Sprint tag (on completion):** `sprint-afs-18b-complete`
**Depends on:** AFS-18 ✅ (Alpha 1000 webp deployed, AlphaCardFrame wired with imageUrl, /cards swap shipped)
**Unblocks:** AFS-26 (DK i18n of card UI strings — should land *after* this UX is final to avoid double translation)

---

## SCOPE

Three follow-ups identified during AFS-18 live verify on voidexa.com:

1. **Rarity label visible on card.** Currently only the TYPE pill is visible ("SHIP CORE"). The rarity is communicated by frame color alone, but users don't naturally know "magenta = mythic" or "amber = legendary". Add an explicit text badge (COMMON / UNCOMMON / RARE / EPIC / LEGENDARY / MYTHIC).
2. **Rarity filter on /cards.** Currently only the type filter exists (Weapon / Drone / etc). Add a second filter dimension so users can browse "all Mythics" or "all Rares" across types. URL: `?type=foo&rarity=mythic&page=1`.
3. **Mythic frame visual upgrade.** Locked design vision: mythic must feel like the apex tier — rainbow / iridescent, not just another solid color. Currently magenta border treats mythic visually identical to legendary (only hue differs). The other 5 rarities keep RARITY_GLOW solid colors per AFS-6d "do not touch".

### IN SCOPE

- Rarity badge text rendered in `AlphaCardFrame` with rarity color
- Rarity filter UI in `AlphaCatalog` (second pill row under type filter)
- Server-side rarity filter: `app/cards/page.tsx` and `app/dk/cards/page.tsx` read `?rarity=` searchParam, apply `.eq('rarity', ...)` to alpha_cards query
- Validate `rarity` searchParam (helper in `lib/cards/alpha-types.ts` mirroring `isValidAlphaType`)
- Mythic special-case rendering branch in `AlphaCardFrame` (CSS animated gradient border)
- `prefers-reduced-motion` fallback to static iridescent gradient (no animation)
- Tests: rarity badge presence per rarity, rarity filter walker (type + rarity combine in URL), mythic special-case branch, RPM fallback assertion, regression that the other 5 rarities still use RARITY_GLOW

### OUT OF SCOPE

- DK strings for "COMMON / UNCOMMON / ..." (English UI strings stay per AFS-26 deferral; DK route still mirrors EN labels until AFS-26 ships proper i18n)
- AlphaDeckBuilder filter UI redesign (it already has its own dropdown rarity filter — keep as-is for this sprint; converging filter UI across surfaces is its own sprint)
- Pack-opening reveal animation (AFS-6c domain)
- Battle scene mythic visual treatment (AFS-6h domain)
- Mythic visual on the deck-builder inventory grid (handled automatically because AlphaDeckBuilder also renders AlphaCardFrame, but explicit verification deferred to AFS-18b live verify)

---

## OPEN DECISIONS — JIX LOCKS BEFORE CODE

This SKILL stops at v1 commit. Read through, lock the answers below, then I write v2 and proceed with Task 0.

### Rarity badge

| # | Question | Default proposal | Alternatives |
|---|---|---|---|
| Q1 | Placement on card | Header row, between TYPE pill and energy-cost circle | Bottom of card under stats; below name; corner overlay on art |
| Q2 | Style | Outlined pill (border-only) using rarity color, smaller font than TYPE pill | Solid filled pill; plain uppercase text with no background; metal-style 3D badge |
| Q3 | Text format | `COMMON` / `UNCOMMON` / ... uppercase, font-mono or sans-serif | Title-case ("Common"); shortened ("UNC"); locale-aware once AFS-26 ships |
| Q4 | Always visible | Yes, on every render | Hide on tiny viewport sizes (mobile portrait); show only on hover |

**Recommendation:** Q1 header between TYPE and cost, Q2 outlined pill, Q3 uppercase ASCII, Q4 always visible. Smallest cognitive load + matches existing TYPE pill grammar.

### Rarity filter

| # | Question | Default proposal | Alternatives |
|---|---|---|---|
| Q5 | UI pattern | Second pill row under existing type filter, same visual style | Dropdown; segmented control; sidebar |
| Q6 | URL param name | `?rarity=mythic` (matches DB column) | `?r=mythic`; `?t=mythic` (collides with type — bad) |
| Q7 | "All rarities" pill present? | Yes, default-active | No — force a single rarity always |
| Q8 | Order of pills | Power order: All · Common · Uncommon · Rare · Epic · Legendary · Mythic | Reverse (Mythic-first); alphabetical |
| Q9 | Combining with type filter | AND — both narrow the result set independently | Replace mode (changing rarity resets type) |
| Q10 | Page reset on rarity change | Yes, jump to page 1 | Stay on current page index |
| Q11 | Apply to AlphaDeckBuilder too | No — it already has its own dropdown filter; keep until convergence sprint | Replace its dropdown with new pill row (scope creep) |

**Recommendation:** Q5 pill row, Q6 `?rarity=`, Q7 yes default-active, Q8 power order, Q9 AND, Q10 reset to page 1, Q11 leave deck-builder alone.

### Mythic iridescent frame

| # | Question | Default proposal | Alternatives |
|---|---|---|---|
| Q12 | Animation | Yes — slow conic gradient rotation (~6s loop) | Static iridescent gradient; faster cycle; pulse-only |
| Q13 | Color palette | Full rainbow conic: magenta → cyan → yellow → magenta (3-stop loop, smooth) | Holographic foil (silver/cyan/magenta); narrow rainbow (cyan/magenta/yellow); customer-locked palette |
| Q14 | Affects what | Border only (2-3px conic-gradient via padding-box + border-box trick) | Border + outer glow shimmer; border + name-text gradient; full-card shimmer overlay |
| Q15 | Background under border | Solid `bg-zinc-950` (current) | Subtle radial gradient inside; dark navy with starfield texture |
| Q16 | Reduced-motion fallback | Static linear-gradient (same colors, no animation) | Pure solid color (revert to current magenta) |
| Q17 | Performance limit | None — 20 mythic cards max on a single page is fine for animated borders | Pause animation off-screen via `IntersectionObserver`; cap to N visible at once |
| Q18 | Touch the other 5 rarities? | No — RARITY_GLOW stays per AFS-6d "do not touch" | Slight tweak to legendary as well (counter-recommendation) |

**Recommendation:** Q12 slow rotate, Q13 magenta→cyan→yellow conic, Q14 border only, Q15 keep current bg, Q16 static gradient on RPM, Q17 no limit, Q18 don't touch.

### Implementation approach lock

| # | Question | Default proposal | Alternatives |
|---|---|---|---|
| Q19 | Where does mythic CSS live? | Inline style in AlphaCardFrame for the `isMythic` branch + minimal global CSS for `@keyframes` (added to `app/globals.css` or new `components/cards/mythic.css`) | All-inline (no global CSS); tailwind plugin extension |
| Q20 | Frame animation property | CSS custom property + `@property` declaration for `<angle>` rotation | Pure transform-based (rotate parent); JS-driven `requestAnimationFrame` |

**Recommendation:** Q19 inline + minimal global keyframes in `app/globals.css`, Q20 `@property` for `<angle>` so the gradient angle interpolates smoothly (modern browsers handle this; fallback to static gradient on older browsers).

---

## EXECUTION RULE

`claude --dangerously-skip-permissions` mode for sprint execution.

**Stop checkpoints:**
- This SKILL v1 commit (now — wait for Jix to lock decisions)
- Pre-flight findings (after Task 1)
- Task 4 mythic visual review (Jix eyeballs the animation before tests)
- Task 7 live verify

---

## PRE-FLIGHT (mandatory — STOP after for Jix approval)

Per AFS-6b + AFS-18 lessons: even short SKILLs can ride on stale assumptions. Verify before code.

### Step 0.1 — AlphaCardFrame current structure

```bash
grep -n "className\|<header\|<article\|imageUrl\|RARITY_GLOW" components/cards/AlphaCardFrame.tsx | head -30
```

Confirm header has the `flex items-center justify-between` row that we'll insert the rarity badge into.

### Step 0.2 — AlphaCatalog filter UI scaffolding

```bash
grep -n "VALID_ALPHA_TYPES\|nav\|aria-label" components/cards/AlphaCatalog.tsx | head -20
```

Confirm the existing type-filter nav can be duplicated for rarity without restructuring.

### Step 0.3 — alpha_cards rarity column

Already verified in AFS-18 pre-flight: `rarity text NOT NULL CHECK (rarity IN ('common','uncommon','rare','epic','legendary','mythic'))`. Re-confirm in this pre-flight only if migrations added since:

```bash
grep -A2 "rarity" supabase/migrations/20260425_afs6d_alpha_cards_decks.sql
```

### Step 0.4 — Tailwind v4 + globals.css custom keyframes

```bash
test -f app/globals.css && echo "globals.css present" || echo "MISSING"
grep -n "@keyframes\|@property" app/globals.css | head -10
```

Identify whether existing `@keyframes` blocks are present (mythic adds one) and whether `@property` is already used anywhere.

### Step 0.5 — `prefers-reduced-motion` precedent in repo

```bash
grep -rn "prefers-reduced-motion" --include="*.tsx" --include="*.ts" --include="*.css" | head -10
```

If any existing code respects RPM, follow that pattern. Otherwise add via `@media (prefers-reduced-motion: reduce)` in CSS.

### Step 0.6 — RARITY_GLOW current Mythic value

```bash
grep -A2 "Mythic" components/combat/cardArt.ts | head -10
```

Capture the current solid color for documentation in the SKILL v2 reshape report (so we know exactly what visual we're replacing on mythic only).

### STOP CHECKPOINT — Pre-flight findings report

```
PRE-FLIGHT FINDINGS

1. AlphaCardFrame header layout: [structure summary]
2. AlphaCatalog filter scaffolding: [reusable / needs refactor]
3. alpha_cards.rarity: [confirmed / changed]
4. globals.css + @keyframes: [present / absent / has existing animations to coexist with]
5. prefers-reduced-motion precedent: [pattern X / no precedent — establish]
6. RARITY_GLOW.Mythic current value: [hex/rgb]

PROPOSED SKILL v2 RESHAPE (if any):
- [bullet list of corrections]

WAITING FOR JIX APPROVAL TO PROCEED.
```

If reshape needed: write SKILL v2, commit, then proceed.

---

## TASK 0 — SKILL v2 commit (mandatory rule)

After Jix locks the open-decision answers above and pre-flight findings are reviewed:

```bash
# Update docs/skills/sprint-afs-18b-rarity-ux-and-mythic-frame.md to v2
# (replace OPEN DECISIONS table with locked values, fold pre-flight findings)
git add docs/skills/sprint-afs-18b-rarity-ux-and-mythic-frame.md
git commit -m "chore(afs-18b): SKILL v2 with locked decisions + pre-flight findings"
git push origin main

# Backup tag
git tag backup/pre-afs-18b-{YYYYMMDD}
git push origin backup/pre-afs-18b-{YYYYMMDD}
```

---

## TASK 1 — Rarity helpers (lib)

Extend `lib/cards/alpha-types.ts`:

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

Note: lowercase `AlphaRarity` already exists in `AlphaCardFrame.tsx` — share via import to avoid duplicate union types. If types diverge, refactor to single source in alpha-types.ts.

---

## TASK 2 — Rarity badge on AlphaCardFrame

Add badge between TYPE pill and energy-cost circle in the existing `<header>` row:

```tsx
<header className="flex items-center justify-between gap-2 px-3 py-2">
  <span className="rounded-full px-2 py-0.5 text-sm font-semibold uppercase tracking-wider"
    style={{ backgroundColor: `${color}22`, color }}
  >
    {type}
  </span>

  {/* AFS-18b: Rarity badge (outlined pill, color matches frame) */}
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

Header now uses `gap-2` (already there) — three children fit. If overflow on smaller widths, switch to `flex-wrap` (verify in live test).

---

## TASK 3 — Rarity filter UI (AlphaCatalog)

Add second pill row directly under the existing type-filter nav. New nav reads `currentRarity` prop, shows All + 6 rarities. Each pill links to the same page with the rarity query param updated.

```tsx
<nav aria-label="Card rarity filter" className="mb-4 flex flex-wrap gap-2">
  <Link
    href={rarityHref(null)}
    aria-current={!currentRarity ? 'page' : undefined}
    className={pillClass(!currentRarity)}
  >
    All
  </Link>
  {VALID_ALPHA_RARITIES.map((r) => (
    <Link
      key={r}
      href={rarityHref(r)}
      aria-current={currentRarity === r ? 'page' : undefined}
      className={pillClass(currentRarity === r)}
    >
      {ALPHA_RARITY_LABELS[r]}
    </Link>
  ))}
</nav>
```

Where `rarityHref(r)` builds a URL preserving the active type but resetting page to 1:

```tsx
const rarityHref = (r: AlphaRarityDb | null) => {
  const sp = new URLSearchParams()
  sp.set('type', activeType)
  if (r) sp.set('rarity', r)
  sp.set('page', '1')
  return `${basePath}?${sp.toString()}`
}
```

Update existing type pills similarly so they preserve `currentRarity` when changing type.

`pillClass` extracted helper to dedupe the active/inactive class strings. Total file size impact ~30 lines — fits within component 300-line cap.

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

// ...same pagination math...

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

`AlphaCatalog` receives new optional `activeRarity?: AlphaRarityDb | null` prop, defaults to `null`.

---

## TASK 5 — Mythic iridescent frame (special-case)

In `AlphaCardFrame.tsx`:

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
        ? { boxShadow: '0 0 24px rgba(255,0,255,0.45), 0 0 48px rgba(0,255,255,0.25)' }
        : {
            borderColor: color,
            boxShadow: `0 0 12px ${color}55, inset 0 0 6px ${color}22`,
          }
    }
  >
    {/* ...rest unchanged, including header rarity badge from Task 2... */}
  </article>
)
```

Add to `app/globals.css`:

```css
/* AFS-18b - Mythic iridescent frame.
 * Border drawn via padding-box + border-box gradient trick so a thin colored
 * border ride on top of the dark card background. @property allows the
 * --mythic-angle to interpolate smoothly across the keyframe loop.
 */

@property --mythic-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.mythic-frame {
  border: 2px solid transparent;
  background:
    linear-gradient(theme(colors.zinc.950), theme(colors.zinc.950)) padding-box,
    conic-gradient(
      from var(--mythic-angle),
      #ff00ff,
      #00ffff,
      #ffff00,
      #ff00ff
    ) border-box;
  animation: mythic-rotate 6s linear infinite;
}

@keyframes mythic-rotate {
  to { --mythic-angle: 360deg; }
}

@media (prefers-reduced-motion: reduce) {
  .mythic-frame {
    animation: none;
    background:
      linear-gradient(theme(colors.zinc.950), theme(colors.zinc.950)) padding-box,
      linear-gradient(135deg, #ff00ff, #00ffff, #ffff00) border-box;
  }
}
```

If `theme()` fn isn't available in Tailwind v4 globals.css, hardcode `#0a0a0a` (zinc-950 hex).

The badge text in Task 2 still reads "MYTHIC" — that's intentional. The rainbow border + the explicit text together communicate apex tier.

---

## TASK 6 — Tests

Target: ~+18-22 assertions across 3 files (matching AFS-18 split-by-concern).

### tests/afs-18b-rarity-helpers.test.ts (~5)

- `VALID_ALPHA_RARITIES` lists the 6 lowercase rarities in power order
- `ALPHA_RARITY_LABELS` maps each db key to its titlecase label
- `isValidAlphaRarity` accepts all 6, rejects 'invalid', empty, undefined
- `DEFAULT_ALPHA_TYPE` from AFS-6d still 'weapon' (regression)
- `ALPHA_PAGE_SIZE` still 20 (regression)

### tests/afs-18b-rarity-badge.test.ts (~6)

- AlphaCardFrame source contains `data-testid="rarity-badge"` element in header
- Badge has `aria-label` referencing rarity
- Badge styling references `borderColor` derived from rarity color
- For each of 6 rarities, ensure badge text appears uppercase via the JSX literal `{rarity}` rendered inside an `uppercase` className
- Header still preserves TYPE pill (regression)
- Header still preserves energy_cost circle (regression)

### tests/afs-18b-rarity-filter.test.ts (~5)

- AlphaCatalog imports VALID_ALPHA_RARITIES + ALPHA_RARITY_LABELS
- AlphaCatalog renders second nav with `aria-label="Card rarity filter"`
- AlphaCatalog renders an "All" link distinct from rarity pills
- Pages (EN + DK) read rarity searchParam via `isValidAlphaRarity`
- Pages apply `.eq('rarity', ...)` conditional on filter (string-grep)

### tests/afs-18b-mythic-frame.test.ts (~5)

- AlphaCardFrame source has `isMythic` branch
- `mythic-frame` className appears in source
- `app/globals.css` contains `@keyframes mythic-rotate`
- `app/globals.css` contains `prefers-reduced-motion: reduce` block
- Other 5 rarities still receive `border-2` className (regression)

---

## TASK 7 — Live verification

Wait for Vercel deploy, then verify on production voidexa.com:

| Check | Expected |
|---|---|
| `/cards` | Type pills visible, rarity pills visible below them, "All" rarity active by default |
| `/cards?type=weapon&rarity=common` | Only common weapons rendered, count reflects subset |
| `/cards?type=ai_routine&rarity=mythic` | Only mythic AI Routines rendered, frames are rainbow/animated |
| Switch type while rarity=mythic active | URL changes type, rarity stays, page resets to 1 |
| Switch rarity while type set | URL changes rarity, type stays, page resets to 1 |
| Each card shows uppercase rarity badge | "COMMON" / "MYTHIC" etc visible between TYPE and energy cost |
| Mythic card visual | Animated rainbow border, distinct from solid colors of other 5 tiers |
| Reduce motion: System Settings on PC → see static iridescent gradient on mythic | No animation, gradient still rainbow (not solid magenta) |
| `/dk/cards?rarity=epic` | DK shell with rarity filter applied, English UI strings (per AFS-26 deferral) |
| `/cards/alpha?rarity=...` | Backward-compat alias also respects new filter (verify it routes through same component) |

Spot-check 6 cards, one per rarity tier, to confirm the badge text matches the frame color.

---

## TASK 8 — Sprint close

```bash
git tag sprint-afs-18b-complete
git push origin sprint-afs-18b-complete
# Update CLAUDE.md SPRINT HISTORY row + add SLUT entry
git add CLAUDE.md && git commit -m "docs(afs-18b): sprint history row + SLUT entry"
git push origin main
```

Final state checks:
- `git status` clean
- `git log origin/main --oneline -5` shows AFS-18b as HEAD
- All tests green
- Build clean

---

## DEFINITION OF DONE

- [ ] SKILL v2 committed (locked decisions + pre-flight findings)
- [ ] Rarity badge text visible on every card render
- [ ] Rarity filter pill row visible on `/cards` and `/dk/cards`
- [ ] URL `?type=foo&rarity=bar&page=N` parses correctly server-side
- [ ] Combining type + rarity narrows the catalog (AND semantics)
- [ ] Mythic cards render rainbow/iridescent border (animated by default)
- [ ] `prefers-reduced-motion` falls back to static iridescent gradient
- [ ] Other 5 rarities visually unchanged (RARITY_GLOW preserved)
- [ ] Tests +18-22 green, no regressions
- [ ] Live verified on voidexa.com (10-row checklist above)
- [ ] Tagged + pushed
- [ ] CLAUDE.md updated

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-18b-{YYYYMMDD}
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-18b-complete
```

No Supabase changes in this sprint, so no DB rollback needed.

---

## RISKS

| Risk | Mitigation |
|---|---|
| Rarity badge crowds the header on narrow widths | Live verify mobile portrait; if cramped, switch header to `flex-wrap` or hide badge under 320px |
| `@property --mythic-angle` unsupported on older browsers | Falls back gracefully — the gradient becomes static (still rainbow, just no rotation). Equivalent to RPM mode. Acceptable degradation |
| Mythic animation hurts framerate on low-end mobile | 20 mythic cards max per page, 6s rotation = trivial GPU load. Confirm in live perf check; if needed, gate animation on `(prefers-reduced-motion: no-preference)` only and require a JS pref toggle |
| Tailwind v4 globals.css does not accept `theme()` fn | Hardcode `#0a0a0a` for zinc-950 (verified in pre-flight) |
| AlphaCatalog basePath logic doesn't preserve rarity when changing type | Test 7 covers; helper `rarityHref` and a sibling `typeHref` both build URLs from `URLSearchParams` constructor, never string concat |
| AlphaDeckBuilder also renders mythic cards through AlphaCardFrame | Inherits the rainbow border automatically (single source of truth in component). Live-verify in deck builder too |
| Pre-flight reveals different file structure than assumed | SKILL v2 reshape per AFS-6b/18 lesson — STOP at Step 0.6 before touching code |

---

## NOTES FOR CLAUDE CODE

1. **SKILL v1 is paused** — wait for Jix to lock OPEN DECISIONS Q1-Q20 before any code or pre-flight execution.
2. **Backup tag check** — `backup/pre-afs-18b-{YYYYMMDD}` may need creation (no prior tag at this name yet).
3. **No Supabase migration** in this sprint — pure UI + URL param changes.
4. **`<img>` stays** — AFS-18 picked plain `<img>` over `next/image`; do not regress.
5. **'use client' on AlphaCardFrame stays** — already required by AFS-18 onError handler.
6. **CLAUDE.md update at end** — sprint history row required.
7. **Frame colors UNCHANGED** for the 5 non-mythic rarities — RARITY_GLOW stays per AFS-6d/18 rule.
8. **Test split-by-concern** — flat `tests/afs-18b-*.test.ts` naming, not `tests/cards/`.
