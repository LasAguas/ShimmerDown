// A warm point of light that drifts with the cursor, site-wide. Pure
// ambience — it never blocks a click (pointer-events: none) and it never
// reads as a UI element (no shape, just a soft glow blended into the page).
//
// Skipped entirely — no listener ever attached — for reduced motion and for
// touch devices, which have no cursor to follow. Position is written
// straight to the node's style each frame rather than through state, the
// same rAF-throttled approach as SunRings' heliotrope drift used to use, so
// a mouse sweeping across the screen doesn't trigger a re-render per pixel.
import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !fine) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
      el.classList.add("on");
    };
    const onLeave = () => el.classList.remove("on");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) onLeave();
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div className="cursorGlow" ref={ref} aria-hidden="true" />;
}
