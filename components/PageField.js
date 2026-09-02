// The backdrop the inner pages sit on.
//
// The home page has a full-screen photograph doing this job. The other six
// don't, and flat cream across a whole page reads as unfinished rather than
// restrained. So: a warm wash that drifts, a strip of bands bleeding off one
// edge, the sun rings, and a fine grain over the lot.
//
// It's `position: fixed`, so the page scrolls OVER it — which is where most of
// the movement comes from. The drift on top of that is deliberately slow
// enough that you notice it only if you stop and look, and it doesn't run at
// all for a visitor who has asked for reduced motion (see components.css).
//
// `variant` moves the wash and the rings so the six pages don't look like one
// page with the words swapped.
import SunRings from "./SunRings";

export default function PageField({ variant = "work" }) {
  return (
    <div className="field" data-field={variant} aria-hidden="true">
      <div className="fieldWash" />
      <div className="fieldEdge" />
      <SunRings className="fieldRings" strokeWidth={0.9} />
      <div className="fieldGrain" />
    </div>
  );
}
