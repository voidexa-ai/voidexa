# QUANTUM_FOLLOWUP_UPGRADE.md — Claude Code Task

## Context
voidexa.com at C:\Users\Jixwu\Desktop\voidexa
Quantum chat page: /quantum/chat
Backend API: quantum-production-dd9d.up.railway.app
This task modifies the FRONTEND only (Next.js). The backend already supports sending to all providers.

## What Exists Now
- User asks a question → all 4 providers debate → QUANTUM CONSENSUS synthesis
- Follow-up questions → ONLY Claude answers (cheap, fast)
- No toggles, no modes for follow-ups

## What We Are Building
Three toggle buttons that appear AFTER the first debate is complete. They modify how the NEXT follow-up question behaves. All three are OFF by default. When none are active, follow-up works as it does now (Claude only).

### Toggle 1: "All Providers"
- When ON: follow-up sends to ALL 4 providers instead of just Claude
- When ON: automatically disables Claude-only follow-up
- Costs same as a new question (deducts from wallet)
- Hover tooltip text: "Send your follow-up to all 4 providers instead of just Claude. Each provider responds from their role with context from the previous debate. Costs the same as a new session."

### Toggle 2: "Challenge Mode"
- When ON: follow-up sends to ALL 4 providers with an extra prefix prompt
- The prefix prompt added to the user's message: "The user challenges your previous conclusions. Re-examine your reasoning. Find weaknesses in your own arguments. If you find you were wrong, say so. Perplexity: search for sources that CONTRADICT the previous consensus."
- When ON: automatically enables All Providers (can't challenge with just Claude)
- Hover tooltip text: "Forces all providers to question their own conclusions based on your input. Write what you want them to reconsider. They will actively try to find flaws in their previous answers."

### Toggle 3: "Build Scaffold"
- When ON: follow-up sends to ALL 4 providers with a scaffold-building prompt
- The prefix prompt added to the user's message: "The user wants a complete project scaffold. Work together to produce: 1) A CLAUDE.md file with project rules, architecture, build order, and constraints. 2) A SKILL.md file with reusable patterns and best practices. 3) A complete file/folder structure. 4) A single Claude Code command that builds everything. 5) List of dependencies and environment variables needed. Output must be ready to copy-paste into Claude Code and run. Be specific, not generic."
- Each provider contributes from their strength: Claude=architecture, GPT=technical spec, Gemini=alternatives, Perplexity=finds libraries and existing solutions
- When ON: automatically enables All Providers
- Hover tooltip text: "Quantum builds a complete project scaffold with CLAUDE.md, SKILL.md, file structure, and build commands — ready to paste into Claude Code. Describe what you want to build."

## UI Design
- The three toggles appear as small pill-buttons below the input field, only visible AFTER at least one debate has completed in the current session
- Each button has an icon + short label: "All Providers" | "Challenge" | "Scaffold"
- Inactive state: dimmed, outline only
- Active state: glowing border, filled background (use existing voidexa purple/cyan accent colors)
- Hover: shows tooltip popup with the description text
- Only ONE of Challenge/Scaffold can be active at a time (they both require All Providers, but are mutually exclusive)
- All Providers CAN be active alone without Challenge or Scaffold

## Technical Implementation
1. Find the follow-up/input component in the Quantum chat page
2. Add state: followUpMode = 'claude_only' | 'all_providers' | 'challenge' | 'scaffold'
3. When sending a follow-up:
   - claude_only (default): send to /api/quantum/followup with provider='claude' (existing behavior)
   - all_providers: send to /api/quantum/session (same as new question) with the previous debate as context
   - challenge: same as all_providers but prepend the challenge prefix to user's message
   - scaffold: same as all_providers but prepend the scaffold prefix to user's message
4. The follow-up API route may need a small change to accept a "context" parameter with the previous debate

## Rules
1. Git backup: git add -A && git commit -m "pre-followup-upgrade backup"
2. Read existing Quantum chat components before changing anything
3. Match existing dark theme styling — use the same colors, fonts, glassmorphism as the rest of the page
4. Minimum font size 14px on labels, 16px on body text
5. Tooltips must be readable — light text on dark background, min 14px
6. npm run build — fix ALL errors
7. git add -A && git commit -m "feat: quantum follow-up upgrade — all providers, challenge mode, scaffold mode"
8. git push origin main:master
9. npx vercel --prod
10. ONE run. No stopping.
