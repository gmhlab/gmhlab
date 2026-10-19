import clsx from "clsx";
import type { ReactNode } from "react";
import { graphicA11y, useSvgId, type GraphicProps } from "./graphic";
import "./graphics.css";

type ShapeIds = { navy: string; gold: string; arch: string; dots: string };

/*
 * The kit's duotone shapes on a 200 grid. Each is a function of the
 * gradient/clip ids so that two shapes on one page never share a definition.
 * `blob` and `pill` are also the kit's photo frames — see the
 * `graphic-mask-*` classes in graphics.css for using them as an image crop.
 */
const SHAPES = {
  blob: ({ navy }: ShapeIds) => (
    <>
      <path
        d="M104 18 C150 16 186 52 182 98 C178 146 142 184 96 182 C52 180 18 146 20 100 C22 56 58 20 104 18 Z"
        fill={`url(#${navy})`}
      />
      <path
        d="M60 128 C90 110 120 140 150 116"
        fill="none"
        stroke="var(--graphic-gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  arch: ({ arch }: ShapeIds) => (
    <>
      <path
        d="M40 186 V96 A60 60 0 0 1 160 96 V186 Z"
        fill="var(--graphic-gold-wash)"
      />
      <g
        clipPath={`url(#${arch})`}
        fill="none"
        stroke="var(--graphic-ink)"
        strokeWidth="1.25"
        opacity="0.55"
      >
        <path d="M20 170 C60 150 90 180 130 160 S170 140 190 150" />
        <path d="M20 146 C60 126 90 156 130 136 S170 116 190 126" />
        <path d="M20 122 C60 102 90 132 130 112 S170 92 190 102" />
        <path d="M20 98 C60 78 90 108 130 88 S170 68 190 78" />
        <path d="M20 74 C60 54 90 84 130 64 S170 44 190 54" />
      </g>
      <path
        d="M40 186 V96 A60 60 0 0 1 160 96 V186"
        fill="none"
        stroke="var(--graphic-gold)"
        strokeWidth="2.5"
      />
    </>
  ),
  "quarter-sun": ({ navy }: ShapeIds) => (
    <>
      <path d="M28 176 V60 A116 116 0 0 1 144 176 Z" fill={`url(#${navy})`} />
      <circle cx="150" cy="56" r="30" fill="var(--graphic-gold)" />
    </>
  ),
  seed: ({ gold }: ShapeIds) => (
    <>
      <path
        d="M100 18 C152 58 152 142 100 182 C48 142 48 58 100 18 Z"
        fill={`url(#${gold})`}
      />
      <path
        d="M100 40 V164 M100 80 L80 64 M100 110 L122 92 M100 138 L80 122"
        fill="none"
        stroke="var(--graphic-ink-fixed)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  pill: ({ navy }: ShapeIds) => (
    <>
      <rect x="58" y="14" width="84" height="172" rx="42" fill={`url(#${navy})`} />
      <circle cx="100" cy="78" r="16" fill="var(--graphic-gold)" />
      <path d="M68 150 C68 108 132 108 132 150 Z" fill="var(--graphic-gold)" />
    </>
  ),
  "rising-rings": () => (
    <>
      <path d="M14 170 A86 86 0 0 1 186 170 Z" fill="var(--graphic-ink-soft)" />
      <path d="M42 170 A58 58 0 0 1 158 170 Z" fill="var(--graphic-ink)" />
      <path d="M70 170 A30 30 0 0 1 130 170 Z" fill="var(--graphic-gold)" />
      <line
        x1="8"
        y1="178"
        x2="192"
        y2="178"
        stroke="var(--graphic-ink)"
        strokeWidth="2"
      />
    </>
  ),
  held: ({ navy }: ShapeIds) => (
    <>
      <circle cx="100" cy="84" r="28" fill="var(--graphic-gold)" />
      <path d="M24 110 A76 76 0 0 0 176 110 Z" fill={`url(#${navy})`} />
      <circle cx="56" cy="62" r="4" fill="var(--graphic-gold)" opacity="0.6" />
      <circle cx="146" cy="52" r="5" fill="var(--graphic-gold)" opacity="0.45" />
    </>
  ),
  brackets: ({ dots }: ShapeIds) => (
    <>
      <rect x="34" y="34" width="132" height="132" fill={`url(#${dots})`} />
      <path
        d="M22 52 V22 H52 M148 22 H178 V52 M178 148 V178 H148 M52 178 H22 V148"
        fill="none"
        stroke="var(--graphic-gold)"
        strokeWidth="4"
        strokeLinecap="square"
      />
    </>
  ),
} satisfies Record<string, (ids: ShapeIds) => ReactNode>;

export type BrandShapeName = keyof typeof SHAPES;

/** Every shape name, in the kit's order — for galleries and pickers. */
export const BRAND_SHAPES = Object.keys(SHAPES) as BrandShapeName[];

export type BrandShapeProps = GraphicProps & {
  name: BrandShapeName;
  /** Rendered size in px; the artwork is square. Omit to size with CSS. */
  size?: number;
};

/**
 * One of the kit's duotone shapes — navy and gold spot illustrations for
 * empty states, section accents and placeholder panels. Decorative unless
 * given a `label`.
 */
export function BrandShape({
  name,
  size,
  label,
  className,
  ...props
}: BrandShapeProps) {
  const ids: ShapeIds = {
    navy: useSvgId("shape-navy"),
    gold: useSvgId("shape-gold"),
    arch: useSvgId("shape-arch"),
    dots: useSvgId("shape-dots"),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={clsx("graphic graphic-shape", className)}
      {...graphicA11y(label)}
      {...props}
    >
      <defs>
        <linearGradient id={ids.navy} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--graphic-ink-soft)" />
          <stop offset="1" stopColor="var(--graphic-ink)" />
        </linearGradient>
        <linearGradient id={ids.gold} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--graphic-gold-soft)" />
          <stop offset="1" stopColor="var(--graphic-gold)" />
        </linearGradient>
        <clipPath id={ids.arch}>
          <path d="M40 186 V96 A60 60 0 0 1 160 96 V186 Z" />
        </clipPath>
        <pattern id={ids.dots} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1.6" fill="var(--graphic-ink)" opacity="0.55" />
        </pattern>
      </defs>
      {SHAPES[name](ids)}
    </svg>
  );
}
