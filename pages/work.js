// ---------------------------------------------------------------------------
// /work — two shelves of records, one for each side of what the room does,
// each sleeve carrying the track you can actually listen to. Then the way
// through to the films.
//
// ALL COPY AND ALL RECORDS ARE IN THIS FILE. To add a record, add an object to
// MIXING or TRACKING below — art in /public/images/art, audio in /public/audio.
//
// ⚠️ Every entry below is a PLACEHOLDER: the sleeves are square crops of the
// studio photographs and every `audio` points at the same silent stand-in.
// See TODO.md items 10 and 11.
// ---------------------------------------------------------------------------
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";
import AudioPlayer from "../components/AudioPlayer";
import s from "../styles/work.module.css";

const META = {
  title: "Work",
  description:
    "Records mixed and tracked at Shimmer Down Studios — listen to the work, then watch a session.",
};

const INTRO = {
  heading: "The Work",
  lede:
    "Two ways into the room. Records we mixed — sent to us finished, sent back finished properly — and records we tracked from the floor up. Press play on any of them.",
};

const PLACEHOLDER_AUDIO = "/audio/placeholder-track.wav";

const MIXING = [
  { title: "Record Title One", artist: "Artist Name", meta: "LP · 2026", art: "/images/art/placeholder-1.jpg", audio: PLACEHOLDER_AUDIO },
  { title: "Record Title Two", artist: "Artist Name", meta: "EP · 2025", art: "/images/art/placeholder-2.jpg", audio: PLACEHOLDER_AUDIO },
  { title: "Record Title Three", artist: "Artist Name", meta: "Single · 2025", art: "/images/art/placeholder-3.jpg", audio: PLACEHOLDER_AUDIO },
  { title: "Record Title Four", artist: "Artist Name", meta: "LP · 2024", art: "/images/art/placeholder-4.jpg", audio: PLACEHOLDER_AUDIO },
  { title: "Record Title Five", artist: "Artist Name", meta: "EP · 2024", art: "/images/art/placeholder-5.jpg", audio: PLACEHOLDER_AUDIO },
];

const TRACKING = [
  { title: "Record Title Six", artist: "Los Baby Jaguars", meta: "LP · 2026", art: "/images/art/placeholder-6.jpg", audio: PLACEHOLDER_AUDIO },
  { title: "Record Title Seven", artist: "ARIA", meta: "Single · 2026", art: "/images/art/placeholder-3.jpg", audio: PLACEHOLDER_AUDIO },
  { title: "Record Title Eight", artist: "Baby Smith", meta: "EP · 2025", art: "/images/art/placeholder-1.jpg", audio: PLACEHOLDER_AUDIO },
  { title: "Record Title Nine", artist: "Artist Name", meta: "LP · 2025", art: "/images/art/placeholder-5.jpg", audio: PLACEHOLDER_AUDIO },
  { title: "Record Title Ten", artist: "Artist Name", meta: "Single · 2024", art: "/images/art/placeholder-2.jpg", audio: PLACEHOLDER_AUDIO },
];

const SHELVES = [
  {
    key: "mixing",
    label: "Mixing",
    records: MIXING,
  },
  {
    key: "tracking",
    label: "Tracking",
    blurb: "Cut in the live room, everyone in at once.",
    records: TRACKING,
  },
];

const OUTRO = {
  heading: "Not every session is filmed",
  body:
    "Most days here are just the room and the mics — tracked and mixed, camera-free. When the timing's right, we turn one into a Live Session: filmed, mixed and released as its own thing.",
  cta: "Watch the live sessions",
};

function Sleeve({ record }) {
  return (
    <li className={s.sleeve}>
      <div className={s.art}>
        <Image
          src={record.art}
          alt={`${record.title} by ${record.artist} — sleeve`}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1000px) 42vw, 290px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <p className="label">{record.artist}</p>
      <h3 className={s.sleeveTitle}>{record.title}</h3>
      <p className={s.sleeveMeta}>{record.meta}</p>
      <AudioPlayer src={record.audio} label={`${record.title} by ${record.artist}`} />
    </li>
  );
}

export default function Work() {
  return (
    <Layout {...META} path="/work" field="work">
      <div className={s.page}>
        <div className="shell">
          <div className="sectionHead">
            <h2>{INTRO.heading}</h2>
          </div>
          <p className={`lede ${s.lede}`}>{INTRO.lede}</p>

          {SHELVES.map((shelf) => (
            <section className={s.shelf} key={shelf.key} aria-labelledby={`shelf-${shelf.key}`}>
              <div className={s.shelfHead}>
                <h3 id={`shelf-${shelf.key}`} className={s.shelfTitle}>
                  {shelf.label}
                </h3>
                {shelf.blurb && <p className={s.shelfBlurb}>{shelf.blurb}</p>}
              </div>
              <hr className="bandRule" />
              <Carousel label={`${shelf.label} records`}>
                {shelf.records.map((record) => (
                  <Sleeve key={`${shelf.key}-${record.title}`} record={record} />
                ))}
              </Carousel>
            </section>
          ))}

          <section className={s.outro}>
            <h2 className={s.outroHead}>{OUTRO.heading}</h2>
            <p className={s.outroBody}>{OUTRO.body}</p>
            <Link href="/live-sessions" className="cta">
              {OUTRO.cta}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </section>
        </div>
      </div>
    </Layout>
  );
}
