#!/bin/bash
# PreToolUse hook — runs before any `git commit` Bash command, gated via the
# hook's own "if": "Bash(git commit *)" filter in settings.json, so this
# script itself doesn't need to inspect the command.
#
# `npm run build` already runs `tsc -b`, which type-checks through the project
# references. (A bare `npx tsc --noEmit` at the root checks nothing here,
# because the root tsconfig.json has "files": [].)
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 1

LOG=$(mktemp)
if npm run build > "$LOG" 2>&1 && npm run lint >> "$LOG" 2>&1; then
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
