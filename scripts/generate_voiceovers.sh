#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="/c/Users/Jixwu/Projects/jarvis/.env"
OUT_DIR="tmp/audio"

API_KEY=$(grep -E "^ELEVENLABS_API_KEY=" "$ENV_FILE" | sed -E 's/^ELEVENLABS_API_KEY=//' | tr -d '"' | tr -d "\r")
VOICE_ID=$(grep -E "^ELEVENLABS_VOICE_ID=" "$ENV_FILE" | sed -E 's/^ELEVENLABS_VOICE_ID=//' | tr -d '"' | tr -d "\r")

if [ -z "$API_KEY" ] || [ -z "$VOICE_ID" ]; then
  echo "ERROR: missing ElevenLabs credentials" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

gen() {
  local outfile="$1"
  local text="$2"
  echo "Generating $outfile ..."
  local body
  body=$(cat <<JSON
{
  "text": "$text",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.3,
    "use_speaker_boost": true
  }
}
JSON
)
  local http_code
  http_code=$(curl -sS -o "$OUT_DIR/$outfile" -w "%{http_code}" \
    -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128" \
    -H "xi-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "$body")
  if [ "$http_code" != "200" ]; then
    echo "ERROR: ElevenLabs returned HTTP $http_code for $outfile" >&2
    cat "$OUT_DIR/$outfile" >&2 || true
    exit 1
  fi
  local size
  size=$(stat -c%s "$OUT_DIR/$outfile" 2>/dev/null || stat -f%z "$OUT_DIR/$outfile")
  if [ "$size" -lt 10240 ]; then
    echo "ERROR: $outfile smaller than 10KB ($size)" >&2
    exit 1
  fi
  echo "  OK: $outfile ($size bytes)"
}

gen "vo_01_welcome.mp3"        "Welcome aboard Voidexa Intergalactic Transit."
gen "vo_02_engage.mp3"         "Engaging warp drive. Destination: Voidexa Star System."
gen "vo_03_arrive.mp3"         "Arriving at Voidexa Star System."
gen "vo_04_welcome_future.mp3" "Welcome to the future of AI."

echo ""
echo "Durations:"
for f in "$OUT_DIR"/vo_*.mp3; do
  dur=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f")
  echo "  $(basename "$f"): ${dur}s"
done
