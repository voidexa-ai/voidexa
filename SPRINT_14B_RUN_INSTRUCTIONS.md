# SPRINT 14B — RUN INSTRUCTIONS
## Add Quantum Tools dropdown to voidexa.com nav

---

## Move files

```powershell
Move-Item "$env:USERPROFILE\Downloads\sprint-14b-quantum-tools-nav.md" "C:\Users\Jixwu\Desktop\voidexa\docs\skills\" -Force; Move-Item "$env:USERPROFILE\Downloads\SPRINT_14B_RUN_INSTRUCTIONS.md" "C:\Users\Jixwu\Desktop\voidexa\" -Force; Write-Host "Files moved"
```

---

## Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

---

## Box 2 — Paste when Claude Code is ready

```
Read docs/skills/sprint-14b-quantum-tools-nav.md and execute it completely from PRE-TASKS through STEP 10. This is purely additive — add one new "Quantum Tools" dropdown between Products and Universe with exactly 3 items in order: Void Chat (/void-chat), Quantum Chat (/quantum/chat), Quantum Forge (https://forge.voidexa.com, new tab). Do NOT modify Products or Universe dropdowns. Verify mobile hamburger menu also shows the dropdown. Tests must stay at 718+. Report back with Sprint 14B Report per STEP 10.
```

---

## AFTER COMPLETION

Open https://voidexa.com, click hamburger menu, confirm:
- Quantum Tools dropdown appears between Products and Universe
- Click it → shows Void Chat, Quantum Chat, Quantum Forge (in that order)
- Click each → goes to correct URL
- Quantum Forge opens in new tab

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-14b-20260418
git push --force-with-lease origin main
```
