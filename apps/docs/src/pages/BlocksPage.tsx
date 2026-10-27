import type { ReactNode } from "react";
import { Link } from "react-router";
import { SlideFooter, SlideHeader } from "@gmhlab/blocks";
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
 * Almost everything in the package is a **page block**: it names nothing and
 * takes its records — and its copy — as props. A block can only be
 * demonstrated with a corpus, so the live demos live on their own routes,
 * driven by the synthetic one in `src/fixtures/sample-content.ts`. The rest is
 * slides.
 *
 * Keep the counts and the export lists here in step with the package barrels
 * (the `index.ts` in each group under `packages/blocks/src`) — this page
 * claims to be exhaustive.
 */

const SECTIONS = [
  { id: "shape", label: "Package shape" },
  { id: "page-blocks", label: "Page blocks" },
  { id: "records", label: "Record-driven" },
  { id: "slides", label: "Slides" },
];

/** The eight export groups. */
const GROUPS = [
  {
    name: "home/",
    blurb:
      "The record-driven landing page: one HomeContent record in, every section after the hero and stats optional.",
    exports: ["HomePage"],
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
    name: "team/",
    blurb:
      "The team page, and the People strip the two detail pages reuse — one person format, bios that expand in place, publications resolved by exact author name.",
    exports: ["TeamPage", "PeopleSection", "projectPeople"],
  },
  {
    name: "contact/",
    blurb:
      "A contact page that pitches: a care notice with crisis lines, one card per inquiry route, and the form — exported separately, since the page takes it as a slot rather than a send function.",
    exports: ["ContactPage", "ContactForm", "contactMailto"],
  },
  {
    name: "shared/",
    blurb:
      "The copy contracts every page block takes its voice through, and the GW Center's default copy. Omit a copy prop for the Center's wording, pass your own, or null to drop it.",
    exports: [
      "PageCta",
      "PageAction",
      "GMH_PROJECTS_COPY",
      "GMH_PUBLICATIONS_COPY",
      "GMH_INNOVATIONS_COPY",
      "GMH_CONTACT_COPY",
      "gmhProjectDetailCta",
      "GMH_CONTACT_EMAIL",
    ],
  },
  {
    name: "slides/",
    blurb:
      "Full-bleed presentation layouts with co-located CSS. Rendered on their own route so they get the whole viewport.",
    exports: ["BrandSlide", "SlideHeader", "SlideFooter"],
  },
];

/** One live demo route, with the props its wrapper passes. */
const PAGE_BLOCKS = [
  {
    to: "/blocks/home",
    name: "HomePage",
    blurb:
      "A landing page after the GW reference design: hero, counting stats, the care-gap figure, duotone cards, pull quote, partners, CTA. One record; every section after the stats is optional.",
    props: "content",
  },
  {
    to: "/blocks/projects",
    name: "ProjectsPage",
    blurb:
      "Faceted portfolio index: search, status and region chips, a featured spotlight, and a stat strip — all derived from the records prop in a memo, never at module scope.",
    props: "projects, featuredSlug, regions, partners, heroImage, basePath, title, subtitle, partnersSubheading, cta",
  },
  {
    to: "/blocks/projects/harbour",
    name: "ProjectDetailPage",
    blurb:
      "One record, rendered as a study protocol: arms, ranked objectives with their instruments, a two-track assessment schedule, eligibility, and resolved evidence. Every section is conditional on its data.",
    props: "detail, projects, publications, people, detailSlugs, basePath, teamHref",
  },
  {
    to: "/blocks/publications",
    name: "PublicationsPage",
    blurb:
      "The bibliography index: full-text search, year/theme/project facets, an open-access toggle, sort, and paging.",
    props: "publications, themes, heroImage, title, subtitle, note, centerBadge, cta",
  },
  {
    to: "/blocks/innovations",
    name: "InnovationsPage",
    blurb:
      "The innovations index. A card links only when its slug appears in detailSlugs, so an index with one detail record ships no 404s.",
    props: "innovations, detailSlugs, partners, heroImage, basePath, title, subtitle, listHeading, listSubheading, cta",
  },
  {
    to: "/blocks/innovations/atlas",
    name: "InnovationDetailPage",
    blurb:
      "The adoption-shaped sibling of the project detail page: what it is, how it works, who runs it, what the evidence is, how to adopt it.",
    props: "detail, publications, people, basePath, indexLabel, homeHref, teamHref",
  },
  {
    to: "/blocks/team",
    name: "TeamPage",
    blurb:
      "Core team, affiliates, students and alumni in one person format. Bios expand in place; project tags filter the page, and the same records give the detail pages their People section.",
    props: "people, projects, publications, detailSlugs, heroImage, projectsBasePath, title, subtitle, cta",
  },
  {
    to: "/blocks/contact",
    name: "ContactPage",
    blurb:
      "Contact as a pitch: the care notice first, one card per inquiry route, then the form. Cards and form share the chosen route; ?topic= deep links it.",
    props: "topics, form, location, email, replyTime, careNotice, heroImage, title, subtitle, topicsEyebrow, topicsHeading, topicsSubheading",
  },
];

/* ————— page scaffolding, matching ComponentsPage ————— */

function Demo({
  id,
  title,
  description,
  variant = "subtle",
  children,
}: {
  id: string;
  title: string;
  description?: string;
  variant?: "subtle" | "neutral";
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <Section variant={variant} padding="1600">
        <Flex container direction="column" gap="1200" alignSecondary="stretch">
          <TextContentHeading heading={title} subheading={description} />
          <Flex direction="column" gap="800" alignSecondary="stretch">
            {children}
          </Flex>
        </Flex>
      </Section>
    </div>
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
          subtitle="Everything exported from @gmhlab/blocks — the record-driven page renderers the GW site runs on, and the slide layouts."
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
        description="src/ groups, all eight re-exported from the barrel. Build order is tokens → core → data → ui → blocks, and blocks externals react and every @gmhlab package it uses so they resolve from the consumer."
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
            tsup prepends it to the whole bundle, which is why the stateful page
            blocks drop straight into a Next.js App Router server page without a
            wrapper of their own.
          </Text>
        </Card>
      </Demo>

      {/* ————— page blocks ————— */}

      <Demo
        id="page-blocks"
        variant="neutral"
        title="Page blocks"
        description="Six full-page renderers. Each demo below is driven by the synthetic corpus in src/fixtures/sample-content.ts — an invented institute, so the blocks are shown naming nothing."
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
              <TextHeading>Links and copy are props, not constants</TextHeading>
              <Text>
                <TextCode>basePath</TextCode> builds every detail href. Copy
                defaults to the GW Center's own (<TextCode>GMH_*_COPY</TextCode>),
                so adopters can see whose work they are building on — pass your
                own to replace it, or <TextCode>null</TextCode> to drop a
                section. The invented institute below overrides all of it. The
                demos pass{" "}
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

    </main>
  );
}
