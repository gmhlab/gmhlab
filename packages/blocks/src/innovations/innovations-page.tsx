import {
  Badge,
  CardGrid,
  Card,
  Flex,
  ResearchGlyph,
  Section,
  Text,
  TextHeading,
  TextLink,
  TextSmall,
  WaveDivider,
} from "@gmhlab/ui";
import type { Innovation } from "./innovations-types";
import type { PageCta } from "../shared/page-copy";
import { GMH_INNOVATIONS_COPY } from "../shared/gmh-copy";
import { PageCtaSection } from "../shared/page-cta";
import { PageHero } from "../shared/page-hero";
import { ProjectMark } from "../shared/project-mark";
import "./innovations-page.css";

/**
 * The `innovations.tsx` wireframe rebuilt on the @gmhlab/ui layouts,
 * compositions and primitives. Same sections in the same order, same copy,
 * same 2-up card grid — but the chrome comes from Section/Flex/CardGrid/Card
 * and the colour, spacing and type come from `--gmh-*` tokens instead of the
 * hardcoded palette in `innovations.css`.
 *
 * Page content only: the site header and footer belong to the consuming app's
 * layout (see `apps/web/src/app/layout.tsx`), so the wireframe's own nav bar
 * and footer are deliberately absent. `innovations.tsx` still has them if you
 * want the standalone full-page version.
 *
 * Everything this file adds on top of the design system lives in
 * `innovations-page.css`, scoped under `.innovations-page` so it cannot leak
 * into other consumers of @gmhlab/blocks/styles.css the way `innovations.css`
 * does.
 */

function InnovationCard({
  innovation: {
    slug,
    glyph,
    logo,
    status,
    statusTone,
    heading,
    body,
    reach,
    publications,
  },
  href,
}: {
  innovation: Innovation;
  /** Set only when the innovation has a detail page. */
  href?: string;
}) {
  return (
    <Card
      className="innovation-card"
      variant="stroke"
      padding="800"
      asset={
        logo ? (
          <ProjectMark src={logo} />
        ) : (
          <span className="innovation-card-icon">
            <ResearchGlyph name={glyph} size={40} />
          </span>
        )
      }
    >
      {/* Wrapped: `.card-content > *` is forced to width:100%, which would
          stretch the pill across the card. */}
      <Flex>
        <Badge variant={statusTone} className="innovation-status">
          {status}
        </Badge>
      </Flex>
      <TextHeading>{heading}</TextHeading>
      <Text>{body}</Text>
      <dl className="innovation-card-meta">
        <div>
          <dt>Reach</dt>
          <dd>{reach}</dd>
        </div>
        <div>
          <dt>Evidence</dt>
          <dd>{publications}</dd>
        </div>
      </dl>
      {/* Only innovations with a detail record get a link — the rest have no
          page yet, and a card that offers a 404 is worse than one that offers
          nothing. Wrapped because `.card-content > *` is forced to width:100%,
          which would stretch the link's hit area across the card. */}
      {href ? (
        <Flex>
          <TextLink href={href}>Learn more →</TextLink>
        </Flex>
      ) : (
        <Flex>
          <TextSmall className="innovation-card-pending">
            Page in progress
          </TextSmall>
        </Flex>
      )}
    </Card>
  );
}

export type InnovationsPageProps = {
  /** The innovations to render. Supplied by the consuming app. */
  innovations: Innovation[];
  /**
   * Slugs that have a detail page. A card links only when its slug is here,
   * so an index with few detail records ships no 404s.
   */
  detailSlugs?: string[];
  /** Funder and partner word marks. Omit to render no partner strip. */
  partners?: string[];
  /**
   * Hero background photograph, shown in the brand duotone under the hero's
   * graphics-kit motif. Omit for the motif alone.
   */
  heroImage?: string;
  /**
   * Base path detail links are built from, so the block travels with the site
   * that hosts it.
   */
  basePath?: string;
  /** The hero heading. */
  title?: string;
  /**
   * The hero's one-line description. Omit for the GW Center's
   * (`GMH_INNOVATIONS_COPY`); `null` renders none.
   */
  subtitle?: string | null;
  /** Heading over the card grid. Omit for the Center's; `null` for none. */
  listHeading?: string | null;
  /** Subheading over the card grid. Omit for the Center's; `null` for none. */
  listSubheading?: string | null;
  /** The closing call to action. Omit for the Center's; `null` ends the page after the partners. */
  cta?: PageCta | null;
};

export function InnovationsPage({
  innovations,
  detailSlugs = [],
  partners = [],
  heroImage,
  basePath = "/innovations",
  title = "Innovations",
  subtitle = GMH_INNOVATIONS_COPY.subtitle,
  listHeading = GMH_INNOVATIONS_COPY.listHeading,
  listSubheading = GMH_INNOVATIONS_COPY.listSubheading,
  cta = GMH_INNOVATIONS_COPY.cta,
}: InnovationsPageProps) {
  return (
    <div className="innovations-page">
      <PageHero
        title={title}
        subtitle={subtitle}
        image={heroImage}
        motif="globe"
      />

      {/* Brand band directly under the hero. The cards inside stay
          `variant="stroke"` and reset their own colour, so they read as light
          panels on the brand surface; the CardGrid heading has no colour of its
          own and inherits the section's `text-brand-on-brand`. */}
      <Section variant="brand" padding="1600">
        <WaveDivider />
        <CardGrid
          container
          type="half"
          gap="800"
          heading={listHeading ?? undefined}
          subheading={listSubheading ?? undefined}
        >
          {innovations.map((innovation) => (
            <InnovationCard
              key={innovation.slug}
              href={
                detailSlugs.includes(innovation.slug)
                  ? `${basePath}/${innovation.slug}`
                  : undefined
              }
              innovation={innovation}
            />
          ))}
        </CardGrid>
      </Section>

      {partners.length ? (
        <Section className="innovations-partners" variant="neutral" padding="800">
          <Flex
            container
            wrap
            alignPrimary="center"
            alignSecondary="center"
            gap="1200"
          >
            {partners.map((partner) => (
              <div className="innovations-partner-logo" key={partner}>
                <TextSmall>{partner}</TextSmall>
              </div>
            ))}
          </Flex>
        </Section>
      ) : null}

      {cta ? (
        <PageCtaSection cta={cta} copyClassName="innovations-cta-copy" />
      ) : null}
    </div>
  );
}
