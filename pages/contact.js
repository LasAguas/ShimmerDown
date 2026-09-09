// ---------------------------------------------------------------------------
// /contact — how to reach the room. No form: an enquiry about studio time is a
// conversation, and a mail client the sender already trusts beats a text box
// that swallows the message and says "thanks".
//
// If you'd rather have a real form, create one in the dashboard under
// Mailing → Forms and it can be wired up the same way the footer sign-up is.
// See TODO.md item 15.
//
// Deliberately stripped down to just the email and a way to the FAQ — a big
// photo doing the talking, the same "one thing this page is for" idea as
// before, just without the supporting copy and detail columns around it.
// The address/rates/hours that used to sit here can go on the FAQ instead,
// or come back here later if the client wants them back.
//
// ALL COPY IS IN THIS FILE.
// ---------------------------------------------------------------------------
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import s from "../styles/contact.module.css";

const META = {
  title: "Contact",
  description:
    "Book Shimmer Down Studios — recording, mixing, tracking and filmed live sessions in Berlin.",
};

const BG_IMAGE = "/images/gallery/studio-rhodes-wide.jpg";

const EMAIL = "shimmerdownstudio@gmail.com";
// Set this large the address has to wrap somewhere; the @ is the only place
// it can do that without reading as a typo.
const [MAIL_LOCAL, MAIL_DOMAIN] = EMAIL.split("@");

// The subject line is pre-filled so enquiries arrive sorted.
const MAIL_SUBJECT = "Studio enquiry";

export default function Contact() {
  return (
    <Layout {...META} path="/contact" field="contact" overHero flushFooter>
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
        </div>

        <div className={`shell ${s.body}`}>
          <div className={s.mailWrap}>
            <a
              className={s.mail}
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}`}
              data-track-type="other"
              data-track-label="Email"
              data-track-category="contact"
            >
              <span>{MAIL_LOCAL}@</span>
              <wbr />
              <span>{MAIL_DOMAIN}</span>
            </a>
          </div>
        </div>

        <div className={`shell ${s.foot}`}>
          <p className={s.faqLink}>
            Answers to the questions we get most are on the{" "}
            <Link href="/faq">FAQ</Link>.
          </p>
        </div>

        <div className={s.bands} aria-hidden="true" />
      </section>
    </Layout>
  );
}
