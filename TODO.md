# Shimmer Down Studios — todo

Numbered so the code can point at them: search the repo for `TODO.md item 7`
and you'll land on the line that needs it.

Tags: **[BLOCKER]** stops launch · **[CONTENT]** needs something from the
client · **[POLISH]** makes it better, not possible

---

## 1. **[DONE]** Brodille is licensed "just for personal use"

Swapped for **Source Serif 4** (Google Fonts, OFL) — a text-weight classic
serif in the Georgia/Hoefler Text family, loaded via `pages/_document.js` and
set as `--font-body` in `styles/globals.css`. `Brodille-Regular.ttf` is
deleted from `public/fonts/`.

## 2. **[DONE]** Intro Rust needs a webfont licence

Swapped for **Jost** (Google Fonts, OFL) — a geometric grotesque in the Futura
family, matching the logo wordmark's character. Loaded via
`pages/_document.js`, set as `--font-display`. `IntroRust-Base.otf` is deleted
from `public/fonts/`.

## 3. **[POLISH]** Three typefaces, on purpose — check you're happy with it

Form fields, legal prose and product prices still use `--font-fine` (a plain
system sans) rather than the body serif, and all the small uppercase labels
use the display face. Unlike Brodille, Source Serif 4 doesn't break down below
16px, so `--font-fine` is now a deliberate stylistic choice rather than a
technical necessity — it could go away and the site would drop to two faces,
if you'd rather.

## 4. **[BLOCKER]** The Impressum has real data now — still get it lawyered

`pages/impressum.js` has the right *shape* (§ 5 DDG, § 18 Abs. 2 MStV, EU-ODR,
plus a privacy section) and is now filled in with the freelancer's real
details (Barney Jack Walsinghan Riley, Mehringdamm 97, 10965 Berlin,
Steuernummer DE 14/494/00849 — the studio is not a UG/GmbH/GbR, so there's no
Handelsregister entry or separate managing director). A wrong German
Impressum is still an Abmahnung risk with real costs — needs a lawyer's read
before the site goes live.

## 5. **[CONTENT]** Real studio details

Address, day rate, block rate, opening hours. Currently "Placeholder Straße 12,
10999 Berlin" in three places: `components/SiteFooter.js` (`FACTS`),
`pages/contact.js` (`DETAILS`), `pages/impressum.js`.

## 6. **[CONTENT]** Real social URLs

`components/SiteFooter.js` → `SOCIAL`. The Instagram link currently points at
instagram.com with no handle.

## 7. **[BLOCKER]** The real domain

`components/Layout.js` → `SITE_ORIGIN` is `https://shimmerdownstudios.com`,
guessed. It builds every canonical and `og:url`, so a wrong value means every
share card points somewhere that doesn't exist. Also set `SITE_ORIGIN` in
Vercel's environment variables (see item 18).

## 8. **[POLISH]** YouTube poster frames come from Google's CDN

`components/VideoEmbed.js` doesn't load YouTube until someone clicks play — so
no cookies are set and no consent banner is needed. But the poster image is
still fetched from `i.ytimg.com`, which leaks the visitor's IP to Google. To be
fully first-party, download the three poster frames into `public/images/` and
pass them as the `poster` prop.

## 9. **[DONE]** Hero videos

The home page hero is now the showreel (`pages/index.js` → `HERO.slides`),
autoplaying muted and looped, hosted on Vercel Blob rather than `public/` —
at 43MB it's well over the ~4MB this item originally called for since it's
the same file also used for the studio showreel. Worth cutting a short,
dedicated silent loop for the hero specifically if that weight ever shows up
in load-time numbers; `components/Hero.js` needs no changes to take it,
just a new `src`/`poster` on the slide.

## 10. **[CONTENT]** Real sleeve art for /work

Ten records, all using square crops of the studio photos. Replace the `art`
paths in `pages/work.js` with real artwork (square, ideally 1000×1000+) and
delete `public/images/art/placeholder-*.jpg`.

## 11. **[CONTENT]** Real audio for /work

Every record points at `public/audio/placeholder-track.wav`, a 24-second quiet
hum. Drop real files into `public/audio/` and update the `audio` field on each
record. **Use MP3 or AAC, not WAV** — and use clips (60–90s), not full masters:
these are shop-window samples, and full-length lossless files are both a
bandwidth bill and a licensing question. Then delete the placeholder.

## 12. **[DONE]** The showreel

`pages/studio.js` → `SHOWREEL.src` now points at the mp4 on Vercel Blob,
played through `VideoEmbed`'s click-to-play facade (paused until pressed).

## 13. **[DONE]** Real studio photography

Filled in — 21 real photos in `public/images/gallery/`, renamed and resized
on the way in. `pages/studio.js` → `GALLERY` uses all of them; the home page
hero (`pages/index.js` → `HERO.slides`) and the default `ogImage` in
`components/Layout.js` were pointing at files that didn't exist at all and
now use real shots too.

## 14. **[CONTENT]** Real studio specs

`pages/studio.js` → `SPECS`. Room size, console, monitoring, converters,
backline list. These are invented and a client will notice.

## 15. **[POLISH]** Contact page has no form, by choice

`/contact` is a big mailto link rather than a form — an enquiry about studio
time is a conversation, and a mail client the sender trusts beats a text box.
If you'd rather capture enquiries in the dashboard: create a form in
**Mailing → Forms**, and it can be wired up exactly like the footer sign-up
(`components/Newsletter.js` + `pages/api/newsletter/*`).

## 16. **[BLOCKER]** Keep the privacy notice true

The Datenschutz section of `/impressum` describes what the site does *today*:
newsletter to the dashboard, click-to-load YouTube, Stripe via the dashboard
for the shop. **If the site gains analytics, a Meta pixel, an embedded map or a
contact form, that section has to change with it** — and analytics or a pixel
would also mean a real consent banner, which the site currently does not need.

## 17. **[CONTENT]** Rename the shop's products so the artist rack works

The store is **published now** — `/store` is live with two products, *El Fuego
Vinyl* (€10, currently showing **sold out**: stock is 0 in the dashboard) and
*Shimmer Down Studios T-Shirt* (€20, S/M/L/XL). Two things still need doing:

**a) Prefix the names.** Neither product carries an artist prefix, so both land
in "Other" and the rack collapses to a plain grid (by design — one artist isn't
a rack). Rename them in **Admin → Webstore** and all three spines appear:

| Rename it to                        | Shows up under      | Displays as       |
| ----------------------------------- | ------------------- | ----------------- |
| `LBJ — El Fuego Vinyl`              | Los Baby Jaguars    | El Fuego Vinyl    |
| `SD — Studios T-Shirt`              | Shimmer Down        | Studios T-Shirt   |
| `Rising-sun print`                  | Other               | Rising-sun print  |

Separator can be `—`, `–`, `-` or `:`. Accepted prefixes live in
`lib/artists.js` — add an artist there and start prefixing.

**b) Add product photos and restock.** Both products have an empty `images`
array, so the cards show blank grey squares. And El Fuego Vinyl's stock is 0,
so it reads "Sold out" — intended if true, worth checking if not. Shipping is
€0 on both, which is also worth a look.

## 18. **[BLOCKER]** Vercel environment variables + the return-URL allowlist

Set from `.env.local.example`: `LAS_AGUAS_API`, `STORE_SLUG`,
`NEWSLETTER_FORM_SLUG`, `NEWSLETTER_FORM_ID`, `SITE_ORIGIN`.

⚠️ **Ask the Las Aguas team to add the live hostname to
`STORE_RETURN_URL_ALLOWLIST`** on the dashboard's own Vercel project. Without
it, checkout still charges correctly but buyers get returned to
lasaguasproductions.com instead of back to `/store`, and never see a receipt.

## 19. **[DONE]** Source images are 6–8MB each

Was `public/images/studio-*.jpg` — turned out those paths didn't exist; the
references were stale (see item 13). The real photos that replaced them live
in `public/images/gallery/`, downscaled to 2400px on the long edge and
re-encoded on the way in (440–840KB each, down from 4–6.8MB straight off the
camera).

## 20. **[DONE]** Fonts are .otf/.ttf, not .woff2

Moot — items 1 and 2 replaced both faces with Google Fonts, served as woff2
automatically.

## 21. **[DONE]** No favicon

`pages/_document.js` now links `public/images/logos/shimmer-down-logo-simple-small.png`
as the favicon.

## 22. **[POLISH]** No sitemap.xml or robots.txt

Six static pages; worth adding before asking Google to look.

## 23. **[POLISH]** Not a git repository yet

`.gitignore` is written but nothing is initialised. `git init`, first commit,
push, then connect the repo to Vercel.

## 24. **[POLISH]** Nav copy lives in the component, not a page

The brief was "content inline on page files", and page copy is — every word on
`/work` is in `pages/work.js`. But the nav labels and the footer's contact
block appear on all six pages, so they sit at the top of
`components/SiteNav.js` and `components/SiteFooter.js` instead. Flagging it in
case you'd rather they were somewhere else.

## 25. **[CONTENT]** FAQ answers are placeholder

`pages/faq.js` → `FAQS`. Six invented questions with best-guess answers, added
because the site now links to `/faq` from the Contact page. All six need a
pass from the client — especially "What's included in the day rate?", which
currently repeats the same invented rate structure as the footer and Contact
page (see item 5), and "How does shipping work in the store?", which describes
Stripe's own flow generically rather than anything specific to this shop.

The page isn't in the main nav on purpose — it's linked from Contact only, as
a reference for someone who's already decided to write in.

## 26. **[POLISH]** No newsletter opt-in at checkout

Buyer name/email/shipping address flow into the dashboard's order record
automatically — Stripe collects them, the dashboard's own webhook reads them
back on `/api/store-public/confirm`, nothing here has to forward them. But
that's a *purchase*, not a mailing-list signup: `lib/cartContext.js`'s
`checkout()` never sends `newsletterOptIn`, and there's no checkbox anywhere
in `CartButton.js` offering one. Right now the only way onto the list is the
footer's own sign-up (`components/Newsletter.js`). Worth adding a "keep me
posted" checkbox to the basket dropdown if the client wants buyers folded into
the list by default — not currently broken, just a gap.

## 27. **[POLISH]** Decide on the logo in the hero

The nav is settled: `components/SiteNav.js` now renders the "Variation G —
Even Dot Cadence" wordmark (inlined as SVG from
`public/images/logos/logo-wordmark-dots.svg`, with its baked-in white
background rect dropped so it can take `color` the same way the text it
replaced did) instead of "Shimmer Down" text. The small mark sits in the
footer next to the copyright line (`components/SiteFooter.js`). Both are
live everywhere.

Still open: the home hero's giant title. `/preview-logo` compares the real
logo artwork against the plain text at `/` — note its nav half is now stale
(it shows an earlier candidate, `logo-text-only.png`, not the Variation G
wordmark that actually shipped) so judge it on the hero only. If the hero
treatment should ship, fold it into `pages/index.js` and delete
`components/SiteNavLogo.js`, `components/LayoutLogo.js`,
`pages/preview-logo.js` and `styles/previewLogo.module.css`. If not, delete
those same four files anyway — nothing else references them.
