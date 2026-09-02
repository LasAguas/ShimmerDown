// A horizontal shelf of cards.
//
// The scrolling is CSS scroll-snap, not JavaScript: touch, trackpad, shift-
// wheel and keyboard all work on their own, and the arrows below simply nudge
// the same scroller by one card. That means it degrades to a plain scrollable
// row if JS never arrives, and there is no layout maths to get wrong.
//
// It takes children rather than a data prop, so the CONTENT stays in the page
// that owns it — /work spells out its own records.
import { useCallback, useEffect, useRef, useState } from "react";

export default function Carousel({ children, label }) {
  const track = useRef(null);
  const [at, setAt] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAt({
      start: el.scrollLeft <= 2,
      // 2px of slack: sub-pixel widths mean scrollLeft rarely hits max exactly
      end: el.scrollLeft >= max - 2,
    });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const nudge = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild;
    // one card plus the gap, falling back to most of the viewport
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="car">
      <ul className="carTrack" ref={track} aria-label={label}>
        {children}
      </ul>

      <div className="carNav">
        <button
          type="button"
          className="carBtn"
          onClick={() => nudge(-1)}
          disabled={at.start}
          aria-label={`Previous in ${label}`}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="carBtn"
          onClick={() => nudge(1)}
          disabled={at.end}
          aria-label={`Next in ${label}`}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
