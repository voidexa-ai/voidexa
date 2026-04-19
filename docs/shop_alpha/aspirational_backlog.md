# VOIDEXA SHOP ALPHA — ASPIRATIONAL BACKLOG (T4 / T5)

Items parked here require game systems that do not exist yet. They are NEVER shipped in the
live catalog. When an underlying system becomes available, items can be promoted out of this
file into a future batch (with a new tier T1/T2/T3 assessment).

Rules from Part 12 of the master doc:
- Never generate T4 or T5 items in the main catalog
- Park them here for future unlocking
- Each entry must specify: idea, capability tier, blocking system, minimum scope to unlock

---

## Batch 01 parking lot

No T4/T5 items arose during Batch 01 — Ship Skins & Decals (Common + Uncommon) all
map to the existing hull-material shader and a decal overlay layer, both of which are
standard T1 texture-swap capability on current ship models. Nothing was deferred.

## Batch 02 parking lot

No T4/T5 items arose during Batch 02 either. All Rare/Epic/Legendary/Mythic ship
skins and Common trails map to T1–T3 capability (hull shaders, emissive textures,
and particle-trail systems that already exist or are a single sprint away). Nothing
was deferred.

## Batch 03 parking lot

No T4/T5 items arose during Batch 03. All Trails & Effects (Uncommon → Mythic)
map to T1–T3 capability: reactor/flame/muzzle-flash color swaps on the existing
particle pipeline (T1), shield-bubble and underglow shader additions (T2), and
five T3 effects (Gravity Well, Phase Shimmer, Aurora Legendary, Event Horizon,
Singularity Wake) that require the same shader-pipeline sprint as the T3 ship
skins from Batch 02. Nothing was deferred.

## Batch 04 parking lot

No T4/T5 items arose during Batch 04. All Card Backs and Card Frames fit within
the existing card-rendering UI layer — static patterns are T1 asset swaps, foil
holographic/glitch patterns are T2 shader passes, and four T3 animated cards
(Phase Glass, Chronomatter Swirl, Voidrunner Sigil, Ancient Relic Sigil Frame)
need an animated-card-surface pipeline that fits inside the card-combat rendering
stack. Nothing was deferred.

## Batch 05 parking lot

No T4/T5 items arose during Batch 05. Battle boards, music loops, screens, damage
numbers, and targeting reticles all map to T1 asset swaps, T2 shader/animated
scene passes, and two T3 items (Crimson Nebula Foundry board, Heroic Last Stand
Defeat Screen) that need the animated-large-scale-scene pipeline inside card
combat. Nothing was deferred.

## Batch 06 parking lot

No T4/T5 items arose during Batch 06. All cockpit interior categories map to
existing cockpit-render, audio-ambience, and dashboard-decor systems. Three T3
items (Crystal Cathedral Cockpit, Alien Friend Bobblehead, Custom Upload Slot)
need sprints but fit within existing subsystem scopes. Note: Custom Upload Slot
ships in MVP as a library-picker (T1-equivalent experience); the T3 sprint adds
the custom-upload + content-moderation pipeline later. Nothing was deferred.

## Batch 07 parking lot

No T4/T5 items arose during Batch 07. Profile titles, banners, nameplates, and
rank badges all fit within the existing profile-render UI. Two T3 items (Phoenix
Rebirth Banner, Crimson Talon Cosmetic Variant) need an animated profile-element
pipeline that can reuse the animated-card-surface pipeline planned for Batch 04
T3 items. Nothing was deferred.

## Batch 08 parking lot

No T4/T5 items arose during Batch 08. All audio items fit within the existing
audio playback layer (sample swap is T1, multi-layer / phase-shift / processed
audio is T2, and the signature LFE-tactile warp sting is T3). Note: the
"Transcendent Pilot Voice Pack" called out in Part 9J Premium tier is reserved
for Batch 10 — not deferred here, just not in this batch's scope. Nothing was
deferred to T4/T5.

## Batch 09 parking lot

No T4/T5 items arose during Batch 09. Card packs and bundles are purchase-flow
UI on top of existing cosmetic items; underlying cosmetics carry their own tier
ratings (noted in earlier batches). Three T2 items (Mythic Pack animated opening,
Genesis + Infinity Founder signature animated sigils) need a shared "animated
premium purchase UI" pipeline. Nothing was deferred.

## Batch 10 parking lot

No T4/T5 items arose during Batch 10. Limited Drops, Premium Tier, and Milestone
Rewards all map to existing T1/T2/T3 capability families. The T3 items in this
batch cluster around the same sprint-pipelines identified in earlier batches
(animated hull shaders, animated effect shaders, multi-layer audio, animated
profile elements). Nothing was deferred.

## Catalog-wide summary — what lives here

This backlog stayed empty across all 10 batches. The shop catalog's 400 items all
fit within T1/T2/T3 capability tiers. No item depends on a game system that
doesn't exist or can't be built within known sprint scope.

**Future candidates for this backlog (not yet shop items, per Part 1):**
- Emote-system cosmetics (ship rolls, wing salutes, victory dances) — **T4**,
  blocked by animation system on 3D ship models
- Hull attachment items (external weapon pods, antennas, sponsons) — **T5**,
  blocked by assembly-app mount-point system
- Pilot avatar cosmetics (helmets, gloves, jackets, scars, tattoos) — **T5**,
  blocked by pilot being a profile record, not a rendered character

When any of those systems gain development scope, items from the corresponding
Part 1 "Aspirational only" list can be authored here as T4/T5, then promoted
into a future shop batch with updated tier ratings once the underlying system
ships.

Future batches may park entries here. Typical expected residents:
- Emote-system cosmetics (ship rolls, wing salutes, victory dances) — **T4**, blocked by
  no animation system on 3D ship models.
- Hull attachment items (external weapon pods, antenna racks, sponsons) — **T5**, blocked
  by the assembly-app not having attachment mount points defined per model.
- Pilot avatar cosmetics (helmets, gloves, jackets, scars, tattoos) — **T5**, blocked
  by the pilot being a profile row, not a rendered character.
