// A video embed that doesn't load the video until you ask it to.
//
// Two sources: a YouTube `url`, or a direct `src` (an mp4, e.g. hosted on
// Vercel Blob). Either way nothing plays, and nothing is even fetched, until
// someone clicks — for YouTube that's deliberate, not an optimisation
// afterthought: a plain <iframe> hands every visitor to Google before they've
// clicked anything, which on a German site means you need a consent banner in
// front of the whole page. This shows the poster frame and the title, and
// only builds the real player on click. For a direct `src` it's the same
// click-to-play facade, mainly so the file — tens of MB for a showreel —
// isn't pulled down by everyone who lands on the page, only those who watch.
//
// The YouTube poster still comes from i.ytimg.com. That's a cookieless static
// CDN, but it is a request to Google — see TODO.md item 8 for going fully
// first-party.
import Image from "next/image";
import { useState } from "react";

// Accepts a full watch URL, a youtu.be link, or a bare id.
export function youTubeId(input) {
  const s = String(input || "").trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export default function VideoEmbed({ url, src, title, artist, poster, className = "" }) {
  const [playing, setPlaying] = useState(false);
  const id = url ? youTubeId(url) : null;
  if (!src && !id) return null;

  const posterSrc = poster || (id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null);
  const label = artist ? `Play ${title} by ${artist}` : `Play ${title}`;

  return (
    <div className={`vid ${className}`}>
      {playing ? (
        src ? (
          <video
            className="vidFrame"
            src={src}
            poster={posterSrc}
            title={title}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <iframe
            className="vidFrame"
            // nocookie host + no related videos from other channels
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      ) : (
        <button type="button" className="vidFacade" onClick={() => setPlaying(true)}>
          <Image
            className="vidPoster"
            src={posterSrc}
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 33vw"
            unoptimized={!!id}
          />
          <span className="vidPlay" aria-hidden="true">
            <svg viewBox="0 0 68 48" width="54" height="38">
              <path
                className="vidPlayBg"
                d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55.2 0 34 0 34 0S12.8 0 7.5 1.6a8.6 8.6 0 0 0-6 6.1A90 90 0 0 0 0 24a90 90 0 0 0 1.5 16.3 8.6 8.6 0 0 0 6 6C12.8 48 34 48 34 48s21.2 0 26.5-1.6a8.6 8.6 0 0 0 6-6.1A90 90 0 0 0 68 24a90 90 0 0 0-1.5-16.3z"
              />
              <path d="M45 24 27 14v20z" fill="#f7f1e7" />
            </svg>
          </span>
          <span className="sr-only">{label}</span>
        </button>
      )}
    </div>
  );
}
