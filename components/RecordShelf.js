// The home page's record shelf: three goods from the shop and a way through to
// the rest. Behaviour only — every word on it comes in as props from
// pages/index.js (RECORDS), so the copy stays where it gets edited.
//
// It asks the same endpoint the shop does (/api/store/resolve, which proxies
// the dashboard so the store slug stays server-side) and takes the first few
// products in catalogue order. Until that answers — and for good if the shop
// isn't published, is empty, or the call fails — it renders nothing at all,
// so the home page never shows a "Record Store" heading with nothing under it.
//
// Photos live in the dashboard (Admin → Webstore). A product without one gets
// a blank square, same as the shop's own cards. Nothing here is a price you
// can trust: it's display only, like the shop's (see lib/price.js).
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { priceLabel } from "../lib/price";

// `initial` is the shelf as it stood when the page was built (pages/index.js →
// getStaticProps), so the products are in the HTML a crawler reads. The
// browser still refreshes it on mount.
export default function RecordShelf({
  heading,
  cta,
  href = "/store",
  limit = 3,
  className = "",
  initial = [],
}) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch("/api/store/resolve");
        if (!res.ok) return;
        const data = await res.json();
        if (live) setItems((data.products || []).slice(0, limit));
      } catch {
        /* the shelf is a bonus — no shelf is fine */
      }
    })();
    return () => {
      live = false;
    };
  }, [limit]);

  if (items.length === 0) return null;

  return (
    // data-theme here, not on the page: only this section takes the red-sun
    // ramp (globals.css → "page themes"); the rest of the home page is as it was
    <section className={className} data-theme="redsun" aria-labelledby="records-h">
      <div className="shell">
        <div className="sectionHead">
          <h2 id="records-h">{heading}</h2>
        </div>

        <ul className="recordGrid">
          {items.map((p) => (
            <li key={p.id} className="record">
              <Link
                href={href}
                className="recordArt"
                aria-label={`${p.name} — see it in the shop`}
              >
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                ) : null}
              </Link>
              <div className="thumbStrip" aria-hidden="true" />
              <div className="recordMeta">
                <p className="label">{priceLabel(p)}</p>
                <h3 className="recordName">{p.name}</h3>
              </div>
            </li>
          ))}
        </ul>

        <p className="recordsMore">
          <Link href={href} className="ctaLink">
            {cta}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </p>
      </div>
    </section>
  );
}
