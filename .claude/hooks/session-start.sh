#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Kill any stale server from a previous session
pkill -f "python3 -m http.server 3000" 2>/dev/null || true

# Start the static file server in the background from the project root.
# Python's http.server serves index.html as the default document.
cd "${CLAUDE_PROJECT_DIR}"
nohup python3 -m http.server 3000 > /tmp/static-server.log 2>&1 &
disown

exit 0
