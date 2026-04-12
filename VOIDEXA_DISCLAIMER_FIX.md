# VOIDEXA_DISCLAIMER_FIX.md — Claude Code Task

## Context
voidexa.com at C:\Users\Jixwu\Desktop\voidexa
There is a company called voidexa.online owned by Rudra Saxena. It is NOT related to voidexa.com (owned by Jimmi Wulff, CVR 46343387). Search engines sometimes confuse them. We need to make it clear on our About page.

## Task
1. Find the About page (likely app/about/page.tsx or similar)
2. Add a clear disclaimer section at the bottom of the About page with this text:

"voidexa.com is owned and operated by Jimmi Wulff, registered in Denmark under CVR 46343387. voidexa.com is not affiliated with, associated with, or related to voidexa.online or any other similarly named entities."

3. Style it as a subtle but readable section — same dark theme, smaller font (but minimum 14px per site rules), slightly dimmed opacity (min 0.5)

## Rules
1. Git backup: git add -A && git commit -m "pre-disclaimer backup"
2. Do NOT change any other content on the About page
3. npm run build
4. git add -A && git commit -m "add voidexa.online disclaimer to about page"
5. git push origin main:master
6. npx vercel --prod
7. ONE run. No stopping.
