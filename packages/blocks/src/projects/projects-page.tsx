import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardGrid,
  Flex,
  FlexItem,
  Hero,
  Input,
  Section,
  Text,
  TextContentHeading,
  TextContentTitle,
  TextHeading,
  TextLink,
  TextSmall,
  TextStrong,
  TextSubheading,
  TextTitlePage,
} from "@gmhlab/ui";
import {
  projectSearchText,
  type Project,
  type ProjectRegion,
  type ProjectStatus,
} from "./projects-types";
import "./projects-page.css";

/**
 * The GW Center for Global Mental Health projects index, rebuilt on the
 * @gmhlab/ui layouts, compositions and primitives — the sibling of
 * `innovations-page.tsx`, which is the same treatment for Innovations.
 *
 * The source page is eleven logo/title/tagline tiles, a "Filter by:" heading
 * with no control beneath it, and nothing else. Every project reads as an
 * unrelated tile, and the only way to learn anything is to open eleven pages.
 * This rebuild keeps the same eleven projects and their copy, and adds the
 * structure that makes a portfolio legible — all of it derived from the
 * Center's own project pages (see the consuming app's `projects-data.ts`),
 * none of it invented:
 *
 *   - **Faceted filtering that works.** Free-text search over every field,
 *     plus status and region facets. Counts are computed against the *other*
 *     active facets, so a shown count can never be a dead end.
 *   - **The portfolio's spine, made visible.** RECOUP-NY, RESTORE and EQUIP-SU
 *     each list EQUIP in their own Resources panel, so EQUIP is featured and
 *     the dependents are named. Nothing on the source page reveals this.
 *   - **Shared methods surfaced.** Problem Management Plus runs through two
 *     projects and photo narrative stigma reduction through two more.
 *   - **Scannable cards**: status, study design, funder, geography and
 *     publication count, so the grid answers questions without navigation.
 *
 * Page content only: the site header and footer belong to the consuming app's
 * layout (see `apps/web/src/app/layout.tsx`).
 *
 * Everything this file adds on top of the design system lives in
 * `projects-page.css`, scoped under `.projects-page` so it cannot leak into
 * other consumers of @gmhlab/blocks/styles.css.
 */

type StatusFilter = ProjectStatus | "all";
type RegionFilter = ProjectRegion | "all";

/** Badge tone per status. `closed` is neutral, not `warning` — a finished
 *  enrollment is a completed state, not a problem to flag. */
const STATUS_META: Record<
  ProjectStatus,
  { label: string; tone: "success" | "info" | "secondary" }
> = {
  active: { label: "Active enrollment", tone: "success" },
  ongoing: { label: "Ongoing", tone: "info" },
  closed: { label: "Enrollment closed", tone: "secondary" },
};

const STATUS_ORDER: ProjectStatus[] = ["active", "ongoing", "closed"];

/* Stable identities for the optional list props: a fresh `[]` default on every
   render would land in the filter memo's dep array and defeat it. */
const NO_REGIONS: ProjectRegion[] = [];
const NO_PARTNERS: string[] = [];

const matchesQuery = (
  project: Project,
  query: string,
  index: Map<string, string>,
) => !query || (index.get(project.slug) ?? "").includes(query);
const matchesStatus = (project: Project, status: StatusFilter) =>
  status === "all" || project.status === status;
const matchesRegion = (project: Project, region: RegionFilter) =>
  region === "all" || !!project.regions?.includes(region);

type FacetOption<T> = { value: T; label: string; count: number };

function Facet<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FacetOption<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <Flex
      className="projects-facet"
      role="group"
      aria-label={`Filter by ${label.toLowerCase()}`}
      wrap
      alignSecondary="center"
      gap="200"
    >
      {/* aria-hidden: the group's aria-label already names the facet, so
          exposing this too would read the purpose twice. */}
      <TextSmall className="projects-facet-label" aria-hidden="true">
        {label}
      </TextSmall>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Button
            key={option.value}
            size="sm"
            variant={selected ? "default" : "outline"}
            aria-pressed={selected}
            // A zero-count option is a dead end; leave the active one
            // enabled so a filter is always reversible from the control.
            disabled={option.count === 0 && !selected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            <span className="projects-facet-count">{option.count}</span>
          </Button>
        );
      })}
    </Flex>
  );
}

function ProjectCard({ project, href }: { project: Project; href: string }) {
  const status = STATUS_META[project.status];
  return (
    <Card
      className={`project-card project-card-status-${project.status}`}
      variant="stroke"
      padding="800"
      // The whole card is the target. The source page's click target is the
      // words "Learn More" alone; an eleven-card directory wants the card.
      interactionProps={{
        href,
        "aria-label": `${project.name}: ${project.tagline}`,
      }}
    >
      {/* Wrapped: `.card-content > *` is forced to width:100%, which would
          stretch the pill across the card. */}
      <Flex alignPrimary="space-between" alignSecondary="center" gap="400" wrap>
        <Badge variant={status.tone} className="project-status">
          {status.label}
        </Badge>
        <TextSmall className="project-design">{project.design}</TextSmall>
      </Flex>

      <Flex direction="column" alignSecondary="stretch" gap="100">
        <TextHeading>{project.name}</TextHeading>
        <TextSubheading className="project-tagline">
          {project.tagline}
        </TextSubheading>
      </Flex>

      {/* Clamped so cards in a row keep a common rhythm; the abstracts run to
          very different lengths. */}
      <Text lineClamp={4}>{project.summary}</Text>

      <dl className="project-meta">
        {project.method && (
          <>
            <dt>Method</dt>
            <dd>{project.method}</dd>
          </>
        )}
        {project.locations && (
          <>
            <dt>Where</dt>
            <dd>{project.locations.join(" · ")}</dd>
          </>
        )}
        {project.funder && (
          <>
            <dt>Funder</dt>
            <dd>{project.funder}</dd>
          </>
        )}
        {project.publications > 0 && (
          <>
            <dt>Publications</dt>
            <dd>{project.publications}</dd>
          </>
        )}
      </dl>

      <Flex
        className="project-card-footer"
        alignPrimary="space-between"
        alignSecondary="center"
        gap="400"
        wrap
      >
        {/* Decorative: the affordance for the card-wide link above, which
            already carries the accessible name. */}
        <TextSmall className="project-card-cta" aria-hidden="true">
          Learn more <span className="project-card-arrow">→</span>
        </TextSmall>
        {project.buildsOn && (
          <TextSmall className="project-buildson">
            Builds on {project.buildsOn}
          </TextSmall>
        )}
      </Flex>
    </Card>
  );
}

/**
 * Brand band — the first content section under the hero, skipping the toolbar.
 * Note it only appears in the unfiltered view: once the reader filters, the
 * grid follows the toolbar directly and no brand band shows.
 */
function Spotlight({
  project,
  dependents,
  basePath,
}: {
  project: Project;
  /** Projects that name this one in their own Resources panel. */
  dependents: Project[];
  basePath: string;
}) {
  return (
    <Section
      className="projects-spotlight-section"
      variant="brand"
      padding="1200"
    >
      <Flex container direction="column" alignSecondary="stretch" gap="400">
        <TextSmall className="projects-spotlight-eyebrow">
          The platform the portfolio builds on
        </TextSmall>
        {/* Deliberately not `interactionProps`: the aside lists the dependent
            projects as real links, and a card-wide overlay anchor would
            swallow every one of them. */}
        {/* `default` here is only a base — `.projects-spotlight` repaints it as
            a brand-secondary tint so it reads as a raised panel *of the brand
            family* rather than a plain white card on navy. Card has no
            brand-secondary variant, hence the CSS override. */}
        <Card className="projects-spotlight" variant="default" padding="800">
          <Flex type="third" gap="1200" wrap alignSecondary="stretch">
            <FlexItem size="major">
              <Flex direction="column" alignSecondary="stretch" gap="400">
                <Flex wrap gap="200">
                  <Badge variant="secondary">
                    {STATUS_META[project.status].label}
                  </Badge>
                </Flex>
                <Flex direction="column" alignSecondary="stretch" gap="100">
                  <TextTitlePage>{project.name}</TextTitlePage>
                  <TextSubheading>{project.tagline}</TextSubheading>
                </Flex>
                <Text>{project.summary}</Text>
                <Flex wrap gap="400">
                  {/* `default`, not `secondary`: the card is a light panel
                      now, so the primary action wants the solid brand fill. */}
                  <Button
                    nativeButton={false}
                    render={<a href={`${basePath}/${project.slug}`} />}
                  >
                    Explore {project.name} →
                  </Button>
                </Flex>
              </Flex>
            </FlexItem>
            <FlexItem size="minor">
              <div className="projects-spotlight-aside">
                <TextStrong>Projects built on {project.name}</TextStrong>
                <ul className="projects-spotlight-list">
                  {dependents.map((dependent) => (
                    <li key={dependent.slug}>
                      <TextLink href={`${basePath}/${dependent.slug}`}>
                        {dependent.name}
                      </TextLink>
                      <TextSmall>{dependent.tagline}</TextSmall>
                    </li>
                  ))}
                </ul>
              </div>
            </FlexItem>
          </Flex>
        </Card>
      </Flex>
    </Section>
  );
}

export type ProjectsPageProps = {
  /** The portfolio to render. Supplied by the consuming app. */
  projects: Project[];
  /** Slug of the project given its own spotlight above the grid. */
  featuredSlug?: string;
  /** Funder and partner word marks. Omit to render no partner strip. */
  partners?: string[];
  /** Region facet order. Omit to show only the "All" chip. */
  regions?: ProjectRegion[];
  /** Hero background image. Required: the hero is an image variant. */
  heroImage: string;
  /**
   * Base path project links are built from, so the block travels with the
   * site that hosts it instead of hardcoding a domain.
   */
  basePath?: string;
  /** Where the "all publications" CTA points. */
  publicationsHref?: string;
  /** Where the CTA sends collaboration enquiries. */
  contactEmail?: string;
};

export function ProjectsPage({
  projects,
  featuredSlug,
  partners = NO_PARTNERS,
  regions = NO_REGIONS,
  heroImage,
  basePath = "/projects",
  publicationsHref = "/publications",
  contactEmail = "info@gwglobalmentalhealth.com",
}: ProjectsPageProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");

  /* Derived from the portfolio, not from the filters: re-deriving the haystack
     on every keystroke would be pure waste. */
  const searchIndex = useMemo(
    () => new Map(projects.map((p) => [p.slug, projectSearchText(p)])),
    [projects],
  );

  const featured = useMemo(
    () => projects.find((p) => p.slug === featuredSlug),
    [projects, featuredSlug],
  );

  /** Projects that name the featured project in their own Resources panel. */
  const dependents = useMemo(
    () => projects.filter((p) => p.buildsOn === featured?.name),
    [projects, featured],
  );

  const stats = useMemo(
    () => [
      { value: String(projects.length), label: "Projects" },
      {
        value: String(projects.filter((p) => p.status !== "closed").length),
        label: "Open or ongoing",
      },
      {
        value: String(projects.reduce((total, p) => total + p.publications, 0)),
        label: "Peer-reviewed publications",
      },
    ],
    [projects],
  );

  const normalisedQuery = query.trim().toLowerCase();
  const isFiltered =
    normalisedQuery !== "" || status !== "all" || region !== "all";

  const { visible, statusOptions, regionOptions } = useMemo(() => {
    const visible = projects.filter(
      (p) =>
        matchesQuery(p, normalisedQuery, searchIndex) &&
        matchesStatus(p, status) &&
        matchesRegion(p, region),
    );

    // Each facet counts against the *other* active facets, never against the
    // whole portfolio — otherwise a chip can advertise "6" and land on an
    // empty grid once the region filter is also applied.
    const statusOptions: FacetOption<StatusFilter>[] = [
      { value: "all" as const, label: "All" },
      ...STATUS_ORDER.map((value) => ({
        value,
        label: STATUS_META[value].label,
      })),
    ].map((option) => ({
      ...option,
      count: projects.filter(
        (p) =>
          matchesQuery(p, normalisedQuery, searchIndex) &&
          matchesRegion(p, region) &&
          matchesStatus(p, option.value),
      ).length,
    }));

    const regionOptions: FacetOption<RegionFilter>[] = [
      { value: "all" as const, label: "All" },
      ...regions.map((value) => ({ value, label: value })),
    ].map((option) => ({
      ...option,
      count: projects.filter(
        (p) =>
          matchesQuery(p, normalisedQuery, searchIndex) &&
          matchesStatus(p, status) &&
          matchesRegion(p, option.value),
      ).length,
    }));

    return { visible, statusOptions, regionOptions };
  }, [normalisedQuery, status, region, projects, searchIndex, regions]);

  const clearAll = () => {
    setQuery("");
    setStatus("all");
    setRegion("all");
  };

  // The spotlight is the unfiltered view's editorial lead. Once the reader is
  // filtering they have asked a specific question, so the grid answers it
  // without a fixed card at the top — and EQUIP rejoins the grid.
  const showSpotlight = !isFiltered && featured !== undefined;
  const gridProjects = showSpotlight
    ? visible.filter((p) => p.slug !== featuredSlug)
    : visible;

  return (
    <div className="projects-page">
      <Hero
        variant="image"
        src={heroImage}
        paddingBottom="800"
        flexProps={{ direction: "column", alignSecondary: "start", gap: "1200" }}
      >
        <TextContentTitle
          title="Projects"
          subtitle="Research and implementation initiatives building mental health care that works where specialists are scarce — from cluster-randomized trials to a global training platform."
        />
        <Flex className="projects-stats" wrap gap="1200">
          {stats.map((stat) => (
            <div className="projects-stat" key={stat.label}>
              <span className="projects-stat-value">{stat.value}</span>
              <TextSmall className="projects-stat-label">
                {stat.label}
              </TextSmall>
            </div>
          ))}
        </Flex>
      </Hero>

      {/* A neutral band directly under the image hero, closed with a hairline,
          so the two read as one page header rather than as a banner followed by
          an unrelated first section. */}
      <Section className="projects-toolbar" variant="neutral" padding="800">
        <Flex container direction="column" alignSecondary="stretch" gap="600">
          <Flex wrap alignPrimary="space-between" alignSecondary="center" gap="400">
            <div className="projects-search">
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search projects"
                placeholder="Search projects, methods, countries…"
              />
            </div>
            <Flex alignSecondary="center" gap="400" wrap>
              <TextSmall className="projects-result-count" aria-live="polite">
                {isFiltered
                  ? `Showing ${visible.length} of ${projects.length} projects`
                  : `Showing all ${projects.length} projects`}
              </TextSmall>
              {isFiltered && (
                <Button size="sm" variant="ghost" onClick={clearAll}>
                  Clear filters
                </Button>
              )}
            </Flex>
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="300">
            <Facet
              label="Status"
              options={statusOptions}
              value={status}
              onChange={setStatus}
            />
            <Facet
              label="Region"
              options={regionOptions}
              value={region}
              onChange={setRegion}
            />
          </Flex>
        </Flex>
      </Section>

      {showSpotlight && featured && (
        <Spotlight
          project={featured}
          dependents={dependents}
          basePath={basePath}
        />
      )}

      {/* Brand band, continuing the spotlight's surface above it — with the
          spotlight shown the two sections read as one field, which is why the
          top padding tightens to 600 in that case. The cards stay
          `variant="stroke"` and reset their own colour. */}
      <Section
        variant="brand"
        paddingTop={showSpotlight ? "600" : "1600"}
        paddingBottom="1600"
      >
        {gridProjects.length > 0 ? (
          /* `alignSecondary="stretch"` is load-bearing: Flex maps it straight
             onto `align-items`, which defaults to `start`, so without it the
             cards in a row size to their own content and the "Learn more"
             affordance lands at a different height in every column. */
          <CardGrid container type="third" gap="600" alignSecondary="stretch">
            {gridProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                href={`${basePath}/${project.slug}`}
              />
            ))}
          </CardGrid>
        ) : (
          <Flex container direction="column" alignSecondary="center" gap="400">
            <div className="projects-empty">
              <TextHeading>No projects match those filters</TextHeading>
              <Text>
                Try a different region or status, or clear the filters to see
                all {projects.length} projects.
              </Text>
              <Flex alignPrimary="center">
                {/* `secondary`, not `outline`: this sits on the brand surface,
                    where an outline button's border and text both come from the
                    default palette and nearly vanish. */}
                <Button variant="secondary" onClick={clearAll}>
                  Clear filters
                </Button>
              </Flex>
            </div>
          </Flex>
        )}
      </Section>

      <Section className="projects-partners" variant="neutral" padding="1200">
        <Flex container direction="column" alignSecondary="stretch" gap="600">
          <TextContentHeading
            heading="Funders & partners"
            subheading="The organizations funding and delivering this work alongside the Center"
          />
          <Flex wrap gap="400">
            {partners.map((partner) => (
              <span className="projects-partner" key={partner}>
                {partner}
              </span>
            ))}
          </Flex>
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
              "Projects" H1 above and make the CTA read as a second page
              title. */}
          <Flex direction="column" alignSecondary="center" gap="200">
            <TextTitlePage className="text-align-center">
              Looking to collaborate?
            </TextTitlePage>
            {/* Only the paragraph is measure-capped — capping the wrapper would
                break the heading onto two lines. */}
            <TextSubheading className="projects-cta-copy text-align-center">
              We partner with universities, ministries, and community
              organizations to adapt, deliver, and evaluate mental health care
              in low-resource settings.
            </TextSubheading>
          </Flex>
          <Flex wrap gap="400" alignPrimary="center">
            <Button
              variant="default"
              nativeButton={false}
              render={<a href={`mailto:${contactEmail}`} />}
            >
              Email the Center
            </Button>
            <Button
              variant="secondary"
              nativeButton={false}
              render={<a href={publicationsHref} />}
            >
              Read our publications
            </Button>
          </Flex>
        </Flex>
      </Section>
    </div>
  );
}
