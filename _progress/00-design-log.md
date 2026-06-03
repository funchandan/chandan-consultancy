# Design log — Work case study gallery

**Project:** Portfolio — work case studies  
**Page in scope:** Case study gallery walkthrough (`case-card-gallery`)  
**Started:** 2026-05-25

## Current table

| Task | Owner | Status |
|------|-------|--------|
| Redesign gallery walkthrough | Freya → Mimir | ux-design in-progress |
| Index methodology gallery audit | Saga → Freya → Mimir | v2 approved + WO-003 shipped |
| Index hero v2 + credibility strip | Mimir | FA-001 shipped (WO-004) |

## Design Loop Status

| Page | Discuss | Spec | Wireframe | Approve | Update spec | Implement | Review | Tokens |
|------|---------|------|-----------|---------|-------------|-------------|--------|--------|
| `case-gallery-walkthrough` | ✓ | S v2 | ✓ | ○ | ✓ v2 spec | ● v6 scroll impact | ○ | ○ |

Legend: ● active · ○ not started · B built (brownfield — retroactive spec pending)

## Notes

- Live implementation: `assets/case-study-card-gallery.{js,css}`, promoted HTML under `case-studies/`.
- Pipeline: `scripts/lib/case_study/render.py` generates slide markup from approved copy packages.
- Redesign runs through WDS Design Loop; implementation waits on approved wireframe + spec.
