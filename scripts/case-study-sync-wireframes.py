#!/usr/bin/env python3
"""Sync UX wireframes from Desktop/folderX (or any inbox) into case study assets.

Designer drops exports in folderX and edits wireframe-manifest.json to map files
to artefact slots (A1–A4) that match the five-beat narrative.

Example:
  python3 scripts/case-study-sync-wireframes.py \\
    --inbox ~/Desktop/folderX \\
    --slug points-marketplace-foundational \\
    --write
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))

from case_study.package import feed_package, load_json  # noqa: E402
from case_study.paths import ASSETS_DIR, PACKAGES_DIR  # noqa: E402

MANIFEST_NAME = "wireframe-manifest.json"
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"}

# Default narrative map (Points marketplace v3 scan)
DEFAULT_SLOTS = [
    {
        "artefact_id": "A1",
        "output": "marketplace-prototype.png",
        "beats": ["hero", "beat_objective"],
        "kind": "prototype",
        "description": "Marketplace stimulus: profile characters and points wallet",
    },
    {
        "artefact_id": "A2",
        "output": "synthesis-trends.png",
        "beats": ["beat_problem", "beat_insights"],
        "kind": "research_synthesis",
        "description": "Synthesis board: retention and currency themes",
    },
    {
        "artefact_id": "A3",
        "output": "design-stimulus-figma.png",
        "beats": ["beat_role_method"],
        "kind": "prototype",
        "description": "Figma design-system-aligned stimulus",
    },
    {
        "artefact_id": "A4",
        "output": "onboarding-recommendations.png",
        "beats": ["beat_recommendations"],
        "kind": "flow",
        "description": "Onboarding and ship path frames",
    },
]


def _convert_to_png(src: Path, dest: Path) -> None:
    if src.suffix.lower() == ".png" and src.resolve() != dest.resolve():
        shutil.copy2(src, dest)
        return
    # macOS sips converts avif, jpg, webp to png
    dest.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        ["sips", "-s", "format", "png", str(src), "--out", str(dest)],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        shutil.copy2(src, dest.with_suffix(src.suffix))
        print(f"  WARN: sips failed for {src.name}; copied as-is", file=sys.stderr)


def _load_manifest(inbox: Path, slug: str) -> dict:
    path = inbox / MANIFEST_NAME
    if path.is_file():
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("case_slug") and data["case_slug"] != slug:
            print(f"  WARN: manifest case_slug is {data['case_slug']}, using CLI slug {slug}")
        return data
    return {"case_slug": slug, "inbox": str(inbox), "slots": DEFAULT_SLOTS}


def _resolve_source(inbox: Path, slot: dict) -> Path | None:
    source = slot.get("source")
    if source:
        candidate = inbox / source
        if candidate.is_file():
            return candidate
        print(f"  - {slot.get('artefact_id')}: missing source {source}", file=sys.stderr)
        return None
    # Auto-pick: only file in inbox matching output stem, or first unused image
    output_stem = Path(slot.get("output", "")).stem
    for p in sorted(inbox.iterdir()):
        if p.name.startswith(".") or p.name == MANIFEST_NAME:
            continue
        if p.suffix.lower() not in IMAGE_EXTS:
            continue
        if p.stem.lower().replace(" ", "-") == output_stem.replace("_", "-"):
            return p
    return None


def sync_inbox(
    inbox: Path,
    slug: str,
    *,
    write_package: bool = False,
    dry_run: bool = False,
) -> int:
    if not inbox.is_dir():
        print(f"Inbox not found: {inbox}", file=sys.stderr)
        return 1

    manifest = _load_manifest(inbox, slug)
    slots = manifest.get("slots") or DEFAULT_SLOTS
    assets_dir = ASSETS_DIR / slug / "regenerated"
    reference_dir = ASSETS_DIR / slug / "reference"
    pkg_path = PACKAGES_DIR / f"{slug}.json"

    if not pkg_path.is_file():
        print(f"Package not found: {pkg_path}", file=sys.stderr)
        return 1

    pkg = load_json(pkg_path)
    artefacts = {a["id"]: a for a in pkg.get("artefacts") or []}
    synced = 0

    print(f"Sync wireframes: {inbox} → {assets_dir.relative_to(ROOT)}")
    print(f"  Reference originals stay in {reference_dir.relative_to(ROOT)}/")

    for slot in slots:
        aid = slot.get("artefact_id")
        output = slot.get("output")
        if not aid or not output:
            print("  - skip slot: needs artefact_id and output", file=sys.stderr)
            continue

        src = _resolve_source(inbox, slot)
        if not src:
            print(f"  - {aid}: no source (set \"source\" in {MANIFEST_NAME})", file=sys.stderr)
            continue

        dest = assets_dir / output
        beats = ", ".join(slot.get("beats") or [])
        print(f"  {aid} ← {src.name} → {dest.name}  [{beats}]")

        if dry_run:
            synced += 1
            continue

        _convert_to_png(src, dest)

        art = artefacts.get(aid)
        if art:
            art["path"] = f"regenerated/{output}"
            if slot.get("kind"):
                art["kind"] = slot["kind"]
            if slot.get("description"):
                art["description"] = slot["description"]
            if slot.get("caption"):
                art["caption"] = slot["caption"]
        synced += 1

    if synced == 0:
        print("Nothing synced. Add files and wireframe-manifest.json to folderX.", file=sys.stderr)
        return 1

    if dry_run:
        print(f"Dry run: {synced} slot(s) would sync.")
        return 0

    pkg["meta"]["wireframe_inbox"] = str(inbox)
    pkg["meta"]["artefact_set"] = "regenerated"
    pkg["artefacts"] = list(artefacts.values())

    pkg, errors = feed_package(pkg)
    if errors:
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    if write_package:
        pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
        print(f"Updated {pkg_path.relative_to(ROOT)}")

    print(f"Synced {synced} artefact(s). Next:")
    print("  python3 scripts/case-study-generate.py", pkg_path, "--draft")
    print("  python3 scripts/case-study-approve-copy.py", slug, '--by "Sally"')
    print("  python3 scripts/case-study-publish.py", slug)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync folderX wireframes into case study assets")
    parser.add_argument(
        "--inbox",
        type=Path,
        default=Path.home() / "Desktop" / "folderX",
        help="Designer inbox folder (default: ~/Desktop/folderX)",
    )
    parser.add_argument("--slug", default="points-marketplace-foundational")
    parser.add_argument("--write", action="store_true", help="Write updated package JSON")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--init-manifest",
        action="store_true",
        help=f"Write default {MANIFEST_NAME} into inbox if missing",
    )
    args = parser.parse_args()
    inbox = args.inbox.expanduser().resolve()

    if args.init_manifest:
        inbox.mkdir(parents=True, exist_ok=True)
        dest = inbox / MANIFEST_NAME
        if dest.is_file():
            print(f"Already exists: {dest}")
        else:
            data = {
                "case_slug": args.slug,
                "notes": "Set source to each filename in this folder. Re-run sync after exports change.",
                "slots": [
                    {
                        **slot,
                        "source": "",
                        "caption": "",
                    }
                    for slot in DEFAULT_SLOTS
                ],
            }
            dest.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
            print(f"Wrote {dest}")
        return 0

    return sync_inbox(inbox, args.slug, write_package=args.write, dry_run=args.dry_run)


if __name__ == "__main__":
    raise SystemExit(main())
