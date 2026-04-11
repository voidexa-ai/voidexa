# QUANTUM_FIX_V2.md — Claude Code Task

## Context
voidexa.com at C:\Users\Jixwu\Desktop\voidexa
Quantum chat page: /quantum/chat
The PREVIOUS fix attempt (commit 5150ab5) did NOT work. The sidebar still scrolls horizontally and the WalletBar is not visible.

## Problem 1 — Sidebar Horizontal Scroll
The Quantum chat SIDEBAR scrolls left/right. This is wrong. Nothing in the sidebar should overflow horizontally. The entire sidebar content must fit within its container width. No horizontal scrollbar. No side-to-side scrolling. Period.

Steps:
1. Find the sidebar component used on /quantum/chat — likely in components/quantum/ or app/quantum/chat/
2. Print the full file so you can see the layout
3. Add overflow-x: hidden to the sidebar container
4. Check ALL child elements inside the sidebar for fixed pixel widths, min-widths, or content that could overflow
5. The character avatar ring (Claude, GPT, Gemini, Perplexity) and all text must fit inside the sidebar without overflowing
6. Test by running npm run build

## Problem 2 — WalletBar Not Visible
The WalletBar component exists but is NOT showing on the page. The user is admin/tester with free access — the WalletBar should STILL be visible but show "Admin / Tester — Free Access" badge.

Steps:
1. Find the WalletBar component — search for "WalletBar" in all files
2. Find where it is imported/rendered in the /quantum/chat page
3. Check if there is a conditional that HIDES the wallet bar for admin/tester users — if so, change it so the bar is ALWAYS visible but shows the free access badge instead of top-up buttons for exempt users
4. If the WalletBar is not imported in the quantum chat page at all, add it

## Rules
1. Git backup: git add -A && git commit -m "pre-fix-v2 backup"
2. Actually READ the files before changing them — print them out
3. Fix BOTH problems
4. npm run build — fix ALL errors
5. git add -A && git commit -m "fix: sidebar overflow + wallet bar always visible"
6. git push origin main:master
7. npx vercel --prod
8. ONE run. No stopping.
