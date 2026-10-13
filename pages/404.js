// ---------------------------------------------------------------------------
// The 404 page — a wrong or old address. Gives the visitor the nav and a way
// back instead of Next's bare default, and tells search engines it isn't a
// real page (Next still answers with a 404 status; noindex and no canonical
// are belt and braces).
//
// ALL COPY IS IN THIS FILE.
// ---------------------------------------------------------------------------
import Link from "next/link";
import Layout from "../components/Layout";
import s from "../styles/not-found.module.css";

const META = {
  title: "Page not found",
  description: "That page doesn't exist at Shimmer Down Studios.",
};

const COPY = {
  heading: "Page not found",
  lede: "That address doesn't lead anywhere. It may have moved, or been mistyped.",
  cta: "Back to the studio",
};

export default function NotFound() {
  return (
    <Layout {...META} path="/404" field="legal" robots="noindex" noCanonical>
      <div className={s.page}>
        <div className="shell">
          <div className="sectionHead">
            <h1>{COPY.heading}</h1>
          </div>
          <p className={`lede ${s.lede}`}>{COPY.lede}</p>
          <Link href="/" className="ctaLink">
            {COPY.cta}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
