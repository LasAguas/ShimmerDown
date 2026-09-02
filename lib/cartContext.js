// The basket — one cart, shared across the whole site via React Context, so
// the nav's cart icon (every page) and the store page (where items get
// added) are always looking at the same state. Previously this lived only
// inside Storefront.js, which meant a persistent basket icon in the nav had
// no way to know what was in it.
//
// Deliberately thin: this holds the cart ARRAY and generic line-item
// mutations (add/adjust/clear) plus checkout, nothing product-specific. Stock
// checks ("only 2 left", "pick a size first") need the product catalogue,
// which only the store page fetches — so that validation stays in
// Storefront.js, which then calls addLine() here once it's decided the add
// is valid. This file never needs to know what a "product" is.
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const CART_KEY = "sd_cart_v1";
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Read localStorage only after mount — it doesn't exist during SSR, and
  // reading it during render would desync the server- and client-rendered
  // markup.
  useEffect(() => {
    setCart(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // don't stomp storage with the empty initial state
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* private mode — the basket just won't survive a reload */
    }
  }, [cart, hydrated]);

  // Adds one line, or increments an existing one for the same product+variant.
  const addLine = useCallback((line) => {
    setCart((prev) => {
      const i = prev.findIndex(
        (l) => l.productId === line.productId && l.variant === line.variant
      );
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + line.qty };
        return next;
      }
      return [...prev, line];
    });
  }, []);

  const setQty = useCallback((i, qty) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((_, n) => n !== i) : prev.map((l, n) => (n === i ? { ...l, qty } : l))
    );
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const checkout = useCallback(async () => {
    if (!cart.length || leaving) return;
    setLeaving(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ productId, variant, qty }) => ({ productId, variant, qty })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setCheckoutError(data.error || "We couldn't start the checkout. Try again in a minute?");
        setLeaving(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("We couldn't reach the checkout. Try again in a minute?");
      setLeaving(false);
    }
  }, [cart, leaving]);

  const subtotal = cart.reduce((sum, l) => sum + (l.price_cents || 0) * l.qty, 0);
  const count = cart.reduce((sum, l) => sum + l.qty, 0);

  const value = { cart, addLine, setQty, clear, subtotal, count, checkout, leaving, checkoutError };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
