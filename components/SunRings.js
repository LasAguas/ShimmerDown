// The concentric sun rings behind the footer — lifted from the reference's
// contact card: chunky filled bands, not thin outlines, each separated from
// the next by a sliver of the page background. Built as filled discs painted
// largest-first, each outlined in the background colour so the ring beneath
// shows through as a thin gap; the smallest disc is solid with no gap.
//
// `ramp` swaps the seven colours for one of the site's other palettes — see
// globals.css's --dawn-*/--vibrant-*/--dusk-*/--redsun-* custom properties
// and PageField.js, which is what actually picks a ramp per page. The
// footer's own rings (SiteFooter.js) never pass one, so they stay golden
// hour everywhere, same as the nav and the buttons.
export const GOLDEN_HOUR = [
  "var(--sun-1)",
  "var(--sun-2)",
  "var(--sun-3)",
  "var(--sun-4)",
  "var(--sun-5)",
  "var(--sun-6)",
  "var(--sun-7)",
];
export const EARLY_DAWN = [
  "var(--dawn-1)",
  "var(--dawn-2)",
  "var(--dawn-3)",
  "var(--dawn-4)",
  "var(--dawn-5)",
  "var(--dawn-6)",
  "var(--dawn-7)",
];
export const VIBRANT_SUNSET = [
  "var(--vibrant-1)",
  "var(--vibrant-2)",
  "var(--vibrant-3)",
  "var(--vibrant-4)",
  "var(--vibrant-5)",
  "var(--vibrant-6)",
  "var(--vibrant-7)",
];
export const DEEP_DUSK = [
  "var(--dusk-1)",
  "var(--dusk-2)",
  "var(--dusk-3)",
  "var(--dusk-4)",
  "var(--dusk-5)",
  "var(--dusk-6)",
  "var(--dusk-7)",
];
export const DEEP_RED_SUNSET = [
  "var(--redsun-1)",
  "var(--redsun-2)",
  "var(--redsun-3)",
  "var(--redsun-4)",
  "var(--redsun-5)",
  "var(--redsun-6)",
  "var(--redsun-7)",
];

// ---- two-palette blends ----------------------------------------------
// Mostly one ramp, with the innermost rings — the figure's brightest
// core — picked up from a second, paired palette, so a page isn't reading
// as a single flat gradient. Each pair mirrors the other the other way
// round: Studio and the Store share dusk + vibrant sunset, Contact and
// Live Sessions share early dawn + deep red sunset.
export const DUSK_VIBRANT_CORE = [
  "var(--dusk-1)",
  "var(--dusk-2)",
  "var(--dusk-3)",
  "var(--dusk-4)",
  "var(--dusk-5)",
  "var(--vibrant-6)",
  "var(--vibrant-7)",
];
export const VIBRANT_DUSK_CORE = [
  "var(--vibrant-1)",
  "var(--vibrant-2)",
  "var(--vibrant-3)",
  "var(--vibrant-4)",
  "var(--vibrant-5)",
  "var(--dusk-2)",
  "var(--dusk-1)",
];
export const REDSUN_DAWN_CORE = [
  "var(--redsun-1)",
  "var(--redsun-2)",
  "var(--redsun-3)",
  "var(--redsun-4)",
  "var(--redsun-5)",
  "var(--dawn-5)",
  "var(--dawn-6)",
];
export const DAWN_REDSUN_CORE = [
  "var(--dawn-1)",
  "var(--dawn-2)",
  "var(--dawn-3)",
  "var(--dawn-4)",
  "var(--dawn-5)",
  "var(--redsun-4)",
  "var(--redsun-5)",
];

export default function SunRings({ className, gap = 3, ramp = GOLDEN_HOUR }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      {ramp.map((c, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          // 98 down to 14 — evenly spaced, so each band reads as the same width
          r={98 - i * 14}
          fill={c}
          stroke={i < ramp.length - 1 ? "var(--paper-2)" : "none"}
          strokeWidth={gap}
        />
      ))}
    </svg>
  );
}
