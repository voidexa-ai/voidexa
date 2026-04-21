# SPRINT 14B — QUANTUM TOOLS NAV DROPDOWN
## Skill file for Claude Code
## Location: C:\Users\Jixwu\Desktop\voidexa\docs\skills\sprint-14b-quantum-tools-nav.md

---

## SCOPE

Add a new top-level navigation dropdown called **"Quantum Tools"** to voidexa.com main navigation, between Products and Universe.

**Contents (in this exact order):**
1. Void Chat → `/void-chat`
2. Quantum Chat → `/quantum/chat`
3. Quantum Forge → `https://forge.voidexa.com` (external link, opens in new tab)

**Does NOT touch:**
- Products dropdown (unchanged)
- Universe dropdown (unchanged — keep Star Map, voidexa System, Free Flight, Shop, Cards, Achievements, Assembly Editor, Break Room)
- Home, About dropdowns
- Mobile hamburger menu must also show Quantum Tools

---

## WHY

All three products are live but invisible in site navigation:
- voidexa.com/void-chat exists and responds 200
- voidexa.com/quantum/chat exists (Quantum multi-AI debate UI)
- forge.voidexa.com live (Quantum Forge, phase-1-deployed tag)

These are voidexa's flagship AI products. They must be discoverable from main nav.

---

## PRE-TASKS

1. `git status` — must be clean. Stash or commit first if dirty.
2. `git tag backup/pre-sprint-14b-20260418`
3. `git push origin --tags`
4. `npm test` baseline — record number (expect 718/718 from Sprint 14a).
5. Identify the main nav component file:
   ```powershell
   Get-ChildItem components -Recurse -Include "*Nav*.tsx","*nav*.tsx","Header*.tsx","header*.tsx" | Select-Object FullName
   ```
   Likely path: `components/layout/Nav.tsx` or `components/nav/MainNav.tsx`.

---

## TASKS

### STEP 1 — Locate nav component

Read the main nav component. Find where "Products" and "Universe" dropdowns are defined. Note the exact patterns used (likely either hardcoded JSX with dropdown items OR a data-driven config like `const navItems = [...]`).

### STEP 2 — Insert Quantum Tools dropdown

Add new dropdown between Products and Universe. Match the existing dropdown pattern exactly (same styling, same hover behavior, same mobile behavior).

**Dropdown label:** `Quantum Tools`

**Items (in this order):**
```
Void Chat      → /void-chat               (internal route)
Quantum Chat   → /quantum/chat            (internal route)
Quantum Forge  → https://forge.voidexa.com (external, target="_blank", rel="noopener noreferrer")
```

For the external link on Quantum Forge, add a small external-link icon next to the label if the nav component already has an icon pattern for such links. If not, just add the `target="_blank"` behavior without an icon — do not invent new icon styles.

### STEP 3 — Mobile hamburger menu

Verify the mobile menu (hamburger icon → slide-out drawer) also shows Quantum Tools dropdown. If the nav is data-driven from a single config, step 2 automatically handles this. If it's hardcoded separately for mobile, duplicate the pattern.

### STEP 4 — Remove Void Chat from anywhere else if duplicated

Check if Void Chat is currently surfaced elsewhere (Products dropdown, footer, homepage). If it's duplicated, leave it where it is — do NOT remove existing entries. Only ADD the new Quantum Tools dropdown.

### STEP 5 — Tests

Add a test: `tests/components/nav-quantum-tools.test.tsx`:
- Asserts Quantum Tools dropdown exists
- Asserts 3 items in correct order: Void Chat, Quantum Chat, Quantum Forge
- Asserts Quantum Forge has target="_blank" and rel="noopener noreferrer"
- Asserts internal links use correct hrefs (/void-chat, /quantum/chat)

Run tests:
```powershell
npm test
```

Target: 718 baseline + 4 new minimum = **722+ passing**.

### STEP 6 — Build + lint

```powershell
npm run build
npm run lint
```

Both must be clean.

### STEP 7 — Commit + deploy

```powershell
git add .
git commit -m "feat(sprint-14b): add Quantum Tools nav dropdown (Void Chat, Quantum Chat, Quantum Forge)"
git push origin main
```

Vercel auto-deploys.

### STEP 8 — Live verification

After deploy completes (~1 min):
```powershell
curl -sI https://voidexa.com | Select-Object -First 1
```

Expected: HTTP/2 200

Then report to user: "Deploy complete — verify at https://voidexa.com, open hamburger menu, confirm Quantum Tools dropdown appears with 3 items in correct order."

### STEP 9 — Tag

```powershell
git tag sprint-14b-complete
git push origin --tags
```

### STEP 10 — Report

Produce `docs/PHASE1_14B_REPORT.md`:

```
SPRINT 14B — QUANTUM TOOLS NAV REPORT
======================================

Status: [success/partial/blocked]

Files modified:
- [nav component path]
- tests/components/nav-quantum-tools.test.tsx (new)

New dropdown: Quantum Tools
Position: between Products and Universe
Items:
  1. Void Chat → /void-chat
  2. Quantum Chat → /quantum/chat
  3. Quantum Forge → https://forge.voidexa.com (new tab)

Mobile menu: [verified/not tested]
Tests: [X/X passing — baseline 718 → now Y]
Build: clean
Lint: clean

Commit: [hash]
Deploy: [Vercel URL]
Tag: sprint-14b-complete pushed

Known side effects: none expected (additive only)

Next sprints (NOT in 14b scope):
- 14c: Exploration encounter dismissible modals
- 14d: Audio event wiring
- 14e: Realtime subscriptions
```

---

## EXIT CRITERIA

- Quantum Tools dropdown visible in desktop nav
- Quantum Tools dropdown visible in mobile hamburger menu
- 3 items in exact order: Void Chat, Quantum Chat, Quantum Forge
- Quantum Forge opens in new tab
- Tests 722+ passing
- Build + lint clean
- Deployed to voidexa.com
- Tag sprint-14b-complete pushed

---

## STOP CONDITIONS

- Nav component uses non-standard pattern that requires refactor beyond additive change → halt, report
- Tests regress below 718 → halt, rollback
- Build fails → halt, rollback
- 1 hour wall clock reached → halt, ship if safe checkpoint, otherwise rollback

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-14b-20260418
git push --force-with-lease origin main
```

---

## SCOPE REMINDER

Purely additive. No removing existing items. No redesigning the nav. No touching Products/Universe contents. Just add one new dropdown with 3 links in a specific order.
