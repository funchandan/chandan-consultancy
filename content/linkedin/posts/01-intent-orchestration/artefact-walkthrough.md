# Walkthrough evidence — design rubric + Hermes loop

Export `artefact-walkthrough.svg` to PNG for LinkedIn (1080x1080). **Single source for both:**

- `content/linkedin/posts/01-intent-orchestration/artefact-walkthrough.svg` (1080×1080 feed)
- `toolkits/artefacts/score-research-and-design-loop/rd-score-loop.svg` (page `#artefact`)

Same six steps, same paths, same Hermes cron name.

## Loop

1. Agree paths for design rubric + evidence
2. Run design rubric workshop
3. Save design rubric at stable path
4. Score manually before share
5. Integrate Hermes — gateway + `design-rubric-review` cron
6. Fix failures; revise rubric rows when the same row fails 3×

## Paths (any repo)

| File | Role |
|------|------|
| `standards/design-rubric.md` | Team-authored pass bar |
| `work/design/<feature>/` | Frames, Excalidraw, or Figma links in checklist |
| `reviews/score-log.md` | Hermes appends score rows here |
| `reviews/checklists/<task>.md` | Pre-share manual score |

## Hermes

See `toolkits/artefacts/score-research-and-design-loop/agent-review-prompt.md` and `toolkits/setup-hermes-personal.html`.
