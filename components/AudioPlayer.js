// The record player. Self-hosted audio, our own transport — no third-party
// embed, so it can be built out of the same bands as everything else.
//
// The scrub bar is a real <input type="range">, not a div pretending to be
// one: that buys keyboard control, screen-reader announcements and the OS's
// own touch handling for free, and it can still be painted with the palette
// (the played portion is the band ramp; see .apScrub in globals.css).
//
// Only one track plays at a time across the whole page — starting one pauses
// whichever was going. The registry below is module-scoped on purpose: the two
// carousels on /work mount separate players and still need to agree.
import { useEffect, useId, useRef, useState } from "react";

let playing = null; // the <audio> currently sounding, anywhere on the page

const clock = (secs) => {
  if (!Number.isFinite(secs)) return "--:--";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function AudioPlayer({ src, label }) {
  const audio = useRef(null);
  const [on, setOn] = useState(false);
  const [at, setAt] = useState(0);
  const [len, setLen] = useState(NaN);
  const [broken, setBroken] = useState(false);
  const id = useId();

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onTime = () => setAt(el.currentTime);
    const onMeta = () => setLen(el.duration);
    const onEnd = () => {
      setOn(false);
      setAt(0);
      if (playing === el) playing = null;
    };
    const onErr = () => setBroken(true);
    // Someone else may have paused us — keep the button honest.
    const onPause = () => setOn(false);
    const onPlay = () => setOn(true);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    el.addEventListener("error", onErr);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("error", onErr);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
      if (playing === el) playing = null;
    };
  }, []);

  const toggle = () => {
    const el = audio.current;
    if (!el || broken) return;
    if (el.paused) {
      if (playing && playing !== el) playing.pause();
      playing = el;
      // A rejected play() is usually the browser's autoplay policy or a device
      // in low-power mode — transient, and the next real click will work. Only
      // the media "error" event means the file itself is broken, so this just
      // puts the button back rather than disabling the player for good.
      el.play().catch(() => {
        setOn(false);
        if (playing === el) playing = null;
      });
    } else {
      el.pause();
    }
  };

  const seek = (e) => {
    const el = audio.current;
    if (!el || !Number.isFinite(len)) return;
    const next = (Number(e.target.value) / 1000) * len;
    el.currentTime = next;
    setAt(next);
  };

  const pct = Number.isFinite(len) && len > 0 ? (at / len) * 100 : 0;

  if (!src) {
    return (
      <p className="apEmpty label" role="status">
        Track coming soon
      </p>
    );
  }

  return (
    <div className={`ap${broken ? " broken" : ""}`}>
      {/* preload="none" — six of these on /work would otherwise fetch six
          files nobody has asked to hear. */}
      <audio ref={audio} src={src} preload="none" />

      <button
        type="button"
        className="apBtn"
        onClick={toggle}
        disabled={broken}
        aria-label={`${on ? "Pause" : "Play"} ${label}`}
      >
        {on ? (
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
            <rect x="2.5" y="1.5" width="4" height="13" />
            <rect x="9.5" y="1.5" width="4" height="13" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
            <path d="M3 1.5 14 8 3 14.5z" />
          </svg>
        )}
      </button>

      <label className="sr-only" htmlFor={id}>
        Seek within {label}
      </label>
      <input
        id={id}
        className="apScrub"
        type="range"
        min={0}
        max={1000}
        step={1}
        value={Math.round(pct * 10)}
        onChange={seek}
        disabled={broken || !Number.isFinite(len)}
        style={{ "--pct": `${pct}%` }}
        aria-valuetext={`${clock(at)} of ${clock(len)}`}
      />

      <span className="apTime label">
        {broken ? "Unavailable" : `${clock(at)} / ${clock(len)}`}
      </span>
    </div>
  );
}
