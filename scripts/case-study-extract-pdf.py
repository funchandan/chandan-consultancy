#!/usr/bin/env python3
"""Extract wireframe images from portfolio PDF into case study assets folder."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("slug", help="Case slug, e.g. points-marketplace-foundational")
    parser.add_argument("--pages", default="5,6", help="1-based page numbers, comma-separated")
    args = parser.parse_args()

    try:
        import fitz
    except ImportError:
        print("Install pymupdf: .venv-pdf/bin/pip install pymupdf", file=sys.stderr)
        return 1

    out = ROOT / "assets" / "case-studies" / args.slug
    out.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(args.pdf)
    pages = [int(p) - 1 for p in args.pages.split(",")]

    mapping = {
        4: [("marketplace-prototype.png", 0), ("design-stimulus-figma.png", 1)],
        5: [("synthesis-trends.png", 0), ("onboarding-recommendations.png", 1)],
    }

    for pno in pages:
        page = doc[pno]
        imgs = page.get_images(full=True)
        for fname, idx in mapping.get(pno, []):
            if idx >= len(imgs):
                continue
            xref = imgs[idx][0]
            base = doc.extract_image(xref)
            dest = out / fname
            dest.write_bytes(base["image"])
            print(f"Wrote {dest.relative_to(ROOT)} ({base['width']}x{base['height']})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
