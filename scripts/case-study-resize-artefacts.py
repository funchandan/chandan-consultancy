#!/usr/bin/env python3
"""Resize case-study PNGs to display-appropriate max dimensions (2x retina)."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "points-marketplace-foundational"
DEST = ROOT / "assets" / "case-studies" / SLUG / "regenerated"

# max width or height (sips -Z uses longest edge)
SIZES: dict[str, int] = {
    "hero-desktop.png": 1040,
    "hero-mobile.png": 840,
    "marketplace-prototype.png": 720,
    "synthesis-trends.png": 720,
    "design-stimulus-figma.png": 720,
    "onboarding-recommendations.png": 720,
    "user-testing-stimulus.png": 960,
}


def resize(path: Path, max_edge: int) -> None:
    w, h = _dimensions(path)
    if max(w, h) <= max_edge:
        print(f"  skip {path.name} ({w}×{h})")
        return
    subprocess.run(["sips", "-Z", str(max_edge), str(path)], check=True, capture_output=True)
    w2, h2 = _dimensions(path)
    print(f"  {path.name}: {w}×{h} → {w2}×{h2}")


def _dimensions(path: Path) -> tuple[int, int]:
    out = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        capture_output=True,
        text=True,
        check=True,
    )
    w = h = 0
    for line in out.stdout.splitlines():
        if "pixelWidth" in line:
            w = int(line.split()[-1])
        if "pixelHeight" in line:
            h = int(line.split()[-1])
    return w, h


def main() -> int:
    if not DEST.is_dir():
        print(f"Missing {DEST}", file=sys.stderr)
        return 1
    print(f"Resize artefacts → max edge per slot ({DEST.name}/)")
    for name, max_edge in SIZES.items():
        path = DEST / name
        if path.is_file():
            resize(path, max_edge)
        else:
            print(f"  - missing {name}", file=sys.stderr)
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
