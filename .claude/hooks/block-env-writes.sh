#!/bin/bash
# PreToolUse hook on Write|Edit — blocks direct writes to .env-style files,
# since those hold real secrets (Supabase keys, Stripe keys, the Resend
# API key) and should be edited by hand, not by Claude.
FILE_PATH=$(python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))")
BASENAME=$(basename "$FILE_PATH")

if [[ "$BASENAME" == ".env" || "$BASENAME" == ".env.local" || "$BASENAME" == .env.*.local ]]; then
  python3 -c "
import json
print(json.dumps({
    'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'permissionDecision': 'deny',
        'permissionDecisionReason': 'Blocked: $FILE_PATH looks like a secrets file. Edit it directly yourself rather than through Claude, or adjust this hook in .claude/settings.json if this specific file genuinely needs editing.'
    }
}))
"
else
  echo '{}'
fi
