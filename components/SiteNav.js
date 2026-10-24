// The nav bar — flat and edge-to-edge, per the client's own mockup. Two
// states:
//
//   over the hero   solid black bar, cream type
//   landed          paper bar, ink type
//
// Each link still glows its own colour on hover/current (`field`, below —
// matches the palette the page itself uses). None of that is set here —
// it's all CSS (globals.css → "the nav"); this file only decides WHICH
// state the bar is in and which field each link carries.
//
// EDIT THE MENU HERE. It's chrome rather than page content, so it lives beside
// the component that draws it rather than in any one page.
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CartButton from "./CartButton";

// `field` matches the data-field values PageField/components.css already
// use for each page's own palette (see globals.css → "the nav" → the
// per-field .bands overrides) — Work carries none, so it falls through to
// the default golden hour, the site's base colour.
const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio", field: "studio" },
  { href: "/live-sessions", label: "Media", field: "sessions" },
  { href: "/contact", label: "Contact", field: "contact" },
  { href: "/store", label: "Store", field: "store" },
];

export default function SiteNav({ overHero = false, tone }) {
  const { pathname } = useRouter();
  // Pages without a full-bleed hero start "landed" — there's no photo for
  // cream type to sit on, so the smoked state would be a dark box on paper.
  // A toned bar (Live Sessions' plum header) is dark on purpose and never
  // scroll-flips, so it starts un-landed and stays that way.
  const [landed, setLanded] = useState(!overHero && !tone);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    // Flip once the hero has mostly gone by. Threshold is generous so the
    // swap happens against the photo, not against the seam.
    const onScroll = () => setLanded(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  // Close the phone menu on Escape and whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cls = [
    "nav",
    landed ? "landed" : "",
    open ? "open" : "",
    tone === "plum" ? "navPlum" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={cls}>
      <div className="navRow">
        <div className="navFrame">
          <nav className="navInner" aria-label="Main">
            <div className="navBar">
              <Link href="/" className="navMark">
                {/* The bolder wordmark file the client supplied — replaced
                    the inlined "Even Dot Cadence" SVG paths, which were the
                    old, thinner cut. Black-on-transparent source, same as
                    navMarkCompact below, so it needs the on-dark/landed
                    swap done as a filter rather than `color` (a raster
                    image can't take `currentColor` the way the old SVG's
                    fill did). See .navMarkLogo in globals.css. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logos/wordmark-bold.png"
                  alt="Shimmer Down Studios"
                  className="navMarkLogo"
                />
                {/* All four words don't fit at a legible height once the
                    hamburger toggle joins the row (below 880px, same
                    breakpoint .navToggle switches on at) — so under that
                    width the wordmark gives way to the small rings mark
                    instead of shrinking into illegibility. See
                    .navMarkLogo / .navMarkCompact in globals.css. */}
                {/* The centred cut of the rings mark (the client's own
                    file, 2000px wide — so it goes through next/image to be
                    served at the size it's drawn at, not as an 800KB PNG). */}
                <Image
                  src="/images/logos/Shimmer-Down-Logo-Small-Centered.png"
                  alt="Shimmer Down Studios"
                  width={118}
                  height={100}
                  className="navMarkCompact"
                />
              </Link>

              <button
                type="button"
                className="navToggle"
                aria-expanded={open}
                aria-controls="nav-links"
                onClick={() => setOpen((v) => !v)}
              >
                <span />
                <span />
                <span />
                <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              </button>
            </div>

            <ul className="navLinks" id="nav-links">
              {LINKS.map(({ href, label, field }) => {
                const current = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`navLink${current ? " current" : ""}`}
                      data-field={field}
                      aria-current={current ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* its own bubble, riding beside the pill rather than inside it */}
        <CartButton />
      </div>
    </header>
  );
}
