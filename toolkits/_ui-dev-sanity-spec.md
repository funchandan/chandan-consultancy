# UI dev sanity spec — walkthrough pages

**Source:** Mintlify via `popular-web-designs/templates/mintlify.md`  
**Scope:** `toolkit-article--walkthrough` in `styles.css`  
**Pass:** ≥ 8/10 on sanity scorecard below  
**Reference implementation:** `toolkits/setup-bmad.html`, `_progress/toolkit-walkthrough-design-system.md`

Inspect computed layout in browser or read `styles.css` tokens. Fail if values drift without updating this spec.

## Token contract

| Token | Expected value | Used on |
|-------|----------------|---------|
| `--walkthrough-ink` | `#0d0d0d` | Step titles, headings |
| `--walkthrough-body` | `#333333` | Body copy |
| `--walkthrough-muted` | `#666666` | Labels, step meta |
| `--walkthrough-border` | `rgba(0,0,0,0.05)` | Card borders |
| `--walkthrough-border-medium` | `rgba(0,0,0,0.08)` | Pills, ghost buttons |
| `--walkthrough-radius` | `16px` | Cards, TOC, steps |
| `--walkthrough-radius-sm` | `8px` | Fix boxes, code chips |
| `--walkthrough-doc-green` | `#18e299` | After-compare, success chips |
| `--walkthrough-shadow-card` | `0 2px 4px @ 3% black` | Card elevation |

## Layout rules

| Component | Display | Spacing | Alignment |
|-----------|---------|---------|-----------|
| `toolkit-body` | `grid` 220px + 1fr | `gap: clamp(1.5rem, 4vw, 2.75rem)` | `align-items: start` |
| `toolkit-phase-grid` | `grid` **1 column** | `gap: 1.25rem` | vertical stack only |
| `toolkit-phase-grid > li` | `position: relative` | `padding: 1.35rem 1.4rem` | meta pill `absolute` top-right |
| `toolkit-hero__actions` | `flex` wrap | `gap: 0.65rem` | `align-items: center` |
| `toolkit-meta-strip--pills` | `flex` wrap | `gap: 0.45rem` | inline chips |
| `toolkit-start-panel` | `grid` auto-fit min 260px | `gap: 1rem` | two-column on wide |
| `toolkit-compare` | `grid` auto-fit min 240px | `gap: 1rem` | before/after pair |

## Component sanity (Mintlify)

| Element | Padding | Radius | Flex/justify |
|---------|---------|--------|--------------|
| Primary CTA `.wp-btn--primary` | `0.55rem 1.4rem` | `9999px` | `inline-flex` center |
| Ghost button | `per .button--ghost` | `9999px` | inline-flex |
| Meta pill | `0.32rem 0.8rem` | `9999px` | — |
| Step card | `1.35rem 1.4rem` | `16px` | block stack |
| Checklist item | `padding-left: 1.65rem` | check circle `1.15rem` | absolute `::before` |
| TOC sticky | `1.15rem` padding | `16px` | `position: sticky` |

## Typography

- **Body:** Inter/system, 16px equiv, line-height ~1.55  
- **Code:** Geist Mono — `code`, `.toolkit-terminal`, mono pills  
- **Display h1:** letter-spacing `-0.02em`, weight 600  
- **Section labels:** uppercase, `0.72rem`, tracking `0.06–0.08em`

## Sanity scorecard (0–10)

| # | Check | 0 | 10 |
|---|-------|---|-----|
| 1 | Walkthrough steps are single-column (not cropped card grid) | multi-col | 1-col vertical |
| 2 | Primary CTA styled (ink pill, not unstyled link) | missing | `.wp-btn--primary` |
| 3 | Step header: badge + label + duration pill aligned | overlapping | clear grid |
| 4 | Checklist uses ✓ chips, not raw squares | generic bullets | green circles |
| 5 | Card radius 16px consistent | mixed 8/10/16 | all 16px |
| 6 | Borders use 5% opacity, not heavy grey | thick borders | `walkthrough-border` |
| 7 | Hero gradient + meta pills present | flat hero | `toolkit-hero--walkthrough` |
| 8 | TOC sticky on desktop; static on mobile | broken sticky | `@media max 960px` |
| 9 | Focus/hover states on steps and downloads | none | border + shadow lift |
| 10 | No horizontal scroll on 390px viewport | overflow | fits mobile |

**Pass:** average ≥ 8, no item below 6.
