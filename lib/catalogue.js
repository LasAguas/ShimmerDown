// The shop's catalogue, fetched from the dashboard. SERVER-SIDE ONLY, like
// everything that imports lib/dashboard.js.
//
// Two callers:
//   pages/api/store/resolve.js   the live JSON the browser refreshes from
//   getStaticProps on /store and /  the same data baked into the page's HTML, so
//                                  a crawler (or anyone with JavaScript off) sees
//                                  real products instead of "Opening the shop…"
import { STORE_SLUG, callDashboard } from "./dashboard";
import { groupByCategory } from "./categories";

export async function fetchCatalogue() {
  const { ok, status, data } = await callDashboard(
    `/api/store-public/resolve?slug=${encodeURIComponent(STORE_SLUG)}`
  );
  if (!ok) return { ok: false, status };

  const products = [...(data.products || [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return {
    ok: true,
    payload: {
      store: data.store || null,
      artistName: data.artistName || null,
      // The flat "everything" grid: every product once, in catalogue order.
      // NOT categories.flatMap(...) — categories aren't a partition (a product
      // with two tags files under both), so flattening them back out would
      // duplicate it.
      products,
      categories: groupByCategory(data.products),
      availability: data.availability || {},
    },
  };
}

// For getStaticProps. Returns the payload, or null when there's nothing to
// bake in (the page then renders as it always did and the browser fills the
// shop in).
//
//   store unpublished (404)   an empty catalogue — a real "closed", not a failure
//   dashboard down at build   null, so a dashboard outage can't block a deploy
//   dashboard down later      throws, so Next keeps serving the last good page
//                             instead of replacing it with an empty shop
export async function catalogueForStaticProps() {
  const res = await fetchCatalogue();
  if (res.ok) return res.payload;
  if (res.status === 404) {
    return { store: null, artistName: null, products: [], categories: [], availability: {} };
  }
  const regenerating =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build";
  if (regenerating) throw new Error(`store catalogue unavailable (${res.status})`);
  return null;
}
