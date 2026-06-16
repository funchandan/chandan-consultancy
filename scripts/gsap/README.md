# GSAP stack

## Static HTML (portfolio pages)

`index.html` loads one prebuilt bundle:

- `assets/vendor/gsap/wp-gsap-all.min.js` — core GSAP + all plugins, `window.gsap` globals

Rebuild after upgrading `gsap` or `three` (local dev only — bundles are committed; Vercel ignores `scripts/`):

```bash
npm run build:vendors
# or individually:
npm run build:gsap
npm run build:three
```

Source: `scripts/gsap/site-bundle-entry.mjs` → `scripts/build-gsap-bundle.mjs` (esbuild IIFE).  
Three: `scripts/three/site-bundle-entry.mjs` → `scripts/build-three-bundle.mjs` → `assets/vendor/three/wp-three-all.min.js`.

## React / Next.js

Import from `@/lib/gsap` (or `../lib/gsap`):

```ts
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
```

Plugins are registered once at module load.

## Club GSAP

Some plugins (SplitText, MorphSVG, ScrollSmoother, etc.) require a [Club GSAP](https://gsap.com/pricing) license for production. If `npm install gsap` fails to resolve Club builds, add your token:

```ini
# .npmrc (do not commit tokens)
@gsap:registry=https://npm.gsap.com
//npm.gsap.com/:_authToken=YOUR_CLUB_TOKEN
```

See `.npmrc.example` in the repo root.

## Legacy vendor files

`gsap.min.js` and `ScrollTrigger.min.js` remain as reference copies; pages use `wp-gsap-all.min.js`.
