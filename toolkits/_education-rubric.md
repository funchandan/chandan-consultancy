# Toolkit page — Education walkthrough rubric

**Version:** 3.0  
**Owner:** Chandan / Hermes education loop  
**Supersedes:** v2.0 (10×0–2 dimensions); aligns with `toolkits/_bcg-rubric.md` v2.0  
**Pass:** All five layers below — no single aggregate point total

## Five scoring layers

### Layer A — 14 heuristic principles (0–10 each)

**Spec:** `toolkits/_heuristic-principles.md`  
**Pass:** ≥ **8** on **every** principle  
**Loop:** Patch and re-score until all ≥ 8; then maximise toward 10

Nielsen 10 + instructional extensions: learning objective, chunking, practice+feedback, transfer to work.

### Layer B — UI dev sanity (0–10)

**Spec:** `toolkits/_ui-dev-sanity-spec.md`  
**Source:** `popular-web-designs/templates/mintlify.md` → `toolkit-article--walkthrough` in `styles.css`  
**Pass:** Scorecard average ≥ 8; no checklist item < 6

Verify: margin, padding, gap, `display` (grid/flex), `justify-content`, `align-items`, radius tokens, single-column step stack, styled primary CTA.

### Layer C — Research value transmission (0–10)

**Pass:** ≥ **8**

Reader understands *why this walkthrough exists now* — tied to `/last30days` output, LinkedIn series thesis, or registry-documented programme evidence. `toolkit-compare` before/after must reflect real discourse or field work, not generic AI hype.

### Layer D — Instruction design

**Spec:** `toolkits/_instruction-design-criteria.md`  
**Pass:** **8/8** must criteria; **≥ 4/5** should criteria

### Layer E — Plain language (0–10)

**Pass:** ≥ **8**

Non-tech reader (PM, design lead) can follow intent without prior Hermes/BMAD fluency. Short sentences; teacher not seller; no em dashes; banned AI-slop phrases per `content/linkedin/_voice-rubric.md` style bans.

---

## Content completeness (legacy v2 checklist)

Still required for published pages — fail layer D or A if missing:


| Block         | Class / requirement                                                |
| ------------- | ------------------------------------------------------------------ |
| Outcome       | `toolkit-outcome`                                                  |
| Prerequisites | `toolkit-prereq`                                                   |
| Meta          | `toolkit-meta-strip`                                               |
| TOC           | `toolkit-toc`                                                      |
| Steps         | `toolkit-method` / `toolkit-phase-grid` + `toolkit-phase-fix` each |
| Catalogue     | `toolkit-curated-table` ≥ 3 rows                                   |
| Compare       | `toolkit-compare` before/after                                     |
| Artefact      | `toolkit-artefact-figure` + `.excalidraw`                          |
| Downloads     | `toolkit-download-list` / `toolkit-download-cards`                 |
| Pitfalls      | `toolkit-pitfalls` ≥ 3                                             |
| Nav           | Full registry walkthrough links                                    |
| Registry      | Slug in `walkthrough-registry.yaml`                                |


## Open-source rules (unchanged)

1. Education over invention — document setups Chandan actually uses.
2. Real repos, paths, commands — no invented tooling.
3. Artefacts under `toolkits/artefacts/<slug>/`.
4. Do not add slugs outside `walkthrough-registry.yaml`.

## Hermes review protocol

1. Read `toolkits/walkthrough-registry.yaml`.  
2. Score `toolkits/<slug>.html` — **all five layers**.  
3. **LinkedIn-origin slugs:** also score [Objective Fit](.agents/skills/linkedin-toolkit-series/objective-gates.md) (O1–O8, all ≥ 8, avg ≥ 9).  
4. **All slugs:** score [audience-rules.md](.agents/skills/linkedin-toolkit-series/audience-rules.md) tier checklist (A/B/C).  
5. Templates: `toolkits/setup-bmad.html`, `toolkits/score-research-and-design-loop.html`, `toolkits/_walkthrough-template.html`.  
6. Write `_progress/toolkit-education-review.md`:

```markdown
### {slug}
#### Heuristics (0–10)
| # | Principle | Score |
|---|-----------|-------|
| 1 | Visibility of system status | |
…
| 14 | Transfer to real work | |
**Min:** __ **Avg:** __ **Pass (all ≥8):** Y/N

#### Other layers
| Layer | Score | Pass |
|-------|-------|------|
| UI dev sanity | /10 | |
| Research transmission | /10 | |
| Instruction design | must __/8, should __/5 | |
| Plain language | /10 | |

**VERDICT:** PASS | FAIL

#### Objective Fit (LinkedIn-origin only)
| # | Criterion | Score |
|---|-----------|-------|
| O1 | Outcome verifiable | |
| O2 | TPO step coverage | |
| O3 | Rubric design (if in TPO) | |
| O4 | Agent loop (if in TPO) | |
| O5 | Research + design (if in TPO) | |
| O6 | Visual parity | |
| O7 | Open-source fidelity | |
| O8 | Self-improvement honesty | |
**Min:** __ **Avg:** __ **PASS (all ≥8, avg ≥9):** Y/N
```

6. **Stop:** all `status: published` registry entries **PASS** all layers, **audience-rules** tier checklist, and Objective Fit (when `product_objective` is set).

## Self-improvement loop (cron)

```text
hermes cron edit c6913b098685 \
  --name toolkit-education-review \
  --prompt "Read toolkits/walkthrough-registry.yaml. For each walkthrough, score toolkits/<slug>.html against toolkits/_education-rubric.md v3: (A) 14 heuristics in _heuristic-principles.md all >=8, loop till maximised; (B) UI dev sanity per _ui-dev-sanity-spec.md >=8; (C) research transmission >=8; (D) instruction design per _instruction-design-criteria.md; (E) plain language >=8. Score audience tier checklist per .agents/skills/linkedin-toolkit-series/audience-rules.md. When product_objective is set, also score Objective Fit per objective-gates.md (O1-O8, all >=8, avg >=9). Curate only — no new slugs. Update _progress/toolkit-education-review.md. PASS when all status:published pages pass all layers, audience rules, and Objective Fit."
```

## Reference files


| File                                             | Layer                         |
| ------------------------------------------------ | ----------------------------- |
| `_heuristic-principles.md`                       | A                             |
| `_ui-dev-sanity-spec.md`                         | B                             |
| `_instruction-design-criteria.md`                | D                             |
| `_bcg-rubric.md`                                 | Summary + PRD alias           |
| `_progress/toolkit-walkthrough-design-system.md` | Mintlify implementation notes |
