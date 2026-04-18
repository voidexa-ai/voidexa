# SPRINT 13D — RUN INSTRUCTIONS
## Home dropdown + GHAI display + Mission auto-payout

---

## Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

---

## Box 2 — Paste when Claude Code is ready

```
Read docs/skills/sprint-13d-ghai-nav-payout.md and execute it completely from STEP 1 through STEP 7. Follow all pre-tasks, tasks, exit criteria, and stop conditions exactly as specified. Commit and deploy when all tests pass. Report back when done with: files modified, mission completion handler location found, test count, commit hash, Vercel URL.
```

---

## AFTER COMPLETION — Verify on voidexa.com

1. Visit https://voidexa.com/ in incognito
2. Video plays (existing intro from 13c)
3. **NEW:** Hover "Home" in nav → dropdown shows "Main Page" + "Quick Menu"
4. Click "Quick Menu" → lands on `/?menu=true` showing overlay over backdrop immediately (no video)
5. Click "Main Page" → lands on `/home` with Claim Planet, Meet the team, GHAI cards
6. **NEW:** Log in → top nav shows GHAI balance (e.g., "424 GHAI" instead of "$4.24")
7. **NEW:** Visit `/shop` → all prices in GHAI ("300 GHAI", "150 GHAI", "199 GHAI")
8. **NEW:** Starter Pack button says "BUY · 199 GHAI" (not "COMING SOON · STRIPE")
9. **NEW:** Complete a mission at `/game/mission-board` → GHAI reward auto-credits to wallet balance
10. Existing `/quantum/chat` still works, still shows WalletBar

---

## ROLLBACK IF NEEDED

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13d-20260418
git push --force-with-lease origin main
```
