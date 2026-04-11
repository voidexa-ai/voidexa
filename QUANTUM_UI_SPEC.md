# QUANTUM UI REDESIGN SPEC
## For Claude Code — Read this entire file before starting

**Project:** C:\Users\Jixwu\Desktop\voidexa (Next.js/Vercel)
**Branch:** Create backup first: `git checkout -b backup/quantum-ui-redesign-$(date +%Y%m%d)`
**Goal:** Redesign the Quantum debate chat page to fix layout scrolling and upgrade visual quality.

---

## PROBLEM SUMMARY

1. **Entire page scrolls** — when user reads the chat, the provider constellation panel (left side with AI character images) scrolls away. User loses context of who's speaking.
2. **Raw markdown** — provider responses show raw `##`, `**`, `---`, `-` characters instead of rendered headers, bold, lists, code blocks.
3. **No visual separation** — all provider responses flow together as one continuous wall of text. Hard to distinguish who said what.
4. **Looks dated** — the chat area needs better message cards, spacing, and typography.

## WHAT WORKS WELL (DO NOT CHANGE)

- The constellation diamond layout with character images (Claude, GPT, Gemini, Perplexity) — keep this exactly as-is with the existing character portrait images
- The consensus bar — keep as-is
- The CostSummaryStrip at the bottom — just redesigned, keep the new narrative format
- The "Ask Quantum" button and mode selector — keep as-is
- The dark sci-fi color scheme — keep it
- The pulsating dot and timer — keep it
- The voidexa nav bar — don't touch

---

## CHANGES REQUIRED

### 1. LAYOUT: Split into sticky left panel + scrollable chat

The page below the navbar should be a flex container:

```
┌─────────────────────────────────────────────────────────┐
│ voidexa nav bar (unchanged)                             │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  LEFT PANEL  │  CHAT AREA (scrolls independently)      │
│  (sticky)    │                                          │
│              │  ┌─ Question ─────────────────────────┐  │
│  Constellation│  │                                    │  │
│  with AI     │  ├─ Round 1 separator ────────────────┤  │
│  portraits   │  │                                    │  │
│              │  │  Claude message card                │  │
│  Consensus   │  │  GPT message card                   │  │
│  bar         │  │  Gemini message card                 │  │
│              │  │  Perplexity message card             │  │
│  KCP-90      │  │                                    │  │
│  stats       │  ├─ Round 2 separator ────────────────┤  │
│  (NEW)       │  │  ...more cards...                   │  │
│              │  │                                    │  │
│              │  └────────────────────────────────────┘  │
│              ├──────────────────────────────────────────┤
│              │  Cost Strip (pinned bottom)              │
│              ├──────────────────────────────────────────┤
│              │  Input + Ask Quantum (pinned bottom)     │
├──────────────┴──────────────────────────────────────────┤
│ footer                                                   │
└─────────────────────────────────────────────────────────┘
```

**CSS approach:**

```css
/* Main container below nav */
.quantum-page {
  display: flex;
  height: calc(100vh - navbar-height);
  overflow: hidden;
}

/* Left panel — does NOT scroll */
.quantum-left-panel {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: calc(100vh - navbar-height);
  overflow-y: auto;
  border-right: 1px solid rgba(255,255,255,0.08);
  padding: 24px 16px;
}

/* Right panel — chat + cost + input */
.quantum-right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: calc(100vh - navbar-height);
}

/* Chat area — THIS is what scrolls */
.quantum-chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  min-height: 0; /* critical for flex overflow */
}

/* Cost strip — pinned at bottom of right panel */
.quantum-cost-strip {
  flex-shrink: 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 16px 28px;
}

/* Input — pinned at bottom */
.quantum-input-area {
  flex-shrink: 0;
  padding: 12px 28px 20px;
}
```

### 2. ADD KCP-90 INFO PANEL (left panel, below consensus)

Add a small info box below the consensus bar showing:
- "KCP-90 ACTIVE" label
- Compression rate (from session data)
- Tokens saved (calculated: original tokens - compressed tokens)

Style: dark card with subtle purple border, matching the existing dark sci-fi theme.

### 3. MARKDOWN RENDERING IN CHAT

Install `react-markdown` if not already present:
```
npm install react-markdown
```

Wrap every provider response in a markdown renderer:
```jsx
import ReactMarkdown from 'react-markdown';

<ReactMarkdown className="quantum-markdown">
  {provider.response}
</ReactMarkdown>
```

Style the rendered markdown to match the dark theme:
```css
.quantum-markdown h1, .quantum-markdown h2, .quantum-markdown h3 {
  color: #e0e0e0;
  font-weight: 500;
  margin: 16px 0 8px;
}
.quantum-markdown h2 { font-size: 16px; }
.quantum-markdown h3 { font-size: 14px; }
.quantum-markdown p {
  color: #c8c8d0;
  line-height: 1.8;
  margin: 0 0 10px;
}
.quantum-markdown strong {
  color: #e0e0e0;
  font-weight: 500;
}
.quantum-markdown em {
  color: #afa9ec;
  font-style: italic;
}
.quantum-markdown code {
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 13px;
  color: rgba(175,169,236,0.8);
}
.quantum-markdown pre {
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  margin: 8px 0;
}
.quantum-markdown ul, .quantum-markdown ol {
  padding-left: 20px;
  margin: 8px 0;
}
.quantum-markdown li {
  color: #c8c8d0;
  line-height: 1.7;
  margin: 4px 0;
}
.quantum-markdown hr {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin: 16px 0;
}
```

### 4. MESSAGE CARDS PER PROVIDER

Each provider response should be wrapped in a card with:
- Subtle background tint matching provider color
- 1px border matching provider color at low opacity
- Provider avatar (existing character image) + name + role in card header
- Border-radius: 10px
- Padding: 16px 20px
- Gap between cards: 16px

**Provider color map:**
```
Claude:     border/accent rgba(127,119,221, 0.15/0.4)  — purple
GPT:        border/accent rgba(151,196,89, 0.15/0.4)   — green
Gemini:     border/accent rgba(93,202,165, 0.15/0.4)   — teal
Perplexity: border/accent rgba(239,159,39, 0.15/0.4)   — amber
```

Card structure:
```jsx
<div className="quantum-message-card" style={{ 
  background: `rgba(${providerColor}, 0.06)`,
  border: `1px solid rgba(${providerColor}, 0.15)` 
}}>
  <div className="quantum-message-header">
    <img src={provider.avatar} className="quantum-avatar" />
    <span className="quantum-provider-name">{provider.name}</span>
    <span className="quantum-provider-role">{provider.role}</span>
  </div>
  <ReactMarkdown className="quantum-markdown">
    {provider.response}
  </ReactMarkdown>
</div>
```

### 5. ROUND SEPARATORS

Between each debate round, insert a visual separator:

```jsx
<div className="quantum-round-separator">
  <div className="quantum-round-line" />
  <span className="quantum-round-label">ROUND {n}</span>
  <div className="quantum-round-line" />
</div>
```

```css
.quantum-round-separator {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}
.quantum-round-line {
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, transparent, rgba(127,119,221,0.3), transparent);
}
.quantum-round-label {
  font-size: 11px;
  letter-spacing: 1px;
  color: rgba(127,119,221,0.4);
  white-space: nowrap;
}
```

Last round can say "ROUND {n} · SYNTHESIS" if it's the final round.

### 6. SCROLLBAR STYLING

```css
.quantum-chat-area::-webkit-scrollbar { width: 4px; }
.quantum-chat-area::-webkit-scrollbar-track { background: transparent; }
.quantum-chat-area::-webkit-scrollbar-thumb { 
  background: rgba(127,119,221,0.2); 
  border-radius: 2px; 
}
```

---

## FONT SIZE RULES (voidexa global rule)

- Body text: minimum 16px (14px absolute minimum for labels)
- Provider names: 14px
- Role labels: 11-12px
- Round labels: 11px
- KCP-90 stats: 11px
- Opacity minimum: 0.5 for any text

---

## FILES LIKELY INVOLVED

Look in the voidexa codebase for the Quantum page components. Likely:
- `app/quantum/page.tsx` or similar
- `components/quantum/QuantumDebatePanel.tsx`
- `components/quantum/QuantumInput.tsx`  
- `components/quantum/CostSummaryStrip.tsx` (recently updated — be careful)
- Related CSS/styled components

Use `grep -r "quantum" --include="*.tsx" --include="*.ts"` to find all files.

---

## BUILD RULES

1. Git backup BEFORE starting
2. Build everything in ONE session
3. `npm run build` must pass
4. Do NOT change CostSummaryStrip logic — only move it to pinned position
5. Do NOT change the constellation diamond layout — only make it sticky
6. Do NOT change the Ask Quantum input logic — only pin it to bottom
7. Keep all existing character portrait images
8. Test with a completed session to verify scrolling behavior

---

## DONE CRITERIA

- [ ] Left panel stays visible while scrolling chat
- [ ] Chat scrolls independently inside its container
- [ ] Provider responses render markdown (headers, bold, code blocks, lists)
- [ ] Each provider has its own color-coded card
- [ ] Round separators visible between debate rounds
- [ ] Cost strip and input pinned at bottom
- [ ] KCP-90 stats visible in left panel
- [ ] Font sizes comply with voidexa rules
- [ ] `npm run build` passes
- [ ] No regressions in existing functionality
