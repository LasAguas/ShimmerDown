// The one place that knows how to talk to the Las Aguas dashboard.
//
// Everything here runs SERVER-SIDE ONLY. The store slug, the form slug and the
// form id stay in environment variables and never reach the browser — the
// pages call this site's own /api routes, and these functions do the rest.

export const API_BASE =
  process.env.LAS_AGUAS_API || "https://lasaguasproductions.com";

export const STORE_SLUG =
  process.env.STORE_SLUG || "shimmer-down-studios-store";

export const FORM_SLUG =
  process.env.NEWSLETTER_FORM_SLUG || "newsletter-sign-up-zdr1";

export const FORM_ID = process.env.NEWSLETTER_FORM_ID || "";

// Where Stripe sends a buyer back to. Prefers the explicit setting, then the
// deployment Vercel gives us, then localhost for `next dev`.
export function siteOrigin(req) {
  if (process.env.SITE_ORIGIN) return process.env.SITE_ORIGIN;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const host = req?.headers?.host || "localhost:3000";
  return `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
}

// A fetch with a deadline. The dashboard is another deployment; if it stalls
// we'd rather answer "unavailable" than hold a serverless function open until
// the platform kills it.
export async function callDashboard(path, { method = "GET", body, timeoutMs = 9000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
      // Next.js patches global fetch and caches GET requests by URL unless
      // told otherwise — silently, even outside the app router. Without this
      // the catalogue (and its prefix-stripped names) can go stale between
      // dashboard edits, and stock/price checks at checkout could read a
      // cached number instead of the live one.
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    // AbortError or a network failure — both are "the dashboard didn't answer"
    return { ok: false, status: 504, data: { error: "dashboard_unreachable" } };
  } finally {
    clearTimeout(timer);
  }
}

// Only these methods, and always a JSON answer.
export function methodGuard(req, res, allowed) {
  if (allowed.includes(req.method)) return true;
  res.setHeader("Allow", allowed.join(", "));
  res.status(405).json({ error: "method_not_allowed" });
  return false;
}
