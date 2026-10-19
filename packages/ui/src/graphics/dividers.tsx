import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { Figure, graphicA11y, useSvgId, type GraphicProps } from "./graphic";
import "./graphics.css";

/* The wave, traced once: the gold edge, and the faint ink line riding 16
   units above it. */
const WAVE = "M0 72 C240 22 480 122 720 72 S1200 22 1440 72";
const WAVE_ECHO = "M0 56 C240 6 480 106 720 56 S1200 6 1440 56";

/**
 * The kit's wave section divider. Put it as the first child of a
 * `Section variant="brand"` that follows a light section: it carves the
 * band's top edge into a wave of the page surface, edged in gold, and the
 * Section makes room for it (graphics.css).
 *
 * It is carved out of the band rather than laid on top of it, so the band's
 * own gradient and texture run unbroken up to the gold line. The carve is the
 * default page surface; set `--graphic-wave-fill` when the section above is
 * some other surface.
 */
export function WaveDivider({
  className,
  ...props
}: Omit<GraphicProps, "label">) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={clsx("graphic graphic-wave", className)}
      aria-hidden="true"
      {...props}
    >
      <path className="graphic-wave-carve" d={`${WAVE} V0 H0 Z`} />
      <path
        className="graphic-wave-echo"
        d={WAVE_ECHO}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="graphic-wave-edge"
        d={WAVE}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The kit's figure texture: a row of small people, one in three in gold. A
 * repeating pattern, so it fills whatever width it is given; 48px tall.
 */
export function FigureBand({ label, className, ...props }: GraphicProps) {
  const tile = useSvgId("figure-band");
  return (
    <svg
      height="48"
      className={clsx("graphic graphic-figure-band", className)}
      {...graphicA11y(label)}
      {...props}
    >
      <defs>
        <pattern id={tile} width="96" height="48" patternUnits="userSpaceOnUse">
          <g fill="var(--graphic-ink)" opacity="0.28">
            <Figure x="10" y="12" width="17" height="24" />
            <Figure x="74" y="12" width="17" height="24" />
          </g>
          <Figure x="42" y="12" width="17" height="24" fill="var(--graphic-gold)" />
        </pattern>
      </defs>
      <rect width="100%" height="48" fill={`url(#${tile})`} />
    </svg>
  );
}

export type PathwayRuleProps = ComponentPropsWithoutRef<"div"> & {
  /** Milestones along the rule, the last of which is the gold goal. */
  steps?: number;
};

/**
 * The kit's pathway rule: a dotted gold path through navy milestones to a
 * gold goal. HTML rather than one SVG so the nodes stay round at any width.
 */
export function PathwayRule({
  steps = 5,
  className,
  ...props
}: PathwayRuleProps) {
  const count = Math.max(2, steps);
  return (
    <div
      className={clsx("graphic graphic-pathway", className)}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={clsx(
            "graphic-pathway-node",
            i === count - 1 && "graphic-pathway-goal",
          )}
        />
      ))}
    </div>
  );
}
