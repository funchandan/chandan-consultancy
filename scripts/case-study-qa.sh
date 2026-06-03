#!/usr/bin/env bash
# Phase 1 QA gate — exit 1 on failure
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="${1:?Usage: case-study-qa.sh <slug>}"
PKG="${2:-$ROOT/scripts/case-study-packages/${SLUG}.json}"
OUT="$ROOT/_bmad-output/case-studies"
PROMOTED="$ROOT/case-studies/${SLUG}.html"
FAIL=0

warn() { echo "WARN: $*" >&2; }
die() { echo "FAIL: $*" >&2; FAIL=1; }

echo "QA: $SLUG"

# Package feed
if ! python3 "$ROOT/scripts/case-study-feed.py" "$PKG" >/dev/null; then
  die "feeder validation"
fi

# Copy approved
if [[ ! -f "$OUT/${SLUG}-copy-approved.json" ]]; then
  die "missing copy-approved"
fi

# Validation JSON
VAL="$OUT/${SLUG}-validation.json"
if [[ ! -f "$VAL" ]]; then
  die "missing validation.json"
fi
python3 -c "
import json, sys
v=json.load(open('$VAL'))
if not v.get('publish_gate'):
    sys.exit(1)
" || die "publish_gate false in validation"

# Scan word count
WC=$(python3 -c "
import json, sys
sys.path.insert(0, '$ROOT/scripts/lib')
from case_study.copy_compose import load_copy, scan_word_count
c=load_copy('$OUT/${SLUG}-copy-approved.json')
print(scan_word_count(c))
")
if [[ "$WC" -gt 120 ]]; then
  warn "scan word count $WC > 120"
fi

# Promoted HTML checks
HTML="${PROMOTED}"
if [[ -f "$HTML" ]]; then
  if grep -q 'href=".*\.md"' "$HTML"; then
    die "promoted HTML links to .md files"
  fi
  if grep -q 'unsplash.com' "$HTML"; then
    die "placeholder Unsplash in promoted page"
  fi
  if ! grep -q 'youtube-nocookie.com' "$HTML" && grep -q '"youtube"' "$PKG"; then
    warn "package has youtube but promoted HTML has no nocookie embed (ok if no YT in package)"
  fi
  for path in "../styles.css" "../assets/site-nav.js"; do
    if ! grep -q "$path" "$HTML"; then
      die "missing asset path $path in promoted HTML"
    fi
  done
else
  warn "promoted page not found (run publish after approvals)"
fi

# Banned phrases
BANNED='spearheaded|10X|10x|delight theater|passionate about'
COPY="$OUT/${SLUG}-copy-approved.json"
if grep -Eiq "$BANNED" "$COPY"; then
  die "banned phrase in approved copy"
fi

if [[ "$FAIL" -ne 0 ]]; then
  echo "QA FAILED"
  exit 1
fi
echo "QA PASSED"
