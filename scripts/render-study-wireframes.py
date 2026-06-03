#!/usr/bin/env python3
"""Render wireframes-src/*.svg to regenerated/*.png (1200px) via macOS qlmanage."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "points-marketplace-foundational"
SRC = ROOT / "assets" / "case-studies" / SLUG / "wireframes-src"
DEST = ROOT / "assets" / "case-studies" / SLUG / "regenerated"
SIZE = 1200
HEIGHT = 960

OUTPUTS = [
    "marketplace-prototype.png",
    "synthesis-trends.png",
    "design-stimulus-figma.png",
    "user-testing-stimulus.png",
    "onboarding-recommendations.png",
]


def render_svg(svg: Path, png: Path) -> None:
    png.parent.mkdir(parents=True, exist_ok=True)
    tmp = png.parent / f".{png.stem}.tmp.png"
    if tmp.exists():
        tmp.unlink()
    result = subprocess.run(
        ["qlmanage", "-t", "-s", str(SIZE), "-o", str(png.parent), str(svg)],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(result.stderr, file=sys.stderr)
        raise RuntimeError(f"qlmanage failed for {svg.name}")

    generated = png.parent / f"{svg.name}.png"
    if not generated.is_file():
        raise FileNotFoundError(f"Expected {generated} from qlmanage")
    generated.replace(png)
    subprocess.run(
        ["sips", "-z", str(HEIGHT), str(SIZE), str(png)],
        capture_output=True,
        check=True,
    )
    print(f"  {svg.name} → {png.relative_to(ROOT)} ({SIZE}×{HEIGHT})")


def main() -> int:
    if not SRC.is_dir():
        print(f"Missing {SRC}", file=sys.stderr)
        return 1

    print(f"Rendering study wireframes ({SIZE}px) → {DEST.relative_to(ROOT)}/")
    for out in OUTPUTS:
        svg = SRC / out.replace(".png", ".svg")
        if not svg.is_file():
            print(f"  - missing {svg}", file=sys.stderr)
            return 1
        render_svg(svg, DEST / out)

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
