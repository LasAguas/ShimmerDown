// ---------------------------------------------------------------------------
// /contact — how to reach the room. No form: an enquiry about studio time is a
// conversation, and a mail client the sender already trusts beats a text box
// that swallows the message and says "thanks".
//
// If you'd rather have a real form, create one in the dashboard under
// Mailing → Forms and it can be wired up the same way the footer sign-up is.
// See TODO.md item 15.
//
// ALL COPY IS IN THIS FILE. ⚠️ The address, rates and hours are PLACEHOLDERS —
// TODO.md item 5.
// ---------------------------------------------------------------------------
import Link from "next/link";
import Layout from "../components/Layout";
import SunRings from "../components/SunRings";
import s from "../styles/contact.module.css";

const META = {
  title: "Contact",
  description:
    "Book Shimmer Down Studios — recording, mixing, tracking and filmed live sessions in Berlin.",
};

const EMAIL = "shimmerdownstudio@gmail.com";
// Set this large the address has to wrap somewhere; the @ is the only place
// it can do that without reading as a typo.
const [MAIL_LOCAL, MAIL_DOMAIN] = EMAIL.split("@");

const INTRO = {
  heading: "Contact",
  lede: "Tell us what you're making and when you'd like to make it.",
};

// The subject line is pre-filled so enquiries arrive sorted.
const MAIL_SUBJECT = "Studio enquiry";

const HELPFUL = {
  heading: "What helps us answer quickly",
  items: [
    "Roughly when — a month is enough to start with.",
    "How many people are playing, and what they're playing.",
    "Whether you want it filmed as well as recorded.",
    "A link to something you've already made, if there is one.",
  ],
};

const DETAILS = [
  { term: "Studio", lines: ["Placeholder Straße 12", "10999 Berlin", "Germany"] },
  { term: "Bookings", lines: ["Day and block rates", "Engineer included", "Nights welcome"] },
  { term: "Hours", lines: ["By session", "Visits by appointment"] },
  { term: "Elsewhere", lines: ["Instagram", "YouTube"] },
];

export default function Contact() {
  return (
    <Layout {...META} path="/contact" field="contact">
      <div className={s.page}>
        <SunRings className={s.rings} />

        <div className="shell">
          <div className="sectionHead">
            <h2>{INTRO.heading}</h2>
          </div>
          <p className={`lede ${s.lede}`}>{INTRO.lede}</p>

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

          <div className={s.cols}>
            <section className={s.helpful}>
              <h3 className={`label ${s.helpfulHead}`}>{HELPFUL.heading}</h3>
              <ul className={s.helpfulList}>
                {HELPFUL.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <dl className={s.details}>
              {DETAILS.map(({ term, lines }) => (
                <div key={term} className={s.detail}>
                  <dt>{term}</dt>
                  {lines.map((line) => (
                    <dd key={line}>{line}</dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>

          <p className={s.faqLink}>
            Answers to the questions we get most are on the{" "}
            <Link href="/faq">FAQ</Link>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
