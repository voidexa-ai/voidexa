@AGENTS.md

## Company
- **Name:** Voidexa
- **CVR-nr:** 46343387
- **Registered with:** Skattestyrelsen (Danish Tax Authority)
- **Status:** Active

## IMPECCABLE DESIGN RULES

Source: [impeccable.style](https://impeccable.style) — fights generic AI aesthetics.

### The Core Test
If you showed this UI to someone and said "AI made this," would they believe it immediately? If yes — redesign. Every interface must have a clear, intentional aesthetic direction.

### Typography
- **DO**: Use distinctive display font + refined body font. Modular type scale with `clamp()` fluid sizing.
- **DON'T**: Inter, Roboto, Arial, Open Sans, system defaults. No monospace as "developer vibes shorthand".
- **DON'T**: Large rounded icons above every heading — templated look.

### Color
- **DO**: `oklch()`, `color-mix()`, `light-dark()`. Tint neutrals toward brand hue. Dominant colors + sharp accents.
- **DON'T**: Gray text on colored backgrounds. Pure `#000` / `#fff`. Cyan-on-dark, purple-to-blue gradients, neon on dark.
- **DON'T**: Gradient text on headings/metrics. Default dark mode with glowing accents.

### Layout & Space
- **DO**: Varied spacing — tight groupings, generous separations. `clamp()` fluid spacing. Asymmetry. Break the grid intentionally.
- **DON'T**: Wrap everything in cards. Cards inside cards. Identical card grids (icon + heading + text, repeated). Center everything.
- **DON'T**: Hero metric layout (big number + small label + gradient accent). Same padding everywhere.

### Visual Details
- **DON'T**: Glassmorphism everywhere. Rounded rectangles with generic drop shadows. Rounded elements with thick colored border on one side. Sparklines as decoration. Modals unless truly necessary.

### Motion
- **DO**: `ease-out-quart/quint/expo`. `grid-template-rows` for height animations. High-impact moments — one well-orchestrated load beats scattered micro-interactions.
- **DON'T**: Animate `width`, `height`, `padding`, `margin` — use `transform` and `opacity` only. No bounce/elastic easing.

### Interaction
- **DO**: Optimistic UI. Progressive disclosure. Empty states that teach. Every interactive surface feels intentional.
- **DON'T**: Every button primary. Repeat information users can already see.

### Responsive
- **DO**: `@container` queries. Mobile-first. Adapt the interface, don't shrink it.
- **DON'T**: Hide critical functionality on mobile.

### Impeccable Commands (use in Claude sessions)
`/audit` → technical quality checks | `/critique` → UX design review | `/polish` → final pass before shipping
`/normalize` → align with design system | `/typeset` → fix fonts/hierarchy | `/arrange` → fix layout/rhythm
`/bolder` → amplify boring designs | `/quieter` → tone down loud designs | `/colorize` → add strategic color
`/animate` → purposeful motion | `/delight` → moments of joy | `/overdrive` → extraordinary effects
