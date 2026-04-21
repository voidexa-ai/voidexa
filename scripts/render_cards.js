// Card renderer v2 — HTML/CSS + Puppeteer screenshots.
//
// Replaces scripts/render_cards.py. Same input paths, same output dir,
// same card selection, but richer visuals: metallic beveled frames,
// multi-layer rarity glow, circuit texture overlays, proper typography
// (Orbitron + Rajdhani loaded via base64 @font-face).
//
// Usage:
//   node scripts/render_cards.js --test          # 5 + 1 placeholder
//   node scripts/render_cards.js                 # all 257
//   node scripts/render_cards.js --only pulse_tap,emp_nova

'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const REPO = path.resolve(__dirname, '..');
const CARDS_DIR = path.join(REPO, 'lib', 'game', 'cards');
const ART_DIR = path.join(REPO, 'output', 'card_art_unzipped', 'utput');
const FONT_DIR = path.join(REPO, 'output', 'fonts');
const OUT_DIR = path.join(REPO, 'output', 'rendered_cards');

const CARD_W = 750;
const CARD_H = 1050;

// ---------- rarity palettes ------------------------------------------------

const RARITY = {
  common: {
    label: 'COMMON',
    main: '#c4c7d0',
    bright: '#e8eaf0',
    deep: '#6a6f7c',
    shadow: '#20232d',
    glow: 'rgba(196, 199, 208, 0.45)',
    glowWide: 'rgba(196, 199, 208, 0.18)',
    nameGradient: 'linear-gradient(135deg, #2a2d3a 0%, #1a1c28 50%, #0e1018 100%)',
  },
  uncommon: {
    label: 'UNCOMMON',
    main: '#43d38c',
    bright: '#8dffc4',
    deep: '#178356',
    shadow: '#0a2a1d',
    glow: 'rgba(67, 211, 140, 0.55)',
    glowWide: 'rgba(67, 211, 140, 0.25)',
    nameGradient: 'linear-gradient(135deg, #0e2d20 0%, #0a1a16 55%, #050c0a 100%)',
  },
  rare: {
    label: 'RARE',
    main: '#4fc3f7',
    bright: '#9ae6ff',
    deep: '#1676c8',
    shadow: '#0a1e38',
    glow: 'rgba(79, 195, 247, 0.6)',
    glowWide: 'rgba(79, 195, 247, 0.28)',
    nameGradient: 'linear-gradient(135deg, #0c2438 0%, #091828 55%, #040a18 100%)',
  },
  legendary: {
    label: 'LEGENDARY',
    main: '#ffb347',
    bright: '#ffe29a',
    deep: '#c67a10',
    shadow: '#321d04',
    glow: 'rgba(255, 179, 71, 0.75)',
    glowWide: 'rgba(255, 179, 71, 0.35)',
    nameGradient: 'linear-gradient(135deg, #2d1f0a 0%, #1c1308 55%, #0d0804 100%)',
  },
  mythic: {
    label: 'MYTHIC',
    main: '#ff4d7e',
    bright: '#ff9fc1',
    deep: '#c2104b',
    shadow: '#31081a',
    glow: 'rgba(255, 77, 126, 0.8)',
    glowWide: 'rgba(255, 77, 126, 0.38)',
    nameGradient: 'linear-gradient(135deg, #2d0b18 0%, #1c0810 55%, #0e040a 100%)',
  },
  pioneer: {
    label: 'PIONEER',
    main: '#af52de',
    bright: '#dd9bff',
    deep: '#6e22a0',
    shadow: '#21083b',
    glow: 'rgba(175, 82, 222, 0.7)',
    glowWide: 'rgba(175, 82, 222, 0.32)',
    nameGradient: 'linear-gradient(135deg, #240d32 0%, #170820 55%, #090414 100%)',
  },
};

// ---------- type palette ---------------------------------------------------

const TYPE_COLOR = {
  weapon:     '#ff5a5a',
  defense:    '#5aaaff',
  maneuver:   '#82f0aa',
  drone:      '#00d4ff',
  ai:         '#af52de',
  consumable: '#ffd650',
};

// ---------- fonts → base64 ------------------------------------------------

function b64(relPath) {
  return fs.readFileSync(path.join(FONT_DIR, relPath)).toString('base64');
}
const FONT_ORBITRON = b64('Orbitron-VF.ttf');
const FONT_RAJ_REG = b64('Rajdhani-Regular.ttf');
const FONT_RAJ_SB = b64('Rajdhani-SemiBold.ttf');
const FONT_RAJ_MED = b64('Rajdhani-Medium.ttf');

// ---------- card data ------------------------------------------------------

function loadAllCards() {
  const files = ['baseline.json', 'expansion_set_1.json', 'full_card_library.json'];
  const out = [];
  for (const f of files) {
    const arr = JSON.parse(fs.readFileSync(path.join(CARDS_DIR, f), 'utf8'));
    for (const c of arr) out.push(c);
  }
  return out;
}

function artBase64For(cardId) {
  const p = path.join(ART_DIR, `${cardId}.png`);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p).toString('base64');
}

function attackDefenceFor(stats) {
  const s = stats || {};
  const atk = s.damage ?? (s.draw ? s.draw : null);
  const def = s.block ?? s.absorb ?? (s.heal ? s.heal : null);
  return { atk, def, atkLabel: s.damage ? 'ATK' : (s.draw ? 'DRW' : 'ATK'),
           defLabel: s.block ? 'DEF' : (s.absorb ? 'ABS' : (s.heal ? 'HEAL' : 'DEF')) };
}

// ---------- SVG textures (generated once per tile) -------------------------

// Dense PCB-style trace pattern with multiple wire runs + junction pads.
const CIRCUIT_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'>
  <g stroke='currentColor' stroke-width='1.2' fill='none' stroke-linecap='square' stroke-linejoin='miter'>
    <path d='M 0 20 L 48 20 L 48 60 L 96 60 L 96 100 L 160 100 L 160 140'/>
    <path d='M 20 0 L 20 48 L 72 48'/>
    <path d='M 120 0 L 120 36 L 184 36 L 184 88 L 220 88'/>
    <path d='M 0 110 L 36 110 L 36 156 L 88 156 L 88 204 L 140 204'/>
    <path d='M 176 120 L 176 168 L 220 168'/>
    <path d='M 200 0 L 200 18'/>
    <path d='M 52 180 L 52 220'/>
    <path d='M 108 144 L 108 220'/>
  </g>
  <g fill='currentColor'>
    <circle cx='48' cy='60' r='2.2'/>
    <circle cx='96' cy='100' r='2.2'/>
    <circle cx='160' cy='100' r='2.2'/>
    <circle cx='184' cy='36' r='2.2'/>
    <circle cx='36' cy='156' r='2.2'/>
    <circle cx='88' cy='156' r='2.2'/>
    <circle cx='176' cy='168' r='3'/>
    <circle cx='20' cy='48' r='2.2'/>
    <circle cx='120' cy='36' r='2.2'/>
    <rect x='156' y='136' width='8' height='8' rx='1'/>
    <rect x='84' y='152' width='8' height='8' rx='1'/>
  </g>
</svg>
`.trim();

// Hex grid — low opacity frame texture.
const HEX_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='56' height='64' viewBox='0 0 56 64'>
  <g stroke='currentColor' stroke-width='1' fill='none'>
    <path d='M 14 0 L 42 0 L 56 16 L 42 32 L 14 32 L 0 16 Z'/>
    <path d='M 14 32 L 0 48 L 14 64 L 42 64 L 56 48 L 42 32'/>
  </g>
</svg>
`.trim();

// Brushed metal noise — micro horizontal lines with subtle jitter.
const METAL_NOISE_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='240' height='12' viewBox='0 0 240 12'>
  <g stroke='currentColor' stroke-width='0.5' fill='none' opacity='0.6'>
    <path d='M 0 1 L 240 1'/>
    <path d='M 0 3 L 80 3 M 90 3 L 180 3 M 190 3 L 240 3'/>
    <path d='M 0 5 L 240 5'/>
    <path d='M 0 7 L 60 7 M 70 7 L 120 7 M 130 7 L 240 7'/>
    <path d='M 0 9 L 240 9'/>
    <path d='M 0 11 L 40 11 M 60 11 L 200 11 M 220 11 L 240 11'/>
  </g>
</svg>
`.trim();

function svgDataUri(svg, color) {
  const coloured = svg.replace(/currentColor/g, color);
  return `data:image/svg+xml;utf8,${encodeURIComponent(coloured)}`;
}

// ---------- HTML builder ---------------------------------------------------

function escape(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function cardHtml(card) {
  const rarity = RARITY[card.rarity] || RARITY.common;
  const typeColor = TYPE_COLOR[card.type] || '#cccccc';
  const artB64 = artBase64For(card.id);
  const placeholderLetter = (card.type || '?')[0].toUpperCase();
  const { atk, def, atkLabel, defLabel } = attackDefenceFor(card.stats);
  const keywords = (card.keywords || []).map(k => k.replace(/_/g, ' ').toUpperCase());

  const artBlock = artB64
    ? `<img class="art" src="data:image/png;base64,${artB64}" alt="">`
    : `
      <div class="art art-placeholder" style="--type-color:${typeColor}">
        <div class="placeholder-letter">${placeholderLetter}</div>
        <div class="placeholder-sub">PROCEDURAL · ART PENDING</div>
      </div>
    `;

  const flavorBlock = card.flavor
    ? `<div class="flavor">${escape(card.flavor)}</div>`
    : '';

  const keywordBlock = keywords.length
    ? `<div class="keywords">${keywords.map(k => `<span class="kw">${escape(k)}</span>`).join('')}</div>`
    : '';

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: 'Orbitron';
    src: url(data:font/ttf;base64,${FONT_ORBITRON}) format('truetype');
    font-weight: 400 900;
    font-display: block;
  }
  @font-face {
    font-family: 'Rajdhani';
    src: url(data:font/ttf;base64,${FONT_RAJ_REG}) format('truetype');
    font-weight: 400;
    font-display: block;
  }
  @font-face {
    font-family: 'Rajdhani';
    src: url(data:font/ttf;base64,${FONT_RAJ_MED}) format('truetype');
    font-weight: 500;
    font-display: block;
  }
  @font-face {
    font-family: 'Rajdhani';
    src: url(data:font/ttf;base64,${FONT_RAJ_SB}) format('truetype');
    font-weight: 600;
    font-display: block;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${CARD_W}px; height: ${CARD_H}px;
    background: transparent;
    font-family: 'Rajdhani', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    color: #e8eaf0;
  }

  /* ============================================================
     CARD ROOT — the metallic frame lives here; content is inset.
     Layered composition (bottom → top):
       1. base metallic gradient (frame colour)
       2. brushed-metal noise (.28 opacity)
       3. hex pattern (.07 opacity)
       4. circuit pattern (.12 opacity)
       5. bevel highlight (top-left) + shadow (bottom-right)
       6. panel-line overlay (cuts the frame into plates)
       7. rivets (absolute-positioned radial gradients)
     ============================================================ */
  .card {
    position: relative;
    width: ${CARD_W}px;
    height: ${CARD_H}px;
    border-radius: 24px;
    overflow: hidden;
    /* base: vertical metallic sweep on frame colour */
    background:
      linear-gradient(180deg,
        ${rarity.bright} 0%,
        ${rarity.main} 22%,
        ${rarity.deep} 58%,
        ${rarity.shadow} 100%);
    /* rarity glow halo + outer edge stroke */
    box-shadow:
      0 0 0 2px ${rarity.shadow},
      0 0 38px ${rarity.glow},
      0 0 96px ${rarity.glowWide};
  }

  /* ----- FRAME TEXTURES — stacked overlay divs ----- */
  .frame-tex {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    pointer-events: none;
    z-index: 2;
  }
  .frame-tex.noise {
    /* brushed-metal noise at 0.28 opacity */
    background-image: url("${svgDataUri(METAL_NOISE_SVG, '#ffffff')}");
    background-size: 120px 6px;
    background-repeat: repeat;
    opacity: 0.28;
    mix-blend-mode: overlay;
  }
  .frame-tex.hex {
    /* hex grid @ 0.22 opacity */
    background-image: url("${svgDataUri(HEX_SVG, rarity.bright)}");
    background-size: 28px 32px;
    background-repeat: repeat;
    opacity: 0.22;
    mix-blend-mode: overlay;
  }
  .frame-tex.circuit {
    /* PCB circuit pattern @ 0.30 opacity */
    background-image: url("${svgDataUri(CIRCUIT_SVG, rarity.bright)}");
    background-size: 110px 110px;
    background-repeat: repeat;
    opacity: 0.30;
    mix-blend-mode: screen;
  }

  /* layer 5a — top-left bevel highlight (3D depth) */
  .card::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: 24px;
    background:
      linear-gradient(135deg,
        rgba(255, 255, 255, 0.55) 0%,
        rgba(255, 255, 255, 0.18) 12%,
        transparent 38%,
        transparent 100%);
    pointer-events: none;
    z-index: 3;
  }
  /* layer 5b — bottom-right bevel shadow */
  .card::after {
    content: '';
    position: absolute; inset: 0;
    border-radius: 24px;
    background:
      linear-gradient(135deg,
        transparent 0%,
        transparent 58%,
        rgba(0, 0, 0, 0.42) 78%,
        rgba(0, 0, 0, 0.75) 100%);
    pointer-events: none;
    z-index: 3;
  }

  /* layer 6 — panel lines on the metallic frame.
     Four short strokes: two horizontal (top & bottom frame bands)
     and two vertical (left & right bands) create the plate seams.
     Each uses a dark stroke + a bright highlight offset 1px. */
  .panel-lines {
    position: absolute; inset: 0;
    border-radius: 24px;
    pointer-events: none;
    z-index: 4;
  }
  .panel-lines::before {
    /* top band panel-split */
    content: '';
    position: absolute;
    left: 0; right: 0; top: 28px;
    height: 2px;
    background: rgba(0, 0, 0, 0.6);
    box-shadow:
      0 1px 0 ${rarity.bright}55,
      0 -1px 0 rgba(0, 0, 0, 0.5);
  }
  .panel-lines::after {
    /* bottom band panel-split */
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 28px;
    height: 2px;
    background: rgba(0, 0, 0, 0.6);
    box-shadow:
      0 1px 0 ${rarity.bright}55,
      0 -1px 0 rgba(0, 0, 0, 0.5);
  }
  .panel-lines-v {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    pointer-events: none;
    z-index: 4;
  }
  .panel-lines-v::before {
    /* left vertical panel split */
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 28px;
    width: 2px;
    background: rgba(0, 0, 0, 0.55);
    box-shadow:
      1px 0 0 ${rarity.bright}55,
      -1px 0 0 rgba(0, 0, 0, 0.5);
  }
  .panel-lines-v::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0; right: 28px;
    width: 2px;
    background: rgba(0, 0, 0, 0.55);
    box-shadow:
      1px 0 0 ${rarity.bright}55,
      -1px 0 0 rgba(0, 0, 0, 0.5);
  }

  /* extra panel cuts via SVG so we don't burn another ::before */
  .panel-cuts {
    position: absolute; inset: 0;
    pointer-events: none;
    z-index: 2;
  }
  .panel-cuts svg { position: absolute; inset: 0; width: 100%; height: 100%; }

  /* layer 7 — rivets. Small radial dots at corners of the plate rows. */
  .rivet {
    position: absolute;
    width: 12px; height: 12px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 30% 30%,
        ${rarity.bright} 0%,
        ${rarity.main} 40%,
        ${rarity.shadow} 85%,
        #000 100%);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.25),
      0 0 4px rgba(0, 0, 0, 0.9),
      inset 0 0 2px rgba(0, 0, 0, 0.65),
      inset 1px 1px 2px ${rarity.bright}aa;
    pointer-events: none;
    z-index: 5;
  }

  /* ============================================================
     INNER BG — dark content panel inset inside the metallic frame.
     Children (name bar, art, text, footer) sit in card coords, not
     inner coords, so nothing has to be re-juggled when the frame
     thickness changes.
     ============================================================ */
  .inner-bg {
    position: absolute;
    inset: 32px;
    border-radius: 16px;
    background:
      radial-gradient(ellipse at top, rgba(18, 20, 38, 1) 0%, rgba(5, 7, 16, 1) 72%),
      #020308;
    box-shadow:
      inset 0 0 0 2px ${rarity.shadow},
      inset 0 0 0 3px ${rarity.main}aa,
      inset 0 0 0 4px ${rarity.deep},
      inset 0 0 30px rgba(0, 0, 0, 0.8),
      inset 0 0 70px ${rarity.glowWide},
      /* outer shadow = inner bevel effect giving depth */
      0 0 0 1px rgba(0, 0, 0, 0.9),
      0 2px 6px rgba(0, 0, 0, 0.85);
    overflow: hidden;
    z-index: 6;
  }
  .inner-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("${svgDataUri(CIRCUIT_SVG, rarity.main)}");
    background-size: 260px 260px;
    opacity: 0.08;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  /* ----- NAME BAR ----- */
  .name-bar {
    position: absolute;
    left: 146px; right: 46px; top: 44px;
    height: 72px;
    z-index: 7;
    background: ${rarity.nameGradient};
    border-radius: 12px;
    box-shadow:
      inset 0 1px 0 ${rarity.bright}66,
      inset 0 0 0 1px ${rarity.main},
      inset 0 -2px 0 ${rarity.shadow},
      inset 0 -8px 14px rgba(0, 0, 0, 0.4),
      0 2px 10px rgba(0, 0, 0, 0.7),
      0 0 16px ${rarity.glowWide};
    display: flex;
    align-items: center;
    padding: 0 22px;
    overflow: hidden;
    z-index: 6;
  }
  .name-bar::before {
    /* diagonal metallic sheen */
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(115deg,
        transparent 18%,
        ${rarity.bright}26 38%,
        ${rarity.bright}08 55%,
        transparent 70%);
    pointer-events: none;
  }
  .name-bar::after {
    /* brushed metal noise inside the name bar */
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("${svgDataUri(METAL_NOISE_SVG, rarity.bright)}");
    background-size: 240px 12px;
    opacity: 0.20;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
  .name-bar .name {
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 34px;
    letter-spacing: 0.015em;
    color: ${rarity.bright};
    text-shadow:
      0 0 14px ${rarity.glow},
      0 2px 0 ${rarity.shadow},
      0 0 2px rgba(0, 0, 0, 0.95);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }

  /* ----- ENERGY COST BADGE (double ring) ----- */
  .cost {
    position: absolute;
    left: 40px; top: 30px;
    width: 100px; height: 100px;
    z-index: 8;
    border-radius: 50%;
    /* OUTER RING — metallic torus */
    background:
      radial-gradient(circle at 30% 30%,
        ${rarity.bright} 0%,
        ${rarity.main} 30%,
        ${rarity.deep} 65%,
        ${rarity.shadow} 100%);
    box-shadow:
      inset 0 3px 3px ${rarity.bright}cc,
      inset 0 -5px 8px ${rarity.shadow},
      inset 0 0 0 1px ${rarity.bright}aa,
      0 0 24px ${rarity.glow},
      0 0 54px ${rarity.glowWide},
      0 4px 10px rgba(0, 0, 0, 0.8);
    display: grid;
    place-items: center;
    z-index: 7;
  }
  .cost::before {
    /* gap ring (darker) between outer and inner */
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: ${rarity.shadow};
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.9),
      inset 0 2px 4px rgba(0, 0, 0, 0.6);
  }
  .cost::after {
    /* INNER RING — dark disc with value */
    content: '';
    position: absolute;
    inset: 13px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 35% 30%,
        rgba(35, 40, 60, 0.96) 0%,
        rgba(4, 6, 14, 1) 95%);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.75),
      inset 0 0 0 2px ${rarity.main}aa,
      inset 0 0 12px ${rarity.glow};
  }
  .cost-value {
    position: relative;
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 50px;
    line-height: 1;
    color: ${rarity.bright};
    text-shadow:
      0 0 10px ${rarity.glow},
      0 1px 0 #000,
      0 0 22px ${rarity.main};
    z-index: 1;
  }

  /* ----- ART ----- */
  .art-frame {
    position: absolute;
    left: 46px; right: 46px; top: 128px;
    height: 510px;
    z-index: 7;
    border-radius: 10px;
    overflow: hidden;
    box-shadow:
      inset 0 0 0 1px ${rarity.deep},
      inset 0 0 0 3px rgba(0, 0, 0, 0.9),
      inset 0 0 0 4px ${rarity.main},
      inset 0 0 80px rgba(0, 0, 0, 0.78),
      0 0 22px ${rarity.glowWide},
      0 6px 16px rgba(0, 0, 0, 0.9);
    z-index: 6;
  }
  .art, .art-placeholder {
    width: 100%; height: 100%;
    display: block;
  }
  .art { object-fit: cover; object-position: center; }
  .art-placeholder {
    display: grid;
    place-items: center;
    background:
      radial-gradient(ellipse at center, var(--type-color) 0%, rgba(8, 10, 22, 1) 60%),
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 6px);
    background-blend-mode: multiply;
    filter: brightness(0.55) saturate(0.9);
    position: relative;
  }
  .art-placeholder::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("${svgDataUri(CIRCUIT_SVG, '#ffffff')}");
    background-size: 260px 260px;
    opacity: 0.07;
  }
  .placeholder-letter {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 180px;
    color: var(--type-color);
    opacity: 0.55;
    text-shadow:
      0 0 40px var(--type-color),
      0 0 12px rgba(0, 0, 0, 0.8);
    line-height: 1;
  }
  .placeholder-sub {
    position: absolute;
    bottom: 42px; left: 0; right: 0;
    text-align: center;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 0.28em;
    color: rgba(230, 235, 250, 0.75);
  }

  /* art corner flourish */
  .art-frame::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, transparent 16%, transparent 84%, rgba(0, 0, 0, 0.7) 100%);
  }

  /* ----- TYPE + RARITY BAR ----- */
  .type-bar {
    position: absolute;
    left: 46px; right: 46px; top: 650px;
    height: 54px;
    z-index: 7;
    border-radius: 10px;
    background:
      linear-gradient(180deg, rgba(22, 26, 48, 0.95) 0%, rgba(8, 10, 22, 0.95) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 0 0 1px ${rarity.deep},
      inset 0 0 0 2px rgba(0, 0, 0, 0.5),
      0 0 14px ${rarity.glowWide};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 22px;
    z-index: 6;
  }
  .type-label {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    font-size: 28px;
    letter-spacing: 0.18em;
    color: ${typeColor};
    text-shadow: 0 0 12px ${typeColor}aa;
  }
  .type-label::before {
    content: '';
    width: 14px; height: 14px;
    border-radius: 50%;
    background: ${typeColor};
    box-shadow: 0 0 12px ${typeColor}, 0 0 2px #000, inset 0 0 3px rgba(255,255,255,0.6);
  }
  .rarity-label {
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    font-size: 28px;
    letter-spacing: 0.22em;
    color: ${rarity.main};
    text-shadow: 0 0 12px ${rarity.glow};
  }

  /* ----- ABILITY BOX ----- */
  .ability-box {
    position: absolute;
    left: 46px; right: 46px; top: 714px;
    height: 218px;
    z-index: 7;
    padding: 20px 24px;
    border-radius: 10px;
    background:
      linear-gradient(180deg, rgba(10, 13, 28, 0.9) 0%, rgba(3, 5, 14, 0.92) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.07),
      inset 0 0 0 1px rgba(70, 80, 120, 0.65),
      inset 0 0 40px rgba(0, 0, 0, 0.55),
      0 4px 10px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    z-index: 6;
  }
  .ability-text {
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
    font-size: 31px;
    line-height: 1.22;
    color: #f0f4ff;
    letter-spacing: 0.005em;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
  }
  .keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 8px;
    margin-top: auto;
  }
  .kw {
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 0.16em;
    padding: 4px 11px;
    border-radius: 4px;
    color: ${typeColor};
    background: ${typeColor}1f;
    border: 1px solid ${typeColor}66;
    text-shadow: 0 0 6px ${typeColor}88;
  }
  .flavor {
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
    font-style: italic;
    font-size: 21px;
    line-height: 1.28;
    color: rgba(195, 205, 230, 0.86);
    border-top: 1px solid rgba(70, 80, 120, 0.55);
    padding-top: 10px;
    margin-top: 4px;
  }

  /* ----- FOOTER (ATK / DEF) ----- */
  .footer {
    position: absolute;
    left: 46px; right: 46px; top: 942px;
    height: 72px;
    z-index: 7;
    border-radius: 12px;
    background:
      linear-gradient(180deg, rgba(14, 18, 32, 0.96) 0%, rgba(4, 6, 14, 0.96) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 0 0 1px ${rarity.deep},
      inset 0 0 0 2px rgba(0, 0, 0, 0.5),
      0 0 18px ${rarity.glowWide};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 26px;
    z-index: 6;
  }
  .stat { display: flex; align-items: baseline; gap: 14px; }
  .stat .lbl {
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    font-size: 22px;
    letter-spacing: 0.22em;
  }
  .stat .val {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 46px;
    line-height: 1;
  }
  .stat.atk .lbl { color: #ff8b8b; text-shadow: 0 0 8px #ff4e4e88; }
  .stat.atk .val { color: #ffe0e0; text-shadow: 0 0 14px #ff5a5aaa, 0 2px 0 #000; }
  .stat.def .lbl { color: #9cc5ff; text-shadow: 0 0 8px #5aaaff88; }
  .stat.def .val { color: #e4efff; text-shadow: 0 0 14px #5aaaffaa, 0 2px 0 #000; }
  .stat.none .val { color: rgba(180, 185, 205, 0.5); font-size: 40px; }

  /* ----- META (id + faction) ----- */
  .meta {
    position: absolute;
    left: 50px; right: 50px;
    bottom: 12px;
    z-index: 7;
    display: flex; justify-content: space-between;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.2em;
    color: rgba(130, 138, 168, 0.65);
    z-index: 6;
  }
</style></head>
<body>
  <div class="card">
    <div class="panel-lines"></div>
    <div class="panel-cuts">
      <svg viewBox="0 0 ${CARD_W} ${CARD_H}" preserveAspectRatio="none">
        <!-- corner cuts hinting at plate seams -->
        <g stroke="rgba(0,0,0,0.55)" stroke-width="2" fill="none">
          <path d="M 0 46 L 22 46 L 22 0" />
          <path d="M ${CARD_W} 46 L ${CARD_W - 22} 46 L ${CARD_W - 22} 0" />
          <path d="M 0 ${CARD_H - 46} L 22 ${CARD_H - 46} L 22 ${CARD_H}" />
          <path d="M ${CARD_W} ${CARD_H - 46} L ${CARD_W - 22} ${CARD_H - 46} L ${CARD_W - 22} ${CARD_H}" />
        </g>
        <g stroke="${rarity.bright}" stroke-opacity="0.35" stroke-width="1" fill="none">
          <path d="M 0 48 L 22 48 L 22 2" />
          <path d="M ${CARD_W} 48 L ${CARD_W - 22} 48 L ${CARD_W - 22} 2" />
          <path d="M 0 ${CARD_H - 48} L 22 ${CARD_H - 48} L 22 ${CARD_H - 2}" />
          <path d="M ${CARD_W} ${CARD_H - 48} L ${CARD_W - 22} ${CARD_H - 48} L ${CARD_W - 22} ${CARD_H - 2}" />
        </g>
      </svg>
    </div>
    <!-- rivets at panel intersections -->
    <div class="rivet" style="top: 6px; left: 6px;"></div>
    <div class="rivet" style="top: 6px; right: 6px;"></div>
    <div class="rivet" style="bottom: 6px; left: 6px;"></div>
    <div class="rivet" style="bottom: 6px; right: 6px;"></div>
    <div class="rivet" style="top: 98px; left: 6px;"></div>
    <div class="rivet" style="top: 98px; right: 6px;"></div>
    <div class="rivet" style="bottom: 92px; left: 6px;"></div>
    <div class="rivet" style="bottom: 92px; right: 6px;"></div>

    <div class="inner-bg"></div>
    <div class="art-frame">${artBlock}</div>
    <div class="cost"><span class="cost-value">${escape(card.cost)}</span></div>
    <div class="name-bar"><span class="name">${escape(card.name)}</span></div>
    <div class="type-bar">
      <span class="type-label">${escape((card.type || '').toUpperCase())}</span>
      <span class="rarity-label">${rarity.label}</span>
    </div>
    <div class="ability-box">
      <div class="ability-text">${escape(card.abilityText || '')}</div>
      ${keywordBlock}
      ${flavorBlock}
    </div>
    <div class="footer">
      <div class="stat ${atk == null ? 'none' : 'atk'}">
        <span class="lbl">${atkLabel}</span>
        <span class="val">${atk == null ? '—' : escape(atk)}</span>
      </div>
      <div class="stat ${def == null ? 'none' : 'def'}">
        <span class="lbl">${defLabel}</span>
        <span class="val">${def == null ? '—' : escape(def)}</span>
      </div>
    </div>
    <div class="meta">
      <span>${escape(card.id)}</span>
      <span>${escape((card.faction || '').toUpperCase())}</span>
    </div>
  </div>
</body></html>`;
}

// ---------- main -----------------------------------------------------------

function parseArgs() {
  const out = { test: false, only: [], limit: 0 };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--test') out.test = true;
    else if (a === '--only') out.only = (argv[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--limit') out.limit = parseInt(argv[++i] || '0', 10);
  }
  return out;
}

function pickTestSet(all) {
  const byRarity = { common: null, uncommon: null, rare: null, legendary: null, mythic: null };
  for (const c of all) {
    if (byRarity[c.rarity] === null && artBase64For(c.id)) byRarity[c.rarity] = c;
  }
  const picks = Object.values(byRarity).filter(Boolean);
  for (const c of all) {
    if (!artBase64For(c.id)) { picks.push(c); break; }
  }
  return picks;
}

async function main() {
  const args = parseArgs();
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const all = loadAllCards();
  const byId = Object.fromEntries(all.map(c => [c.id, c]));

  let subset;
  if (args.only.length) subset = args.only.map(id => byId[id]).filter(Boolean);
  else if (args.test) subset = pickTestSet(all);
  else subset = all;
  if (args.limit > 0) subset = subset.slice(0, args.limit);

  console.log(`Rendering ${subset.length} cards → ${OUT_DIR}`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
    defaultViewport: { width: CARD_W, height: CARD_H, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();

  let fail = 0;
  for (let i = 0; i < subset.length; i++) {
    const card = subset[i];
    try {
      const html = cardHtml(card);
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluateHandle('document.fonts.ready');
      const outPath = path.join(OUT_DIR, `${card.id}.png`);
      await page.screenshot({ path: outPath, type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: CARD_W, height: CARD_H } });
      const marker = artBase64For(card.id) ? 'art' : 'placeholder';
      console.log(`  [${String(i + 1).padStart(3)}/${subset.length}] ${card.id.padEnd(32)} ${card.rarity.padEnd(10)} ${marker}`);
    } catch (err) {
      fail++;
      console.error(`  [${String(i + 1).padStart(3)}/${subset.length}] ${card.id} FAILED: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`Done. ${subset.length - fail} ok, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
