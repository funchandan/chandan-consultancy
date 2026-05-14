#!/usr/bin/env bash
# Export CV HTML variants to PDF via Chrome headless (macOS default install path).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$ROOT/cv/pdf"
mkdir -p "$OUT"

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at: $CHROME" >&2
  echo "Use Chrome → Print → Save as PDF on each cv/cv-*.html file instead." >&2
  exit 1
fi

export_to_pdf() {
  local name="$1"
  local url="file://${ROOT}/cv/${name}.html"
  echo "Printing ${name}.html → pdf/${name}.pdf"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="${OUT}/${name}.pdf" \
    "$url" 2>/dev/null || true
}

export_to_pdf cv-pm
export_to_pdf cv-design
export_to_pdf cv-uxhead

echo "Done. Output: $OUT"
ls -la "$OUT"
