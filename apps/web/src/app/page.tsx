"use client";

import {
  FAQs,
  PanelSections,
  PricingGrid,
  ProductDetails,
  ProductGrid,
  WelcomeHero,
} from "@gmhlab/blocks";
import {
  Button,
  Flex,
  FlexItem,
  Hero,
  Panel,
  Section,
  StatsCard,
  TestimonialCard,
  Text,
  TextContentHeading,
  TextHeading,
  TextSubheading,
  TextTitleHero,
  useMediaQuery,
} from "@gmhlab/ui";

const STATS = [
  { stat: "390", description: "Design tokens" },
  { stat: "60+", description: "Components" },
  { stat: "3", description: "Packages, one system" },
  { stat: "100%", description: "Open source" },
];

const FEATURES = [
  {
    heading: "Tokens first",
    body: "Every colour, radius and space step comes from the --mfy-* token layer, so light and dark themes stay in lockstep.",
  },
  {
    heading: "Composable pieces",
    body: "Sections, Flex and Grid handle layout; primitives and compositions snap together into full pages without custom CSS.",
  },
  {
    heading: "Blocks included",
    body: "Auth, pricing and product data contexts ship with mock services, so pages like this one work before a backend exists.",
  },
];

const TESTIMONIALS = [
  {
    heading: "We rebuilt our marketing site in a week. The tokens did the theming for us.",
    name: "Riley Chen",
    username: "rileybuilds",
  },
  {
    heading: "The pricing section on this page is our actual pricing component. That still amazes me.",
    name: "Sam Okafor",
    username: "samokafor",
  },
  {
    heading: "Dark mode just worked. I pressed d and everything followed.",
    name: "Jordan Blake",
    username: "jblake",
  },
];

export default function HomePage() {
  const { isMobile } = useMediaQuery();
  const sectionPadding = isMobile ? "800" : "1600";
  const flexGap = isMobile ? "600" : "1200";

  return (
    <>
      {/* Hero */}
      <Hero variant="brand" padding={sectionPadding} flexProps={{ gap: "400" }}>
        <TextTitleHero>Design once. Ship everywhere.</TextTitleHero>
        <TextSubheading>
          Monofly is a token-driven design system — this whole site is built
          from its ui and blocks packages, nothing else.
        </TextSubheading>
        <Flex gap="300" alignSecondary="center" wrap>
          <Button variant="default" size="lg" onClick={() => {}}>
            Get started
          </Button>
          <Button variant="secondary" size="lg" onClick={() => {}}>
            View on GitHub
          </Button>
        </Flex>
      </Hero>

      {/* Stats strip */}
      <Section padding="800">
        <Panel type="quarter" gap="600">
          {STATS.map((s) => (
            <FlexItem key={s.description} size="minor">
              <StatsCard stat={s.stat} description={s.description} />
            </FlexItem>
          ))}
        </Panel>
      </Section>

      {/* Feature highlights */}
      <Section variant="neutral" padding={sectionPadding}>
        <Flex container direction="column" alignSecondary="center" gap={flexGap}>
            <TextContentHeading
              align="center"
              heading="Everything in one layer"
              subheading="Tokens, primitives, compositions and blocks — each depending only on the layer below."
            />
          <Flex type="third" wrap gap="600">
            {FEATURES.map((f) => (
              <FlexItem key={f.heading} size="minor">
                <Flex direction="column" gap="300">
                  <TextHeading>{f.heading}</TextHeading>
                  <Text>{f.body}</Text>
                </Flex>
              </FlexItem>
            ))}
          </Flex>
        </Flex>
      </Section>

      {/* Image + copy panels from blocks */}
      <PanelSections />

      {/* Product grid from the blocks data layer */}
      <ProductGrid />

      {/* Featured product details */}
      <ProductDetails />

      {/* Pricing from the blocks data layer */}
      <PricingGrid />

      {/* Testimonials */}
      <Section variant="neutral" padding={sectionPadding}>
        <Flex container direction="column" gap={flexGap}>
          <Flex alignPrimary="center">
            <TextContentHeading
              align="center"
              heading="Loved by builders"
              subheading="What people ship with Monofly"
            />
          </Flex>
          <Flex type="third" wrap gap="600">
            {TESTIMONIALS.map((t) => (
              <FlexItem key={t.username} size="minor">
                <TestimonialCard
                  heading={t.heading}
                  name={t.name}
                  username={t.username}
                  initials={t.name.charAt(0)}
                />
              </FlexItem>
            ))}
          </Flex>
        </Flex>
      </Section>

      {/* FAQ */}
      <FAQs />

      {/* Newsletter CTA */}
      <WelcomeHero />
    </>
  );
}
