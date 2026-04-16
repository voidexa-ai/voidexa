"""
lib/game/simulator/engine.py — Voidexa headless card battle simulator.

Pure-logic 1v1 battle simulator. No graphics. Implements PART 5 rules:
  - 20-card decks, 100 hull, 5 starting hand, draw 2/turn, hand limit 8
  - Energy: 1 on turn 1, +1/turn, max 7
  - 8 status effects, drone persistence, exhaust mechanic
  - Greedy AI picks cards by situation
  - Match ends when hull <= 0 or turn 30
"""

import random
from dataclasses import dataclass, field
from typing import Optional


# ---------------------------------------------------------------------------
# Card value estimation (used by greedy AI)
# ---------------------------------------------------------------------------

COST_POWER_DAMAGE = {0: 0, 1: 6, 2: 10, 3: 16, 4: 21, 5: 27, 6: 33, 7: 40}
COST_POWER_BLOCK = {0: 0, 1: 5, 2: 9, 3: 14, 4: 18, 5: 23, 6: 29, 7: 36}


def estimate_card_value(card: dict) -> float:
    """Heuristic value of a card for sorting/selection."""
    s = card.get("stats", {})
    v = 0.0
    v += s.get("damage", 0) * 1.0
    v += s.get("splash", 0) * 0.8
    v += s.get("block", 0) * 0.9
    v += s.get("heal", 0) * 0.85
    v += s.get("absorb", 0) * 0.9
    v += s.get("draw", 0) * 3.0
    v += s.get("energy", 0) * 4.0 if s.get("energy", 0) > 0 else 0
    v += 2.0 * len(s.get("apply", []))
    v += 1.5 * len(s.get("remove", []))
    if s.get("evade"):
        v += 5.0
    if s.get("untargetable"):
        v += 7.0
    if s.get("per_turn", 0) > 0:
        dur = s.get("duration_turns", 1)
        v += s["per_turn"] * dur * 0.9
    if s.get("self_damage", 0) > 0:
        v -= s["self_damage"] * 0.5
    if s.get("exhaust"):
        v -= 1.0
    return max(v, 0.1)


def value_per_cost(card: dict) -> float:
    cost = max(card.get("cost", 1), 0.5)
    return estimate_card_value(card) / cost


# ---------------------------------------------------------------------------
# Drone state
# ---------------------------------------------------------------------------

@dataclass
class ActiveDrone:
    name: str
    damage_per_turn: int = 0
    heal_per_turn: int = 0
    absorb_remaining: int = 0
    apply_status: Optional[str] = None
    turns_remaining: int = 0


# ---------------------------------------------------------------------------
# Player state
# ---------------------------------------------------------------------------

@dataclass
class PlayerState:
    hull: int = 100
    block: int = 0
    energy: int = 0
    max_energy: int = 1

    deck: list = field(default_factory=list)
    hand: list = field(default_factory=list)
    discard: list = field(default_factory=list)
    exhausted: list = field(default_factory=list)

    drones: list = field(default_factory=list)

    # Status flags
    exposed: bool = False
    burn_turns: int = 0
    jammed: bool = False
    locked: bool = False
    shielded: bool = False
    overcharged: int = 0
    drone_marked: bool = False
    scrap_tokens: int = 0

    evade_next: bool = False
    untargetable: bool = False
    reflect_damage: int = 0

    # Turn bookkeeping
    bonus_energy_next: int = 0
    energy_penalty_next: int = 0
    defense_discount: int = 0
    weapon_bonus_damage: int = 0

    # Tracking
    total_damage_dealt: int = 0
    cards_played_ids: list = field(default_factory=list)

    def draw_cards(self, n: int) -> list:
        drawn = []
        for _ in range(n):
            if not self.deck:
                if not self.discard:
                    break
                self.deck = self.discard[:]
                self.discard = []
                random.shuffle(self.deck)
            if self.deck:
                drawn.append(self.deck.pop())
        return drawn

    def add_to_hand(self, cards: list):
        self.hand.extend(cards)
        while len(self.hand) > 8:
            worst = min(self.hand, key=lambda c: estimate_card_value(c))
            self.hand.remove(worst)
            self.discard.append(worst)


# ---------------------------------------------------------------------------
# Resolve a single card play
# ---------------------------------------------------------------------------

def resolve_card(card: dict, player: PlayerState, opponent: PlayerState):
    """Apply card effects from player toward opponent."""
    s = card.get("stats", {})
    ctype = card.get("type", "")
    player.cards_played_ids.append(card["id"])

    # --- Damage ---
    raw_damage = s.get("damage", 0)
    if raw_damage > 0 and ctype in ("weapon", "maneuver"):
        dmg = raw_damage + player.weapon_bonus_damage
        if player.overcharged > 0 and ctype == "weapon":
            dmg = int(dmg * 1.5)
            player.overcharged -= 1
        if opponent.exposed:
            dmg = int(dmg * 1.25)
            opponent.exposed = False
        deal_damage(dmg, opponent)
        player.total_damage_dealt += dmg

    splash = s.get("splash", 0)
    if splash > 0:
        deal_damage(splash, opponent)
        player.total_damage_dealt += splash

    # --- Block ---
    blk = s.get("block", 0)
    if blk > 0:
        cost_card = card.get("cost", 0)
        if ctype in ("defense",) and player.defense_discount > 0:
            pass  # discount already applied to cost check
        player.block += blk

    # --- Heal ---
    heal_val = s.get("heal", 0)
    if heal_val > 0:
        player.hull = min(100, player.hull + heal_val)

    # --- Energy ---
    energy_val = s.get("energy", 0)
    if energy_val > 0:
        player.energy = min(7, player.energy + energy_val)
    elif energy_val < 0:
        player.energy_penalty_next += abs(energy_val)

    # --- Self damage ---
    self_dmg = s.get("self_damage", 0)
    if self_dmg > 0:
        player.hull -= self_dmg

    # --- Draw ---
    draw_n = s.get("draw", 0)
    if draw_n > 0:
        new_cards = player.draw_cards(draw_n)
        player.add_to_hand(new_cards)

    # --- Discard ---
    disc_n = s.get("discard", 0)
    if disc_n > 0 and player.hand:
        for _ in range(min(disc_n, len(player.hand))):
            worst = min(player.hand, key=lambda c: estimate_card_value(c))
            player.hand.remove(worst)
            player.discard.append(worst)

    # --- Evade ---
    if s.get("evade"):
        player.evade_next = True

    # --- Untargetable ---
    if s.get("untargetable"):
        player.untargetable = True

    # --- Absorb (instant drone) ---
    absorb = s.get("absorb", 0)
    if absorb > 0:
        player.drones.append(ActiveDrone(
            name=card["id"], absorb_remaining=absorb, turns_remaining=99
        ))

    # --- Apply statuses ---
    for status in s.get("apply", []):
        apply_status(status, opponent)

    # --- Remove statuses ---
    for status in s.get("remove", []):
        remove_status(status, player)

    # --- Reflect ---
    if s.get("conditional") == "reflect_next_hit":
        player.reflect_damage = s.get("damage", 4)

    # --- Drones (persistent) ---
    if ctype == "drone":
        per_turn = s.get("per_turn", 0)
        dur = s.get("duration_turns", 0)
        heal_pt = 0
        dmg_pt = per_turn
        apply_st = None

        if s.get("heal", 0) > 0 and dur > 0:
            heal_pt = s.get("heal", 0) if s.get("per_turn", 0) == s.get("heal", 0) else per_turn
            dmg_pt = 0

        for st in s.get("apply", []):
            apply_st = st
            dmg_pt = 0

        if dur > 0:
            player.drones.append(ActiveDrone(
                name=card["id"],
                damage_per_turn=dmg_pt,
                heal_per_turn=heal_pt,
                apply_status=apply_st,
                turns_remaining=dur,
            ))

    # --- Defense discount from tactical_predict etc ---
    cond = s.get("conditional", "")
    if "next_defense_costs_1_less" in cond:
        player.defense_discount += 1
    if "next_weapon" in cond and "expose" in str(s.get("apply", [])):
        pass  # expose already applied
    if cond == "next_weapon_double_damage":
        player.weapon_bonus_damage += raw_damage  # rough approx: double
    if "plus_3_weapon_damage" in cond:
        player.weapon_bonus_damage += 3
    if "overcharge" in cond.lower() or "gain_overcharge" in cond:
        player.overcharged += 1
    if "energy_next_turn" in cond:
        player.bonus_energy_next += 1


def apply_status(status: str, target: PlayerState):
    if target.shielded:
        target.shielded = False
        return
    if status == "expose":
        target.exposed = True
    elif status == "burn":
        target.burn_turns = max(target.burn_turns, 2)
    elif status == "jam":
        target.jammed = True
    elif status == "lock":
        target.locked = True
    elif status == "shielded":
        target.shielded = True
    elif status == "overcharge":
        target.overcharged += 1
    elif status == "drone_mark":
        target.drone_marked = True
    elif status == "scrap":
        target.scrap_tokens += 1


def remove_status(status: str, target: PlayerState):
    if status == "burn":
        target.burn_turns = 0
    elif status == "jam":
        target.jammed = False
    elif status == "lock":
        target.locked = False
    elif status == "expose":
        target.exposed = False
    elif status == "overcharge":
        target.overcharged = 0
    elif status == "shielded":
        target.shielded = False
    elif status == "drone_mark":
        target.drone_marked = False
    elif status == "scrap":
        target.scrap_tokens = 0


def deal_damage(amount: int, target: PlayerState):
    if target.evade_next and not target.locked:
        target.evade_next = False
        return
    target.evade_next = False

    remaining = amount

    # Absorb drones first
    for drone in target.drones:
        if drone.absorb_remaining > 0 and remaining > 0:
            absorbed = min(drone.absorb_remaining, remaining)
            drone.absorb_remaining -= absorbed
            remaining -= absorbed

    # Then block
    if target.block > 0 and remaining > 0:
        blocked = min(target.block, remaining)
        target.block -= blocked
        remaining -= blocked

    # Then hull
    if remaining > 0:
        target.hull -= remaining

    # Reflect
    # (handled in the calling context if needed)


# ---------------------------------------------------------------------------
# Turn phases
# ---------------------------------------------------------------------------

def start_of_turn(player: PlayerState, turn_num: int):
    """Energy gain, draw, bonus energy."""
    player.max_energy = min(7, turn_num)
    player.energy = player.max_energy + player.bonus_energy_next - player.energy_penalty_next
    player.energy = max(0, min(7, player.energy))
    player.bonus_energy_next = 0
    player.energy_penalty_next = 0

    player.block = 0  # block doesn't persist between turns (default)
    player.weapon_bonus_damage = 0
    player.untargetable = False

    drawn = player.draw_cards(2 if turn_num > 1 else 0)  # turn 1: already drew 5
    player.add_to_hand(drawn)


def process_drones(player: PlayerState, opponent: PlayerState):
    """Drones fire / heal / apply status at start of owner's turn."""
    surviving = []
    for drone in player.drones:
        if drone.turns_remaining <= 0 and drone.absorb_remaining <= 0:
            continue
        if drone.damage_per_turn > 0:
            deal_damage(drone.damage_per_turn, opponent)
            player.total_damage_dealt += drone.damage_per_turn
        if drone.heal_per_turn > 0:
            player.hull = min(100, player.hull + drone.heal_per_turn)
        if drone.apply_status:
            apply_status(drone.apply_status, opponent)
        drone.turns_remaining -= 1
        if drone.turns_remaining > 0 or drone.absorb_remaining > 0:
            surviving.append(drone)
    player.drones = surviving


def end_of_turn(player: PlayerState):
    """Burn ticks, discard hand, reset flags."""
    if player.burn_turns > 0:
        player.hull -= 4
        player.burn_turns -= 1

    player.jammed = False  # jam lasts one check
    player.defense_discount = 0

    # Discard unplayed hand
    player.discard.extend(player.hand)
    player.hand = []


# ---------------------------------------------------------------------------
# Greedy AI: pick cards to play
# ---------------------------------------------------------------------------

def greedy_pick_cards(player: PlayerState, opponent: PlayerState) -> list:
    """Pick cards from hand to play this turn, spending available energy."""
    playable = []
    for c in player.hand:
        cost = c.get("cost", 0)
        ctype = c.get("type", "")
        if ctype == "defense" and player.defense_discount > 0:
            cost = max(0, cost - player.defense_discount)
        if player.jammed and ctype == "maneuver":
            cost += 1
        if cost <= player.energy:
            playable.append((c, cost))

    if not playable:
        return []

    hull_pct = player.hull / 100.0
    opp_hull_pct = opponent.hull / 100.0

    def priority(item):
        c, cost = item
        ctype = c.get("type", "")
        s = c.get("stats", {})
        val = estimate_card_value(c)

        if hull_pct < 0.4:
            # Survival mode: prioritize defense/heal
            if ctype in ("defense", "consumable") and (s.get("block", 0) > 0 or s.get("heal", 0) > 0):
                val *= 3.0
            elif ctype == "drone" and s.get("heal", 0) > 0:
                val *= 2.5

        if opp_hull_pct < 0.3:
            # Finish them: prioritize damage
            if s.get("damage", 0) > 0:
                val *= 2.5

        return val / max(cost, 0.5)

    playable.sort(key=priority, reverse=True)

    chosen = []
    energy_left = player.energy
    for c, cost in playable:
        if cost <= energy_left:
            chosen.append(c)
            energy_left -= cost
            if len(chosen) >= 4:  # reasonable cap per turn
                break
    return chosen


# ---------------------------------------------------------------------------
# Match simulation
# ---------------------------------------------------------------------------

@dataclass
class MatchResult:
    winner: int  # 0 or 1, -1 for draw
    turns: int
    p0_hull: int
    p1_hull: int
    p0_deck_ids: list
    p1_deck_ids: list
    p0_cards_played: list
    p1_cards_played: list
    p0_damage_dealt: int
    p1_damage_dealt: int


def build_deck(card_pool: list, rng: random.Random, size: int = 20) -> list:
    """Build a random 20-card deck respecting max 2 copies, max 3 rare, 1 legendary, 1 mythic."""
    deck = []
    pool = list(card_pool)
    rng.shuffle(pool)

    id_count = {}
    rare_count = 0
    legendary_count = 0
    mythic_count = 0

    for c in pool:
        cid = c["id"]
        rarity = c.get("rarity", "common")

        if id_count.get(cid, 0) >= 2:
            continue
        if rarity == "rare" and rare_count >= 3:
            continue
        if rarity == "legendary" and legendary_count >= 1:
            continue
        if rarity == "mythic" and mythic_count >= 1:
            continue

        deck.append(dict(c))  # copy
        id_count[cid] = id_count.get(cid, 0) + 1
        if rarity == "rare":
            rare_count += 1
        elif rarity == "legendary":
            legendary_count += 1
        elif rarity == "mythic":
            mythic_count += 1

        if len(deck) >= size:
            break

    # Fill remainder if pool was too restricted
    while len(deck) < size:
        c = rng.choice(card_pool)
        if id_count.get(c["id"], 0) < 2:
            deck.append(dict(c))
            id_count[c["id"]] = id_count.get(c["id"], 0) + 1

    return deck


def simulate_match(deck0: list, deck1: list, rng: random.Random, max_turns: int = 30) -> MatchResult:
    """Run a single match between two pre-built decks. Returns MatchResult."""
    p0 = PlayerState()
    p1 = PlayerState()

    rng.shuffle(deck0)
    rng.shuffle(deck1)

    p0.deck = deck0[:]
    p1.deck = deck1[:]

    # Draw starting hands (5 cards each)
    p0.hand = p0.draw_cards(5)
    p1.hand = p1.draw_cards(5)

    for turn in range(1, max_turns + 1):
        for active, passive in [(p0, p1), (p1, p0)]:
            if active.hull <= 0 or passive.hull <= 0:
                break

            start_of_turn(active, turn)
            process_drones(active, passive)

            if active.hull <= 0 or passive.hull <= 0:
                break

            # Pick and play cards
            to_play = greedy_pick_cards(active, passive)
            for card in to_play:
                if card in active.hand:
                    active.hand.remove(card)
                    real_cost = card.get("cost", 0)
                    if card.get("type") == "defense" and active.defense_discount > 0:
                        real_cost = max(0, real_cost - active.defense_discount)
                        active.defense_discount = max(0, active.defense_discount - 1)
                    if active.jammed and card.get("type") == "maneuver":
                        real_cost += 1
                    active.energy -= real_cost
                    active.energy = max(0, active.energy)

                    if not passive.untargetable or card.get("type") in ("defense", "consumable", "ai"):
                        resolve_card(card, active, passive)
                    else:
                        resolve_card(card, active, active)  # self-only if opponent untargetable

                    if card.get("stats", {}).get("exhaust"):
                        active.exhausted.append(card)
                    else:
                        active.discard.append(card)

            end_of_turn(active)

            if active.hull <= 0 or passive.hull <= 0:
                break

        if p0.hull <= 0 or p1.hull <= 0:
            break

    # Determine winner
    if p0.hull <= 0 and p1.hull <= 0:
        winner = -1
    elif p0.hull <= 0:
        winner = 1
    elif p1.hull <= 0:
        winner = 0
    elif p0.hull > p1.hull:
        winner = 0
    elif p1.hull > p0.hull:
        winner = 1
    else:
        winner = -1

    return MatchResult(
        winner=winner,
        turns=min(turn, max_turns),
        p0_hull=max(0, p0.hull),
        p1_hull=max(0, p1.hull),
        p0_deck_ids=[c["id"] for c in deck0],
        p1_deck_ids=[c["id"] for c in deck1],
        p0_cards_played=p0.cards_played_ids,
        p1_cards_played=p1.cards_played_ids,
        p0_damage_dealt=p0.total_damage_dealt,
        p1_damage_dealt=p1.total_damage_dealt,
    )
