# SCAFFOLD_FIX.md — Claude Code Task

## Context
voidexa.com at C:\Users\Jixwu\Desktop\voidexa
Quantum chat page: /quantum/chat

## Problem
The "Build Scaffold" toggle only appears AFTER a debate has completed. But scaffold mode should be available from the START — a user should be able to select "Build Scaffold" mode BEFORE asking their first question. It's a standalone mode, not a follow-up feature.

## Fix
1. Move the "Build Scaffold" button OUT of the follow-up toggles area
2. Make it a mode selector next to the existing Standard/Deep dropdown — OR place it as a separate toggle button that is ALWAYS visible near the input field, even before any debate
3. When "Build Scaffold" is active BEFORE the first question: the user types what they want to build, and Quantum sends it to all 4 providers with the scaffold prefix prompt (CLAUDE.md + SKILL.md + file structure + build command)
4. "All Providers" and "Challenge" toggles should STILL only appear after a debate completes — those are follow-up features
5. When scaffold mode is active, change the input placeholder to "Describe what you want to build..."

## Rules
1. Git backup: git add -A && git commit -m "pre-scaffold-fix backup"
2. Read the existing toggle implementation before changing
3. npm run build
4. git add -A && git commit -m "fix: scaffold mode available from start, not just as follow-up"
5. git push origin main:master
6. npx vercel --prod
7. ONE run. No stopping.
