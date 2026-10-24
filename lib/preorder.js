// Pre-orders, as the shop shows them. Display only.
//
// A pre-order is an ordinary product (or variant) carrying
// `preorder: { ships_on: "YYYY-MM-DD" }`. The dashboard sends null once the
// date has passed, so there is nothing to compute here: if the field is there,
// it's a pre-order, and the date is whatever it says. Dates are Berlin calendar
// days; the server re-checks them at checkout, so nothing in this file can
// change what is sold.

// "2026-12-12" → "12 December 2026". Built from the parts, in UTC, so the day
// can't slip across a timezone — and so the server render and the browser
// agree on it.
export function formatShipDate(ymd) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd || ""));
  if (!m) return "";
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// The date a product or one of its variants ships on, or "" for a regular one.
export const shipsOn = (item) => item?.preorder?.ships_on || "";

// "Pre-order, ships 12 December 2026"
export function preorderLabel(ymd) {
  const date = formatShipDate(ymd);
  return date ? `Pre-order, ships ${date}` : "Pre-order";
}

// What a card should say about pre-orders, given the variant picked so far.
//   date     the date to show, or "" when there isn't one single date yet
//   all      every option is a pre-order (or the product has none and is one)
//   some     at least one option is
//   active   what Add to basket would put in the basket right now
export function preorderState(p, variantName) {
  if (!p.has_variants) {
    const date = shipsOn(p);
    return { date, all: !!date, some: !!date, active: !!date };
  }
  const variants = p.variants || [];
  const dates = variants.map(shipsOn);
  const some = dates.some(Boolean);
  const all = some && dates.every(Boolean);
  const picked = variants.find((v) => v.name === variantName);
  if (picked) {
    const date = shipsOn(picked);
    return { date, all, some, active: !!date };
  }
  // Nothing picked yet: show a date only when every option agrees on one.
  const same = all && new Set(dates).size === 1 ? dates[0] : "";
  return { date: same, all, some, active: false };
}
