// The footer, on every page. Two contrasting sizes, after the reference: the
// mailing-list signup and small print sit compact on the left, dwarfed by one
// huge gradiented ring-figure filling the right side.
//
// EDIT THE STUDIO'S DETAILS HERE — it's the same block on all six pages, so it
// sits with the component rather than being repeated in each one.
// ⚠️ Everything below is PLACEHOLDER until the client confirms — see TODO.md
// items 5 and 6.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Newsletter from "./Newsletter";
import SunRings from "./SunRings";

const EMAIL = "shimmerdownstudio@gmail.com";

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/", platform: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@shimmerdownstudios", platform: "youtube" },
];

export default function SiteFooter() {
  // The ring-figure's radius is pinned to the footer's own height (see
  // .footerRingsWrap in globals.css), which CSS can't express against an
  // auto-height parent — so it's measured and written as a custom property.
  const footerRef = useRef(null);
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      el.style.setProperty("--footer-h", `${entry.contentRect.height}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="shell">
        <div className="footerInner">
          <div className="footerLeft">
            <Newsletter />

            <div className="footerBase">
              <span className="footerMark">
                <Image
                  src="/images/logos/shimmer-down-logo-simple-small.png"
                  alt=""
                  width={20}
                  height={17}
                />
                © {new Date().getFullYear()} Shimmer Down Studios
              </span>
              <a className="footerBaseMail" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <nav className="footerLegal" aria-label="Legal and social">
                {SOCIAL.map(({ label, href, platform }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-track-type="social"
                    data-track-label={label}
                    data-track-platform={platform}
                    data-track-category="social"
                  >
                    {label}
                  </a>
                ))}
                <Link href="/impressum">Impressum</Link>
              </nav>
            </div>
          </div>

          <div className="footerRingsWrap">
            <SunRings className="footerRings" />
          </div>
        </div>
      </div>
    </footer>
  );
}
