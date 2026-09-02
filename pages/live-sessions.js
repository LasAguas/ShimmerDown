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
  // The concept, in the client's own words, tightened.
  body: [
    "Shimmer Down Studios brings the video element to top of the line tracking and mixing - capturing all sides of a performance with professional lighting and camerawork.",
    "A record used to be finished when it was mixed. Now it is finished when there is something to watch as well — something sharable that will reach your audience both new and old.",
    "This is why we built for both. The room is treated for the microphones and lit for the cameras, with space for your performance to breath.",
  ],
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
  body:
    "Bring a session to life: a full day of tracking followed by the full mix, master, and edit, delivered as one.",
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

          {/* the opening statement stays a half-width column — a pull quote,
              not a paragraph — and the argument that follows it stretches the
              full page width. See styles/live-sessions.module.css → .about */}
          <div className={s.about}>
            <p className={`lede ${s.aboutLede}`}>{INTRO.body[0]}</p>
            <div className={s.aboutBody}>
              {INTRO.body.slice(1).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <hr className="bandRule" />

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
            <p className={s.bookBody}>{BOOK.body}</p>
            <a
              href="/contact"
              className="cta"
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
