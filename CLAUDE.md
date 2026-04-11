## PRODUCTION — QUANTUM ER LIVE
- Backend: https://quantum-production-dd9d.up.railway.app
- Frontend: https://voidexa.com/quantum/chat (Vercel)
- ALDRIG test på localhost. ALDRIG foreslå dev server. Alt er production.
- Deploy backend: git push (Railway auto-deployer)
- Deploy frontend: cd C:\Users\Jixwu\Desktop\voidexa && npx vercel --prod
- Port 8080. httpx<0.28. Guest sessions tilladt.
- Ejer: Jix (IKKE Jimmi/Jimmy). Virksomhed: voidexa, CVR 46343387.

## WORKFLOW REGLER
- ALDRIG start building før Jix bekræfter planen
- ALDRIG troubleshoot manuelt — fix selv
- ALDRIG foreslå pauser eller at stoppe
- Én kommando = én build. Byg ALT i én session
- Git backup FØR store ændringer
- Font regler: body 16px min, labels 14px min, opacity 0.5 min
- Ved AFSLUTNING af HVER session: opdater denne CLAUDE.md med hvad der blev bygget/ændret

# CLAUDE.md — Quantum UI Polish

## What This Is
Fix 4 specific UI/UX issues in Quantum chat. Read SKILL.md for detailed descriptions.

## Two Repos
1. C:\Users\Jixwu\Desktop\voidexa (frontend — Next.js)
2. C:\Users\Jixwu\Projects\quantum (backend — FastAPI)

## GitNexus
Quantum repo is indexed. MUST run gitnexus_impact before editing any symbol. MUST run gitnexus_detect_changes before committing.

## The 4 Fixes (in priority order)

### Fix 1: Scroll — only auto-scroll if user is near bottom
File: voidexa/components/quantum/QuantumDebatePanel.tsx
Change scrollToBottom to check if user is within 100px of bottom before scrolling.

### Fix 2: Streaming text — character by character typewriter effect  
File: voidexa/components/quantum/DebateMessage.tsx
Ensure the streaming prop renders text progressively. If tokens arrive as 20-char chunks, animate each chunk appearing with CSS transition or requestAnimationFrame.

### Fix 3: KCP-90 preload — disable Layer 1 for web sessions
File: quantum/.env — add KCP90_LAYER1_TIMEOUT=0 or KCP90_DISABLE_LAYER1=true
This prevents BERT model loading during chat sessions.

### Fix 4: AI debate references — round 2 context
File: quantum/engine.py — check _run_round() for round 2+ context passing.
AIs should see previous round responses and reference them. This may already work but frontend only shows round 1.
File: quantum/quantum_api/services/engine_bridge.py — check if all rounds are yielded or just round 1.

## Critical Rules
1. Read SKILL.md FIRST
2. Git backup BEFORE changes in both repos
3. Use GitNexus for impact analysis
4. Test with both servers running
5. npm run build must pass
6. Git commit both repos
7. Do NOT deploy to vercel — we will review first
