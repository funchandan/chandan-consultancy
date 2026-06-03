#!/usr/bin/env python3
"""L0 Feeder — validate and normalize case-package JSON."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))

from case_study.package import feed_package, load_json  # noqa: E402
from case_study.paths import OUT_DIR, PACKAGES_DIR  # noqa: E402


def extract_pdf_stub(pdf_path: Path) -> int:
    print(f"PDF extract: use .venv-pdf + pypdf for {pdf_path}", file=sys.stderr)
    print("  Hint: pages 5–6 = Points marketplace foundational study in UXR portfolio", file=sys.stderr)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Case study package feeder")
    parser.add_argument("package", type=Path, help="Path to case-package JSON")
    parser.add_argument("--write", action="store_true", help="Write normalized package back to file")
    parser.add_argument(
        "--out",
        type=Path,
        help="Write normalized package to _bmad-output/case-studies/packages/",
    )
    parser.add_argument("--pdf", type=Path, help="Optional PDF path (extract hook / stub)")
    args = parser.parse_args()

    if args.pdf:
        extract_pdf_stub(args.pdf)

    pkg = load_json(args.package.resolve())
    pkg, errors = feed_package(pkg)

    if errors:
        print("Feeder FAILED:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    slug = pkg["meta"]["slug"]
    print(f"OK: {slug}")
    print(f"  study_type: {pkg['meta'].get('study_type')} (confidence {pkg['meta'].get('study_type_confidence')})")
    yt = (pkg.get("media") or {}).get("youtube") or []
    for entry in yt:
        print(f"  youtube {entry.get('id')}: {entry.get('video_id')} → {entry.get('placement')}")

    if args.write:
        args.package.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {args.package}")

    if args.out:
        dest = args.out
    else:
        dest = OUT_DIR / "packages" / f"{slug}.json"

    if dest:
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
        print(f"Normalized → {dest.relative_to(ROOT)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
