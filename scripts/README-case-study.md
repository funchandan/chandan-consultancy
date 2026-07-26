# Case study generator — Phase 1

## Quick start (Points marketplace)

Copy rules: `scripts/lib/case_study/COPY_RULES.md` (Product tab vs Chandan voice).

```bash
# 1. Validate & normalize package (YouTube IDs, study type)
python3 scripts/case-study-feed.py scripts/case-study-packages/points-marketplace-foundational.json --write

# 2. Draft copy + preview scan
python3 scripts/case-study-generate.py scripts/case-study-packages/points-marketplace-foundational.json --draft

# 3. Edit copy (optional)
#    _bmad-output/case-studies/points-marketplace-foundational-copy-draft.json

# 4. Approvals
python3 scripts/case-study-approve-copy.py points-marketplace-foundational --by "Paige"
python3 scripts/case-study-approve-design.py points-marketplace-foundational --by "Sally"
python3 scripts/case-study-approve-po.py points-marketplace-foundational --by "Chandan"

# 5. Regenerate scan from approved copy
python3 scripts/case-study-generate.py scripts/case-study-packages/points-marketplace-foundational.json

# 6. Publish to case-studies/
python3 scripts/case-study-publish.py points-marketplace-foundational

# 7. QA
bash scripts/case-study-qa.sh points-marketplace-foundational
```

Preview draft: `_bmad-output/case-studies/{slug}-scan-preview.html`  
Published: `case-studies/{slug}.html`

## UX wireframe inbox (Desktop/folderX)

Sally drops Figma exports or screenshots in `~/Desktop/folderX` and maps them to narrative beats in `wireframe-manifest.json` (A1–A4 → hero, objective, problem, insights, recommendations).

```bash
# First time: create manifest template in folderX
python3 scripts/case-study-sync-wireframes.py --init-manifest

# Sync writes to assets/case-studies/{slug}/regenerated/ only.
# PDF reference wireframes stay in assets/case-studies/{slug}/reference/.
# After designer adds/replaces files, edit wireframe-manifest.json "source" filenames, then:
python3 scripts/render-study-wireframes.py
python3 scripts/case-study-sync-wireframes.py --inbox ~/Desktop/folderX --write
python3 scripts/case-study-generate.py scripts/case-study-packages/points-marketplace-foundational.json --draft
python3 scripts/case-study-approve-copy.py points-marketplace-foundational --by "Sally"
python3 scripts/case-study-publish.py points-marketplace-foundational
```

## PDF hook

```bash
python3 scripts/case-study-feed.py scripts/case-study-packages/foo.json --pdf ~/Downloads/portfolio.pdf
```

(Full PDF→JSON extract is Phase 2; hook documents intent.)

## HP & Stryker — synthetic screen crops (not client production)

**Do not** use `~/Documents/sankar/` or other client production wireframe exports in public case studies. That inbox is for the **Birlasoft internal deck** only (`scripts/build-birlasoft-hp-deck.py`).

| Study | Generator | Gallery | Hero ticker / index frames |
|-------|-----------|---------|----------------------------|
| HP Field Service | `python3 scripts/generate-hp-field-service-media.py --png` | `assets/case-studies/hp-field-service-ai/regenerated/` (flat screen PNGs, Points pattern) | `hero-ticker/*.png` — 390×844 screen crops |
| Stryker Field Logistics | `python3 scripts/generate-stryker-logistics-hifi.py --png` | `beats/*.png` — 390×844 screen crops | `hero-ticker/*.png` — 390×844 screen crops |

Publish runs asset validation: portrait ticker/gallery PNGs must be ~390×844 screen crops, not full 1200px studio canvases. Sankar inbox paths are rejected.

```bash
python3 scripts/generate-hp-field-service-media.py --png
python3 scripts/generate-stryker-logistics-hifi.py --png
python3 scripts/case-study-publish.py hp-field-service-ai --force
python3 scripts/case-study-publish.py stryker-field-logistics --force
```

## PRD

`_bmad-output/planning-artifacts/case-study-generator-prd-v1.md`
