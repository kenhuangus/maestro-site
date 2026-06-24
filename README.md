# MAESTRO — The 7-Layer Threat Modeling Framework for Agentic AI

A self-contained, GitHub Pages–ready **slide deck** for Ken Huang's talk on the
**MAESTRO** threat modeling framework. Presents as full-screen slides (one per screen,
no scrolling) with **Prev / Next buttons**, keyboard arrows, swipe, click-dots, and a
progress bar. Every figure is **re-drawn by hand** in an Excalidraw style (rough.js) —
no screenshots of slides, no external runtime dependencies.

**Navigation:** `→ / Space / PageDown` next · `← / PageUp` prev · `Home / End` first/last ·
swipe or scroll on touch/trackpad · click the dots · deep-link a slide with `#3` in the URL.

## What's inside

| File | Purpose |
|---|---|
| `index.html` | The single-page site (hero, about, why, 7 layers, method, tool, contact) |
| `assets/style.css` | GauntletAI-inspired design system (Space Grotesk + Inter + Kalam) |
| `assets/diagrams.js` | Hand-drawn (Excalidraw-style) figures rendered at runtime with rough.js |
| `assets/deck.js` | Slide navigation — Prev/Next, keyboard, swipe, dots, progress |
| `assets/rough.min.js` | Vendored rough.js v4.6.6 (no CDN — works offline & on Pages) |
| `assets/books.png`, `assets/contact-card.png` | Author imagery extracted from the deck |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

All seven slide figures are redrawn as live SVG:
limitations of legacy frameworks · the 7-layer mind map · the MCP layer-mapping table ·
the five agentic factors · and three MAESTRO Sentinel tool mockups.

## Run locally

```bash
cd maestro
python -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repo (e.g. `maestro-site`) and push this folder:
   ```bash
   git remote add origin https://github.com/<you>/maestro-site.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`.
3. The site goes live at `https://<you>.github.io/maestro-site/`.

## Credits

Content & framework: **Ken Huang, CISSP** — CSA Fellow, OWASP AIVSS Project Lead, CEO of
DistributedApps.ai. Tool: <https://maestro-sentinel.com/>.
