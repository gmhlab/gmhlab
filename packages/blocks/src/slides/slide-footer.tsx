import clsx from "clsx";
import { ReactNode } from "react";
import {
  Flex,
  FlexItem,
  Section,
  type SectionProps,
  useMediaQuery,
} from "@gmhlab/ui";
import "./slide-footer.css";

export type SlideFooterProps = Omit<SectionProps, "variant" | "padding" | "src"> & {
  /** Left slide label. */
  start?: ReactNode;
  /** Centre slide label. */
  center?: ReactNode;
  /** Right slide label. */
  end?: ReactNode;
  /**
   * Render with no Section chrome — transparent, edge-to-edge and unconstrained
   * by the container. Use when embedding in a coloured surface (e.g. the
   * brand-guidelines slide) so the labels sit flush on it.
   */
  bare?: boolean;
};

/**
 * A slide-style footer: a hairline rule above a start / centre / end row,
 * mirroring the brand slide footer but built from the MFY Flex
 * layout (Flex + FlexItem) rather than a raw CSS grid. The two side items
 * `size="fill"` grow equally so the centre label stays centred.
 *
 * By default it's a self-contained brand-filled bar; pass `bare` to strip that
 * chrome and let it blend into its parent surface.
 */
export function SlideFooter({
  className,
  start,
  center = "BRAND NAME",
  end = "BRAND IDENTITY",
  bare = false,
  ...props
}: SlideFooterProps) {
  const { isMobile } = useMediaQuery();
  return (
    <Section
      className={clsx(bare ? "slide-footer-bare" : "slide-footer", className)}
      elementType="footer"
      variant={bare ? "subtle" : "brand"}
      padding={bare ? "0" : "800"}
      {...props}
    >
      <Flex
        container={!bare}
        direction="column"
        alignSecondary="stretch"
        gap="600"
      >
        <FlexItem>
          <hr className="slide-footer-rule" />
        </FlexItem>
        <FlexItem>
          <Flex
            direction={isMobile ? "column" : "row"}
            alignSecondary="center"
            gap="600"
          >
            <FlexItem size={isMobile ? undefined : "fill"} className={isMobile ? undefined : "slide-footer-side"}>
              <p className="slide-footer-meta slide-footer-meta-start">{start}</p>
            </FlexItem>
            <FlexItem>
              <p className="slide-footer-meta slide-footer-meta-center">{center}</p>
            </FlexItem>
            <FlexItem size={isMobile ? undefined : "fill"} className={isMobile ? undefined : "slide-footer-side"}>
              <p className="slide-footer-meta slide-footer-meta-end">{end}</p>
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}
