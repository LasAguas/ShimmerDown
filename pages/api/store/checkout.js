// Hands the basket to Stripe.
//
// The browser sends only product ids, variants and quantities. It never sends
// a price: the dashboard re-prices every line from its own products, so
// nothing a visitor edits in dev tools can change what they are charged.
//
// The returnUrl is built HERE rather than taken from the request — a
// caller-supplied return URL is an open redirect waiting to happen.
import { STORE_SLUG, callDashboard, methodGuard, siteOrigin } from "../../../lib/dashboard";

const MAX_LINES = 20;
const MAX_QTY = 20;

export default async function handler(req, res) {
  if (!methodGuard(req, res, ["POST"])) return;

  const { items, email, newsletterOptIn } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Your basket is empty." });
  }
  if (items.length > MAX_LINES) {
    return res.status(400).json({ error: "That's more items than we can check out at once." });
  }

  // Rebuild every line rather than forwarding what arrived, so only these
  // three keys can ever reach the dashboard.
  const clean = [];
  for (const line of items) {
    const productId = String(line?.productId || "").trim();
    if (!productId) return res.status(400).json({ error: "Something in your basket looks wrong." });
    const qty = Math.min(MAX_QTY, Math.max(1, parseInt(line?.qty, 10) || 1));
    const entry = { productId, qty };
    if (line?.variant) entry.variant = String(line.variant).slice(0, 80);
    clean.push(entry);
  }

  const { ok, status, data } = await callDashboard("/api/store-public/checkout", {
    method: "POST",
    body: {
      slug: STORE_SLUG,
      items: clean,
      email: email ? String(email).trim().slice(0, 254) : undefined,
      newsletterOptIn: Boolean(newsletterOptIn),
      returnUrl: `${siteOrigin(req)}/store`,
    },
    timeoutMs: 12000,
  });

  if (!ok || !data?.url) {
    console.error("store checkout failed", status, data);
    return res.status(status === 400 ? 400 : 502).json({
      error: data?.error || "We couldn't start the checkout. Try again in a minute?",
    });
  }

  res.status(200).json({ url: data.url });
}
