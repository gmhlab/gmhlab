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

/** Maps onto Badge's status variants. */
type InnovationStatus = "info" | "warning" | "success";

type Innovation = {
  icon: string;
  status: string;
  statusTone: InnovationStatus;
  heading: string;
  body: string;
  reach: string;
  publications: string;
};

const INNOVATIONS: Innovation[] = [
  {
    icon: "📋",
    status: "WHO/UNICEF Partnership",
    statusTone: "info",
    heading: "EQUIP Platform",
    body: "Competency-based training and supervision system for non-specialist mental health providers. Standardizes quality assessment across diverse healthcare settings.",
    reach: "25+ countries",
    publications: "12 publications",
  },
  {
    icon: "📱",
    status: "In Development",
    statusTone: "warning",
    heading: "Passive Sensing Technology",
    body: "Smartphone-based behavioral monitoring that uses GPS, accelerometer, and usage patterns to personalize depression interventions for new mothers.",
    reach: "Nepal",
    publications: "3 publications",
  },
  {
    icon: "✓",
    status: "Active",
    statusTone: "success",
    heading: "Validated Assessment Tools",
    body: "Culturally adapted and psychometrically validated mental health screening instruments (PHQ-9, GAD-7, EPDS) for use in LMIC contexts.",
    reach: "8+ countries",
    publications: "6 publications",
  },
  {
    icon: "🤝",
    status: "Active",
    statusTone: "success",
    heading: "RESHAPE Stigma Toolkit",
    body: "Evidence-based interventions combining social contact, education, and skills training to reduce mental health stigma among healthcare providers.",
    reach: "Nepal, Ethiopia, India",
    publications: "5 publications",
  },
];

const PARTNERS = ["WHO", "UNICEF", "NIMH", "World Bank", "Carter Center"];

/**
 * Hero background — a **demo placeholder**, not a Center asset. Lorem Picsum
 * serves one fixed photo per numeric id, so the URL is stable rather than
 * random, but it is stock imagery standing in for a real photograph and it
 * makes the page depend on a third-party host at runtime. Swap it for a Center
 * image (or a local file in the consuming app) before this goes live.
 *
 * Section's `image` variant lays a scrim over it that **inverts with the
 * theme** — 80% white in light, 80% black in dark — so the hero's existing
 * text tokens (which invert the same way) stay readable without an on-image
 * colour of their own.
 */
const HERO_IMAGE = "https://picsum.photos/id/36/1920/1080";

function InnovationCard({
  icon,
  status,
  statusTone,
  heading,
  body,
  reach,
  publications,
}: Innovation) {
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
      <Flex>
        <TextLink href="#">Learn more →</TextLink>
      </Flex>
    </Card>
  );
}

export function InnovationsPage() {
  return (
    <div className="innovations-page">
      <Hero
        variant="image"
        src={HERO_IMAGE}
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
          {INNOVATIONS.map((innovation) => (
            <InnovationCard key={innovation.heading} {...innovation} />
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
          {PARTNERS.map((partner) => (
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
            <Button nativeButton={false} render={<a href="#" />}>
              Request Training
            </Button>
            <Button variant="secondary" nativeButton={false} render={<a href="#" />}>
              Contact Us
            </Button>
          </Flex>
        </Flex>
      </Section>
    </div>
  );
}
