# SKILL — AFS-MICRO-FIX: GHAI Sidebar Overlap + Starmap Terminal 95%

**Sprint:** AFS-MICRO-FIX
**Status:** 🔴 Ready to execute
**Priority:** P1 (visible UX bugs on conversion-critical pages)
**Depends on:** AFS-OVERLAY-FIX-V2 ✅ (`0457b32`)
**Estimated:** 1 session, 2 fixes (~30-60 min)
**Tag on complete:** `sprint-afs-micro-fix-complete`
**Backup tag before start:** `backup/pre-afs-micro-fix-20260428` → `0457b32`

---

## SCOPE

Two small fixes consolidated:

| # | Page | Type | Bug |
|---|---|---|---|
| 1 | `/void-pro-ai` | overlap | Jarvis CommBubble (bottom-left) overlaps GHAI sidebar text "More details available at" |
| 2 | `/starmap/voidexa` | string | Terminal display "compress 95%" + "range 95%" → "~93%" (matches AFS-FIX-COMBO /quantum precedent) |

**Out of scope:**
- AFS-10 starmap optical (zoom + star renderer blending) — separate larger sprint
- AFS-EMAIL-KNAP — new feature, not fix
- Sovereign Sky launch animation — waiting on video
- Other 95% references on voidexa.com that haven't been verified yet (only the 2 verified terminal strings here)

---

## CONTEXT — VERIFIED LIVE STATE (Apr 28)

### Fix 1 — `/void-pro-ai` GHAI sidebar overlap

**Visual evidence (zoomed screenshot bottom-left):**
The Jarvis CommBubble (small chat icon circle, fixed bottom-left, z-50) is rendered over the GHAI sidebar's bottom area. The text "More details available at" is partially blocked by the bubble.

**Components involved (per AFS-OVERLAY-FIX-V2 pre-flight inventory):**
- `components/chat/UniverseChat.tsx` — fixed bottom-left, z-50, MessageCircle icon (the circle that overlaps)
- `components/ghost-ai/GhaiTicker.tsx` — sidebar text "The ecosystem token of voidexa" / "Token details available at launch"
- `components/ghost-ai/ChatSidebar.tsx` — sidebar container

**Why this exists:**
In the original AFS-OVERLAY-FIX-V1 plan, Fix 2 was "route-skip UniverseChat on /void-chat because it's already a chat surface." We DROPPED that fix in v2 because we renamed Void Chat → Void Pro AI (premium AI provider gateway, not a chat). The route-skip argument collapsed.

But the visual overlap still exists. Different fix needed.

**Fix approach options:**

**A)** Add bottom padding to GHAI sidebar so text ends above bubble zone (CSS-only, contained to ChatSidebar.tsx)
**B)** Move UniverseChat bubble to bottom-right on /void-pro-ai (avoid sidebar entirely)
**C)** Hide UniverseChat on /void-pro-ai pages (route-skip after all — but the original argument doesn't hold; Void Pro AI users may still want UniverseChat for community help)

**Recommended: A** — least invasive, contained, preserves UniverseChat availability. Add ~80px bottom padding (or matches bubble height + margin) to the sidebar's content area. The "More details available at" text becomes the last visible line, not clipped.

### Fix 2 — `/starmap/voidexa` terminal 95% display

**Verified live (Apr 28):**
The KCP-90 protocol terminal on `/starmap/voidexa` displays:
- `compress...........95%`
- `range...........95%`

**Other terminal strings (LEAVE AS-IS):**
- `sessions...........247` — likely live counter or static demo number, untouched
- `binary: active | shm: active` — technically correct (KCP-BINARY SHM is active in Quantum)

**Target:** Both `95%` → `~93%`

**Reasoning:** Same logic as AFS-FIX-COMBO Fix 5 (locked SLUT 16 rule):
- Display deployed reality, never future targets
- Current deployed: kcp90-v2 v0.4.0 = ~92.9% / ~93%
- v3 (95.67%) NOT deployed to production yet (blocked by AFS-15)

When AFS-15 ships v3 to production, both /quantum and /starmap terminal can be updated to 95%+ together.

---

## VERIFY-FIRST PRE-FLIGHT (MANDATORY)

**Stop for Jix approval after pre-flight before any code change.**

### Pre-flight Task 0.1 — confirm git state

```powershell
git status
git log origin/main --oneline -3
# Expected HEAD: 0457b32 (test(afs-overlay-fix-v2): lock overlay fix + rename + 960 cleanup)
```

If HEAD ≠ `0457b32`, stop and reconcile.

### Pre-flight Task 0.2 — Fix 1 grep (GHAI sidebar bottom padding)

```powershell
# Find ChatSidebar component layout
git grep -nE "ChatSidebar" -- "*.tsx" "*.ts"

# Find sidebar bottom-area styling
git grep -nE "GhaiTicker|ecosystem token|More details available|details available at" -- "*.tsx" "*.ts"

# Confirm UniverseChat bubble position constants
git grep -nE "bottom-6|left-6" -- "components/chat/UniverseChat.tsx"
```

Read ChatSidebar.tsx and identify where to add bottom padding (likely on the GhaiTicker container or sidebar content wrapper).

### Pre-flight Task 0.3 — Fix 2 grep (95% terminal strings)

```powershell
# Find the starmap voidexa terminal component
git grep -nE "kcp status|sessions\.\.\.|compress\.\.\.|range\.\.\.|binary: active" -- "*.tsx" "*.ts"

# Find specific 95% occurrences in starmap context
git grep -n "95%" -- "components/starmap/**" "app/starmap/**"

# Verify these are the only 2 hits in /starmap/voidexa terminal
```

For each hit, verify it's the terminal display we identified live (compress + range). Other 95% references in starmap (if any) should be classified before fixing.

### Pre-flight Task 0.4 — produce report

| Fix | File | Line(s) | Change |
|---|---|---|---|
| 1 | TBD (likely `components/ghost-ai/ChatSidebar.tsx`) | TBD | add bottom padding ~80px |
| 2 | TBD (likely `components/starmap/KcpProtocolTerminal.tsx` or similar) | TBD | `95%` → `~93%` ×2 (compress + range) |

**STOP. Show table to Jix. Wait for explicit approval before continuing.**

---

## TASKS (post pre-flight approval)

### Task 1 — Backup tag

```powershell
git tag backup/pre-afs-micro-fix-20260428 0457b32
git push origin backup/pre-afs-micro-fix-20260428
```

### Task 2 — Commit this SKILL

```powershell
git add docs/skills/afs-micro-fix-SKILL.md
git commit -m "skill(afs-micro-fix): ghai sidebar overlap + starmap terminal 95%"
git push origin main
```

### Task 3 — Fix 1: GHAI sidebar bottom padding

Add bottom padding to the GHAI sidebar content area so "More details available at" text clears the UniverseChat bubble zone (bubble is ~56px tall + 24px margin = 80px clearance needed).

Implementation:
- Identify wrapper element in ChatSidebar.tsx or GhaiTicker.tsx
- Add `pb-20` Tailwind class (or equivalent inline style for ~80px)
- Verify visually that on /void-pro-ai the bubble no longer overlaps the text

Commit:
```
fix(afs-micro-fix): ghai sidebar bottom padding clears universechat bubble
```

### Task 4 — Fix 2: starmap terminal 95% → ~93%

Replace both occurrences in starmap terminal component:
- `compress...........95%` → `compress...........~93%`
- `range...........95%` → `range...........~93%`

Note: the terminal uses padding/dots to align values. Don't break the alignment — `~93%` is one character longer than `95%`, so adjust dot count accordingly if needed (likely `compress...........~93%` becomes `compress..........~93%` to keep visual alignment).

Commit:
```
fix(afs-micro-fix): starmap terminal kcp-90 percentage 95% → ~93%
```

### Task 5 — Test additions

`tests/afs-micro-fix.test.ts`:
- ChatSidebar component has bottom padding ≥ 64px (or className assertion `pb-20`)
- Starmap terminal contains `~93%`, NOT `95%` (×2 for compress + range)
- Other terminal strings unchanged: contains `sessions`, `binary: active`, `shm: active`

Target test count delta: ~+4-6 assertions.

Commit:
```
test(afs-micro-fix): lock sidebar padding + terminal kcp-90 percentage
```

### Task 6 — Final tag + push

```powershell
git tag sprint-afs-micro-fix-complete
git push origin main
git push origin sprint-afs-micro-fix-complete

git status
git log origin/main --oneline -7
```

### Task 7 — Live verification (≥90s after push)

Wait minimum 90 seconds for Vercel deploy. Then via Claude in Chrome (incognito + hard reload):

1. `/void-pro-ai` — sidebar text "More details available at" fully visible, NOT clipped by UniverseChat bubble
2. `/starmap/voidexa` — open KCP-90 terminal, verify both `compress` and `range` show `~93%` (not `95%`)
3. `/starmap/voidexa` — verify `sessions`, `binary: active`, `shm: active` all unchanged

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST (before any code)
- [ ] Backup tag `backup/pre-afs-micro-fix-20260428` pushed
- [ ] Pre-flight grep + file inventory shown to Jix and approved
- [ ] Both fixes implemented per approved scope
- [ ] Tests green (1370 baseline + ~4-6 new = ~1374-1376)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint baseline unchanged
- [ ] Committed + tagged + pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -7` shows commits on remote
- [ ] Tag `sprint-afs-micro-fix-complete` on remote
- [ ] Wait ≥90s for Vercel deploy
- [ ] Hard-refresh incognito live-verify (3 checkpoints above)
- [ ] CLAUDE.md updated + uploaded to Project Knowledge at SLUT
- [ ] INDEX deltas delivered at SLUT (04, 08, 11)
- [ ] No regressions on AFS-OVERLAY-FIX-V2 (re-verify /break-room, /void-pro-ai, top nav, starmap node, redirects)

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-micro-fix-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-micro-fix-complete
```

No data migrations. No schema changes. Pure code (CSS class + 2 string replaces).

---

## RISKS

- **Lowest risk sprint of the day.** Pure CSS padding + string replace.
- **Risk:** If terminal alignment uses fixed character count, `~93%` (4 chars) vs `95%` (3 chars) may need dot adjustment. Visual check after build will catch this.
- **Risk:** GHAI sidebar bottom padding may push other content. Check that nothing important sits below GhaiTicker that would now be hidden or pushed off-screen.
- **Lint baseline** — 221 pre-existing issues. Don't introduce new ones.

---

## CLAUDE CODE EXECUTION COMMAND

After Jix approves SKILL:

```powershell
claude --dangerously-skip-permissions
```

Then point Claude Code at this SKILL.md.
