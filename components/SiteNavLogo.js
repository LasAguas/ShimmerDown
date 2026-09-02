// ---------------------------------------------------------------------------
// PREVIEW ONLY — not linked from anywhere in the live site.
//
// A copy of SiteNav.js with one change: the "Shimmer Down" text wordmark is
// replaced by the logo-text-only.png lockup. Exists so Miguel can see that
// treatment at /preview-logo without touching the real nav that ships on
// every page. If he likes it, fold this back into SiteNav.js and delete this
// file (and LayoutLogo.js, and pages/preview-logo.js).
//
// The image is black-on-transparent, so it needs the same on-dark/landed
// colour swap the text version gets from `color` — done here with a CSS
// filter (brightness(0) invert(1) forces it white; .nav.landed removes the
// filter for the native black). See styles/previewLogo.module.css.
// ---------------------------------------------------------------------------
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CartButton from "./CartButton";
import s from "../styles/previewLogo.module.css";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/live-sessions", label: "Live Sessions" },
  { href: "/contact", label: "Contact" },
  { href: "/store", label: "Store" },
];

export default function SiteNavLogo({ overHero = false }) {
  const { pathname } = useRouter();
  const [landed, setLanded] = useState(!overHero);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setLanded(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cls = ["nav", landed ? "landed" : "", open ? "open" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={cls}>
      <div className="navRow">
        <div className="navFrame">
          <nav className="navInner" aria-label="Main">
            <div className="navBar">
              <Link href="/" className="navMark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logos/logo-text-only.png"
                  alt="Shimmer Down Studios"
                  className={s.navMarkLogo}
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
              {LINKS.map(({ href, label }) => {
                const current = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`navLink${current ? " current" : ""}`}
                      aria-current={current ? "page" : undefined}
                    >
                      {label}
                      <span className="bands" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <CartButton />
      </div>
    </header>
  );
}
