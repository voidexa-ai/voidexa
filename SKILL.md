---
name: quantum-chat-ui
description: Build the Quantum multi-AI debate chat interface as a page inside voidexa.com. The user reaches it from the /quantum marketing page via a "Try Quantum" button. Features 5 AI characters debating in real-time with streaming text, consensus meter, and the voidexa dark space aesthetic. Triggers on "quantum ui", "quantum chat", "try quantum", "debate interface", "quantum frontend" in the context of voidexa.
---

# Quantum Chat UI — Build Skill

## Context
Project: voidexa.com at C:\Users\Jixwu\Desktop\voidexa (Next.js, Vercel)
Backend: Quantum API at C:\Users\Jixwu\Projects\quantum\quantum_api\ (FastAPI, JWT auth, SSE streaming)
Goal: Build a functional Quantum debate chat interface inside voidexa.com that connects to the Quantum FastAPI backend.

## Entry Point
The /quantum page on voidexa.com already exists as a marketing/teaser page. Add a "Try Quantum" button that links to /quantum/chat (or /try-quantum). That new page IS the functional debate UI.

## The 5 AI Characters (already exist in voidexa)
Images at: public/images/cast/
- Claude (claude.jpg) — Chief Architect — blue #60a5fa — "Overthinks everything. Usually right."
- GPT (gpt.jpg) — Lead Developer — green #4ade80 — "Never wrong. Except when he is."
- Perplexity (perplexity.jpg) — Fact Checker — orange #fb923c — "Actually, according to my sources..."
- Gemini (gemini.jpg) — Senior Reviewer — purple #c084fc — "Namaste. Your code is garbage."
- Llama (llama.jpg) — Trainee — gray #94a3b8 — "Loading... 12% complete."
- Jix (jix.jpg) — CEO — gold #f59e0b (NOT a debater — only appears as easter egg)

## UI Layout — What the User Sees

### Top Area
- Session status bar: timer (running), cost counter ($0.0000 incrementing), "Quantum — Live Session" label
- Mac-style window dots (red/yellow/green) for aesthetics

### Left Side — Avatar Ring + Consensus
- 5 AI avatars arranged in a circle/ring with connection lines between them
- Center label: "QUANTUM"
- Each avatar: circular photo, name, role below
- Active speaker has glowing border in their color
- Consensus meter below the ring: animated bar 0-100% with "Emerging from 5 providers" text

### Right Side — Debate Messages
- Question box at top showing the user's question
- Streaming debate messages below, each with:
  - Avatar photo (small, 30px)
  - Character name in their color
  - Message text streaming in character by character (NOT appearing all at once)
  - Strikethrough on text when an AI changes position
  - Green highlight when an AI shifts to agree
- Auto-scrolls as new messages arrive

### Bottom
- Input field for user's question
- "Ask Quantum" submit button
- Cost and time stats

## CRITICAL: Streaming Feel
The #1 requirement. The user must NEVER sit staring at a blank screen waiting. The UI must feel alive at all times:
- When the question is submitted, all 5 avatars show "thinking" animation (subtle pulse/glow)
- As each AI responds, their avatar lights up and text streams in
- SSE (Server-Sent Events) from the Quantum API delivers tokens in real-time
- If the backend takes time, show intermediate states: "Claude is analyzing...", "GPT is forming a response...", "Perplexity is checking sources..."
- The consensus meter should animate gradually as debate progresses
- Typing indicators per AI character

## Backend Connection
The Quantum API (quantum_api/) runs locally on a configurable port. For now:
- API base URL: configurable via env var NEXT_PUBLIC_QUANTUM_API_URL (default http://localhost:8000)
- Auth: JWT token from voidexa Supabase auth
- Endpoints needed:
  - POST /api/quantum/session — start a new debate session
  - GET /api/quantum/session/{id}/stream — SSE stream of debate events
  - GET /api/quantum/session/{id}/status — session status/consensus
- If the Quantum API is not running, show a graceful "Quantum is offline — coming soon" message

## Design Language
Same voidexa dark space aesthetic:
- Background: transparent (inherits site background)
- Cards/panels: rgba(8,8,18,0.92) with blur, borders rgba(119,119,187,0.3)
- Quantum accent: #7777bb (already used on /quantum page)
- Character colors as listed above
- Font: var(--font-space) for headings, system for body
- Minimum 14px body text, 14px labels
- Glow effects on active elements
- Mac-style window chrome for the debate panel

## Files to Create
1. app/quantum/chat/page.tsx — The debate UI page (or app/try-quantum/page.tsx)
2. components/quantum/QuantumDebatePanel.tsx — Main debate interface component
3. components/quantum/AvatarRing.tsx — The 5 AI avatars in circle layout with connections
4. components/quantum/ConsensusMeter.tsx — Animated consensus bar
5. components/quantum/DebateMessage.tsx — Single debate message with streaming
6. components/quantum/QuantumInput.tsx — Question input + submit
7. components/quantum/SessionBar.tsx — Timer, cost, status
8. lib/quantum/client.ts — API client for Quantum backend (SSE, REST)
9. types/quantum.ts — TypeScript types for sessions, messages, events

## Files to Modify
1. app/quantum/page.tsx — Add "Try Quantum" button linking to /quantum/chat
2. components/layout/Navigation.tsx — No changes needed (Quantum already in nav)

## Auth
Quantum chat requires login (same as Void Chat). Use the existing Supabase auth from voidexa.com. Redirect to /auth/login if not authenticated.

## Build Order
1. Git backup: git add -A && git commit -m "pre-quantum-ui backup"
2. Create all new files
3. Modify /quantum page to add Try Quantum button
4. npm run build — fix ALL errors
5. Git commit: "feat: Quantum debate chat UI with streaming"
6. npx vercel --prod

## Rules
- NEVER break existing pages
- The streaming feel is NON-NEGOTIABLE — no blank waiting screens
- Use existing character images from public/images/cast/
- Keep the voidexa design language consistent
- Auth required — same pattern as Void Chat
- Graceful offline fallback if Quantum API is not running
- Mobile responsive
