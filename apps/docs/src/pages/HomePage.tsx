import { Link } from "react-router";
import {
  Card,
  CardGrid,
  FlexItem,
  GmhLogo,
  Hero,
  Section,
  Text,
  TextContentTitle,
  TextHeading,
  TextSmallStrong,
} from "@gmhlab/ui";

/**
 * One card per route in `App.tsx`. Keep this list in step with the router and
 * with `components/site-header.tsx`, which carries the same set as nav links.
 */
const demos = [
  {
    to: "/components",
    title: "Components",
    body: "The full @gmhlab/ui gallery — every primitive, layout, and composition, with variants and states.",
  },
  {
    to: "/blocks",
    title: "Blocks",
    body: "Everything in @gmhlab/blocks — the MonoFly example sections rendered live, and the five record-driven page blocks on their own demo routes.",
  },
  {
    to: "/tokens",
    title: "Tokens",
    body: "The design-token gallery — semantic colour roles, pairing recipes, and the responsive foundations grid.",
  },
  {
    to: "/slides",
    title: "Slides",
    body: "Full-bleed BrandSlide layouts in the brand and neutral variants.",
  },
  {
    to: "/flex",
    title: "Flex",
    body: "Flex and FlexItem sizing demos — wrap, thirds, minor/major/fill, and column stretch.",
  },
  {
    to: "/button-migration",
    title: "Button Migration",
    body: "SDS → shadcn/Base UI: prop mapping, what ButtonGroup means now, where TriggerButton went, and href sniffing vs. the render prop.",
  },
];

export function HomePage() {
  return (
    <main>
      <Hero variant="brand" padding="1600">
        {/* No `href` — the component defaults to "/", which is where we
            already are, and it supplies its own "GMH Lab, home" label. */}
        <GmhLogo />
        <TextContentTitle
          align="center"
          title="gmhlab"
          subtitle="A reference app for the @gmhlab design-system stack — tokens, ui, and blocks. Pick a demo."
        />
      </Hero>

      <Section variant="subtle" padding="1600">
        <CardGrid container type="third" gap="600">
          {demos.map((demo) => (
            <FlexItem key={demo.to} size="minor">
              {/* react-router Link rather than Card's `interactionProps`: that
                  path renders a react-aria RACLink (a plain <a>), and since
                  neither app wires RouterProvider it would full-page-reload. */}
              <Link
                to={demo.to}
                className="group block h-full text-inherit no-underline"
              >
                <Card variant="stroke" padding="600" className="h-full">
                  <TextHeading>{demo.title}</TextHeading>
                  <Text>{demo.body}</Text>
                  <TextSmallStrong className="group-hover:underline">
                    View demo →
                  </TextSmallStrong>
                </Card>
              </Link>
            </FlexItem>
          ))}
        </CardGrid>
      </Section>
    </main>
  );
}
