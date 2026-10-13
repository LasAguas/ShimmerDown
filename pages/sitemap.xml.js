// /sitemap.xml — the pages worth indexing.
//
// ADD A PAGE TO THIS LIST when you add one under /pages. Left out on purpose:
//   /links       noindex (link-in-bio, duplicates the nav)
//   /impressum   legally required but not something to promote; it's linked
//                from every footer, so crawlers find it anyway
//   /preview-logo, /api/*   not pages anyone should land on
//
// No <lastmod>: nothing here knows when a page last changed, and a wrong date
// teaches Google to ignore the field.
import { SITE_ORIGIN } from "../lib/site";

const PATHS = ["/", "/work", "/studio", "/live-sessions", "/store", "/contact", "/faq"];

export async function getServerSideProps({ res }) {
  const urls = PATHS.map(
    (path) => `  <url><loc>${SITE_ORIGIN}${path}</loc></url>`
  ).join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
