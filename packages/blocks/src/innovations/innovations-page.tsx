import {
  Badge,
  Button,
  CardGrid,
  Card,
  Flex,
  Hero,
  Section,
  Text,
  TextContentTitle,
  TextHeading,
  TextLink,
  TextSmall,
  TextSubheading,
  TextTitlePage,
} from "@gmhlab/ui";
import type { Innovation } from "./innovations-types";
import "./innovations-page.css";

/**
 * The `innovations.tsx` wireframe rebuilt on the @gmhlab/ui layouts,
 * compositions and primitives. Same sections in the same order, same copy,
 * same 2-up card grid — but the chrome comes from Section/Flex/CardGrid/Card
 * and the colour, spacing and type come from `--mfy-*` tokens instead of the
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
    icon,
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
        <span className="innovation-card-icon" aria-hidden="true">
          {icon}
        </span>
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
      <Flex className="innovation-card-meta" wrap gap="400">
        <TextSmall>🌍 {reach}</TextSmall>
        <TextSmall>📄 {publications}</TextSmall>
      </Flex>
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
  /** Hero background image. Required: the hero is an image variant. */
  heroImage: string;
  /**
   * Base path detail links are built from, so the block travels with the site
   * that hosts it.
   */
  basePath?: string;
  /** Where the closing CTA buttons point. */
  trainingHref?: string;
  contactHref?: string;
};

export function InnovationsPage({
  innovations,
  detailSlugs = [],
  partners = [],
  heroImage,
  basePath = "/innovations",
  trainingHref = "#",
  contactHref = "#",
}: InnovationsPageProps) {
  return (
    <div className="innovations-page">
      <Hero
        variant="image"
        src={heroImage}
        flexProps={{ direction: "column", alignSecondary: "start" }}
      >
        <TextContentTitle
          title="Innovations"
          subtitle="Scalable tools and technologies developed through community partnership and rigorous research to close the global mental health treatment gap."
        />
      </Hero>

      {/* Brand band directly under the hero. The cards inside stay
          `variant="stroke"` and reset their own colour, so they read as light
          panels on the brand surface; the CardGrid heading has no colour of its
          own and inherits the section's `text-brand-on-brand`. */}
      <Section variant="brand" padding="1600">
        <CardGrid
          container
          type="half"
          gap="800"
          heading="Our Tools & Technologies"
          subheading="Evidence-based solutions designed for low-resource settings worldwide"
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

      <Section padding="1600">
        <Flex
          container
          direction="column"
          alignPrimary="center"
          alignSecondary="center"
          gap="800"
        >
          {/* TextTitlePage (3rem), not TextContentTitle — that resolves to
              TextTitleHero (4.5rem) on desktop, which would match the
              "Innovations" H1 above and make the CTA read as a second page
              title. Paired with TextSubheading (1.25rem) rather than
              TextSubtitle (2rem), which at this size competes with the
              heading. */}
          <Flex direction="column" alignSecondary="center" gap="200">
            <TextTitlePage className="text-align-center">
              Implement Our Innovations
            </TextTitlePage>
            {/* Only the paragraph is measure-capped, as in the wireframe —
                capping the wrapper would break the heading onto two lines. */}
            <TextSubheading className="innovations-cta-copy text-align-center">
              Interested in using EQUIP, our assessment tools, or other
              innovations in your setting? We provide training, consultation,
              and implementation support.
            </TextSubheading>
          </Flex>
          <Flex wrap gap="400" alignPrimary="center">
            <Button nativeButton={false} render={<a href={trainingHref} />}>
              Request Training
            </Button>
            <Button
              variant="secondary"
              nativeButton={false}
              render={<a href={contactHref} />}
            >
              Contact Us
            </Button>
          </Flex>
        </Flex>
      </Section>
    </div>
  );
}
