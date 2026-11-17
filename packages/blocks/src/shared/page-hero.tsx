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
import type { CSSProperties, ReactNode } from "react";
import { Aurora } from "./lit";
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
 * whatever the page adds under them (stat tiles).
 *
 * A lit hero — the member workspace's — set as a card on a stage inset from
 * the viewport edges: lit navy, slow aurora light, film grain. With a
 * photograph, the photo leads in full colour on the right under a navy fade,
 * and the kit's contour striations run behind the copy, fading out before
 * the photo's subject (the workspace's home hero). Without one, the page's
 * motif from the graphics kit stands on the right instead.
 *
 * `ground` is the surface the card floats on. It defaults to the neutral
 * band, so the toolbar most index pages put under the hero reads as the
 * same surface; `paper` lets the page canvas through.
 */
export function PageHero({
  title,
  subtitle,
  image,
  motif = "globe",
  ground = "neutral",
  paddingBottom,
  flexProps,
  children,
}: {
  title: string;
  subtitle?: string | null;
  image?: string;
  motif?: PageHeroMotif;
  ground?: "neutral" | "paper";
  paddingBottom?: SectionProps["paddingBottom"];
  flexProps?: FlexProps;
  children?: ReactNode;
}) {
  // Not <Hero>: it puts every child inside its Flex container, and the photo
  // and motif have to be the Section's own children to sit behind the band.
  return (
    <div className="lit-stage" data-ground={ground}>
      <Section
        className={[
          "page-hero",
          `page-hero-${motif}`,
          "lit-hero",
          image ? "lit-hero-photo" : null,
        ]
          .filter(Boolean)
          .join(" ")}
        variant="brand"
        padding="1600"
        paddingBottom={paddingBottom}
      >
        {image ? <PhotoBackdrop src={image} /> : null}
        {image ? (
          <div className="lit-hero-striations page-hero-striations" aria-hidden>
            <ContourGlobe centerpiece="none" />
          </div>
        ) : motif === "rings" ? (
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
        <Aurora />
        <Flex
          container
          gap="600"
          direction="column"
          alignSecondary="start"
          {...flexProps}
        >
          <div className="lit-enter page-hero-title">
            <TextContentTitle title={title} subtitle={subtitle ?? undefined} />
          </div>
          {children ? (
            <div
              className="lit-enter page-hero-extra"
              style={{ "--lit-i": 2 } as CSSProperties}
            >
              {children}
            </div>
          ) : null}
        </Flex>
      </Section>
    </div>
  );
}

/**
 * An index hero's figures as the workspace's glass tiles: serif value over a
 * small label. A description list, so each label stays tied to its value.
 */
export function PageHeroStats({
  stats,
  className,
}: {
  stats: { value: ReactNode; label: string }[];
  className?: string;
}) {
  return (
    <dl className={["lit-stats", className].filter(Boolean).join(" ")}>
      {stats.map((stat, i) => (
        <div
          className="lit-stat lit-enter"
          key={stat.label}
          style={{ "--lit-i": i + 2 } as CSSProperties}
        >
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
