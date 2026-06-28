# Audience rules — education toolkits (all walkthroughs)

**Purpose:** Every toolkit page must work for a reader who has **never seen this repository**.  
**Applies to:** LinkedIn series toolkits (Tier A), stack walkthroughs (Tier B), and meta guides (Tier C).

---

## Three tiers

| Tier | Slugs (examples) | Reader | Rule |
|------|------------------|--------|------|
| **A — Universal process** | `score-design-before-review`, `score-research-and-design-loop` | Any UX/design/research team | Fully tool-agnostic. No author stack required. |
| **B — Stack walkthrough** | `setup-bmad`, `setup-hermes-personal`, `wireframe-with-excalidraw`, `wds-design-loop`, `curate-agent-skills` | Teams adopting that upstream tool | Teach the **upstream product** using **their** docs paths; no portfolio case studies. |
| **C — Meta / maintainer** | `toolkit-review-loop` | People who publish walkthrough sites | Pattern is portable; site-specific paths labeled as **this site’s example**. |

LinkedIn `/linkedin-toolkit-series` Phase 2 defaults to **Tier A** unless TPO explicitly requires a stack (then Tier B + `companion_slugs`).

---

## Mandatory content rules (all tiers)

### 1. Voice and reader

- Write for a practitioner **outside** this org.
- **You need:** not **Prerequisites from this repo**.
- No “Lately I’ve noticed…” on toolkit pages (that is LinkedIn voice only).
- No unsourced portfolio metrics (“we went from 3 rounds to 1 on loyalty…”).

### 2. Paths and commands

| Do | Do not |
|----|--------|
| `path/to/your/repo`, `standards/`, `work/` | `/Users/chandansharma/...`, `~/Downloads/...` |
| “Save rubrics where your team agreed” | `cp` from this repo’s tree as the only path |
| Upstream paths **after install** (e.g. BMAD `_bmad/`) with “installer creates…” | `_bmad-output/D-UX-Design/...` as if every reader has WDS |
| **`path-convention.md`** when readers define folders (Tier A) | Hard-coded `docs/research/` without “example layout” |

Steps = **actions + exit criteria**. Terminal blocks = **shape examples**, not author machine history.

### 3. Links and curated sections

| Section | Content |
|---------|---------|
| **Further reading** | Public URLs (gov.uk, NN/g, WCAG, upstream GitHub, product docs) |
| **Optional on this site** | Other walkthroughs on chandansharma.com / cross-links to author stack |
| **Downloads** | Starter templates only — never “live file from this portfolio” as primary download |

Do not put `.agents/skills/`, `_progress/`, `.hermes/plans/` in the main walkthrough body as required reading.

### 4. Automation

- **Tier A:** `agent-review-prompt.md` — any IDE/chat agent; schedule = manual, CI, or calendar.
- **Tier B (Hermes):** Gateway + cron are Hermes-specific; default cron must match page TPO (project context, not toolkit-meta unless Tier C).
- Never require Hermes/BMAD/WDS for Tier A pages.

### 5. Compare cards (Before / After)

- Generic team pain vs outcome.
- No “on this portfolio programme…”

### 6. Attribution footer

```text
Starter templates / process pattern — adapt for your organisation. Not affiliated with [upstream maintainer].
```

Optional: link to upstream license/repo. No LinkedIn draft links in Tier A/B body.

### 7. Registry (`walkthrough-registry.yaml`)

- `repos:` may list **author paths for maintainer context** — readers never need them to run the walkthrough.
- LinkedIn slugs: `product_objective`, `linkedin_thesis`, `companion_slugs` required when applicable.

---

## Tier A checklist (LinkedIn + universal)

- [ ] `path-convention.md` in artefacts
- [ ] `toolkit-outcome--hero` = full TPO in plain language
- [ ] Objective Fit O7 ≥ 8 (open-source fidelity — runs off-repo)
- [ ] `#curated` = Further reading (public)
- [ ] Related / optional site links separated at bottom
- [ ] LinkedIn artefact SVG = page `#artefact` loop (O6)

---

## Tier B checklist (stack walkthrough)

- [ ] Hero links **upstream** project (GitHub / docs), not this repo
- [ ] Steps use post-install paths from upstream docs
- [ ] Example picks / YAML labeled **starter** — reader replaces with their stack
- [ ] No download card pointing at `../_bmad/`, `../.hermes.md`, `skills-lock.json` as required
- [ ] Plain-language gloss for jargon (greenfield, gateway, handoff file)

---

## Tier C checklist (meta)

- [ ] Open with “If you publish walkthrough pages…”
- [ ] Registry / rubric filenames explained as **pattern**, with “rename for your site”
- [ ] Hermes cron prompt scoped to **your** HTML catalogue, not user R&D (see `score-research-and-design-loop`)

---

## Anti-patterns (fail review)

| Fail | Fix |
|------|-----|
| “Read `walkthrough-registry.yaml`” on user R&D TPO | User rubric + user artefact paths |
| Top 10 skills = this repo’s pin list | Template YAML + audit steps |
| Step 2: copy live `config.yaml` from portfolio | Download checklist + upstream install doc |
| Curated: WDS / Hermes required for scoring walkthrough | Move to Optional on this site |
| Education PASS only | Also Objective Fit when `product_objective` set |

---

## Skill cross-refs

- TPO + Objective Fit: [objective-gates.md](objective-gates.md)
- Phase 2 structure: [phase-2-education-toolkit.md](phase-2-education-toolkit.md)
- Post voice (not toolkit voice): `content/linkedin/_voice-rubric.md`
- Education v3: `toolkits/_education-rubric.md`
