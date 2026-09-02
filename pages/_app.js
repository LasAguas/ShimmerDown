// The two stylesheets, in order: the system first, then the components that
// build on it. Page-specific layout comes in as a CSS module on each page.
//
// CartProvider wraps every page so the basket is one shared state — the nav's
// cart icon (present on every page) and the store page (where lines get
// added) both read and write the same cart. See lib/cartContext.js.
import "../styles/globals.css";
import "../styles/components.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { CartProvider } from "../lib/cartContext";

// tracker.js runs once for the whole SPA session (see public/js/tracker.js),
// so a real page navigation only happens on first load — every later page
// change is client-side routing, which needs these two hooks instead of a
// script reload: routeChangeStart fires while the OLD url is still current
// (so the outgoing page's dwell time lands on the right slug), and
// routeChangeComplete fires once the new url is live.
function useTrackerRouting() {
  const router = useRouter();
  useEffect(() => {
    const onStart = () => { if (typeof window.SDSTrackLeaving === "function") window.SDSTrackLeaving(); };
    const onComplete = () => { if (typeof window.SDSTrackPageview === "function") window.SDSTrackPageview(); };
    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onComplete);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onComplete);
    };
  }, [router.events]);
}

export default function App({ Component, pageProps }) {
  useTrackerRouting();
  return (
    <CartProvider>
      <Script src="/js/tracker.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </CartProvider>
  );
}
