// ---------------------------------------------------------------------------
// /studio — the showreel, the room in pictures, and what's in it.
//
// ALL COPY IS IN THIS FILE.
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
import s from "../styles/studio.module.css";

const META = {
  title: "Studio",
  description:
    "Inside Shimmer Down Studios — a live room treated for microphones and lit for cameras, with the backline to match.",
};

const INTRO = {
  heading: "The Studio",
  lede:
    "Shimmer Down Studios is a single room, bringing producer and band into a shared space. Treated on all sides and full of beautiful instruments and amps to get the sound you need.",
};

const SHOWREEL = {
  src: "https://1skpzpfelionthck.public.blob.vercel-storage.com/Shimmer%20Down%20Showreel%20Compressed.mp4",
  title: "Shimmer Down Studios — Showreel",
  poster: "/images/gallery/studio-control-vinyls-wide.jpg",
  plate: "Showreel coming soon",
};

// span: how many of the 6 grid columns the frame takes. tall: doubles its row.
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

const SPECS = [
  { term: "Keyboards", lines: ["Placeholder 1", "Placeholder 2", "Placeholder 3"] },
  { term: "Amps", lines: ["Placeholder Ampeg", "Placeholder Marshal", "Placeholder Fender"] },
  { term: "Guitars", lines: ["Keyboard Types Placeholder", "Placeholder", "Placeholder 3"] },
];

const CTA = {
  heading: "Come and see it",
  body: "Studio visits by appointment — make sure it's the right place to bring your album to life.",
  label: "Arrange a visit",
};

export default function Studio() {
  return (
    <Layout {...META} path="/studio" field="studio" ogImage="/images/gallery/studio-control-vinyls-wide.jpg">
      <div className={s.page}>
        <div className="shell">
          <div className="sectionHead">
            <h2>{INTRO.heading}</h2>
          </div>
          <p className={`lede ${s.lede}`}>{INTRO.lede}</p>

          {/* the showreel, or the plate that stands in for it */}
          <div className={s.reel}>
            {SHOWREEL.src ? (
              <VideoEmbed src={SHOWREEL.src} title={SHOWREEL.title} poster={SHOWREEL.poster} />
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

          <hr className="bandRule" />

          <ul className={s.gallery}>
            {GALLERY.map((shot, i) => (
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

          <section className={s.visit}>
            <h2 className={s.visitHead}>{CTA.heading}</h2>
            <p className={s.visitBody}>{CTA.body}</p>
            <Link href="/contact" className="cta">
              {CTA.label}
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
