// ---------------------------------------------------------------------------
// / — the home page.
//
//   hero      the showreel, full screen, muted and looping
//   sessions  the three live session films
//   footer    contact + sign-up + impressum (from Layout)
//
// ALL COPY IS IN THIS FILE, in the blocks below. Layout is in
// styles/home.module.css; nothing here needs editing to change a word.
// ---------------------------------------------------------------------------
import Link from "next/link";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import VideoEmbed from "../components/VideoEmbed";
import RecordShelf from "../components/RecordShelf";
import { catalogueForStaticProps } from "../lib/catalogue";
import { SITE_ORIGIN } from "../lib/site";
import s from "../styles/home.module.css";

// The home page leads its <title> with the brand, so it hands over the whole
// string instead of taking Layout's "Page — Shimmer Down Studios" shape.
const META = {
  titleFull: "Shimmer Down Studios | Recording Studio in Berlin",
  description:
    "Shimmer Down Studios is a recording and mixing studio in Berlin: a bright live room, a dry treated mix room and filmed live sessions you can watch.",
};

// Structured data — what the studio is, for search engines. Not visible on the
// page. Only facts that are already public on the site. The street address is
// the studio's (Frank-Zappa-Straße 16); the Impressum lists the owner's legal
// address instead, which is a different place. The phone is the Impressum's.
// Google compares this block with the Business Profile, so keep them identical.
// No opening hours (none confirmed); add the Instagram URL to `sameAs` once
// TODO.md item 6 is answered.
const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: "Shimmer Down Studios",
      inLanguage: "en",
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_ORIGIN}/#studio`,
      name: "Shimmer Down Studios",
      url: `${SITE_ORIGIN}/`,
      description:
        "A recording and mixing studio in Berlin with a live room, a mix room and filmed live sessions.",
      image: `${SITE_ORIGIN}/images/og/studio-control.jpg`,
      logo: `${SITE_ORIGIN}/images/logos/Shimmer-Down-Logo-Small-Centered.png`,
      email: "shimmerdownstudio@gmail.com",
      telephone: "+49 176 56942822",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Frank-Zappa-Straße 16",
        postalCode: "12681",
        addressLocality: "Berlin",
        addressCountry: "DE",
      },
      areaServed: "Berlin",
      sameAs: ["https://www.youtube.com/@shimmerdownstudios"],
    },
  ],
};

const HERO = {
  title: "Shimmer Down Studios",
  slides: [
    {
      type: "video",
      src: "https://1skpzpfelionthck.public.blob.vercel-storage.com/Shimmer%20Down%20Showreel%20Compressed.mp4",
      poster: "/images/gallery/studio-control-wide.jpg",
    },
  ],
};

const SESSIONS = {
  heading: "Sessions",
  // Plain words on the page for people (and crawlers) landing here: what the
  // studio is and where. The hero above is a video with only the name on it.
  intro:
    "Shimmer Down Studios is a recording and mixing studio in Berlin, with a bright live room, a dry treated mix room and filmed live sessions. Book it for tracking, mixing or a session on camera.",
  films: [
    {
      url: "https://www.youtube.com/watch?v=rWM3Y1eG_WI",
      title: "Heavy Weather",
      artist: "Baby Smith",
      poster: "/images/thumbnails/baby-smith.jpg",
    },
    {
      url: "https://www.youtube.com/watch?v=9v6JAjmAU9M",
      title: "El Ritmo Campeón",
      artist: "Los Baby Jaguars",
      poster: "/images/thumbnails/los-baby-jaguars.jpg",
    },
    {
      url: "https://www.youtube.com/watch?v=gI494C1Rzpg",
      title: "Now I Am Ready",
      artist: "ARIA",
      poster: "/images/thumbnails/aria.jpg",
    },
  ],
};

// The first three products in the shop, with a way through to the rest. The
// products themselves — names, prices, photos — come from the dashboard
// (Admin → Webstore); only the words around them are here. The shelf draws
// nothing while the shop is closed or empty (components/RecordShelf.js).
const RECORDS = {
  heading: "Record Store",
  cta: "All shop items",
  href: "/store",
};

// The shelf is baked into the page (and refreshed every minute) so the
// products are in the HTML a crawler reads, not just fetched in the browser.
// Only the fields RecordShelf draws are kept — the full catalogue would bloat
// the page for nothing. `?? null` because Next can't serialise `undefined`.
export async function getStaticProps() {
  const catalogue = await catalogueForStaticProps();
  const records = (catalogue?.products || []).slice(0, 3).map((p) => ({
    id: p.id,
    name: p.name,
    images: p.images || [],
    price_cents: p.price_cents ?? null,
    price_min_cents: p.price_min_cents ?? null,
    price_max_cents: p.price_max_cents ?? null,
  }));
  return { props: { records }, revalidate: 60 };
}

export default function Home({ records }) {
  return (
    <Layout {...META} path="/" field="home" overHero jsonLd={SCHEMA}>
      <Hero title={HERO.title} slides={HERO.slides}>
        <Link href="/contact" className="ctaLink onDark">
          Book a session
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </Hero>

      <section className={s.sessions} id="below">
        <div className="shell">
          <div className="sectionHead">
            <h2>{SESSIONS.heading}</h2>
          </div>

          <p className={s.intro}>{SESSIONS.intro}</p>

          <ul className={s.films}>
            {SESSIONS.films.map((film) => (
              <li key={film.url} className={s.film}>
                <VideoEmbed
                  url={film.url}
                  title={film.title}
                  artist={film.artist}
                  poster={film.poster}
                  // matches home.module.css → .films: one column, then two, then three
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
                <div className="thumbStrip" aria-hidden="true" />
                <div className={s.filmMeta}>
                  <p className="label">{film.artist}</p>
                  <h3 className={s.filmTitle}>{film.title}</h3>
                </div>
              </li>
            ))}
          </ul>

          <p className={s.more}>
            <Link href="/live-sessions" className="ctaLink">
              All live sessions
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </div>
      </section>

      <RecordShelf {...RECORDS} className={s.records} initial={records} />
    </Layout>
  );
}
