# game-agents — voidexa Star System design consultants

Reference agents adapted from [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) (`Donchitos/Claude-Code-Game-Studios`, MIT). The originals are engine-agnostic; these versions are rewritten for voidexa's stack (Next.js 16 + React Three Fiber + Supabase + Stripe) and vocabulary (ships, cards, ranks, races, missions, alien tech, planets).

## When to use

Each agent acts as a **consultant** — it asks clarifying questions, presents 2–4 options with reasoning, drafts incrementally with explicit approval, and refuses to push past unclear requirements. None of them write production code; that's still your call.

| Agent | When to invoke |
|---|---|
| `economy-designer` | Adjusting shop pricing, dust/craft costs, top-up bundles, new currency, daily rewards, sink/faucet balance, FOMO flags |
| `combat-designer` | Tuning card energy curves, ship class balance, alien-tech backfire %, dogfight weapons, race power-up rubber-banding |
| `systems-designer` | Writing formulas — rank points, gravity score, mission XP, leaderboard scoring; building interaction matrices |
| `level-designer` | Designing race tracks, mission encounters, free-flight zones (asteroid fields, nebula belts), galaxy view layout |
| `qa-tester` | Generating test plans, writing vitest cases for `lib/*`, regression checklists before deploys, bug-report templates |
| `ux-designer` | Cockpit HUD layout, chat bubble + window, on-boarding flows, accessibility passes (font ≥16/14, opacity ≥0.5), mobile fallbacks |

## Cross-cutting rules every agent honors

- **No pay-to-win.** Master plan Part 3 line 190. Shop sells looks; gameplay earns stats.
- **Out-of-band sovereignty.** Free Flight content (asteroids, NPCs, alien tech) loads ONLY in `/freeflight`. Navigation mode never pays for it.
- **Existing modules are source of truth.** Before proposing new mechanics check:
  - `lib/game/` — physics, ships, ranks, alien tech, cards, NPCs
  - `lib/cards/` — deck, collection, starter set
  - `lib/shop/` — items + rotation
  - `lib/race/` — tracks, power-ups, scoring, tournaments
  - `lib/missions/` — catalogue, progress, daily, story
  - `lib/achievements/` — definitions, titles, tracker
  - `lib/chat/` — types, commands, moderation, formatting
- **Master plan is canonical.** `docs/VOIDEXA_STAR_SYSTEM_COMPLETE_PLAN_v1.2_FINAL.md`. Defer to it on conflicts.
- **Style minimums.** Body text ≥16px, labels ≥14px, opacity ≥0.5. Match the dark space aesthetic.

## How to invoke an agent

In Claude Code:

```
/skill game-agents:economy-designer
```

Or load the SKILL.md inline as context for an existing chat. Each agent file is self-contained — collaboration protocol, key responsibilities, output formats, and what NOT to do.

## What's NOT here (yet)

- Narrative director / writer roles — voidexa lore is small enough to handle in the master plan
- Audio designer — no in-game audio yet; Suno jukebox is content-only
- Live ops — too early; revisit when daily/weekly cadence is real
- Engine specialists (Godot/Unity/Unreal) — not our stack

If a future task needs one of these, copy the original from the upstream repo (`/tmp/game-studios-ref/.claude/agents/`) and adapt it to our stack.

## Templates that pair with these agents

Living under `docs/templates/`:

- `economy-model.md` — produced by `economy-designer`
- `balance-sheet.md` — produced by `combat-designer` / `systems-designer`
- `gdd.md` — produced by `systems-designer` / `level-designer` / `combat-designer`

Each template has voidexa-specific defaults pre-filled (5 ship classes, 5 card rarities, 6 ranks, etc.).

## License

Original agents and templates are MIT-licensed by Donchitos. These adaptations follow the same terms — see `LICENSE` upstream.
