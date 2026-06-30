# Sketch Checkpoints — Toolkit-First Hero

**Date:** 2026-06-30  
**Status:** Complete — winners locked; open questions resolved

---

## Winners

| Checkpoint | Sketch | Winner | Direction |
|------------|--------|--------|-----------|
| 1 | 001 toolkit-proof-hero | **B** | Artefact gallery — thumbnail + score badge leads; registry/cron as footer chips |
| 2 | 002 reviews-quiz-split | **B** | 1:3 narrow — reviews ~25%, quiz ~75%; quote clamped, no avatar stack |
| 3 | 003 nav-search-trigger | **C** | Overlay drawer — search icon opens panel below pill with chips + filter |

**Mobile stack (002):** Toolkit → Reviews → Quiz — unchanged.

---

## Resolved decisions (2026-06-30)

| Question | Decision |
|----------|----------|
| **Gemini fate** | **Retire** on index — remove SVG paths, effect scripts, and layout sync from hero |
| **Proof metrics** | **Custom SME expert signals per toolkit** — `expertSignals` on each stage in `hero-toolkit-cards.json` (score, artefact, labelled chips); not generic cron JSON or live fetch |
| **Experience card** | **Quiz stays.** No standalone Experience tile. Credibility merges into **reviews** compact cell (social proof only) |

**Implementation spec:** `_bmad-output/implementation-artifacts/spec-toolkit-first-hero-boxbento.md`

---

## How to review sketches

```bash
open .planning/sketches/001-toolkit-proof-hero/index.html
open .planning/sketches/002-reviews-quiz-split/index.html
open .planning/sketches/003-nav-search-trigger/index.html
```

Winning variants open by default (★ on tab).
