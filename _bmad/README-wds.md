# Whiteport Design Studio (WDS)

## Installed in this project

| Path | Purpose |
|------|---------|
| `_bmad/wds-source/` | Git clone of [whiteport-design-studio](https://github.com/whiteport-collective/whiteport-design-studio) (for updates: `git pull`) |
| `_bmad/wds/` | Processed install target + `config.yaml` |
| `.cursor/rules/wds/` | Cursor agent launchers (Saga, Freya, Mimir) |
| `_progress/wds-project-outline.yaml` | Phase tracker |
| `_wds-learn/` | Created after full install (learning material) |

## Finish processed install (recommended)

The interactive `npx whiteport-design-studio install` prompts for input. Use the non-interactive script:

```bash
chmod +x scripts/install-whiteport-design-studio.sh
./scripts/install-whiteport-design-studio.sh
```

Or:

```bash
cd _bmad/wds-source && npm install --ignore-scripts
cd ../.. && node scripts/install-whiteport-design-studio.mjs
```

That compiles agents into `_bmad/wds/agents/` and refreshes `.cursor/rules/wds/`.

## Use in Cursor

1. Open **Cursor Settings → Rules** and enable rules under `wds/` (or @-mention them).
2. Start with **Saga** for a new programme: `@saga` or ask to follow `_bmad/wds-source/src/skills/saga/SKILL.md`.
3. Design output goes under `design-process/` (configurable in `_bmad/wds/config.yaml`).

## Update WDS

```bash
git -C _bmad/wds-source pull
./scripts/install-whiteport-design-studio.sh
```
