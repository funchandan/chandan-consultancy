#!/usr/bin/env python3
"""Create empty research + evidence stubs for Birlasoft HP Field AI v2 (run after PRD approval)."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "_bmad-output/planning-artifacts"

STUBS = {
    "birlasoft-hp-field-ai-research-market-v1.md": """# Market research — Birlasoft HP Field AI (v1)

**Owner:** Mary · **Status:** DRAFT · **Blocks:** Paige deck copy v2

## Field service & mobility (citations required)

**Evidence:**

**Insight:**

## Form-heavy enterprise apps

**Evidence:**

**Insight:**

## Conversational / agentic UI in operations

**Evidence:**

**Insight:**

## Implications for Birlasoft replication

1.
2.
3.

## Sources

| ID | Source | Date accessed |
|----|--------|---------------|
""",
    "birlasoft-hp-field-ai-research-technical-v1.md": """# Technical research — Birlasoft HP Field AI (v1)

**Owner:** Mary · **Status:** DRAFT

## Forms vs conversation (task-fit table)

| Task type | Prefer forms | Prefer conversation |
|-----------|--------------|---------------------|
| | | |

**Evidence:**

**Insight:**

## Context carry-over (diagnosis → parts)

**Evidence:**

**Insight:**

## Offline / partial state

**Evidence:**

**Insight:**

## Explainability, override, audit

**Evidence:**

**Insight:**

## Replication prerequisites (Birlasoft)

**Evidence:**

**Insight:**
""",
    "birlasoft-hp-field-ai-research-programme-v1.md": """# Programme evidence — HP field service (v1)

**Owner:** Mary · **Asset inbox:** `~/Documents/sankar/`

## Exhibit map (visual-intent gate — PRD §5.1)

| File | Visual intent | Readable @1080p? | Adds emphasis? | Decision (keep/drop/crop/regen) |
|------|---------------|------------------|----------------|----------------------------------|
| `Landing Screen.png` | Visit context before AI | | | |
| `Android Small - 496.png` | Conversational diagnose + rationale | | | |
| `Android Small - 505.png` | Single next-best action | | | |
| `Android Small - 525.png` | Diagnosis → parts handoff | | | |
| `Android Small - 504.png` | Scan-and-confirm / parts commit | | | |

**Rule:** Omit exhibit if unreadable AND not adding emphasis; crop/regenerate when positioning value is high.

## Workshop / pilot observations (directional)

**Evidence:**

**Insight:**

## What we will not claim

- No HP production KPIs without verified source.
""",
}

EVIDENCE_JSON = """{
  "programme": "hp-field-service-ai",
  "brand": "Birlasoft",
  "slides": {
    "context": [],
    "problem": [],
    "objective": [],
    "market_view": [],
    "technical_view": [],
    "solution": [],
    "recommendations": [],
    "proof": []
  },
  "pairs": [
    {
      "slide": "context",
      "evidence": "",
      "insight": "",
      "verification": "directional",
      "source": ""
    }
  ]
}
"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, body in STUBS.items():
        path = OUT / name
        if not path.exists():
            path.write_text(body, encoding="utf-8")
            print(f"created {path.name}")
        else:
            print(f"exists  {path.name}")
    ladder = OUT / "birlasoft-hp-field-ai-evidence-ladder-v1.json"
    if not ladder.exists():
        ladder.write_text(EVIDENCE_JSON, encoding="utf-8")
        print(f"created {ladder.name}")
    print("Next: Mary completes research → Paige deck-copy-v2")


if __name__ == "__main__":
    main()
