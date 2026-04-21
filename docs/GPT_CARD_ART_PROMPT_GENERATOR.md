# GPT TASK: Generate 257 Stable Diffusion Prompts for voidexa Card Art

## PASTE THIS ENTIRE BLOCK INTO ChatGPT

---

You are creating Stable Diffusion image generation prompts for a sci-fi space trading card game called voidexa. The game has 257 unique cards that need illustrations.

## ART STYLE (apply to ALL prompts)

Base style suffix for every prompt:
`digital painting, sci-fi space theme, dark background with nebula glow, dramatic lighting, highly detailed, card game illustration style, 4k, sharp focus, no text, no borders, no frame`

Color palette: deep space blacks, cyan/teal energy glows, orange/amber warnings, purple nebula, white stars. Metallic ship hulls. Holographic UI elements.

## CARD TYPES AND VISUAL LANGUAGE

Each card has a TYPE that determines the visual approach:

- **weapon** → Show the weapon system firing or charging. Energy beams, missile trails, turret barrels glowing. Action shot.
- **shield** → Protective energy barrier, hexagonal force field, glowing dome around a ship. Defensive posture.
- **system** → Internal ship technology. Holographic displays, circuit patterns, engine cores, reactor chambers. Technical feel.
- **drone** → Small autonomous units. Swarms, scout drones, repair bots, combat drones in formation. Multiple small objects.
- **maneuver** → Ship in dynamic motion. Barrel rolls, evasive turns, afterburner trails, speed lines. Movement and agility.
- **crew** → Humanoid figures in space suits or on bridge. Pilots, engineers, commanders. Character portraits with ship interiors.
- **tactical** → Strategic overlay. Battle plans, holographic war tables, fleet formations, targeting systems. Information warfare.
- **environment** → Space phenomena. Asteroid fields, nebulae, black holes, space stations, wormholes. Setting the scene.

## CARD TIERS AND VISUAL INTENSITY

- **Common** → Simple composition, single subject, muted glow effects
- **Uncommon** → More detail, secondary elements, moderate glow
- **Rare** → Complex composition, multiple elements, strong glow effects, more dramatic lighting
- **Epic** → Highly dramatic, intense energy effects, cinematic composition, lens flares
- **Legendary** → Maximum spectacle, multiple light sources, particle effects, god-ray lighting, awe-inspiring scale
- **Mythic** → Otherworldly, reality-bending visuals, impossible geometry, transcendent glow, unique color shifts (add `ethereal, transcendent, reality-warping` to prompt)

## YOUR TASK

I will provide you with a list of all 257 cards. For each card, generate ONE Stable Diffusion prompt.

Format your output as a JSON array:
```json
[
  {
    "card_id": "card_001",
    "card_name": "Plasma Bolt",
    "prompt": "a plasma bolt weapon firing from a spacecraft turret, bright cyan energy projectile streaking through space, muzzle flash illuminating hull plates, digital painting, sci-fi space theme, dark background with nebula glow, dramatic lighting, highly detailed, card game illustration style, 4k, sharp focus, no text, no borders, no frame",
    "negative_prompt": "text, words, letters, numbers, frame, border, watermark, signature, blurry, low quality, deformed"
  }
]
```

Use the SAME negative prompt for all cards:
`text, words, letters, numbers, frame, border, watermark, signature, blurry, low quality, deformed`

## IMPORTANT RULES

1. Every prompt must be 1 paragraph, 30-60 words (before style suffix)
2. NO text, titles, or card names visible in the image
3. Focus on the ACTION or OBJECT the card represents, not the card frame
4. Each prompt must be visually DISTINCT — no two cards should produce similar images
5. For cards with keywords (System Reboot, Burn, Jam, Lock, etc.) — incorporate the keyword's visual effect
6. Ship designs should feel utilitarian/industrial, not sleek/luxury
7. Mythic cards get extra visual flair — add `ethereal, transcendent, reality-warping` to prompt

## CARD DATA

I need to give you the card list. Here is how to get it:

**Ask Jix to run this in Claude Code or PowerShell to export the card data:**

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; node -e "
const baseline = require('./lib/game/cards/index.ts') // may need ts-node
const exp1 = require('./lib/game/cards/expansion_set_1.json')
const full = require('./lib/game/cards/full_card_library.json')
// Combine and output
console.log(JSON.stringify([...Object.values(baseline), ...exp1, ...full].map(c => ({
  id: c.id || c.card_id,
  name: c.name || c.card_name,
  type: c.type || c.card_type,
  tier: c.tier || c.rarity,
  keywords: c.keywords || []
})), null, 2))
" > card_export.json
```

**ALTERNATIVELY — if TypeScript import doesn't work in node directly, run in Claude Code:**

```
Export all 257 cards as a JSON file. Read lib/game/cards/index.ts, lib/game/cards/expansion_set_1.json, and lib/game/cards/full_card_library.json. For each card extract: id, name, type, tier/rarity, keywords. Output as card_export.json in project root. Deduplicate by id.
```

**Then paste the contents of card_export.json below this line and I (GPT) will generate all 257 prompts.**

---

## AFTER GPT GENERATES THE PROMPTS

Save the JSON output as `card_art_prompts.json` in `C:\Users\Jixwu\Desktop\voidexa\docs\`

Then use this on a rented GPU (Vast.ai/RunPod) with this batch script:

```python
# batch_generate_card_art.py
import json
import torch
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16
).to("cuda")

with open("card_art_prompts.json") as f:
    cards = json.load(f)

for card in cards:
    image = pipe(
        prompt=card["prompt"],
        negative_prompt=card["negative_prompt"],
        width=512,
        height=512,
        num_inference_steps=30,
        guidance_scale=7.5
    ).images[0]
    image.save(f"output/{card['card_id']}.png")
    print(f"Generated: {card['card_id']} - {card['card_name']}")

print(f"Done! {len(cards)} cards generated.")
```

Estimated time on rented A100: ~15-25 minutes for 257 images.
Estimated cost: $1-3 on Vast.ai.
