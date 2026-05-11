# BMAD Narrative System

This file is the source of truth for Chandan Sharma's story, positioning, and case-study writing system.
Use this content to keep all pages cohesive (`about`, `work`, `case studies`, and consulting copy).

---

## 0) Pivot Brand Foundation (Minimal Thought Leadership Portfolio)

### Brand North Star

**Shift:** marketing-SaaS tone -> minimal thought-leadership portfolio  
**Core idea:** publish clear, practical perspective that helps leaders make better product and experience decisions.  
**Working philosophy line:** **Clarity that compounds.**

### One-page Brand Foundation

**Mission:** turn complex UX, growth, and product ambiguity into clear decisions and repeatable outcomes.  
**Positioning statement:** I am a UX strategist and operator who publishes decision-grade thinking grounded in real delivery across education, enterprise, and healthcare contexts.  
**Audience:** founders, product leaders, and teams making high-stakes bets with constrained time and imperfect information.  
**Category stance:** not a high-volume agency voice; a focused thought partner with proven execution depth.  
**Promise:** less noise, stronger judgment, better outcomes over time.  
**Differentiator:** systems thinking from social impact + execution in growth and enterprise environments.

### Brand Principles

1. Signal over noise: every page, sentence, and visual element earns its place.
2. Proof over posture: show method, trade-offs, and outcomes.
3. Calm authority: precise, grounded, and opinionated without hype.
4. Utility first: publish frameworks and insights people can apply.
5. Timelessness: avoid trend-led design and short-half-life language.

### Voice Rules For The Pivot

1. Use executive-readable, composed prose with short declarative lines.
2. Prefer "judgment", "trade-offs", "evidence", and "outcomes" over buzzwords.
3. Avoid inflated claims ("world-class", "revolutionary", "disruptive").
4. Lead with what changed for users/business, then explain how.
5. Write to be bookmarked and reused, not skimmed and forgotten.

---

## 1) Brand Positioning

**Name:** Chandan Sharma  
**Positioning:** Minimal thought-leadership portfolio for UX strategy, growth judgment, and execution clarity  
**Core Promise:** I help teams make clearer product and experience decisions that improve user and business outcomes together.  
**Differentiator:** I combine social-impact systems thinking, deep UX research, and measurable execution in complex environments.

---

## 1A) Homepage Narrative Wireframe (Thought-Leadership Direction)

Use this as the default information architecture, copy sequence, and interaction intent for `index.html`.

### Section-by-section wireframe

1. Hero: point of view first
   - Goal: establish authority, audience fit, and decision value in one viewport.
   - Eyebrow: `UX Strategy and Growth Judgment`.
   - H1 pattern: "I help <audience> make <type of decision> with clarity."
   - Supporting copy pattern: 1-2 lines on complexity handled and outcomes unlocked.
   - Primary CTA: `View Work`.
   - Secondary CTA: `Book a strategy audit`.
   - Optional tertiary text link: `Read brand philosophy`.
2. Proof strip: signal in 5 seconds
   - Goal: replace abstract credibility claims with concrete operating context.
   - Content pattern: 3-5 proof chips (example categories: domains, scale, risk level, decision types).
   - Tone: factual labels, no celebratory language.
3. Featured perspectives: thought leadership core
   - Goal: show distinctive thinking, not content volume.
   - Module: 2-3 featured essays/frameworks with title + 1-line takeaway.
   - CTA pattern: `Read perspective`.
   - Rule: each card must answer "what new decision quality does this give me?"
4. Selected case narratives: evidence layer
   - Goal: connect ideas to shipped outcomes.
   - Card anatomy: context -> key decision -> method snapshot -> measurable result.
   - CTA pattern: `View case study`.
   - Rule: no long feature lists; emphasize decision logic and trade-offs.
5. Operating model: how engagement works
   - Goal: reduce buyer ambiguity on process.
   - 3-step model: diagnose -> decide -> de-risk execution.
   - Each step: one method line + one output line.
6. Offerings (segmented products vs services)
   - Goal: make purchase model clear at first glance.
   - Keep `tablist` structure from UX standards in this doc.
   - Card pattern remains consistent: title -> outcome -> contrast -> tools -> handover -> CTA.
7. Final CTA: calm conversion
   - Goal: invite focused inbound with clear expectation-setting.
   - Copy pattern: "Share your decision context. I will respond with a focused recommendation."
   - Primary action: `Start a conversation`.
   - Support line: response timeline and scope qualifier.

### Homepage copy skeleton (draft-ready)

- Hero headline options:
  - `Clarity for high-stakes product and UX decisions.`
  - `Thoughtful strategy for teams shipping in complexity.`
  - `From ambiguity to decision-ready direction.`
- Proof strip examples:
  - `Education, enterprise, healthcare`
  - `0->1 and scale-stage decisions`
  - `Research + growth + execution`
  - `Risk-sensitive workflow design`
- Final CTA support-line example:
  - `Best for teams navigating a real product, growth, or UX trade-off in the next 4-8 weeks.`

### Homepage acceptance checklist

- Does the first fold communicate audience, problem-space, and promise in under 10 seconds?
- Can each section be scanned in under 20 seconds without losing the narrative thread?
- Is every strategic claim matched by evidence, method, or concrete context?
- Is the page quotable (at least one strong point-of-view line per major section)?

---

## 1B) Visual System Starter (Look And Feel)

### Art Direction

- Minimal editorial aesthetic with generous whitespace.
- High contrast, low ornamentation, restrained motion.
- Emphasis on typography, structure, and argument quality.

### Type Pairings (starter options)

Choose one pairing and use it consistently across pages.

1. Editorial premium (recommended)
   - Display/insight serif: `Fraunces`
   - Body/UI sans: `Inter`
2. Classic authority
   - Display/insight serif: `Source Serif 4`
   - Body/UI sans: `IBM Plex Sans`
3. Contemporary strategy
   - Display/insight serif: `Lora`
   - Body/UI sans: `Manrope`

### Typography tokens (example)

```css
:root {
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-ui: var(--font-body);

  --text-xs: 0.75rem;   /* 12 */
  --text-sm: 0.875rem;  /* 14 */
  --text-md: 1rem;      /* 16 */
  --text-lg: 1.125rem;  /* 18 */
  --text-xl: 1.25rem;   /* 20 */
  --text-2xl: clamp(1.5rem, 2vw, 2rem);
  --text-3xl: clamp(2rem, 4vw, 3rem);

  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
}
```

### Color tokens (minimal thought-leadership palette)

```css
:root {
  --color-bg: #f6f5f2;
  --color-surface: #ffffff;
  --color-text: #171a1f;
  --color-text-muted: #4f5866;
  --color-border: #d9dde4;
  --color-accent: #2f6fed;
  --color-accent-strong: #1f52b8;
  --color-focus: #2f6fed;
  --color-success: #1f7a4a;
  --color-warning: #8a5a00;
}
```

### Color usage rules

- Keep accent usage below ~10% of visible UI.
- Use neutral tones for structure; reserve accent for navigation, links, active states, and CTAs.
- Maintain WCAG 2.2 AA contrast for text, controls, and focus states.

### Spacing scale (4-based modular system)

```css
:root {
  --space-1: 0.25rem;  /* 4 */
  --space-2: 0.5rem;   /* 8 */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-5: 1.25rem;  /* 20 */
  --space-6: 1.5rem;   /* 24 */
  --space-8: 2rem;     /* 32 */
  --space-10: 2.5rem;  /* 40 */
  --space-12: 3rem;    /* 48 */
  --space-16: 4rem;    /* 64 */
  --space-20: 5rem;    /* 80 */
}
```

### Layout rhythm tokens

```css
:root {
  --layout-max: 1160px;
  --layout-pad: clamp(20px, 4vw, 40px);
  --section-gap: clamp(56px, 8vw, 96px);
  --card-pad: clamp(16px, 2.4vw, 24px);
  --radius-card: 14px;
  --radius-pill: 999px;
}
```

### Component spacing presets

- Hero block: `--space-20` top/bottom rhythm, `--space-6` between headline and supporting copy.
- Section intro: `--space-4` between eyebrow and title, `--space-4` between title and lead.
- Card internals: `--space-3` micro gaps, `--space-5` major content splits.
- CTA groups: minimum `--space-3` between actions on desktop, stack with `--space-3` on mobile.

### Layout + Component Rhythm

- Use a consistent editorial grid with stable vertical spacing.
- Prefer clear blocks over dense multi-column complexity.
- Keep line length readable (`min(60-72ch)` for long-form desktop body copy where appropriate).
- Preserve card rhythm: title -> outcome -> contrast -> tools -> handover -> CTA.

### Motion + Interaction

- Use motion only for affordance and orientation, not decoration.
- Keep transitions subtle and brief; honor `prefers-reduced-motion`.
- Hover effects only on fine pointers; touch behavior remains stable.

### Imagery + Visual Assets

- Prioritize diagrams, frameworks, and process artifacts over stock-heavy compositions.
- Use photography sparingly, with documentary tone over staged marketing gloss.
- Each image must teach or prove something; no filler visuals.

### Design QA Filters (Before Publish)

1. Clarity: can a busy decision-maker scan and understand the page fast?
2. Credibility: do claims have visible proof or logic?
3. Coherence: do copy, typography, and interaction feel like one system?
4. Consistency: are tokens used instead of one-off values?
5. Accessibility: do contrast, focus, motion, and target sizes meet WCAG 2.2 AA?

---

## 2) Cohesive Career Narrative (Long Form)

I started my journey by helping scale Scraplabs, a business that grew to around $45M. While working on growth, one question stayed with me: what if access to quality education was not limited by income?

That question led me to Teach For India, a highly selective fellowship where I spent two years as a government school teacher in one of Asia's largest informal settlements. This chapter shaped how I think about impact at scale: meaningful change happens when systems are designed to build agency for individuals and communities.

During this period, I led and contributed to interventions such as mixed-gender sports programs (including mixed-gender frisbee), alumni-engagement and fundraising systems, and mentorship projects with UNDP. I learned how to combine field insight, community trust, and data-informed decision-making.

I then brought that lens into early-stage product building at WhiteHat Jr, where I worked on the prototype, value proposition testing, and go-to-market strategy for an online "Create with Math" offering. I helped run beta launch programs, secure early users, and track traction through feedback and NPS signals. My role blended UX management and partnerships.

After WhiteHat Jr became BYJU'S Future School, I led the math vertical and worked on category growth through gamified learning products and partnerships, including initiatives connected to Roblox and Tynker for India. I also led high-stakes diagnostics, including investigations into major subscription revenue decline in the US market, to identify root causes and improve retention thinking.

Next, at Birlasoft as a Senior UX Consultant, I worked on enterprise-scale systems with high operational impact. For Stryker (healthcare), I helped design backend and workflow experiences supporting robotic-surgery-related operations, with attention to compliance, risk-sensitive notifications, and reliability in edge cases. For HP, I worked on AI-assisted service workflows for field agents, focused on faster diagnosis, better part-ordering journeys, and reduced turnaround time.

Across these roles, my work has stayed consistent: understand users deeply, design for complex real-world constraints, and connect UX quality to measurable business performance.

---

## 3) Short Bio Versions

### 30-second version

I am Chandan Sharma, a UX and growth consultant with experience across edtech, social impact, healthcare, and enterprise operations. I have scaled products from early traction to category growth, led UX research and strategy, and designed high-stakes workflows where user experience directly affects business outcomes.

### 1-line version

I help teams turn UX insight into growth by combining research rigor, systems thinking, and execution.

---

## 4) Signature Themes To Repeat Across Website

1. Access and agency: design should expand opportunity, not just improve screens.
2. Evidence-led decisions: blend qualitative research with quantitative signals.
3. Growth with depth: acquisition, retention, and experience quality must align.
4. Complex environments: healthcare, education, and enterprise need edge-case-first UX.
5. Human + business outcomes: better user outcomes create stronger business outcomes.

---

## 5) Case Study Master Template

Use this structure for each case study page:

1. Context
   - Company, market, product stage, and your role.
2. Problem
   - The core user/business challenge with stakes.
3. Constraints
   - Time, compliance, technical limits, org constraints.
4. Approach
   - Research methods, frameworks, experiments, and design process.
5. Key Decisions
   - Trade-offs made and why.
6. Solution
   - What was built, changed, or launched.
7. Outcomes
   - Metrics (revenue, retention, activation, NPS, adoption, TAT, etc).
8. What I Learned
   - Reflection and reusable principles.

---

## 6) Suggested Case Studies To Build Next

1. Teach For India: Designing agency-led interventions in underserved communities.
2. WhiteHat Jr / BYJU'S Future School: Building and scaling "Create with Math."
3. BYJU'S Future School: Gamification partnerships and category growth strategy.
4. BYJU'S Future School: Diagnosing subscription revenue decline in the US.
5. Birlasoft x Stryker: UX for compliance-heavy healthcare operations.
6. Birlasoft x HP: AI-assisted field service workflow optimization.

---

## 7) BMAD Roles Applied To Content Creation

Use these role prompts when writing or refining any page.

- Analyst
  - Define the audience, goal, and key proof for this page.
- Product Manager
  - Clarify the content objective (trust, conversion, authority, hiring, etc).
- Architect
  - Choose page structure and information hierarchy.
- UX Designer
  - Shape readability, narrative flow, and section-level clarity.
  - **Navbar authority style (minimal thought-leadership):** navigation must feel quiet but intentional, not faint. Use a stable header surface, clear typographic contrast, and subtle active/hover states that are visible at first glance. Avoid "invisible links" patterns where nav items look like plain body text.
  - **Hero -> section continuity:** the first section after hero must read as part of one narrative flow (shared spacing rhythm, aligned visual weight, and no abrupt density drop). Avoid large dead air gaps, sharp style jumps, or disconnected background treatments between hero and the next section.
  - Hero “resources” panels: do not cap body copy with a very tight `max-width` (e.g. low `ch`) inside a wide card—it causes awkward wraps and orphaned words; prefer `min(ch, %)` or let the copy use the card width with padding only.
  - **Offerings (Products vs Services):** use a **segmented control** (`role="tablist"` / `tab` / `tabpanel`) so buyers know which **purchase model** they are browsing—never mix product and service cards in one undifferentiated grid. Each card uses the **same visual rhythm**: **title → outcome line → contrast line → tool stack (Figma + delivery tools) → short handover list → single CTA**—coherence beats clever layout variance. **Do not** show per-card “Product/Service” chips (the tab states the lane). **Do not** show uppercase micro-labels like “Walk away with” / “Differentiator”; hierarchy and spacing carry meaning (see §12).
  - **Offerings polish:** keep body copy **lighter** (weight and color hierarchy) and **short**—lead with one scannable outcome, then handover. Use **motion for affordance** (card lift, rail emphasis, CTA lift) at modest amplitude; respect **`prefers-reduced-motion`**. Decorative gradients stay **low contrast** so text remains primary.
  - **Mobile / narrow (UX-approved layout):**
    - **Touch targets:** primary nav links and offerings **tablist** controls aim for **≥44px** hit height (padding + line box), not icon-only mystery meat.
    - **Segmented tabs:** on narrow widths the control is **full-width** with **equal columns** (Products | Services) so it never overflows horizontally or feels like a desktop chip pasted on phone.
    - **Line length:** use **`min(52ch, 100%)`** (or card padding only) for hero lead and section intros so copy never rides a tighter measure than the viewport on phones—same rule as spotlight panels (**no orphan `ch` caps** narrower than the card).
    - **Hover vs touch:** reserve **lift / shadow / micro-nudge** hover treatments for **`@media (hover: hover) and (pointer: fine)`** so taps on touch devices do not leave “stuck” hover states and motion still reads as intentional where hover exists.
    - **Hero fold:** one clear **primary** row (e.g. View Work) and **secondary** (audit / mail)—on the narrowest widths stack CTAs **single column full width** so thumbs do not compete for one row.
    - **Safe areas:** sticky header (and full-bleed footers if any) respect **`env(safe-area-inset-*)`** so notched devices do not clip brand or nav.
- Design Agent
  - Acts as the final visual-and-copy coherence gate before publish.
  - Must approve any new or revised copy push (including microcopy, CTAs, nav labels, and case-study edits) before merge.
  - Verifies wording and layout alignment with hierarchy, readability, and brand system constraints.
  - Scope is explicit and complete for interactive UI typography: navbar link buttons, mobile menu toggle, theme toggle, Products/Services tab buttons, offering card action buttons, hero CTAs, and dialog close controls must all use the approved CTA/UI geometric family token (`--font-cta`/`--font-ui`) with no one-off overrides.
  - Must verify **cross-section continuity** on homepage: nav -> hero -> first content section should feel like one system in spacing, typography, and surface treatment before approving.
  - Dark-theme scope rule: when a dark visual direction is approved, it applies to the **entire homepage system** (header/nav, hero, post-hero sections, cards, and CTAs), not only the hero block.
  - Button shape + border rule: all actionable controls (navbar buttons, toggles, tabs, CTAs, dialog close) must be **borderless** and **square-cornered** (`border: none`, `border-radius: 0`) unless a written exception is approved in sign-off.
  - Navbar typography rule: navbar buttons must match the CTA/UI family (or brand-name control family if intentionally unified); no serif navbar controls.
  - Surface blending rule: navbar controls and all button variants must use **transparent/background-blended surfaces** (no filled/glass pill backgrounds) so controls read as part of the page surface rather than separate tiles.
  - CTA color direction (PO + UX): CTA text and spotlight CTA/support copy must use **vibrant, optimistic brand accents** (not flat gray/black defaults), while preserving readable contrast in both themes.
  - No overlap rule (PO + UX): navbar links and CTAs must remain visually distinct patterns (nav = lightweight wayfinding; CTA = action-oriented control) so users never confuse navigation with conversion actions.
  - Body/headline coherence rule: body paragraphs must stay on the approved complementary sans body token and be reviewed against serif headline pairing for visual coherence before merge.
  - Any recommendation pushed to implementation must pass UX standards and required accessibility compliance (WCAG 2.2 AA minimum: contrast, focus visibility, keyboard flow, target size, and motion safety).
  - Compliance is non-negotiable: if UX/WCAG checks fail, the Design Agent returns `Reject` until corrected and revalidated.
  - **UI Agent wetting gate (BMAD/Beemind):** before merge, the UI Agent (UX Designer role) must explicitly approve that button and section surfaces blend with page backgrounds and that no out-of-system filled control backgrounds remain.
  - **PO alignment gate:** Product Owner confirms CTA color tone fits positioning (“confident, cheerful, elegant”) and preserves hierarchy between primary and secondary actions.

### Design implementation pathway (stakeholders in room before ship)

1. **Product Owner + UX Designer + Design Agent** align the visual intent (typography pairing, button shape rules, hierarchy constraints).
2. **Developer** maps intent to tokens/classes and confirms no one-off overrides or component drift.
3. **QA Engineer** validates interaction behavior and WCAG gates (contrast, focus, keyboard, motion, target size).
4. **Final gate:** Design Agent confirms parity between intent and implementation, then sign-off sheet is completed.

### PRD — Mobile-first gutters & density (ship in CSS tokens)

| Requirement | Implementation | Acceptance |
|-------------|------------------|--------------|
| **Screen gutters** | On **`≤768px`**, set **`--layout-pad: max(24px, 6vmin)`** (and on **`≤640px`** optionally bump to **`max(24px, 6.5vmin)`**); apply **`body { padding-inline: env(safe-area-inset-*) }`** so notched insets are not eaten by content. **`.home-page .shell` MUST NOT use a tighter clamp than `.shell`**—one gutter token drives all shells. Width: **`min(--layout-max, calc(100% - 2×var(--layout-pad)))`**. | Visual audit at 320 / 375 / 390: no text or buttons flush to the glass. |
| **Body scale** | On `≤640px`, base **`body` font-size** steps down slightly (e.g. **15px**) with comfortable line-height so paragraphs read “mobile-native,” not shrunk desktop. | Lead and card copy feel intentional, not identical to 1440px. |
| **Card padding** | Offering cards use **`--offering-pad-x` / `--offering-pad-y`** with larger values on narrow viewports (vw-based mins). | Card interiors match reference-level breathing room (`assets/reference-offerings-bcg.png`). |
| **Primary actions** | Offering CTAs use **full width**, **min-height ≥44px**, and **balanced / anywhere** wrapping for long mailto labels. | Thumb reach and no horizontal scroll. |

### Lighthouse / DevTools mobile audits

- **Viewport:** every HTML page ships `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` so the **layout viewport** matches device width (Lighthouse “viewport” + “meta-viewport” audits).
- **When CSS “mobile” runs:** layout overrides live under **`@media screen and (max-width: 768px)`** and **`640px`**. Lighthouse **mobile** preset uses a **screen** form factor (e.g. ~412px CSS width by default)—those queries **do apply**. Run audits over **`http://localhost`/`127.0.0.1`**, not `file://`, so behavior matches deployed pages.
- **Headless screenshots** (e.g. Chrome `--window-size=390,…`) are **smoke checks**, not a substitute for a real device or Lighthouse’s filmstrip:
  - Default headless capture is often **1× DPR**, so type and icons look **softer or “cheap”** than on a 2×/3× phone when you zoom the PNG.
  - One **very tall** full-page image reads as **cramped** when the viewer scales it down to fit the screen.
  - Repo artifact **`mobile-preview-390.png`** is regenerated with **`--force-device-scale-factor=2`** over **http://127.0.0.1** (so width is **780px** = **390 CSS px** at 2×)—open at **100%** or **50%** zoom for a fair read.
  - Trust **Lighthouse** for tap-target and legibility audits, and **CSS breakpoints** for which layout applies.

### PRD — Mobile primary navigation (menu + sheet)

| Requirement | Implementation | Acceptance |
|-------------|----------------|------------|
| **No tall multi-column link grids on phone** | At **`≤768px`**, hide the horizontal desktop row (`.nav-links--desktop`); show a single **menu** control (`.nav-menu-toggle`, **≥44px** hit area) that opens a **native `<dialog>`** bottom sheet (`.site-nav-dialog`) with the same destinations in a **single column** (`.nav-links--dialog`). | Header stays one short row (brand + control); sheet lists links with comfortable tap spacing. |
| **Desktop** | At **`≥769px`**, hide toggle + dialog; show `.nav-links--desktop` as today. | No duplicate menus; no layout shift regressions. |
| **A11y** | Toggle: **`aria-expanded`**, **`aria-controls`** → dialog `id`. Dialog: **`aria-labelledby`** title; **Close** uses **`form method="dialog"`**. **`assets/site-nav.js`**: `showModal` / `close`, return focus to toggle on **`close`**, **`aria-expanded`** synced. | Keyboard: open, **Escape** closes (native), **Tab** traps in modal; screen reader announces dialog. |
| **Every page** | Any page with `<nav>` duplicates the **same** link set in desktop + dialog blocks; root has **`data-site-nav`** and loads **`assets/site-nav.js`** (defer). | Mobile menu works on work, case studies, about, consulting, brand guidelines, and home. |
| **In-page anchors (home)** | When the URL hash matches a nav `href` (`#resources`, `#approach`), that link carries **`.active`**; changing the hash updates both desktop and sheet lists so the highlighted item matches the section. | No “Work” pill active while the address bar shows `#approach`. |

### User story — Navbar v3 mobile (editorial priority)

- **As a mobile visitor**, I want a calm, compact header that preserves reading space so I can orient quickly and continue into content without UI clutter.
- **As a returning visitor**, I want the same core destinations every time so I can navigate by recognition, not memory.
- **As a keyboard and assistive-tech user**, I need the menu state and focus to be predictable so navigation remains fast and trustworthy.

#### Acceptance criteria

1. At **`<=768px`**, first row remains **Brand + Menu** only; header height stays compact and does not wrap.
2. Menu opens a single-column sheet with the same destinations as desktop and clear tap targets (`>=44px` preferred, never below 24px WCAG exception floor).
3. Menu state exposes accurate semantics (`aria-expanded`, dialog label, focus return on close, Escape closes).
4. Active destination styling remains visible in both light/dark themes and does not rely on hover.
5. Reduced-motion users get functional state changes without large animated transitions.

### A/B plan — muted/soft contrast tokens

- **Goal:** compare readability + visual energy for muted text in light and dark themes without changing IA/layout.
- **Plan A (`?ab=a`)**: *Ink Neutral* muted scale (stronger editorial slate).
- **Plan B (`?ab=b`)**: light mode keeps neutral readable text and introduces controlled gold accents; dark mode shifts to white-forward text hierarchy.
- **Switching rule:** URL query `ab=a|b` sets `data-color-plan` and persists in `localStorage` (`site-color-plan`) for subsequent page loads.
- **Evaluation focus:** paragraph readability, metadata clarity, heading presence, and perceived vibrancy in dark mode.

- Data/Analytics Specialist
  - Insert measurable proof points and metric framing.
  - When planning or narrating **how** evidence was produced, use **§16** (`Research Methods Mapper`) to pick **feasible** quant + qual methods for the solution shape and to draft **methodology copy** (especially quant) that matches the **§15** evidence ladder.
- QA Engineer
  - Check accuracy, consistency, grammar, and claim credibility.

---

## 8) Voice and Style Rules

1. Write in first person, plain English, no jargon-heavy inflation.
2. Lead with outcomes, then explain method.
3. Keep claims specific and defensible.
4. Show cross-functional leadership without sounding vague.
5. Balance mission-driven intent with commercial clarity.
6. On **buyer-facing** pages (home, work, case studies, consulting, about), keep prose in **composed, executive-readable sentences**—**§15 Part H (EC-01–EC-08)**: avoid obvious **AI-tell** (em-dash sprawl, staccato stacks, comma splices, hollow intensifiers); register should feel at home next to **BCG / Deloitte / IBM**-style insight copy, not social captions.

---

## 9) Placeholder Metrics To Fill In Later

Replace these with verified values before final publishing:

- Scraplabs growth timeline and exact contribution scope.
- WhiteHat Jr beta user count and activation rate.
- NPS trend over launch periods.
- BYJU'S math vertical performance metrics.
- Revenue recovery or retention impact after US diagnostic work.
- Stryker and HP impact numbers (turnaround time, error reduction, productivity gains).

---

## 10) Architect: commits, timing, and verification

Use this as the system layer for how and when you ship changes to the portfolio repo. Goal: small, reviewable commits; nothing accidental in history; easy rollback.

### When to commit

1. **After a coherent unit of work** — one narrative or one system change (e.g. “nav + border tokens” or “Stryker case study page”), not half a card and unrelated CSS.
2. **Before you switch context** — end of session, before meetings, or before trying a risky experiment (branch or stash first if experimenting).
3. **Before merge or share** — rebase or merge only when `git status` is clean and checks below pass.
4. **Not** on every keystroke — batch copy and asset tweaks so history stays readable.

### What to commit (and what not to)

**Include**

- Site HTML, CSS, and any assets that belong on the public site.
- `bmad.md` when narrative, positioning, or workflow rules change.

**Exclude (do not add)**

- `.cursor/` — IDE/agent local state; add `.gitignore` entry `.cursor/` if it keeps appearing.
- Secrets: API keys, client-only PDFs, unpublished metrics, private email unless you intend them public.
- Generated junk: OS files (`.DS_Store`) if you add a global or repo ignore.

**Granularity**

- Prefer **one commit per theme**: e.g. `feat(site): Stryker + HP case studies and work index` vs mixing unrelated `about.html` rewrites in the same commit unless they are one deliberate “launch slice”.

### Suggested commit message shape

- `feat(site): …` — new pages, sections, case studies.
- `fix(site): …` — broken links, typos, nav mistakes.
- `style(css): …` — borders, tokens, layout only.
- `docs: …` — `bmad.md` or README-only.

First line ~72 chars; body optional for “why” and “what changed for the reader”.

### Pre-commit checklist (Architect + QA)

Run locally before `git add` / commit:

1. `git status` — only files you mean to ship; no surprise paths.
2. `git diff` — scan for placeholder copy, wrong client names, or accidental deletes.
3. **Links** — open `index.html`, `work.html`, each case study; click nav and primary CTAs (or grep `href=` against filenames you ship).
4. **One voice** — brand/footer/nav match across pages you touched (legacy pages may still say “Your Name” until updated).
5. **Claims** — no new hard metrics unless verified (see section 9).

Optional if you add tooling later: HTML validator, Lighthouse, or a static server preview.

### Homepage release checks and balances (PO-owned)

Use this gate before approving homepage visual/copy updates. Goal: prevent regressions between dark and light modes and keep first-fold quality stable.

**Role responsibilities**

- **Product Owner:** final approve/reject against hierarchy, readability, and brand-fit in both themes.
- **UX Designer:** verify scan order, spacing rhythm, and non-overlap rules (nav vs CTA).
- **Design Agent:** verify copy + visual coherence and compliance with UX/WCAG contract.
- **QA Engineer:** execute script-assisted checks and record pass/fail evidence.
- **Developer:** fix regressions and keep selectors/tokens clean (no one-off overrides).

**Script-assisted checks (run from repo root)**

```bash
# 1) Baseline mobile smoke screenshot (390 CSS px @ 2x DPR)
bash scripts/capture-mobile-preview.sh

# 2) Full homepage gate evidence (dark/light + desktop/mobile)
bash scripts/test-homepage-gates.sh

# 3) Git change sanity (what is being shipped)
git status -sb
git diff --stat
```

**PO goals for next version (non-negotiable)**

1. Hero/background blend has no overlap or tear artifacts at section boundaries.
2. Hero visual is directly relevant to the narrative (decision systems, UX, AI operations), not decorative filler.
3. Testing evidence is generated and reviewed before sign-off (dark/light + desktop/mobile screenshots + manual checklist).

**Component spec artifact requirement**

- For any homepage component redesign, attach a dedicated spec file (example: `services-offering-component-spec.md`) covering: product intent, information hierarchy, states/interactions, accessibility, and QA definition of done.

**Mandatory manual checks (cannot be skipped)**

1. **Theme parity:** test homepage in both `dark` and `light` using the theme toggle; refresh after each toggle to confirm persistence.
2. **First-fold contrast:** H1, lead, proof, and CTAs are readable at first glance in both themes.
3. **Hierarchy scan test (5 seconds):** promise -> proof -> action is clear without zooming.
4. **Pattern distinction:** nav remains wayfinding; CTAs remain action controls (no overlap confusion).
5. **Responsive check:** validate desktop and 390-width behavior (no overlap, clipping, or collapsed tap targets).
6. **Focus + keyboard:** visible focus rings and logical tab order through nav, hero CTAs, and supporting panel.

**PO release rule**

- If any check fails, mark status `Reject`, log the failing check in one line, and rerun the full gate after fixes.

### Checks run now (template for your machine)

Execute from repo root:

```bash
git status -sb
git diff
git diff --stat
```

**Interpretation**

- **Clean working tree, nothing to commit** — either already committed or edits not saved; confirm files on disk.
- **Untracked only** — `git add` the HTML/CSS/docs you want versioned; leave `.cursor/` out.
- **Mixed tracked + untracked** — add tracked changes in logical groups; decide whether legacy pages (`about.html`, `consulting.html`, `case-study-1.html`, `brand-guidelines.html`) go in the same commit or a follow-up “align legacy nav” commit.

### After commit

- `git log -1 --stat` — confirm files and message.
- If using remote: `git push` after branch is ready; use PR for anything non-trivial so diff stays reviewable.

---

## 11) Homepage journey: post-hero content (Practice vs news vs resources)

Use this to decide what sits **right after the hero** and how **blogs, playbook, and Substack** fit the full journey.

### Primary personas (implicit ICP)

1. **Cold evaluator** — founder, product lead, or enterprise stakeholder landing once: “Who is this, what do they do, is it relevant to us?”
2. **Warm researcher** — comparing consultants, checking case depth and POV before a call.
3. **Return reader** — came from social, search, or referral; wants **fresh insight** or a specific resource (playbook, essay).

Personas 1 and 2 dominate **first session conversion** (trust, work, contact). Persona 3 dominates **repeat visits** and **list growth** (Substack, long-form).

### Journey stages on the homepage

1. **Orient** — Hero: who you are, promise, primary CTAs; spotlight should be a **horizontal featured-perspective strip under CTAs** (same fold), not a competing side card.
2. **Believe** — Proof of *how you think and operate* (offerings: **Products vs Services** tabs + outcome language).
3. **Deepen** — Selected work / case studies.
4. **Subscribe or return** — Insights, playbook, newsletter, Substack (do not hide this, but do not let it steal step 2 from cold traffic).

### Recommendation (Architect + PM)

**Default: keep Offerings (Products / Services) immediately after the hero.**

- For cold traffic, “Latest news” first reads like a **media site**, not a **consulting practice**—you delay the answer to “what do you actually offer?”
- Your **differentiator** (section 1) is research + systems + growth; the **tabbed offerings** answer both “what can I buy?” and “when do I hire you?” in one block.

**Do not choose** “only industry newsletter articles” as the sole post-hero block for the same reason unless your primary goal is audience business over consulting leads.

### Where “pathbreaking” / blog / Substack should live

Use a **split strategy**, not a forced either-or:

| Need | Treatment |
|------|------------|
| High-level clickable insights | A **compact “Insights” or “Resources” strip** (2–3 cards or links): e.g. playbook + newest note + “Read on Substack.” Keep titles **outcome-led**, same voice rules as section 8. |
| Long-form habit | **Substack (or similar) as canonical** for essays; the site teases and links out—avoid duplicating full posts in static HTML unless SEO is the explicit goal. |
| Industry + practice specificity | Tag or badge each item (**e.g. Healthcare · AI ops · EdTech**) so one rail serves both dimensions without a separate “industry blog” chrome. |

**Placement options** (pick one and stay consistent):

1. **Practice first, Insights second** (recommended for your positioning) — strongest for personas 1–2; persona 3 scrolls one section.
2. **Thin Insights row directly under hero, then Practice** — acceptable if the strip is **short** (one row, no carousel bloat) so “latest” feels like seasoning, not the main meal.
3. **Merged section** — One heading (e.g. “How I work — and what I’m publishing”) with two clear sub-rows: row A = offerings or insights, row B = 2–3 insight links. Higher cognitive load; use only if you want a single scroll “chapter.”

### What to avoid

- Replacing offerings with a **full blog index** immediately after hero on v1—you lose the capability and purchase-model signal for evaluators.
- Labeling the strip **“Latest news”** if items are evergreen guides—prefer **“Insights”**, **“Notes”**, or **“Resources”** so expectations match substance.
- Multiple competing primary CTAs in the first two folds—keep one clear “Work” path + one optional conversation action; featured perspective remains a secondary strip.

### BMAD roles (quick check)

- **Analyst** — Who is the dominant visitor this quarter (leads vs audience)? That decides 1 vs 2 ordering above.
- **PM** — One primary goal per fold: hero = identity + soft CTA; next = credibility (offerings) or attention (insights); measure clicks on Work vs Substack vs product CTAs.
- **Architect** — If you add an Insights strip, keep it **one visual density** below offerings or one row above—do not stack three heavy patterns (hero + dark card + dense grid + carousel).
- **UX Designer** — Same typography and token discipline as the rest of the site; off-site links should say where they go (“Read on Substack”).
- **QA** — Every teaser link resolves; no empty “latest” slots.

---

## 12) Offerings: Products vs Services (homepage)

The homepage **Offerings** block uses **two tabs** so visitors immediately know **how they buy**:

| Tab | Intent | Who it serves |
|-----|--------|----------------|
| **Products** | Fixed-scope packages and builds (clear ownership, timelines, support model) | MSMEs, professional firms, founders who want something **shippable** without hiring a full team first. |
| **Services** | Embedded and high-touch work (AI + UX + engineering + security posture) | Enterprises, startups, and teams reviewing your **profile** for complex delivery. |

**Product line (MVP names—keep or rename as GTM evolves)**

- **Builder Pro** — Own-the-stack digital: native-grade experiences, **code in client-controlled repos**, security-first defaults, dedicated implementation support.
- **Launchframe** — Credibility web for **law / CA / clinic** style firms: trust flows, WhatsApp/enquiry patterns, bounded go-live.
- **Pilotboard** — Packaged **diagnosis sprint**: friction map, conversion review, AI-readiness → prioritized backlog.

**Service line (niche, marketable)**

- Embedded product and engineering · UX strategy and design systems · Brand to digital experience · Custom secure applications · **Cybersecurity + AI workflow UX** (human oversight, trust, and hardening as one story).

### Visual reference (BCG-style minimal tiles)

Internal reference screenshot (not for public hotlinking): **`assets/reference-offerings-bcg.png`**. Use it for **radius, whitespace, and “no inner border” separation**—translate to our **indigo + teal** system and existing type scale; do not clone BCG lime CTAs wholesale (keep our gradient / outline patterns).

### Roles when changing this block

- **Product Architect** — Tabs remain the **purchase-model** switch; card copy still answers “what do I get?” vs “when do I hire you?” without duplicating that in every card header.
- **UX Designer** — Scan path is **title → outcome → contrast → icons → bullets → CTA**; no redundant labels; **Figma** appears **first** in the tool row whenever design delivery is in scope.
- **Developer** — Implement **visually hidden** (`visually-hidden`) headings for handover lists where visible H4s were removed; keep **keyboard** tablist behavior; tool icons from **Simple Icons CDN** (MIT) with `referrerpolicy="no-referrer"`; respect **§7 mobile PRD** tokens.

### Card contract (updated — do not break)

1. **Tab context** — **Products** vs **Services** is explicit in the tablist; cards do **not** repeat a Product/Service chip.
2. **`title`** — `<h3>` proper noun or crisp service name.
3. **`outcome`** — first body line: **owned outcome** in plain language (same substance as legacy “walk away” copy, **without** the “You walk away with” label).
4. **`context`** — second body line: **contrast vs siblings** or adjacent packages (same substance as legacy “differentiator”, **without** the “Differentiator” pill).
5. **`tool strip`** — **Figma first** when design is part of delivery; then **2–4** recognizable stack marks (Git, Loom, Notion, etc.) in **soft pill** containers; `aria-hidden` on the strip if list copy names artifacts.
6. **`transfer` list** — **two** short bullets max; optional **visually hidden** `<h4>` for screen readers (“What you receive” / “What you receive during the engagement”).
7. **`CTA`** — **one** full-width control; copy matches the **next sales step**; optional trailing **→** affordance via CSS class.

**Voice:** Unchanged—products still stress **ownership + tangible handover**; services stress **embedded delivery + artifacts** procurement can file.

---

## 12A) Homepage Visual Direction — Future Glass System

Use this as the homepage styling contract when modernizing buttons, highlights, borders, shadows, and panel surfaces. Intent: **future-forward, premium, calm**, not noisy “Web3 glow” and not legacy flat enterprise UI.

### Cross-functional ownership

- **Product Owner (PO):**
  - Define the perception goal: “high-trust boutique consultant with modern product fluency.”
  - Protect conversion clarity: visual polish must not reduce CTA legibility or scan speed.
  - Approve final visual delta only if it improves trust at first glance.
  - Own theme-parity acceptance: both light and dark modes must pass first-fold readability and hierarchy checks before release.
- **Analyst:**
  - Validate that emphasis hierarchy is still obvious (hero claim -> primary CTA -> proof blocks).
  - Flag any styling that inflates decoration over evidence.
  - Run quick before/after audit for readability and click intent on desktop + mobile.
- **UX Designer:**
  - Translate into a coherent component language and spacing rhythm.
  - Keep contrast, focus states, and motion accessibility compliant.
  - Ensure one visual grammar across hero, offerings, and case cards.
- **Engineer:**
  - Implement in CSS tokens first, then component classes.
  - Avoid ad-hoc per-section overrides that fragment style.
  - Preserve performance and mobile behavior while applying glass effects.

### Visual system spec (homepage)

| Layer | Spec | Avoid |
|------|------|-------|
| **Surface** | Frosted/glass panels with subtle translucency (`rgba`), soft border, low-noise backdrop blur, and restrained inner highlight. | Opaque gray cards that feel dated; heavy neon glow. |
| **Borders** | Hairline borders with cool-tint alpha and clear radius consistency by tier (`--radius`, `--radius-lg`). | Random border colors and mixed corner language. |
| **Shadows** | Multi-layer soft shadows (short + long) with low opacity to create depth without muddiness. | Hard black drop-shadows or excessive elevation jumps. |
| **Highlights** | Thin gradient rails / edge tints for emphasis, not full-card color floods. | High-saturation gradients behind large text blocks. |
| **Buttons** | Primary = glass-accent gradient + crisp text + confident hover lift; secondary = translucent neutral with clear boundary. | Old flat buttons, thick bevels, or low-contrast CTA text. |
| **Spacing** | Larger vertical breathing room in hero and section transitions; card interiors use generous paddings. | Compressed stacks that read as “word dump.” |
| **Typography** | Slightly larger hero/section headings, stable body size, consistent line-height rhythm. | Over-tight line lengths or abrupt size jumps between sections. |

### Token-first implementation contract

Define and use homepage tokens before component edits:

- `--glass-bg`, `--glass-bg-strong`
- `--glass-border`, `--glass-border-strong`
- `--glass-shadow-sm`, `--glass-shadow-md`
- `--glass-blur`
- `--accent-glow`
- `--cta-primary-bg`, `--cta-primary-bg-hover`, `--cta-secondary-bg`

Do not hardcode one-off visual values inside individual cards when a token can express the pattern.

### Interaction + accessibility guardrails

- Respect `prefers-reduced-motion`; keep hover motion subtle and optional.
- Preserve minimum contrast for text and CTA states.
- Keep focus-visible rings explicit and above any glow/blur effects.
- Mobile first: no glass treatment should reduce readability on `<=640px`.

### Acceptance criteria (must pass)

1. Homepage feels visually newer and more premium at first glance.
2. CTA hierarchy remains obvious within 3 seconds of scan.
3. No section appears visually “heavier” than its content importance.
4. Desktop and mobile both maintain legibility and tap-target clarity.
5. PO + Analyst + UX + Engineer sign-off recorded before merge.

---

## 12B) Landing Theme Program (Light + Dark)

Use this section to govern landing-page theming decisions and implementation quality.

### Stakeholder determinations (required baseline)

- **Product Owner determination**
  - Light and dark must both preserve trust, authority, and conversion clarity.
  - Theme switch is a preference feature, not a content hierarchy change.
  - CTA prominence must remain unchanged across themes.
- **Analyst determination**
  - Information hierarchy must remain stable in both themes: primary claim -> primary CTA -> proof blocks.
  - Secondary text must stay readable against each themed surface.
  - Theme must not reduce scan speed or decision confidence.
- **UX Designer determination**
  - Establish explicit text roles: **primary** and **secondary**.
  - Maintain one component grammar across both themes (same radius, spacing rhythm, and interaction language).
  - Glass effects must remain restrained and content-first.
- **Engineer determination**
  - Implement via tokens and theme selector (`data-theme`) only; avoid duplicated component CSS per theme.
  - Theme persistence can use local storage with system preference fallback.
  - Respect `prefers-reduced-motion` and preserve focus visibility.

### Implementation contract

1. Define token pairs for both themes:
   - `--text-primary`, `--text-secondary`
   - plus supporting surface/border/shadow glass tokens.
2. Bind semantic aliases:
   - `--color-text-primary` -> `--text-primary`
   - `--color-text-secondary` -> `--text-secondary`
3. Add theme switch control on landing nav (desktop + mobile dialog).
4. Default logic:
   - stored preference if available
   - else OS preference (`prefers-color-scheme`)
   - else light
5. Scope initial rollout to landing page first; extend to other pages after review.

### Quality gate (theme compliance)

- **Readability:** body and supporting copy pass contrast in both themes.
- **Hierarchy:** headings, CTAs, and proof elements maintain priority.
- **Consistency:** same component spacing and geometry across themes.
- **Performance:** no heavy visual effects that degrade scroll or input response.
- **Mobile:** no loss of legibility or tap-target clarity on narrow viewports.

### Sign-off sheet (required before merge)

- Product Owner: [Approve / Reject] + one-line rationale  
- Analyst: [Approve / Reject] + one-line rationale  
- UX Designer: [Approve / Reject] + one-line rationale  
- Design Agent: [Approve / Reject] + one-line rationale  
- Engineer: [Approve / Reject] + one-line rationale  
- Copy Regulatory Architect (§15): [Approve / Reject] + one-line rationale

If any role rejects, revise only impacted theme elements and rerun the sign-off sheet.

---

## 12C) Navigation + CTA Spec (Reference-led)

Use this when implementing the “future-oriented” navbar pattern:

### Product Owner decision

- Navigation must separate **orientation links** from **decision CTAs**.
- Orientation links stay calm and low chrome; CTAs carry conversion emphasis.
- CTA pair contract:
  - text-first emphasis, not surface decoration
  - conversion intent must be communicated by wording and hierarchy, not fills

### UX Designer decision

- Nav + CTA typography uses a **geometric UI family** (`--font-cta`, e.g. Rubik/Futura-class fallback), while body remains readability-first (`--font-body`) and headings remain editorial (`--font-heading`).
- Default pairing for a modern forward-looking portfolio:
  - **Main narrative / titles:** contemporary serif (`--font-heading`, e.g. Source Serif 4 class)
  - **CTAs / nav / controls:** geometric sans (`--font-cta`, Rubik/Futura-class)
  - **Body paragraphs:** neutral sans (`--font-body`, Inter-class) for scan speed
- Nav links can use restrained glass/neo surfaces if contrast and hierarchy remain clear; active state must be obvious within 1 second of scan.
- CTA controls carry emphasis via **type + hierarchy first**, then surface treatment (not decorative excess).
- Geometry is restrained:
  - control radius small (`~8px`)
  - concise shadows
  - micro-nudge hover (`<=1px`)
- Keep visual hierarchy: links -> ghost CTA -> primary CTA.

### Engineer decision

- Implement via reusable classes:
  - `.nav-cta`, `.nav-cta--ghost`, `.nav-cta--primary`
  - active-link support through `.active` / `[aria-current]`
- Ensure desktop and mobile dialog use the same CTA language.
- Remove decorative chrome from CTA classes by default (no border/fill backgrounds).
- Use micro-interactions only (subtle translate, underline growth, or tone shift) to indicate clickability.
- Preserve a11y:
  - min hit height `>=44px`
  - visible focus styles
  - adequate contrast in light and dark themes
- Enforce brand palette lock:
  - no ad-hoc CTA hues outside approved brand tokens (`--accent`, `--accent-bright`, approved neutrals)
  - reject one-off colors (example: lime/green CTA fills) unless explicitly approved by PO + UX.

### Acceptance checks

1. Nav links are readable but visually quieter than CTA pair.
2. Active nav state is obvious without blocky fills.
3. CTA emphasis is text-led (no border/fill dependence).
4. CTA text is larger/heavier than surrounding nav links.
5. Hover behavior uses micro-interaction to indicate CTA without visual noise.
6. Overall impression is classy premium tech (focus on words, not shiny surfaces).
7. Design-rules checklist completed (brand palette, spacing, motion, a11y, hierarchy) and attached to PR.
8. PO + UX + Engineer sign-off captured before merge.

---

## 12D) PRD — Hero Agent Reel (Spotlight Replacement MVP)

Use this spec before implementing the hero spotlight replacement interaction.

### Objective

Replace the static hero spotlight with a single phone-style interaction that demonstrates the core value proposition: converting vague business intent into a practical engineering plan and a clear next action.

### User story

As a founder or operator landing on the homepage, I want to see a realistic one-shot AI interaction so I can quickly trust that this practice can translate my request into actionable execution direction.

### MVP interaction sequence (timed)

Total runtime target: **6.5-8.0s**, then lock into final CTA state.

1. Idle frame (**0.0-0.8s**)  
   Phone shell is visible with mic affordance.
2. Recording state (**0.8-2.6s**)  
   Simulated voice capture for user query: `fix my online site with AI`.
3. Processing state (**2.6-4.0s**)  
   Brief AI thinking indicator; no layout shift.
4. AI reply reveal (**4.0-6.5s**)  
   Reply appears: `I can plan that in a minute and write an engineering plan. Let's get started.`
5. Spotlight lock-in (**6.5s+**)  
   Final response becomes (or is paired with) primary spotlight CTA; state stays stable.

### Acceptance criteria

- Component appears in first fold and does not introduce cumulative layout shift.
- Sequence runs once, then remains in final readable CTA state.
- CTA is keyboard-focusable and visibly focus-styled.
- JS failure still renders static final-state CTA and copy.
- `prefers-reduced-motion` path renders immediate (or near-immediate) final state.
- Works across modern desktop/mobile viewports in current browser support baseline.

### Accessibility and motion constraints

- Respect `prefers-reduced-motion: reduce`: disable staged animation.
- No autoplay audio; voice is visual simulation only.
- Decorative waveform/indicators use `aria-hidden="true"`.
- Maintain WCAG 2.2 AA contrast for text, controls, and focus ring.
- Ensure deterministic keyboard flow and no focus traps.

### Analytics events (MVP)

Emit with common payload keys: `component`, `variant`, `timestamp`, `session_id`.

- `hero_spotlight_impression`
- `hero_spotlight_sequence_start`
- `hero_spotlight_sequence_complete`
- `hero_spotlight_cta_click`
- `hero_spotlight_replay_click` (if replay exists)
- `hero_spotlight_reduced_motion_applied`
- `hero_spotlight_fallback_rendered`

### Out of scope (MVP)

- Real microphone capture or speech-to-text APIs
- Live LLM inference/API calls
- Multi-turn/branching conversations
- Audio playback or TTS
- Heavy personalization logic

### CTA copy variants

Baseline:

- `I can plan that in a minute and write an engineering plan. Let's get started.`

Alternates:

1. `I can turn that into a one-minute plan and an execution-ready engineering brief. Let's get started.`
2. `I can map this into a practical AI roadmap and implementation plan. Let's get started.`
3. `I can convert that request into a clear build plan your team can ship. Let's get started.`
4. `I can scope this, prioritize it, and draft the engineering plan in minutes. Let's get started.`
5. `I can take this from idea to execution plan right now. Let's get started.`

### Implementation handoff notes

- HTML: include phone frame, staged states, and persistent final CTA in DOM.
- CSS: reserve fixed height; use state classes (`is-recording`, `is-processing`, `is-complete`).
- JS: small timer/state machine; in-view start; fail-safe to `is-complete`; emit analytics per stage.

---

## 13) Agent: Case Study Format + Page Outline Designer

Use this agent when creating or rewriting any case study page.
Goal: a minimal, high-signal format that makes strategic thinking and outcomes easy to scan.

### Agent identity

- **Name:** `Case Study Format Architect`
- **Mission:** Turn raw project notes into a clean case-study narrative and page skeleton.
- **Tone:** Calm, direct, evidence-led, no design theater.
- **Default visual stance:** Minimal, whitespace-first, restrained color, high typographic hierarchy—**enterprise case-study clarity**, not landing-page theatrics.
- **Design reference (scan target):** Structure and restraint should feel **intuitive and minimal in the spirit of IBM’s long-form customer case studies**—e.g. [US Open × IBM](https://www.ibm.com/de-de/case-studies/us-open) (same pattern on other `ibm.com` locales): **one clear hero thesis**, a **small stat band** (few large numbers + short labels), **readable narrative columns**, **sparse pull quotes**, **pillar-style subsections** for how the work hangs together, then a **tight outcomes block**—imagery supports the story; it does not replace hierarchy. Full rules: **Design bar** below.
- **Partners:** **`Research Methods Mapper` (§16)** — For the **Methodology** hierarchy item and for defensible **Outcomes** wording, produce or request a **§16 research methods trace** (feasible `QM-##` / `QL-##`, quant write-block seeds, metric dictionary stub, G-ladder alignment). If project inputs lack method detail, the outline must flag **`TODO: run §16 RMM`** in the content brief under Methodology.

### Inputs required (from project notes)

1. Project name and product/domain context.
2. Time period and stage (prototype, growth, turnaround, enterprise optimization, etc).
3. Your exact role and decision rights.
4. Users involved and top user pain/need signals.
5. Business/stakeholder priorities and investments.
6. Methods used (research, workshops, experiments, analytics, design).
7. Constraints (time, compliance, tech, org, talent, budget).
8. Key decisions, outcomes, and what you learned.

### Mandatory narrative hierarchy (top to bottom)

Every case study must foreground these sections in this order unless there is a strong reason to deviate:

1. **Organizational North Star / Goal**
2. **Critical Insight** (the sharpest truth that changed direction)
3. **User Voice** (quotes, observed behavior, support signals, NPS snippets)
4. **Context**
5. **My Role**
6. **Stakeholder Investment** (time, budget, org attention, political capital)
7. **Methodology**
8. **Constraints**
9. **Key Decisions**
10. **Outcomes**
11. **Learning**

### Page outline (minimal format)

Use this wireframe-level structure for page composition:

1. **Hero strip**
   - Project name + one-line outcome.
   - North star in one crisp sentence.
   - Metadata row: domain, timeline, role, team size.
2. **Critical Insight block** (high emphasis)
   - One short paragraph + optional supporting proof signal.
3. **User Voice + Context** (paired two-column on desktop, stacked on mobile)
   - Left: direct user evidence.
   - Right: business/product context.
4. **Role + Stakeholder Investment**
   - What you owned.
   - Who committed what and why it mattered.
5. **Methodology**
   - 3-6 steps max; each step tied to a decision or learning.
6. **Constraints -> Key Decisions**
   - Show trade-offs explicitly (constraint, option considered, final call).
7. **Outcomes**
   - Quant + qual; separate observed result from inferred impact.
8. **Learning**
   - Reusable principles and what you would change next cycle.

### Design bar: IBM-style minimal + intuitive (mandatory for outline + UI notes)

When specifying layout and chrome for any case study page, the architect **must** align to this bar—same *class* of experience as [IBM’s US Open case study](https://www.ibm.com/de-de/case-studies/us-open): calm, scannable, credible.

| Rule | Do | Don’t |
|------|----|--------|
| **Hero** | One headline-level promise + **one** supporting thesis line; optional **2–4** key metrics as a **stat band** (large numeral + **≤6 words** label each). | Competing hero messages, auto-play, or “mystery meat” visuals with no caption. |
| **Hierarchy** | Predictable **vertical spine**: section order matches §13 narrative; **H2 = chapter**, **H3 = pillar** inside a chapter (e.g. approach pillars, capability blocks). | Jump-scrolling tricks, horizontal-only story on mobile, or hiding the narrative behind tabs without strong reason. |
| **Density** | Short paragraphs, **one idea per screen band**; bullets only for parallel facts or capabilities. | Wall of marketing adjectives, stock “innovation” filler, or more than **one** signature decorative motif per page. |
| **Evidence** | Numbers sit next to **definitions** (what was measured, when)—see §16 metric stub; quotes **1–2** max with name + role. | Unattributed quotes, metric soup without cohort/window, or charts as decoration without a takeaway line. |
| **Imagery** | One **obvious job** per image (context, workflow, outcome); caption ties to the adjacent claim. Include **3 evidence visuals** per case: one each for **User Voice**, **Context**, and **Methodology**; these should read as proof artifacts and can use a **light confidentiality blur** when needed. | Ornamental gradients, unrelated stock, visuals that duplicate text without adding proof, or heavy blur that hides the evidence signal. |
| **Outcomes** | Dedicated band: **headline metrics → one interpretation sentence → caveats** if needed (§15 G-ladder). | Vague uplift claims or outcomes buried under unrelated CTAs. |
| **CTA** | **Single** primary next step at end of story (e.g. contact, more work)—secondary optional. | Competing primaries in every section. |
| **Motion** | Subtle, **prefers-reduced-motion**-safe if any (align §7). | Parallax, scroll-jack, or motion that delays access to text. |

### Case-study UI hard rules (applies to every case page)

1. **No top pills/chips in hero navigation.** Remove jump pills such as `Context & constraints`, `Voice, insight & method`, `Insights & decisions`.
2. **Section titles use icon + label, not eyebrow text.** Keep labels plain and short; icon carries section cue.
3. **Naming contract:**  
   - `Context, business north star, and constraints` -> **`Context`**  
   - `User voice, data insight, and methodology` -> **`Observations`**
4. **Insights section must be visually flat and clear.** Avoid stacked micro-hierarchies inside one section; use two parallel cards (e.g., **Insights** and **Decisions**) with equal visual weight.
5. **Evidence images must not create ragged whitespace.** Do not float paragraph-sized images beside body copy; use full-width or clean grid blocks with consistent aspect ratios.
6. **Copy vetting rule:** remove redundant internal wording before ship. Prefer direct verbs and one claim per sentence; eliminate repeated framing words and duplicate qualifiers.
7. **Preferred hero lead style (Stryker class):** avoid overloaded clauses. Example approved rewrite: “I redesigned robotic-surgery operations UX around next-step clarity, explicit ownership, and escalation logic so clinical teams could move quickly without compromising compliance rigor.”
8. **Section-image fidelity rule:** every section image must directly show what the adjacent content describes (artifact, workflow state, user environment, method evidence, or outcome proof). Decorative or loosely related images are not allowed.
9. **Insight-to-image decision chain (mandatory):**
   - **Step A:** Start from available **data insights** in the case evidence.
   - **Step B:** Select the **single best-fit insight** for the section using the **UX Source of Truth** agent/output.
   - **Step C:** Select the **single best-fit image** for that chosen insight via **UX + Copy agent** review.
   - **Step D:** Run **UX agent sign-off** on cleanliness factors before publish: wrapping, grid alignment, spacing rhythm, image crop integrity, and mobile/desktop scan quality.
   - **Fail condition:** If any step is missing, mark section as `Evidence-image mapping incomplete` and block final publish.
10. **Narrative integration rule (content + agent reviews):** all content reviewers/agents must connect the **most appropriate UX truth**, **engineering/architecture choices**, and **research methods** to your personal narrative in that engagement (what you did, why it mattered, and how it changed outcomes for the company). Outputs must present an ideal, credible standard of **excellence in user experience, research engineering, and product development** without overstating ownership or evidence.
11. **Top-fold minimalism + sign-off rule:** case-study first section must stay low-density (title, one lead line, one evidence image, one back link). No nav tabs, no eyebrow metadata rows. Any exception requires explicit sign-off from **UX Designer + Product Owner + Developer** before merge.
12. **Top-fold structure rule (override):**
   - **Remove image from the top fold** entirely.
   - **Text spans full content width** of the shell/grid on desktop and mobile (no split hero columns in fold one).
   - Add **duration, role, stakeholders, and tech stack** in a visually clean summary row/block using icons/grid treatment only; **no labels/eyebrows/micro-kickers**.
   - Metadata presentation should read as one coherent visual system (consistent spacing, icon rhythm, and alignment), not mixed chips/cards.
   - **Execution gate:** obtain explicit **UX Designer + Product Owner + Developer** sign-off before implementing this top-fold pattern in any case-study page.
   - **Copy gate:** run **Copy Regulatory Architect (§15)** vetting and record approval before final merge.
13. **Insight artifact rule (mandatory in template):**
   - In every **Data insight** box, reserve a right-side visual area for a **data interpretation artifact** that directly supports the written claim.
   - Allowed artifacts: chart/graph excerpt, tagged sticky-note synthesis, journey evidence snapshot, method board, or comparable UX research artifact.
   - Artifact must map to the exact insight text (not generic decoration).
14. **Context visual rule (mandatory):**
   - Context visuals (including top context image blocks) must be **insight-oriented evidence**, not generic people/stock imagery.
   - Preferred assets: workflow map slices, operational dashboards, risk heatmaps, service blueprints, interview synthesis boards, or instrumented funnel/state visuals.
   - If confidentiality applies, use light blur/redaction while preserving structure and interpretability.

**UI structure notes (artifact 3) must explicitly state:** stat band yes/no + which metrics; pillar mapping for Methodology/Solution if applicable; image jobs per block; and confirmation that layout passes the **Design bar** table.

**Evidence-visual rule (mandatory):** The architect must specify and generate at least **three evidence visuals** that fill whitespace intentionally and support claims:  
1) **User Voice visual** (quote/support transcript, interview board, or comparable evidence snapshot),  
2) **Context visual** (operational environment/system context),  
3) **Methodology visual** (process board, step map, workshop artifact, or tool-in-use capture).  
If confidentiality requires abstraction, apply only a **slight blur** (enough to protect sensitive details while keeping the evidence structure legible).

### "Riff it off" rules (creative variation without losing structure)

When adapting this template per case study:

- Keep the hierarchy fixed, but vary the storytelling device (timeline, before/after, decision log, signal-to-action).
- Promote one "signature artifact" per case (framework, dashboard, experiment map, service blueprint) as proof of craft.
- If metrics are confidential, replace raw numbers with directional evidence and confidence level.
- Keep each section tight: prefer one strong paragraph or tight bullets over dense walls of text.
- Use one visual accent idea per page (not multiple styles competing for attention).
- **Design bar:** Creative “riffs” must still pass the **IBM-style minimal + intuitive** table above—variation in *story device*, not in *visual noise*.

### Consumable output package (required every run)

The agent output must be ready for handoff, not just ideation. Deliver all **5** artifacts:

1. **One-page outline** (final section order + short intent line under each heading).
2. **Content brief** (what evidence is needed per section, with placeholders for missing data). Under **Methodology**, include either a completed **§16 trace summary** (see artifact 5) or **`TODO: run §16 RMM`** with the minimum inputs still missing.
3. **UI structure notes** (block order, emphasis level, mobile behavior, component patterns, and **§13 Design bar** compliance: stat band, pillars, imagery jobs, end CTA).
4. **Decision log** (why this structure was chosen, what was intentionally excluded, and open risks).
5. **Research methods trace (§16 RMM)** — Mandatory handoff for writers and **Data/Analytics Specialist (§7)**:
   - Solution archetype tag(s) from **§16** matrix (or hybrid) and **primary decision question** the evidence served.
   - **Feasible** `QM-##` / `QL-##` IDs (and **BLOCKED** IDs with one-line reason if methods were considered and rejected).
   - **Triangulation one-liner** (what quant proves vs what qual explains).
   - **Quant content pack (lightweight):** for each **feasible `QM-##`**, one **filled or bracketed methodology paragraph** using that row’s **Write block** pattern in §16; plus a **metric dictionary stub** table: `metric | definition | source | caveat`.
   - **Anticipated claim tier** for each headline outcome (§15 **G0–G4**) *or* `TODO: set G-tier after measurement`.

Use concise language so each artifact can be used directly by writing, design, and build workflows.

### Approval workflow (mandatory sign-off)

Before publishing, the agent must request and record approval from all four roles:

1. **Product Owner approval**
   - Confirms north star, business context, stakeholder investment framing, and outcome logic.
2. **UX Designer approval**
   - Confirms hierarchy clarity, readability, **Design bar** (IBM-style minimal + intuitive), and evidence-to-story flow.
3. **Design Agent approval**
   - Confirms final copy and layout coherence; required for any new or revised copy before publish.
   - Confirms the proposed implementation meets UX standards and required compliance gates (WCAG 2.2 AA minimum).
4. **Developer approval**
   - Confirms the outline is implementable in current page system without unnecessary complexity.

If any role rejects:

- Capture rejection reason in one line.
- Revise only the affected sections.
- Re-submit for that role, then re-run final four-role check.

Case study status labels:

- `Draft` = output package complete, sign-offs pending.
- `Ready for Build` = PO + UX + Design Agent + Dev all approved.

**Research gate (non-blocking for PO/UX/Dev, blocking for credible Methodology + Outcomes copy):** Artifact **5 (§16 trace)** must not contradict inputs; if **Methodology** ships without feasible `QM-##`/`QL-##` trace, label the case study internal note **`Methods trace incomplete`** until §16 is run or RMM output is pasted into the content brief.

### Copy-paste execution prompt (run template)

Use this exact prompt when running the agent for a new case study:

```text
You are the Case Study Format Architect.

Objective:
Design a minimal, high-hierarchy case study format and page outline that is immediately consumable by Product, UX, and Development.

Non-negotiables:
1) Keep visual/content direction minimal and **intuitive in the IBM enterprise case-study class** (see §13 Design bar + [IBM US Open reference](https://www.ibm.com/de-de/case-studies/us-open)): stat band discipline, vertical spine, sparse chrome.
2) Maintain this narrative hierarchy unless a justified exception is provided:
   - Organizational North Star / Goal
   - Critical Insight
   - User Voice
   - Context
   - My Role
   - Stakeholder Investment
   - Methodology
   - Constraints
   - Key Decisions
   - Outcomes
   - Learning
3) Riff creatively on storytelling format without breaking hierarchy.
4) UI structure notes must confirm the **Design bar** checklist (stat band, pillars, imagery job, single end CTA, no forbidden patterns).
5) Generate and place **three evidence visuals** in the outline/UI notes: one for User Voice, one for Context, one for Methodology. These visuals should help fill whitespace, reinforce adjacent claims, and may use only **light confidentiality blur** when required.

Project inputs:
- Project name:
- Domain/product:
- Stage/timeline:
- My role and ownership:
- Users and voice signals:
- Stakeholder priorities/investment:
- Methods used:
- Constraints:
- Key decisions:
- Outcomes:
- Learning:

Deliverables (required):
A) One-page outline
- Section order with one-line intent per section.

B) Content brief
- For each section: required evidence, proof type, and missing-data placeholders.
- Under Methodology: embed §16 trace summary OR `TODO: run §16 RMM` + list missing inputs.

C) UI structure notes
- Block order, emphasis level, desktop/mobile behavior, component notes, and **explicit Design bar compliance** (§13 table).
- Include a placement + purpose line for the **3 mandatory evidence visuals** (User Voice, Context, Methodology), including blur rationale if used.

D) Decision log
- Why this structure, what was excluded, known risks.

E) Research methods trace (§16 RMM) — mandatory
- Archetype(s) + primary decision question.
- Feasible QM-## / QL-## (+ blocked with reason if applicable).
- Triangulation one-liner.
- Per feasible QM-##: one methodology paragraph (§16 Write block pattern) + metric dictionary stub; anticipated G-tier per outcome or TODO.

Output format:
1. Executive snapshot (5-7 lines max)
2. One-page outline
3. Content brief
4. UI structure notes
5. Decision log
6. Research methods trace (§16 RMM)
7. Approval sheet

Approval sheet (mandatory):
- Product Owner: [Approve / Reject] + one-line rationale
- UX Designer: [Approve / Reject] + one-line rationale
- Design Agent: [Approve / Reject] + one-line rationale
- Developer: [Approve / Reject] + one-line rationale

Rules for approval handling:
- If any role rejects, revise only impacted sections and reissue full deliverable.
- Final status must be one of:
  - Draft (pending approvals)
  - Ready for Build (all 4 approved)

Quality check before final output:
- North star is explicit and <=20 words.
- At least one concrete user voice signal exists.
- Constraints are linked to decisions.
- Outcomes are labeled measured vs directional.
- Narrative remains minimal, strategic, and scannable.
- **§16:** Deliverable **E** present: feasible `QM-##`/`QL-##`, triangulation line, quant paragraph seed(s) + metric dictionary stub, G-tier or TODO for each claimed outcome.
- **Design bar:** Deliverable **C** states stat band + pillar plan + image jobs + single primary CTA; no forbidden patterns from §13 table.
- **Evidence visuals:** Deliverable **C** includes all 3 required evidence visuals (User Voice, Context, Methodology), each mapped to a claim and not purely decorative; any blur is slight and justified.
```

### Quality gate (agent self-check before approval round)

- Is the north star explicit in under 20 words?
- Is there at least one concrete user voice signal?
- Are constraints connected to decisions, not listed in isolation?
- Are outcomes clearly labeled as measured vs directional?
- Does the page read as minimal and strategic, not decorative?
- **§16 RMM:** Is consumable artifact **5** complete (or explicitly deferred with `TODO: run §16 RMM` and listed gaps)—including at least one **quant** methodology seed if any quantitative outcome will be claimed?
- **Design bar:** Would the page read as **IBM-class minimal** (calm hero, ≤4 headline stats, vertical spine, restrained imagery)—not a marketing microsite?

If any answer is "no", revise before shipping.

---

## 14) Agent Run 01 - Rationalized + Finalized Case Study Layout Template

This section is the first executed output of the `Case Study Format Architect`.
Scope: finalize a reusable page layout template before drafting individual case studies.

### 1) Executive snapshot

- The template is finalized as a minimal, evidence-first narrative with fixed hierarchy.
- The top fold prioritizes north star clarity and a single critical insight.
- User voice appears early to anchor decisions in real signals, not hindsight narration.
- Constraints and key decisions are paired to make trade-offs explicit and credible.
- Outcomes are split into measured and directional impact to protect claim quality.
- The structure is intentionally lightweight so it can be implemented across existing pages fast.
- Status target for this run: `Ready for Build`.

### 2) One-page outline (final section order + intent)

1. **Hero strip** - Orient quickly: project, one-line outcome, north star, metadata.
2. **Critical Insight** - Surface the decisive truth that reframed the work.
3. **User Voice** - Show direct evidence from users or operational frontline signals.
4. **Context** - Explain market/org/product conditions framing the challenge.
5. **My Role** - Clarify scope, ownership, decision rights, and collaboration shape.
6. **Stakeholder Investment** - Show who committed what and why alignment mattered.
7. **Methodology** - Describe the shortest valid path from evidence to action.
8. **Constraints** - Name hard limits that shaped solution boundaries.
9. **Key Decisions** - Document trade-offs and rationale under those constraints.
10. **Outcomes** - Report measured results and directional impact separately.
11. **Learning** - Extract reusable principles and next-cycle improvements.

### 3) Content brief (evidence requirements by section)

| Section | Required evidence | Proof type | Missing-data placeholder |
|--------|-------------------|-----------|--------------------------|
| Hero strip | project, timeline, role, one-line outcome, north star; optional **stat band** (≤4 metrics, §13 Design bar) | factual metadata + strategic statement | `TODO: verify timeline/role wording` |
| Critical Insight | 1 key insight that changed direction | synthesis statement backed by one signal | `TODO: add supporting signal` |
| User Voice | quote, behavior pattern, support/NPS note | qual quote + observational note | `TODO: add direct user artifact` |
| Context | business stage, market pressure, product state | concise situational framing | `TODO: add stage context` |
| My Role | owned workstreams and decisions | accountability statement | `TODO: define ownership boundary` |
| Stakeholder Investment | team time, budget band, leadership support | resource/commitment framing | `TODO: add investment details` |
| Methodology | 3-6 steps from discovery to validation; **§16** `QM-##`/`QL-##` trace + quant paragraph seeds where applicable | process trace linked to decisions + **artifact 5** from §13 | `TODO: fill method steps` / `TODO: run §16 RMM` |
| Constraints | compliance, time, tech, org limits | boundary list with impact | `TODO: add hard constraints` |
| Key Decisions | options considered, final call, why | decision log entries | `TODO: capture alternatives` |
| Outcomes | measured metrics and directional outcomes | quant + qual split | `TODO: separate measured vs directional` |
| Learning | what to repeat/change next cycle | reflection with transfer value | `TODO: add reusable principles` |

### 4) UI structure notes (build-facing)

- **Design bar (§13):** Match **IBM-class enterprise case study** restraint—[reference](https://www.ibm.com/de-de/case-studies/us-open): optional **hero stat band** (≤4 metrics + short labels), pillar-style H3s inside Methodology/Solution where helpful, **one** primary end CTA, imagery with a clear job per block.
- **Layout rhythm:** single-column narrative spine; optional two-column only for `User Voice + Context` on desktop.
- **Visual hierarchy:** one dominant heading per section, low-chrome containers, no decorative gradients that compete with copy.
- **Density target:** short paragraphs and tight bullets; each section should fit one viewport on laptop where possible.
- **Mobile behavior:** stack all paired blocks; keep tap targets >=44px; avoid horizontal scroll and over-tight text measure.
- **Component primitives:** hero metadata row, emphasis card (critical insight), evidence quote block, decision table, outcomes split cards.
- **A11y baseline:** semantic headings in order, meaningful labels, strong contrast, reduced-motion-safe transitions.

### 5) Decision log (rationalization)

- Chose fixed hierarchy to improve consistency across case studies and reduce authoring friction.
- Moved `Critical Insight` above broad context so the narrative opens with strategic value, not chronology.
- Kept `User Voice` early to reinforce evidence-led storytelling and avoid generic post-rationalized claims.
- Paired `Constraints` with `Key Decisions` to force transparent trade-off logic.
- Split outcomes into measured vs directional to preserve trust when data is partial or confidential.
- Excluded dense visual storytelling patterns (timelines, complex diagrams) from default template to keep implementation lean.

### 6) Approval sheet

- **Product Owner:** `Approve` - Template expresses north star, investment logic, and outcomes in a decision-useful sequence.
- **UX Designer:** `Approve` - Information hierarchy is clear, minimal, and scannable across desktop and mobile.
- **Developer:** `Approve` - Structure maps to existing HTML/CSS patterns with low implementation overhead.

**Final status:** `Ready for Build`

---

## 15) Agent: Copy Vetting & Regulatory Gate (NN/g · Norman · IDEO · Heuristics Bible)

Use this agent **before any public-facing copy ships**: site pages, case studies, consulting blurbs, CTAs, nav labels, meta descriptions, emails linked from the site, and hero/offerings microcopy. It is the **regulatory layer** on top of Analyst / PM / Architect / UX / QA roles in §7—those roles **produce**; this agent **vetoes or revises** against an explicit truth set. **Design Agent sign-off is still mandatory before merge whenever copy is new or revised.**

### Agent identity

- **Name:** `Copy Regulatory Architect` (CRA)
- **Mission:** Ensure every string that leaves the repo meets **clarity, honesty, usability, and human-centered design** standards derived from **Nielsen Norman Group (NN/g)**, **Don Norman**, **IDEO-style human-centered design**, and **established usability heuristics**—without flattening the author’s voice defined in §8—and meets the **enterprise consulting register (Part H)** so prose reads **credible to executive readers** (norms aligned with firms such as **BCG, Deloitte, and IBM thought leadership / case study** writing: composed sentences, restrained punctuation, low theatrics).
- **Tone:** Firm, specific, citeable; no vague “make it punchier.” Every finding maps to a **principle ID** from the bible below.
- **Non-goals:** SEO keyword stuffing, hype that outruns evidence, jargon that signals cleverness over comprehension, “startup voice” that trades trust for novelty, or **obvious AI-generated cadence** (see **Part H**): em-dash sprawl, telegraphic short-sentence stacks, comma-chained run-ons, hollow intensifiers, and repetitive “rule of three” rhetorical patterns.

### Scope of regulation

| Surface | In scope | Typical failure modes |
|---------|----------|------------------------|
| Headlines & subheads | Yes | clever obscurity, missing topic, false specificity |
| Body copy & lists | Yes | wall of text, buried lead, unverifiable superlatives |
| CTAs & buttons | Yes | vague verbs, jargon CTAs, misleading next step |
| Nav & wayfinding labels | Yes | internal org names, mystery meat, inconsistency |
| Forms & transactional copy | Yes | blameful errors, missing recovery, opaque requirements |
| Case studies & proof | Yes | implied causation, missing constraints, vanity metrics |
| Alt text, `aria-*` companions | Yes | keyword spam, decorative noise, missing function |
| Meta / social snippets | Yes | truncation blindness, clickbait vs on-page promise |

### Operating rules (how CRA uses this file)

1. **Stack rank:** **Truth → evidence → voice (§8)**. If voice conflicts with truth, **revise voice**.
2. **Claim discipline:** Cross-check §9; new numbers require provenance or downgrade to directional language with confidence stated.
3. **BMAD alignment:** Offerings/card contracts (§12), mobile PRD (§7), and homepage journey (§11) are **hard constraints**—CRA flags copy that forces bad layout or wrong purchase-model signaling.
4. **Output:** Every review ships **Pass**, **Conditional pass** (must-fix list), or **Block** with **Principle IDs**, **severity** (P0 launch blocker / P1 ship with ticket / P2 polish), and **suggested rewrite** (not generic “improve”).

---

### Truth bible — Part A: Nielsen Norman Group (NN/g) lineage (content + UX writing)

Use as **default law** for anything read on a screen. IDs are stable for CRA citations.

| ID | Principle | Operational test (pass if…) |
|----|-----------|------------------------------|
| **NN-01** | **Scannable structure** | H1 answers “where am I?”; headings every ~1–2 screens; meaningful H2/H3, not decoration. |
| **NN-02** | **Inverted pyramid** | First sentence of each block carries the conclusion; detail supports, not buries. |
| **NN-03** | **Plain language** | No term requires insider knowledge unless defined once, in context. |
| **NN-04** | **Short lines, short paragraphs** | Paragraphs favor **1 idea**; lists used when **3+** parallel items; no “list as paragraph.” |
| **NN-05** | **Front-loaded sentences** | Lead with user outcome or fact; trim throat-clearing (“In today’s world…”). |
| **NN-06** | **Consistent terminology** | One concept → one label across nav, body, CTAs (synonyms only if disambiguation needs it). |
| **NN-07** | **Specific > vague** | Replace “robust / world-class / seamless” with mechanism, scope, or verifiable attribute. |
| **NN-08** | **Numbers with integrity** | Magnitude + unit + timeframe + cohort; no cherry-picked peaks without baseline. |
| **NN-09** | **Link honesty** | Link text says destination + file type if non-HTML; no “click here.” |
| **NN-10** | **Error prevention in copy** | Preconditions stated upfront (cost, time, data needed); no surprise gates after effort. |
| **NN-11** | **Recovery language** | Errors: what happened, how to fix, what’s safe—**never** blame the user. |
| **NN-12** | **Cognitive load budget** | New terms introduced sparingly; acronyms expanded at first use in page scope. |
| **NN-13** | **Trust & credibility** | Acknowledge limits, trade-offs, and uncertainty where honest; overclaim destroys repeat visits. |
| **NN-14** | **Progressive disclosure** | Overview first; deep detail collapsible or lower on page—not mandatory to understand value. |
| **NN-15** | **Microcopy as system state** | Buttons reflect system reality (“Send request” vs “Done” while still processing). |
| **NN-16** | **Form field clarity** | Labels name the requested input; help text explains **why**, not only format. |
| **NN-17** | **Empty & edge states** | Copy exists for zero-results, no access, partial data—not only happy path. |
| **NN-18** | **Internationalization-safe** | Avoid idioms that mistranslate; avoid culture-bound humor in high-stakes flows. |
| **NN-19** | **SEO without deceit** | Title/description match on-page topic; no bait-and-switch for queries. |
| **NN-20** | **Mobile-first reading** | Critical info not only in hover tooltips; tap flows readable without pinch-zoom. |

---

### Truth bible — Part B: Nielsen’s usability heuristics (applied to words, not only UI)

Heuristic **violations often manifest as bad copy** before they manifest as bad components.

| ID | Heuristic (Nielsen) | Copy-level signals to flag |
|----|----------------------|----------------------------|
| **H-01** | **Visibility of system status** | Missing “what’s happening / what’s next” in multi-step flows; async copy that sounds instant. |
| **H-02** | **Match system ↔ real world** | Insider jargon; org chart language; feature names without user vocabulary. |
| **H-03** | **User control & freedom** | Irreversible-sounding CTAs without escape; no “back / edit” language where needed. |
| **H-04** | **Consistency & standards** | Same action named differently in adjacent paragraphs; platform convention broken without reason. |
| **H-05** | **Error prevention** | “Submit” before validation rules explained; legal/compliance surprises at end. |
| **H-06** | **Recognition > recall** | Forcing memory of prior pages; cryptic references (“the above package”) on mobile stacks. |
| **H-07** | **Flexibility & efficiency** | Expert shortcuts absent where power users exist; unnecessary verbosity for repeat tasks. |
| **H-08** | **Aesthetic & minimalist design** | Decorative metaphors that obscure actions; marketing filler in task flows. |
| **H-09** | **Recognize, diagnose, recover from errors** | Generic “Something went wrong”; no next step; error codes shown without human translation. |
| **H-10** | **Help & documentation** | Long policy walls without “start here”; no examples for non-obvious inputs. |

---

### Truth bible — Part C: Don Norman (conceptual model, affordance, emotion)

| ID | Principle | Operational test |
|----|-----------|-------------------|
| **DN-01** | **Conceptual model in language** | Reader can answer: *what is this thing, what does it do for me, how does it work at a high level?* |
| **DN-02** | **Affordance + signifier alignment** | CTA promises only what the next screen delivers; “Learn more” tied to a **specific** topic. |
| **DN-03** | **Mapping** | Order of steps in copy matches order of UI; lists mirror screen sequence. |
| **DN-04** | **Feedback vocabulary** | Success/failure words match actual completion state (no false “success”). |
| **DN-05** | **Gulf of evaluation** | After reading, user knows **what changed** and **whether they’re closer to their goal**. |
| **DN-06** | **Gulf of execution** | After reading, user knows **exactly one** primary action to take next (when that’s the goal). |
| **DN-07** | **Constraints as clarity** | Bounded offers state boundaries as benefits (time, scope, responsibility), not as threats. |
| **DN-08** | **Discoverability** | Key capabilities not hidden behind vague nouns (“solutions”) without a concrete gloss. |
| **DN-09** | **Visceral layer (tone)** | First-line tone matches brand warmth without infantilizing enterprise readers. |
| **DN-10** | **Behavioral layer (flow)** | Copy reduces anxiety in high-stakes domains (health, money, data, career). |
| **DN-11** | **Reflective layer (meaning)** | Mission language ties to **user dignity and agency**, not only org heroism (align §4 themes). |
| **DN-12** | **Post-traumatic clarity** | After confusion, revised copy must explain **why** change happened if user already acted. |

---

### Truth bible — Part D: IDEO / human-centered design (desirability · feasibility · viability)

| ID | Principle | Operational test |
|----|-----------|------------------|
| **ID-01** | **Desirability** | Copy speaks to **human outcome** before method; empathy without condescension. |
| **ID-02** | **Feasibility honesty** | Engineering/security constraints acknowledged in buyer language, not hand-waved. |
| **ID-03** | **Viability clarity** | Business model or engagement type understandable without a sales call (when that’s the page goal). |
| **ID-04** | **Problem framing before solution** | Problem named in user’s words; solution section earns the right to jargon. |
| **ID-05** | **Radical collaboration (voice)** | Credits and “we” are precise—who did what—without diluting accountable “I” where §8 uses first person. |
| **ID-06** | **Prototype mindset in copy** | Pilots/betas labeled as such; timelines not fake precision. |
| **ID-07** | **Optimism with evidence** | Aspirational claims anchored by process, artifacts, or metrics—not exclamation marks. |
| **ID-08** | **Inclusivity by design** | Examples and defaults inclusive; avoid othering “users vs normal people.” |
| **ID-09** | **Story arc with user as protagonist** | Client/customer is subject of sentences more often than the author—unless bio/about scope. |
| **ID-10** | **Learning out loud** | “What we learned” sections admit surprise/pivot; no omniscient hindsight narrative unless true. |

---

### Truth bible — Part E: Cross-model “laws” (always on)

| ID | Law | Failure pattern |
|----|-----|-----------------|
| **X-01** | **One job per screenful** | Competing H1-level promises in one fold. |
| **X-02** | **No orphan intensifiers** | “Very / incredibly / deeply” without new information. |
| **X-03** | **No false precision** | “47% faster” without study definition; “millions” without need or proof. |
| **X-04** | **No laundry lists as strategy** | Ten nouns in a row ≠ positioning. |
| **X-05** | **No passive voice for accountability** | “Mistakes were made” for personal work narrative (case studies / about). |
| **X-06** | **No ambiguity in causality** | “After redesign, revenue rose” implies sole cause—qualify confounds. |
| **X-07** | **No dark patterns in language** | Fake urgency, hidden costs, manipulative shame, trick questions. |
| **X-08** | **Accessible reading order** | Meaningful sequence in source order for assistive tech; no “read column 2 first” hacks. |
| **X-09** | **Punctuation as UX** | Quotes accurate; headings don’t end in ambiguity. **Em-dash discipline:** see **EC-02** (Part H)—em dashes are not a default joiner. |
| **X-10** | **Legal/compliance tone boundary** | Required formal text isolated; human summary adjacent. |

---

### Truth bible — Part F: Architecture & development co-design (copy × system)

Endless reference for how **words lock hands with build**—use when vetting PRDs, tokens, and page contracts.

| ID | Rule | Why it matters |
|----|------|----------------|
| **AD-01** | **Strings are data** | Copy changes should be traceable (who/when/why); avoid hard-coded duplication across pages. |
| **AD-02** | **Single source of truth** | Nav labels, product names, and legal entity strings defined once; CRA rejects drift. |
| **AD-03** | **Token-aware phrasing** | Don’t author text that **requires** a line break at arbitrary widths; avoid long unbreakable strings. |
| **AD-04** | **Component contract** | Each slot (title, outcome, CTA) has max semantic job—no second H1 in card body. |
| **AD-05** | **State coverage** | Every interactive component spec lists **default / loading / empty / error / success** copy. |
| **AD-06** | **Localization hooks** | Text expansion 30%+ for German; no images-of-text for critical strings. |
| **AD-07** | **Content ↔ analytics map** | Each primary CTA has an intent label internally; events named after user intent, not implementation. |
| **AD-08** | **SEO + IA coupling** | URL slugs readable; breadcrumbs match nav nouns; no synonym slug vs nav. |
| **AD-09** | **Performance honesty** | Don’t promise “instant” if asset-heavy; set expectations if known latency. |
| **AD-10** | **Privacy literacy** | Data collection copy explains **use**, not only **collection**; matches policy depth. |
| **AD-11** | **Versioning** | Public changelog or “last updated” for regulated claims when needed. |
| **AD-12** | **Kill switch language** | Unsubscribe, cancel, delete account: same calm tone as acquisition—trust signal. |
| **AD-13** | **State contrast requirement** | Interactive states must differ in both **visual treatment** and **information density**; label-only state changes fail QA. |

---

### Homepage component shipping spec — Case study tiles (normal / hovered)

This is the release contract for homepage case-study tiles.

| Spec ID | Requirement | Ship criteria |
|---------|-------------|---------------|
| **CHT-01** | **State model** | Tile supports exactly `normal` and `hovered` (`:hover` and `:focus-within`). |
| **CHT-02** | **Normal-state content** | Show only PO ideation statement (problem frame, constraint, north star). Hide UX and engineering bullets. |
| **CHT-03** | **Hovered-state content** | Reveal UX design review and engineering handoff bullets. Keep PO ideation visible as anchor context. |
| **CHT-04** | **Visual contrast** | Hovered state must change border/emphasis and reveal additional body content; difference must be recognizable within 1 second. |
| **CHT-05** | **A11y parity** | Keyboard focus (`:focus-within`) must match hover behavior exactly. |
| **CHT-06** | **Copy contract** | Each tile must include: `kicker`, `title`, `lede`, `PO ideation line`, `UX review bullet`, `Engineering handoff bullet`, `CTA`. |
| **CHT-07** | **No pseudo-shipping** | If state differences are only badge text (for example Normal/Hovered labels) without meaningful content reveal, mark as fail. |
| **CHT-08** | **Process language containment** | PO / UX / Engineering workflow terms stay in spec and tickets; customer-facing page copy must use outcome-focused language. |
| **CHT-09** | **PO gate before ship** | No homepage case-tile content ships until PO sign-off on state behavior, copy intent, and acceptance criteria. |

**QA checklist before ship**
- Normal view reads as PO-owned problem definition only.
- Hover/focus view adds implementation detail, not duplicate copy.
- Dark and light themes preserve state contrast.
- Mobile degrades gracefully (no broken content if hover is unavailable).
- User-facing copy avoids internal role labels unless explicitly approved by PO.

---

### Truth bible — Part G: Evidence ladder (what claims may say)

Use for case studies, metrics blurbs, and consulting proof.

| Rung | Allowed phrasing | Requirements |
|------|-------------------|----------------|
| **G0** | Opinion / taste | Clearly framed as subjective (“I believe…”). |
| **G1** | Directional evidence | “Signals suggested…”, “early indicators…” + method. |
| **G2** | Comparative evidence | Before/after with **same metric definition** + timeframe. |
| **G3** | Causal claim | Controlled comparison or A/B + stated confidence + caveats. |
| **G4** | Absolute numbers | Source, cohort, and window; **not** cherry-picked without disclosure. |

CRA **blocks** rungs climbed without evidence; **permits** lower rung with honest labeling.

---

### Truth bible — Part H: Enterprise consulting register & anti–AI-tell prose (BCG · Deloitte · IBM-class)

**Audience default:** Skeptical **buyer, board, and procurement** readers who associate credibility with **composed, analytic prose**—similar in *register* to how **BCG, Deloitte, and IBM** structure insights pages and case narratives: **thesis → implication → evidence**, not hype.

| ID | Principle | Operational test (pass if…) |
|----|-----------|------------------------------|
| **EC-01** | **Coherent sentences** | Each sentence has a clear **subject–verb–object** spine; ideas that belong together appear in **one** sentence with proper subordination, not as three choppy fragments. |
| **EC-02** | **Em-dash budget** | **≤1** em dash (—) per **paragraph** unless inside a quotation or a proper name; never **double em dashes** as cheap emphasis. Prefer **comma, colon, parenthesis, or a second sentence**. |
| **EC-03** | **Comma discipline** | No **comma splice** joining independent clauses; if a sentence has **≥4 commas**, split or use a **semicolon** / em dash **once** per EC-02—or restructure (lists belong in bullets). |
| **EC-04** | **Anti-staccato** | Not a run of **5+ sentences** each under **~9 words** without a longer anchor sentence; avoid “brochure rhythm” that reads machine-generated. |
| **EC-05** | **Executive register** | Calm, precise, slightly formal; **strong verbs** over stacked adjectives; avoid influencer cadence (“Here’s the thing,” “Let’s unpack”). |
| **EC-06** | **Paragraph thesis** | Opening sentence states the **claim**; following sentences **support or qualify** it with explicit connective logic (therefore, because, however)—not a list of unrelated assertions. |
| **EC-07** | **Banned hollow AI tells** | Flag and replace empty scaffolding: “it’s important to note,” “in today’s landscape,” “robust,” “unlock value,” “delve,” “tapestry,” “leverage” (when vague), “not only X but Y” **repeated**, “truly / indeed / very” without new information, **rule-of-three** synonymous adjectives (“scalable, flexible, and agile”). |
| **EC-08** | **First person (§8) without chat** | “I” stays **accountable and sparse**—not confessional, not a blog diary; no stacked hedges (“I would argue that perhaps…”). |

**P1 default:** Violations of **EC-02–EC-04** on homepage, case studies, consulting, and about pages (read as low-trust “AI slop”). **P2:** Single-instance slips in long body copy.

---

### Severity model

| Level | Meaning | Example |
|-------|---------|---------|
| **P0** | Block release | Legal risk, false metrics, contradictory CTAs, inaccessible critical instructions. |
| **P1** | Fix before or immediately after merge | Misleading nav, heuristic violations in checkout/contact flows, broken NN-09/NN-11. |
| **P2** | Backlog | Diction polish, minor redundancy, optional clarity gains. |

---

### CRA approval workflow

1. **Self-check** — Author runs **Quick gate** (below) before requesting CRA.
2. **CRA review** — Full pass with Principle IDs or veto.
3. **QA Engineer (§7)** — Grammar, links, and consistency after CRA Conditional/Pass.
4. **Ship** — Architect §10 checklist.

**Statuses:** `Blocked` | `Conditional` | `Clear`.

---

### Quick gate (author self-check, 5 minutes)

- [ ] **NN-02** first line of each section states the point.
- [ ] **NN-07** no unverifiable superlatives; **§9** placeholders flagged.
- [ ] **H-05 / H-09** errors and edge states human-readable.
- [ ] **DN-02** every CTA matches next screen’s job.
- [ ] **ID-01 / ID-03** human outcome + engagement model clear for page type.
- [ ] **X-07** no manipulative patterns.
- [ ] **§12** offerings copy still matches card contract if editing homepage.
- [ ] **Part H (EC-01–EC-08):** no em-dash sprawl, comma splices, or staccato stacks; register reads **consulting-credible**, not AI-caption.

---

### Copy-paste execution prompt (CRA run template)

```text
You are the Copy Regulatory Architect (CRA) defined in bmad.md §15.

Objective:
Vet the provided copy against the CRA truth bible (NN/g Parts A–B, Norman Part C, IDEO Part D, Cross-laws Part E, Arch/dev Part F, Evidence ladder Part G). Compare explicitly to those lineages—not generic marketing advice.

Inputs:
- Page type: (home / work index / case study / consulting / about / nav component / transactional / other)
- Audience state: (cold / warm / returning)
- Copy to vet: (paste)
- Known constraints: (metrics public? legal review? character limits?)

Process:
1) Score each applicable principle ID as PASS / GAP / FAIL (skip N/A with reason).
2) List findings by severity P0/P1/P2 with Principle IDs cited.
3) For each P0/P1, propose a concrete rewrite (string-level), not vague advice.
4) State final verdict: Blocked | Conditional | Clear.
5) If Conditional, define the minimal re-review scope.

Voice:
Preserve §8 voice rules unless they conflict with a higher-severity principle—if conflict, note it and recommend voice revision. **Part H** overrides “casual first person” when it drifts into **AI-tell** or **non-executive register** on buyer-facing pages.

Output format:
## Verdict + scope
## Principle matrix (compact table: ID — status — one-line note)
## Findings (P0, P1, P2)
## Rewrites
## Evidence ladder check (if claims present)
## Re-review checklist
```

### Maintenance clause (living bible)

When NN/g, Norman corpus, or industry heuristic guidance evolves:

1. Add new **rows** with new IDs; **do not** silently redefine existing IDs.
2. Log the change in git commit message when updating this section.
3. Re-run CRA on templates (§5, §12, §14) when IDs are added that affect structure.

**Final note:** This section is intentionally **exhaustive and expandable**—it is the long-lived **design + architecture bible** for copy. Prefer **adding rows** over deleting history; deprecate with “superseded by ID-XX” if needed.

---

## 16) Agent: Research Methods Mapper (Quant + Qual Retrace + Methodology Copy)

Use this agent whenever you need to **re-select**, **justify**, or **write up** the research design behind a **tech solution** (product, workflow, API surface, model-backed feature, enterprise tool, mobile app, etc.). It answers: *Given this solution and constraints, which quantitative and qualitative methods are appropriate and feasible—and how do we describe the quant work credibly in narrative?*

### Agent identity

- **Name:** `Research Methods Mapper` (RMM)
- **Mission:** Map **decision questions** → **feasible methods** → **mixed-methods trace** (what to run, in what order, with what ethics and limits), then produce **ready-to-paste methodology content**, with **quant sections** explicit enough for case studies, proposals, and CRA (§15) / evidence ladder (§15 Part G) alignment.
- **Partners:** **Analyst** (audience + questions), **Data/Analytics Specialist** (§7), **Case Study Format Architect** (§13–§14 `Methodology` section), **CRA** (claim wording after results exist).

### Inputs (minimum)

1. **Solution one-pager** — What ships: user-facing surfaces, data flows, integrations, ML/AI or not, regulated domain or not.
2. **Stage** — Discovery / validation / pre-launch / post-launch / optimization / incident response.
3. **Decision type** — Desirability, usability, value, performance, safety, retention, revenue, compliance.
4. **Constraints** — Timeline, budget, access to users, access to **event** data, PII/PHI, locale, offline populations, org politics.
5. **Risk** — Cost of wrong decision (reputational, financial, safety).

### Retrace workflow (mandatory order)

1. **Freeze the decision question** — One primary question per study slice; secondary questions listed as out-of-scope or follow-up.
2. **Classify the solution archetype** — Use the matrix below; allow hybrid tags.
3. **Shortlist quant methods** — From §16 library; mark **feasible / blocked** with reason (data, sample, ethics, instrumentation).
4. **Shortlist qual methods** — Complement gaps quant cannot close (motivation, mental model, workaround behavior, trust).
5. **Triangulation plan** — Which qual explains *why* if quant shows *what*; which quant validates prevalence of qual themes.
6. **Instrumentation & ethics** — Consent, retention policy, minimization, opt-out, vulnerable users, logging PII.
7. **Write quant methodology content** — Use **Quant content scaffolds** per method ID; tie claims to **G0–G4** before results exist (hypothesis + design) and after (results).

### Solution archetype → default evidence strategy (first pass)

| Archetype | Primary quant leans | Primary qual leans | Typical triangulation |
|-----------|---------------------|--------------------|------------------------|
| **Consumer product / growth** | Funnel analytics, A/B, cohort retention, survey scales | Intercepts, usability tests, diary | Qual themes → survey items → A/B on copy/UX |
| **B2B / enterprise workflow** | Task-time samples, error rates, adoption funnels, support volume | Contextual inquiry, stakeholder interviews, shadowing | Shadowing finds friction → instrumented task metrics |
| **Regulated (health, finance, gov)** | Audited logs, controlled pilots, pre-post with governance | Semi-structured interviews, expert review, cognitive walkthrough with protocols | Qual risk narrative + quant compliance metrics |
| **AI / ML-assisted UX** | Offline eval, shadow mode, human-in-loop rates, precision/recall on labeled set | Think-aloud on failures, error taxonomy study | Failure qual codes → label set → model + UX metrics |
| **Internal tools / ops** | Throughput, TAT, queue depth, rework rate | Gemba walk, service blueprint interviews | Interview “workarounds” → dashboard + before/after |
| **Zero-to-one / prototype** | Smoke-test conversion, fake-door rates, pricing WTP surveys | Concept tests, RITE usability | Cheap quant falsifiers + rapid qual depth |
| **Incident / churn diagnostic** | Segmented cohorts, survival analysis, funnel diffs | Exit interviews, support ticket coding | Quant finds *where*; qual finds *why* |

---

### Feasibility gates (block unsound methods early)

| Gate | Question | If “no” |
|------|----------|---------|
| **F-01** | Is the **metric definition** owned (event name, SQL, cohort key)? | Do not promise that metric; instrument first or choose proxy. |
| **F-02** | Is **sample** large enough for the method’s minimum power rule-of-thumb? | Downgrade to directional (§15 G1) or switch method. |
| **F-03** | Can we avoid **biased convenience** samples for claims that generalize? | Scope claims to segment; use weighting/disclosure. |
| **F-04** | **Ethics** — consent, vulnerable populations, dark patterns in research? | Block deceptive designs; revise recruitment and copy. |
| **F-05** | **Simpson’s paradox** risk (segments mixed)? | Pre-specify segments in plan; report both raw and adjusted where relevant. |
| **F-06** | **Peeking** / multiple comparisons without correction? | Pre-register primary metric; Bonferroni or hierarchical testing where needed. |

---

### Library A — Quantitative methods (selection + how to write about them)

Each row is stable for citations in docs: **`QM-##`**. “**Write block**” = paste-ready paragraph pattern for Methodology sections; replace bracketed fields.

| ID | Method | Appropriate when… | Feasibility watchouts | What it produces | Write block (pattern) |
|----|--------|---------------------|------------------------|------------------|-------------------------|
| **QM-01** | **Event / product analytics** (funnels, paths, feature usage) | Logged behavior exists; decision is about flow or adoption | Missing events, dirty taxonomy, anonymous traffic | Rates, counts, conversion, retention curves | “We instrumented [funnel/feature] in [tool] with definitions: [key events]. Primary view: [cohort/window]. We reported [metric] as [formula] to answer [question]. Limitations: [missing data / self-selection].” |
| **QM-02** | **A/B or multivariate test** | Clear variant; traffic sufficient; ethical to expose | Underpowered traffic; novelty/primacy effects | Lift on primary + guardrails | “We ran a randomized experiment ([dates], [n] assignments). Primary: [metric definition]. Guardrails: [list]. We used [fixed-horizon OR sequential rule] to control false positives. Results interpreted at [G2/G3] per pre-analysis plan.” |
| **QM-03** | **Cohort retention / survival** | Subscription or repeat use; churn is the risk | Right-censoring ignored; cohort definitions shift | Retention tables, half-life, hazard reasoning | “We defined cohorts by [activation rule] and measured [retention definition] over [window]. Comparisons used [same calendar alignment / same tenure]. Confounds noted: [product/market changes].” |
| **QM-04** | **Survey (structured scales: SUS, CSAT, CES, custom Likert)** | Need scalable attitude or effort signal | Non-response bias; leading wording | Distributions, segment cuts | “We fielded [n] responses ([channel], [dates]) using [scale] for [construct]. Wording: [neutral phrasing note]. We report [median/mean policy] and [confidence interval / margin] where applicable.” |
| **QM-05** | **MaxDiff / conjoint / choice modeling** | Prioritization of features or positioning | Hard for respondents; needs analysis skill | Relative importance, WTP bands | “We used a discrete-choice design ([attributes]) with [n] completes. Analysis: [hierarchical Bayes / multinomial logit]. Outputs informed [decision], not point WTP as guaranteed price.” |
| **QM-06** | **Benchmark task (timed, success rate)** | Usability or efficiency claim | Learning effects; lab vs field gap | Mean/median time, success % | “Participants completed [task set] on [build]. We recorded [success, time-to-complete, errors] with [tooling]. Order balanced for carryover. We report [aggregate] with [spread] and exclude [outlier rule] per protocol.” |
| **QM-07** | **Benchmark suite at scale** (unmoderated remote) | Many variants; geographic spread | Panel quality | Same as QM-06 + demographics | “We used [platform] with [screeners]. Tasks mirrored production constraints: [list]. Sample: [n], [geo]. Quality filters: [speeders, attention checks].” |
| **QM-08** | **QA / defect analytics** | Reliability or error reduction story | Incomplete ticket taxonomy | Defect density, MTTR, reopen rate | “We tagged incidents with [taxonomy]. Baseline window [a] vs post [b] holding [definition constant]. We avoided conflating [volume change] with [quality change] by normalizing per [denominator].” |
| **QM-09** | **Performance / latency / cost metrics** | Tech solution has SLOs | Synthetic vs production mismatch | p50/p95/p99, error budget | “We measured [latency/cost] under [load profile] in [env]. SLO framed as [target]. Regression tests: [tool]. User-visible impact tied via [link].” |
| **QM-10** | **Search / relevance offline metrics** | IR or recommendation change | Offline ≠ online | nDCG, MRR, precision@k on labeled set | “We constructed a judgment set of [n] queries with [labeling protocol]. Offline primary: [metric]. Online validation planned: [QM-02 or QM-01].” |
| **QM-11** | **ML model evaluation** (confusion matrix, calibration, drift) | Model affects UX or safety | Leakage, label noise | ROC-AUC, calibration curves, drift stats | “We split data by [time/unit] to mimic deployment. Reported [metrics] on holdout [period]. Error analysis sampled [n] false positives/negatives for qual follow-up (e.g. QL-03).” |
| **QM-12** | **Natural experiment / diff-in-diff / interrupted time series** | External shock or staggered rollout | Strong assumptions | Causal-ish estimate with caveats | “We exploited [policy/rollout] as exogenous variation. Identification: [DiD/ITS] with [controls]. Threats: [list]. Claim tier: [G2/G3 with caveats].” |
| **QM-13** | **Quota / stratified sampling survey** | Need representative slice | Weighting complexity | Segment estimates | “Sampling frame: [source]. Quotas on [dims]. Post-stratification weights applied for [segments].” |
| **QM-14** | **Card sorting / tree testing (quant layers)** | IA or navigation decisions | Small n for card sorts | Similarity matrix, success paths | “We ran [closed/open] card sort with [n] and analyzed with [cluster method]. Tree test: [tasks] on [n]; success defined as [rule].” |
| **QM-15** | **Correlation / regression exploratory** | Hypothesis generation in dashboards | Confounding | Associations, not causation unless designed | “Exploratory analysis linked [x] and [y] controlling for [minimal set]. Framed as hypothesis-generating; causal claims require [QM-02/12].” |
| **QM-16** | **Synthetic monitoring / canaries** | Reliability narrative for shipped systems | False confidence if not user-like | Uptime, probe success | “Synthetic checks ran [frequency] against [endpoints]; alerts [policy]. Distinct from real-user QM-01.” |

**Quant “methods paragraph” recipe (case study / proposal)** — Assemble 1 short paragraph per method actually used:

1. **Question** (what decision the quant served).  
2. **Definition** (events, cohort, formula — **NN-08** alignment).  
3. **Design** (window, sample, randomization if any).  
4. **Analysis** (summary stats, test, corrections).  
5. **Limitations** (bias, power, confounds).  
6. **Claim tier** (G0–G4) **before** adjectives in Outcomes.

---

### Library B — Qualitative methods (selection + pairing with quant)

| ID | Method | Appropriate when… | Feasibility watchouts | Pairs with quant… |
|----|--------|---------------------|------------------------|-------------------|
| **QL-01** | **Semi-structured interviews** | Unknown problem space; stakeholder complexity | Recruitment time | QM-04 (validate themes), QM-01 (behavior context) |
| **QL-02** | **Contextual inquiry / ethnography** | Workflow tacit knowledge | Access, long cycle | QM-06/08 (instrument friction points) |
| **QL-03** | **Usability testing (moderated)** | Interaction hypotheses | Small n | QM-06/07 (scale tasks) |
| **QL-04** | **Diary / longitudinal study** | Habits, fatigue, trust over time | Attrition | QM-03 (retention), QM-01 (episodic usage) |
| **QL-05** | **Focus groups** | Norms, vocabulary debates | Dominant speaker bias | QM-04 (wording tests) |
| **QL-06** | **Card sort (qual read)** | Mental models of groups | Analysis labor | QM-14 |
| **QL-07** | **Thematic analysis of tickets/chat** | Ops reality at scale | PII redaction | QM-08 |
| **QL-08** | **Participatory design workshops** | Alignment + generative ideas | Facilitation skill | QM-02 (test resulting concepts) |
| **QL-09** | **Cognitive walkthrough / heuristic eval** | Expert-led risk scan | Not user prevalence | QM-06 (validate fixes) |
| **QL-10** | **Case study (single org deep dive)** | Enterprise narrative | Generalization limits | QM-01 adoption metrics |

---

### Mixed-methods trace templates (by question type)

| If the core question is… | Start with… | Then… | Write-up emphasis |
|---------------------------|---------------|--------|-------------------|
| “Do people understand this?” | QL-03 or QL-09 | QM-06 at scale | Quant task success + qual failure clips |
| “Which variant wins?” | QM-02 | QL-03 on losers to explain | Quant lift + qual *why* guardrails fired |
| “Why did metric move?” | QM-01 segmentation | QL-07 or QL-01 | Quant localization + qual mechanism |
| “Is the model safe to ship?” | QL-03 on failures | QM-11 + QM-01 | Quant rates + qual error taxonomy |
| “What to build next?” | QL-01 + QL-08 | QM-05 or QM-04 prioritization | Qual opportunities → quant rank |

---

### Copy-paste execution prompt (RMM run template)

```text
You are the Research Methods Mapper (RMM) defined in bmad.md §16.

Objective:
For the described tech solution, retrace appropriate QUANT and QUAL methods, mark feasibility under stated constraints, and produce publication-ready METHODOLOGY content—especially detailed prose for each QUANT method selected.

Inputs:
- Solution summary:
- Archetype(s) from §16 matrix (or propose hybrid):
- Stage:
- Primary decision question:
- Constraints (data, time, ethics, access):
- Instruments already available (analytics tool, CRM, app logging):

Tasks:
1) List candidate methods from Libraries A–B with FEASIBLE / BLOCKED + one-line reason per blocked.
2) Recommend a phased plan (discovery → validation → post-launch) if relevant.
3) Triangulation: state explicitly what qual closes that quant cannot, and vice versa.
4) Ethics & data minimization checklist (brief).
5) OUTPUT — “Quant methods content pack”:
   For each FEASIBLE quant method ID (QM-##), output:
   - **Methodology paragraph** using the Write block pattern from the library (filled in, not bracket stubs where info exists; use sensible placeholders only if unknown).
   - **Metric dictionary** table: metric name | definition | source | caveats.
   - **Claim tier** per §15 G-ladder for any results you anticipate (if pre-study: anticipated claim ceiling).
6) OUTPUT — “Qual methods summary”: 1 tight paragraph per QL-## selected (purpose, n, analysis approach).
7) Risks: top 3 ways this study could mislead stakeholders if executed poorly.

Tone:
Plain English, first person where writing for Chandan’s site (§8). No fake precision. Align numbers language with §15 NN-08 and evidence ladder §15 Part G.

Output format:
## Archetype + question
## Feasibility table (method ID — status — reason)
## Recommended sequence (timeline)
## Triangulation note
## Ethics / minimization
## Quant content pack (per QM-##)
## Qual summary (per QL-##)
## Misleading-study risks
```

### Cross-links

- Case studies: populate **§5 item 4 (Approach)** and **§13 consumable artifact 5** + **§14** methodology row from RMM output.  
- Claims in copy: run **CRA (§15)** after metrics exist; pre-register **G-tier** language in the quant pack.  
- **§4 theme 2** (evidence-led): methodology copy should show **both** method rigor and **honest limits**.

### Maintenance

Add new **`QM-##` / `QL-##`** rows when tooling or domains expand; never reuse IDs for a different method.

---

## 17) Pipeline: CX AI Case Study Generator (Scout → Novelty Gate → Case Study Architect)

Use this pipeline when you want **new case-study seeds** grounded in **real-world, customer-facing uses of AI** (support, sales, onboarding, field service, retail, travel, banking apps, copilots in live journeys—not internal-only admin tools unless the story is explicitly about **agent-facing CX enablement** with measurable customer impact).

**Design intent:** A **research scout** gathers signals; a **novelty + UX copy standards gate** kills lazy or me-too ideas before they waste narrative work; only passes feed the **Case Study Format Architect (§13)** (optionally followed by **CRA §15** and **RMM §16** when you ship).

### Sourcing ethics (non-negotiable)

1. **Prefer** publisher RSS/Atom feeds, official press rooms, public APIs, and URLs you have permission to fetch—**not** password walls, paywalled full text without license, or `robots.txt`-disallowed paths.
2. **Do not** frame hostile high-rate scraping of third-party sites as “research.” If a source has no feed, **manual capture** (link + summary in your notes) is the default.
3. **Attribution:** Every signal ships `source_url`, `publisher`, `retrieved_at` (ISO date). The case study page must not imply you **delivered** work you only **observed**—use **industry signal / analogous pattern / desk research** framing unless it is your engagement.

Optional repo helper: `scripts/fetch-cx-ai-feeds.sh` pulls configured feed URLs into `research/cx-ai-inbox/` for paste-into-scout runs.

### Handoff schema (JSON between agents)

Use one object per signal through the pipeline:

```json
{
  "signal_id": "CXAI-2026-001",
  "retrieved_at": "2026-05-05",
  "source_url": "https://example.com/article",
  "publisher": "Example",
  "title": "",
  "one_line_cx_claim": "",
  "customer_touchpoints": ["support chat", "checkout"],
  "ai_mechanism": "e.g. retrieval-augmented assistant, vision + policy, voice agent",
  "evidence_snippets": ["short verifiable quotes or stats from source"],
  "why_customer_facing": "1-3 sentences",
  "novelty_hypothesis": "what is new vs generic chatbot or FAQ bot",
  "risks_or_caveats": ["hype", "pilot-only, unproven at scale", etc],
  "gate_verdict": null,
  "gate_tier": null,
  "gate_notes": null
}
```

After the gate, set `gate_verdict` to `PASS` | `CONDITIONAL` | `REJECT`, `gate_tier` to `STELLAR` | `SOLID` | `CRAP`, and `gate_notes` to structured rationale (see below).

### Agent 1 — `CX AI Signal Scout`

- **Mission:** Find and structure **high-signal** examples of AI changing a **customer-visible** journey (latency, clarity, safety, personalization with guardrails, accessibility, handoff to human, transparency).
- **Inputs:** Raw feed XML, article URLs, bullet notes from conferences, product changelogs—**with** `source_url` and date.
- **Output:** A **ranked list** of `signal` objects (schema above), max **12** per batch, sorted by **strength of CX claim** (specific touchpoint + mechanism, not “we use AI”).
- **Hard filters (scout-level):** Drop items that are pure fundraising hype, **internal-only** efficiency with no customer story, or **vendor blog** genericism with no concrete journey change.

**Copy-paste prompt — Scout**

```text
You are the CX AI Signal Scout defined in bmad.md §17.

Task:
From the pasted sources (URLs, feed excerpts, notes), extract up to 12 candidate signals of AI used in CUSTOMER-FACING experiences or frontline roles that directly shape customer outcomes.

For each signal, output one JSON object matching the §17 handoff schema (signal_id you assign sequentially). Fill evidence_snippets only from provided text—no invented metrics.

Rank strongest CX stories first. Omit anything that fails the scout hard filters.
```

### Agent 2 — `CX AI Novelty Gate` (UX copy standards + idea quality)

This is the **reject “average / me-too”** layer before any case study labor. It is **stricter than “is the grammar fine?”**—it asks whether the idea **earns** a portfolio-grade story.

- **Name:** `CX AI Novelty Gate` (aliases: **UX copy standards gate** for idea quality in this pipeline.)
- **Mission:** Classify each scout output into **`STELLAR` | `SOLID` | `CRAP`** and set **`PASS` | `CONDITIONAL` | `REJECT`**.
- **Alignment:** Use **§8 voice**, **§15** truth/claim discipline (NN-07, NN-08, NN-13, EC heuristics), and the **CRAP** bar below—**average ideas are REJECT** (`gate_verdict: REJECT`, `gate_tier: CRAP`). **SOLID** may pass only as **`CONDITIONAL`** with a explicit list of what would need to become true (evidence, scope, or differentiation) before §13.

#### Tier definitions (operational)

| Tier | Meaning | Typical `gate_verdict` |
|------|---------|-------------------------|
| **STELLAR** | Clear **novel** mechanism or **sharp** reframing of a known pattern; **specific** customer touchpoint; **defensible** differentiator vs “Slapped a chatbot on the FAQ.” | `PASS` |
| **SOLID** | Real CX impact but **differentiation is thin** or evidence is **soft**; could support a **short** insight piece, not necessarily a flagship case study without more research. | `CONDITIONAL` |
| **CRAP** | Generic “AI-powered personalization,” **vague** superlatives, **undifferentiated** chat assistant, **unverifiable** claims, or **internal tool** masquerading as CX story. **Does not meet portfolio bar.** | `REJECT` |

**Copy-paste prompt — Novelty Gate**

```text
You are the CX AI Novelty Gate (bmad.md §17).

For each JSON signal below:
1) Assign gate_tier: STELLAR | SOLID | CRAP using the §17 table.
2) Assign gate_verdict: PASS only for STELLAR. CONDITIONAL for SOLID (list what must improve). REJECT for CRAP.
3) gate_notes: 3-6 bullets citing tier rationale; map any copy-truth issue to §15 principle IDs (e.g. NN-07, NN-13) where relevant.
4) If REJECT, one blunt one-liner: why this would embarrass the site if published as a “case study” without a total reframe.

Output: amended JSON objects plus a one-table summary: signal_id | tier | verdict.
```

### Agent 3 — `Case Study Format Architect` (§13)

- **Trigger:** Only signals with `gate_verdict: PASS`, or `CONDITIONAL` after you have resolved the listed gaps in notes (then re-run Gate once).
- **Input block to paste into §13 “Project inputs”:** Merge **approved JSON** into the §13 bullet list (north star = customer outcome implied by signal; **honesty** = desk research / industry pattern unless it is your project).
- **Follow-on:** Run **CRA (§15)** on any customer-facing strings; run **RMM (§16)** if you are claiming methodology or outcomes beyond what the public source supports.

### End-to-end copy-paste (orchestrator stub)

```text
Run in order:
1) CX AI Signal Scout (§17) on fresh sources → JSON list.
2) CX AI Novelty Gate (§17) on that list → PASS/REJECT table; drop REJECT.
3) Case Study Format Architect (§13) on each PASS (or upgraded CONDITIONAL) → five-artifact package.
4) Optional: CRA §15 + RMM §16 before build.

Reminder: If you did not execute the work, label narrative as research / industry case / analogous pattern—never implied client delivery.
```

### Cross-links

- **§13** — full page outline and five artifacts.  
- **§15** — copy and claim vetting for anything public.  
- **§16** — methodology defensibility when outcomes are asserted.  
- **§5** — simpler 8-part template if you need a lighter HTML page than the full §13 wireframe.
