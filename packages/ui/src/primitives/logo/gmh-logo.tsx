import clsx from "clsx";
import { AnchorOrButton, type AnchorOrButtonProps } from "../../lib/utils";
import { GMH_MARK_VIEWBOX, GmhMarkArt, GmhMarkSimpleArt } from "./gmh-mark-art";
import "./logo.css";

export type GmhLogoProps = AnchorOrButtonProps & {
  /**
   * Which drawing of the mark: `simple` (the default) has a stylised globe
   * that holds up at header and footer size; `detailed` has real coastlines,
   * for when the mark is shown large.
   */
  variant?: "simple" | "detailed";
};
/**
 * The brand mark: four figures holding a globe. Links to the site root by
 * default — a logo in site chrome is expected to go home, and defaulting it
 * here means every consumer (header, footer, anything else) gets that without
 * opting in.
 *
 * Two drawings of one mark (see `gmh-mark-art.tsx`), each from the
 * designer's two colourways (navy + gold on paper, white + gold reversed).
 * The colours are two roles set in logo.css — `--logo-mark-ink` and
 * `--logo-mark-gold` — rather than two baked variants, so the mark follows the
 * `.dark` class and brand bands. Regenerate rather than hand-edit the path
 * data.
 *
 * Pass a different `href` to retarget it, or `href={undefined}` to fall back to
 * AnchorOrButton's button branch for a non-navigating logo. The key has to be
 * omitted entirely in that case, not passed as undefined: AnchorOrButton
 * branches on `"href" in props`, so a present-but-undefined href would render
 * an <a> with no destination.
 */
export function GmhLogo({
  variant = "simple",
  className,
  href = "/",
  "aria-label": ariaLabel,
  ...props
}: GmhLogoProps) {
  const classNames = clsx(className, "logo", "logo-gmh");
  return (
    <AnchorOrButton
      className={classNames}
      {...props}
      {...(href === undefined ? {} : { href })}
      aria-label={
        ariaLabel ?? (href === undefined ? "GMH Lab logo" : "GMH Lab, home")
      }
    >
      <svg
        width="1144.11"
        height="945"
        viewBox={GMH_MARK_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {variant === "detailed" ? <GmhMarkArt /> : <GmhMarkSimpleArt />}
      </svg>
    </AnchorOrButton>
  );
}
