#!/usr/bin/env python3
"""Promote approved case study to case-studies/{slug}.html"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))

from case_study.asset_validate import validate_wireframe_assets  # noqa: E402
from case_study.copy_compose import load_copy  # noqa: E402
from case_study.package import approvals_ready, feed_package, load_json  # noqa: E402
from case_study.paths import OUT_DIR, PACKAGES_DIR, PROMOTED_DIR  # noqa: E402
from case_study.render import render_scan_page  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("slug")
    parser.add_argument("--package", type=Path)
    parser.add_argument("--force", action="store_true", help="Skip approval gate (preview only)")
    args = parser.parse_args()

    pkg_path = args.package or PACKAGES_DIR / f"{args.slug}.json"
    norm = OUT_DIR / "packages" / f"{args.slug}.json"
    if norm.is_file():
        pkg_path = norm

    pkg = load_json(pkg_path)
    pkg, errors = feed_package(pkg)
    if errors:
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    asset_errors = validate_wireframe_assets(pkg)
    if asset_errors:
        for e in asset_errors:
            print(f"  - {e}", file=sys.stderr)
        print("Publish blocked — fix wireframe assets (see scripts/README-case-study.md).", file=sys.stderr)
        return 1

    ready, missing = approvals_ready(pkg)
    if not ready and not args.force:
        print(f"Publish blocked — approvals missing: {', '.join(missing)}", file=sys.stderr)
        print("  copy: case-study-approve-copy.py", file=sys.stderr)
        print("  design: case-study-approve-design.py", file=sys.stderr)
        print("  po: case-study-approve-po.py", file=sys.stderr)
        return 1

    approved_copy = OUT_DIR / f"{args.slug}-copy-approved.json"
    if not approved_copy.is_file():
        print(f"Missing {approved_copy}", file=sys.stderr)
        return 1

    from case_study.copy_compose import _artefact_index, _artefact_src, compose_copy_draft
    from case_study.copy_rules import sanitize_copy_tree

    # Merge approved copy with fresh artefact paths for promoted asset prefix
    fresh = compose_copy_draft(pkg, asset_prefix="..")
    artefact_index = _artefact_index(pkg)
    copy = load_copy(approved_copy)
    if fresh.get("hero_bg"):
        copy["hero_bg"] = fresh["hero_bg"]
    if fresh.get("hero_facts"):
        copy["hero_facts"] = fresh["hero_facts"]
    # Merge approved copy with fresh compose output (artefacts, narrative, beats).
    if fresh.get("hero_ab"):
        copy["hero_ab"] = fresh["hero_ab"]
    if fresh.get("hero_ticker"):
        copy["hero_ticker"] = fresh["hero_ticker"]
    if fresh.get("hero_deck") is not None:
        copy["hero_deck"] = fresh["hero_deck"]
    # Keep Paige-approved meta description; compose defaults are slug-incomplete.
    if fresh.get("project_context"):
        fpc = fresh["project_context"]
        pc = copy.setdefault("project_context", {})
        if fpc.get("product"):
            pc["product"] = fpc["product"]
        if fpc.get("narrative"):
            pc["narrative"] = fpc["narrative"]
        if fpc.get("impact"):
            pc["impact"] = fpc["impact"]
        if fpc.get("details"):
            pc["details"] = fpc["details"]
    scan = copy.setdefault("scan", {})
    fresh_scan = fresh.get("scan") or {}
    if fresh_scan.get("exec_blocks"):
        scan["exec_blocks"] = fresh_scan["exec_blocks"]
    if fresh_scan.get("exec_summary"):
        scan["exec_summary"] = fresh_scan["exec_summary"]
    fresh_beats = (fresh.get("scan") or {}).get("beats") or []
    fresh_by_aid = {
        b["artefact_id"]: b
        for b in fresh_beats
        if b.get("artefact_id")
    }
    for i, beat in enumerate(copy.get("scan", {}).get("beats") or []):
        aid = beat.get("artefact_id")
        fresh_beat = fresh_by_aid.get(aid) if aid else None
        if fresh_beat is None and i < len(fresh_beats):
            fresh_beat = fresh_beats[i]
        if not fresh_beat:
            continue
        beat["artefact"] = fresh_beat.get("artefact", {})
        if fresh_beat.get("gallery_image"):
            beat["gallery_image"] = fresh_beat["gallery_image"]
            gi = fresh_beat["gallery_image"]
            if gi.get("src"):
                beat.setdefault("artefact", {})["image_src"] = gi["src"]
                beat["artefact"]["image_alt"] = gi.get(
                    "alt", beat["artefact"].get("image_alt", "")
                )
        # Keep Paige-approved narrative from copy-approved.json; refresh assets only.
        if fresh_beat.get("artefact_crop") is not None:
            beat["artefact_crop"] = fresh_beat["artefact_crop"]
        # Keep Paige-approved narrative from copy-approved.json; refresh assets only.
    slug = pkg["meta"]["slug"]
    for beat in copy.get("scan", {}).get("beats") or []:
        aid = beat.get("artefact_id")
        art = artefact_index.get(aid or "")
        if not art:
            continue
        image_src = _artefact_src(slug, art, "..")
        if not image_src:
            continue
        alt = art.get("alt") or beat.get("title", "")
        beat.setdefault("artefact", {})
        beat["artefact"].update(
            {
                "id": aid,
                "kind": art.get("kind", "ui_screen"),
                "image_src": image_src,
                "image_alt": alt,
                "caption": art.get("caption") or art.get("description", ""),
            }
        )
        beat["gallery_image"] = {
            "src": image_src,
            "alt": alt,
            "variant": "portrait",
        }
    copy = sanitize_copy_tree(copy)
    html = render_scan_page(pkg, copy, asset_prefix="..", promoted=True)
    PROMOTED_DIR.mkdir(parents=True, exist_ok=True)
    dest = PROMOTED_DIR / f"{args.slug}.html"
    dest.write_text(html, encoding="utf-8")
    print(f"Published → {dest.relative_to(ROOT)}")
    pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
