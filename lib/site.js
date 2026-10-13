// The site's public address and name, in one place: Layout builds every
// canonical / og:url / og:image from it, and sitemap.xml, robots.txt and the
// JSON-LD blocks on the pages use it too — so they can never disagree.
//
// Set SITE_ORIGIN in Vercel (TODO.md items 7 and 18). Until it's set, this
// falls back to the address the site is actually live at today, because a
// canonical that points at a domain that doesn't exist tells Google to ignore
// the page. A localhost value is ignored on purpose: .env.local.example sets
// SITE_ORIGIN=http://localhost:3000 for Stripe's return URL in dev, and that
// must never end up in a canonical tag.

const FALLBACK_ORIGIN = "https://www.shimmer-down-studios.com";

function resolveOrigin() {
  let raw = (process.env.SITE_ORIGIN || "").trim().replace(/\/+$/, "");
  if (!raw || /localhost|127\.0\.0\.1|\[::1\]/.test(raw)) return FALLBACK_ORIGIN;
  if (!/^https?:\/\//.test(raw)) raw = `https://${raw}`;
  return raw;
}

export const SITE_ORIGIN = resolveOrigin();
export const SITE_NAME = "Shimmer Down Studios";
