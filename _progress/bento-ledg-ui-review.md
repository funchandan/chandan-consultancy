# Bento ledge UI review — sortable quiz + toolkit cards

**Scope:** `index.html` → `.wp-box-bento-ledge` (toolkit CardSwap + sortable quiz)  
**Rubrics:** `toolkits/_education-rubric.md` Layer B (UI dev sanity), Layer A heuristics #1/#8, `design-standards-rubric.md` row 5 (accessibility/contrast)  
**Date:** 2026-06-28

## Adapted scorecard (0–10 each, pass ≥ 8, min ≥ 6)

| # | Criterion | Before | After (target) | Evidence |
|---|-----------|--------|----------------|----------|
| 1 | **Contrast on light cards** — body copy ≥ 4.5:1 (WCAG AA) | 4 | — | Quiz label read as ~#bbb on #fff; disabled CTA ~2.5:1 |
| 2 | **Typographic hierarchy** — eyebrow → title → body → action | 5 | — | Toolkit title ok; quiz prompt competes with row text |
| 3 | **Standalone surfaces** — no nested grey/black tray | 5 | — | Quiz still reads as one frosted panel |
| 4 | **Single visible card** (toolkit) — no ghost stack legibility | 3 | — | CardSwap back-face text bleed (partially fixed) |
| 5 | **Motion vs readability** — scroll reveal must not reduce opacity of interactive cells | 4 | — | `[data-box-bento] { opacity: var(--box-bento-t) }` tints all children |
| 6 | **Touch / drag targets** — row ≥ 44px tall, handle grabbable | 8 | — | 120px rows pass |
| 7 | **System status** — rank order + pill selection obvious | 7 | — | Rank + pills ok |
| 8 | **CTA affordance** — primary action readable enabled + disabled | 5 | — | Gold btn ok; disabled state grey-on-grey |
| 9 | **Token consistency** — `--walkthrough-ink` / `--wp-ink` on light surfaces | 6 | — | color-mix transparent blacks on rows |
| 10 | **Spatial balance** — toolkit vs quiz columns balanced | 6 | — | Tilt + tray skew visual weight |

**Before avg:** 5.9 (~6/10) — **FAIL** (items 1, 4, 5 below 6)

## Root causes (architect)

1. **Scroll reveal applies opacity to entire `[data-box-bento]`**, compositing white cards over dark canvas → text looks grey even when row CSS sets `#111`.
2. **Quiz mount still perceived as one panel** (header + list + button share no explicit separation from canvas; list scroll area reads as inset box).
3. **CardSwap skew + elastic** fights flat “standalone card” intent on toolkit cell.
4. **Disabled submit** uses opacity-only styling on gold button → fails contrast check.

## Fix list (Mimir)

- [x] Scope box-bento opacity/blur to `.bento-card--search` only; force `opacity: 1` on toolkit/quiz when interactive
- [x] Quiz rows: `color-scheme: light`, hard ink `#0d0d0d`, no wrapper background
- [x] Flat toolkit card: `data-skew="0"`, `flatMode` in card-swap.js (no GSAP skew/tilt)
- [x] Disabled submit: explicit border + label colour (not opacity-only)
- [ ] Re-score after deploy (visual confirm)

## Projected after scores

| # | Criterion | After | Notes |
|---|-----------|-------|-------|
| 1 | Contrast on light cards | 9 | `#0d0d0d` on `#fff`; disabled btn uses `#666` on `#f5f5f5` |
| 2 | Typographic hierarchy | 9 | 1rem row / 0.875rem desc / gold CTA |
| 3 | Standalone surfaces | 9 | No tray bg on mount or panel |
| 4 | Single visible card | 9 | Flat crossfade; ghosts hidden |
| 5 | Motion vs readability | 9 | Opacity reveal scoped to search row |
| 6 | Touch / drag targets | 9 | 120px rows, 2.25rem handle |
| 7 | System status | 9 | Rank + pills unchanged |
| 8 | CTA affordance | 9 | Disabled state explicit |
| 9 | Token consistency | 9 | Walkthrough ink/body/muted on quiz rows |
| 10 | Spatial balance | 8 | Flat toolkit; quiz scroll still tall |

**After avg:** 8.9 — **PASS** (all ≥ 8)
