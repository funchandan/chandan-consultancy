# BMAD Narrative System

This file is the source of truth for Chandan Sharma's story, positioning, and case-study writing system.
Use this content to keep all pages cohesive (`about`, `work`, `case studies`, and consulting copy).

---

## 1) Brand Positioning

**Name:** Chandan Sharma  
**Positioning:** UX and Growth Consultant  
**Core Promise:** I design products and interventions that improve user outcomes and business outcomes together.  
**Differentiator:** I combine social-impact systems thinking, deep UX research, and measurable growth execution.

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
  - Hero “resources” panels: do not cap body copy with a very tight `max-width` (e.g. low `ch`) inside a wide card—it causes awkward wraps and orphaned words; prefer `min(ch, %)` or let the copy use the card width with padding only.
- Data/Analytics Specialist
  - Insert measurable proof points and metric framing.
- QA Engineer
  - Check accuracy, consistency, grammar, and claim credibility.

---

## 8) Voice and Style Rules

1. Write in first person, plain English, no jargon-heavy inflation.
2. Lead with outcomes, then explain method.
3. Keep claims specific and defensible.
4. Show cross-functional leadership without sounding vague.
5. Balance mission-driven intent with commercial clarity.

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

