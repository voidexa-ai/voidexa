# SCAFFOLD_DOWNLOAD_FIX.md — Claude Code Task

## Context
voidexa.com at C:\Users\Jixwu\Desktop\voidexa
Quantum chat page: /quantum/chat

## Problem
When "Build Scaffold" mode runs, the output (CLAUDE.md, SKILL.md, file structure, build commands) is dumped as plain text into the chat. The user has to manually copy and separate everything into files. That's bad UX.

## What We Want
After a scaffold debate completes, parse the output and present downloadable files. The scaffold output from the AI providers will contain sections for CLAUDE.md, SKILL.md, file structure, and build commands. Extract these into separate downloadable files.

## Implementation
1. In the Quantum chat component, detect when a scaffold session completes (check if the session was started in scaffold mode)
2. After the QUANTUM CONSENSUS synthesis is generated, parse the synthesis text looking for these sections:
   - Everything between "# CLAUDE.md" (or "## CLAUDE.md" or "CLAUDE.md") and the next major heading → save as CLAUDE.md
   - Everything between "# SKILL.md" (or "## SKILL.md" or "SKILL.md") and the next major heading → save as SKILL.md
   - Everything between "# Build Command" (or "## Build Command" or "Build Command") and the next major heading → save as BUILD_COMMAND.txt
   - The FULL unprocessed synthesis → save as FULL_SCAFFOLD.md
3. Display a "Download Scaffold Files" section below the synthesis with buttons:
   - "Download CLAUDE.md" — downloads the extracted CLAUDE.md content
   - "Download SKILL.md" — downloads the extracted SKILL.md content  
   - "Download Build Command" — downloads the build command
   - "Download Complete Scaffold" — downloads everything as one file
4. Each button creates a Blob and triggers a browser download with the correct filename
5. Style: glassmorphism card matching existing Quantum UI, purple/cyan accent buttons, minimum 14px font
6. If the parser can't find distinct sections, just show "Download Complete Scaffold" with the full output

## Technical Notes
- Use JavaScript Blob + URL.createObjectURL for downloads — no server needed
- This is purely frontend — no API changes
- The download section should appear between the synthesis and the follow-up input area

## Rules
1. Git backup: git add -A && git commit -m "pre-scaffold-download backup"
2. Read the existing scaffold/synthesis rendering code before changing
3. npm run build
4. git add -A && git commit -m "feat: scaffold mode generates downloadable CLAUDE.md and SKILL.md files"
5. git push origin main:master
6. npx vercel --prod
7. ONE run. No stopping.
