# Path convention (copy and adapt)

Pick **one layout** for your team. Write the chosen paths in your rubric header so humans and agents use the same locations.

## Example A - docs in a git repo

| Purpose | Example path |
|---------|----------------|
| Research rubric | `standards/research-rubric.md` |
| Design rubric | `standards/design-rubric.md` |
| Research output | `work/research/<study-name>/synthesis.md` |
| Design output | `work/design/<feature-name>/` (wireframes, specs) |
| Score history | `reviews/score-log.md` |
| Per-task checklist | `reviews/checklists/<task-name>.md` |

## Example B - design in Figma, research in Notion

| Purpose | Where it lives |
|---------|----------------|
| Rubrics | Same repo as code, or a shared team drive |
| Research synthesis | Notion page URL in checklist |
| Design evidence | Figma frame URL in checklist |
| Score history | `reviews/score-log.md` in repo (or spreadsheet link) |

**Rule:** Every row in the score log must point to **one canonical link or file path** a reviewer can open without asking in chat.

## Fill in your convention

```text
Research rubric:     _______________________________
Design rubric:       _______________________________
Research outputs:    _______________________________
Design outputs:      _______________________________
Score log:           _______________________________
Checklists:          _______________________________
```
