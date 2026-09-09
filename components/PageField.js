// The backdrop the inner pages sit on.
//
// The home page has a full-screen photograph doing this job. The other six
// don't, and flat cream across a whole page reads as unfinished rather than
// restrained. So: a strip of bands bleeding off one edge, the sun rings, and
// a fine grain over the lot — no soft colour wash behind them any more (see
// components.css → "the page field" for why it was pulled).
//
// It's `position: fixed`, so the page scrolls OVER it — which is where the
// movement comes from. The edge strip's own slow breathe doesn't run at all
// for a visitor who has asked for reduced motion (see components.css).
//
// `variant` moves the rings so the six pages don't look like one page with
// the words swapped — and, on four of them, tints the rings and the edge
// strip with one of the site's other palettes instead of golden hour (see
// SunRings.js → the "two-palette blends" and globals.css →
// --dawn-*/--vibrant-*/--dusk-*/--redsun-*). The edge strip stays a single
// ramp — a hard-banded strip reads as one deliberate run of colour, not two
// runs stitched together — and on the store it's left at golden hour
// entirely (see "one arrangement per page" for why). RING_RAMPS is exported
// so Layout.js can hand the same blend to the footer's own rings, which is
// what makes those change per page too instead of sitting fixed at golden
// hour. Home isn't in this map — its footer stays plain golden hour, same
// as Work and the legal pages.
import SunRings, {
  DUSK_VIBRANT_CORE,
  VIBRANT_DUSK_CORE,
  REDSUN_DAWN_CORE,
  DAWN_REDSUN_CORE,
} from "./SunRings";

export const RING_RAMPS = {
  studio: DUSK_VIBRANT_CORE,
  sessions: REDSUN_DAWN_CORE,
  store: VIBRANT_DUSK_CORE,
  contact: DAWN_REDSUN_CORE,
};

export default function PageField({ variant = "work" }) {
  return (
    <div className="field" data-field={variant} aria-hidden="true">
      <div className="fieldEdge" />
      <SunRings className="fieldRings" strokeWidth={0.9} ramp={RING_RAMPS[variant]} />
      <div className="fieldGrain" />
    </div>
  );
}
