// ---------------------------------------------------------------------------
// /live-sessions — the films, and the argument for why the room works this way.
//
// ALL COPY IS IN THIS FILE. Add a film by adding an object to FILMS: paste the
// YouTube watch URL, the title and the artist, and the rest follows.
// ---------------------------------------------------------------------------
import Layout from "../components/Layout";
import VideoEmbed from "../components/VideoEmbed";
import s from "../styles/live-sessions.module.css";

const META = {
  title: "Live Sessions",
  description:
    "Live sessions filmed and recorded at Shimmer Down Studios — professional audio and a shimmering visual to go with it.",
};

const INTRO = {
  heading: "Live Sessions",
};

const FILMS = [
  {
    url: "https://www.youtube.com/watch?v=rWM3Y1eG_WI",
    title: "Heavy Weather",
    artist: "Baby Smith",
    note: "Dreamy vocals and warm guitars.",
    poster: "/images/thumbnails/baby-smith.jpg",
  },
  {
    url: "https://www.youtube.com/watch?v=9v6JAjmAU9M",
    title: "El Ritmo Campeón",
    artist: "Los Baby Jaguars",
    note: "Psychedelic Cumbia meets Latin Funk.",
    poster: "/images/thumbnails/los-baby-jaguars.jpg",
  },
  {
    url: "https://www.youtube.com/watch?v=gI494C1Rzpg",
    title: "Now I Am Ready",
    artist: "ARIA",
    note: "Sink into delicate keys and smooth vocals.",
    poster: "/images/thumbnails/aria.jpg",
  },
];

const BOOK = {
  heading: "Book a Session",
  cta: "Enquire about a session",
};

export default function LiveSessions() {
  return (
    <Layout {...META} path="/live-sessions" field="sessions">
      <div className={s.page}>
        <div className="shell">
          <div className="sectionHead">
            <h2>{INTRO.heading}</h2>
          </div>

          <ul className={s.films}>
            {FILMS.map((film) => (
              <li key={film.url} className={s.film}>
                <VideoEmbed
                  url={film.url}
                  title={film.title}
                  artist={film.artist}
                  poster={film.poster}
                />
                <div className={s.filmMeta}>
                  <p className="label">{film.artist}</p>
                  <h3 className={s.filmTitle}>{film.title}</h3>
                  <p className={s.filmNote}>{film.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <section className={s.book}>
            <h2 className={s.bookHead}>{BOOK.heading}</h2>
            <a
              href="/contact"
              className="ctaLink onDark"
              data-track-type="other"
              data-track-label={BOOK.cta}
              data-track-category="booking"
            >
              {BOOK.cta}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          </section>
        </div>
      </div>
    </Layout>
  );
}
