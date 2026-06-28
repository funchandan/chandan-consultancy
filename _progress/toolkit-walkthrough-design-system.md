# Toolkit walkthrough design system

**Source:** [Mintlify](https://mintlify.com) via `popular-web-designs/templates/mintlify.md`  
**Scope:** `toolkit-article--walkthrough` in `styles.css`; reference page `toolkits/setup-bmad.html`  
**Template:** `toolkits/_walkthrough-template.html`  
**Date:** 2026-06-27

## Rationale

Toolkit pages are documentation-first walkthroughs. Mintlify’s reading-optimized patterns (airy white canvas, 5% opacity borders, 16px card radii, pill meta chips, Geist Mono for commands) fit better than marketing-heavy layouts. Portfolio brand blue (`--accent`) remains the primary CTA and step accent; Mintlify green (`#18E299`) signals positive “after” states only.

## Token mapping

| Mintlify token | Walkthrough CSS var | Notes |
|----------------|---------------------|-------|
| `#0d0d0d` near-black | `--walkthrough-ink` | Headings |
| `#333333` | `--walkthrough-body` | Body copy |
| `#666666` / `#888888` | `--walkthrough-muted` / `--walkthrough-muted-soft` | Labels, attribution |
| `#ffffff` / `#fafafa` | `--walkthrough-surface` / `--walkthrough-surface-subtle` | Cards, fix boxes |
| `rgba(0,0,0,0.05)` | `--walkthrough-border` | Primary separation |
| `#18E299` | `--walkthrough-doc-green` | After-compare cards only |
| `#d4fae8` | `--walkthrough-doc-green-soft` | Success surfaces |
| 16px / 24px radius | `--walkthrough-radius` / `--walkthrough-radius-lg` | Cards, TOC |
| Card shadow 0 2px 4px @ 3% | `--walkthrough-shadow-card` | Depth without heaviness |
| Portfolio `--accent` | `--walkthrough-brand` | CTAs, step counters, focus rings |

## Component inventory

| Class | Role |
|-------|------|
| `toolkit-article--walkthrough` | Token scope + Geist Mono for code |
| `toolkit-hero--walkthrough` | Atmospheric hero gradient |
| `toolkit-prereq` | Rubric v2 prerequisites line |
| `toolkit-outcome--hero` | Learning outcome (dim 1) |
| `toolkit-meta-strip--pills` | Time / format / license chips |
| `toolkit-body` + `toolkit-toc--sticky` | Docs sidebar layout |
| `toolkit-method toolkit-phase-grid` | Numbered steps with inline fixes |
| `toolkit-phase-fix` | Per-step failure hint (rubric dim 3) |
| `toolkit-compare` | Before/after value (dim 5) |
| `toolkit-download-list toolkit-download-cards` | Downloadables (dim 7) |
| `toolkit-attribution` | Upstream license (dim 8) |

## Saga adversarial re-score — setup-bmad.html

### UX five criteria (Freya bar)

| Criterion | Score | Notes |
|-----------|-------|-------|
| Value offered | 9/10 | Before/after, checklist, curated picks, step-tied downloads |
| Information hierarchy | 9/10 | Single hero diagram removed; one flow SVG in `#artefact`; sticky TOC |
| Transmission to user | 9/10 | Prerequisites, inline `toolkit-phase-fix` per step, section ledes |
| Design system | 9/10 | Mintlify tokens on neutral `toolkit-article--walkthrough`; template extracted |
| UX | 10/10 | Mintlify pass v2: vertical steps, ink primary CTA, green checklist, time pill meta |

**Verdict:** PASS (≥ 9/10 all dimensions; UX 10/10 after Mintlify UI pass 2026-06-27)

### Education rubric v2 (20-point)

| # | Dimension | Score | Notes |
|---|-----------|-------|-------|
| 1 | Learning outcome | 2 | Hero `toolkit-outcome--hero` |
| 2 | Open-source fidelity | 2 | Real `npx` commands and paths |
| 3 | Walkthrough steps | 2 | 5 steps + expected output + inline fix each |
| 4 | Curated catalogue | 2 | 5 linked picks with why |
| 5 | Process improvement | 2 | Before/after compare |
| 6 | Sample artefact | 2 | `bmad-agent-flow.svg` + Excalidraw |
| 7 | Downloadables | 2 | Checklist, Excalidraw, live config |
| 8 | Attribution | 2 | MIT + upstream link in `toolkit-attribution` |
| 9 | Voice | 2 | Teacher tone; CTAs are run/download |
| 10 | Loop hygiene | 2 | Registry + this doc |

**Total:** 20/20 PASS

### Template readiness

| Blocker (prior review) | Status |
|------------------------|--------|
| BMAD-specific CSS classes | Resolved → `toolkit-article--walkthrough` |
| Missing `toolkit-prereq` | Added |
| Missing `toolkit-method` | Added on phase grid |
| Missing per-step failure fixes | `toolkit-phase-fix` on all 5 steps |
| Duplicate flow diagrams | Hero diagram removed |
| No `_walkthrough-template.html` | Created |
| Weak attribution | `toolkit-attribution` with MIT |
| Registry reference template | Rubric updated to `_walkthrough-template.html` |

**Template sign-off:** BMAD page is canonical reference for rich walkthrough variant. Hermes page remains simpler variant until migrated.
