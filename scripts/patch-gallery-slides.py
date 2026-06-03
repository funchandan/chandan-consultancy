#!/usr/bin/env python3
"""Splice regenerated gallery slides into promoted case study HTML."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))

from case_study.copy_compose import compose_copy_draft, load_copy  # noqa: E402
from case_study.package import load_json  # noqa: E402
from case_study.paths import OUT_DIR, PACKAGES_DIR, PROMOTED_DIR  # noqa: E402
from case_study.render import render_card_slide_html  # noqa: E402

TRACK_OPEN = '<div class="case-card-gallery__track" data-case-card-track>'


def merge_beats(copy: dict, pkg: dict) -> dict:
    fresh = compose_copy_draft(pkg, asset_prefix="..")
    for i, beat in enumerate(copy.get("scan", {}).get("beats") or []):
        if i >= len((fresh.get("scan") or {}).get("beats") or []):
            break
        fresh_beat = fresh["scan"]["beats"][i]
        beat["artefact"] = fresh_beat.get("artefact", beat.get("artefact", {}))
        if fresh_beat.get("gallery_image"):
            beat["gallery_image"] = fresh_beat["gallery_image"]
            gi = fresh_beat["gallery_image"]
            if gi.get("src"):
                beat.setdefault("artefact", {})["image_src"] = gi["src"]
                beat["artefact"]["image_alt"] = gi.get(
                    "alt", beat["artefact"].get("image_alt", "")
                )
    return copy


def patch_html(slug: str) -> None:
    pkg_path = OUT_DIR / "packages" / f"{slug}.json"
    if not pkg_path.is_file():
        pkg_path = PACKAGES_DIR / f"{slug}.json"
    pkg = load_json(pkg_path)
    copy = load_copy(OUT_DIR / f"{slug}-copy-approved.json")
    # Use approved copy only — do not overwrite gallery assets from compose.
    beats = (copy.get("scan") or {}).get("beats") or []
    slides = "".join(render_card_slide_html(b, i) for i, b in enumerate(beats))

    html_path = PROMOTED_DIR / f"{slug}.html"
    html = html_path.read_text(encoding="utf-8")
    start = html.find(TRACK_OPEN)
    if start < 0:
        raise SystemExit(f"Track not found in {html_path}")
    content_start = start + len(TRACK_OPEN)
    last_article = html.rfind("</article>", 0, html.find("</section>", start))
    if last_article < 0:
        raise SystemExit(f"No slides in gallery for {slug}")
    content_end = last_article + len("</article>")
    new_html = html[:content_start] + "\n" + slides + html[content_end:]
    html_path.write_text(new_html, encoding="utf-8")
    print(f"Patched {html_path.relative_to(ROOT)} ({len(beats)} slides)")


def main() -> int:
    slugs = sys.argv[1:] or [
        "points-marketplace-foundational",
        "hp-field-service-ai",
    ]
    for slug in slugs:
        patch_html(slug)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
