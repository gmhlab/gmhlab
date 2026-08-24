import type { ReactNode } from "react";
import { Link } from "react-router";
import {
  AllProviders,
  FAQs,
  PanelSections,
  PricingGrid,
  ProductDetails,
  ProductGrid,
  SlideFooter,
  SlideHeader,
  WelcomeHero,
} from "@gmhlab/blocks";
import {
  Badge,
  Button,
  Card,
  Flex,
  FlexItem,
  GmhLogo,
  Hero,
  Section,
  Text,
  TextCode,
  TextContentHeading,
  TextContentTitle,
  TextEmphasis,
  TextHeading,
  TextSmall,
  TextSmallStrong,
  TextStrong,
  TextSubheading,
} from "@gmhlab/ui";

/**
 * The `@gmhlab/blocks` reference page — the sibling of `ComponentsPage`, which
 * covers `@gmhlab/ui`.
 *
 * The package splits into two kinds of export and the split is the thing worth
 * understanding, so the page is organised around it rather than around a flat
 * list of components:
 *
 *   - **Examples** carry their own hardcoded content and take no props. They
 *     are the MonoFly marketing page, rendered live below.
 *   - **Page blocks** name nothing and take their records as props. They can
 *     only be demonstrated with a corpus, so the live demos live on their own
 *     routes, driven by the synthetic one in `src/fixtures/sample-content.ts`.
 *
 * Keep the counts and the export lists here in step with the package barrels
 * (the `index.ts` in each group under `packages/blocks/src`) — this page
 * claims to be exhaustive.
 */

const SECTIONS = [
  { id: "shape", label: "Package shape" },
  { id: "page-blocks", label: "Page blocks" },
  { id: "records", label: "Record-driven" },
  { id: "examples", label: "Examples" },
  { id: "slides", label: "Slides" },
  { id: "data", label: "Data layer" },
];

/** The six export groups, in barrel order. */
const GROUPS = [
  {
    name: "examples/",
    blurb:
      "The demo sections that make up the MonoFly marketing page in apps/web. No props, hardcoded content — that is what separates them from the page blocks.",
    exports: [
      "WelcomeHero",
      "PanelSections",
      "FAQs",
      "ProductDetails",
      "PricingGrid",
      "ProductGrid",
    ],
  },
  {
    name: "projects/",
    blurb:
      "The projects index and a protocol-shaped detail page, plus the record contracts and the pure helpers that read them.",
    exports: [
      "ProjectsPage",
      "ProjectDetailPage",
      "projectSearchText",
      "resolveProjectPublications",
      "resolveRelatedProjects",
    ],
  },
  {
    name: "publications/",
    blurb:
      "A faceted bibliography index, plus the reference resolver the two detail pages use to turn slugs into real citations.",
    exports: [
      "PublicationsPage",
      "publicationSearchText",
      "resolvePublicationRefs",
    ],
  },
  {
    name: "innovations/",
    blurb:
      "The innovations index and its detail page — the same shape as projects, for the things a centre builds and hands to other people.",
    exports: ["InnovationsPage", "InnovationDetailPage"],
  },
  {
    name: "slides/",
    blurb:
      "Full-bleed presentation layouts with co-located CSS. Rendered on their own route so they get the whole viewport.",
    exports: ["BrandSlide", "SlideHeader", "SlideFooter"],
  },
  {
    name: "data/",
    blurb:
      "The SDS-style mock data layer: auth/pricing/products contexts, their providers, hooks and mock services. This is what the two data-bound examples read.",
    exports: [
      "AllProviders",
      "AuthProvider",
      "PricingProvider",
      "ProductsProvider",
      "useAuth",
      "usePricing",
      "useProducts",
    ],
  },
];

/** One live demo route, with the props its wrapper passes. */
const PAGE_BLOCKS = [
  {
    to: "/blocks/projects",
    name: "ProjectsPage",
    blurb:
      "Faceted portfolio index: search, status and region chips, a featured spotlight, and a stat strip — all derived from the records prop in a memo, never at module scope.",
    props: "projects, featuredSlug, regions, partners, heroImage, basePath",
  },
  {
    to: "/blocks/projects/harbour",
    name: "ProjectDetailPage",
    blurb:
      "One record, rendered as a study protocol: arms, ranked objectives with their instruments, a two-track assessment schedule, eligibility, and resolved evidence. Every section is conditional on its data.",
    props: "detail, projects, publications, detailSlugs, basePath",
  },
  {
    to: "/blocks/publications",
    name: "PublicationsPage",
    blurb:
      "The bibliography index: full-text search, year/theme/project facets, an open-access toggle, sort, and paging.",
    props: "publications, themes, heroImage, projectsHref, contactEmail",
  },
  {
    to: "/blocks/innovations",
    name: "InnovationsPage",
    blurb:
      "The innovations index. A card links only when its slug appears in detailSlugs, so an index with one detail record ships no 404s.",
    props: "innovations, detailSlugs, partners, heroImage, basePath",
  },
  {
    to: "/blocks/innovations/atlas",
    name: "InnovationDetailPage",
    blurb:
      "The adoption-shaped sibling of the project detail page: what it is, how it works, who runs it, what the evidence is, how to adopt it.",
    props: "detail, publications, basePath, indexLabel, homeHref",
  },
];

/* ————— page scaffolding, matching ComponentsPage ————— */

function Demo({
  id,
  title,
  description,
  variant = "subtle",
  bleed = false,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  variant?: "subtle" | "neutral";
  bleed?: boolean;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <Section
        variant={variant}
        paddingTop="1600"
        paddingBottom={bleed ? "800" : "1600"}
      >
        <Flex container direction="column" gap="1200" alignSecondary="stretch">
          <TextContentHeading heading={title} subheading={description} />
          {bleed ? null : (
            <Flex direction="column" gap="800" alignSecondary="stretch">
              {children}
            </Flex>
          )}
        </Flex>
      </Section>
      {bleed ? children : null}
    </div>
  );
}

/** Full-bleed specimens get a caption rather than a Card wrapper. */
function BleedSpec({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <Flex direction="column" gap="400" alignSecondary="stretch">
      <Section variant="subtle" paddingTop="0" paddingBottom="0">
        <Flex container direction="column" gap="200">
          <Flex gap="200" alignSecondary="center" wrap>
            <TextCode>{label}</TextCode>
          </Flex>
          {note ? <TextSmall>{note}</TextSmall> : null}
        </Flex>
      </Section>
      {children}
    </Flex>
  );
}

export function BlocksPage() {
  return (
    <main>
      <Hero variant="brand" padding="1600">
        <GmhLogo />
        <TextContentTitle
          align="center"
          title="Blocks"
          subtitle="Everything exported from @gmhlab/blocks — the composed sections built on @gmhlab/ui, and the record-driven page renderers the GW site runs on."
        />
        <Flex gap="300" alignPrimary="center" wrap>
          <Badge variant="secondary">6 export groups</Badge>
          <Badge variant="outline">press d for dark mode</Badge>
        </Flex>
      </Hero>

      {/* Sticky section nav — a plain div, since `.section` sets
          `position: relative` and would race a Tailwind `sticky` utility at
          equal specificity. */}
      <div className="sticky top-14 z-40">
        <Section variant="neutral" padding="400">
          <Flex container>
            <div className="w-full min-w-0 overflow-x-auto">
              <Flex gap="100" alignSecondary="center" className="w-max">
                {SECTIONS.map((section) => (
                  <Button
                    key={section.id}
                    size="sm"
                    variant="ghost"
                    nativeButton={false}
                    render={<a href={`#${section.id}`} />}
                  >
                    {section.label}
                  </Button>
                ))}
              </Flex>
            </div>
          </Flex>
        </Section>
      </div>

      {/* ————— package shape ————— */}

      <Demo
        id="shape"
        title="Package shape"
        description="src/ groups, all six re-exported from the barrel. Build order is tokens → ui → blocks, and blocks externals react, @gmhlab/ui and @gmhlab/tokens so they resolve from the consumer."
      >
        <Flex type="half" wrap gap="600" alignSecondary="stretch">
          {GROUPS.map((group) => (
            <FlexItem key={group.name} size="minor">
              <Card variant="stroke" padding="600" className="h-full">
                <Flex gap="200" alignSecondary="center" wrap>
                  <TextCode>{group.name}</TextCode>
                </Flex>
                <Text>{group.blurb}</Text>
                <Flex gap="200" wrap>
                  {group.exports.map((name) => (
                    <Badge key={name} variant="outline">
                      {name}
                    </Badge>
                  ))}
                </Flex>
              </Card>
            </FlexItem>
          ))}
        </Flex>

        <Card variant="stroke" padding="600">
          <TextSubheading>The bundle carries a "use client" banner</TextSubheading>
          <Text>
            tsup prepends it to the whole bundle, which is why the providers and
            the stateful page blocks drop straight into a Next.js App Router
            server layout without a wrapper of their own.
          </Text>
        </Card>
      </Demo>

      {/* ————— page blocks ————— */}

      <Demo
        id="page-blocks"
        variant="neutral"
        title="Page blocks"
        description="Five full-page renderers. Each demo below is driven by the synthetic corpus in src/fixtures/sample-content.ts — an invented institute, so the blocks are shown naming nothing."
      >
        <Flex type="half" wrap gap="600" alignSecondary="stretch">
          {PAGE_BLOCKS.map((block) => (
            <FlexItem key={block.to} size="minor">
              {/* react-router Link rather than Card's `interactionProps`: that
                  path renders a react-aria RACLink (a plain <a>), and since
                  neither app wires RouterProvider it would full-page-reload. */}
              <Link
                to={block.to}
                className="group block h-full text-inherit no-underline"
              >
                <Card variant="stroke" padding="600" className="h-full">
                  <Flex gap="200" alignSecondary="center" wrap>
                    <TextCode>{block.name}</TextCode>
                  </Flex>
                  <Text>{block.blurb}</Text>
                  <TextSmall>
                    <TextStrong>Props: </TextStrong>
                    {block.props}
                  </TextSmall>
                  <TextSmallStrong className="group-hover:underline">
                    View live demo →
                  </TextSmallStrong>
                </Card>
              </Link>
            </FlexItem>
          ))}
        </Flex>

        <Card variant="stroke" padding="600">
          <TextSubheading>Page content only</TextSubheading>
          <Text>
            None of these render a header or a footer — the site chrome belongs
            to the app that mounts them. The demo routes below sit inside this
            app's own shell for exactly that reason.
          </Text>
        </Card>
      </Demo>

      {/* ————— the record-driven convention ————— */}

      <Demo
        id="records"
        title="Why they take records as props"
        description="@gmhlab/blocks is published publicly, and one organization's portfolio and bibliography are not library code. The records live in the consuming app — apps/web/src/content/ for the GW site, src/fixtures/ here."
      >
        <Flex type="half" wrap gap="600" alignSecondary="stretch">
          <FlexItem size="minor">
            <Card variant="stroke" padding="600" className="h-full">
              <TextHeading>Three files per page</TextHeading>
              <Text>
                A renderer, a co-located stylesheet scoped under a page-level
                class, and a types module holding the contract — the record
                types plus the pure helpers that read them. All are exported,
                so the consuming app writes its records against them.
              </Text>
            </Card>
          </FlexItem>
          <FlexItem size="minor">
            <Card variant="stroke" padding="600" className="h-full">
              <TextHeading>Links are props, not constants</TextHeading>
              <Text>
                <TextCode>basePath</TextCode> builds every detail href, and
                cross-page CTAs take their own prop. The demos below pass{" "}
                <TextCode>/blocks/projects</TextCode> rather than{" "}
                <TextCode>/projects</TextCode> — the same blocks apps/web mounts
                at the root, mounted a level down.
              </Text>
            </Card>
          </FlexItem>
          <FlexItem size="minor">
            <Card variant="stroke" padding="600" className="h-full">
              <TextHeading>References resolve at render time</TextHeading>
              <Text>
                Detail records store publication <TextCode>slug</TextCode>s, not
                restated citations, so journal, DOI and citation count come from
                the bibliography. Unknown slugs are dropped — the fixture
                includes one on purpose, so the HARBOUR evidence list is one row
                shorter than its record.
              </Text>
            </Card>
          </FlexItem>
          <FlexItem size="minor">
            <Card variant="stroke" padding="600" className="h-full">
              <TextHeading>Facets can't lie</TextHeading>
              <Text>
                Counts are computed against the <TextEmphasis>other</TextEmphasis> active
                facets, never the whole set, and zero-count options render
                disabled — so a chip can never advertise a number and land on an
                empty list. The active option stays enabled, so a filter is
                always reversible.
              </Text>
            </Card>
          </FlexItem>
        </Flex>
      </Demo>

      {/* ————— examples ————— */}

      <Demo
        id="examples"
        variant="neutral"
        bleed
        title="Examples"
        description="The MonoFly marketing page, section by section. These take no props and carry their own content; the last two read the mock data layer, so they are wrapped in AllProviders here exactly as apps/web wraps its own tree."
      >
        <Flex direction="column" gap="1200" alignSecondary="stretch">
          <BleedSpec label="<WelcomeHero />">
            <WelcomeHero />
          </BleedSpec>

          <BleedSpec label="<PanelSections />">
            <PanelSections />
          </BleedSpec>

          <BleedSpec label="<ProductDetails />">
            <ProductDetails />
          </BleedSpec>

          <BleedSpec label="<FAQs />">
            <FAQs />
          </BleedSpec>

          {/* One provider tree around both: AllProviders renders no DOM, so it
              cannot disturb the section stack. */}
          <AllProviders>
            <Flex direction="column" gap="1200" alignSecondary="stretch">
              <BleedSpec
                label="<PricingGrid />"
                note="Data-bound — reads usePricing(). The monthly/annual toggle and the skeleton state come from the mock service."
              >
                <PricingGrid />
              </BleedSpec>

              <BleedSpec
                label="<ProductGrid />"
                note="Data-bound — reads useProducts()."
              >
                <ProductGrid />
              </BleedSpec>
            </Flex>
          </AllProviders>
        </Flex>
      </Demo>

      {/* ————— slides ————— */}

      <Demo
        id="slides"
        title="Slides"
        description="Presentation layouts. BrandSlide is full-bleed and wants the whole viewport, so it has its own route; its two chrome pieces are shown here."
      >
        <Card variant="stroke" padding="600">
          <Flex gap="200" alignSecondary="center" wrap>
            <TextCode>{"<SlideHeader />"}</TextCode>
          </Flex>
          <SlideHeader start="VERSION 2.0" center="©2026 GMH LAB" end="PAGE 02" />
        </Card>

        <Card variant="stroke" padding="600">
          <Flex gap="200" alignSecondary="center" wrap>
            <TextCode>{"<SlideFooter />"}</TextCode>
          </Flex>
          <SlideFooter start="GMH LAB" center="BLOCKS" end="BRAND IDENTITY" />
        </Card>

        <Flex gap="300" wrap>
          <Button
            variant="secondary"
            nativeButton={false}
            render={<a href="/slides" />}
          >
            Full BrandSlide layouts →
          </Button>
        </Flex>
      </Demo>

      {/* ————— data layer ————— */}

      <Demo
        id="data"
        variant="neutral"
        title="Data layer"
        description="Mock contexts, providers, hooks and services. Domain types like Product and PricingPlan live in @gmhlab/ui — the cards compositions need them — and this layer re-exports them alongside its own context types."
      >
        <Card variant="stroke" padding="600">
          <TextSubheading>AllProviders renders no DOM</TextSubheading>
          <Text>
            It is only nested context providers, which is what lets a consuming
            app wrap its whole tree without the header, main and footer losing
            their place as the body's own flex children. That is load-bearing in
            apps/web: it is why the ui Footer's <TextCode>margin-top: auto</TextCode>{" "}
            actually pins to the bottom.
          </Text>
        </Card>
      </Demo>
    </main>
  );
}
