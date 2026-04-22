# SPRINT AFS-3 — GAME HUB 404 FIXES
## Skill file for Claude Code
## Location: docs/skills/sprint-afs-3-game-hub.md

---

## SCOPE

Game Hub (`/game`) has 8 tiles. 4 work, 4 return 404. All the underlying battle/deck/profile systems are already built — they just aren't wired to routes. This sprint wires them.

**Sprint delivers:**
- New route `/game/card-battle` (wires existing `components/combat/*` + `lib/game/battle/engine.ts` + 5 PvE bosses)
- New route `/game/deck-builder` (wires existing `components/combat/DeckBuilder.tsx`)
- New route `/game/pilot-profile` (wires existing `PilotCard` + Tales log from Sprint 3)
- Fix `/game` tile URL: `/game/shop` → `/shop` (shop is under Universe, not under /game)
- Game Hub tiles UX pass: icons + thumbnails + short descriptions
- DK mirrors for all 3 new routes
- Tests: route smoke + UX integrity
- Live verification all 4 tiles navigate correctly

**Sprint does NOT cover:**
- PvP battle multiplayer (Sprint 17 / later)
- Boss rewards / progression rewards (already in engine — only surfaced if engine returns them)
- Battle Scene 3D enhancements — use Phase 4b scene as-is (commit `5d4ad07`)
- Tutorial flow for first-time card battle players (later sprint)
- Deck validation beyond existing engine rules (already in `lib/game/battle/engine.ts`)

---

## CONTEXT

### Why this sprint

Live audit Apr 21-22 confirmed 4 of 8 Game Hub tiles return 404. Meanwhile:
- `components/combat/` has **11 files / 2319 lines** — full battle UI system exists
- `lib/game/battle/engine.ts` — full server-side engine with 5 bosses
- Phase 4b (April 17, commit `5d4ad07`) shipped PvE Card Battle Scene with Kestrel boss
- Deck Builder UI (584 lines) is complete
- Pilot Profile page was Task 4 in Sprint 3 — may exist partially, needs live check

The work to fix all 4 is **wiring, not building**. Risk: low. Impact: high (unlocks entire card game surface).

### Existing infrastructure (DO NOT rebuild)

**Combat UI components** — `components/combat/`:
- `DeckBuilder.tsx` (584) — full deck builder UI, pulls from `user_cards` Supabase table
- `CardCollection.tsx` (555) — player's owned cards view
- `CombatUI.tsx` (301) — battle interface shell
- `CardComponent.tsx` (332) — single card render
- `CardHand.tsx` (84)
- `BattleLog.tsx` (84)
- `HealthBars.tsx` (109)
- `TurnIndicator.tsx` (73)
- `EnergyDisplay.tsx` (53)
- `EndScreen.tsx` (144) — victory/defeat
- `__tests__/CombatEngine.test.ts` (265 lines) — existing test coverage

**Battle engine** — `lib/game/battle/`:
- `engine.ts` — server-side turn resolution
- `bosses.ts` — 5 hardcoded bosses: `kestrel`, `lantern_auditor`, `varka`, `choir_sight`, `patient_wreck`
- `encounters.ts` — boss → encounter mapping
- `ai.ts` — AI decision logic
- `types.ts` — shared types
- Battle engine test (433 lines) imports all 5 boss encounters

**Supabase tables (from 16 gaming tables migration):**
- `user_cards` — player card collection
- `decks` — saved decks per user
- `deck_cards` — join table deck ↔ cards
- `battle_sessions` — active + historical battles
- `battle_turns` — turn-by-turn log
- `pilot_reputation` — pilot-level stats
- `user_quest_progress` — quest tracking (Pilot Profile surfaces this)
- `universe_wall` — Tales log feed

**Sound integration (already wired per Fase 4 audit):**
- `card_play_weapon`, `card_play_shield`, `card_draw`, `card_discard`
- `turn_start`, `turn_end`
- `victory_fanfare`, `defeat_sound`
- Boss themes: 5 MP3s exist in library (most not yet wired)
- Don't wire new sounds in this sprint — that's AFS-12.

**Achievements integration:**
- 23 achievements system (`lib/achievements/` 757 lines) already tracks battle wins
- Pilot Profile should show achievement progress (exists in `AchievementPanel.tsx` 606 lines)

**Game Hub source:**
- Current 8-tile layout in `app/game/page.tsx`
- UniverseWallFeed at bottom (mock data)

### Pilot Profile specifics

Sprint 3 Task 4 (April 17) stated: *"Pilot profile page + Tales log"* — built but route status unclear. Check first:
```bash
git log --all --oneline -- "app/game/pilot-profile" "components/profile"
git grep -l "PilotCard" app/
```

If `components/profile/PilotCard.tsx` (140 lines, per Fase 7 audit) exists but `app/game/pilot-profile/page.tsx` doesn't, the sprint is glue work only.

---

## TASKS

### Task 1 — Inventory check (FIRST, before any writing)

Before building anything, inventory what already exists:

```bash
cd C:\Users\Jixwu\Desktop\voidexa

# Check existing game routes
ls app/game/

# Check combat components
ls components/combat/

# Check profile components
ls components/profile/ 2>/dev/null || echo "no profile components dir"

# Check if pilot-profile has any old/partial files
git log --all --oneline -- "app/game/pilot-profile" "app/profile" 2>/dev/null

# Grep for any existing references to card-battle and deck-builder routes
git grep -l "/game/card-battle\|/game/deck-builder\|/game/pilot-profile" app/ components/

# Find where the /game page defines its tile list
cat app/game/page.tsx | head -80
```

**Output goes into Task 2 planning.** If any of the 3 target routes already have partial files, adapt approach: finish them, don't duplicate.

---

### Task 2 — Build `/game/card-battle` route

**Location:** `app/game/card-battle/page.tsx`

**Purpose:** PvE card battle entry. User lands here, sees 5 boss encounters (4 wired per audit — patient_wreck may still be pending UI), picks one, enters 3D battle scene.

**Layout pattern:**
- Server component auth check: unauthenticated → redirect to `/auth/login?redirect=/game/card-battle`
- Fetch user's active deck from `decks` table (if none, redirect to `/game/deck-builder` with toast "Build a deck first")
- Fetch user's `battle_sessions` (any active / in-progress? resume button)
- Pass data to client component

**Server component (page.tsx, max 100 lines):**
```typescript
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getBossEncounters } from '@/lib/game/battle/encounters'
import { CardBattleLobbyClient } from '@/components/combat/CardBattleLobbyClient'

export const metadata = {
  title: 'Card Battle — voidexa',
  description: 'Challenge AI bosses in tactical card combat.',
}

export default async function CardBattlePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/game/card-battle')

  const { data: activeDeck } = await supabase
    .from('decks').select('id, name, is_active').eq('user_id', user.id).eq('is_active', true).single()
  if (!activeDeck) redirect('/game/deck-builder?reason=no-active-deck')

  const encounters = getBossEncounters()
  const { data: activeSession } = await supabase
    .from('battle_sessions').select('*').eq('user_id', user.id).eq('status', 'active').maybeSingle()

  return <CardBattleLobbyClient encounters={encounters} activeDeck={activeDeck} activeSession={activeSession} />
}
```

**Client component:** `components/combat/CardBattleLobbyClient.tsx` (max 300 lines)
- Grid of 5 boss cards (Kestrel, Lantern Auditor, Varka, Choir Sight Envoy, Patient Wreck)
- Each: portrait placeholder (no art yet — use colored tile + boss name + rarity badge), difficulty, reward preview
- "RESUME BATTLE" button if activeSession — otherwise "CHALLENGE" button per boss
- Challenge click → POST `/api/battle/start` (if route exists — check first, else use inline `supabase.from('battle_sessions').insert()`) → navigate to `/game/card-battle/[sessionId]`

**Nested dynamic route** — `app/game/card-battle/[sessionId]/page.tsx`:
- Load session
- Verify ownership
- Render `<CombatUI>` (existing 301-line component) with session data
- On battle end → write `battle_sessions.status = 'completed'` + append to `battle_turns` final state

**Files added:**
- `app/game/card-battle/page.tsx` (lobby)
- `app/game/card-battle/[sessionId]/page.tsx` (active battle)
- `app/dk/game/card-battle/page.tsx` + `app/dk/game/card-battle/[sessionId]/page.tsx` (DK mirrors, re-export pattern per AFS-7)
- `components/combat/CardBattleLobbyClient.tsx`

**Reuse:** `CombatUI`, `CardHand`, `BattleLog`, `HealthBars`, `TurnIndicator`, `EnergyDisplay`, `EndScreen`, `CardComponent` — all untouched.

**API route check:** `git grep -r "battle/start\|battle_sessions" app/api/` — if a start endpoint exists, use it. If not, inline Supabase insert is fine (RLS already set).

---

### Task 3 — Build `/game/deck-builder` route

**Location:** `app/game/deck-builder/page.tsx`

**Purpose:** Thin wrapper around existing `DeckBuilder.tsx` (584 lines). That component already queries `user_cards`, renders collection, provides drag-to-deck, saves to `decks` + `deck_cards` tables, enforces deck size rules.

**Server component (max 50 lines):**
```typescript
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { DeckBuilder } from '@/components/combat/DeckBuilder'

export const metadata = {
  title: 'Deck Builder — voidexa',
  description: 'Build and save card decks for battle.',
}

export default async function DeckBuilderPage({
  searchParams
}: {
  searchParams: { reason?: string }
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/game/deck-builder')

  return (
    <main className="min-h-screen">
      {searchParams.reason === 'no-active-deck' && (
        <div className="mx-auto max-w-4xl p-4 mt-4 rounded border border-amber-500/50 bg-amber-950/20 text-amber-200">
          Build and activate a deck before entering Card Battle.
        </div>
      )}
      <DeckBuilder userId={user.id} />
    </main>
  )
}
```

If `DeckBuilder` component doesn't accept a `userId` prop (check first), fall back to the component's internal client auth lookup. Don't modify the component's interface — just wrap it.

**Files added:**
- `app/game/deck-builder/page.tsx`
- `app/dk/game/deck-builder/page.tsx`

---

### Task 4 — Build `/game/pilot-profile` route

**Location:** `app/game/pilot-profile/page.tsx`

**Purpose:** Shows pilot reputation, battle stats, active title, owned cards summary, Tales log (feed of player's notable moments pulled from `universe_wall` filtered by user_id).

**First check:** `git grep -l "PilotCard\|TalesLog\|pilot_reputation" components/ lib/` — Sprint 3 built these. Reuse. If PilotCard at `components/profile/PilotCard.tsx` exists (per Fase 7 audit: 140 lines), import it. If not, build minimal version.

**MVP layout:**
1. Header: pilot callsign + active title + rank badge
2. Stats grid: total battles, wins, win rate, favorite boss (most defeated), best deck (most-played)
3. Achievement progress: show 23-achievement summary (use existing `AchievementPanel` component — import, pass user props)
4. Tales log: last 20 `universe_wall` entries for this user, sorted newest first
5. Cards owned summary: count by rarity (Common/Uncommon/Rare/Legendary/Mythic)

**Server component (max 100 lines):**
```typescript
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { PilotProfileClient } from '@/components/profile/PilotProfileClient'

export const metadata = {
  title: 'Pilot Profile — voidexa',
  description: 'Your callsign, stats, achievements, and tales.',
}

export default async function PilotProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/game/pilot-profile')

  const [profile, reputation, battleStats, tales, cardCounts] = await Promise.all([
    supabase.from('profiles').select('display_name, active_title').eq('id', user.id).single(),
    supabase.from('pilot_reputation').select('*').eq('user_id', user.id).maybeSingle(),
    // battle_sessions aggregate
    supabase.from('battle_sessions').select('status, boss_id').eq('user_id', user.id),
    supabase.from('universe_wall').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    supabase.from('user_cards').select('rarity'),  // aggregate in client
  ])

  return <PilotProfileClient
    profile={profile.data}
    reputation={reputation.data}
    battles={battleStats.data || []}
    tales={tales.data || []}
    cards={cardCounts.data || []}
  />
}
```

**Client component:** `components/profile/PilotProfileClient.tsx` (max 300 lines) — renders sections above. Empty states for each panel if data missing (new pilots).

**Files added (adjust based on Task 1 inventory):**
- `app/game/pilot-profile/page.tsx`
- `app/dk/game/pilot-profile/page.tsx`
- `components/profile/PilotProfileClient.tsx` (if not exists)
- `components/profile/TalesLog.tsx` (if not exists — small sub-component, ~80 lines)

---

### Task 5 — Fix `/game/shop` tile

**Location:** `app/game/page.tsx`

**Problem:** Tile in Game Hub is labeled "Shop" and links to `/game/shop` — which 404s. The real shop is at `/shop`.

**Fix:** Change the tile's `href` from `/game/shop` to `/shop`. Keep it visible in Game Hub as a convenience shortcut.

**DK mirror:** `app/dk/game/page.tsx` — same fix.

**No new routes for this.** `/game/shop` stays a 404 intentionally (we don't want two URLs for the same shop — bad SEO and user confusion).

**Alternative if preferred:** Add a Next.js redirect `/game/shop → /shop` in `next.config.ts` so typed URLs still work. Low effort, worth it. Add it.

---

### Task 6 — Game Hub tiles UX pass

**Current state:** "Minimal UX, 8 tiles no icons" (audit Apr 21).

**Change:**
- Each tile: icon (lucide-react), title, 1-line description, "Enter →" affordance
- Grid layout: 4 columns desktop, 2 columns tablet, 1 column mobile (use Tailwind responsive classes)
- Hover: subtle border glow (match existing voidexa dark theme)
- Status pill on tiles with known state: "ACTIVE" if user has active battle/mission, "COMPLETE" if all quests done, etc. (pull minimal data server-side — one additional Supabase query is fine)

**Icons (lucide-react):**
- Mission Board → `Scroll`
- Speed Run → `Zap`
- Hauling → `Package`
- Card Battle → `Swords`
- Deck Builder → `LayoutGrid`
- Quests → `Compass`
- Pilot Profile → `User`
- Shop → `ShoppingBag`

**Tile descriptions (EN):**
- Mission Board: "Accept contracts from the Cast."
- Speed Run: "Race tracks, beat the clock."
- Hauling: "Deliver cargo across zones."
- Card Battle: "Challenge AI bosses in tactical combat."
- Deck Builder: "Build and save battle decks."
- Quests: "Multi-stage story missions."
- Pilot Profile: "Your callsign, stats, tales."
- Shop: "Cosmetics and card packs."

**DK labels + descriptions:** Mirror in DK dictionary / re-export.

**Keep** `UniverseWallFeed` at bottom (already there, working).

**File touched:** `app/game/page.tsx` + `app/dk/game/page.tsx` + DK i18n entries if using dictionary.

**File size:** page.tsx stays under 100 lines — extract tile list to `components/game/GameHubTiles.tsx` if approaching limit.

---

### Task 7 — Tests

**Route smoke tests** — `tests/game-hub-routes.spec.ts`:
```typescript
test.describe('Game Hub routes', () => {
  test('/game/card-battle requires auth', async ({ page }) => {
    const r = await page.goto('/game/card-battle')
    expect(page.url()).toContain('/auth/login')
  })
  test('/game/deck-builder requires auth', async ({ page }) => { /* ... */ })
  test('/game/pilot-profile requires auth', async ({ page }) => { /* ... */ })
  test('/game/shop redirects to /shop', async ({ page }) => {
    await page.goto('/game/shop')
    await page.waitForURL('**/shop')
  })
})
```

**Game Hub UX tests** — `tests/game-hub-ux.spec.ts`:
- All 8 tiles render
- Each tile has icon + title + description
- Clicking "Card Battle" tile navigates to `/game/card-battle`
- Clicking "Shop" tile navigates to `/shop` (not `/game/shop`)

**Pilot Profile integration test** — `tests/pilot-profile.spec.ts`:
- Authenticated user sees their callsign
- Empty state handles gracefully (new pilots with 0 battles)

**Card Battle lobby smoke** — `tests/card-battle-lobby.spec.ts`:
- Authenticated user with active deck sees 5 boss tiles
- No active deck → redirect to `/game/deck-builder?reason=no-active-deck`

**Target:** +20 to +30 new tests. Final count ~930-940 green (was 910).

---

### Task 8 — Live verification

After Vercel deploy (~90s):

**curl checks:**
```bash
for path in /game /game/card-battle /game/deck-builder /game/pilot-profile; do
  echo "$path:"
  curl -sI "https://voidexa.com$path" | head -2
done

# Shop redirect
curl -sI https://voidexa.com/game/shop | head -5
```

**Expected:**
- `/game` → 200
- `/game/card-battle`, `/game/deck-builder`, `/game/pilot-profile` → 307 to `/auth/login?redirect=...` (correct gated behavior, same pattern as `/wallet` + `/settings` from AFS-2)
- `/game/shop` → 308 or 307 with `Location: /shop` (if redirect added) OR still 404 if decided otherwise (document choice)

**Browser checks (incognito → log in with test account):**
- Visit `/game` → see 8 tiles with icons + descriptions
- Click Card Battle → see 5 boss lobby (or redirect to deck-builder if no active deck)
- Build + activate deck → back to Card Battle → challenge Kestrel → battle scene renders + turn loop works
- Click Pilot Profile → see callsign, stats, empty tales log (for new accounts) or populated (for existing)
- Click Deck Builder → see card collection, build deck, save, activate
- Click Shop → lands on `/shop` (not `/game/shop`)

---

## GIT WORKFLOW

### Pre-sprint

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status                                            # clean (post-cleanup)
git pull origin main                                  # sync with HEAD ac3cdcf
git tag backup/pre-sprint-afs-3-20260422
git push origin backup/pre-sprint-afs-3-20260422
```

### SKILL commit first

```bash
git add docs/skills/sprint-afs-3-game-hub.md
git commit -m "chore(afs-3): add sprint SKILL documentation"
git push origin main
```

### Implementation commits (one per task group)

```bash
# After Task 2 (card-battle)
git add app/game/card-battle app/dk/game/card-battle components/combat/CardBattleLobbyClient.tsx
git commit -m "feat(afs-3): /game/card-battle lobby + dynamic session route"

# After Task 3 (deck-builder)
git add app/game/deck-builder app/dk/game/deck-builder
git commit -m "feat(afs-3): /game/deck-builder route wrapper"

# After Task 4 (pilot-profile)
git add app/game/pilot-profile app/dk/game/pilot-profile components/profile
git commit -m "feat(afs-3): /game/pilot-profile with tales log"

# After Task 5 (shop tile fix + redirect)
git add app/game/page.tsx app/dk/game/page.tsx next.config.ts
git commit -m "fix(afs-3): game hub shop tile points to /shop + redirect"

# After Task 6 (hub UX)
git add app/game/page.tsx app/dk/game/page.tsx components/game
git commit -m "feat(afs-3): game hub tile UX with icons and descriptions"

# After Task 7 (tests)
git add tests/
git commit -m "test(afs-3): game hub routes + UX coverage"
```

### Post-implementation

```bash
npm test                                              # must be 930+ green
npm run build                                         # must succeed
git push origin main
git status                                            # clean
git log origin/main --oneline -8
git tag sprint-afs-3-complete
git push origin sprint-afs-3-complete
```

### Session log

Append to `CLAUDE.md`:

```markdown
### Session 2026-04-22 — Sprint AFS-3: Game Hub 404 Fixes

**Status:** Complete.
**Tag:** sprint-afs-3-complete
**HEAD:** [commit]
**Tests:** [N]/[N] green (was 910)
**Backup:** backup/pre-sprint-afs-3-20260422

**Routes shipped:**
- /game/card-battle (lobby + [sessionId] dynamic)
- /game/deck-builder
- /game/pilot-profile
- All 3 with DK mirrors
- /game/shop 308 → /shop (Next.js redirect)

**UX:**
- 8-tile Game Hub: icons (lucide), descriptions, responsive grid
- UniverseWallFeed retained

**Verified live:**
- All 4 target tiles navigate correctly
- Card Battle lobby renders 5 bosses
- Deck Builder loads card collection
- Pilot Profile shows stats (empty-state works)

**Rollback:** git reset --hard backup/pre-sprint-afs-3-20260422 && git push origin main --force-with-lease
```

Update `11_DAILY_VERIFICATION.md`: new HEAD, test count, mark AFS-3 complete, next pickup is AFS-4 Admin Data Pipeline.

---

## DEFINITION OF DONE

All must be true before tagging:

- [ ] `/game/card-battle` renders 5-boss lobby (authed) or redirects to login (unauthed)
- [ ] `/game/card-battle/[sessionId]` renders `CombatUI` with live session data
- [ ] `/game/deck-builder` renders `DeckBuilder` component, saves decks successfully
- [ ] `/game/pilot-profile` shows callsign + stats + tales log (or clean empty state)
- [ ] `/game/shop` → 308 redirect to `/shop` (or tile points to `/shop` directly)
- [ ] DK mirrors all reachable: `/dk/game/card-battle`, `/dk/game/deck-builder`, `/dk/game/pilot-profile`
- [ ] `/game` tiles have icons + titles + descriptions in both EN and DK
- [ ] `npm test` — 930+ green (was 910)
- [ ] `npm run build` — no errors
- [ ] All commits on `origin/main`, working tree clean
- [ ] Incognito full flow: log in → Game Hub → Deck Builder → build deck → Card Battle → challenge Kestrel → win/lose → return to hub — no errors in browser console
- [ ] `sprint-afs-3-complete` tag pushed
- [ ] `CLAUDE.md` + `11_DAILY_VERIFICATION.md` updated
- [ ] ZERO regressions: `/game/mission-board`, `/game/speed-run`, `/game/hauling`, `/game/quests` still 200 and functional

---

## ROLLBACK

```bash
git reset --hard backup/pre-sprint-afs-3-20260422
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-3-complete
```

Do NOT tag complete if any checkbox above fails. Document blocker in CLAUDE.md under "Blocked sprints" and report.

---

## DEPENDENCIES + NOTES

**Unblocks:**
- AFS-6a (Shop GHAI flow) — needs `/game/card-battle` to exist so pack rewards route users back
- AFS-12 (Sound wiring) — needs battle scene routes live to wire 65 unused sounds to events

**Parallel-safe with:** AFS-4, AFS-5, AFS-7 (no shared files — other than `app/game/page.tsx` edit in Task 5-6 which is scoped to this sprint only).

**Risks:**
- `DeckBuilder` component may require refactoring its auth lookup if it assumes certain context. Prefer wrapping over editing.
- `PilotCard` / Tales log components may not exist despite Sprint 3 Task 4 claim. Task 1 inventory resolves this. If missing, build minimal (Pilot Profile is MVP only).
- `CombatUI` may have hardcoded paths for battle scene — verify it works at `/game/card-battle/[sessionId]`, not a different route.
- `patient_wreck` boss may not have full UI wiring (per INDEX: "4 deployed, 5 hardcoded"). If lobby shows 5 but 5th one errors on challenge, either fix wiring or hide with "Coming soon" badge.

**File size watch:**
- All new `page.tsx` ≤ 100 lines (Tom's rule)
- All new client components ≤ 300 lines
- `CardBattleLobbyClient` most likely to push limits — extract boss grid to sub-component if needed

**Authority hierarchy (if conflict):**
1. Live audit via Claude in Chrome
2. GROUND_TRUTH.md raw log
3. INDEX files (00-18)
4. userMemories
5. Claude session context

Never guess. Search INDEX → raw → past chats → only ask Jix if exhausted.
