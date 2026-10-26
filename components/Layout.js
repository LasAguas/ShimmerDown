// Nav + page + footer. Every page renders through this so the chrome can
// never drift between them.
//
// `overHero` tells the nav there's a full-bleed photo under it to start with,
// so it opens transparent and lands on paper once you scroll past.
import Head from "next/head";
import PageField, { RING_RAMPS } from "./PageField";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import CursorGlow from "./CursorGlow";
import { THEME_RINGS } from "./SunRings";
import { SITE_ORIGIN, SITE_NAME, DEFAULT_LOCALE } from "../lib/site";

// The origin lives in lib/site.js now (it also feeds sitemap.xml, robots.txt
// and the JSON-LD blocks). Re-exported because LayoutLogo still imports it
// from here. See TODO.md item 7.
export { SITE_ORIGIN };

// Every share image in /public/images/og is cropped to this size.
const OG_W = 1200;
const OG_H = 630;

export default function Layout({
  children,
  title,
  // The whole <title>, when "Page — Shimmer Down Studios" isn't what you want
  // (the home page leads with the brand instead).
  titleFull,
  description,
  path = "/",
  // "noindex, follow" for a page that should stay out of search results.
  robots,
  // The 404 page has no address of its own, so it must not claim one.
  noCanonical = false,
  // The same page in each language, as { en: "/studio", de: "/de/studio" } —
  // paths, every language listing all the others and itself. Left out, the page
  // just names itself as the English version, which is what a single-language
  // site is meant to say. Every language version must pass the same map, or
  // Google ignores the pairing.
  alternates,
  // Structured data for the page: one schema.org object, or an array of them.
  // Each page builds its own, next to its copy.
  jsonLd,
  overHero = false,
  // Which arrangement of the backdrop this page gets — see components.css →
  // "one arrangement per page". Only used when there's no hero: a page with a
  // full-screen photograph doesn't need a field behind it.
  field = "work",
  // The client's October mockup, page by page: set `theme` (peach, daylight,
  // plum, dusk or shop — see globals.css → "page themes") and the nav, page
  // and footer all take that page's palette. Pass field="none" with it: the
  // mockup has no fixed backdrop, its pages carry their own bands and rings.
  // A page that passes neither (home, /faq, /impressum, /links) is untouched.
  theme,
  // "plum" gives the nav a fixed plum ground that never flips to paper — the
  // Live Sessions header. Anything else leaves it as it was.
  navTone,
  // The footer's own margin-top (globals.css → .footer) gives ordinary page
  // content breathing room before it — right for a page of text, wrong for
  // a page whose content IS a full-bleed photo ending right where the
  // footer starts. Set this when that's the case (see pages/contact.js) and
  // the gap collapses to zero.
  flushFooter = false,
  ogImage = "/images/og/studio-control.jpg",
  ogImageAlt = "The control desk at Shimmer Down Studios, monitors either side, facing the live room",
}) {
  // Normally "Page — Shimmer Down Studios"; a page can hand over the whole
  // title with `titleFull`. Neither given means just the studio name.
  const fullTitle = titleFull || (title ? `${title} | ${SITE_NAME}` : SITE_NAME);
  const url = `${SITE_ORIGIN}${path}`;
  const imageUrl = `${SITE_ORIGIN}${ogImage}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  // No hreflang on a page that isn't meant to be found (404, noindex).
  const hreflangs =
    noCanonical || /noindex/i.test(robots || "")
      ? []
      : Object.entries(alternates || { [DEFAULT_LOCALE]: path });
  const defaultPath = alternates?.[DEFAULT_LOCALE] ?? path;

  const page = (
    <>
      {!overHero && field !== "none" && <PageField variant={field} />}
      <CursorGlow />
      <SiteNav overHero={overHero} tone={navTone} />
      <main id="main" className={flushFooter ? "mainFlush" : undefined}>
        {children}
      </main>
      <SiteFooter ramp={theme ? THEME_RINGS : RING_RAMPS[field]} />
    </>
  );

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {robots && <meta name="robots" content={robots} />}
        {!noCanonical && <link rel="canonical" href={url} />}
        {hreflangs.map(([lang, p]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={`${SITE_ORIGIN}${p}`} />
        ))}
        {hreflangs.length > 0 && (
          <link rel="alternate" hrefLang="x-default" href={`${SITE_ORIGIN}${defaultPath}`} />
        )}
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {!noCanonical && <meta property="og:url" content={url} />}
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content={String(OG_W)} />
        <meta property="og:image:height" content={String(OG_H)} />
        <meta property="og:image:alt" content={ogImageAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content={ogImageAlt} />
        {/* "<" is escaped so a stray "</script>" in a product description
            can't end the block early */}
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
            }}
          />
        ))}
      </Head>

      {/* display: contents (globals.css) — the wrapper only carries the
          theme's custom properties down to the nav, page and footer; it adds
          no box, so fixed/sticky children and `.mainFlush + .footer` behave
          exactly as they do without it */}
      {theme ? (
        <div className="themeRoot" data-theme={theme}>
          {page}
        </div>
      ) : (
        page
      )}
    </>
  );
}
