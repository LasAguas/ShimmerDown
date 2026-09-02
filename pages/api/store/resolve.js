// The shop's catalogue, already sorted into artist tabs.
//
// This is the one genuinely non-trivial piece: the dashboard hands back a flat
// list of products with no category on them, and the shop needs three tabs. The
// prefix parsing lives in lib/artists.js and runs here, server-side, so the
// browser gets a payload it can render directly and the naming convention can
// change without touching the client bundle.
import { STORE_SLUG, callDashboard, methodGuard } from "../../../lib/dashboard";
import { groupByArtist } from "../../../lib/artists";

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

  // Short shared cache: the catalogue barely moves, and stock is re-checked
  // server-side at checkout anyway, so a stale minute can't oversell anything.
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=90");

  res.status(200).json({
    store: data.store || null,
    artistName: data.artistName || null,
    tabs: groupByArtist(data.products),
    availability: data.availability || {},
  });
}
