# Toolkit walkthrough — 14 heuristic principles

**Scale:** 0–10 per principle  
**Pass:** ≥ 8 on **every** principle  
**Target:** Loop until all ≥ 8; then maximise toward 10  
**Used by:** `toolkits/_education-rubric.md` v3, `toolkits/_bcg-rubric.md` v2

Score from the rendered page (`toolkits/<slug>.html`) + CSS in `styles.css` (`toolkit-article--walkthrough`).

| # | Principle | 8/10 (pass) | 10/10 (maximise) |
|---|-----------|-------------|------------------|
| 1 | **Visibility of system status** | Meta strip (time, format), step numbers, expected output per step | Progress obvious at a glance; duration pill on each step; hero outcome states end state |
| 2 | **Match between system and real world** | Real commands, paths, repo names from this project | Reader could run step 1 without asking author; no invented CLI flags |
| 3 | **User control and freedom** | Skip link, TOC with step anchors, secondary CTA (repo/docs) | Sticky TOC; jump links in hero; related walkthroughs |
| 4 | **Consistency and standards** | Same nav, Mintlify tokens, `toolkit-article--walkthrough` classes | Matches `setup-bmad.html` / `_walkthrough-template.html` structure |
| 5 | **Error prevention** | `toolkit-prereq` before steps; scope boundary in pitfalls | "When not to use" or honest limits in start panel |
| 6 | **Recognition rather than recall** | Checklist + artefact figure + download cards visible | Code in monospace chips; diagram caption links `.excalidraw` |
| 7 | **Flexibility and efficiency of use** | Curated picks for fast paths; downloads for copy-paste | Advanced reader can skip to downloads or artefact |
| 8 | **Aesthetic and minimalist design** | One primary flow diagram; no duplicate heroes | No annotation clutter; structure-only wireframes |
| 9 | **Help users recognize, diagnose, recover from errors** | `toolkit-phase-fix` on every step; pitfalls ≥ 3 | Fixes tied to step number (`toolkit-pitfalls__step`) |
| 10 | **Help and documentation** | Curated table ≥ 3 rows with *why*; attribution | Links to upstream MIT/license + skills |
| 11 | **Learning objective clarity** (ID) | `toolkit-outcome` — one verifiable "After this walkthrough…" | Outcome in hero + start panel checklist |
| 12 | **Chunking** (ID) | Vertical phased steps; one main action per step | Section ledes; walkthrough header with step count |
| 13 | **Practice with feedback** (ID) | Command block + `toolkit-phase-exit` per step | Before/after compare ties practice to outcome |
| 14 | **Transfer to real work** (ID) | ≥ 1 downloadable under `toolkits/artefacts/<slug>/` | Reader leaves with rubric/checklist they can adopt Monday |

**ID** = instructional-design extension (Nielsen 10 + walkthrough transfer).

## Scoring worksheet (per page)

```text
Slug: _______________
1.  __  2.  __  3.  __  4.  __  5.  __  6.  __  7.  __
8.  __  9.  __  10. __  11. __  12. __  13. __  14. __
Min: __   Avg: __   PASS heuristics: Y/N (all ≥ 8)
```

## Loop rule

If any principle &lt; 8: patch HTML/CSS, re-score **only** failing principles. Do not stop at "good enough" on one 9 while another is 7.
