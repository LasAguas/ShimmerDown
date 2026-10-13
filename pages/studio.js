// ---------------------------------------------------------------------------
// /studio — the room in numbers and a showreel, the two rooms in pictures,
// and what's in them.
//
// ALL COPY IS IN THIS FILE.
//
// The look is the client's October mockup (Mockups/Studio.dc.html): the
// daylight theme, a dark opening panel, Room A and Room B each with a banded
// wall strip down one edge. Its knobs are at the top of studio.module.css.
//
// The showreel is a direct mp4 (hosted on Vercel Blob, not YouTube) behind
// VideoEmbed's click-to-play facade, so it's paused until someone presses
// play. If SHOWREEL.src is ever cleared out, the page falls back to a poster
// frame with a "coming soon" plate.
//
// ⚠️ PLACEHOLDER: the SPECS below are invented. See TODO.md item 14.
// ---------------------------------------------------------------------------
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import VideoEmbed from "../components/VideoEmbed";
import { SITE_ORIGIN, SITE_NAME } from "../lib/site";
import s from "../styles/studio.module.css";

const META = {
  title: "Live Room & Mix Room, Berlin",
  description:
    "Inside Shimmer Down Studios, Berlin: an 81 m² bright live room and a 20 m² fully dry mix room, with amps, keys, piano and percussion on hand.",
};

const INTRO = {
  heading: "The Studio",
  lede: "A live room treated for microphones and lit for cameras, with the backline to match.",
};

// The room in a line each, under the heading. Client's own wording.
const FACTS = [
  { term: "Live room", text: "81 m² · bright · aesthetic lounge vibe" },
  { term: "Mix room", text: "20 m² · fully dry · treated · measured accuracy" },
  { term: "Instruments", text: "Beautiful range · perfectly maintained" },
];

const SHOWREEL = {
  src: "https://1skpzpfelionthck.public.blob.vercel-storage.com/Shimmer%20Down%20Showreel%20Compressed.mp4",
  title: "Shimmer Down Studios — Showreel",
  poster: "/images/gallery/studio-piano-detail-2.jpg",
  plate: "Showreel coming soon",
  // For the VideoObject below (search engines only — not shown). `uploaded` is
  // when the file went onto Vercel Blob; change it if the file is replaced.
  uploaded: "2026-10-08",
};

// span: how many of the 6 grid columns the frame takes. tall: doubles its row.
// Room A is the live room.
const GALLERY = [

  /*{ src: "/images/gallery/studio-drums-wide.jpg", alt: "A drum kit miked up in the live room", span: 2 },*/

  { src: "/images/gallery/studio-amps-wide.jpg", alt: "The backline wall — Vox, Fender, Ampeg and Marshall stacked with guitars racked between", span: 3 },
  { src: "/images/gallery/studio-rhodes-wide.jpg", alt: "A Rhodes Fifty Four beside the window, lamp lit", span: 3 },

  { src: "/images/gallery/studio-control-vinyls-wide.jpg", alt: "The control desk with the vinyl shelf alongside", span: 4 },
  { src: "/images/gallery/studio-percussion-mid.jpg", alt: "The percussion corner", span: 2 },

  { src: "/images/gallery/studio-marshall-amps-mid-1.jpg", alt: "A Marshall half-stack", span: 2 },
  { src: "/images/gallery/studio-marshall-amps-mid-2.jpg", alt: "A second Marshall stack, close up", span: 2 },
  { src: "/images/gallery/studio-fender-amp-detail.jpg", alt: "A Fender Deluxe Reverb, close up", span: 2 },

  { src: "/images/gallery/studio-ampeg-head-detail.jpg", alt: "An Ampeg bass head, racked", span: 2 },
  { src: "/images/gallery/studio-ampeg-detail.jpg", alt: "An Ampeg cabinet, detail", span: 2 },
  { src: "/images/gallery/studio-organ-detail.jpg", alt: "A combo organ, close up", span: 2 },

  { src: "/images/gallery/studio-rhodes-mid.jpg", alt: "The Rhodes, seen across the room", span: 3 },
  { src: "/images/gallery/studio-rhodes-detail.jpg", alt: "The Rhodes' badge and controls, close up", span: 3 },

  { src: "/images/gallery/studio-control-wide.jpg", alt: "The control desk, monitors either side, facing the live room", span: 3 },
  { src: "/images/gallery/studio-piano-detail-1.jpg", alt: "The piano's keys and pedals, close up", span: 3 },

  { src: "/images/gallery/studio-piano-detail-2.jpg", alt: "The piano, another detail", span: 2 },
  { src: "/images/gallery/studio-snare-mid.jpg", alt: "A snare drum, miked", span: 2 },
  { src: "/images/gallery/studio-control-mid.jpg", alt: "The control desk, closer in", span: 2 },

  { src: "/images/gallery/studio-amps-mid.jpg", alt: "Guitars racked in front of the amp wall", span: 3 },
  { src: "/images/gallery/studio-control-detail.jpg", alt: "The outboard gear on the desk, close up", span: 3 },
];

// Room B is the mix room and the lounge. Five of the client's nine are in:
// the other four (images*.jpeg, kh310alinks…webp in Mockups/uploads) are small
// web-looking shots that need confirming as the studio's own first.
const ROOM_B = [
  { src: "/images/gallery/studio-live-wide.jpg", alt: "The mix room — desk, console and outboard rack", span: 4 },
  { src: "/images/gallery/studio-live-light.jpg", alt: "High-ceilinged live space in daylight", span: 2, tall: true },
  { src: "/images/gallery/studio-den.jpg", alt: "Guitars, keys and console in the den", span: 4 },
  { src: "/images/gallery/studio-lounge.jpg", alt: "The lounge", span: 3 },
  { src: "/images/gallery/work-golden-hour.jpg", alt: "Console, monitors and synths", span: 3 },
];

const SPECS = [
  { term: "Keyboards", lines: ["Placeholder 1", "Placeholder 2", "Placeholder 3"] },
  { term: "Amps", lines: ["Placeholder Ampeg", "Placeholder Marshal", "Placeholder Fender"] },
  { term: "Guitars", lines: ["Keyboard Types Placeholder", "Placeholder", "Placeholder 3"] },
];

const CTA = {
  heading: "Get in Touch",
  label: "Arrange a visit",
};

// Structured data for the showreel. The player only exists after someone
// clicks play, so without this a crawler never learns there's a video here.
// Left out entirely if the showreel is switched off (SHOWREEL.src cleared).
const SCHEMA = SHOWREEL.src
  ? {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: SHOWREEL.title,
      description: `Showreel of ${SITE_NAME}, a recording and mixing studio in Berlin.`,
      thumbnailUrl: `${SITE_ORIGIN}${SHOWREEL.poster}`,
      uploadDate: SHOWREEL.uploaded,
      contentUrl: SHOWREEL.src,
      publisher: { "@type": "Organization", name: SITE_NAME },
    }
  : undefined;

function Gallery({ shots }) {
  return (
    <ul className={s.gallery}>
      {shots.map((shot, i) => (
        <li
          key={`${shot.src}-${i}`}
          className={`${s.frame} ${shot.tall ? s.tall : ""}`}
          style={{ "--span": shot.span }}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </li>
      ))}
    </ul>
  );
}

export default function Studio() {
  return (
    <Layout
      {...META}
      path="/studio"
      field="none"
      theme="daylight"
      overHero
      flushFooter
      ogImage="/images/og/studio-vinyls.jpg"
      ogImageAlt="The control desk with the vinyl shelf alongside"
      jsonLd={SCHEMA}
    >
      <div className={s.page}>
        {/* the nav is black over the dark panel below, so black fills the
            gap behind it; then the page's own band, light into dark */}
        <div className={s.navSpacer} aria-hidden="true" />
        <div className={`bandBlock ${s.band}`} aria-hidden="true" />

        <section className={s.intro}>
          <div className={`shell ${s.introGrid}`}>
            <div className={s.introText}>
              <div>
                <span className={s.introNum}>01</span>
                <h1 className={s.introHead}>{INTRO.heading}</h1>
                <p className={s.introLede}>{INTRO.lede}</p>
              </div>
              <dl className={s.facts}>
                {FACTS.map(({ term, text }) => (
                  <div key={term} className={s.fact}>
                    <dt>{term}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* the showreel, or the plate that stands in for it */}
            <div className={s.reel}>
              {SHOWREEL.src ? (
                <VideoEmbed
                  src={SHOWREEL.src}
                  title={SHOWREEL.title}
                  poster={SHOWREEL.poster}
                  badge="Showreel"
                  hidePlayIcon
                />
              ) : (
                <div className={s.reelPlate}>
                  <Image
                    src={SHOWREEL.poster}
                    alt=""
                    fill
                    sizes="100vw"
                    priority
                    style={{ objectFit: "cover" }}
                  />
                  <span className={s.reelScrim} aria-hidden="true" />
                  <p className={`label ${s.reelLabel}`}>{SHOWREEL.plate}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className={`bandBlock rev ${s.band}`} aria-hidden="true" />

        <section className={`${s.room} ${s.roomA}`} aria-labelledby="studio-room-a">
          <div className="shell">
            <div className="numHead">
              <span className="num">02</span>
              <h2 id="studio-room-a">Room A</h2>
            </div>
            <Gallery shots={GALLERY} />
          </div>
        </section>

        <section className={`${s.room} ${s.roomB}`} aria-labelledby="studio-room-b">
          <div className="shell">
            <div className={`numHead ${s.headEnd}`}>
              <span className="num">03</span>
              <h2 id="studio-room-b">Room B</h2>
            </div>
            <Gallery shots={ROOM_B} />
          </div>
        </section>

        <section className={s.closing}>
          <div className="shell">
            <dl className={s.specs}>
              {SPECS.map(({ term, lines }) => (
                <div key={term} className={s.spec}>
                  <dt>{term}</dt>
                  {lines.map((line) => (
                    <dd key={line}>{line}</dd>
                  ))}
                </div>
              ))}
            </dl>

            <div className={s.visit}>
              <h2 className={s.visitHead}>
                <Link href="/contact">
                  {CTA.heading}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </h2>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
