// The concentric sun rings behind the footer — lifted from the reference's
// contact card: chunky filled bands, not thin outlines, each separated from
// the next by a sliver of the page background. Built as filled discs painted
// largest-first, each outlined in the background colour so the ring beneath
// shows through as a thin gap; the smallest disc is solid with no gap.
const RAMP = [
  "var(--sun-1)",
  "var(--sun-2)",
  "var(--sun-3)",
  "var(--sun-4)",
  "var(--sun-5)",
  "var(--sun-6)",
  "var(--sun-7)",
];

export default function SunRings({ className, gap = 3 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      {RAMP.map((c, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          // 98 down to 14 — evenly spaced, so each band reads as the same width
          r={98 - i * 14}
          fill={c}
          stroke={i < RAMP.length - 1 ? "var(--paper-2)" : "none"}
          strokeWidth={gap}
        />
      ))}
    </svg>
  );
}
