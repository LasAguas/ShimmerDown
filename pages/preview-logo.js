// ---------------------------------------------------------------------------
// PREVIEW ONLY — not linked from the site's nav or anywhere else. A copy of
// pages/index.js with two changes, both swapping real logo artwork in for
// the "Shimmer Down" text that plays the same role elsewhere:
//
//   nav    "Shimmer Down" wordmark  →  logo-text-only.png                (SiteNavLogo)
//   hero   the giant <h1> title     →  mark + logo-text-only.png, stacked
//
// Visit /preview-logo to compare against the real home page at /. If one or
// both treatments earn their place, fold the change back into SiteNav.js /
// Hero's caller and delete this file, LayoutLogo.js, SiteNavLogo.js and
// styles/previewLogo.module.css. Marked noindex so it never shows up in
// search results in the meantime. Everything else on this page — the
// sessions section, the footer — is untouched, reused as-is from the real
// site, for honest side-by-side context.
// ---------------------------------------------------------------------------
import Link from "next/link";
import LayoutLogo from "../components/LayoutLogo";
import Hero from "../components/Hero";
import VideoEmbed from "../components/VideoEmbed";
import s from "../styles/home.module.css";
import p from "../styles/previewLogo.module.css";

const META = {
  title: "Logo preview",
  description: "Internal preview — logo lockup in the nav and hero.",
};

const HERO = {
  slides: [
    { type: "image", src: "/images/gallery/studio-control-wide.jpg" },
    { type: "image", src: "/images/gallery/studio-amps-wide.jpg" },
    { type: "image", src: "/images/gallery/studio-drums-wide.jpg" },
    { type: "image", src: "/images/gallery/studio-control-vinyls-wide.jpg" },
  ],
  tagline:
    "A room built for feel. Records tracked, mixed and filmed, so the take you hear is the take you can watch.",
};

const SESSIONS = {
  heading: "Live Sessions",
  lede:
    "Every one of these was recorded and filmed while it happened — one room, one band, no overdubs hiding in the mix. Most sessions at Shimmer Down aren't filmed like this; these are the ones that were.",
  films: [
    {
      url: "https://www.youtube.com/watch?v=9v6JAjmAU9M",
      title: "El Ritmo Campeón",
      artist: "Los Baby Jaguars",
    },
    {
      url: "https://www.youtube.com/watch?v=gI494C1Rzpg",
      title: "Now I Am Ready",
      artist: "ARIA",
    },
    {
      url: "https://www.youtube.com/watch?v=rWM3Y1eG_WI",
      title: "Heavy Weather",
      artist: "Baby Smith",
    },
  ],
};

export default function PreviewLogo() {
  return (
    <LayoutLogo {...META} path="/preview-logo" overHero>
      <Hero
        title={
          <span className={p.heroLogoStack}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/shimmer-down-logo-simple-medium.png" alt="" className={p.heroLogoMarkImg} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/logo-text-only.png" alt="Shimmer Down Studios" className={p.heroLogoWordmarkImg} />
          </span>
        }
        tagline={HERO.tagline}
        slides={HERO.slides}
      >
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
                <VideoEmbed url={film.url} title={film.title} artist={film.artist} />
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
    </LayoutLogo>
  );
}
