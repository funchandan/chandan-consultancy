#!/usr/bin/env bash
# Verify index.html local asset references exist before deploy.
# Usage: ./scripts/check-index-assets.sh [path/to/index.html]
# Set CHECK_GIT=1 to also require paths to be tracked by git.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HTML="${1:-$ROOT/index.html}"
CHECK_GIT="${CHECK_GIT:-0}"

if [[ ! -f "$HTML" ]]; then
  echo "check-index-assets: file not found: $HTML" >&2
  exit 1
fi

refs_file="$(mktemp)"
trap 'rm -f "$refs_file"' EXIT

{
  grep -oE '(href|src)="assets/[^"?#]+' "$HTML" | sed 's/.*="//'
  grep -oE '(src|data-proof-preview-src)="assets/[^"?#]+' "$HTML" | sed 's/.*="//'
  grep -oE 'assets/[a-zA-Z0-9_./-]+\.(png|svg|jpg|jpeg|webp|js|css|json)' "$HTML"
} | sort -u > "$refs_file"

ref_count="$(wc -l < "$refs_file" | tr -d ' ')"
missing_disk=0
missing_git=0

while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  if [[ ! -f "$ROOT/$f" ]]; then
    echo "MISSING (disk): $f"
    missing_disk=$((missing_disk + 1))
    continue
  fi
  if [[ "$CHECK_GIT" == "1" ]] && ! git -C "$ROOT" ls-files --error-unmatch "$f" &>/dev/null; then
    echo "MISSING (git): $f"
    missing_git=$((missing_git + 1))
  fi
done < "$refs_file"

total_missing=$((missing_disk + missing_git))
if [[ "$total_missing" -gt 0 ]]; then
  echo "check-index-assets: $ref_count refs, $total_missing missing" >&2
  exit 1
fi

echo "check-index-assets: OK ($ref_count asset paths)"
