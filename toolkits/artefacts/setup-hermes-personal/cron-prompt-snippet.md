# Hermes toolkit education cron

Job ID: `c6913b098685`  
Name: `toolkit-education-review`  
Schedule: every 12 hours

## Create (reference)

```bash
hermes cron create \
  --name toolkit-education-review \
  --workdir "/Users/chandansharma/Documents/New project" \
  --skill requesting-code-review \
  "every 12h" \
  "Read toolkits/walkthrough-registry.yaml. For each walkthrough, score toolkits/<slug>.html against toolkits/_education-rubric.md v2 when the page exists. Curate content only — no new proprietary toolkits. Update _progress/toolkit-education-review.md. PASS when all status:published pages score >=18/20."
```

## Edit prompt

```bash
hermes cron edit c6913b098685 --prompt "Read toolkits/walkthrough-registry.yaml..."
```

## Manual run

```bash
hermes cron run c6913b098685
```

## Gateway (required for scheduled runs)

```bash
hermes gateway install
hermes cron status
```
