#!/usr/bin/env python3
"""
Case study generator — Phase 1.
  --draft   write copy-draft + preview scan (package copy optional)
  default   require copy-approved.json for scan; always write longform + validation
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))

from case_study.copy_compose import compose_copy_draft, load_copy, scan_word_count  # noqa: E402
from case_study.longform import generate_longform_md  # noqa: E402
from case_study.package import feed_package, load_json, validate_narrative  # noqa: E402
from case_study.paths import OUT_DIR  # noqa: E402
from case_study.render import render_scan_page  # noqa: E402


def paths_for_slug(slug: str) -> dict[str, Path]:
    base = OUT_DIR
    return {
        "draft": base / f"{slug}-copy-draft.json",
        "approved": base / f"{slug}-copy-approved.json",
        "scan_preview": base / f"{slug}-scan-preview.html",
        "scan": base / f"{slug}-scan.html",
        "longform": base / f"{slug}-longform.md",
        "validation": base / f"{slug}-validation.json",
    }


def resolve_copy(slug: str, *, draft_mode: bool, use_draft: bool) -> tuple[dict, str]:
    p = paths_for_slug(slug)
    if draft_mode:
        return load_copy(p["draft"]), "draft"
    if p["approved"].is_file():
        return load_copy(p["approved"]), "approved"
    if use_draft and p["draft"].is_file():
        return load_copy(p["draft"]), "draft-fallback"
    raise FileNotFoundError(
        f"Missing {p['approved'].name}. Run: python3 scripts/case-study-generate.py <pkg> --draft\n"
        f"Then approve: python3 scripts/case-study-approve-copy.py {slug} --by 'Paige'"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("package", type=Path)
    parser.add_argument("--draft", action="store_true", help="Generate copy-draft + preview only")
    parser.add_argument("--use-draft", action="store_true", help="Allow draft copy for scan when approved missing")
    args = parser.parse_args()

    pkg_path = args.package.resolve()
    pkg = load_json(pkg_path)
    pkg, errors = feed_package(pkg)
    if errors:
        print("Package errors:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    slug = pkg["meta"]["slug"]
    validation = validate_narrative(pkg)
    paths = paths_for_slug(slug)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if args.draft:
        copy = compose_copy_draft(pkg, asset_prefix="../..")
        paths["draft"].write_text(json.dumps(copy, indent=2) + "\n", encoding="utf-8")
        preview = render_scan_page(pkg, copy, asset_prefix="../..", promoted=False)
        paths["scan_preview"].write_text(preview, encoding="utf-8")
        wc = scan_word_count(copy)
        print(f"Wrote {paths['draft'].relative_to(ROOT)}")
        print(f"Wrote {paths['scan_preview'].relative_to(ROOT)} (scan words: {wc})")
        if wc > 120:
            print(f"  WARN: scan copy {wc} words exceeds 120 budget", file=sys.stderr)
    else:
        try:
            copy, source = resolve_copy(slug, draft_mode=False, use_draft=args.use_draft)
        except FileNotFoundError as exc:
            print(exc, file=sys.stderr)
            return 1
        scan_html = render_scan_page(pkg, copy, asset_prefix="../..", promoted=False)
        paths["scan"].write_text(scan_html, encoding="utf-8")
        print(f"Wrote {paths['scan'].relative_to(ROOT)} (copy: {source})")

    wc = None
    if args.draft:
        wc = scan_word_count(copy)
    elif paths["approved"].is_file():
        wc = scan_word_count(load_copy(paths["approved"]))

    paths["longform"].write_text(generate_longform_md(pkg, validation), encoding="utf-8")
    paths["validation"].write_text(
        json.dumps(
            {
                "slug": slug,
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "source": str(pkg_path.relative_to(ROOT)),
                "study_type": pkg["meta"].get("study_type"),
                "claims": validation,
                "publish_gate": all(r["status"] in ("pass", "weak") for r in validation),
                "scan_word_count": wc,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {paths['longform'].relative_to(ROOT)}")
    print(f"Wrote {paths['validation'].relative_to(ROOT)}")
    for row in validation:
        print(f"  {row['claim_id']}: {row['status']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
