// The basket — its own bubble riding beside the nav pill, not a panel on the
// store page and not an icon fused into the pill itself (see SiteNav.js's
// .navRow, which lays the two out as independent shapes). A bag icon with a
// count badge that only appears once something's in it; click it and a
// dropdown shows the same itemised list, subtotal and checkout button the
// old in-page basket used to. It reads from lib/cartContext.js, so it works
// — and stays in sync — on every page, not only /store.
//
// The dropdown is portalled straight to <body>, not nested under the button.
// .navInner (the nav pill) has its own backdrop-filter for the smoked-glass
// effect over the hero, and per spec, filter/backdrop-filter on an ancestor
// creates a NEW containing block for position:fixed (and absolute)
// descendants — so a fixed-position dropdown left inside that tree stops
// being sized and placed against the viewport and gets sized against the
// pill instead (on a phone that showed up as a dropdown squeezed into a
// ~35px sliver). Portalling out from under it sidesteps that entirely; its
// position is then computed from the button's own on-screen rect instead of
// CSS anchoring, since there's no longer a positioned wrapper to hang off.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../lib/cartContext";

const euro = (cents) => `€${((cents || 0) / 100).toFixed(2)}`;

export default function CartButton() {
  const { cart, setQty, subtotal, checkout, leaving, checkoutError } = useCart();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null); // { top, right } in viewport px
  const btnRef = useRef(null);
  const dropRef = useRef(null);

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    // Mirrors the CSS width (min(320px, 86vw)) so the clamp below is
    // computed against the SAME number the panel will actually render at.
    const width = Math.min(320, window.innerWidth * 0.86);
    const margin = 12;
    // Right-align to the button when there's room, but never let a 320px
    // panel hung off a bubble near the edge push past either side of the
    // viewport on a narrow screen — clamp instead of just right-aligning.
    const right = Math.min(
      Math.max(window.innerWidth - r.right, margin),
      window.innerWidth - width - margin
    );
    setPos({ top: r.bottom + 12, right });
  };

  // Recompute right before opening, and again if the viewport changes shape
  // while it's open — the button doesn't move on scroll (it's nav chrome,
  // always fixed to the viewport), so only resize needs tracking.
  useEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  // Close on an outside click (checked against both the button AND the
  // portalled dropdown, since they're no longer the same DOM subtree) or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (dropRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const count = cart.reduce((sum, l) => sum + l.qty, 0);

  const toggle = () => {
    if (!open) place();
    setOpen((v) => !v);
  };

  return (
    <div className="navCartWrap">
      <button
        ref={btnRef}
        type="button"
        className="navCartBtn"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={count ? `Basket, ${count} item${count === 1 ? "" : "s"}` : "Basket"}
        onClick={toggle}
      >
        {/* a basket, not a bag — the copy everywhere on the site already
            calls it that ("Add to basket"), and a basket is a rounder object
            to begin with: a tapered pail body (wide top, narrower rounded
            bottom, all curves, no straight-sided rect) under a soft domed
            handle. Two straight-line-plus-rect tries both drifted toward
            reading as a padlock; the taper is what a lock silhouette can't
            have. */}
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M8 8.5Q8 4.5 12 4.5Q16 4.5 16 8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M4.5 9Q4.5 8 5.7 8L18.3 8Q19.5 8 19.5 9L17.8 19.5Q17.6 21 15.8 21L8.2 21Q6.4 21 6.2 19.5Z"
            fill="currentColor"
          />
        </svg>
        {count > 0 && (
          <span className="navCartBadge" aria-hidden="true">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={dropRef}
            className="navCartDrop shopCart"
            role="dialog"
            aria-label="Basket"
            style={{ top: pos.top, right: pos.right }}
          >
          <h3 className="shopCartHead label">Basket</h3>
          {cart.length === 0 ? (
            <p className="shopCartEmpty">Nothing in it yet.</p>
          ) : (
            <>
              <ul className="shopCartList">
                {cart.map((line, i) => (
                  <li key={`${line.productId}-${line.variant || ""}`} className="shopCartLine">
                    <div className="shopCartInfo">
                      <p className="shopCartName">{line.name}</p>
                      {line.variant && <p className="shopCartVariant label">{line.variant}</p>}
                    </div>
                    <div className="shopQty">
                      <button
                        type="button"
                        onClick={() => setQty(i, line.qty - 1)}
                        aria-label={`One fewer ${line.name}`}
                      >
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(i, line.qty + 1)}
                        aria-label={`One more ${line.name}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="shopCartSum label">{euro(line.price_cents * line.qty)}</span>
                  </li>
                ))}
              </ul>

              <p className="shopSubtotal">
                <span className="label">Subtotal</span>
                <strong>{euro(subtotal)}</strong>
              </p>
              <p className="shopShipNote">
                Shipping is worked out at checkout, along with your address.
              </p>
              <button type="button" className="cta shopPay" onClick={checkout} disabled={leaving}>
                {leaving ? "Taking you to checkout…" : "Checkout"}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </>
          )}
          {checkoutError && (
            <p className="shopErr" role="alert">
              {checkoutError}
            </p>
          )}
          </div>,
          document.body
        )}
    </div>
  );
}
