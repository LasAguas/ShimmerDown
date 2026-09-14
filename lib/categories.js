// Splitting one flat store into per-category tabs, using the dashboard's tag
// system rather than a naming convention.
//
// A product carries its own tags (products[].tags — apparel, bestseller, ...)
// and each of its options can carry a few more (products[].variants[].tags —
// yellow, limited, ...). A product belongs to a category if the tag sits on
// the product itself OR on any one of its options, so a shirt with a "yellow"
// variant shows up under a "yellow" tab even though the tag never touches the
// product record directly.
//
// Unlike the old artist tabs, this is NOT a partition: a product with two tags
// files under both, and a product with none files under neither — it only
// ever shows up in the flat "everything" grid. So this module hands back
// categories for the rail alongside the untouched flat list, rather than
// bins that are safe to flatten back into "every product" (see
// pages/api/store/resolve.js).
//
// Tags are deduplicated case-insensitively but keep whatever capitalisation
// the dashboard first showed them in — "Bestseller" and "bestseller" are the
// same category, and whichever spelling sort_order sees first is the one the
// tab is labelled with.

function tagsFor(p) {
  return [...(p.tags || []), ...(p.variants || []).flatMap((v) => v.tags || [])];
}

// Groups the dashboard's flat product list into one bin per tag, in the order
// each tag first appears once products are in sort_order. A product keeps its
// place (by sort_order) within every category it lands in.
export function groupByCategory(products = []) {
  const sorted = [...products].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const labels = new Map(); // lowercase tag → original-cased label
  const bins = new Map(); // lowercase tag → products

  for (const p of sorted) {
    // A tag repeated across a product's own tags and its variants' tags (or
    // across two variants) must only file the product once per category.
    const seen = new Set();
    for (const raw of tagsFor(p)) {
      const key = raw.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      if (!labels.has(key)) labels.set(key, raw);
      if (!bins.has(key)) bins.set(key, []);
      bins.get(key).push(p);
    }
  }

  return [...labels.keys()].map((key) => ({
    key,
    label: labels.get(key),
    products: bins.get(key),
  }));
}
