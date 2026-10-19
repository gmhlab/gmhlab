import clsx from "clsx";
import { GMH_MARK_VIEWBOX, GmhMarkArt } from "../primitives/logo/gmh-mark-art";
import { graphicA11y, useSvgId, type GraphicProps } from "./graphic";
import "./graphics.css";

/**
 * What stands on the right of the contour field: the kit's wireframe globe,
 * the GMH mark in a clearing the contours fade into (the designer's "Contour
 * hero — logo backdrop"), or nothing — the quieter form, for a band whose
 * content already fills the right-hand side.
 */
export type ContourCenterpiece = "globe" | "mark" | "none";

export type ContourGlobeProps = GraphicProps & {
  centerpiece?: ContourCenterpiece;
  /**
   * Fill the nearest positioned ancestor, behind its content. A `Section`
   * containing a backdrop is isolated and clipped for you (graphics.css);
   * anything else needs `position: relative; isolation: isolate`.
   */
  backdrop?: boolean;
};

/* The eight quiet contours, bottom to top. One curve shifted by 52-unit
   steps; the gold line is the fifth. */
const CONTOURS: [offset: number, opacity: number][] = [
  [156, 0.22],
  [104, 0.3],
  [52, 0.38],
  [-52, 0.42],
  [-104, 0.36],
  [-156, 0.3],
  [-208, 0.24],
  [-260, 0.18],
];
const contour = (dy: number) =>
  `M-40 ${464 + dy} C 200 ${384 + dy}, 360 ${524 + dy}, 620 ${434 + dy} S 1060 ${314 + dy}, 1480 ${394 + dy}`;

/** Points on the gold line where a finding is "marked". The third sits
    inside the mark's clearing, so the mark form drops it. */
const MARKERS = [
  [282.5, 452.75],
  [620, 434],
  [990, 350.25],
] as const;
const DOTS = [
  [282.5, 556.75],
  [620, 278],
  [990, 194.25],
  [1260, 268],
] as const;

/**
 * The kit's hero backdrop: topographic contours sweeping across a wireframe
 * globe (or the GMH mark), one contour drawn in gold with markers on it — the
 * work as points on a landscape. 1440x640 artwork, sliced to cover and
 * anchored right, so the centrepiece stays clear of left-aligned hero copy at
 * every width.
 *
 * Colours are the graphic roles in graphics.css: navy ink on paper, pale ink
 * on a brand band or after dark, gold always. The contours draw themselves in
 * once and the markers settle; both are static under reduced motion.
 */
export function ContourGlobe({
  centerpiece = "globe",
  backdrop,
  label,
  className,
  ...props
}: ContourGlobeProps) {
  const clip = useSvgId("contour-globe-clip");
  const glow = useSvgId("contour-globe-glow");
  const clearing = useSvgId("contour-globe-clearing");
  const markers = centerpiece === "mark" ? MARKERS.slice(0, 2) : MARKERS;
  const dots = centerpiece === "mark" ? DOTS.slice(0, 2) : DOTS;
  return (
    <svg
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMaxYMid slice"
      className={clsx(
        "graphic graphic-contour-globe",
        backdrop && "graphic-backdrop",
        className,
      )}
      {...graphicA11y(label)}
      {...props}
    >
      {centerpiece === "globe" && (
        <>
          <defs>
            <clipPath id={clip}>
              <circle cx="1080" cy="420" r="300" />
            </clipPath>
            <radialGradient id={glow} cx="0.42" cy="0.38" r="0.7">
              <stop offset="0" stopColor="var(--graphic-gold)" stopOpacity="0.18" />
              <stop offset="1" stopColor="var(--graphic-gold)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="1080" cy="420" r="300" fill={`url(#${glow})`} />
          <g
            className="graphic-globe"
            fill="none"
            stroke="var(--graphic-ink)"
            strokeWidth="1"
            opacity="0.45"
          >
            <circle cx="1080" cy="420" r="300" />
            <g clipPath={`url(#${clip})`}>
              <line x1="1080" y1="120" x2="1080" y2="720" />
              <ellipse cx="1080" cy="420" rx="100" ry="300" />
              <ellipse cx="1080" cy="420" rx="200" ry="300" />
              <ellipse cx="1080" cy="220" rx="224" ry="20" />
              <ellipse cx="1080" cy="320" rx="283" ry="26" />
              <ellipse cx="1080" cy="420" rx="300" ry="30" />
              <ellipse cx="1080" cy="520" rx="283" ry="26" />
              <ellipse cx="1080" cy="620" rx="224" ry="20" />
            </g>
          </g>
        </>
      )}
      <g
        fill="none"
        stroke="var(--graphic-ink)"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        {CONTOURS.map(([dy, opacity]) => (
          <path
            key={dy}
            className="graphic-draw"
            pathLength={1}
            opacity={opacity}
            d={contour(dy)}
          />
        ))}
      </g>
      <path
        className="graphic-draw graphic-draw-lead"
        pathLength={1}
        fill="none"
        stroke="var(--graphic-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        d={contour(0)}
      />
      {centerpiece === "mark" && (
        <>
          <defs>
            <radialGradient id={clearing} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="var(--graphic-ground)" stopOpacity="1" />
              <stop offset="0.62" stopColor="var(--graphic-ground)" stopOpacity="0.92" />
              <stop offset="1" stopColor="var(--graphic-ground)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* The clearing the contours fade into around the mark. */}
          <circle
            className="graphic-clearing"
            cx="1080"
            cy="310"
            r="240"
            fill={`url(#${clearing})`}
          />
        </>
      )}
      <g fill="var(--graphic-gold)">
        {markers.map(([cx, cy], i) => (
          <g
            key={cx}
            className="graphic-marker"
            style={{ animationDelay: `${1.4 + i * 0.25}s` }}
          >
            <circle cx={cx} cy={cy} r="26" opacity="0.14" />
            <circle cx={cx} cy={cy} r="14" opacity="0.32" />
            <circle cx={cx} cy={cy} r="5" />
          </g>
        ))}
      </g>
      <g fill="var(--graphic-ink)" opacity="0.7">
        {dots.map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="3.5" />
        ))}
      </g>
      {centerpiece === "mark" && (
        <svg
          className="graphic-mark"
          x="930"
          y="186"
          width="300"
          height="248"
          viewBox={GMH_MARK_VIEWBOX}
          overflow="visible"
        >
          <GmhMarkArt />
        </svg>
      )}
    </svg>
  );
}
