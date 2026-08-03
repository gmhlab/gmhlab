import clsx from "clsx";
import { ReactNode } from "react";
import {
  Flex,
  FlexItem,
  Section,
  type SectionProps,
  useMediaQuery,
} from "@gmhlab/ui";
import "./slide-header.css";

export type SlideHeaderProps = Omit<SectionProps, "variant" | "padding" | "src"> & {
  /** Left slide label. */
  start?: ReactNode;
  /** Centre slide label. */
  center?: ReactNode;
  /** Right slide label. */
  end?: ReactNode;
  /**
   * Render with no Section chrome — transparent, borderless, edge-to-edge and
   * unconstrained by the container. Use when embedding in a coloured surface
   * (e.g. the brand-guidelines slide) so the labels sit flush on it.
   */
  bare?: boolean;
};

/**
 * A slide-style header: three micro-labels laid out start / centre / end,
 * mirroring the brand slide header row but built from the MFY
 * Flex layout (Flex + FlexItem) rather than a raw CSS grid. The two side
 * items `size="fill"` grow equally so the centre label stays centred.
 *
 * By default it's a self-contained bar (neutral fill, bottom border, sticky);
 * pass `bare` to strip that chrome and let it blend into its parent surface.
 */
export function SlideHeader({
  className,
  start = "VERSION 1.0",
  center = "©2026 MONOFLY DESIGN",
  end = "PAGE 01",
  bare = false,
  ...props
}: SlideHeaderProps) {
  const { isMobile } = useMediaQuery();
  return (
    <Section
      className={clsx(bare ? "slide-header-bare" : "slide-header", className)}
      elementType="header"
      variant={bare ? "subtle" : "stroke"}
      padding={bare ? "0" : "800"}
      {...props}
    >
      <Flex
        container={!bare}
        type={isMobile ? "auto" : "quarter"}
        direction={isMobile ? "column" : "row"}
        alignSecondary="center"
        gap="600"
      >
        <FlexItem size="minor">
          <p className="slide-header-meta slide-header-meta-start">{start}</p>
        </FlexItem>
        <FlexItem size="half">
          <p className="slide-header-meta slide-header-meta-center">{center}</p>
        </FlexItem>
        <FlexItem size="minor">
          <p className="slide-header-meta slide-header-meta-end">{end}</p>
        </FlexItem>
      </Flex>
    </Section>
  );
}
