---
name: card-combat
description: Build the voidexa Phase 11 turn-based card combat system. Use this skill when implementing PvP duels, PvE card encounters, the deck builder UI, the 3D duel zone, card animations on ships, or anything in the card-combat surface. Triggers on "card combat", "duel", "deck builder", "card battle", "PvP", or "Phase 11" in the context of voidexa.
---

# SKILL: Card Combat System
**voidexa Star System — Phase 11: Turn-Based Card Combat**

---

## OVERVIEW

Turn-based card combat integrated into Free Flight. Players duel other players (PvP) or NPC ships (PvE) using decks of 20 cards. Combat takes place in a 3D duel zone with both ships visible. Cards trigger 3D animations on the ships when played.

## DEPENDENCIES

Existing systems used:
- `lib/game/cards.ts` — CardRarity, CardCategory enums, Card interface
- `lib/game/ships.ts` — Ship classes with stats (shield, hull, speed, energyPerTurn, handSize)
- `lib/cards/starter_set.ts` — 40 Core Set cards with stats
- `lib/cards/deck.ts` — Deck management (20 cards, 2-copy limit, hand drawing)
- `lib/cards/collection.ts` — Disenchant, craft, fuse
- `lib/game/ranks.ts` — Rank system, canDuel check
- `lib/game/alientech.ts` — Alien Tech with backfire mechanic
- `lib/achievements/tracker.ts` — PvP achievement tracking

## GAME RULES

### Setup
- Each player brings a deck of 20 cards (built in Deck Builder)
- Max 2 copies of any card, max 1 copy of Legendary cards
- Each player's ship determines base stats: hull, shield, energyPerTurn, handSize
- Coin flip determines who goes first

### Turn Structure
1. **Draw Phase** — Draw 1 card (hand limit = ship's handSize, default 5)
2. **Energy Phase** — Gain energyPerTurn (default 3, depends on ship class)
3. **Play Phase** — Play any number of cards whose total energy cost ≤ available energy
4. **Resolve Phase** — All played cards resolve in order (attack hits, defense activates, etc)
5. **End Phase** — Unused energy does NOT carry over. Turn passes to opponent.

### Win Condition
- Reduce opponent's hull to 0 = WIN
- Shield absorbs damage first, then hull
- If both players alive after 30 turns = draw (no rewards)
- Surrender option (forfeit, counts as loss)

### Card Categories
| Category | Effect |
|---|---|
| Attack | Deal damage to opponent's shield/hull |
| Defense | Add temporary shield, reduce incoming damage |
| Tactical | Buff your ship stats, debuff opponent |
| Deployment | Summon drone/turret that deals damage over turns |
| Alien | Powerful effect BUT 20% backfire chance (damages YOU) |

### Energy Costs by Rarity
| Rarity | Typical Cost | Typical Power |
|---|---|---|
| Common | 1-2 | Low damage/defense |
| Uncommon | 2-3 | Medium |
| Rare | 3-4 | Strong |
| Epic | 4-5 | Very strong |
| Legendary | 5-6 | Game-changing |

---

## UI LAYOUT

### Combat Screen Structure
```
┌──────────────────────────────────────────────┐
│  OPPONENT: [name] [rank]     HULL ████░░     │
│  Ship: [3D model, top half of screen]        │
│  Shield ██████░░    Energy: ⚡⚡○○○           │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │         BATTLE LOG / PLAY AREA       │    │
│  │   "Heavy Barrage hits for 12 dmg"    │    │
│  │   "Shield Plating blocks 8 dmg"      │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  YOUR Ship: [3D model, bottom half]          │
│  HULL ████████░░  Shield ██████████          │
│  Energy: ⚡⚡⚡○○  TURN: [YOUR TURN / WAIT]   │
│                                              │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                   │
│  │C1│ │C2│ │C3│ │C4│ │C5│  YOUR HAND        │
│  └──┘ └──┘ └──┘ └──┘ └──┘                   │
│  [END TURN]              [SURRENDER]         │
└──────────────────────────────────────────────┘
```

### Card Visual (in hand)
```
┌─────────────┐
│ ⚡3  [RARE] │  <- Energy cost + rarity color border
│             │
│  [ART IMG]  │  <- 512x512 render from public/images/renders/
│             │
│ Guided      │  <- Card name
│ Missile     │
│             │
│ Deal 15 dmg │  <- Effect text
│ to target   │
└─────────────┘
```

- Card border color matches rarity (Common=grey, Uncommon=green, Rare=blue, Epic=purple, Legendary=gold)
- Hover card = enlarge + show full description
- Drag card to play area = play it (if enough energy)
- Unplayable cards (not enough energy) = greyed out
- Alien cards show ⚠ backfire warning icon

### 3D Combat Animations
Each card type triggers a visual effect on the 3D ships:

| Card | Animation |
|---|---|
| Plasma Bolt | Blue energy projectile → impact sparks |
| Guided Missile | Missile model curves toward target → explosion |
| Heavy Barrage | Rapid small projectiles stream |
| Nova Launcher | Large orange blast |
| Triple Strike | Three projectiles simultaneously |
| Shield Plating | Blue transparent sphere pulses around ship |
| Hull Reinforcement | Ship glows green briefly |
| Evasive Maneuver | Ship barrel rolls |
| Engine Boost | Thrusters flare, speed lines |
| Deploy Fighter Drone | Small ship model spawns nearby |
| Void Cannon (Alien) | Dark purple beam with distortion |
| Backfire! | Red explosion on YOUR ship, screen shake |

### Camera Behavior
- Default: over-the-shoulder behind your ship, looking at opponent
- When you play a card: camera follows the projectile/effect
- When opponent plays: camera shows their attack coming at you
- Card zoom: camera pulls back to show full field

---

## COMPONENT STRUCTURE

```
components/combat/
├── CombatArena.tsx          — Main 3D scene with both ships
├── CombatUI.tsx             — React overlay (hand, health bars, energy, buttons)
├── CardHand.tsx             — Fan of cards at bottom, drag to play
├── CardComponent.tsx        — Individual card visual (art, stats, glow border)
├── HealthBars.tsx           — Hull + Shield bars for both players
├── EnergyDisplay.tsx        — Energy dots (filled/empty)
├── BattleLog.tsx            — Scrolling text log of actions
├── TurnIndicator.tsx        — "YOUR TURN" / "OPPONENT'S TURN" banner
├── CombatAnimations.tsx     — 3D projectile/shield/effect animations
├── EndScreen.tsx            — Win/Loss/Draw result with rewards
├── DeckBuilder.tsx          — Pre-combat deck building UI
├── CardCollection.tsx       — All owned cards grid view
└── CombatEngine.ts          — Game state machine (turns, damage calc, win check)
```

## DATA FLOW

### PvE (vs NPC)
1. Player encounters hostile NPC in Free Flight
2. Combat starts → CombatArena loads
3. NPC uses a pre-built deck (difficulty-scaled)
4. AI plays cards based on simple rules (play highest damage if can kill, else play defense if low HP, else play random affordable card)
5. Win → XP + credits + maybe card drop
6. Lose → respawn at nearest station, no penalty

### PvP (vs Player)
1. Player A challenges Player B via /duel command or right-click
2. Both must accept
3. Duel zone spawns (isolated sphere in universe, spectators can watch)
4. canDuel(rankA, rankB) checked — must be ±1 rank bracket
5. Turn-based combat
6. Win → rank points + Legendary Purchase Token chance
7. Lose → lose rank points (less if underdog)

### State Machine
```
IDLE → CHALLENGE_SENT → CHALLENGE_ACCEPTED → 
LOADING (decks) → COIN_FLIP → 
TURN_PLAYER_A (draw → energy → play → resolve → end) →
TURN_PLAYER_B (same) →
... repeat until WIN/LOSE/DRAW →
REWARDS → EXIT
```

---

## DECK BUILDER

### Layout
- Left panel: All owned cards in scrollable grid (filter by category, rarity, search)
- Right panel: Current deck (20 slots, shows cards added)
- Bottom: Deck stats (average energy cost, category distribution, rarity spread)
- "Save Deck" / "Load Deck" / "Auto-Fill" buttons
- Validation: real-time check for 20 cards, 2-copy max, 1 legendary max

### Card Collection View
- Grid of all cards player owns
- Cards they DON'T own shown greyed with "?" 
- Dust counter top-right
- "Craft" button on any card → spend dust to create
- "Disenchant" button → destroy card for dust
- "Fuse" → combine 2 same-rarity cards into 1 random next-rarity

---

## BUILD ORDER

### Step 1: Card Component + Collection View
- CardComponent.tsx with art from public/images/renders/weapons/
- CardCollection.tsx grid showing all 40 starter cards
- Route: /cards or accessible from ESC menu

### Step 2: Deck Builder
- DeckBuilder.tsx with drag-and-drop
- Save/load to localStorage
- Validation

### Step 3: Combat Engine (logic only)
- CombatEngine.ts state machine
- Turn management
- Damage calculation
- Energy system
- Win/loss detection
- NPC AI (simple rule-based)

### Step 4: Combat UI
- CombatUI.tsx overlay
- CardHand.tsx fan layout
- HealthBars, EnergyDisplay, BattleLog, TurnIndicator
- Drag-to-play interaction

### Step 5: 3D Combat Arena
- CombatArena.tsx with both ships rendered
- CombatAnimations.tsx — projectiles, shields, effects
- Camera management

### Step 6: PvE Integration
- NPC encounters in Free Flight trigger combat
- Pre-built NPC decks at different difficulties
- Rewards on win

### Step 7: PvP Integration  
- /duel command triggers PvP
- Duel zone spawning
- Spectator mode
- Rank point updates
- Legendary Purchase Token on win

---

## FILES NOT TO TOUCH
- lib/game/cards.ts (already built)
- lib/cards/ (already built)
- lib/game/ships.ts (already built)
- lib/game/ranks.ts (already built)
- public/models/ (asset files)
- Other freeflight components (unless integrating combat entry point)

## TESTING
- CombatEngine: unit tests for all turn phases, damage calc, energy, win conditions
- Deck validation: test 2-copy limit, legendary limit, 20-card requirement
- NPC AI: test that AI always plays valid moves
- Use vitest, match existing test patterns in lib/game/__tests__/
