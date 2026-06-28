# Phase 2 — Education toolkit walkthrough

**Prerequisites:** [objective-gates.md](objective-gates.md), [audience-rules.md](audience-rules.md) — score Objective Fit **and** audience tier before HTML.

## Audience tier (pick before writing)

| Tier | When | Key artefact |
|------|------|--------------|
| A | LinkedIn series / universal process | `path-convention.md` |
| B | Upstream stack (BMAD, Hermes, WDS, …) | Upstream install checklist |
| C | Meta maintainer (review loop) | Portable registry pattern |

Full rules: [audience-rules.md](audience-rules.md).

## Slug naming

| Pattern | Example |
|---------|---------|
| `{action}-{subject}-before-{noun}` | `score-design-before-review` |
| `{action}-with-{tool}` | `wireframe-with-excalidraw` |
| `{action}-{domain}-loop` | `score-research-and-design-loop` |
| `setup-{stack}` | `setup-hermes-personal` |

Avoid consulting-style names. Use `replaces:` in registry if migrating old slug.

## Registry row template

```yaml
- slug: {slug}
  title: {reader-facing title}
  product_objective: "After this walkthrough, users will..."  # Tier A/B when falsifiable
  linkedin_thesis: "{feed slice — subset of objective}"
  audience_tier: A | B | C
  companion_slugs: []
  type: walkthrough
  status: draft
  skills: [...]
  repos: [...]   # maintainer context only; not required reading
  artefacts: [...]
  linkedin: []   # when LinkedIn-origin
  design_system: toolkit-article--walkthrough
  template: toolkits/_walkthrough-template.html
  replaces: null
```

Set `status: published` only after **Objective Fit PASS** (when `product_objective` set), **audience tier checklist PASS**, and **education v3 PASS**.

## Objective-driven artefact matrix

Pick from TPO — not every slug needs every file. See [objective-gates.md §4](objective-gates.md#4-objective-driven-artifact-matrix).

| If TPO includes… | Minimum artefact |
|------------------|------------------|
| Paths / folders (Tier A) | `path-convention.md` |
| Score / standards | `{domain}-standards-rubric.md` + checklist |
| **Design rubrics** (author, not copy) | `rubric-design-workshop.md` |
| Research output | `research-standards-rubric.md` or research rows |
| Loop diagram | `{name}.excalidraw` + `.svg` (parity with LinkedIn artefact) |
| Self-improving agent loop | `agent-review-prompt.md` + `score-log-template.md` |
| Stack install (Tier B) | `install-checklist.md` + upstream link in hero |

### agent-review-prompt.md (Tier A agent loop)

Tool-agnostic. Variables from `path-convention.md`. No required vendor CLI.

**Forbidden** as user R&D step 5: prompt that only reads this site’s `walkthrough-registry.yaml`.

## HTML page checklist

### Audience ([audience-rules.md](audience-rules.md))

- [ ] Tier selected and hero/prereqs match
- [ ] `#curated` = **Further reading** (public URLs)
- [ ] Internal walkthrough links under **Optional on this site** (not mixed into steps)
- [ ] No portfolio case studies or live repo file as primary download
- [ ] Steps = actions; paths are examples or upstream post-install paths

### Objective Fit (objective-gates.md §3)

- [ ] `toolkit-outcome--hero` = **TPO** when set
- [ ] Each TPO capability → step with `toolkit-phase-fix`
- [ ] LinkedIn artefact ↔ `#artefact` (O6)
- [ ] O7 ≥ 8 — reader can run off-repo

### Education rubric v3

| Layer | Pass |
|-------|------|
| A–E | per `_education-rubric.md` |

Reference: `toolkits/score-research-and-design-loop.html` (Tier A), `toolkits/setup-bmad.html` (Tier B pattern after generic pass).

## Site wiring

```bash
rg -l 'toolkit-review-loop\.html' --glob '*.html' toolkits/ toolkits.html index.html
```

Also: `toolkits.html`, `assets/hero-bento.json`, `assets/hero-toolkit-cards.json`.

## Post ↔ toolkit link-back

1. Post `product_objective:` + `toolkit:` frontmatter
2. First comment with canonical URL (+ `toolkit_full:` companion if split)
3. `#artefact` matches LinkedIn SVG source

## Review log entry

```markdown
### {slug}
**audience_tier:** A|B|C
**audience_rules PASS:** Y/N

#### Objective Fit …
#### Education v3 …
**VERDICT:** PASS | FAIL
```
