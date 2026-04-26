# SPRINT 1 — CommBubble Hotfix
## Skill file for Claude Code
## Location: `docs/skills/bugfix-commbubble-position.md`

**Sprint type:** Hotfix (cosmetic / position only)
**Estimated time:** 30 minutes
**Priority:** P0 (blocks UI on 9 ruter)
**Risk:** Low (1-line CSS change)
**Depends on:** Nothing
**Blocks:** Nothing
**Replaces:** Temporary mitigation indtil AFS-13 CommBubble Merge proper sprint

---

## SCOPE

Flyt `JarvisAssistant.tsx` fra `bottom-left` til `bottom-right`. UniverseChat forbliver bottom-left. Dette fjerner z-index overlap-bug der blokerer chat-bubble på 9+ ruter.

**Sprint delivers:**
- Jarvis bubble repositioned to `bottom-right`
- Universe Chat alone på `bottom-left`
- Zero overlap på alle ruter
- 1 commit + tag

**Sprint does NOT cover:**
- Full CommBubble merge (AFS-13 separat sprint)
- Chat-close-bubble-disappears bug (AFS-13 scope)
- Chat-cannot-fold-to-bubble bug (AFS-13 scope)
- Jarvis missing on `/` homepage (AFS-13 scope)
- `hello@voidexa.com` typo fix (AFS-13 scope)

---

## CONTEXT

### Live audit evidence (SLUT 11, Apr 25):

| Widget | z-index | Position |
|---|---|---|
| Jarvis ("AI") | z-[60] | `bottom-left` 27px/27px |
| Universe Chat | z-50 | `bottom-left` 27px/27px |

Identical position klasse → Jarvis (z-60) sidder OVENPÅ Universe Chat (z-50) → blokerer klik.

**Ruter berørt:**
- `/cards`, `/cards/alpha`, `/shop`, `/break-room`, `/wallet`, `/quantum/chat`, `/about`, `/home`
- `/cards/alpha/deck-builder` — bekræftet via Jix screenshot

**Eneste undtagelse:** `/` (homepage) hvor Jarvis ikke vises.

---

## VERIFY-FIRST PRE-FLIGHT (Task 0)

**STOP. Don't make changes yet. Run these greps first and report back.**

```bash
# Find JarvisAssistant component
grep -rn "JarvisAssistant\|class=.*bottom.*left.*z-\[60\]\|className=.*bottom.*left.*z-\[60\]" \
  components/ src/ app/ --include="*.tsx" 2>/dev/null

# Find UniverseChat component to confirm it doesn't move
grep -rn "UniverseChat" components/ src/ app/ --include="*.tsx" 2>/dev/null | head -10

# Confirm aktuel className-pattern på Jarvis bubble
grep -B2 -A5 "fixed bottom-6 left-6 z-\[60\]\|fixed bottom-6 left-6 z-60" \
  components/ src/ app/ -r --include="*.tsx" 2>/dev/null
```

**Expected findings:**
- File: `components/JarvisAssistant.tsx` ELLER `components/jarvis/JarvisAssistant.tsx` ELLER `components/layout/JarvisAssistant.tsx`
- Pattern: contains `fixed bottom-6 left-6 z-[60]` ELLER similar tailwind classes
- UniverseChat: separate file, contains `fixed bottom-6 left-6 z-50`

**STOP. Report findings to Jix:**
1. Faktisk file path til JarvisAssistant
2. Eksakt className-string på den fixed-position div
3. UniverseChat file path (confirm der eksisterer)
4. Wait for approval before proceeding to Task 1.

---

## TASKS (efter Task 0 godkendt)

### Task 1: Backup tag

```bash
git tag backup/pre-commbubble-hotfix-20260426
git push origin backup/pre-commbubble-hotfix-20260426
git ls-remote --tags origin | grep commbubble-hotfix
```

### Task 2: Commit SKILL first

```bash
# Place this SKILL at correct path
cp docs/skills/bugfix-commbubble-position.md docs/skills/bugfix-commbubble-position.md
git add docs/skills/bugfix-commbubble-position.md
git commit -m "docs: SKILL for commbubble hotfix"
```

### Task 3: Edit JarvisAssistant.tsx

**Single-line change** — replace `left-6` with `right-6`:

```diff
- <div className="fixed bottom-6 left-6 z-[60] ...">
+ <div className="fixed bottom-6 right-6 z-[60] ...">
```

**Note:** Behold `z-[60]` — vi flytter bare positionen, ikke layeringen. Dette beskytter mod overlap hvis nogen senere føjer en NY bottom-right widget med lavere z.

If JarvisAssistant uses additional positioning utility classes (e.g. `bottom-6 left-6 md:bottom-8 md:left-8`), update **alle** left-* til right-*:

```diff
- bottom-6 left-6 md:bottom-8 md:left-8
+ bottom-6 right-6 md:bottom-8 md:right-8
```

### Task 4: Add unit test

**Path:** `tests/commbubble-position.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('CommBubble position invariants', () => {
  // VERIFY-FIRST: this path will be confirmed in Task 0 pre-flight
  const jarvisPath = resolve('components/JarvisAssistant.tsx');
  const universeChatPath = resolve('components/UniverseChat.tsx');

  it('Jarvis bubble is positioned bottom-right (not bottom-left)', () => {
    const source = readFileSync(jarvisPath, 'utf-8');
    expect(source).toMatch(/fixed[^"]*bottom-6[^"]*right-6/);
    expect(source).not.toMatch(/fixed[^"]*bottom-6[^"]*left-6/);
  });

  it('UniverseChat remains bottom-left', () => {
    const source = readFileSync(universeChatPath, 'utf-8');
    expect(source).toMatch(/fixed[^"]*bottom-6[^"]*left-6/);
  });

  it('Jarvis maintains z-[60] (not lowered)', () => {
    const source = readFileSync(jarvisPath, 'utf-8');
    expect(source).toMatch(/z-\[60\]|z-60/);
  });
});
```

**Note:** Hvis Task 0 finder andre file paths, opdater test entries.

### Task 5: Run tests + build

```bash
npm test -- tests/commbubble-position.test.ts
npm test
npm run build
```

**Expected:**
- New test file passes (3 assertions)
- Existing test count → 938 + 3 = 941
- Build clean

### Task 6: Commit + tag + push

```bash
git status
git add components/JarvisAssistant.tsx tests/commbubble-position.test.ts
git commit -m "fix(commbubble): move Jarvis to bottom-right to remove overlap with UniverseChat

Live audit SLUT 11 confirmed Jarvis (z-[60]) overlapped UniverseChat
(z-50) on 9 ruter because both sat fixed bottom-left. Quick hotfix:
move Jarvis to bottom-right. Proper merge planned for AFS-13.

Closes: P0 CommBubble overlap on /cards, /cards/alpha, /shop,
/break-room, /wallet, /quantum/chat, /about, /home,
/cards/alpha/deck-builder."

git tag commbubble-hotfix-complete
git push origin main
git push origin commbubble-hotfix-complete

# Post-push verify (Jix rule)
git status                                # clean
git log origin/main --oneline -3          # HEAD shown
```

### Task 7: Vercel deploy + handoff

```bash
# Wait for deploy
sleep 90
```

**STOP.** Hand off til Jix for live audit:
- Jix navigerer til `/cards/alpha/deck-builder` i incognito + hard reload
- Jix bekræfter:
  - Jarvis bubble nu i bottom-right
  - Universe Chat bubble alene i bottom-left
  - Begge klik-bare separat
  - Ingen overlap

---

## DEFINITION OF DONE

- [ ] Task 0 pre-flight godkendt af Jix
- [ ] Backup tag pushed
- [ ] SKILL.md committed first
- [ ] JarvisAssistant.tsx repositioned
- [ ] 3 new test assertions, all passing
- [ ] Total tests 941/941 green
- [ ] Build clean
- [ ] Committed + tagged + pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main` shows HEAD
- [ ] Vercel deploy successful
- [ ] Live verified by Jix on 3 ruter (incognito + hard reload)
- [ ] CLAUDE.md updated (sprint history entry)

---

## ROLLBACK

```bash
git reset --hard backup/pre-commbubble-hotfix-20260426
git push --force-with-lease origin main
git push origin :refs/tags/commbubble-hotfix-complete
```

---

## OUT OF SCOPE (TRACKED)

Disse bugs venter på AFS-13 CommBubble Merge proper sprint:

1. Chat-close-bubble-disappears (P0)
2. Chat cannot fold to bubble (P1)
3. Jarvis missing on `/` homepage (P1)
4. `hello@voidexa.com` typo (P1)
5. Two separate widgets (proper merge til ÉN bubble med tabs)

---

## CLAUDE EXECUTION COMMAND

When you start Claude Code:
```bash
cd C:\Users\Jixwu\Desktop\voidexa
claude --dangerously-skip-permissions
```

Then paste this entire SKILL into the chat with `/effort xhigh`.
