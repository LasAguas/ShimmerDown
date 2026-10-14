// ---------------------------------------------------------------------------
// /live-sessions — the films: one featured, the rest in a list beside it.
//
// ALL COPY IS IN THIS FILE. Add a film by adding an object to FILMS: paste the
// YouTube watch URL, the title and the artist, and the rest follows.
//
// The look is the client's October mockup (Mockups/Live Sessions.dc.html): the
// plum theme, a plum header, and the page's cream stage set inside seven
// nested rounded rings. Its knobs are at the top of live-sessions.module.css.
//
// The featured film is still VideoEmbed's click-to-play facade — nothing from
// YouTube loads until someone presses play — and picking another film from
// the list swaps which one that is.
// ---------------------------------------------------------------------------
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import VideoEmbed, { youTubeId } from "../components/VideoEmbed";
import { SITE_ORIGIN, SITE_NAME } from "../lib/site";
import s from "../styles/live-sessions.module.css";

const META = {
  title: "Live Session Films, Berlin",
  description:
    "Live session films recorded at Shimmer Down Studios, Berlin, with Baby Smith, Los Baby Jaguars and ARIA: pro audio, filmed in a lit live room.",
};

const INTRO = {
  num: "03",
  heading: "The Media",
};

// `uploaded` (the YouTube upload date) and `duration` (ISO 8601) are for the
// VideoObject markup below — search engines only, never shown on the page.
// Copy both from the video's YouTube page when you add a film.
const FILMS = [
  {
    url: "https://www.youtube.com/watch?v=rWM3Y1eG_WI",
    title: "Heavy Weather",
    artist: "Baby Smith",
    note: "Dreamy vocals and warm guitars.",
    poster: "/images/thumbnails/baby-smith.jpg",
    uploaded: "2024-03-11",
    duration: "PT3M52S",
  },
  {
    url: "https://www.youtube.com/watch?v=9v6JAjmAU9M",
    title: "El Ritmo Campeón",
    artist: "Los Baby Jaguars",
    note: "Psychedelic Cumbia meets Latin Funk.",
    poster: "/images/thumbnails/los-baby-jaguars.jpg",
    uploaded: "2023-11-17",
    duration: "PT7M10S",
  },
  {
    url: "https://www.youtube.com/watch?v=gI494C1Rzpg",
    title: "Now I Am Ready",
    artist: "ARIA",
    note: "Sink into delicate keys and smooth vocals.",
    poster: "/images/thumbnails/aria.jpg",
    uploaded: "2023-08-25",
    duration: "PT4M40S",
  },
];

// One VideoObject per film. The player only exists after a click, so without
// this a crawler never learns the films are here.
const SCHEMA = FILMS.map((film) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: `${film.title} by ${film.artist} (live session)`,
  description: `${film.note} A live session filmed and recorded at ${SITE_NAME}.`,
  thumbnailUrl: `${SITE_ORIGIN}${film.poster}`,
  uploadDate: film.uploaded,
  duration: film.duration,
  embedUrl: `https://www.youtube.com/embed/${youTubeId(film.url)}`,
  publisher: { "@type": "Organization", name: SITE_NAME },
}));

const ARCHIVE = {
  label: "Full archive",
  href: "https://www.youtube.com/@shimmerdownstudios",
};

const BOOK = {
  cta: "Book a session",
};

// The seven rings the stage sits in, outermost first. Each is a padded,
// rounded box in the next plum, so nesting them is all it takes — the radii
// and widths come from live-sessions.module.css.
const RINGS = [1, 2, 3, 4, 5, 6, 7];

function Frame({ children }) {
  return RINGS.reduceRight(
    (inner, n) => <div className={`${s.ring} ${s[`ring${n}`]}`}>{inner}</div>,
    <div className={s.stage}>{children}</div>
  );
}

export default function LiveSessions() {
  const [feat, setFeat] = useState(0);
  const film = FILMS[feat];

  return (
    <Layout
      {...META}
      path="/live-sessions"
      field="none"
      theme="plum"
      navTone="plum"
      flushFooter
      ogImage="/images/og/session-los-baby-jaguars.jpg"
      ogImageAlt="Los Baby Jaguars playing a live session in the live room at Shimmer Down Studios"
      jsonLd={SCHEMA}
    >
      <div className={s.page}>
        <div className={s.navSpacer} aria-hidden="true" />

        <Frame>
          <div className="shell">
            <div className="numHead">
              <span className="num">{INTRO.num}</span>
              <h1>{INTRO.heading}</h1>
            </div>

            <div className={s.cols}>
              <figure className={s.featured}>
                {/* keyed on the film so picking another resets the facade */}
                <VideoEmbed
                  key={film.url}
                  url={film.url}
                  title={film.title}
                  artist={film.artist}
                  poster={film.poster}
                  // Seven 16px rings a side plus the gutters leave room for two
                  // columns only from about 1075px up (.cols is auto-fit);
                  // below that the film is full width. 1100 keeps a margin.
                  sizes="(max-width: 1100px) 100vw, 50vw"
                />
                <figcaption>
                  <span>Featured · {film.artist}</span>
                  <span className={s.captionTitle}>{film.title}</span>
                </figcaption>
              </figure>

              <div className={s.side}>
                <ul className={s.list}>
                  {FILMS.map((f, i) => (
                    <li key={f.url} className={s.item}>
                      <button
                        type="button"
                        className={s.pick}
                        aria-pressed={i === feat}
                        onClick={() => setFeat(i)}
                      >
                        <span className={s.thumb}>
                          <Image
                            src={f.poster}
                            alt=""
                            fill
                            sizes="96px"
                            style={{ objectFit: "cover" }}
                          />
                        </span>
                        <span className={s.text}>
                          <span className={s.artist}>{f.artist}</span>
                          <span className={s.name}>{f.title}</span>
                          <span className={s.note}>{f.note}</span>
                        </span>
                        <span className={s.go} aria-hidden="true">
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className={s.links}>
                  <a
                    href={ARCHIVE.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-track-type="social"
                    data-track-label="YouTube"
                    data-track-platform="youtube"
                    data-track-category="social"
                  >
                    {ARCHIVE.label} →
                  </a>
                  <Link
                    href="/contact"
                    className={s.book}
                    data-track-type="other"
                    data-track-label={BOOK.cta}
                    data-track-category="booking"
                  >
                    {BOOK.cta} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Frame>
      </div>
    </Layout>
  );
}
