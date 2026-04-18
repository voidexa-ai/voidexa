# SPRINT 13G — RUN INSTRUCTIONS
## Feature Validation Matrix — audit everything built in Sprints 1-13f

---

## Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

---

## Box 2 — Paste when Claude Code is ready

```
Read docs/skills/sprint-13g-feature-matrix.md and execute it completely from STEP 1 through STEP 8. Read every source document listed in the methodology section. Cross-reference git log with sprint docs. Produce docs/VOIDEXA_FEATURE_MATRIX.md with every feature categorized and a validation step defined for each. This is a documentation sprint — no code changes. Exclude confidential items (BWOWC, crypto-GHAI token visibility). Report back with the full Sprint 13G Report including matrix stats and a sample of the top 50 lines of the matrix.
```

---

## AFTER COMPLETION — What to do with the matrix

1. Open `docs/VOIDEXA_FEATURE_MATRIX.md` in your editor — review the list
2. In a **new chat** (preserves context via memory), start a validation session:
   - Prompt: "Read docs/VOIDEXA_FEATURE_MATRIX.md and walk through each feature. Use Claude in Chrome to verify live on voidexa.com. Update each feature's status from ❓ to ✅ / ❌ / ⚠️ with evidence."
   - The AI will work through the matrix one category at a time
3. When validation finds ❌ or ⚠️ items, those become input for the separate deep-analysis sprints (Game / Cards / Shop / Visual)

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13g-20260418
git push --force-with-lease origin main
```
