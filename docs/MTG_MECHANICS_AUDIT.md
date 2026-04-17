# MTG Mechanics Audit — voidexa Card Set (Sprint 9)

Generated 2026-04-17 by `scripts/audit-card-keywords.js`.

## Section A — voidexa Keyword Inventory

The 257-card library uses an **inline-keyword** style: ability flags are
written into `abilityText` as Capitalized Phrases rather than a discrete
`keywords` array. This audit extracts those phrases and counts usage.

| Keyword | Cards | MTG Analog (if any) |
|---|---|---|
| **Exhaust** | 54 | tap (the universal cost) |
| **Weapon** (type-tag) | 13 | — |
| **Hot Deploy** | 9 | **Haste** |
| **Heal** | 8 | regenerate / lifegain |
| **Apply Lock** | 6 | tap / freeze |
| **Scrap** | 6 | sacrifice + draw |
| **Evade** | 6 | hexproof (defensive variant) |
| **Tracking Lock** | 5 | (no analog — designation marker) |
| **Twin Barrels** | 5 | double-shot trigger |
| **Ammo** | 5 | charge counters |
| **Critical Breach** | 5 | (death trigger, partial Deathtouch analog) |
| **Cold Boot** | 5 | **Suspend** / cooldown |
| **Apply Burn** | 3 | (DoT damage stack) |
| **Auto-Repair** | 3 | regenerate |
| **Gain Stealth** | 3 | **Hexproof** |
| **Overcharge** | 4 | **Kicker** |
| **Expose** | 4 | (vulnerability marker; conditional damage) |
| **Negate** | 3 | counterspell |
| **Disable** | 3 | tap/freeze |
| **Priority Fire** | 3 | first-strike (in-faction interpretation) |

The full 40-deep histogram is in `docs/mtg_audit_data.json`.

## Section B — MTG → voidexa Equivalence Table

Coverage status legend:
- **EXISTING** — voidexa has a working analog
- **PARTIAL** — concept is hinted but not formalized
- **GAP** — fits the sci-fi setting but absent
- **N-A** — does not transfer (e.g. Flying in 3D space combat)

| MTG Keyword | voidexa Analog | Status |
|---|---|---|
| Flying | — (3D space — no aerial axis) | **N-A** |
| Trample | Overflow / Pierce | **GAP** |
| Vigilance | (no formal version) | **GAP** |
| Haste | **Hot Deploy** (used 9×) | **EXISTING** |
| First Strike | Priority Fire (3×) — informal | **PARTIAL** |
| Double Strike | — | **GAP** |
| Lifelink | — | **GAP** |
| Deathtouch | Critical Breach (5×) — but fires on self-destruction | **PARTIAL** |
| Reach | — (no flying so unnecessary) | **N-A** |
| Hexproof | **Gain Stealth** (3×), Evade (6×) | **EXISTING** |
| Indestructible | Auto-Repair (3×) — temporary, not permanent | **PARTIAL** |
| Menace | — | **GAP** |
| Defender | — | **GAP** |
| Flash | — (huge gap — no instant-speed plays) | **GAP** |
| Ward | — | **GAP** |
| Prowess | — | **GAP** |
| Scry | — | **GAP** |
| Surveil | — | **GAP** |
| Mill | Disrupt / discard mechanics exist | **PARTIAL** |
| Convoke | — | **GAP** |
| Cycling | — | **GAP** |
| Equip | — (modules implied but not formalized) | **GAP** |
| Kicker | **Overcharge** (4×) | **EXISTING** |
| Flashback | — | **GAP** |
| Madness | — | **N-A** |
| Storm | — | **N-A** (too strong for current pace) |
| Affinity | — (synergies are ad-hoc) | **GAP** |
| Dredge | — | **N-A** |
| Suspend | **Cold Boot** (5×) — different timing model | **PARTIAL** |
| Embalm | — | **N-A** |

**Coverage summary:** 4 EXISTING, 5 PARTIAL, 13 GAP, 5 N-A.
Coverage of MTG core kit: ~30% direct or near-direct.

## Section C — Recommendations

### Adopted this sprint (3 net-new keyword definitions, zero power changes)

These three are added as **typed keyword definitions** in
`lib/game/cards/keywords.ts`. Existing 257 cards are not modified — the
keywords become available for the next set.

1. **Stalwart** (≈ Vigilance) — "When this card attacks, it does not
   Exhaust." Fits capital ships and defensive frames.
2. **Probe** (≈ Scry) — "Look at the top N cards of your draw pile and
   reorder them." Fits sensor/AI card flavor.
3. **Reactive** (≈ Flash) — "May be played during the opponent's turn,
   between their card plays." Adds instant-speed to defensive plays.

### Backlog (not added this sprint)

Considered but deferred — would require balancing each card individually
or rebalancing existing cards:
- **Pierce** (≈ Trample) — overflow damage to next target. Adds a new
  combat-math layer; needs ammo/spread audit first.
- **Drain** (≈ Lifelink) — heal-on-damage. Risk of infinite loops with
  Auto-Repair. Defer until status effects audit.
- **Module** (≈ Equip) — attach a permanent buff card to a unit. Big new
  zone; defer until equipment slot UI is designed.
- **Cycling** — discard for draw 1. Useful but adds a deck-thinning
  metagame; defer until deck-build limits are set.
- **Surveil** — like Probe but optionally mills. Defer until graveyard
  mechanics formalized.
- **Convoke** — multi-card cost reduction. Defer until faction synergy
  spec is complete.

### N-A (don't port)

Flying, Reach, Madness, Storm, Dredge, Embalm — either tied to MTG
biology/spell-stack mechanics, or too dominant in a card-per-turn
economy.

## Section D — Process notes

- Keyword extraction is **regex-based**, not semantic. Multi-word
  phrases like "Hot Deploy" and "Critical Breach" are surfaced; rare
  three-word patterns (e.g. "Once per game") may be miscounted as
  ability words.
- The script lives at `scripts/audit-card-keywords.js`; rerun after any
  card-set change to keep this doc fresh.
- Power-level neutrality verified: tests `lib/game/cards/__tests__` and
  `lib/cards/__tests__` remain green (no card stats touched).
