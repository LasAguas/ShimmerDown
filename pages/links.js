// ---------------------------------------------------------------------------
// /links — the link-in-bio page for the Instagram profile. Not in the main
// site nav, same reasoning as /faq: it's meant to be reached directly from a
// social bio, not navigated to from inside the site.
//
// ALL COPY IS IN THIS FILE. Add a link by adding an object to LINKS. Every
// row carries data-track-* attributes that public/js/tracker.js picks up
// automatically via click delegation — see that file's click listener.
// ---------------------------------------------------------------------------
import Layout from "../components/Layout";
import s from "../styles/links.module.css";

const META = {
  title: "Links",
  description: "Everything Shimmer Down Studios, in one place.",
};

const INTRO = {
  heading: "Shimmer Down Studios",
  lede: "Everything, in one place.",
};

const LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/",
    external: true,
    trackType: "social",
    trackPlatform: "instagram",
    trackCategory: "social",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@shimmerdownstudios",
    external: true,
    trackType: "social",
    trackPlatform: "youtube",
    trackCategory: "social",
  },
  {
    label: "Live Sessions — watch the films",
    href: "/live-sessions",
    trackType: "other",
    trackCategory: "live_sessions",
  },
  {
    label: "Work — records made here",
    href: "/work",
    trackType: "other",
    trackCategory: "discography",
  },
  {
    label: "Store — records, prints, merch",
    href: "/store",
    trackType: "merch",
    trackCategory: "merch",
  },
  {
    label: "Book a session",
    href: "/contact",
    trackType: "other",
    trackCategory: "booking",
  },
];

export default function Links() {
  return (
    <Layout {...META} path="/links" field="legal">
      <div className={s.page}>
        <div className="shell">
          <div className="sectionHead">
            <h2>{INTRO.heading}</h2>
          </div>
          <p className={`lede ${s.lede}`}>{INTRO.lede}</p>

          <ul className={s.list}>
            {LINKS.map(({ label, href, external, trackType, trackPlatform, trackCategory }) => (
              <li key={label}>
                <a
                  className={s.link}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer noopener" : undefined}
                  data-track-type={trackType}
                  data-track-label={label}
                  data-track-platform={trackPlatform}
                  data-track-category={trackCategory}
                >
                  {label}
                  <span className={`arrow ${s.arrow}`} aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
