// The shop's catalogue, plus its category tabs.
//
// The dashboard hands back a flat list of products, each carrying its own
// tags (and its options carrying a few more) rather than a category field.
// The tag → tab grouping lives in lib/categories.js and runs server-side, so
// the browser gets a payload it can render directly. The fetch itself is in
// lib/catalogue.js, shared with the pages that bake the same data into their
// HTML.
import { methodGuard } from "../../../lib/dashboard";
import { fetchCatalogue } from "../../../lib/catalogue";

export default async function handler(req, res) {
  if (!methodGuard(req, res, ["GET"])) return;

  const result = await fetchCatalogue();

  if (!result.ok) {
    // 404 = the store isn't published in the dashboard yet. From the visitor's
    // side that and an outage are the same thing: the shop isn't open.
    return res.status(result.status === 404 ? 404 : 502).json({ error: "store_unavailable" });
  }

  // Short shared cache: the catalogue barely moves, and stock is re-checked
  // server-side at checkout anyway, so a stale minute can't oversell anything.
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=90");

  res.status(200).json(result.payload);
}
