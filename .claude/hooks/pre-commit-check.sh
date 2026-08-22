#!/bin/bash
# PreToolUse hook — runs before any `git commit` Bash command, gated via the
# hook's own "if": "Bash(git commit *)" filter in settings.json, so this
# script itself doesn't need to inspect the command.
cd /Users/ola23101/amk-consulting-hub || exit 1

LOG=$(mktemp)
if npx tsc --noEmit > "$LOG" 2>&1 && npm run build >> "$LOG" 2>&1 && npm run lint >> "$LOG" 2>&1; then
  echo '{}'
else
  python3 -c "
import json
with open('$LOG') as f:
    content = f.read()[-2000:]
print(json.dumps({
    'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'permissionDecision': 'deny',
        'permissionDecisionReason': 'Pre-commit check failed (typecheck/build/lint). Last output:\n' + content
    }
}))
"
fi
rm -f "$LOG"
