# SPRINT 13F — RUN INSTRUCTIONS
## Security Triage — 17 Dependabot alerts

---

## Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

---

## Box 2 — Paste when Claude Code is ready

```
Read docs/skills/sprint-13f-security-triage.md and execute it completely from STEP 1 through STEP 7. Follow all pre-tasks, tasks, exit criteria, and stop conditions exactly as specified. Priority order: critical first, then high, then moderate. Defer breaking-change upgrades to docs/SECURITY_DEFERRED.md rather than risk test regression. Commit and deploy when all tests pass. Report back with the full Sprint 13F Security Triage Report as specified in STEP 7.
```

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13f-20260418
git push --force-with-lease origin main
```
