# CLAUDE.md — Quantum Chat UI

## What This Is
Build the Quantum multi-AI debate chat interface as a page inside voidexa.com.
Users reach it from /quantum via a "Try Quantum" button. It connects to the Quantum FastAPI backend for real-time AI debates.

## Project Location
C:\Users\Jixwu\Desktop\voidexa

## Backend Location
C:\Users\Jixwu\Projects\quantum\quantum_api\ (FastAPI, not deployed yet — use localhost)

## Critical Rules
1. Read SKILL.md FIRST — it has the complete spec
2. Git backup BEFORE changes: git add -A && git commit -m "pre-quantum-ui backup"
3. STREAMING IS EVERYTHING — the user must never stare at a blank screen. Text streams in character by character. Avatars glow while speaking. Consensus meter animates gradually. Show "thinking" states between responses.
4. Use existing character images from public/images/cast/ (claude.jpg, gpt.jpg, gemini.jpg, perplexity.jpg, llama.jpg)
5. Match voidexa design language — dark space aesthetic, Quantum accent #7777bb
6. Auth required — same Supabase auth pattern as Void Chat (/void-chat layout.tsx)
7. Graceful fallback if Quantum API is offline
8. npm run build must pass with ZERO errors
9. Build everything in ONE command — no user input mid-build
10. After build: git add -A && git commit -m "feat: Quantum debate chat UI with streaming" && npx vercel --prod

## The UI Feel
Think of it as watching a live conference room debate. You ask a question, then 5 AIs discuss it in real time. You see each one thinking, then responding, then reacting to each other. The consensus meter climbs as they converge. It feels alive, not like waiting for an API call.

## What Already Exists
- /quantum page with marketing content, character avatars in ring layout, debate preview mockup
- quantum_api/ with FastAPI backend, JWT auth, SSE streaming, 14 modules
- Character images in public/images/cast/
- Supabase auth system
- Void Chat as a reference for auth flow + chat UI patterns

## Minimum Font Sizes
Body text: 16px minimum. Labels/badges: 14px minimum. Opacity minimum 0.5.
