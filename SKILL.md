---
name: quantum-ui-polish
description: Fix 4 specific UI/UX issues in Quantum chat interface on voidexa.com
---

# Quantum UI Polish — 4 Fixes

## Project Location
voidexa.com frontend: C:\Users\Jixwu\Desktop\voidexa
Quantum API backend: C:\Users\Jixwu\Projects\quantum

## GitNexus
Quantum repo is indexed by GitNexus. Use gitnexus_impact before editing any symbol. Use gitnexus_context to understand dependencies. Run gitnexus_detect_changes before committing.

## The 4 Problems

### Problem 1: Text arrives as one big block
CURRENT: When an AI responds, the entire response appears at once — one big wall of text instantly.
EXPECTED: Text should stream in character-by-character with a typewriter effect, like watching someone type. Each character appears with ~18ms delay.
WHERE: The issue is in engine_bridge.py (Quantum repo) — it chunks responses into 20-char pieces but the frontend DebateMessage component may not be rendering them progressively.
FILES: 
- C:\Users\Jixwu\Desktop\voidexa\components\quantum\DebateMessage.tsx — check if streaming prop triggers character-by-character rendering
- C:\Users\Jixwu\Projects\quantum\quantum_api\services\engine_bridge.py — verify token events are yielded with proper delays

### Problem 2: Auto-scroll is too aggressive
CURRENT: Every time a new message or token arrives, the chat scrolls to the bottom. You can't read previous responses because it keeps jumping.
EXPECTED: Only auto-scroll if the user is already near the bottom (within 100px). If they've scrolled up to read, don't force scroll.
WHERE: C:\Users\Jixwu\Desktop\voidexa\components\quantum\QuantumDebatePanel.tsx — the scrollToBottom function runs on every message update via useEffect.
FIX: Check scrollTop + clientHeight vs scrollHeight before scrolling. Only scroll if user is within 100px of bottom.

### Problem 3: KCP-90 BERT model loads during session
CURRENT: During a Quantum session, the terminal shows "Loading weights: 100%" and "Warning: You are sending unauthenticated requests to the HF Hub." This is KCP-90's BERT Layer 1 model loading mid-session.
EXPECTED: KCP-90 should preload at Quantum API startup (in the lifespan function), not during a session. Or disable KCP-90 Layer 1 for the API if it's not needed for web sessions.
WHERE: C:\Users\Jixwu\Projects\quantum\quantum_api\main.py — add KCP-90 preload in lifespan, OR set KCP90_LAYER1_TIMEOUT=0 in .env to disable Layer 1.
SIMPLEST FIX: Add KCP90_DISABLE_LAYER1=true to .env and check it in the engine. Or simply set KCP90_LAYER1_TIMEOUT=0.

### Problem 4: No real debate — AIs don't reference each other
CURRENT: Each AI gives an independent answer. Claude says X, GPT says Y, Gemini says Z. They don't say "I disagree with Claude because..." 
EXPECTED: In round 2+, AIs should see what others said and respond to it. This creates the debate effect.
WHERE: This is in quantum/engine.py — the prompt for round 2+ should include previous responses. This may already be implemented in the engine (Quantum was designed with multi-round debate). Check if the frontend only shows round 1 responses or all rounds.
NOTE: This is a BACKEND issue in the Quantum repo, not frontend. The engine needs to pass round 1 responses as context to round 2 providers. Check engine.py _run_round() for how context is passed between rounds.

## Priority Order
1. Problem 2 (scroll fix) — quickest, pure frontend
2. Problem 1 (streaming text) — frontend + backend coordination  
3. Problem 3 (KCP-90 preload) — backend env var
4. Problem 4 (debate references) — backend engine logic, most complex

## Testing
1. Start Quantum API: cd C:\Users\Jixwu\Projects\quantum; python -m uvicorn quantum_api.main:app --reload --port 8000
2. Start voidexa: cd C:\Users\Jixwu\Desktop\voidexa; npm run dev
3. Go to localhost:3000/quantum/chat
4. Ask a question and verify:
   - Text streams in progressively (not all at once)
   - Scrolling doesn't jump when reading previous messages
   - No "Loading weights" warning in terminal
   - In round 2, AIs reference each other's positions
5. npm run build for voidexa — zero errors
6. pytest for Quantum — all tests pass
7. Git commit both repos
8. npx vercel --prod for voidexa

## Rules
- Use GitNexus impact analysis before editing any symbol
- Git backup before changes in both repos
- Do NOT break existing functionality
- Do NOT modify provider code or auth code
- Minimum font 16px body, 14px labels
