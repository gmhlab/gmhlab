import { useId, type SVGProps } from "react";

/**
 * Props every kit graphic takes. Graphics are decoration by default — they are
 * `aria-hidden` unless given a `label`, in which case they become a labelled
 * `role="img"`. Give one a label only when the picture says something the
 * text beside it does not.
 */
export type GraphicProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  label?: string;
};

export function graphicA11y(label?: string) {
  return label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);
}

/**
 * A document-unique id for an SVG gradient, clip path or pattern. React's
 * `useId` output contains characters (`:`, `«`) that are awkward inside
 * `url(#…)`, so they are stripped. Unique ids matter here: two graphics on one
 * page sharing a gradient id would both paint the first one's.
 */
export function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/**
 * The kit's person figure — head and shoulders on a 14x20 grid, the same
 * glyph the home page's care-gap field is drawn in. A nested <svg> rather than
 * a <symbol> + <use>, so it needs no id and inherits fill/stroke from its
 * parent group.
 */
export function Figure(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 20" overflow="visible" {...props}>
      <circle cx="7" cy="4.6" r="3.1" />
      <path d="M1.4 19 C1.4 11.6 12.6 11.6 12.6 19 Z" />
    </svg>
  );
}
