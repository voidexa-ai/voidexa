# SPRINT 14A — RUN INSTRUCTIONS
## Auth-lock storm fix (Free Flight performance)

---

## Move files

```powershell
Move-Item "$env:USERPROFILE\Downloads\sprint-14a-auth-lock-fix.md" "C:\Users\Jixwu\Desktop\voidexa\docs\skills\" -Force; Move-Item "$env:USERPROFILE\Downloads\SPRINT_14A_RUN_INSTRUCTIONS.md" "C:\Users\Jixwu\Desktop\voidexa\" -Force; Write-Host "Files moved to voidexa repo"
```

---

## Box 1 — Start Claude Code in voidexa repo

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

---

## Box 2 — Paste when Claude Code is ready

```
Read docs/skills/sprint-14a-auth-lock-fix.md and execute it completely from PRE-TASKS through STEP 13. This sprint has surgical scope — fix the Supabase auth-lock storm on /freeflight ONLY. Do NOT touch tutorial grant, encounter UX, audio wiring, or map redesign. Those are separate sprints (14b, 14c, 14d, Phase 2). If you find yourself wanting to fix anything else, STOP and report. Verify the fix locally AND on production. Tests must stay at 705+. Report back with the full Sprint 14A Report per STEP 13.
```

---

## AFTER COMPLETION

1. Visit https://voidexa.com/freeflight in incognito
2. Open DevTools Console (F12)
3. Verify NO "Lock was not released within 5000ms" warnings
4. Play for 2-3 minutes — should be smooth, no 12-second freezes
5. If freeze storm is gone → re-run Free Flight audit (same prompt as last time) to get clean baseline for Sprint 14b/c/d priorities

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-14a-20260418
git push --force-with-lease origin main
```
