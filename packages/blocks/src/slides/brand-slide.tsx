import { ComponentPropsWithoutRef, ReactNode } from "react";
import { SlideFooter } from "./slide-footer";
import { SlideHeader } from "./slide-header";
import "./brand-slide.css";

export type BrandSlideVariant = "brand" | "neutral";

export type BrandSlideProps = ComponentPropsWithoutRef<"article"> & {
  /**
   * Colour treatment of the slide.
   * - `brand` (default): brand-coloured fill, white labels
   * - `neutral`: neutral fill, dark labels
   */
  variant?: BrandSlideVariant;
  /** Top-left header label. */
  version?: ReactNode;
  /** Top-centre header label (e.g. a copyright / studio credit). */
  credit?: ReactNode;
  /** Top-right header label. */
  page?: ReactNode;
  /** Bottom-centre footer label. */
  brandName?: ReactNode;
  /** Bottom-right footer label. */
  sectionLabel?: ReactNode;
  /** Content rendered in the open area between the header and footer. */
  children?: ReactNode;
};

/**
 * A brand-guidelines slide — a coloured slide with micro-labels top and bottom,
 * mirroring the Figma "Page layout" component (1920×1080). The frame grows to
 * fit its content and lets the consumer own its height; the header/footer are
 * positioned by the frame's own margins (see brand-slide.css) — no scaling
 * transform, so it reflows cleanly instead of shrinking as an image.
 *
 * Pick a colour treatment with `variant`; wrap slide content in `children`.
 * Individual colours and spacing can still be overridden via the
 * `--brand-slide-*` custom properties.
 */
export function BrandSlide({
  variant = "brand",
  version = "VERSION 1.0",
  credit = "©2026 MONOFLY DESIGN",
  page = "PAGE 01",
  brandName = "BRAND NAME",
  sectionLabel = "BRAND IDENTITY",
  className,
  children,
  ...props
}: BrandSlideProps) {
  const classNames = ["brand-slide", `brand-slide-variant-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classNames} {...props}>
      <SlideHeader bare start={version} center={credit} end={page} />

      <main className="brand-slide-content">{children}</main>

      <SlideFooter bare center={brandName} end={sectionLabel} />
    </article>
  );
}
