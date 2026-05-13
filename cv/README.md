# CV (HTML → PDF)

Spec: `_bmad-output/planning-artifacts/cv-prd-v1.md` (**v1.1 shipped** — party critique §8.2 closed)  
Canonical bullets: `_bmad-output/planning-artifacts/cv-canonical-bullets.md`  
Evidence: `_bmad-output/planning-artifacts/cv-evidence-bank-v1.md`

## Files

| File | Use |
|------|-----|
| `index.html` | Hub links to all variants |
| `cv-pm.html` | Senior PM / group PM emphasis |
| `cv-design.html` | Head of design / design director emphasis |
| `cv-uxhead.html` | Head of UX / principal research emphasis |
| `cv.css` | Shared layout and print rules |

## Before you share externally

1. Replace the portfolio link: search for `../index.html` and use your public URL (or LinkedIn).
2. **BYJU’s Future School title (2021–22):** CV uses **Manager, user insights** (paired with **Manager, new initiatives** at WhiteHat Jr). If HR paperwork uses a different string, mirror that verbatim in all three `cv-*.html` files.
3. Add LinkedIn on the contact block if you want it (not in v1).
4. Re-read metrics with Evidence Bank; tighten wording if any claim needs employer sign-off.

**v1.1 note:** Portfolio line was **removed** from CV PDFs per PRD §6.6 until a live public URL exists.

## Print to PDF (manual)

1. Open the variant in Chrome (file URL is fine).
2. **Print** → **Save as PDF** → Paper **A4**, margins **Default**, **Background graphics** on (optional; design uses light surfaces).

## Headless export (macOS + Chrome)

From repo root:

```bash
bash scripts/cv-export-pdf.sh
```

Requires Google Chrome at the default macOS path. Writes PDFs to `cv/pdf/`.
