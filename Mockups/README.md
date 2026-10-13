# Shimmer Down Studios — website redesign (6 pages)

Static HTML pages, no build step. Each page is a self-opening `.dc.html` file that
depends on `support.js` in the same folder.

## Run it

Serve the folder (browsers block some `file://` loads):

```
python3 -m http.server 8080
# open http://localhost:8080/  (index.html redirects to the home page)
```

## Pages

| Nav label | File | Default band palette |
| --- | --- | --- |
| (logo) Home | `Shimmer Down.dc.html` | Red sun |
| Work | `Work Compact.dc.html` | Sessions (peach funnels) |
| Studio | `Studio.dc.html` | Daylight, Room A/B wall strips |
| Media | `Live Sessions.dc.html` | Plum, rounded band frame |
| Vibe | `Contact.dc.html` | Dusk, full-bleed photo + quote |
| Shop | `Store.dc.html` | Red sun, artist drawers |

`index.html` redirects to the home page. All header links are relative, so keep
every file in one folder with `assets/` and `uploads/` beside them.

## Files

```
*.dc.html      the six pages (markup + logic class + props JSON)
support.js     runtime — REQUIRED
index.html     entry redirect
assets/        wordmark, vinyl photos, studio photos, placeholders
uploads/       hero video + source images the user supplied
```

## How settings work (important)

Every page has a props JSON on its `<script data-dc-script>` tag. Each prop's
`default` is the signed-off look for that page. At runtime the logic class reads
that JSON (`__DC_DEFAULTS`) and merges it under any passed props (`this.pp()`),
so the page renders its saved settings in any browser — no editor needed.

To change a page's look permanently, edit the `default` values in its props JSON.

Colour and type flow through CSS custom properties on `html` (`--sun-1…7`,
`--bands-*`, `--paper`, `--paper-2`, `--ink*`, `--font-*`, `--film-filter`,
`--grain-*`). First-paint values are baked into each page's `<style>` block; the
logic class rewrites them from props on mount.

## Known issues before launch

1. **Hot-linked images** from `shimmer-down-studios.com` (session thumbnails,
   Studio gallery, Vibe photo). Download them into `assets/` and repoint.
2. **No mobile nav** — the header is one row; needs a collapsing menu under ~900px.
3. **Placeholder links** (`href="#"`): FAQ, Impressum, Instagram, shop item pages,
   session video links. Newsletter form and basket do not submit anywhere.
4. **Shop products** use the vinyl photos as stand-ins; real product data and
   checkout need wiring (e.g. Shopify / Stripe).
5. **Grain** is a fixed full-viewport SVG noise layer — test on low-end mobile.

## Conventions

- Inline styles only; `<helmet><style>` holds just variables, resets, keyframes.
- Content column: `min(1240px,100%)` with `clamp(1.25rem,4vw,3.5rem)` gutters.
- Display type Helvetica Neue 900, uppercase; body Source Serif 4; shop UI Jost/Helvetica.
