// ---------------------------------------------------------------------------
// /work — the records, as two lists: one for what gets cut in the room
// (Tracking), one for what gets finished in the control room (Mixing), each
// row carrying the track you can actually listen to. Then the way through to
// the films.
//
// ALL COPY AND ALL RECORDS ARE IN THIS FILE. To add a record, add an object to
// MIXING or TRACKING below — art in /public/images/art, audio in /public/audio.
//
// The look is the client's October mockup (Mockups/Work Compact.dc.html): the
// peach theme, funnel bands top and bottom, tipped polaroids, the records as
// rows rather than a carousel. Its knobs are at the top of work.module.css.
// ---------------------------------------------------------------------------
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import AudioPlayer from "../components/AudioPlayer";
import SunRings, { THEME_RINGS } from "../components/SunRings";
import s from "../styles/work.module.css";

const META = {
  title: "Mixing & Tracking Portfolio",
  description:
    "Records tracked and mixed at Shimmer Down Studios in Berlin. Listen to clips from the work, then watch the artists play live in the room.",
};

const INTRO = {
  heading: "The Work",
  lede: "Records mixed and tracked at Shimmer Down Studios. Listen to the work, then watch a session.",
};

const MIXING = [
  { title: "Mind Your Business", artist: "Pax Nicholas", meta: "Single · 2025", art: "/images/art/pax-nicholas-mind-your-business.jpg", audio: "/audio/pax-nicholas-mind-your-business.mp3" },
  { title: "Resonate", artist: "Beau Reve", meta: "EP · 2025", art: "/images/art/beau-reve-feels-like-diving.png", audio: "/audio/beau-reve-resonate.mp3" },
  { title: "Disco Salvaje", artist: "Los Baby Jaguars", meta: "LP · 2026", art: "/images/art/los-baby-jaguars-disco-salvaje.jpg", audio: "/audio/los-baby-jaguars-disco-salvaje.mp3" },
  { title: "Schatten", artist: "Deltawelle", meta: "EP · 2025", art: "/images/art/deltawelle-aufschwung.jpg", audio: "/audio/deltawelle-schatten.mp3" },
  { title: "Whatever", artist: "Thom and the Wolves", meta: "EP · 2025", art: "/images/art/thom-and-the-wolves.png", audio: "/audio/thom-and-the-wolves-whatever.mp3" },
];

const TRACKING = [
  { title: "El Ritmo Campeón", artist: "Los Baby Jaguars", meta: "Single · 2023", art: "/images/art/los-baby-jaguars-el-ritmo-campeon.jpg", audio: "/audio/los-baby-jaguars-el-ritmo-campeon.mp3" },
  { title: "Across the Burning Skies", artist: "Thom and the Wolves", meta: "EP · 2025", art: "/images/art/thom-and-the-wolves.png", audio: "/audio/thom-and-the-wolves-across-the-burning-skies.mp3" },
  { title: "Aufschwung", artist: "Deltawelle", meta: "EP · 2025", art: "/images/art/deltawelle-aufschwung.jpg", audio: "/audio/deltawelle-aufschwung.mp3" },
  { title: "El Fuego (Side A)", artist: "Los Baby Jaguars", meta: "Single · 2024", art: "/images/art/los-baby-jaguars-el-fuego-side-a.jpg", audio: "/audio/los-baby-jaguars-el-fuego-side-a.mp3" },
  // Radiohop — "Tribute" (live) belongs here too, but it still has no cover
  // art (see TODO.md item 10): add its entry once art is in.
];

// Each side of the work gets a polaroid of the room it happens in.
const TRACKING_BLOCK = {
  num: "01",
  label: "Tracking",
  records: TRACKING,
  photo: {
    src: "/images/gallery/studio-control-wide.jpg",
    alt: "A drum kit miked up in the live room",
    caption: "Cut here · the live room",
  },
};
const MIXING_BLOCK = {
  num: "02",
  label: "Mixing",
  records: MIXING,
  photo: {
    src: "/images/mixing studio/Mixing Room Hero.png",
    alt: "The mixing room",
    caption: "Mixed here · the control room",
  },
};

const OUTRO = {
  heading: "Live Sessions",
};

function Row({ record }) {
  return (
    <li className={s.row}>
      <div className={s.art}>
        <Image
          src={record.art}
          alt={`Sleeve of ${record.title} by ${record.artist}`}
          fill
          sizes="58px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={s.info}>
        <h3 className={s.title}>{record.title}</h3>
        <p className={s.meta}>
          {record.artist} · {record.meta}
        </p>
      </div>
      {/* the player's own button, scrub bar and clock become cells of the
          row's grid — see work.module.css → ".row :global(.ap)" */}
      <AudioPlayer src={record.audio} label={`${record.title} by ${record.artist}`} />
    </li>
  );
}

function Polaroid({ photo, tilt }) {
  return (
    <figure className="polaroid" style={{ "--tilt": tilt }}>
      <div className={s.polaroidImg}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 820px) 90vw, 520px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

export default function Work() {
  return (
    <Layout {...META} path="/work" field="none" theme="peach" flushFooter>
      <div className={s.page}>
        {/* clears the fixed nav, then the funnel band hangs from the nav's own rule */}
        <div className={s.top}>
          <div className="shell">
            <div className={`bandBlock funnel ${s.bandTop}`} aria-hidden="true" />
          </div>
        </div>

        <section className={s.intro}>
          <div className="shell">
            <h1 className={s.pageHead}>{INTRO.heading}</h1>
            <p className={s.lede}>{INTRO.lede}</p>
          </div>
        </section>

        <section className={`${s.block} ${s.tracking}`} aria-labelledby="work-tracking">
          <SunRings className={s.ringsRight} ramp={THEME_RINGS} bg="var(--block-bg)" />
          <div className="shell">
            <div className="numHead">
              <span className="num">{TRACKING_BLOCK.num}</span>
              <h2 id="work-tracking">{TRACKING_BLOCK.label}</h2>
            </div>
            <div className={s.cols}>
              <Polaroid photo={TRACKING_BLOCK.photo} tilt="-1.2deg" />
              <ul className={s.rows}>
                {TRACKING_BLOCK.records.map((record) => (
                  <Row key={record.title} record={record} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`${s.block} ${s.mixing}`} aria-labelledby="work-mixing">
          <SunRings className={s.ringsLeft} ramp={THEME_RINGS} bg="var(--block-bg)" />
          <div className="shell">
            <div className={`${s.cols} ${s.colsFlip}`}>
              <div className={`numHead ${s.flipHead}`}>
                <span className="num">{MIXING_BLOCK.num}</span>
                <h2 id="work-mixing">{MIXING_BLOCK.label}</h2>
              </div>
              <div className={s.flipPhoto}>
                <Polaroid photo={MIXING_BLOCK.photo} tilt="1.2deg" />
              </div>
              <ul className={`${s.rows} ${s.flipRows}`}>
                {MIXING_BLOCK.records.map((record) => (
                  <Row key={record.title} record={record} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={s.outro}>
          <div className="shell">
            <h2 className={s.outroHead}>
              <Link href="/live-sessions">
                {OUTRO.heading}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </h2>
          </div>
        </section>

        <div className={`bandBlock funnel rev ${s.bandBottom}`} aria-hidden="true" />
      </div>
    </Layout>
  );
}
