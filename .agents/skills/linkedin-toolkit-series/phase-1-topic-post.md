# Phase 1 — Topic pick, post draft, evidence artefact

**Prerequisite:** Read [objective-gates.md](objective-gates.md) and [audience-rules.md](audience-rules.md). Tier A LinkedIn toolkits use generic loops only in artefacts.

## TPO template (write first)

```text
After this walkthrough, users will be able to {capability A} [and {capability B}] so that {measurable outcome}.
```

Example (full vision vs feed slice):

| | Text |
|---|------|
| TPO | Users will design rubrics and run self-improving agent loops to grade and improve their research and design output. |
| LinkedIn thesis (slice) | Score design outputs against standards before review - fewer prompt iterations, higher first-pass acceptance. |

If the slice cannot carry the full TPO in one toolkit, record `companion_slugs` in working notes for Phase 2.

## Research → learning extraction

After `/last30days` completes, distill **KEY PATTERNS** into candidate post theses. Format each as:

```text
{learning_num}. {thesis one line} — evidence: {subreddit|@handle|publication}
```

Example theses (AI + UX research domain):

- Intent orchestration beats screen polish when agents ship UI
- AI accelerates synthesis, not study design ownership
- Practitioner backlash is organizational (review gates), not model quality
- Multi-LLM qual needs a human-coded codebook first
- Agentic UX needs preview, dial, receipt, undo — not chat-only
- "Fix UX with AI" posts fail without acceptance criteria
- Frontier UXR roles weight orchestration over deliverable volume
- Automated research platforms still need moderator judgment
- Figma-to-code anxiety is a standards problem, not a model problem
- Trust metrics beat speed metrics in agent-assisted design

## Topic scoring worksheet

Copy and fill per candidate:

```text
Learning: ___
Trend (1-5): ___
Personal lens (1-5): ___
Reader takeaway (1-5): ___
Toolkit potential (1-5): ___
Evidence strength (1-5): ___
TPO alignment (1-5): ___   # Can one slug deliver full TPO?
TOTAL: ___
```

**TPO alignment gate (mandatory after scoring):**

```text
Takeaway: ___
TPO: ___
Takeaway ⊆ TPO?  Y / N
If N: fix takeaway or split slug before post draft.
Deferred capabilities: ___
```

## Takeaway ideation

Generate 5–7 one-line takeaways. Score each /10.

**Formula:** `{verb} {object} {mechanism} - {reader outcome A}, {reader outcome B}.`

| Score | Meaning |
|-------|---------|
| 7–8 | Clear but generic or slightly repo-centric |
| 9 | Reader value + measurable outcome + memorable |
| 10 | Same as 9 + contrarian hook without hype |

**Examples (9+):**

- Score design outputs against standards before review - fewer prompt iterations, higher first-pass acceptance.
- Close the gap between design prompts and approved work: score intent and standards before review, not after the third revision.

**Reject (<8):**

- A Hermes loop for Excalidraw walkthroughs in my repo.
- Use AI to 10x your research workflow.

## post.md template

```markdown
---
series: ai-ux-research-2026
learning: {N}
slug: {slug}
title: "{trend hook — not authority headline}"
Datum: {ISO8601 with timezone}
Status: review
Bild: artefact-walkthrough.svg
Hook: {takeaway shortened}
product_objective: "{full TPO sentence}"
voice_rubric: content/linkedin/_voice-rubric.md
sources:
  - {community or raw file path}
toolkit: toolkits/{slug}.html
---

## LinkedIn

### Post

Lately I've noticed {trend in plain language}.

{2-3 short paragraphs: what's wrong in the feed, honest tenure line, what helped.}

**Takeaway:** {9/10 line}

{One line pointing to image as evidence.}

{One closing question.}

### Första kommentar

Full walkthrough: {toolkit URL}

{Optional: companion walkthroughs}
```

## artefact-walkthrough.md template

Evidence visual source. Include:

1. Numbered steps readers can copy (commands or checklist actions) — **must match Phase 2 walkthrough loop**
2. File path table (`| File | Role |`) — neutral `docs/` paths where possible
3. Link to Phase 2 toolkit path
4. Footer: cite `/last30days` or community source when used

**Visual parity (O6):** Export `artefact-walkthrough.svg` from the same step list as `toolkits/artefacts/{slug}/*.svg`. Use Arial/Helvetica + ASCII punctuation (no `system-ui`, no middle dots) for `<img>` embeds.

Do **not** show a different loop on LinkedIn than on the toolkit page (e.g. Hermes education cron when TPO is design scoring).

## Character count

```bash
python3 -c "
import re
from pathlib import Path
t = Path('content/linkedin/posts/NN-slug/post.md').read_text()
m = re.search(r'### Post\n\n(.*?)\n\n###', t, re.S)
print(len(m.group(1)), 'chars')
"
```

Target: **600–900**.

## Series yaml row

```yaml
- id: learning-{NN}-{slug}
  learning_num: {N}
  slug: {slug}
  title: {same as post title}
  thesis: {takeaway without bold}
  product_objective: {full TPO — same as registry}
  publish_at: {ISO8601}
  status: review
  post_md: content/linkedin/posts/{NN}-{slug}/post.md
  artefact: content/linkedin/posts/{NN}-{slug}/artefact-walkthrough.svg
  artefact_source: content/linkedin/posts/{NN}-{slug}/artefact-walkthrough.md
  toolkit: toolkits/{slug}.html
```

Cadence: `cadence_days: 2` between posts unless user overrides.
