// Nav + page + footer. Every page renders through this so the chrome can
// never drift between them.
//
// `overHero` tells the nav there's a full-bleed photo under it to start with,
// so it opens transparent and lands on paper once you scroll past.
import Head from "next/head";
import PageField from "./PageField";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

// Change this once the domain is live — it builds the canonical and og:url
// tags on every page. See TODO.md item 7.
export const SITE_ORIGIN = "https://shimmerdownstudios.com";
const SITE_NAME = "Shimmer Down Studios";

export default function Layout({
  children,
  title,
  description,
  path = "/",
  overHero = false,
  // Which arrangement of the backdrop this page gets — see components.css →
  // "one arrangement per page". Only used when there's no hero: a page with a
  // full-screen photograph doesn't need a field behind it.
  field = "work",
  ogImage = "/images/gallery/studio-control-wide.jpg",
}) {
  // The home page's <title> is just the studio name; everywhere else is
  // "Page — Shimmer Down Studios".
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_ORIGIN}${path}`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE_ORIGIN}${ogImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {!overHero && <PageField variant={field} />}
      <SiteNav overHero={overHero} />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
