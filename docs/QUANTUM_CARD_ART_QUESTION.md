# QUANTUM FORESPØRGSEL — CARD ART GENERATION

## Problem

Jeg skal generere 1000 trading card game illustrations til et sci-fi space combat kort-spil (voidexa). Kortene har specifikke subject-krav per type, og jeg kan ikke få AI-modellerne til at producere det jeg beder om.

## Hvad kortene skal vise

Kortene har 9 typer, hver med et specifikt visuelt subject:

1. **Weapon** — våben-effekten selv (electrical arcs, plasma blasts, energy beams), IKKE et skib. Close-up af våbnet i aktion.
2. **Drone** — små autonome spacecraft. Kan være skibe.
3. **Defense** — shields, armor plating, force fields. Ingen mennesker.
4. **Maneuver** — ship i bevægelse mid-action. Kan vise skibe.
5. **AI Routine** — holografiske interfaces, data streams, neural networks. INGEN mennesker, INGEN skibe, INGEN hardware. Pure digital/abstract.
6. **Module** — ship-komponenter, hardware close-ups (reactors, power cells). INGEN mennesker.
7. **Equipment** — pilot gear (helmets, devices). Produkt-shot stil.
8. **Field** — environment/zones (nebula clouds, energy storms). INGEN skibe, INGEN mennesker.
9. **Ship Core** — heraldiske emblems/crests (som Marvel Snap faction logos). INGEN skibe, INGEN mennesker, pure symbolic centered composition.

## Hvilke modeller jeg har testet

Alle på Vast.ai H200 med ComfyUI:

1. **SDXL base 1.0** — Teknisk virker, men ignorerer "no humans" i negative prompt. Tegner karakterer selv når prompten siger "no person, no character, no humanoid".

2. **Juggernaut XL v9** — Fine-tuned SDXL. Producerede GODE ship-images til shop-kategori (single ships, clean composition). Men på kort der har ord som "warrior", "heraldic", "aggressive" i prompts → outputter menneskelige karakterer i rustning med våben i stedet for det ønskede subject. Ignorerer negative prompts aggressivt.

3. **DreamShaper XL Turbo** — Værre end Juggernaut. Outputter næsten udelukkende fantasy-karakterer (kvinder i rustning med lyn). Fuldstændig misser subject.

4. **FLUX.1 Dev** — Ikke færdigtestet pga. workflow-fejl. Ved at FLUX ignorerer negative prompts helt, men følger positive prompts mere bogstaveligt.

## Hvad jeg har prøvet i prompts

### Version 1 — type-baseret (fejlet)
Simpel mapping: "Weapon" → "ship-mounted plasma cannon". Produced generic skibe.

### Version 2 — semantic parsing (smart generator)
Script læser hvert korts `card_name` + `effect_text` + `keywords` og oversætter til visuel beskrivelse:

- "Spark Discharge" med effekt "Reactive. Deal 2 damage to target enemy unit."
  → "electrical arc discharge, chain lightning bolts crackling, high-voltage energy release"

- "Master AI" (AI Routine, rare) med effekt "Persistent Field. Priority Fire. Overclock."
  → "holographic AI consciousness visualization, floating neural network, glowing synapse patterns, NO human figures, no ships"

- "Warmaster's Core" (Ship Core, legendary)
  → "heraldic warrior crest, crossed weapons emblem, aggressive insignia, golden and crimson, centered symbolic composition, NO spaceships, NO vessels, pure heraldic emblem only"

- "Reactor Overload" (Module, legendary) effekt "Deal 30 damage to target enemy ship. Your ship loses 10 max Hull Integrity permanently."
  → "ship reactor core detail, glowing energy conduits, pulsating power cell, industrial"

### Negative prompts brugt
```
text, watermark, logo, signature, card border, card frame, title bar, 
stat numbers, visible keywords, UI elements, blur, low quality, amateur, 
distorted, extra limbs, human faces, realistic photography, stock photo aesthetic, 
AI fingerprints, noise, grain, multiple subjects, busy background, cluttered composition, 
two ships, three ships, multiple ships, person, woman, man, warrior, knight, 
soldier, character, body, armor, portrait, figure, silhouette of person, humanoid
```

### Positive prompt anatomi
```
voidexa trading card game, sci-fi space combat, cohesive card art direction, 
premium TCG illustration, [SUBJECT], [TYPE COMPOSITION], [RARITY QUALITY], 
8K quality, sharp focus, trading card game illustration, digital painting style, 
professional concept art, ArtStation quality, single centered subject, voidexa_tcg_v1
```

## Faktiske resultater

På "Spark Discharge" med Juggernaut + smart prompt (version 2):
- **Expected:** Electrical arc discharge close-up, chain lightning, no subject
- **Got:** Kvinde i rød/sort rustning med lyn omkring sig (like a Marvel superhero)

På "Master AI" med Juggernaut + smart prompt:
- **Expected:** Holografisk AI brain interface, abstract digital
- **Got:** Kvinde i cyan/guld rustning i rumstation

På "Warmaster's Core" med Juggernaut:
- **Expected:** Heraldisk emblem (crossed weapons crest)
- **Got:** Ridder i gylden rustning med hjelm og våben

På "Spark Discharge" med DreamShaper + extra strong negatives:
- **Got:** Blonde kvinde med lyn og kæder

## Shop-kategori til sammenligning (hvor det VIRKEDE)

Jeg genererede 3 ship-skins til shoppen med Juggernaut XL. Disse virkede perfekt:
- "Crimson Fighter skin" → clean rød starfighter på mørk baggrund, single ship, centered composition
- "Glacier Blue skin" → blå starfighter, clean baggrund
- "Jungle Camouflage skin" → teal skib, clean baggrund

Prompts brugte "starfighter" og "3/4 angle view" og "clean dark gradient background". Ingen menneske-ord triggerede karakter-output.

## Mit spørgsmål til jer

Hvordan genererer jeg kort-art der matcher subject-kravene ovenfor, når alle testede SDXL-baserede modeller trækker mod menneskelige karakterer selv når negative prompts eksplicit forbyder det?

Er løsningen:
- Andre prompting-strategier jeg ikke har prøvet?
- Andre modeller (ikke SDXL-familien)?
- Fine-tuning en LoRA på reference-stil?
- Helt andre AI-systemer?
- Kombineret tilgang?

Giv mig jeres bedste vurdering og konkrete næste skridt. I skal ikke tage hensyn til mit budget eller tid — jeg vil vide hvad der faktisk virker.

## Ressourcer tilgængelige

- Vast.ai GPU rental (H200/H100/B200 instanser)
- ~$500 budget til eksperimenter
- Kan samle reference-billeder fra eksisterende TCGs (Marvel Snap, Hearthstone, Gwent, Magic sci-fi sets) hvis relevant
- Kan træne modeller hvis det er vejen frem
