import {
  CareRings,
  ContourGlobe,
  Flex,
  type FlexProps,
  PhotoBackdrop,
  Section,
  type SectionProps,
  TextContentTitle,
} from "@gmhlab/ui";
import type { ReactNode } from "react";
import "./page-hero.css";

/* Internal to @gmhlab/blocks — the index pages' shared header. */

/**
 * Which graphics-kit motif an index hero draws when it has no photograph:
 * the contour globe, the contours around the GMH mark, the contours alone,
 * or the care rings.
 */
export type PageHeroMotif = "globe" | "mark" | "contours" | "rings";

/**
 * The header every index page opens on: the page title, its subtitle, and
 * whatever the page adds under them (stat rows).
 *
 * A neutral band drawn with a motif from the GMH graphics kit, over the
 * page's photograph when it has one — put through the brand duotone and
 * washed in the band's surface so the title keeps its contrast. Neutral
 * rather than paper so it reads as one header with the neutral toolbar band
 * most index pages put under it.
 */
export function PageHero({
  title,
  subtitle,
  image,
  motif = "globe",
  paddingBottom,
  flexProps,
  children,
}: {
  title: string;
  subtitle?: string | null;
  image?: string;
  motif?: PageHeroMotif;
  paddingBottom?: SectionProps["paddingBottom"];
  flexProps?: FlexProps;
  children?: ReactNode;
}) {
  // Not <Hero>: it puts every child inside its Flex container, and the photo
  // and motif have to be the Section's own children to sit behind the band.
  return (
    <Section
      className={`page-hero page-hero-${motif}`}
      variant="neutral"
      padding="1600"
      paddingBottom={paddingBottom}
    >
      {image ? <PhotoBackdrop src={image} /> : null}
      {motif === "rings" ? (
        <CareRings
          className="graphic-backdrop page-hero-rings"
          preserveAspectRatio="xMaxYMid meet"
        />
      ) : (
        <ContourGlobe
          backdrop
          centerpiece={motif === "contours" ? "none" : motif}
          className="graphic-fade-start"
        />
      )}
      <Flex
        container
        gap="600"
        direction="column"
        alignSecondary="start"
        {...flexProps}
      >
        <TextContentTitle title={title} subtitle={subtitle ?? undefined} />
        {children}
      </Flex>
    </Section>
  );
}
