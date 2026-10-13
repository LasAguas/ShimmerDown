# Shimmer Down Studios

Next.js (pages router), no UI framework, deployed on Vercel.

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## How it's laid out

**Content is inline in the page files.** Every word on `/work` is at the top of
`pages/work.js`, in plain objects — no CMS, no content file to cross-reference.
To change a record, a session or a heading, open the page and edit it. The two
exceptions are the nav labels and the footer's contact block, which appear on
all six pages and so live at the top of their own components (see TODO item 24).

```
pages/
  index.js            hero + live sessions
  work.js             two carousels of records, with audio
  studio.js           showreel + gallery + specs
  live-sessions.js    the three films, and why the room works this way
  store.js            the shop frame
  contact.js          the big mailto
  faq.js              booking, room, shop questions
  impressum.js        § 5 DDG + privacy
  404.js              the "page not found" page
  sitemap.xml.js      /sitemap.xml — ADD NEW PAGES TO ITS PATHS LIST
  robots.txt.js       /robots.txt
  api/
    store/            resolve · checkout · confirm   → the dashboard
    newsletter/       track · subscribe              → the dashboard

styles/
  globals.css         palette, type, bands, shared furniture, nav, footer
  components.css      sign-up, video, hero, player, carousels, shop
  <page>.module.css   one per page, scoped

components/           behaviour only; no page copy except nav + footer
lib/
  dashboard.js        the only thing that talks to lasaguasproductions.com
  catalogue.js        the shop's products, for the API route and getStaticProps
  site.js             the public origin + site name (canonicals, sitemap, schema)
  categories.js       splits one flat store into category tabs
```

## Search engines

Every page renders through `components/Layout.js`, which writes the title,
description, canonical, Open Graph / Twitter tags and (when a page passes
`jsonLd`) its structured data. Per page: pass `title` (becomes "Title — Shimmer
Down Studios") or `titleFull`, a `description` of roughly 120–155 characters,
and an `ogImage` from `public/images/og/` (1200×630). Pass `robots="noindex,
follow"` to keep a page out of results. The site's address comes from the
`SITE_ORIGIN` env var via `lib/site.js` — set it in Vercel, or every canonical
points at the fallback.

`/` and `/store` are built with `getStaticProps` and refreshed every minute, so
the shop's products are in the HTML a crawler reads; the browser still refreshes
stock on load. See TODO.md items 7, 22 and 28.

## The design system, in one paragraph

The golden-hour ramp (`--sun-1` … `--sun-7`) is **never** drawn as a smooth
blend — always as hard-edged bands, via `--bands` / `--bands-rev` / `--bands-h`.
That's the 80s-studio fixture from the client's reference, done in their own
palette. It's the nav underline, the section rules, the scrub bar's played
portion, the tab indicators and the seam under the hero. Ground is warm cream
(`--paper`), type is warm near-black (`--ink`); there are no neutral greys,
because a true grey reads as dirty against this cream.

## The dashboard

Store and mailing list are both the Las Aguas dashboard. The slugs and form id
stay **server-side** — the browser only ever calls this site's own `/api`
routes, which proxy through `lib/dashboard.js`. Nothing about the dashboard
ships in the client bundle.

Prices are display-only: the dashboard re-prices every line at checkout, so
nothing a visitor edits in dev tools can change what they're charged. Stripe
Checkout collects the card, email and shipping address, which is why there's no
address form anywhere in this repo.

## Before launch

See **[TODO.md](TODO.md)**. The blockers are the two font licences, the
Impressum, the real domain, publishing the webstore, and the Vercel env vars.
# ShimmerDown
