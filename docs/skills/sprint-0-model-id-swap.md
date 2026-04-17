---
name: sprint-0-model-id-swap
description: Replace all hardcoded `claude-opus-4-6` occurrences with `claude-opus-4-7`
sprint: 0
status: pending
---

## Scope
Five files reference the old model ID:
- `lib/voidforge/planner.ts:19` — `OPUS_MODEL` constant
- `scripts/test-voidforge.ts:39` — diagnostic script default
- `.claude/skills/voidforge/SKILL.md`, `.claude/skills/voidforge/CLAUDE.md`,
  `.claude/skills/voidexa-gaming/CLAUDE.md` — reference docs

## Plan
1. Backup tag `backup/pre-sprint-0-20260417`.
2. Grep for `claude-opus-4-6` → confirm 5 hits.
3. Replace each with `claude-opus-4-7`. Keep the env-override pattern
   (`process.env.VOIDFORGE_OPUS_MODEL || 'claude-opus-4-7'`) intact.
4. Update inline comment "Opus 4.6 model ID" → "Opus 4.7 model ID".
5. `npx next build` + `npm test`.
6. Commit `chore(sprint-0): bump default Opus model to claude-opus-4-7`.
7. Tag `sprint-0-complete`. Push branch + tags.

## Gates
- Grep for `claude-opus-4-6` returns zero.
- Build clean. 599/599 tests green.
