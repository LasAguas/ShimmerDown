// The shop. Two or more artists get a rail: a persistent strip down the
// right edge of the viewport, one colour per artist, that grows leftward
// over the page when you click one and collapses back when you click it
// again. With nothing open, the grid shows every artist's goods together.
// One artist means there's nothing to filter, so the rail doesn't render at
// all — just the flat grid. On a phone the rail can't be fixed (it would eat
// too much of a 375px screen), so it tips over into an ordinary stack of
// rows that open in place.
//
// The basket itself lives in lib/cartContext.js, shared with the nav's cart
// icon — this component only does the STOCK-AWARE part of adding to it
// (checking availability, requiring a variant pick), since that needs the
// product catalogue this page fetches. See useCart().
//
// Two calls, both to this site's own API routes (which proxy the dashboard,
// so the store slug never reaches the browser). The third — checkout — lives
// in the cart context now, since it can be triggered from the nav on any
// page, not only from here:
//
//   on load    GET  /api/store/resolve   → tabs of products + live stock
//   on return  POST /api/store/confirm   → the receipt
//
// Prices shown are display only: the dashboard re-prices every line at
// checkout, so nothing here can change what somebody is charged.
//
// Until the store is PUBLISHED in the dashboard, resolve answers 404 and this
// shows its "not open yet" state — which is where it will sit today.
// See TODO.md item 17.
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCart, CART_KEY } from "../lib/cartContext";

const SPINE_W = 68; // px — must match --spine-w in components.css

const euro = (cents) => `€${((cents || 0) / 100).toFixed(2)}`;

// The price to show on the card: one figure when every variant agrees, a range
// when they don't.
function priceLabel(p) {
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

export default function Storefront() {
  const { cart, addLine, clear } = useCart();
  const [status, setStatus] = useState("loading"); // loading | open | closed
  const [tabs, setTabs] = useState([]);
  const [availability, setAvailability] = useState({});
  // null = nothing open, every artist's goods show together
  const [tab, setTab] = useState(null);
  const [picks, setPicks] = useState({}); // productId → chosen variant name
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);
  const hasRail = tabs.length > 1;

  // ---- the rail stops at the footer --------------------------------------
  // The rail is fixed to the viewport so it can run the full height of the
  // screen — up past the nav to the true top of the page. The one thing it
  // must never do is carry on down over the footer.
  //
  // It used to handle that by switching to `position: absolute` once the
  // footer came into view, frozen at the scroll position of that moment.
  // That put it back in document flow at a fixed offset, which broke both
  // ways: open a panel while already scrolled down and it hung over the
  // footer, and scrolling back up carried it down the page with everything
  // else, leaving the top of the screen bare behind the nav.
  //
  // So it never leaves `position: fixed` now, it's always a full screen
  // tall, and only its BOTTOM edge moves. --rail-bottom is however much of
  // the viewport the footer currently covers; the rail hangs from that edge
  // (see .slides in components.css), so as the footer rises the whole rail
  // travels up with it, its top running off the top of the screen rather
  // than the rail squashing down into whatever gap is left. Top of the
  // screen to the top of the footer, never past either one.
  //
  // Written straight to the node instead of held in state: this runs on
  // every scroll frame the footer is on screen for, and re-rendering the
  // whole catalogue that often would be a waste.
  const railRef = useRef(null);
  useEffect(() => {
    if (!hasRail) return;
    const footer = document.querySelector(".footer");
    if (!footer) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = railRef.current;
      if (!el) return;
      // How far the footer reaches up into the viewport: 0 while it's still
      // below the fold, and capped at a screen — past that the rail has
      // travelled clear off the top and there's nothing left to move.
      const covered = window.innerHeight - footer.getBoundingClientRect().top;
      const bottom = Math.min(Math.max(covered, 0), window.innerHeight);
      el.style.setProperty("--rail-bottom", `${bottom}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The footer also moves without anyone scrolling — opening a panel drops
    // the flat grid out of the page, images land, the footer's own signup
    // rewraps. Watching the body's height catches all of that.
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, [hasRail]);

  // ---- the catalogue ----
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch("/api/store/resolve");
        if (!res.ok) throw new Error("unavailable");
        const data = await res.json();
        if (!live) return;
        setTabs(data.tabs || []);
        setAvailability(data.availability || {});
        setStatus((data.tabs || []).length ? "open" : "closed");
      } catch {
        if (live) setStatus("closed");
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  // ---- the receipt, if Stripe has just sent someone back ----
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) return;
    (async () => {
      try {
        const res = await fetch("/api/store/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) return;
        const data = await res.json();
        setReceipt(data);
        // Read the basket straight from storage rather than the `cart` in
        // this closure — CartProvider's own hydration effect (which reads
        // the same key) hasn't necessarily run yet, so `cart` here can still
        // be its empty initial state.
        if (typeof window.SDSTrack === "function") {
          try {
            const lines = JSON.parse(localStorage.getItem(CART_KEY)) || [];
            lines.forEach((line) => {
              window.SDSTrack("conversion_merch", {
                product_id: String(line.productId),
                product_name: line.name,
                quantity: line.qty,
                value_cents: (line.price_cents || 0) * line.qty,
                currency: "EUR",
              });
            });
          } catch {}
        }
        clear();
        // Drop the session id so a refresh doesn't look like a second order.
        window.history.replaceState({}, "", window.location.pathname);
      } catch {
        /* the order is still paid; the dashboard emails a receipt regardless */
      }
    })();
  }, []);

  const stockLeft = useCallback(
    (id, variant) => {
      const a = availability[id];
      if (!a) return null; // no entry at all = unlimited
      return variant ? a.variants?.[variant] ?? null : a.remaining;
    },
    [availability]
  );

  const add = (p) => {
    const variant = p.has_variants ? picks[p.id] : undefined;
    if (p.has_variants && !variant) {
      setError("Pick a size or option first.");
      return;
    }
    const left = stockLeft(p.id, variant);
    const already = cart.find((l) => l.productId === p.id && l.variant === variant)?.qty || 0;
    if (left != null && already + 1 > left) {
      setError(left === 0 ? "That one's sold out." : `Only ${left} left of that.`);
      return;
    }
    setError("");
    // NOT `(p.has_variants && …) ?? p.price_cents` — when has_variants is
    // false that left side short-circuits to the BOOLEAN false, and ??
    // only falls through on null/undefined, not false, so the basket would
    // silently price the line at zero for every product without variants.
    const unit = p.has_variants
      ? p.variants?.find((v) => v.name === variant)?.price_cents
      : p.price_cents;
    addLine({ productId: p.id, variant, qty: 1, name: p.name, price_cents: unit, image: p.images?.[0] });
  };

  // One card. Shared between the flat "everything" grid and each artist's own
  // panel, so the two views can never drift apart.
  const renderCard = (p) => {
    const variant = picks[p.id];
    const left = stockLeft(p.id, p.has_variants ? variant : undefined);
    const allVariantsGone =
      p.has_variants && p.variants?.length > 0 && p.variants.every((v) => stockLeft(p.id, v.name) === 0);
    const soldOut = allVariantsGone || left === 0;
    return (
      <li key={p.id} className="shopCard">
        <div className="shopArt">
          {p.images?.[0] ? (
            <Image
              src={p.images[0]}
              alt={p.name}
              fill
              sizes="(max-width: 700px) 50vw, 240px"
              style={{ objectFit: "cover" }}
            />
          ) : null}
        </div>

        <h3 className="shopName">{p.name}</h3>
        {p.description && <p className="shopDesc">{p.description}</p>}
        <p className="shopPrice label">{priceLabel(p)}</p>

        {p.has_variants && (
          <div className="shopVariants">
            {p.variants?.map((v) => {
              const vLeft = stockLeft(p.id, v.name);
              const gone = vLeft === 0;
              return (
                <button
                  key={v.name}
                  type="button"
                  className={`shopVariant${variant === v.name ? " on" : ""}`}
                  disabled={gone}
                  aria-pressed={variant === v.name}
                  onClick={() => setPicks((prev) => ({ ...prev, [p.id]: v.name }))}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        )}

        <button type="button" className="cta shopAdd" disabled={soldOut} onClick={() => add(p)}>
          {soldOut ? "Sold out" : "Add to basket"}
        </button>
        {left != null && left > 0 && left <= 3 && <p className="shopLow label">Only {left} left</p>}
      </li>
    );
  };

  // ---- states -------------------------------------------------------------
  if (receipt) {
    return (
      <div className="shopReceipt" role="status">
        <p className="label">Order confirmed</p>
        <h3 className="shopReceiptHead">Thank you — it's on its way.</h3>
        {receipt.orderCode && (
          <p className="shopReceiptCode">
            Order <strong>{receipt.orderCode}</strong>
          </p>
        )}
        <p className="shopReceiptNote">
          A receipt is on its way to the email address you gave Stripe.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return <p className="shopState label">Opening the shop…</p>;
  }

  if (status === "closed") {
    return (
      <div className="shopState">
        <p className="label">Not open yet</p>
        <p className="shopStateBody">
          The shop isn't taking orders at the moment. Sign up below and we'll
          tell you when there's something on the shelves.
        </p>
      </div>
    );
  }

  const allProducts = tabs.flatMap((t) => t.products);

  return (
    // shopOpen reserves a screen's worth of page height while a panel is
    // open — see .shop.shopOpen in components.css for why.
    <div className={`shop${tab ? " shopOpen" : ""}`}>
      {hasRail && (
        <div
          ref={railRef}
          className="slides"
          style={{ "--rail-count": tabs.length }}
        >
          {tabs.map((t, i) => {
            const on = t.key === tab;
            return (
              <section
                key={t.key}
                className={`slide${on ? " open" : ""}`}
                // sun-1/sun-2 are too pale to read as a spine — they're close
                // enough to the page's own cream/tan wash that the spine
                // nearly disappears into it. Sticking to the saturated half
                // of the ramp, spread rather than adjacent, so neighbours
                // don't blur into one orange block either.
                style={{ "--tone": `var(--sun-${[7, 3, 5, 4, 6][i % 5]})` }}
              >
                <button
                  type="button"
                  className="slideSpine"
                  aria-expanded={on}
                  aria-controls={`slide-${t.key}`}
                  onClick={() => setTab(on ? null : t.key)}
                >
                  <span className="slideSpineInner">
                    <span className="slideName">{t.label}</span>
                  </span>
                </button>

                <div className="slidePanel" id={`slide-${t.key}`} role="region" aria-label={t.label}>
                  <ul className="shopGrid">{t.products.map(renderCard)}</ul>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div
        className={`shopBody${hasRail ? " railGutter" : ""}`}
        style={hasRail ? { "--rail-w": `${tabs.length * SPINE_W}px` } : undefined}
      >
        {!tab && <ul className="shopGrid">{allProducts.map(renderCard)}</ul>}
        {error && (
          <p className="shopErr" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
