import {
  Badge,
  Button,
  Card,
  CardGrid,
  Flex,
  FlexItem,
  Grid,
  Section,
  Text,
  TextContentHeading,
  TextHeading,
  TextLink,
  TextSmall,
  TextStrong,
  TextSubheading,
  TextTitlePage,
} from "@gmhlab/ui";
import "./innovation-detail-page.css";

/**
 * The `gw-innovation-detail-wireframe.html` mock (the EQUIP Platform detail
 * page) rebuilt on the @gmhlab/ui layouts, compositions and primitives — the
 * detail-level counterpart to `innovations-page.tsx`, which is the index.
 *
 * Same sections in the same order and the same copy as the wireframe. The
 * chrome comes from Section/Flex/CardGrid/Card and the colour, spacing and
 * type come from `--mfy-*` tokens instead of the wireframe's hardcoded
 * `#1a4d7c`/`#2d7ab8` palette.
 *
 * Page content only: the wireframe's nav bar and footer are deliberately
 * absent because the site header and footer belong to the consuming app's
 * layout (see `apps/web/src/app/layout.tsx`).
 *
 * Column ratios come from Flex's grid `type` rather than the wireframe's
 * pixel tracks, so they collapse on their own:
 *   - hero + map (`1fr / 400px`, `1fr / 360px`) -> `type="third"` with a
 *     `major`/`minor` FlexItem pair: 2/3 + 1/3 on desktop, stacked below.
 *   - process steps (4-up) -> `type="quarter"`: 4 / 2 / 1.
 *   - component + related cards (3-up) -> `type="third"`: 3 / 1.
 *
 * Everything this file adds on top of the design system lives in
 * `innovation-detail-page.css`, scoped under `.innovation-detail-page` so it
 * cannot leak into other consumers of @gmhlab/blocks/styles.css.
 */

type Stat = { value: string; label: string };
type ProcessStep = { heading: string; body: string };
type CoreComponent = { icon: string; heading: string; body: string };
type Country = { flag: string; name: string; partner: string };
type Publication = {
  journal: string;
  title: string;
  authors: string;
  year: string;
};
type RelatedProject = { heading: string; body: string };

const STATS: Stat[] = [
  { value: "25+", label: "Countries" },
  { value: "5K+", label: "Providers" },
  { value: "12", label: "Publications" },
];

const PROCESS: ProcessStep[] = [
  {
    heading: "Baseline Assessment",
    body: "Evaluate provider skills using standardized role-play scenarios and competency rubrics",
  },
  {
    heading: "Targeted Training",
    body: "Deliver focused skill-building based on identified competency gaps",
  },
  {
    heading: "Supervised Practice",
    body: "Support providers during real-world delivery with structured supervision",
  },
  {
    heading: "Ongoing Evaluation",
    body: "Continuously monitor competency and provide feedback for improvement",
  },
];

const COMPONENTS: CoreComponent[] = [
  {
    icon: "📋",
    heading: "Competency Assessment Tools",
    body: "Standardized rubrics and rating scales for evaluating counselor performance across key therapeutic competencies like empathy, collaboration, and behavioral activation techniques.",
  },
  {
    icon: "🎓",
    heading: "Training Curriculum",
    body: "Modular training materials adaptable to different interventions (PM+, IPT, behavioral activation) and cultural contexts. Includes facilitator guides and participant workbooks.",
  },
  {
    icon: "👥",
    heading: "Supervision Framework",
    body: "Structured supervision protocols for ongoing support, including group supervision models and individual feedback mechanisms for continuous quality improvement.",
  },
];

const COUNTRIES: Country[] = [
  { flag: "🇳🇵", name: "Nepal", partner: "TPO Nepal" },
  { flag: "🇺🇬", name: "Uganda", partner: "Makerere University" },
  { flag: "🇵🇰", name: "Pakistan", partner: "Shifa Tameer-e-Millat" },
  { flag: "🇱🇷", name: "Liberia", partner: "Carter Center" },
  { flag: "🇪🇹", name: "Ethiopia", partner: "Addis Ababa University" },
  { flag: "🇿🇦", name: "South Africa", partner: "Wits Health" },
];

const PUBLICATIONS: Publication[] = [
  {
    journal: "Lancet Psychiatry",
    title:
      "Competency-based training and supervision: development of the WHO-UNICEF EQUIP initiative",
    authors: "Kohrt BA, Pedersen GA, et al.",
    year: "2024",
  },
  {
    journal: "BJPsych Open",
    title:
      "Perspectives on competency-based feedback for training non-specialists to deliver psychological interventions",
    authors: "Elnasseh A, Mehta VS, et al.",
    year: "2024",
  },
  {
    journal: "Frontiers",
    title:
      "Integrating EQUIP competency-based training into a university curriculum: a qualitative inquiry at Makerere University",
    authors: "Ndeezi M, Pedersen GA, et al.",
    year: "2024",
  },
];

const RELATED: RelatedProject[] = [
  {
    heading: "EQUIP-SU",
    body: "Extends EQUIP to include service users (people with lived experience) in competency assessment and training.",
  },
  {
    heading: "RESHAPE",
    body: "Uses EQUIP methodology to train healthcare providers in stigma reduction interventions.",
  },
  {
    heading: "RESTORE",
    body: "World Bank-funded project using EQUIP to evaluate Self-Help Plus (SH+) delivery quality.",
  },
];

function Breadcrumb() {
  return (
    <Section
      className="innovation-detail-breadcrumb"
      variant="neutral"
      padding="400"
    >
      <nav aria-label="Breadcrumb">
        <Flex container alignSecondary="center" gap="200" wrap>
          <TextLink href="#">Home</TextLink>
          <TextSmall aria-hidden="true">›</TextSmall>
          <TextLink href="#">Innovations</TextLink>
          <TextSmall aria-hidden="true">›</TextSmall>
          <TextSmall>EQUIP Platform</TextSmall>
        </Flex>
      </nav>
    </Section>
  );
}

function HeroSection() {
  return (
    <Section variant="neutral" padding="1600">
      <Flex container type="third" gap="1200" wrap>
        <FlexItem size="major">
          <Flex direction="column" alignSecondary="stretch" gap="600">
            <Flex wrap gap="300">
              <Badge variant="info" className="innovation-detail-badge">
                WHO/UNICEF Partnership
              </Badge>
              <Badge variant="success" className="innovation-detail-badge">
                Active
              </Badge>
            </Flex>
            {/* TextTitlePage (3rem), not TextContentTitle — that resolves to
                TextTitleHero (4.5rem) on desktop, which is the index page's
                size. A detail page sits one level down. */}
            <Flex direction="column" alignSecondary="stretch" gap="200">
              <TextTitlePage>EQUIP Platform</TextTitlePage>
              <TextSubheading>
                Ensuring Quality in Psychological Support
              </TextSubheading>
            </Flex>
            <Text className="innovation-detail-hero-copy">
              EQUIP is a competency-based training and supervision system
              designed to ensure non-specialist providers can deliver
              high-quality psychological interventions. Developed in partnership
              with WHO and UNICEF, EQUIP standardizes how we assess, train, and
              support mental health workers in low-resource settings worldwide.
            </Text>
            <Flex wrap gap="400">
              <Button nativeButton={false} render={<a href="#" />}>
                Request Training →
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href="#" />}
              >
                Download Toolkit
              </Button>
            </Flex>
          </Flex>
        </FlexItem>
        <FlexItem size="minor">
          <Flex direction="column" alignSecondary="stretch" gap="400">
            <div className="innovation-detail-visual">
              <TextSmall>[ Platform Screenshot / Demo Video ]</TextSmall>
            </div>
            <Grid columns="repeat(3, 1fr)" gap="300">
              {STATS.map((stat) => (
                <div className="innovation-detail-stat" key={stat.label}>
                  <span className="innovation-detail-stat-value">
                    {stat.value}
                  </span>
                  <span className="innovation-detail-stat-label">
                    {stat.label}
                  </span>
                </div>
              ))}
            </Grid>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}

function HowItWorksSection() {
  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="How It Works"
          subheading="EQUIP uses a four-stage cycle to build and maintain provider competency"
        />
        <Flex type="quarter" gap="600" wrap>
          {PROCESS.map((step, index) => (
            /* FlexItem, not a bare Flex. flex.css computes each child's
               flex-basis *on the child*, and `var(--flex-gap)` in that calc
               resolves against the child's own cascade — so a `Flex gap="300"`
               here would subtract its own 12px gutter instead of the row's
               24px, leave every step 9px too wide, and wrap 4-up to two rows.
               `.flex-item` declares no --flex-gap, so it inherits the row's.
               `size="minor"` is required: the `--column-ratio` fallback rule
               is `> :not(.flex-item)`, so a size-less FlexItem gets none. */
            <FlexItem
              className="innovation-detail-step"
              key={step.heading}
              size="minor"
            >
              <Flex direction="column" alignSecondary="center" gap="300">
                <span
                  className="innovation-detail-step-number"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <TextStrong className="text-align-center">
                  {step.heading}
                </TextStrong>
                <TextSmall className="text-align-center">{step.body}</TextSmall>
              </Flex>
            </FlexItem>
          ))}
        </Flex>
      </Flex>
    </Section>
  );
}

function CoreComponentsSection() {
  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Core Components"
          subheading="The EQUIP system includes three integrated components"
        />
        <CardGrid type="third" gap="600">
          {COMPONENTS.map((component) => (
            <Card
              key={component.heading}
              variant="stroke"
              padding="800"
              asset={
                <span className="innovation-detail-icon" aria-hidden="true">
                  {component.icon}
                </span>
              }
            >
              <TextHeading>{component.heading}</TextHeading>
              <Text>{component.body}</Text>
            </Card>
          ))}
        </CardGrid>
      </Flex>
    </Section>
  );
}

function WhereItsUsedSection() {
  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Where It's Used"
          subheading="EQUIP has been implemented across 25+ countries in partnership with local organizations"
        />
        <Flex type="third" gap="1200" wrap>
          <FlexItem size="major">
            <div className="innovation-detail-map">
              <TextSmall>
                [ Interactive Map Showing Implementation Sites ]
              </TextSmall>
            </div>
          </FlexItem>
          <FlexItem size="minor">
            <div className="innovation-detail-countries">
              <div className="innovation-detail-countries-header">
                <TextStrong>Active Implementation Sites</TextStrong>
              </div>
              <ul className="innovation-detail-country-list">
                {COUNTRIES.map((country) => (
                  <li className="innovation-detail-country" key={country.name}>
                    <Flex
                      alignPrimary="space-between"
                      alignSecondary="center"
                      gap="400"
                    >
                      <Flex alignSecondary="center" gap="200">
                        <span
                          className="innovation-detail-flag"
                          aria-hidden="true"
                        >
                          {country.flag}
                        </span>
                        <Text>{country.name}</Text>
                      </Flex>
                      <TextSmall>{country.partner}</TextSmall>
                    </Flex>
                  </li>
                ))}
              </ul>
            </div>
          </FlexItem>
        </Flex>
      </Flex>
    </Section>
  );
}

function EvidenceBaseSection() {
  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Evidence Base"
          subheading="Peer-reviewed publications documenting EQUIP's development and effectiveness"
        />
        <Flex direction="column" alignSecondary="stretch" gap="400">
          {PUBLICATIONS.map((publication) => (
            <Card
              className="innovation-detail-publication"
              key={publication.title}
              variant="stroke"
              padding="600"
              direction="horizontal"
              asset={
                <span className="innovation-detail-journal" aria-hidden="true">
                  {publication.journal}
                </span>
              }
            >
              <Flex
                alignPrimary="space-between"
                alignSecondary="center"
                gap="400"
                wrap
              >
                <Flex
                  className="innovation-detail-publication-body"
                  direction="column"
                  gap="100"
                >
                  <TextStrong>{publication.title}</TextStrong>
                  <TextSmall>
                    {publication.authors} · {publication.year}
                  </TextSmall>
                </Flex>
                <TextLink href="#">View →</TextLink>
              </Flex>
            </Card>
          ))}
        </Flex>
        <Flex>
          <TextLink href="#">View all EQUIP publications →</TextLink>
        </Flex>
      </Flex>
    </Section>
  );
}

function RelatedProjectsSection() {
  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Related Projects"
          subheading="Research initiatives that use or build upon the EQUIP platform"
        />
        <CardGrid type="third" gap="600">
          {RELATED.map((project) => (
            <Card
              className="innovation-detail-related"
              key={project.heading}
              variant="stroke"
              padding="600"
            >
              <TextHeading>{project.heading}</TextHeading>
              <Text>{project.body}</Text>
              {/* Wrapped: `.card-content > *` is forced to width:100%, which
                  would stretch the link's hit area across the card. */}
              <Flex>
                <TextLink href="#">View Project →</TextLink>
              </Flex>
            </Card>
          ))}
        </CardGrid>
      </Flex>
    </Section>
  );
}

function CtaSection() {
  return (
    <Section variant="brand" padding="1600">
      <Flex
        container
        direction="column"
        alignPrimary="center"
        alignSecondary="center"
        gap="800"
      >
        <Flex direction="column" alignSecondary="center" gap="200">
          <TextTitlePage className="text-align-center">
            Implement EQUIP in Your Setting
          </TextTitlePage>
          {/* Only the paragraph is measure-capped — capping the wrapper would
              break the heading onto two lines. */}
          <TextSubheading className="innovation-detail-cta-copy text-align-center">
            We provide training, consultation, and implementation support for
            organizations looking to use EQUIP to improve mental health service
            quality.
          </TextSubheading>
        </Flex>
        <Flex wrap gap="400" alignPrimary="center">
          <Button
            variant="secondary"
            nativeButton={false}
            render={<a href="#" />}
          >
            Request Training
          </Button>
          <Button variant="outline" nativeButton={false} render={<a href="#" />}>
            Contact Us
          </Button>
        </Flex>
      </Flex>
    </Section>
  );
}

export function InnovationDetailPage() {
  return (
    <div className="innovation-detail-page">
      <Breadcrumb />
      <HeroSection />
      <HowItWorksSection />
      <CoreComponentsSection />
      <WhereItsUsedSection />
      <EvidenceBaseSection />
      <RelatedProjectsSection />
      <CtaSection />
    </div>
  );
}
