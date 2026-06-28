# Objective gates — LinkedIn + toolkit series

**Purpose:** Prevent Phase 2 toolkits that pass `_education-rubric.md` v3 but fail the **product objective**.  
**Rule:** LinkedIn takeaway is a **slice** for the feed. **Toolkit Product Objective (TPO)** is the full promise the walkthrough must deliver.

---

## 1. Define TPO before Phase 2

Write one falsifiable sentence **before** authoring HTML:

```text
After this walkthrough, users will be able to {capability A} and {capability B} so that {measurable outcome}.
```

| Field | Where it lives |
|-------|----------------|
| `product_objective` | `toolkits/walkthrough-registry.yaml` row |
| `linkedin_thesis` | `content/linkedin/ai-ux-research-series.yaml` (feed slice only) |
| Outcome box | `toolkit-outcome--hero` — must restate TPO, not only thesis |

**Gate:** If you cannot name what the reader has **in their repo** after step 5, stop. Rewrite TPO.

### Example (score-design — corrected scope split)

| Layer | Text |
|-------|------|
| **TPO (full product)** | Users will design rubrics and run self-improving agent loops to grade and improve their research and design output. |
| **LinkedIn thesis (slice)** | Score design outputs against standards before review - fewer prompt iterations, higher first-pass acceptance. |
| **Honest outcome if slice-only** | A `design-standards-rubric.md`, checklist, and manual pre-review loop for **design** artefacts. |
| **Companion slug if TPO is full** | e.g. `score-research-and-design-loop` or expand current slug in Phase 2b |

**Gate:** If TPO ⊄ toolkit steps, either **narrow TPO** to match what you ship or **add stories** before `status: published`.

---

## 2. Takeaway vs TPO alignment (Phase 1 → Phase 2 handoff)

After Phase 1 takeaway scores ≥ 9/10, run **alignment check**:

```text
Takeaway covers which TPO capabilities?  [ list or "slice only" ]
Deferred to companion / Phase 2b?       [ list ]
Mismatch risk?                          [ Y/N — if Y, fix before HTML ]
```

| Situation | Action |
|-----------|--------|
| Takeaway = full TPO | Single toolkit covers everything |
| Takeaway ⊂ TPO | Document deferrals in registry `companion_slugs:` or split slug |
| Takeaway ⊄ TPO | **HALT** — rewrite takeaway or TPO |

Do **not** ship a toolkit whose hero outcome promises more than the walkthrough steps deliver.

---

## 3. Objective Fit scorecard (9/10 bar)

Score **each applicable row 0–10**. **Pass:** every scored row ≥ **8**, average of scored rows ≥ **9**.

Rows O3, O4, O5 apply only when the capability appears in `product_objective`. Mark others **N/A** and exclude from min/avg.

| # | Criterion | 8/10 (pass) | 9/10 (target) |
|---|-----------|-------------|---------------|
| O1 | **Outcome verifiable** | Reader can point to files created under neutral `docs/` paths | Outcome names exact filenames + pass threshold |
| O2 | **TPO step coverage** | Every capability in TPO has ≥1 walkthrough step with command + `toolkit-phase-fix` | Each capability has expected output + pitfall mapped to step |
| O3 | **Rubric design** (if in TPO) | Steps show how to pick dimensions and pass bar, not only copy template | Includes rubric-design artefact or workshop section |
| O4 | **Agent loop** (if in TPO) | Cron/agent prompt scores **user artefacts** with **user rubric path** | Prompt + score log + re-run until pass; not toolkit-meta cron |
| O5 | **Research + design** (if in TPO) | Rubric or steps cover both domains explicitly | Separate dimensions or dual checklist rows with examples |
| O6 | **Visual parity** | LinkedIn `artefact-walkthrough.svg` same loop as page `#artefact` | Same steps, same paths, Arial/ASCII-safe SVG |
| O7 | **Open-source fidelity** | Neutral paths; `path-convention.md` for Tier A | Runs without cloning this repo; no live portfolio file as primary download |
| O8 | **Self-improvement honesty** | If no agent loop, TPO does not claim one | Optional step labeled optional; TPO matches mandatory path |

**Fail any row < 8:** patch toolkit or narrow TPO. Do not mark registry `published`.

Log scores in `_progress/toolkit-education-review.md` under `### Objective Fit — {slug}`.

---

## 4. Objective-driven artefact matrix

Pick artefacts from TPO capabilities — not a fixed menu.

| TPO keyword | Required artefact | Walkthrough proof |
|-------------|-------------------|-------------------|
| design rubric / score | `{domain}-standards-rubric.md` | Step: copy + **edit dimensions** |
| **design rubrics** (plural / author) | `rubric-design-workshop.md` | Step: pick dimensions, set pass bar |
| research output | `research-standards-rubric.md` or research rows in rubric | Step: score synthesis artefact |
| checklist / pre-review | `pre-review-checklist.md` | Step 4 score-before-share |
| loop diagram | `{name}.excalidraw` + `.svg` | `#artefact` figure |
| self-improving agent | `agent-review-prompt.md` + `score-log-template.md` | Step 5 with **copy-paste** prompt targeting user paths |
| registry / meta only | N/A for user TPO | Do **not** substitute `toolkit-review-loop` cron as user loop |

**Anti-pattern:** Step 5 Hermes cron that reads `walkthrough-registry.yaml` and `_education-rubric.md` when TPO promises grading **user research/design output**.

---

## 5. Phase 2 exit checklist (objective + education)

Complete **after** `_education-rubric.md` v3 five layers AND **before** `status: published`:

### Objective gates (this doc)

- [ ] `product_objective` in `walkthrough-registry.yaml`
- [ ] `toolkit-outcome--hero` matches TPO (not only LinkedIn thesis)
- [ ] Objective Fit scorecard: all rows ≥ 8, avg ≥ 9
- [ ] LinkedIn artefact ↔ page artefact visual parity verified
- [ ] If TPO ⊃ thesis: `companion_slugs` or Phase 2b ticket documented

### Education rubric v3 (existing)

- [ ] Five layers PASS (`_progress/toolkit-education-review.md`)
- [ ] Plain language ≥ 8 (no em/en dashes; `_voice-rubric.md`)

### Audience ([audience-rules.md](audience-rules.md))

- [ ] Tier A/B/C declared in registry when publishing
- [ ] Further reading vs Optional on this site separated
- [ ] No portfolio case study in compare cards or steps

### LinkedIn series (Phase 1)

- [ ] Post 600–900 chars; takeaway ≥ 9/10
- [ ] `toolkit:` frontmatter + first comment URL
- [ ] `sources:` includes `/last30days` path when used

---

## 6. Registry fields (add to every LinkedIn-origin slug)

```yaml
- slug: {slug}
  title: {reader-facing — may match thesis}
  product_objective: "After this walkthrough, users will..."
  linkedin_thesis: "{feed takeaway — subset of objective}"
  audience_tier: A | B | C
  companion_slugs: []
  type: walkthrough
  status: draft          # published only after objective + education PASS
```

Series yaml mirror:

```yaml
- id: learning-{NN}-{slug}
  thesis: {linkedin_thesis}
  product_objective: {same as registry — single source copied once}
  toolkit: toolkits/{slug}.html
```

---

## 7. Course-correct triggers (when to stop and fix)

| Signal | Fix |
|--------|-----|
| Adversarial review: "LinkedIn visual ≠ page diagram" | Regenerate both from one `artefact-walkthrough.md` source |
| PM gap: "cron scores wrong domain" | Replace step 5 prompt; add `score-log-template.md` |
| Education PASS but user can't run step 1 off-repo | Neutral `docs/` paths in commands |
| TPO mentions research; rubric is design-only | Add research dimensions or split slug |
| Outcome mentions agent loop; step 5 is comments only | Add `hermes cron create` or Cursor rule with full prompt |

---

## 8. Worked example — scope honesty

**Learning #1 (current):**

- **Shipped today:** Manual design pre-review loop (O3 partial, O4 fail, O5 fail for full TPO).
- **Honest TPO for current slug:** Users will score design outputs against a shared rubric before review.
- **Full user TPO:** `score-research-and-design-loop` (published; O1-O8 PASS).
- **Design slice:** `score-design-before-review` (companion; step 5 links to full loop).

Document in registry:

```yaml
product_objective: "Users will score design outputs against a team rubric before review."
linkedin_thesis: "Score design outputs against standards before review - fewer iterations, higher acceptance."
companion_slugs:
  - toolkit-review-loop   # meta: education page hygiene only
# Future: score-research-and-design-loop for full rubric-design + agent loop TPO
# Shipped 2026-06-27: toolkits/score-research-and-design-loop.html
```
