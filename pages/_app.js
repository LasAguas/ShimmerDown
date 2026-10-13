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
import { Jost, Source_Serif_4 } from "next/font/google";
import { CartProvider } from "../lib/cartContext";

// Jost (display) + Source Serif 4 (body) — both OFL-licensed, the same two
// faces and weights the site has always used (they replaced Intro Rust and
// Brodille: TODO.md items 1 and 2). They used to load from Google's servers
// on every visit, which handed each visitor's IP to Google and wasn't in the
// privacy notice; next/font downloads them once, at build time, and serves
// them from this site's own domain instead. Looks identical.
//
// `preload: false` because both latin and latin-ext are listed and Next would
// otherwise preload every file of both on every page; the browser still only
// fetches the subsets a page's characters actually need.
const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

// next/font names its families with a hash (__Jost_a1b2c3), so the custom
// properties the CSS reads are pointed at them here. The rest of each stack is
// the same fallback list globals.css has always had. --font-jost is Jost
// itself, for the one place that wants it even where --font-display has been
// swapped for Helvetica Neue (the store's title — store.module.css).
const JOST_STACK = `${jost.style.fontFamily},"Futura","Trebuchet MS",sans-serif`;
const FONT_VARS = `:root{--font-display:${JOST_STACK};--font-jost:${JOST_STACK};--font-body:${sourceSerif.style.fontFamily},"Hoefler Text",Georgia,serif}`;

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
      <style dangerouslySetInnerHTML={{ __html: FONT_VARS }} />
      <Script src="/js/tracker.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </CartProvider>
  );
}
