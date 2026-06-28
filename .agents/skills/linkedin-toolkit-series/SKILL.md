# LinkedIn + education toolkit series

Turn `/last30days` research into a **short LinkedIn post** plus a **full toolkit walkthrough** readers can run. Two phases. Do not skip Phase 1 takeaway validation before Phase 2.

**Critical:** Passing `_education-rubric.md` v3 is **necessary, not sufficient**. Every toolkit must also pass **Objective Fit** in [objective-gates.md](objective-gates.md) (all criteria ≥ 8, average ≥ 9).

**Usage**

- `/linkedin-toolkit-series` — run Phase 1 for the next `queued` row in `content/linkedin/ai-ux-research-series.yaml`
- `/linkedin-toolkit-series {topic}` — Phase 1 research on `{topic}`, then Phase 2 if user confirms
- `/linkedin-toolkit-series phase-1` — topic + post only
- `/linkedin-toolkit-series phase-2 {slug}` — toolkit only (post + **TPO** must exist or user provides both)

**Read first (every run)**

| File | Role |
|------|------|
| [audience-rules.md](audience-rules.md) | **Tier A/B/C, generic voice, paths, curated sections** |
| [objective-gates.md](objective-gates.md) | **TPO, alignment, 9/10 Objective Fit scorecard** |
| `content/linkedin/_voice-rubric.md` | Post voice rules |
| `content/linkedin/ai-ux-research-series.yaml` | Series registry |
| `toolkits/_education-rubric.md` | Toolkit pass bar (v3 five layers) |
| `toolkits/walkthrough-registry.yaml` | Allow-list for new slugs |

**Companion skills**

- `/last30days` — Phase 1 research (mandatory for new topics)
- `wireframe` — Excalidraw artefacts
- `social-publish` — schedule after `status: approved`
- `bmad-correct-course` — when TPO ⊄ shipped toolkit

**Reference**

- Phase 1: [phase-1-topic-post.md](phase-1-topic-post.md)
- Phase 2: [phase-2-education-toolkit.md](phase-2-education-toolkit.md)
- Audience: [audience-rules.md](audience-rules.md)
- Worked example: `content/linkedin/posts/01-intent-orchestration/` + `toolkits/score-design-before-review.html` (Tier A slice) + `toolkits/score-research-and-design-loop.html` (Tier A full TPO)

---

## Two promises (do not conflate)

| Promise | Audience | Length |
|---------|----------|--------|
| **LinkedIn thesis** | Feed reader | One line; 600–900 char post |
| **Toolkit Product Objective (TPO)** | Walkthrough reader | Full falsifiable outcome in repo |

The post can be a **slice**. The toolkit must deliver the **TPO** or a **documented subset** with `companion_slugs` for the rest.

**Audience:** LinkedIn toolkits are **Tier A** ([audience-rules.md](audience-rules.md)) — generic, tool-agnostic, outsider-readable. Stack-specific steps belong in Tier B slugs linked as companions, not embedded as requirements.

---

## Phase 1 — Pick topic from research, draft post

**Goal:** One learning from live discourse → LinkedIn post (600–900 chars) + evidence visual. Takeaway is **reader value**, not "my repo loop."

### 1.0 Draft TPO first (new — mandatory)

Before takeaway ideation, write the **full product objective**:

```text
After this walkthrough, users will be able to _______________ so that _______________.
```

Store in working notes; copy to registry in Phase 2. If the feed can only carry a slice, say so explicitly.

### 1.1 Run research

1. Invoke `/last30days` on the series domain or user topic.
2. Save raw output path under `~/Documents/Last30Days/`; cite in post frontmatter `sources:`.
3. Extract **8–12 candidate learnings** as one-line theses.

### 1.2 Pick the post topic

Score each candidate (1–5) on trend, personal lens, reader takeaway, toolkit potential, evidence.

**Additional gate:** Can Phase 2 deliver **TPO** in one slug, or must you split? If split, note `companion_slugs` now.

### 1.3 Craft takeaway (9/10 bar)

Takeaway must describe **what readers gain**, not what Chandan built.

- **Alignment gate:** Takeaway ⊆ TPO. If not, narrow TPO or rewrite takeaway before drafting post.
- Score ≥ 9/10 per [phase-1-topic-post.md](phase-1-topic-post.md#takeaway-ideation).

### 1.4 Draft post + artefact

**Folder:** `content/linkedin/posts/{NN}-{slug}/`

| File | Purpose |
|------|---------|
| `post.md` | Frontmatter includes `product_objective:` + `toolkit:` |
| `artefact-walkthrough.md` | Source for visual — **same loop as Phase 2 `#artefact`** |
| `artefact-walkthrough.svg` | Evidence visual (Arial/ASCII-safe; see objective-gates O6) |

**Visual rule:** Artefact shows the **walkthrough loop the toolkit will teach**, not a different meta loop (e.g. Hermes education cron when TPO is design scoring).

### 1.5 Update series registry

```yaml
status: review
thesis: {linkedin slice}
product_objective: {full TPO}
post_md: ...
artefact: ...
toolkit: toolkits/{slug}.html  # Phase 2
```

**Phase 1 exit:** takeaway ≥ 9/10, char count 600–900, TPO written, alignment gate passed.

---

## Phase 2 — Education toolkit demonstrating the solution

**Goal:** Reader can **run the TPO** in their repo. Post stays short; toolkit carries depth.

**Prerequisite:** Phase 1 takeaway locked **and** TPO alignment documented.

### 2.0 Objective Fit before HTML (new — mandatory)

Score [objective-gates.md §3](objective-gates.md#3-objective-fit-scorecard-910-bar) from artefact plan + step outline. **HALT if any row < 8.**

Pick artefacts from [objective-gates.md §4 matrix](objective-gates.md#4-objective-driven-artifact-matrix), not a fixed design-only set.

### 2.1 Plan slug and artefacts

See [phase-2-education-toolkit.md](phase-2-education-toolkit.md). Registry row **must** include `product_objective`, `linkedin_thesis`, optional `companion_slugs`.

### 2.2 Register slug

`status: draft` until **both** Objective Fit ≥ 9 avg **and** education v3 PASS.

### 2.3 Author HTML page

Follow `toolkits/_walkthrough-template.html` and [audience-rules.md](audience-rules.md) for your tier.

**TPO-specific requirements:**

- `toolkit-outcome--hero` restates **TPO**, not only LinkedIn thesis
- Every TPO capability → ≥1 step with action + `toolkit-phase-fix`
- **Tier A:** include `path-convention.md`; `agent-review-prompt.md` for agent loops (tool-agnostic)
- **Tier B:** upstream install paths; no portfolio live files as downloads
- `#curated` = public **Further reading**; site cross-links → **Optional on this site**

### 2.4–2.5 Wire site + link post ↔ toolkit

Unchanged; verify artefact visual parity (O6).

### 2.6 Score toolkit (dual pass)

1. **Objective Fit** — log in `_progress/toolkit-education-review.md`
2. **Education v3** — five layers per `_education-rubric.md`

**Publish only when both PASS.**

---

## Anti-patterns (checks and balances)

| Do not | Do instead |
|--------|------------|
| Toolkit takeaway = "small loop in my repo" | TPO = reader outcome; thesis = feed slice |
| LinkedIn diagram ≠ page `#artefact` | One `artefact-walkthrough.md` source → both SVGs |
| Education PASS = product PASS | Run Objective Fit scorecard |
| Step 5 cron scores `walkthrough-registry.yaml` when TPO is user R&D | Cron reads user rubric + user artefact paths |
| Copy-only rubric when TPO says "design rubrics" | Add rubric-design workshop step + artefact |
| `product_objective` missing from registry | Add before Phase 2 HTML |
| Publish full TPO with slice-only steps | Split slug or document `companion_slugs` + narrow TPO |
| Claim decades of UX practice | Honest age + programme evidence |
| Portfolio paths / live repo files in steps | `path-convention.md` + starter downloads ([audience-rules.md](audience-rules.md)) |
| Hermes/BMAD/WDS required on Tier A pages | Companions only; Tier A stays tool-agnostic |
| Curated table = internal walkthroughs only | Further reading = public URLs; internal → Optional on this site |
| `this portfolio` case studies on toolkit pages | Generic before/after compare cards |

---

## End-to-end flow

```
/last30days {domain}
        ↓
Draft TPO + pick learning
        ↓
Takeaway ≥9/10 AND takeaway ⊆ TPO
        ↓
Phase 1: post + artefact (visual = future toolkit loop)
        ↓
Objective Fit plan ≥8 all rows
        ↓
Pick audience tier A/B/C + audience-rules checklist
        ↓
Phase 2: registry + HTML + objective-driven artefacts
        ↓
Objective Fit + Education v3 PASS → status: published
        ↓
Human approves post → status: approved → /social-publish
```

---

## Hermes automation (optional)

Cron for **drafting** next queued post — Phase 1 only unless user confirms TPO + Phase 2.

Education loop cron (`toolkit-education-review`) scores toolkit **pages**; it does **not** replace Objective Fit or user-facing agent loops promised in TPO.
