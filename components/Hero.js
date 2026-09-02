// The full-screen opener.
//
// Built to be swapped: every slide is { type, src, poster }, and `type` is
// either "image" or "video". A video slide autoplays muted/looped and needs
// a `poster` — that same poster stands in for it, static, when a visitor has
// asked for reduced motion.
//
// With 2+ slides they cross-fade on a slow timer. It stops entirely when the
// tab is hidden (no point burning a phone battery on a fade nobody is
// watching) and never starts at all for reduced motion — that visitor gets
// the first slide, held.
import Image from "next/image";
import { useEffect, useState } from "react";

const HOLD_MS = 6500;

export default function Hero({ slides = [], title, tagline, children }) {
  const [i, setI] = useState(0);
  // Starts false so server and first client render agree; flips before paint
  // for anyone who hasn't asked for reduced motion. Also gates autoplay on
  // video slides below — a moving background is exactly what that setting
  // opts out of, so those visitors get the poster frame, held.
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = null;
    const tick = () => setI((n) => (n + 1) % slides.length);
    const start = () => {
      stop();
      timer = setInterval(tick, HOLD_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="heroMedia" aria-hidden="true">
        {slides.map((slide, n) => (
          <div key={slide.src} className={`heroSlide${n === i ? " on" : ""}`}>
            {slide.type === "video" ? (
              reducedMotion ? (
                <Image
                  src={slide.poster}
                  alt=""
                  fill
                  priority={n === 0}
                  sizes="100vw"
                  quality={82}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <video
                  className="heroVideo"
                  src={slide.src}
                  poster={slide.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )
            ) : (
              <Image
                src={slide.src}
                alt=""
                fill
                // The hero is the largest paint on the site; the first slide
                // is what LCP is measured against, so it isn't lazy.
                priority={n === 0}
                sizes="100vw"
                quality={82}
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        ))}
        <div className="heroScrim" />
      </div>

      <div className="shell heroBody">
        <h1 className="heroTitle display">{title}</h1>
        {tagline && <p className="heroTagline">{tagline}</p>}
        {children}
      </div>

      {/* the bands, laid along the bottom edge of the photo — the seam between
          the hero and the paper below it */}
      <div className="heroBands" aria-hidden="true" />
    </section>
  );
}
