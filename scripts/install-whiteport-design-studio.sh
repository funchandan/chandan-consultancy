#!/usr/bin/env bash
# Install Whiteport Design Studio into this project (Cursor + _bmad/wds).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/_bmad/wds-source"
REPO="https://github.com/whiteport-collective/whiteport-design-studio.git"

if [[ ! -d "$SOURCE/.git" ]]; then
  echo "Cloning WDS → _bmad/wds-source"
  mkdir -p "$ROOT/_bmad"
  git clone --depth 1 "$REPO" "$SOURCE"
fi

echo "Installing npm dependencies in wds-source…"
(cd "$SOURCE" && npm install --ignore-scripts)

echo "Running processed install → _bmad/wds + .cursor/rules/wds …"
node "$ROOT/scripts/install-whiteport-design-studio.mjs"

echo "Done. Cursor agents: .cursor/rules/wds/ (saga, freya, mimir)"
