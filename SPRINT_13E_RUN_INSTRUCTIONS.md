# SPRINT 13E — RUN INSTRUCTIONS
## Restore Break Room + Verify Sprint 13d

---

## Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

---

## Box 2 — Paste when Claude Code is ready

```
Read docs/skills/sprint-13e-breakroom-verify.md and execute it completely from STEP 1 through STEP 5. Follow all pre-tasks, tasks, exit criteria, and stop conditions exactly as specified. Commit and deploy when all tests pass. Report back with the full Sprint 13E Report as specified in STEP 5.
```

---

## AFTER COMPLETION

Review the Sprint 13E Report. It will tell you:
- Whether Break Room is restored correctly
- Status of all 5 Sprint 13d features on live production
- Any known issues for future sprints

Then decide next step:
- Start separate deep-analysis chats for Game / Cards / Shop / Visual
- OR continue iterating based on verification findings

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13e-20260418
git push --force-with-lease origin main
```
