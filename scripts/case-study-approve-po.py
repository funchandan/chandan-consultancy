#!/usr/bin/env python3
"""Record PO approval on the fed package."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))

from case_study.package import load_json  # noqa: E402
from case_study.paths import OUT_DIR, PACKAGES_DIR  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("slug")
    parser.add_argument("--by", default="Chandan")
    parser.add_argument("--package", type=Path)
    args = parser.parse_args()

    pkg_path = args.package or PACKAGES_DIR / f"{args.slug}.json"
    norm = OUT_DIR / "packages" / f"{args.slug}.json"
    path = norm if norm.is_file() else pkg_path
    if not path.is_file():
        print(f"Missing package {path}", file=sys.stderr)
        return 1

    pkg = load_json(path)
    pkg.setdefault("approvals", {}).setdefault("po", {})
    pkg["approvals"]["po"] = {
        "status": "approved",
        "approved_by": args.by,
        "approved_at": datetime.now(timezone.utc).isoformat(),
    }
    path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
    print(f"PO approved on {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
