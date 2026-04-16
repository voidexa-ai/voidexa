# JARVIS WHISPER NOTEBOOK — Quick Spec
## Voice-to-text idea capture for Jix
## Priority: High (ADHD workflow essential tool)

---

## WHAT IT IS

A single-button voice recorder that transcribes your ideas via Whisper and saves them to a running notebook file. Press button → speak → release → idea is saved with timestamp. No commands executed. No AI response. Just capture.

---

## WHY

Jix has ADHD. Ideas come mid-session, mid-walk, mid-anything. Currently the only way to save them is typing into a chat — which breaks flow and pollutes the conversation with off-topic notes. A dedicated notebook means:

- Ideas never lost
- Chat stays on-topic
- Batch-review later: paste all notes into a new Claude session with full context

---

## HOW IT WORKS

```
[Jix presses hotkey or tray icon button]
  → Microphone activates (visual indicator: red dot in system tray)
  → Jix speaks freely
  → [Jix releases button or presses again to stop]
  → Whisper transcribes audio
  → Timestamped entry appended to notebook file
  → Small toast notification: "Idea saved ✓"
  → Back to whatever Jix was doing
```

Total interaction time: 3-15 seconds per idea.

---

## OUTPUT FORMAT

File: `C:\Users\Jixwu\Documents\whisper-notebook.md`

```markdown
# Whisper Notebook

## 2026-04-17 03:42
I was thinking about making the holographic map interactive so you can place waypoints on it

## 2026-04-17 03:58
Remember to ask Tom about the refactor of the big files in voidexa

## 2026-04-17 04:15
Quantum Forge should maybe have a free trial where the debate part is free but building costs GHAI

## 2026-04-17 04:22
The Hive should have seasonal events where new tunnels open up for a limited time
```

Each entry: timestamp header + transcribed text. Nothing else. Raw thoughts.

---

## IMPLEMENTATION

### Option A — Add to existing Jarvis Voice Commander (recommended)

Jarvis already has Whisper, hotkey (M720→Ctrl+Shift+J), and a command router. Add one new mode:

```python
# In voice_commander/commander.py — add notebook mode

NOTEBOOK_PATH = r"C:\Users\Jixwu\Documents\whisper-notebook.md"
NOTEBOOK_HOTKEY = "ctrl+shift+n"  # Separate from Jarvis command hotkey

def notebook_mode():
    """Record voice, transcribe, append to notebook file."""
    audio = record_until_release()
    text = whisper_transcribe(audio)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    with open(NOTEBOOK_PATH, "a", encoding="utf-8") as f:
        f.write(f"\n## {timestamp}\n{text}\n")
    
    show_toast("Idea saved ✓")
```

That's it. ~15 lines of new code in the existing Jarvis codebase.

### Hotkey
- **Ctrl+Shift+N** for notebook (separate from Ctrl+Shift+J for Jarvis commands)
- Or: dedicate a mouse button on the M720 (Jix already has M720 mapped)
- Or: system tray icon with record button

### Dependencies
Already installed in Jarvis:
- Whisper (local, via Jarvis existing setup)
- pyautogui (for hotkey)
- System tray (if using pystray, already in Jarvis deps)

### New dependency: none

---

## CLAUDE CODE COMMAND

**Box 1:**
```powershell
cd C:\Users\Jixwu\Projects\jarvis; claude --dangerously-skip-permissions
```

**Box 2:**
```
Add a Whisper Notebook mode to Voice Commander.

Requirements:
- New hotkey: Ctrl+Shift+N triggers notebook recording
- Record audio until hotkey pressed again (toggle) or until 30 seconds max
- Transcribe with existing Whisper setup (same model as Voice Commander uses)
- Append to C:\Users\Jixwu\Documents\whisper-notebook.md with format:
  ## YYYY-MM-DD HH:MM
  [transcribed text]
- Show Windows toast notification "Idea saved ✓" after append
- If notebook file doesn't exist, create it with "# Whisper Notebook" header
- Do NOT change any existing Voice Commander functionality
- Do NOT change the Jarvis command hotkey (Ctrl+Shift+J)
- Keep the notebook function under 50 lines total

FILE SIZE RULE: No file over 300 lines. If commander.py is already large, put notebook logic in a new file voice_commander/notebook.py and import it.

Commit: "feat(jarvis): add Whisper Notebook — voice-to-text idea capture (Ctrl+Shift+N)"
Do not push (Jarvis repo may not have remote configured).

Report: files changed, line count, test status.
```

---

## BATCH REVIEW WORKFLOW

When Jix has collected enough ideas (daily, weekly, whenever):

1. Open `whisper-notebook.md`
2. Copy all entries
3. Paste into new Claude chat: "Here are my ideas from this week. Organize them by project and tell me which ones are actionable."
4. Claude sorts, groups, and recommends
5. Clear the notebook or archive it

---

## FUTURE ENHANCEMENTS (not now)

- Auto-tag by project (if Jix says "voidexa" or "quantum" or "jarvis", tag the entry)
- Supabase sync (notebook entries stored in cloud, accessible from phone)
- Phone companion (press button on phone → Whisper on phone → syncs to same notebook)
- Integration with Claude memory (auto-update memory edits from notebook entries)

---

## STATUS

- Spec: done (this file)
- Build: not started
- Priority: high — solves a daily ADHD friction point
- Effort: ~15 min Claude Code build
- Dependencies: none new (all in Jarvis already)
