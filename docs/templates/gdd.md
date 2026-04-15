# [System / Mechanic Name]

> **Status:** Draft | In Review | Approved | Implemented
> **Author:** [agent or person]
> **Last updated:** [Date]
> **Last verified:** [Date — when this doc was last confirmed accurate against current code]
> **Implements pillar:** [Which voidexa pillar this supports — e.g. "looks-not-stats", "no-pay-to-win", "out-of-band sovereignty"]

## Summary

[2–3 sentences. What this system is, what it does for the player, why it exists. Plain language — a skill scanning 20 GDDs uses this paragraph to decide whether to read further.]

> **Quick reference** — Layer: `Foundation | Core | Feature | Presentation` · Priority: `MVP | Vertical Slice | Alpha | Full Vision` · Key deps: `[lib modules or "None"]`

## Overview

[One paragraph for someone who knows nothing about voidexa. What is it, what does the player do, why does it exist?]

## Player fantasy

[What should the player FEEL when engaging with this mechanic? The emotional or power fantasy being served. Every detail decision below must serve this.]

## Detailed design

### Core rules

[Precise, unambiguous rules. A programmer should be able to implement this section without asking questions. Numbered for sequential processes, bullets for properties.]

1. ...
2. ...
3. ...

### States and transitions

[If this system has states (e.g. `MissionStatus.Active → Completed`, `AlienTechSlot.stored → installing → installed`), document every state and every valid transition.]

| State | Entry condition | Exit condition | Behaviour |
|---|---|---|---|
| ... | ... | ... | ... |

### Interactions with other systems

[How does this system interact with cards / ranks / shop / chat / missions / races / achievements? For each, specify the interface — what data flows in, what flows out, who is responsible for what.]

| System | Interface | Direction | Owner |
|---|---|---|---|
| `lib/game/ranks` | reads currentRank, writes points delta | bidir | this module |
| `lib/chat` | publishes ChatMessage on system events | out | this module |

## Formulas

For each formula:

### [Formula name]

```
result = base * (1 + modifier_sum) * scaling_factor
```

| Symbol | Type | Range | Source | Description |
|---|---|---|---|---|
| `base` | int | [min–max] | constant | [what this represents] |
| `modifier_sum` | float | [0.0–1.0] | computed | [sum of buffs] |
| `scaling_factor` | float | [0.5–2.0] | constant | [tier-based] |
| `result` | int | [clamped 0–999] | output | [final value] |

**Output range:** [clamped vs unbounded, why]

**Worked example:**

```
base = 10, modifier_sum = 0.3, scaling_factor = 1.5
result = clamp(10 * 1.3 * 1.5, 0, 999) = 19
```

## Edge cases

| Case | Expected behaviour |
|---|---|
| Empty input | [no-op, returns null, throws — pick one] |
| Max input | [clamped, behaviour at boundary] |
| Negative input | [reject, treat as zero, etc.] |
| Concurrent action by multiple players | [serialize, last-write-wins, etc.] |

## UI / UX hooks

[Where in the UI does this surface? What component? What state does it expose?]

- Renders in: `components/[area]/[Component].tsx`
- Reads from: `lib/[area]/[module].ts` exports
- User actions: `[buttons, inputs, hover behaviours]`

## Telemetry

[What events does this system emit? What questions can we answer with the data?]

| Event | Properties | Question it answers |
|---|---|---|
| `mission_started` | mission_id, player_id, ts | Which missions are players starting? |
| `mission_completed` | mission_id, player_id, time_elapsed, repeat_count | How long do completions take? |
| `mission_failed` | mission_id, player_id, reason, ts | What's our fail rate per mission? |

## Dependencies

- **Depends on:** [list lib/* modules and external services]
- **Affects:** [other systems that consume this one's outputs]
- **Coordinates with:** [agents — `economy-designer`, `combat-designer`, etc.]

## Open questions

- [ ] [Anything ambiguous or deferred — note who decides and by when]

## Change log

| Date | Author | Change | Reason |
|---|---|---|---|
| [yyyy-mm-dd] | [you] | Initial draft | New system |
