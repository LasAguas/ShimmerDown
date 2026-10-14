// Click-to-enlarge for a set of photographs, after the client's October
// mockup (Mockups/Studio.dc.html): the picture as large as the screen allows
// on a near-black veil, its description and "3 / 19" along the foot, and
// ← → ✕ beside them. Arrow keys step (wrapping round at either end), Escape
// or a click on the veil closes it.
//
// The page owns which photo is open — pass `index` (-1 = closed) and an
// `onChange` that receives the new index. Styles: components.css → "the
// lightbox".
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Lightbox({ shots, index, onChange }) {
  const open = index >= 0 && index < shots.length;
  const closeRef = useRef(null);

  const close = () => onChange(-1);
  const step = (d) => onChange((index + d + shots.length) % shots.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onChange(-1);
      if (e.key === "ArrowRight") onChange((index + 1) % shots.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + shots.length) % shots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, shots.length, onChange]);

  // While it's open: no page scroll behind it, and keyboard focus inside it
  // (handed back to whatever opened it once it closes).
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  const shot = shots[index];
  const stop = (e) => e.stopPropagation();

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={shot.alt} onClick={close}>
      <div className="lightboxStage">
        <Image
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="100vw"
          quality={85}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="lightboxBar" onClick={stop}>
        <p className="lightboxCaption">
          {shot.alt}
          <span className="lightboxCount">
            {index + 1} / {shots.length}
          </span>
        </p>
        <div className="lightboxControls">
          <button type="button" aria-label="Previous" onClick={() => step(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next" onClick={() => step(1)}>
            →
          </button>
          <button type="button" aria-label="Close" onClick={close} ref={closeRef} className="lightboxClose">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
