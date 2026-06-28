# Toolkit page — BCG-grade quality rubric

**Version:** 2.0  
**Owner:** Chandan / Hermes education loop  
**Supersedes:** v1.1 consulting diagnostics model  
**Active scoring file:** `toolkits/_education-rubric.md` v3 (same bar; BCG name kept for PRD parity)

The BCG-grade bar now means **enterprise-trustworthy open education** — not consulting filler. Score walkthrough pages until maximised.

## Pass threshold (all required)

| Layer | Metric | Pass |
|-------|--------|------|
| **A. Heuristics** | 14 principles × 0–10 | **Every** principle ≥ 8; loop until maximised |
| **B. UI dev sanity** | Mintlify spec scorecard | ≥ 8/10 avg; no item &lt; 6 |
| **C. Research transmission** | Value from `/last30days` or series research | ≥ 8/10 |
| **D. Instruction design** | Must + should criteria | 8/8 must; ≥ 4/5 should |
| **E. Plain language** | Non-tech reader friendliness | ≥ 8/10 |

**VERDICT: PASS** only when all five layers pass. **FAIL** if any layer fails.

## Layer A — 14 heuristic principles

See `toolkits/_heuristic-principles.md`. Nielsen 10 + instructional extensions (objective, chunking, practice+feedback, transfer).

**Loop rule:** Re-score after patches until no principle &lt; 8. Prefer average ≥ 9 before stopping.

## Layer B — UI dev sanity (`popular-web-designs`)

See `toolkits/_ui-dev-sanity-spec.md`. Source template: `popular-web-designs/templates/mintlify.md`.

Verify in code:

- `toolkit-article--walkthrough` tokens in `styles.css`
- `margin` / `padding` / `gap` match spec tables
- `display: grid` vs `flex` — single-column steps, sticky TOC grid, flex hero actions
- `justify-content` / `align-items` on CTAs and meta strips
- Reference page: `toolkits/setup-bmad.html`

## Layer C — Research value transmission

| Score | What it looks like |
|-------|-------------------|
| 0–5 | Generic advice; no link to lived discourse or programme work |
| 6–7 | Vague "teams struggle with…" without source |
| **8** | Before/after tied to pattern from `~/Documents/Last30Days/` or LinkedIn series thesis |
| 9–10 | Reader sees *why now* (feed fatigue, review friction) + transferable fix; cites community or raw research path in page or registry `linkedin:` row |

For pages without a `/last30days` run: tie `toolkit-compare` to a documented programme beat or registry `repos:` why-line.

## Layer D — Instruction design

See `toolkits/_instruction-design-criteria.md`.

## Layer E — Plain language (non-tech reader)

| Score | Signals |
|-------|---------|
| 0–5 | Acronym soup; "leverage", "orchestrate landscape"; assumes Hermes/BMAD fluency |
| 6–7 | Some gloss; long sentences; passive voice |
| **8** | PM or design lead understands steps without opening terminal first |
| 9–10 | Short paragraphs; teacher voice; jargon only beside plain gloss; Nielsen-adjacent (see `content/linkedin/_voice-rubric.md` bans) |

**Hard fail:** em dashes; "decades of practice" inflation; seller CTA as primary action.

## Hermes review protocol

1. Read `toolkits/walkthrough-registry.yaml` — score registry slugs only.
2. Score `toolkits/<slug>.html` against **all five layers**.
3. Reference template: `toolkits/setup-bmad.html`, `toolkits/_walkthrough-template.html`.
4. Patch HTML/CSS; do not invent slugs.
5. Log to `_progress/toolkit-education-review.md` with:
   - 14 heuristic scores (table)
   - UI sanity scorecard
   - Research / instruction / plain-language scores
   - `VERDICT: PASS | FAIL`
6. **Stop:** all published registry pages PASS all layers; heuristics looped to ≥ 8 each.

## Self-improvement loop (cron)

```text
hermes cron edit c6913b098685 \
  --name toolkit-education-review \
  --prompt "Read toolkits/walkthrough-registry.yaml. Score each toolkits/<slug>.html against toolkits/_education-rubric.md v3 (5 layers: 14 heuristics all >=8, UI dev sanity per _ui-dev-sanity-spec.md, research transmission >=8, instruction design per _instruction-design-criteria.md, plain language >=8). Loop patches until heuristics maximised. Update _progress/toolkit-education-review.md. PASS when all status:published pages pass all layers."
```
