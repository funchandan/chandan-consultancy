#!/usr/bin/env python3
"""Promote copy-draft → copy-approved (Paige gate)."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "_bmad-output" / "case-studies"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("slug", help="Case slug, e.g. points-marketplace-foundational")
    parser.add_argument("--by", required=True, help="Approver name")
    args = parser.parse_args()

    draft = OUT / f"{args.slug}-copy-draft.json"
    approved = OUT / f"{args.slug}-copy-approved.json"
    if not draft.is_file():
        print(f"Missing {draft}", file=sys.stderr)
        return 1

    shutil.copy2(draft, approved)
    data = json.loads(approved.read_text(encoding="utf-8"))
    data["approval"] = {
        "status": "approved",
        "approved_by": args.by,
        "approved_at": datetime.now(timezone.utc).isoformat(),
    }
    approved.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

    sys.path.insert(0, str(ROOT / "scripts" / "lib"))
    from case_study.paths import OUT_DIR, PACKAGES_DIR  # noqa: E402
    from case_study.package import load_json  # noqa: E402

    for pkg_path in (
        PACKAGES_DIR / f"{args.slug}.json",
        OUT_DIR / "packages" / f"{args.slug}.json",
    ):
        if pkg_path.is_file():
            pkg = load_json(pkg_path)
            pkg.setdefault("approvals", {}).setdefault("copy", {})
            pkg["approvals"]["copy"] = {
                "status": "approved",
                "approved_by": args.by,
                "approved_at": data["approval"]["approved_at"],
            }
            pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")

    print(f"Approved → {approved.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
