# Design system — typography (release token table)

**Audience:** Winston (implementation), John (scope / acceptance), Sally (UX).  
**Source of truth in code:** `:root` in `styles.css` (global tokens). Module layers may reference the same variables.

## Principles

1. **Inter** — reading: body copy, long paragraphs, methodology reveal copy, form fields, intros, testimonial quotes.
2. **Manrope** — voice for product UI: navigation, buttons, chips, section headings (`h2`–`h3` where specified), frame labels, graph legend emphasis.
3. **Source Serif 4** — display / editorial only: methodology close headline (frame 5), contact-sheet editorial accents. Loaded with optical sizes + italic where needed.
4. **System mono** — code, step numbers in monospace contexts.

Do not introduce ad hoc `font-family` stacks in new components; extend tokens below.

## CSS custom properties

| Token | Stack / value | Role |
|--------|----------------|------|
| `--font-body` | `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | Paragraphs, ledes, inputs, methodology lede on frame 5 |
| `--font-heading` | `Manrope, Inter, …, sans-serif` | Page and card titles, polaroid labels, reveal titles |
| `--font-ui` | `Manrope, Inter, …, sans-serif` | Nav, pills, counters, uppercase labels, mic chrome |
| `--font-cta` | `Manrope, Inter, …, sans-serif` | Primary marketing CTAs (buttons, arrow links) |
| `--font-display` | `"Source Serif 4", Georgia, "Times New Roman", serif` | Short display lines at large sizes only |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, …` | Monospace UI |

## Google Fonts bundle

Single `@import` in `styles.css`:

- **Inter** — 400, 500, 600, 700  
- **Manrope** — 400, 500, 600, 700  
- **Source Serif 4** — roman + italic, opsz 8–60, weights 400–700  

## Methodology + layout (related release)

| Token | Purpose |
|--------|---------|
| `--methodology-canvas-bg` | Single continuous background for methodology reel, HUD graph (non-card area), and frame 5 outer beat. **Light:** `#f4efe6`. **Dark:** `#121a28` (set on `html[data-theme="dark"]`). |

Frame 5 **emphasis** is achieved with the **close panel** (contrast, shadow, typography), not a second full-page background color.

## Acceptance checks

- [ ] No body paragraph uses `--font-display`.
- [ ] No long paragraph uses `--font-ui` or `--font-heading` unless it is a titled list or label.
- [ ] Frame 5 primary CTA meets ≥ **4.5:1** contrast; secondary link meets **4.5:1** on the panel background (see implementation in `styles.css`).
- [ ] Lighthouse / axe: methodology CTAs have visible focus rings (already `outline` on `.framework-close__cta:focus-visible`).

## Changelog

- **2026-05-13** — Initial token table; methodology canvas token; frame 5 panel contrast + reel stage-marker alignment (see `styles.css` + `assets/framework-puzzle.css`).
