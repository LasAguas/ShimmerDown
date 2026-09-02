// Mailing-list signup, wired to the Las Aguas dashboard.
//
// Both calls go to THIS site's own API routes rather than straight to the
// dashboard, so the form's slug and id stay server-side and nothing about the
// dashboard ends up in the client bundle:
//
//   on mount   POST /api/newsletter/track      → records the visit (referrer, UTM)
//   on submit  POST /api/newsletter/subscribe  → the sign-up itself
//
// Fields are exactly the ones enabled on the dashboard form (verified against
// /api/forms-public/resolve): email, name, city. The API SILENTLY DROPS any
// field the form hasn't got switched on, so don't add inputs here without
// enabling them in Mailing → Forms first.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const COPY = {
  heading: "Be the first to know",
  blurb:
    "New live sessions, records released, and the odd exclusive discount rate. Unsubscribe at any time with one click.",
  email: "Email address",
  name: "Name",
  city: "City",
  consent: "Yes, send me occasional updates from Shimmer Down Studios.",
  notice: "We store your details to send you these emails, nothing else. Full detail in the",
  noticeLink: "Impressum & privacy",
  button: "Sign up",
  sending: "Signing you up…",
  success: "You're on the list. See you soon!",
  invalidEmail: "That email doesn't look right — please double check it.",
  consentRequired: "Please tick the box so we know it's OK to email you.",
  error: "Something went wrong at our end. Try again in a minute.",
};

const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());

// One token per browser session, tying the pageview to the sign-up so the
// dashboard can report a view→signup conversion rather than a bare total.
function sessionToken() {
  try {
    const KEY = "sd_form_session";
    let t = sessionStorage.getItem(KEY);
    if (!t) {
      t = (crypto.randomUUID && crypto.randomUUID()) || String(Math.random()).slice(2);
      sessionStorage.setItem(KEY, t);
    }
    return t;
  } catch {
    return null; // private mode — the sign-up still works, attribution doesn't
  }
}

function readUTM() {
  try {
    const p = new URLSearchParams(window.location.search);
    const out = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = p.get(k);
      if (v) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // honeypot
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");
  const token = useRef(null);

  // Fire and forget — analytics never blocks the page or the sign-up.
  useEffect(() => {
    token.current = sessionToken();
    fetch("/api/newsletter/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        sessionToken: token.current,
        referrer: document.referrer,
        utm: readUTM(),
        language: navigator.language,
      }),
    }).catch(() => {});
  }, []);

  const busy = state === "sending";
  const done = state === "done";

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    if (hp) return; // a bot filled the hidden field — drop it silently

    if (!looksLikeEmail(email)) {
      setState("error");
      setMessage(COPY.invalidEmail);
      return;
    }
    // Consent is never assumed: the box starts empty and submitting is refused
    // without it, rather than treating the sign-up itself as consent.
    if (!consent) {
      setState("error");
      setMessage(COPY.consentRequired);
      return;
    }

    setState("sending");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          city: city.trim() || undefined,
          sourcePath: window.location.pathname,
          sessionToken: token.current,
          hp,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(data.error || COPY.error);
        return;
      }
      setState("done");
      setMessage(COPY.success);
      if (typeof window.SDSTrack === "function") {
        window.SDSTrack("conversion_newsletter", { link_category: "newsletter" });
      }
    } catch {
      setState("error");
      setMessage(COPY.error);
    }
  }

  return (
    <section className="signup footerSignup" aria-labelledby="signup-h">
      <h2 id="signup-h" className="signupHead">
        {COPY.heading}
      </h2>

      {done ? (
        <p className="signupDone" role="status">
          {message}
        </p>
      ) : (
        <>
          <p className="signupBlurb">{COPY.blurb}</p>
          <form onSubmit={onSubmit} noValidate>
            <div className="signupFields">
              <p className="signupField">
                <label className="sr-only" htmlFor="nl-email">
                  {COPY.email}
                </label>
                <input
                  id="nl-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={COPY.email}
                  value={email}
                  disabled={busy}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </p>
              <div className="signupPair">
                <p className="signupField">
                  <label className="sr-only" htmlFor="nl-name">
                    {COPY.name}
                  </label>
                  <input
                    id="nl-name"
                    type="text"
                    autoComplete="name"
                    placeholder={COPY.name}
                    value={name}
                    disabled={busy}
                    onChange={(e) => setName(e.target.value)}
                  />
                </p>
                <p className="signupField">
                  <label className="sr-only" htmlFor="nl-city">
                    {COPY.city}
                  </label>
                  <input
                    id="nl-city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder={COPY.city}
                    value={city}
                    disabled={busy}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </p>
              </div>
            </div>

            <label className="signupConsent">
              <input
                type="checkbox"
                checked={consent}
                disabled={busy}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>{COPY.consent}</span>
            </label>

            {/* GDPR Art. 13 allows layering — the essentials here, the rest one
                click away. Keep the link; this line alone isn't sufficient. */}
            <p className="signupNotice">
              {COPY.notice} <Link href="/impressum">{COPY.noticeLink}</Link>.
            </p>

            <button type="submit" className="cta" disabled={busy}>
              {busy ? COPY.sending : COPY.button}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </button>

            {/* hidden from people, catnip for bots */}
            <div className="signupHp" aria-hidden="true">
              <label htmlFor="nl-website">Website</label>
              <input
                id="nl-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </div>

            {state === "error" && (
              <p className="signupErr" role="alert">
                {message}
              </p>
            )}
          </form>
        </>
      )}
    </section>
  );
}
