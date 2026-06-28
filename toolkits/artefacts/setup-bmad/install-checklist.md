# BMAD install checklist

Copy this checklist when setting up BMAD in a new repo.

## Prerequisites

- [ ] Node 18+
- [ ] Git repo initialized
- [ ] Cursor or Claude Code with skills support

## Install

- [ ] Run `npx bmad-method install` from repo root
- [ ] Confirm `_bmad/` folder created with `bmm/config.yaml`
- [ ] Confirm `.agents/skills/bmad-*` or equivalent skills path exists
- [ ] Run `bmad-help` (or invoke skill) to verify catalog loads

## Configure

- [ ] Edit `_bmad/bmm/config.yaml` — set `planning_artifacts`, `user_name`
- [ ] Create `_bmad-output/planning-artifacts/` if missing
- [ ] Optional: add WDS via whiteport-design-studio install

## First workflow

- [ ] `bmad-product-brief` or `bmad-prd` for greenfield
- [ ] `bmad-create-epics-and-stories` after PRD
- [ ] `bmad-dev-story` for implementation slices

## Verify

- [ ] `_bmad/_config/bmad-help.csv` lists installed skills
- [ ] Output lands under `_bmad-output/` per config paths
