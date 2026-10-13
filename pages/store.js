// ---------------------------------------------------------------------------
// /store — the shop. Tabs per category, then the goods.
//
// The shop itself is components/Storefront.js; this page is the frame around
// it and the words on it.
//
// Products, prices, photos and stock all live in the DASHBOARD
// (Admin → Webstore), not here. To file a product under a category tab, tag
// it there — the product's own tags and its variants' tags both count. See
// lib/categories.js.
//
// The look is the client's October mockup (Mockups/Store.dc.html): the red-sun
// theme, the category rail restyled as its slim "artist drawers", and a faint
// ring figure bleeding off the left edge. Its knobs are at the top of
// store.module.css.
// ---------------------------------------------------------------------------
import Layout from "../components/Layout";
import Storefront from "../components/Storefront";
import SunRings from "../components/SunRings";
import { catalogueForStaticProps } from "../lib/catalogue";
import { SITE_ORIGIN } from "../lib/site";
import s from "../styles/store.module.css";

const META = {
  title: "Records, Prints & Merch",
  description:
    "Records, prints and merch from Shimmer Down Studios in Berlin and the artists who record here: vinyl, tees and more.",
};

const INTRO = {
  heading: "Record Store",
};

// The ring figure runs the page's red-sun ramp inside out — pale outside,
// dark in — the mockup's own, so it reads as a sun going down behind the page.
const RINGS = [7, 6, 5, 4, 3, 2, 1].map((n) => `var(--t${n})`);

// The catalogue is baked into the page and refreshed every minute, so the
// products are in the HTML a crawler reads (and the markup below can describe
// them) instead of only appearing once the browser has fetched them. The shop
// still asks /api/store/resolve on load, so stock is live — see Storefront.js.
export async function getStaticProps() {
  const catalogue = await catalogueForStaticProps();
  return { props: { catalogue }, revalidate: 60 };
}

// Product markup, built from the same data the cards draw. Prices are the
// display prices (the dashboard re-prices at checkout); stock comes from
// `availability`, where no entry means unlimited. A product with sizes gets
// one offer per size so a sold-out size doesn't mark the whole thing sold out.
const eur = (cents) => ((cents || 0) / 100).toFixed(2);
const stockUrl = (inStock) =>
  `https://schema.org/${inStock ? "InStock" : "OutOfStock"}`;

function productSchema(p, availability) {
  const a = availability?.[p.id];
  const offer = (price_cents, inStock, name) => ({
    "@type": "Offer",
    ...(name ? { name } : {}),
    price: eur(price_cents),
    priceCurrency: "EUR",
    availability: stockUrl(inStock),
    url: `${SITE_ORIGIN}/store`,
  });

  // One variant isn't a choice, so it's a plain offer, not a named one.
  const offers = p.has_variants && p.variants?.length > 1
    ? p.variants.map((v) => {
        const left = a?.variants?.[v.name];
        return offer(v.price_cents ?? p.price_cents, left == null || left > 0, v.name);
      })
    : p.has_variants && p.variants?.length === 1
      ? offer(
          p.variants[0].price_cents ?? p.price_cents,
          a?.variants?.[p.variants[0].name] == null || a.variants[p.variants[0].name] > 0
        )
      : offer(p.price_cents, a?.remaining == null || a.remaining > 0);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    ...(p.images?.length ? { image: p.images } : {}),
    offers,
  };
}

export default function Store({ catalogue }) {
  const schemas = (catalogue?.products || []).map((p) =>
    productSchema(p, catalogue.availability)
  );

  return (
    <Layout
      {...META}
      path="/store"
      field="none"
      theme="shop"
      flushFooter
      jsonLd={schemas.length ? schemas : undefined}
    >
      <div className={s.page}>
        <SunRings className={s.rings} ramp={RINGS} bg="var(--paper)" />

        <div className={`shell ${s.content}`}>
          <h1 className={s.title}>{INTRO.heading}</h1>

          <Storefront initial={catalogue} />
        </div>
      </div>
    </Layout>
  );
}
