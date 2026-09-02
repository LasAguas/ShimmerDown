// Splitting one flat store into per-artist tabs.
//
// The dashboard's store API returns a single list of products with no category
// field on them, so the tabs are driven by a NAMING CONVENTION in the product
// name. Name a product in the dashboard like:
//
//     SD — Sun Tee
//     LBJ — El Fuego Tote
//     Rising-sun print          ← no prefix, lands in "Other"
//
// and it files itself. The separator can be an em dash, en dash, hyphen or
// colon. The prefix is stripped from what the shop displays, so the card reads
// "Sun Tee" rather than "SD — Sun Tee".
//
// To add an artist: add an entry here and start prefixing their products.

export const ARTISTS = [
  { key: "shimmer-down", label: "Shimmer Down", prefixes: ["SD", "SDS", "SHIMMER DOWN"] },
  { key: "los-baby-jaguars", label: "Los Baby Jaguars", prefixes: ["LBJ", "LOS BABY JAGUARS"] },
  // The catch-all. No prefixes: anything unmatched ends up here, so a product
  // added in a hurry still shows up in the shop instead of vanishing.
  { key: "other", label: "Other", prefixes: [] },
];

const OTHER = ARTISTS[ARTISTS.length - 1];
const SEPARATOR = /^\s*([^—–\-:]{1,28})\s*[—–\-:]\s*(.+)$/;

// → { artist, name } — the tab it belongs in, and the name to show.
export function fileProduct(rawName) {
  const name = String(rawName || "").trim();
  const m = name.match(SEPARATOR);
  if (!m) return { artist: OTHER, name };

  const [, prefix, rest] = m;
  const needle = prefix.trim().toUpperCase();
  const hit = ARTISTS.find((a) => a.prefixes.includes(needle));
  // A hyphen inside an ordinary product name ("Rising-sun print") must not be
  // read as a prefix, so an unmatched prefix keeps the WHOLE original name.
  return hit ? { artist: hit, name: rest.trim() } : { artist: OTHER, name };
}

// Groups the dashboard's flat product list into the tabs, in ARTISTS order,
// dropping any tab that has nothing in it.
export function groupByArtist(products = []) {
  const bins = new Map(ARTISTS.map((a) => [a.key, []]));

  for (const p of products) {
    const { artist, name } = fileProduct(p.name);
    bins.get(artist.key).push({ ...p, name });
  }

  return ARTISTS.map((a) => ({
    key: a.key,
    label: a.label,
    products: bins
      .get(a.key)
      .sort((x, y) => (x.sort_order ?? 0) - (y.sort_order ?? 0)),
  })).filter((tab) => tab.products.length > 0);
}
