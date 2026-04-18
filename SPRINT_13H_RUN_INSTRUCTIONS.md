# SPRINT 13H — RUN INSTRUCTIONS
## Test Checklists for Shop, Cards, Free Flight

---

## Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

---

## Box 2 — Paste when Claude Code is ready

```
Read docs/skills/sprint-13h-test-checklist.md and execute it completely from STEP 1 through STEP 7. Read git log from 2026-04-14 through 2026-04-18 filtered by Shop, Cards, and Free Flight file paths. Produce three focused test checklists in docs/test-checklists/. Every item must trace to a real commit hash. Cross-reference existing tests in tests/ where applicable. This is a documentation sprint — no code changes. Report back with the full Sprint 13H Report including item counts per checklist and a sample of shop.md.
```

---

## AFTER COMPLETION

The three checklists will be in `docs/test-checklists/`:
- `shop.md`
- `cards.md`
- `freeflight.md`

Start a **new chat** with Claude in Chrome enabled and say:

> "Read docs/test-checklists/shop.md and walk through each item on https://voidexa.com. For each item, visit the route, check what's described, and update the status from ❓ to ✅ / ❌ / ⚠️ with evidence. Report findings when done."

Repeat for cards.md and freeflight.md (each in its own chat).

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13h-20260418
git push --force-with-lease origin main
```
