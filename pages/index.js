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
import s from "../styles/home.module.css";

const META = {
  title: null, // home page shows the studio name alone
  description:
    "Shimmer Down Studios — a recording, mixing and tracking room where top-quality audio meets a live session you can watch. Berlin.",
};

const HERO = {
  title: "Shimmer Down Studios",
  tagline:
    "A room built for feel. Records tracked, mixed and filmed, so the take you hear is the take you can watch.",
  slides: [
    {
      type: "video",
      src: "https://1skpzpfelionthck.public.blob.vercel-storage.com/Shimmer%20Down%20Showreel%20Compressed.mp4",
      poster: "/images/gallery/studio-control-wide.jpg",
    },
  ],
};

const SESSIONS = {
  heading: "Live Sessions",
  lede:
    "Every one of these was recorded and filmed while it happened — one room, one band, no overdubs hiding in the mix. Most sessions at Shimmer Down aren't filmed like this; these are the ones that were.",
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

export default function Home() {
  return (
    <Layout {...META} path="/" overHero>
      <Hero title={HERO.title} tagline={HERO.tagline} slides={HERO.slides}>
        <Link href="/contact" className="cta onDark">
          Book the room
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
          <p className={`lede ${s.lede}`}>{SESSIONS.lede}</p>

          <ul className={s.films}>
            {SESSIONS.films.map((film) => (
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
                </div>
              </li>
            ))}
          </ul>

          <p className={s.more}>
            <Link href="/live-sessions" className="cta">
              All live sessions
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
