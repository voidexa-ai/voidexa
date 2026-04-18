# SPRINT 13F — SECURITY TRIAGE
## Skill file for Claude Code
## Location: docs/skills/sprint-13f-security-triage.md

---

## SCOPE

Fix the 17 Dependabot vulnerability alerts on voidexa.com:
- 1 critical
- 6 high
- 10 moderate

Priority: critical + high first. Moderate afterwards if safe.

**NOT in scope:**
- Major version upgrades that introduce breaking changes (document for separate sprint)
- Feature work
- New packages

---

## CONTEXT

- Repo: `C:\Users\Jixwu\Desktop\voidexa`
- Framework: Next.js 16, React, Vercel Pro, Supabase
- Current test count: 705/705 green (must stay at 705+)
- Deploy: `git push origin main` (auto-deploy Vercel)
- GitHub org: voidexa-ai

---

## PRE-TASKS

1. `git tag backup/pre-sprint-13f-20260418`
2. `git push origin --tags`
3. Baseline test run: `npm test` (must be 705/705)
4. Baseline build: `npm run build` (must be clean)
5. Save current `package-lock.json` hash for rollback verification

---

## TASKS

### STEP 1 — Enumerate vulnerabilities

Run `npm audit --json > audit-before.json` and parse. Produce table:
- Package name
- Severity (critical/high/moderate/low)
- Vulnerable version
- Patched version available
- Breaking change? (Y/N)

Also run `gh api repos/voidexa-ai/voidexa/dependabot/alerts --paginate > dependabot-alerts.json` if GitHub CLI is authenticated. If `gh` is not available, skip this and use `npm audit` only.

### STEP 2 — Apply safe automated fixes

Run `npm audit fix` (non-breaking only).

Check test status:
- `npm run build` must still be clean
- `npm test` must stay at 705+

If any test fails or build breaks after `npm audit fix`:
- `git checkout package.json package-lock.json`
- Document which automatic fix caused the regression
- Proceed to STEP 3 manually instead

### STEP 3 — Manual fixes for critical + high (if any remain)

For each remaining critical or high alert:

1. Identify the package and patched version
2. Check if patched version is a breaking change:
   - Major version bump (e.g. 4.x → 5.x) = potentially breaking
   - Minor or patch bump (e.g. 4.1 → 4.2) = safe
3. For safe bumps: `npm install <pkg>@<patched-version>`
4. For breaking bumps: 
   - DO NOT auto-update
   - Document in `docs/SECURITY_DEFERRED.md` (create if missing) with: package name, current version, required version, breaking changes summary, estimated effort
5. After each package update:
   - `npm run build`
   - `npm test`
   - If either breaks, revert that package: `git checkout package.json package-lock.json`, document as deferred

### STEP 4 — Moderate alerts (best effort)

Apply same logic as STEP 3 for moderate alerts. Stop if:
- Any test fails after update → revert, document
- 15 minutes wall clock already spent on moderate fixes (prioritize shipping critical/high)

### STEP 5 — Final audit

Run `npm audit --json > audit-after.json`.

Produce delta report:
- Before: 1 critical, 6 high, 10 moderate (expected)
- After: [actual counts]
- Fixed: [list packages fixed]
- Deferred: [list packages deferred with reasons]

### STEP 6 — Build, test, deploy

1. `npm run build` — clean
2. `npm test` — must be 705+
3. `git add .`
4. `git commit -m "fix(security): sprint 13f dependabot triage — critical + high + safe moderates"`
5. `git push origin main`
6. Wait for Vercel deploy
7. `git tag sprint-13f-complete`
8. `git push origin --tags`

### STEP 7 — Report

Produce final report:

```
SPRINT 13F — SECURITY TRIAGE REPORT
===================================

Before:
- Critical: 1
- High: 6
- Moderate: 10
- Total: 17

After:
- Critical: [N]
- High: [N]
- Moderate: [N]
- Total: [N]

Fixed automatically: [count, list packages]
Fixed manually: [count, list packages]
Deferred (breaking changes): [count, list with reason]

Tests: X/X passing
Build: clean
Commit: [hash]
Deploy: [Vercel URL]
Tag: sprint-13f-complete

Follow-up needed:
- [any package requiring breaking upgrade, with estimated effort]
- [anything else found]
```

If `docs/SECURITY_DEFERRED.md` was created/updated, include a note at the bottom with its path.

---

## EXIT CRITERIA

- `npm audit` shows 0 critical remaining (non-negotiable)
- `npm audit` shows 0 or minimal high remaining (breaking ones documented in SECURITY_DEFERRED.md)
- All tests 705+ passing
- Build clean
- Deployed
- Tag `sprint-13f-complete` pushed
- Report produced

---

## STOP CONDITIONS

- `npm audit fix` breaks the build AND no safe manual path exists → halt, rollback all changes, report
- A critical vulnerability has no patch available → halt, document, report (Jix needs to decide between pinning, replacing, or accepting)
- Tests regress below 705 and cannot be recovered → halt, rollback, report
- More than 45 minutes wall clock spent → stop at next safe checkpoint, ship what's fixed, document rest

---

## ROLLBACK

```powershell
git reset --hard backup/pre-sprint-13f-20260418
git push --force-with-lease origin main
```

---

## FILES POTENTIALLY MODIFIED

- `package.json` (dependency versions)
- `package-lock.json` (resolved tree)
- `docs/SECURITY_DEFERRED.md` (new, only if breaking upgrades needed)

No component files expected to change unless a package replacement requires API updates — in which case the update is NOT safe and should be deferred instead.
