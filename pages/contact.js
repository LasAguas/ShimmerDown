// ---------------------------------------------------------------------------
// /contact — how to reach the room. No form: an enquiry about studio time is a
// conversation, and a mail client the sender already trusts beats a text box
// that swallows the message and says "thanks".
//
// If you'd rather have a real form, create one in the dashboard under
// Mailing → Forms and it can be wired up the same way the footer sign-up is.
// See TODO.md item 15.
//
// The look is the client's October mockup (Mockups/Contact.dc.html — its
// "The Vibes" page): a full-bleed photo between two dusk bands, the page's
// numbered heading up top, a line of the studio's own words low on the left
// and the way to the FAQ low on the right. No email here, per the client —
// "let the picture do the talking"; the address is in the footer on every
// page. Its knobs are at the top of
// contact.module.css.
//
// ALL COPY IS IN THIS FILE.
// ---------------------------------------------------------------------------
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import s from "../styles/contact.module.css";

const META = {
  title: "Book a Recording Session",
  description:
    "Book Shimmer Down Studios in Berlin for recording, mixing or a filmed live session. Email with your dates, line-up and a link to your music.",
};

const BG_IMAGE = "/images/gallery/studio-rhodes-wide.jpg";

const INTRO = {
  num: "05",
  heading: "The Vibes",
  // The one line of plain description on the page — what and where the studio
  // is, and how to book. Deliberately without the address; the footer has it.
  lede:
    "Shimmer Down Studios is a recording and mixing studio in Berlin. To book the live room, the mix room or a filmed live session, email us your dates, line-up and a link to your music.",
};

// The client's own wording, from the mockup. Its credit line there reads
// "Artist name · session 2026" — a placeholder — so there isn't one here.
const QUOTE =
  "We are a human focused music making organisation, good vibes and quality products of original art are the goals.";

export default function Contact() {
  return (
    <Layout
      {...META}
      path="/contact"
      field="none"
      theme="dusk"
      overHero
      flushFooter
      ogImage="/images/og/studio-rhodes.jpg"
      ogImageAlt="A Rhodes Fifty Four beside the window, lamp lit"
    >
      <div className={s.page}>
        {/* the nav is black over the photo, so black fills the gap behind it;
            then dusk, light into dark, down onto the picture */}
        <div className={s.navSpacer} aria-hidden="true" />
        <div className={`bandBlock rev ${s.band}`} aria-hidden="true" />

        <section className={s.hero}>
          <div className={s.heroMedia} aria-hidden="true">
            <Image
              src={BG_IMAGE}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={82}
              style={{ objectFit: "cover" }}
            />
            <div className={s.scrim} />
            <div className={s.grain} />
          </div>

          <div className={`shell ${s.body}`}>
            <div className={`numHead ${s.head}`}>
              <span className="num">{INTRO.num}</span>
              <h1>{INTRO.heading}</h1>
            </div>
            <p className={s.lede}>{INTRO.lede}</p>
          </div>

          <div className={`shell ${s.foot}`}>
            <blockquote className={s.quote}>
              <p>{QUOTE}</p>
            </blockquote>
            <p className={s.faqLink}>
              Answers to the questions we get most are on the{" "}
              <Link href="/faq">FAQ</Link>.
            </p>
          </div>
        </section>

        <div className={`bandBlock ${s.band}`} aria-hidden="true" />
      </div>
    </Layout>
  );
}
