# Sketch Manifest

## Design Direction

Toolkit-first hero layout for `index.html` BoxBento ledge. The enlarged toolkit card is **proof of evidence** — walkthrough content plus rubric scores, artefact previews, registry counts, and cron heartbeat. Search relocates to the nav pill. Bottom row splits reviews (compact left) and sortable quiz (dominant right). Mobile stack: Toolkit → Reviews → Quiz.

## Reference Points

- Current implementation: `index.html` → `.wp-box-bento-ledge`
- Toolkit data: `assets/hero-toolkit-cards.json`, `toolkits/walkthrough-registry.yaml`
- Proof metrics: `_progress/toolkit-education-review.md`, `.hermes.md` cron `toolkit-education-review`
- Supersedes WO-023 search-in-bento assumption (see `_bmad-output/planning-artifacts/hero-boxbento-pivot-prd-v2.md`)

## Open Questions

1. ~~**Gemini fate**~~ — **Retired** on index
2. ~~**Proof metrics live vs static**~~ — **Per-toolkit `expertSignals`** in `hero-toolkit-cards.json`
3. ~~**Experience card**~~ — **Quiz stays**; Experience merges into reviews credibility strip

## Sketches

| # | Name | Design Question | Winner | Tags |
|---|------|-----------------|--------|------|
| 001 | toolkit-proof-hero | How should proof metrics coexist with the walkthrough card? | B | toolkit, proof, hero |
| 002 | reviews-quiz-split | What column split balances social proof vs interactive quiz? | B | reviews, quiz, layout |
| 003 | nav-search-trigger | How does search live in the nav pill without crowding links? | C | nav, search |
