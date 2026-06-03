#!/usr/bin/env python3
"""Smart-crop folderX screenshots into case-study regenerated PNGs (1200px max edge)."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "points-marketplace-foundational"
INBOX = Path.home() / "Desktop" / "folderX"
DEST = ROOT / "assets" / "case-studies" / SLUG / "regenerated"
MAX_EDGE = 1200

# source filename in folderX → output + crop (x, y, w, h) in source pixels
CROPS: list[dict] = [
    {
        "source": "Screenshot 2026-05-18 at 12.47.25\u202fAM.png",
        "output": "hero-desktop.png",
        "beat": "Hero · app collage strip (landscape)",
        "box": (0, 0, 794, 502),
        "max_edge": 1040,
    },
    {
        "source": "Screenshot 2026-05-18 at 12.47.13\u202fAM.png",
        "output": "hero-mobile.png",
        "beat": "Hero · live classes phone",
        "box": (70, 100, 362, 680),
        "max_edge": 1600,
    },
    {
        "source": "Screenshot 2026-05-18 at 12.47.13\u202fAM.png",
        "output": "marketplace-prototype.png",
        "beat": "A1 Objective · Live Classes UI",
        "box": (70, 100, 362, 680),
    },
    {
        "source": "Screenshot 2026-05-18 at 12.48.02\u202fAM.png",
        "output": "synthesis-trends.png",
        "beat": "A2 Problem · performance tracking",
        "box": (32, 88, 400, 720),
    },
    {
        "source": "Screenshot 2026-05-18 at 12.47.25\u202fAM.png",
        "output": "design-stimulus-figma.png",
        "beat": "A3 Role · course / package UI",
        "box": (168, 318, 168, 310),
    },
    {
        "source": "Screenshot 2026-05-18 at 12.47.25\u202fAM.png",
        "output": "onboarding-recommendations.png",
        "beat": "A4 Recommendations · onboarding",
        "box": (168, 12, 168, 290),
    },
    {
        "source": "Screenshot 2026-05-18 at 12.47.25\u202fAM.png",
        "output": "user-testing-stimulus.png",
        "beat": "A5 User testing · profile / points",
        "box": (488, 318, 290, 310),
    },
]


def _find_source(inbox: Path, name: str) -> Path | None:
    exact = inbox / name
    if exact.is_file():
        return exact
    stem = name.replace("\u202f", " ").rsplit(".", 1)[0]
    for p in inbox.iterdir():
        if p.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        if p.name.replace("\u202f", " ") == name.replace("\u202f", " "):
            return p
        if stem in p.name.replace("\u202f", " "):
            return p
    return None


def crop_and_export(
    src: Path, dest: Path, box: tuple[int, int, int, int], *, max_edge: int = MAX_EDGE
) -> None:
    x, y, w, h = box
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.parent / f".{dest.stem}-crop.png"
    subprocess.run(
        ["sips", "-c", str(h), str(w), "--cropOffset", str(y), str(x), str(src), "--out", str(tmp)],
        check=True,
        capture_output=True,
    )
    subprocess.run(
        ["sips", "-Z", str(max_edge), str(tmp), "--out", str(dest)],
        check=True,
        capture_output=True,
    )
    tmp.unlink(missing_ok=True)


def main() -> int:
    if not INBOX.is_dir():
        print(f"Inbox not found: {INBOX}", file=sys.stderr)
        return 1

    print(f"Smart crop: {INBOX} → {DEST.relative_to(ROOT)}/")
    for spec in CROPS:
        src = _find_source(INBOX, spec["source"])
        if not src:
            print(f"  - missing {spec['source']}", file=sys.stderr)
            return 1
        dest = DEST / spec["output"]
        print(f"  {spec['beat']}")
        print(f"    {src.name} → {dest.name}")
        crop_and_export(src, dest, tuple(spec["box"]), max_edge=int(spec.get("max_edge", MAX_EDGE)))

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
