// Generate 6 rarity frame PNGs from HTML/CSS via Puppeteer.
// Output: assets/card-frames/v3/{common,uncommon,rare,epic,legendary,mythic}.png
// Each frame is 750x1050, with empty text zones (no "CARD NAME" /
// placeholder text) — the runtime renderer writes real values on top.
//
// Run once:
//   node scripts/build_frames_v3.js

'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const REPO = path.resolve(__dirname, '..');
const FONT_DIR = path.join(REPO, 'output', 'fonts');
const OUT_DIR = path.join(REPO, 'assets', 'card-frames', 'v3');

const CARD_W = 750;
const CARD_H = 1050;

// rarity → palette
const RARITY = {
  common: {
    main: '#c4c7d0', bright: '#e8eaf0', deep: '#6a6f7c', shadow: '#202330',
    glow: 'rgba(196,199,208,0.38)', glowWide: 'rgba(196,199,208,0.14)',
    nameGradient: 'linear-gradient(180deg, #1e2030 0%, #0c0d18 100%)',
  },
  uncommon: {
    main: '#43d38c', bright: '#8dffc4', deep: '#178356', shadow: '#0a2a1d',
    glow: 'rgba(67,211,140,0.48)', glowWide: 'rgba(67,211,140,0.20)',
    nameGradient: 'linear-gradient(180deg, #0e2d20 0%, #05120c 100%)',
  },
  rare: {
    main: '#4fc3f7', bright: '#9ae6ff', deep: '#1676c8', shadow: '#0a1e38',
    glow: 'rgba(79,195,247,0.55)', glowWide: 'rgba(79,195,247,0.22)',
    nameGradient: 'linear-gradient(180deg, #0c2438 0%, #060e1a 100%)',
  },
  epic: {
    main: '#af52de', bright: '#dd9bff', deep: '#6e22a0', shadow: '#21083b',
    glow: 'rgba(175,82,222,0.62)', glowWide: 'rgba(175,82,222,0.26)',
    nameGradient: 'linear-gradient(180deg, #240d32 0%, #0c0418 100%)',
  },
  legendary: {
    main: '#ffb347', bright: '#ffe29a', deep: '#c67a10', shadow: '#321d04',
    glow: 'rgba(255,179,71,0.72)', glowWide: 'rgba(255,179,71,0.30)',
    nameGradient: 'linear-gradient(180deg, #2d1f0a 0%, #0d0804 100%)',
  },
  mythic: {
    main: '#ff4d7e', bright: '#ff9fc1', deep: '#c2104b', shadow: '#31081a',
    glow: 'rgba(255,77,126,0.78)', glowWide: 'rgba(255,77,126,0.32)',
    nameGradient: 'linear-gradient(180deg, #2d0b18 0%, #0e040a 100%)',
  },
};

function b64(rel) {
  return fs.readFileSync(path.join(FONT_DIR, rel)).toString('base64');
}
const FONT_ORBITRON = b64('Orbitron-VF.ttf');
const FONT_RAJ_SB = b64('Rajdhani-SemiBold.ttf');

// inline SVG textures ------------------------------------------------
const CIRCUIT = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'>
  <g stroke='currentColor' stroke-width='1.2' fill='none' stroke-linecap='square'>
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
    <circle cx='48' cy='60' r='2.2'/><circle cx='96' cy='100' r='2.2'/>
    <circle cx='160' cy='100' r='2.2'/><circle cx='184' cy='36' r='2.2'/>
    <circle cx='36' cy='156' r='2.2'/><circle cx='88' cy='156' r='2.2'/>
    <circle cx='176' cy='168' r='3'/>
    <rect x='156' y='136' width='8' height='8' rx='1'/>
    <rect x='84' y='152' width='8' height='8' rx='1'/>
  </g>
</svg>`;

const HEX = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='64' viewBox='0 0 56 64'>
  <g stroke='currentColor' stroke-width='1' fill='none'>
    <path d='M 14 0 L 42 0 L 56 16 L 42 32 L 14 32 L 0 16 Z'/>
    <path d='M 14 32 L 0 48 L 14 64 L 42 64 L 56 48 L 42 32'/>
  </g>
</svg>`;

const METAL_NOISE = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='12' viewBox='0 0 240 12'>
  <g stroke='currentColor' stroke-width='0.5' fill='none' opacity='0.6'>
    <path d='M 0 1 L 240 1'/>
    <path d='M 0 3 L 80 3 M 90 3 L 180 3 M 190 3 L 240 3'/>
    <path d='M 0 5 L 240 5'/>
    <path d='M 0 7 L 60 7 M 70 7 L 120 7 M 130 7 L 240 7'/>
    <path d='M 0 9 L 240 9'/>
    <path d='M 0 11 L 40 11 M 60 11 L 200 11 M 220 11 L 240 11'/>
  </g>
</svg>`;

function svg(s, color) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(s.replace(/currentColor/g, color))}`;
}

// ------------------------------------------------------------------
function frameHtml(rarityKey) {
  const R = RARITY[rarityKey];
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family:'Orbitron'; src:url(data:font/ttf;base64,${FONT_ORBITRON}) format('truetype'); font-weight:400 900; font-display:block; }
@font-face { font-family:'Rajdhani'; src:url(data:font/ttf;base64,${FONT_RAJ_SB}) format('truetype'); font-weight:600; font-display:block; }
* { box-sizing:border-box; margin:0; padding:0; }
html, body { width:${CARD_W}px; height:${CARD_H}px; background:transparent; }

.card {
  position:relative;
  width:${CARD_W}px; height:${CARD_H}px;
  border-radius:24px;
  overflow:hidden;
  background: linear-gradient(180deg,
    ${R.bright} 0%,
    ${R.main} 22%,
    ${R.deep} 58%,
    ${R.shadow} 100%);
  box-shadow:
    0 0 0 2px ${R.shadow},
    0 0 38px ${R.glow},
    0 0 96px ${R.glowWide};
}

/* ----- frame texture overlays ----- */
.tex { position:absolute; inset:0; border-radius:24px; pointer-events:none; }
.tex.noise   { background-image:url("${svg(METAL_NOISE, '#ffffff')}"); background-size:120px 6px; background-repeat:repeat; opacity:0.28; mix-blend-mode:overlay; z-index:2; }
.tex.hex     { background-image:url("${svg(HEX, R.bright)}"); background-size:28px 32px; background-repeat:repeat; opacity:0.22; mix-blend-mode:overlay; z-index:2; }
.tex.circuit { background-image:url("${svg(CIRCUIT, R.bright)}"); background-size:110px 110px; background-repeat:repeat; opacity:0.30; mix-blend-mode:screen; z-index:2; }

/* ----- bevel highlight (top-left) + shadow (bottom-right) ----- */
.card::before {
  content:''; position:absolute; inset:0; border-radius:24px; pointer-events:none; z-index:3;
  background: linear-gradient(135deg,
    rgba(255,255,255,0.55) 0%,
    rgba(255,255,255,0.18) 12%,
    transparent 38%,
    transparent 100%);
}
.card::after {
  content:''; position:absolute; inset:0; border-radius:24px; pointer-events:none; z-index:3;
  background: linear-gradient(135deg,
    transparent 0%,
    transparent 58%,
    rgba(0,0,0,0.42) 78%,
    rgba(0,0,0,0.75) 100%);
}

/* ----- panel lines (plate seams) ----- */
.panel-h { position:absolute; left:0; right:0; height:2px; background:rgba(0,0,0,0.6); box-shadow:0 1px 0 ${R.bright}55, 0 -1px 0 rgba(0,0,0,0.5); z-index:4; }
.panel-v { position:absolute; top:0; bottom:0; width:2px; background:rgba(0,0,0,0.55); box-shadow:1px 0 0 ${R.bright}55, -1px 0 0 rgba(0,0,0,0.5); z-index:4; }

/* ----- rivets ----- */
.rivet { position:absolute; width:12px; height:12px; border-radius:50%;
  background: radial-gradient(circle at 30% 30%, ${R.bright} 0%, ${R.main} 40%, ${R.shadow} 85%, #000 100%);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.25),
    0 0 4px rgba(0,0,0,0.9),
    inset 0 0 2px rgba(0,0,0,0.65),
    inset 1px 1px 2px ${R.bright}aa;
  pointer-events:none; z-index:5;
}

/* ----- inner dark panel (where art + text zones live) ----- */
.inner {
  position:absolute; inset:22px; border-radius:16px;
  background:
    radial-gradient(ellipse at top, rgba(18,20,38,1) 0%, rgba(5,7,16,1) 72%),
    #020308;
  box-shadow:
    inset 0 0 0 2px ${R.shadow},
    inset 0 0 0 3px ${R.main}aa,
    inset 0 0 0 4px ${R.deep},
    inset 0 0 30px rgba(0,0,0,0.8),
    inset 0 0 70px ${R.glowWide};
  overflow:hidden;
  z-index:6;
}
.inner::before { content:''; position:absolute; inset:0; background-image:url("${svg(CIRCUIT, R.main)}"); background-size:260px 260px; opacity:0.08; mix-blend-mode:screen; pointer-events:none; }

/* ----- HEADER ZONE — no visible bar. The dark inner panel already
   provides the background; the renderer draws the name directly on it. */

/* ----- COST CIRCLE (top-right, double ring, empty interior) ----- */
.cost {
  position:absolute; right:38px; top:34px;
  width:108px; height:108px; border-radius:50%;
  background: radial-gradient(circle at 30% 30%, ${R.bright} 0%, ${R.main} 30%, ${R.deep} 65%, ${R.shadow} 100%);
  box-shadow:
    inset 0 3px 3px ${R.bright}cc,
    inset 0 -5px 8px ${R.shadow},
    inset 0 0 0 1px ${R.bright}aa,
    0 0 28px ${R.glow},
    0 0 60px ${R.glowWide},
    0 4px 10px rgba(0,0,0,0.85);
  z-index:8;
}
.cost::before {
  content:''; position:absolute; inset:6px; border-radius:50%; background:${R.shadow};
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.9), inset 0 2px 4px rgba(0,0,0,0.6);
}
.cost::after {
  content:''; position:absolute; inset:13px; border-radius:50%;
  background: radial-gradient(circle at 35% 30%, rgba(35,40,60,0.96) 0%, rgba(4,6,14,1) 95%);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.75), inset 0 0 0 2px ${R.main}aa, inset 0 0 12px ${R.glow};
}

/* ----- HEADER SEPARATOR LINE (between name zone and art) ----- */
.sep-top {
  position:absolute; left:46px; right:46px; top:158px;
  height:2px;
  background: linear-gradient(90deg, transparent 0%, ${R.main}cc 20%, ${R.bright} 50%, ${R.main}cc 80%, transparent 100%);
  box-shadow: 0 0 8px ${R.glow};
  z-index:7;
}

/* ----- ART FRAME (deep black window) ----- */
.art-frame {
  position:absolute; left:46px; right:46px; top:170px;
  height:500px; border-radius:10px;
  background:#000;
  box-shadow:
    inset 0 0 0 1px ${R.deep},
    inset 0 0 0 3px rgba(0,0,0,0.9),
    inset 0 0 0 4px ${R.main},
    inset 0 0 80px rgba(0,0,0,0.78),
    0 0 22px ${R.glowWide},
    0 6px 16px rgba(0,0,0,0.9);
  z-index:7;
}

/* ----- TYPE / RARITY strip — narrow gold bar between art and ability ----- */
.type-bar {
  position:absolute; left:46px; right:46px; top:680px;
  height:44px; border-radius:8px;
  background: linear-gradient(180deg, ${R.deep} 0%, ${R.shadow} 100%);
  box-shadow:
    inset 0 1px 0 ${R.bright}aa,
    inset 0 0 0 1px ${R.main},
    inset 0 -1px 0 ${R.shadow},
    0 0 16px ${R.glowWide};
  z-index:7;
}
.type-bar::before {
  content:''; position:absolute; inset:0; border-radius:8px;
  background: linear-gradient(115deg, transparent 20%, ${R.bright}20 40%, transparent 60%);
  pointer-events:none;
}

/* ----- ABILITY BODY panel — larger, generous for text ----- */
.ability-box {
  position:absolute; left:46px; right:46px; top:736px;
  height:200px; border-radius:10px;
  background: linear-gradient(180deg, rgba(10,13,28,0.94) 0%, rgba(3,5,14,0.96) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    inset 0 0 0 1px rgba(70,80,120,0.7),
    inset 0 0 40px rgba(0,0,0,0.55),
    0 4px 10px rgba(0,0,0,0.55);
  z-index:7;
}

/* ----- FOOTER — ATK / DEF pod ----- */
.footer {
  position:absolute; left:46px; right:46px; top:948px;
  height:70px; border-radius:12px;
  background: linear-gradient(180deg, rgba(14,18,32,0.96) 0%, rgba(4,6,14,0.96) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    inset 0 0 0 1px ${R.deep},
    inset 0 0 0 2px rgba(0,0,0,0.5),
    0 0 18px ${R.glowWide};
  z-index:7;
}
</style></head>
<body>
  <div class="card">
    <div class="tex noise"></div>
    <div class="tex hex"></div>
    <div class="tex circuit"></div>

    <!-- plate seams -->
    <div class="panel-h" style="top:28px;"></div>
    <div class="panel-h" style="bottom:28px;"></div>
    <div class="panel-v" style="left:28px;"></div>
    <div class="panel-v" style="right:28px;"></div>

    <!-- rivets at seam intersections -->
    <div class="rivet" style="top:6px; left:6px;"></div>
    <div class="rivet" style="top:6px; right:6px;"></div>
    <div class="rivet" style="bottom:6px; left:6px;"></div>
    <div class="rivet" style="bottom:6px; right:6px;"></div>

    <!-- inner dark bg -->
    <div class="inner"></div>

    <!-- empty text zones -->
    <div class="cost"></div>
    <div class="sep-top"></div>
    <div class="art-frame"></div>
    <div class="type-bar"></div>
    <div class="ability-box"></div>
    <div class="footer"></div>
  </div>
</body></html>`;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
    defaultViewport: { width: CARD_W, height: CARD_H, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  for (const rarityKey of Object.keys(RARITY)) {
    const html = frameHtml(rarityKey);
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 150));
    const outPath = path.join(OUT_DIR, `${rarityKey}.png`);
    await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: CARD_W, height: CARD_H } });
    console.log(`  built ${rarityKey}.png`);
  }
  await browser.close();
  console.log(`Done. 6 frames in ${OUT_DIR}`);
}

main().catch(e => { console.error(e); process.exit(1); });
