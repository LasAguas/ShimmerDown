// ---------------------------------------------------------------------------
// /faq — the questions people usually have before they write in. Reachable
// from the Contact page, deliberately not in the main nav — it's a reference
// for someone who's already decided to reach out, not a landing page.
//
// ALL COPY IS IN THIS FILE. Add a question by adding an object to FAQS below.
//
// ⚠️ PLACEHOLDER: every answer here is a best guess at what the client would
// say. Needs a pass before launch. See TODO.md item 25.
// ---------------------------------------------------------------------------
import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import s from "../styles/faq.module.css";

const META = {
  title: "FAQ",
  description:
    "Answers to the questions we get most, before a session, an order or a Live Session enquiry.",
};

const INTRO = {
  heading: "Frequently Asked",
  lede:
    "Common questions we get. Something on your mind that isn't answered here? Get in touch - our email address is at the bottom.",
};

const FAQS = [
  {
    q: "How do I book a session?",
    a: "Write in with roughly when, how many people are playing and what you're making. The contact page has the full list of what helps us answer quickly — we'll come back with dates and a rate.",
  },
  {
    q: "Is every session filmed as a Live Session?",
    a: "No. Most studio time is just the room and the mics — tracked and mixed, camera-free. A Live Session is a specific thing we do sometimes: filmed, mixed and released as its own piece. Say so when you write in if you'd like yours considered for one.",
  },
  {
    q: "What's included in the day rate?",
    a: "An engineer is included in every booking. The backline available in the room is listed on the Studio page — ask ahead if you need something specific brought in.",
  },
  {
    q: "Do you mix and master records you didn't track here?",
    a: "Yes — the Work page shows the difference between the two sides of what we do. Send over what you have and we'll tell you what it needs.",
  },
  {
    q: "How does shipping work in the store?",
    a: "Checkout is handled by Stripe, which collects your address and works out shipping there. A receipt follows by email once it's paid.",
  },
  {
    q: "Can I visit before booking?",
    a: "Studio visits are by appointment — ask on the contact page and we'll find a time.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(null);

  return (
    <Layout {...META} path="/faq" field="legal">
      <div className={s.page}>
        <div className="shell">
          <div className="sectionHead">
            <h2>{INTRO.heading}</h2>
          </div>
          <p className={`lede ${s.lede}`}>{INTRO.lede}</p>

          <ul className={s.list}>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className={`${s.item}${isOpen ? ` ${s.open}` : ""}`}>
                  <button
                    type="button"
                    className={s.question}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className={s.plus} aria-hidden="true" />
                  </button>
                  <div className={s.answer} id={`faq-${i}`} role="region" aria-label={item.q}>
                    <div className={s.answerInner}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={s.more}>
            <span>Can't find what you need?</span>
            <Link href="/contact" className="cta">
              Get in touch
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
