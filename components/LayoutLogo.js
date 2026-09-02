// ---------------------------------------------------------------------------
// PREVIEW ONLY — not used by any real page. A copy of Layout.js that renders
// SiteNavLogo instead of SiteNav, so pages/preview-logo.js can show the logo
// wordmark in context (nav, hero, footer, all together) without touching the
// Layout every real page depends on. See SiteNavLogo.js for why.
// ---------------------------------------------------------------------------
import Head from "next/head";
import PageField from "./PageField";
import SiteNavLogo from "./SiteNavLogo";
import SiteFooter from "./SiteFooter";
import { SITE_ORIGIN } from "./Layout";

const SITE_NAME = "Shimmer Down Studios";

export default function LayoutLogo({
  children,
  title,
  description,
  path = "/",
  overHero = false,
  field = "work",
  ogImage = "/images/gallery/studio-control-wide.jpg",
}) {
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
        <meta name="robots" content="noindex" />
      </Head>

      {!overHero && <PageField variant={field} />}
      <SiteNavLogo overHero={overHero} />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
