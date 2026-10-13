// What a price card says, shared by the shop (components/Storefront.js) and
// the home page's record shelf (components/RecordShelf.js).
//
// Display only: the dashboard re-prices every line at checkout, so nothing the
// browser shows here can change what anyone is charged.

export const euro = (cents) => `€${((cents || 0) / 100).toFixed(2)}`;

// The price to show on the card: one figure when every variant agrees, a range
// when they don't.
export function priceLabel(p) {
  const { price_cents, price_min_cents, price_max_cents } = p;
  if (
    Number.isFinite(price_min_cents) &&
    Number.isFinite(price_max_cents) &&
    price_min_cents !== price_max_cents
  ) {
    return `${euro(price_min_cents)} – ${euro(price_max_cents)}`;
  }
  return euro(price_cents ?? price_min_cents);
}
