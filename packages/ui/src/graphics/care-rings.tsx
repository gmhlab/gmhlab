import clsx from "clsx";
import { Figure, graphicA11y, useSvgId, type GraphicProps } from "./graphic";
import "./graphics.css";

/* Figure positions from the kit (28x40 cells on a 640 square, hub at 320). */
const REACHED = [
  [306, 204],
  [389.1, 252],
  [389.1, 348],
  [306, 396],
  [222.9, 348],
  [222.9, 252],
] as const;
const REACHING = [
  [360.4, 132.6],
  [448.4, 196.5],
  [482, 300],
  [448.4, 403.5],
  [360.4, 467.4],
  [251.6, 467.4],
  [163.6, 403.5],
  [130, 300],
  [163.6, 196.5],
  [251.6, 132.6],
] as const;
const NOT_YET = [
  [306, 44],
  [417.1, 69.4],
  [506.1, 140.4],
  [555.6, 243],
  [555.6, 357],
  [506.1, 459.6],
  [417.1, 530.6],
  [306, 556],
  [194.9, 530.6],
  [105.9, 459.6],
  [56.4, 357],
  [56.4, 243],
  [105.9, 140.4],
  [194.9, 69.4],
] as const;

/**
 * The kit's reach motif: care radiating from a gold hub through three rings
 * of people — reached (gold, joined to the hub), reaching (solid ink) and not
 * yet reached (outlined, fading). Square artwork; size it with CSS.
 *
 * The rings breathe outward once when the graphic mounts; static under
 * reduced motion.
 */
export function CareRings({ label, className, ...props }: GraphicProps) {
  const glow = useSvgId("care-rings-glow");
  return (
    <svg
      viewBox="0 0 640 640"
      className={clsx("graphic graphic-care-rings", className)}
      {...graphicA11y(label)}
      {...props}
    >
      <defs>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--graphic-gold)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--graphic-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="320" cy="320" r="150" fill={`url(#${glow})`} />
      <g fill="none" stroke="var(--graphic-ink)">
        <circle cx="320" cy="320" r="96" strokeWidth="1" opacity="0.35" />
        <circle
          cx="320"
          cy="320"
          r="176"
          strokeWidth="1"
          opacity="0.25"
          strokeDasharray="2 6"
        />
        <circle
          cx="320"
          cy="320"
          r="256"
          strokeWidth="1"
          opacity="0.18"
          strokeDasharray="1 9"
        />
      </g>
      <g stroke="var(--graphic-gold)" strokeWidth="1.25" opacity="0.6">
        <line x1="320" y1="320" x2="320" y2="246" />
        <line x1="320" y1="320" x2="384" y2="283" />
        <line x1="320" y1="320" x2="384" y2="357" />
        <line x1="320" y1="320" x2="320" y2="394" />
        <line x1="320" y1="320" x2="256" y2="357" />
        <line x1="320" y1="320" x2="256" y2="283" />
      </g>
      <circle cx="320" cy="320" r="22" fill="var(--graphic-gold)" />
      <circle cx="320" cy="320" r="8" fill="var(--graphic-ground)" />
      <g className="graphic-ring graphic-ring-1" fill="var(--graphic-gold)">
        {REACHED.map(([x, y]) => (
          <Figure key={`${x},${y}`} x={x} y={y} width="28" height="40" />
        ))}
      </g>
      <g
        className="graphic-ring graphic-ring-2"
        fill="var(--graphic-ink)"
        opacity="0.85"
      >
        {REACHING.map(([x, y]) => (
          <Figure key={`${x},${y}`} x={x} y={y} width="28" height="40" />
        ))}
      </g>
      <g
        className="graphic-ring graphic-ring-3"
        fill="none"
        stroke="var(--graphic-ink)"
        strokeWidth="0.9"
        opacity="0.5"
      >
        {NOT_YET.map(([x, y]) => (
          <Figure key={`${x},${y}`} x={x} y={y} width="28" height="40" />
        ))}
      </g>
    </svg>
  );
}
