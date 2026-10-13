// /robots.txt — everything may be crawled, and the sitemap is pointed at.
//
// A page rather than a file in /public because the Sitemap line has to be an
// absolute URL, and the origin is configured once in lib/site.js.
//
// /api is deliberately NOT disallowed: the shop fills itself from
// /api/store/resolve, and a crawler that can't call it can't see the products.
// Pages that should stay out of search results say so themselves (a robots meta
// tag, via Layout's `robots` prop) — blocking them here would hide that tag
// from the crawler and they could still be listed.
import { SITE_ORIGIN } from "../lib/site";

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
  res.end();
  return { props: {} };
}

export default function Robots() {
  return null;
}
