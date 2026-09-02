// ---------------------------------------------------------------------------
// /store — the shop. Tabs per artist, then the goods.
//
// The shop itself is components/Storefront.js; this page is the frame around
// it and the words on it.
//
// Products, prices, photos and stock all live in the DASHBOARD
// (Admin → Webstore), not here. To file a product under an artist tab, prefix
// its name there — "SD — Sun Tee", "LBJ — El Fuego Tote". See lib/artists.js.
// ---------------------------------------------------------------------------
import Layout from "../components/Layout";
import Storefront from "../components/Storefront";
import s from "../styles/store.module.css";

const META = {
  title: "Store",
  description:
    "Records, prints and merch from Shimmer Down Studios and the artists who record here.",
};

const INTRO = {
  heading: "Store",
  lede:
    "Records, prints and shirts — ours and the artists'. Everything is made in short runs and posted from Berlin.",
};

export default function Store() {
  return (
    <Layout {...META} path="/store" field="store">
      <div className={s.page}>
        <div className="shell">
          <div className="sectionHead">
            <h2>{INTRO.heading}</h2>
          </div>
          <p className={`lede ${s.lede}`}>{INTRO.lede}</p>

          <Storefront />
        </div>
      </div>
    </Layout>
  );
}
