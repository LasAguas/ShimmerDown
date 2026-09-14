// The shop's catalogue, plus its category tabs.
//
// The dashboard hands back a flat list of products, each carrying its own
// tags (and its options carrying a few more) rather than a category field.
// The tag → tab grouping lives in lib/categories.js and runs here,
// server-side, so the browser gets a payload it can render directly.
import { STORE_SLUG, callDashboard, methodGuard } from "../../../lib/dashboard";
import { groupByCategory } from "../../../lib/categories";

export default async function handler(req, res) {
  if (!methodGuard(req, res, ["GET"])) return;

  const { ok, status, data } = await callDashboard(
    `/api/store-public/resolve?slug=${encodeURIComponent(STORE_SLUG)}`
  );

  if (!ok) {
    // 404 = the store isn't published in the dashboard yet. From the visitor's
    // side that and an outage are the same thing: the shop isn't open.
    return res.status(status === 404 ? 404 : 502).json({ error: "store_unavailable" });
  }

  const products = [...(data.products || [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  // Short shared cache: the catalogue barely moves, and stock is re-checked
  // server-side at checkout anyway, so a stale minute can't oversell anything.
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=90");

  res.status(200).json({
    store: data.store || null,
    artistName: data.artistName || null,
    // The flat "everything" grid: every product once, in catalogue order.
    // NOT categories.flatMap(...) — categories aren't a partition (a product
    // with two tags files under both), so flattening them back out would
    // duplicate it.
    products,
    categories: groupByCategory(data.products),
    availability: data.availability || {},
  });
}
