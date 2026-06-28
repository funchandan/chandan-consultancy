# Hermes design rubric review cron

Use this after you complete **setup-hermes-personal** (CLI, gateway, workdir). Fill in paths from your `path-convention.md`.

## Variables (set once per team)

```text
DESIGN_RUBRIC = standards/design-rubric.md
DESIGN_GLOB   = work/design/**/*
SCORE_LOG     = reviews/score-log.md
WORKDIR       = /path/to/your/repo
LOOKBACK_DAYS = 14
```

## Create the cron job

```bash
hermes gateway install   # once per machine; confirm with: hermes cron status

hermes cron create \
  --name design-rubric-review \
  --workdir "$WORKDIR" \
  --skill requesting-code-review \
  "every 12h" \
  "Read [DESIGN_RUBRIC]. Find files under [DESIGN_GLOB] changed in the last [LOOKBACK_DAYS] days (or listed in open checklists under reviews/checklists/). For each artefact, score against the rubric (0-2 per row, sum total, compare to pass threshold in the rubric). Append one row per artefact to [SCORE_LOG] with: Date, Task name, Type (design), Artefact path or URL, Score, Pass (Y|N), Reviewer (Hermes), Fix notes. For each Fail row, suggest exactly one concrete fix tied to the lowest-scoring row. Do not rewrite whole documents. Do not change the rubric unless a human asks. Do not review folders outside the convention. Output a short summary: how many passed, how many failed, top fix per failure."
```

Replace bracketed paths in the prompt string with your real paths before saving the job.

## Manual run (before you trust the schedule)

```bash
hermes cron run <job-id>
```

Check `[SCORE_LOG]` for new rows only. Rubric file should be unchanged.

## Self-improving rubrics (human step)

Hermes scores against the rubric you wrote; it does not rewrite standards on its own.

| Signal | Action |
|--------|--------|
| Same rubric row fails 3+ times on different tasks | Run a 15 min rubric row rewrite in your workshop notes; bump version in the rubric header |
| Pass bar too easy (everything passes, review still debates) | Raise threshold or add one observable row |
| Pass bar too hard (nothing passes) | Split one vague row into two checkable rows |

Re-run the cron after rubric updates. That loop — score, fix, revise rubric when patterns repeat — is the self-improving part.

## Optional: research rubric in the same job

Add a second prompt or extend this one with `standards/research-rubric.md` and `work/research/**/*` if your team scores synthesis the same way.

## Manual fallback (no Hermes)

Paste the scoring instructions from the create prompt into any IDE agent weekly. The loop works without a schedule; Hermes removes the manual copy-paste step.

## What this job must not do

- Score marketing sites, internal wikis, or paths outside your convention
- Lower the pass bar automatically
- Replace human sign-off on high-risk decisions
