# LinkedIn voice rubric — AI/UX research series

**Author:** Chandan Sharma, 32. Practitioner on enterprise product and research programmes. Not a veteran keynote voice.

## Non-negotiable rules

### 1. Honest tenure
- Do **not** claim decades of practice ("for thirty years", "25 years in UX", etc.).
- Anchor credibility in **current work**: portfolio programmes, field research, specs shipped, loops you run.
- OK: "In programmes I've worked on…", "Lately on r/UXDesign I've seen…", "I set up a cron loop in my repo…"

### 2. Personal lens on a general trend
- Open with observation, not authority: **"Lately I've noticed…"**, **"What keeps showing up in my feed…"**, **"I've been testing…"**
- Name the trend plainly (AI slop, vibe-coded UX posts, tool hype without artefacts).
- One short paragraph on **what you did** in response, not what the industry "must" do.

### 3. Short post, one clear takeaway
- Target **600–900 characters** for the LinkedIn feed body (excluding hashtags).
- End with **one line** the reader can remember - **reader value first**, not your repo setup. e.g. *"Score design outputs against standards before review - fewer prompt iterations, higher first-pass acceptance."*
- No three-part frameworks in the feed post. Save depth for optional long-form below the fold or first comment.

### 4. Visual = walkthrough or evidence
- **No** abstract concept diagrams as the primary visual.
- **Yes:** real steps, commands, file paths, registry snippets, Excalidraw/Figma artefact previews from your repo.
- Artefact must be reproducible: reader could run step 1 without asking you.

## Style (Nielsen-adjacent, not AI)

- Short paragraphs. Plain words. One idea per paragraph.
- No em dashes or en dashes. Use ` - ` (hyphen with spaces).
- Banned: delve, landscape, game-changer, leverage, revolutionary, it's worth noting, in today's fast-paced.
- No numbered tip lists ("5 ways to…") unless the takeaway itself is a short checklist in the **image**.
- Close with **one question** or **one offer** (walkthrough link, artefact download).

## Post file contract

- `post.md` → `## LinkedIn` → `### Post` (feed) + `### Första kommentar`
- `artefact-walkthrough.md` or `artefact.svg` → evidence visual (export to PNG for LinkedIn)
- Frontmatter `Bild:` points at the file uploaded to LinkedIn

## Hermes draft cron

When drafting from `ai-ux-research-series.yaml`, read `content/linkedin/_voice-rubric.md` and `.agents/skills/linkedin-toolkit-series/SKILL.md` (Phase 1). Fail review if rules 1–4 are violated.
