# Deploy share bundle to Vercel

Static site: **Work**, **About**, and three **case studies** with images under `assets/`.

## One-time setup

1. Push this repo to GitHub (or connect a local folder in the [Vercel dashboard](https://vercel.com/new)).
2. Import the project in Vercel.
3. Leave defaults:
   - **Framework preset:** Other
   - **Build command:** (empty)
   - **Output directory:** `.` (repository root)
   - **Install command:** (empty)
4. Deploy.

`vercel.json` at the repo root sends `/` → `/share/work.html` and maps `/work.html` and `/about.html` to the share pages so case-study nav links work.

## URLs after deploy

Replace `YOUR_DOMAIN` with your Vercel URL (e.g. `chandan-portfolio.vercel.app`).

| Page | URL |
|------|-----|
| Work (home) | `https://YOUR_DOMAIN/share/work.html` or `https://YOUR_DOMAIN/` |
| About | `https://YOUR_DOMAIN/share/about.html` |
| BYJU's case study | `https://YOUR_DOMAIN/case-studies/points-marketplace-foundational.html?from=share` |
| HPE case study | `https://YOUR_DOMAIN/case-studies/hp-field-service-ai.html?from=share` |
| Stryker case study | `https://YOUR_DOMAIN/case-studies/stryker-field-logistics.html?from=share` |

Case cards on Work already append `?from=share` so **Back to work** returns to the share bundle.

## CLI (optional)

```bash
npm i -g vercel
cd "/path/to/New project"
vercel
vercel --prod
```

## Pre-ship checklist

- [ ] Open Work → each case study → Back to work
- [ ] About → scroll experience chapters → CTA → Work
- [ ] Images load on case studies (hero, gallery)
- [ ] Email link: `chandan004sharma@gmail.com`
- [ ] Paste production URL into `share/friend-email-intro.txt`

## What is excluded from upload

`.vercelignore` skips dev-only folders (`_bmad-output`, `scripts`, `.cache`, `cv`, etc.) to keep deploys fast. Required paths: `share/`, `case-studies/`, `assets/`, `styles.css`.
