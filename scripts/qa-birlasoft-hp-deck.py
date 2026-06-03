#!/usr/bin/env python3
"""QA birlasoft HP deck v2 copy + pptx."""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COPY = ROOT / "_bmad-output/planning-artifacts/birlasoft-hp-field-ai-deck-copy-v2.json"
PPTX = ROOT / "_bmad-output/capabilities/birlasoft-hp-field-ai-v2.pptx"


def main():
    errors = []
    data = json.loads(COPY.read_text())
    slides = data["slides"]
    if len(slides) > 10 or len(slides) < 8:
        errors.append(f"expected 8–10 slides, got {len(slides)}")

    required_layouts = {"purpose", "context", "problem", "method", "release_plan", "impact"}
    for s in slides:
        body = json.dumps(s)
        if body.count("—") > 1:
            errors.append(f"em dash budget exceeded on {s['id']}")
        layout = s.get("layout", "")
        if s["id"] in required_layouts and layout not in required_layouts:
            errors.append(f"unexpected layout {layout} on {s['id']}")
        if s["id"] == "purpose" and len(s.get("bullets", [])) != 3:
            errors.append(f"purpose must have exactly 3 bullets, got {len(s.get('bullets', []))}")
        if s["id"] == "problem" and not s.get("disruption"):
            errors.append("problem missing disruption frame")
        if s["id"] == "solution":
            rels = s.get("releases", [])
            if not rels:
                errors.append("solution missing releases")
            elif not all(r.get("needle") and r.get("rituals") for r in rels):
                errors.append("solution releases need needle + rituals")
        if s["id"] == "context" and not s.get("north_star"):
            errors.append("context missing north_star")
        if s["id"] == "method" and not s.get("framework_name"):
            errors.append("method missing framework_name")

    buzz = ["unified thread", "turnaround compression", "governed"]
    for s in slides:
        for p in s.get("pairs", []):
            ins = p.get("insight", "").lower()
            ev = p.get("evidence", "").lower()
            for b in buzz:
                if b in ins and b not in ev and len(ev) < 40:
                    errors.append(f"buzzword '{b}' in insight without evidence lead on {s['id']}")

    if not PPTX.is_file():
        errors.append(f"missing {PPTX}")
    elif PPTX.stat().st_size > 6 * 1024 * 1024:
        errors.append("pptx exceeds 6 MB")

    if errors:
        print("QA FAIL")
        for e in errors:
            print(" -", e)
        sys.exit(1)
    print("QA PASS — v2 copy + pptx")


if __name__ == "__main__":
    main()
