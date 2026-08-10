import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Flex,
  Hero,
  Input,
  Section,
  Text,
  TextContentTitle,
  TextHeading,
  TextLink,
  TextSmall,
  TextStrong,
  TextSubheading,
  TextTitlePage,
} from "@gmhlab/ui";
import {
  PUBLICATIONS,
  PUBLICATION_THEMES,
  publicationSearchText,
  type Publication,
  type PublicationTheme,
} from "./publications-data";
import "./publications-page.css";

/**
 * The GW Center for Global Mental Health publications index, rebuilt on the
 * @gmhlab/ui layouts, compositions and primitives — the sibling of
 * `projects-page.tsx` and `innovations-page.tsx`.
 *
 * The source page is 19 tiles, each a journal logo, a title, a truncated
 * author list and a "Read More" that leads to a page whose only real payload
 * is a DOI link. There is no filtering, no date, no journal name as text, and
 * no way to see how any of it connects to the Center's projects.
 *
 * This rebuild:
 *
 *   - **Widens the record.** 103 publications (2023–2026) instead of 19, by
 *     merging the Center's listing with the director's OpenAlex record. See
 *     `publications-data.ts` for provenance and the Google Scholar caveat.
 *   - **Filters on five axes**: free-text search, year, theme, Center project,
 *     and an open-access toggle — with counts computed against the *other*
 *     active facets so a chip is never a dead end.
 *   - **Sorts** by newest, oldest or most cited.
 *   - **Links straight to the DOI.** The source buries it one page deep.
 *   - **Surfaces open access**, which matters to readers without institutional
 *     access and is nowhere on the source page.
 *   - **Ties publications to projects**, closing the loop with the Projects
 *     page.
 *
 * A list, not a card grid: titles run to 200+ characters and author lists to
 * 150 names, neither of which survives a 3-up column.
 *
 * Page content only: the site header and footer belong to the consuming app's
 * layout (see `apps/web/src/app/layout.tsx`).
 */

type YearFilter = number | "all";
type ThemeFilter = PublicationTheme | "all";
type ProjectFilter = string | "all";
type SortKey = "newest" | "oldest" | "cited";

type Filters = {
  query: string;
  year: YearFilter;
  theme: ThemeFilter;
  project: ProjectFilter;
  openOnly: boolean;
};

const INITIAL_FILTERS: Filters = {
  query: "",
  year: "all",
  theme: "all",
  project: "all",
  openOnly: false,
};

/** How many rows to render before "Show more". 103 records is a long page. */
const PAGE_SIZE = 24;

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
const HERO_IMAGE = "https://picsum.photos/id/24/1920/1080";

/** Built once: PUBLICATIONS is static, so re-deriving per keystroke is waste. */
const SEARCH_INDEX = new Map(
  PUBLICATIONS.map((p) => [p.slug, publicationSearchText(p)]),
);

const YEARS = [...new Set(PUBLICATIONS.map((p) => p.year))].sort((a, b) => b - a);
const PROJECTS = [
  ...new Set(PUBLICATIONS.flatMap((p) => p.projects ?? [])),
].sort();

const STATS = [
  { value: String(PUBLICATIONS.length), label: "Publications" },
  {
    value: String(new Set(PUBLICATIONS.map((p) => p.journal)).size),
    label: "Journals",
  },
  {
    value: PUBLICATIONS.reduce((n, p) => n + p.citations, 0).toLocaleString(
      "en-US",
    ),
    label: "Citations",
  },
  {
    value: `${Math.round(
      (PUBLICATIONS.filter((p) => p.openAccess).length / PUBLICATIONS.length) *
        100,
    )}%`,
    label: "Open access",
  },
];

const matchesQuery = (p: Publication, q: string) =>
  !q || (SEARCH_INDEX.get(p.slug) ?? "").includes(q);
const matchesYear = (p: Publication, y: YearFilter) => y === "all" || p.year === y;
const matchesTheme = (p: Publication, t: ThemeFilter) =>
  t === "all" || p.theme === t;
const matchesProject = (p: Publication, pr: ProjectFilter) =>
  pr === "all" || !!p.projects?.includes(pr);
const matchesOpen = (p: Publication, openOnly: boolean) =>
  !openOnly || p.openAccess;

type FacetOption<T> = { value: T; label: string; count: number };

function Facet<T extends string | number>({
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
      className="publications-facet"
      role="group"
      aria-label={`Filter by ${label.toLowerCase()}`}
      wrap
      alignSecondary="center"
      gap="200"
    >
      {/* aria-hidden: the group's aria-label already names the facet. */}
      <TextSmall className="publications-facet-label" aria-hidden="true">
        {label}
      </TextSmall>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Button
            key={String(option.value)}
            size="sm"
            variant={selected ? "default" : "outline"}
            aria-pressed={selected}
            // A zero-count option is a dead end; leave the active one enabled
            // so a filter is always reversible from the control.
            disabled={option.count === 0 && !selected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            <span className="publications-facet-count">{option.count}</span>
          </Button>
        );
      })}
    </Flex>
  );
}

/** "Kohrt BA, Pedersen GA, Schafer A" + the true total when truncated. */
function Authors({ publication }: { publication: Publication }) {
  const shown = publication.authors.join(", ");
  const hidden = publication.authorCount - publication.authors.length;
  return (
    <TextSmall className="publication-authors">
      {shown}
      {hidden > 0 && (
        <span className="publication-authors-more">
          {" "}
          + {hidden} more ({publication.authorCount} authors)
        </span>
      )}
    </TextSmall>
  );
}

function PublicationRow({ publication }: { publication: Publication }) {
  const published = new Date(`${publication.date}T00:00:00Z`);
  return (
    <Card
      className="publication-row"
      variant="stroke"
      padding="600"
      direction="horizontal"
      asset={
        <div className="publication-date" aria-hidden="true">
          <span className="publication-date-year">{publication.year}</span>
          <span className="publication-date-month">
            {published.toLocaleString("en-US", {
              month: "short",
              timeZone: "UTC",
            })}
          </span>
        </div>
      }
    >
      <Flex wrap gap="200" alignSecondary="center">
        {/* `Article` is the default and carries no information; only the
            exceptions are worth a pill. */}
        {publication.kind !== "Article" && (
          <Badge variant="secondary">{publication.kind}</Badge>
        )}
        {publication.center && <Badge variant="info">Center publication</Badge>}
        {publication.openAccess && (
          <Badge variant="success">Open access</Badge>
        )}
        {publication.projects?.map((project) => (
          <Badge key={project} variant="outline">
            {project}
          </Badge>
        ))}
      </Flex>

      {/* The DOI is the destination readers actually want; the source page
          hides it behind a "Read More" detail page. Every current record has
          one, but `doi` is optional on the type — the Center's listing carries
          an entry with no DOI of its own — so the plain-text branch stays. */}
      {publication.doi ? (
        <TextLink
          className="publication-title"
          href={publication.doi}
          target="_blank"
          rel="noopener noreferrer"
        >
          {publication.title}
        </TextLink>
      ) : (
        <TextStrong className="publication-title">
          {publication.title}
        </TextStrong>
      )}

      <Authors publication={publication} />

      <Flex className="publication-meta" wrap gap="200" alignSecondary="center">
        <TextSmall className="publication-journal">
          {publication.journal}
        </TextSmall>
        <TextSmall aria-hidden="true">·</TextSmall>
        <TextSmall>{publication.theme}</TextSmall>
        {publication.citations > 0 && (
          <>
            <TextSmall aria-hidden="true">·</TextSmall>
            <TextSmall>
              {publication.citations.toLocaleString("en-US")} citation
              {publication.citations === 1 ? "" : "s"}
            </TextSmall>
          </>
        )}
      </Flex>

      {publication.summary && (
        <Text className="publication-summary" lineClamp={3}>
          {publication.summary}
        </Text>
      )}
    </Card>
  );
}

export type PublicationsPageProps = {
  /** Where the CTA sends collaboration enquiries. */
  contactEmail?: string;
};

export function PublicationsPage({
  contactEmail = "info@gwglobalmentalhealth.com",
}: PublicationsPageProps = {}) {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortKey>("newest");
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Every filter change collapses the list back to one page — otherwise a
  // narrowed result set would keep a scroll position that no longer exists.
  const update = (patch: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setLimit(PAGE_SIZE);
  };

  const query = filters.query.trim().toLowerCase();
  const isFiltered =
    query !== "" ||
    filters.year !== "all" ||
    filters.theme !== "all" ||
    filters.project !== "all" ||
    filters.openOnly;

  const { visible, yearOptions, themeOptions, projectOptions } = useMemo(() => {
    const { year, theme, project, openOnly } = filters;

    const visible = PUBLICATIONS.filter(
      (p) =>
        matchesQuery(p, query) &&
        matchesYear(p, year) &&
        matchesTheme(p, theme) &&
        matchesProject(p, project) &&
        matchesOpen(p, openOnly),
    ).sort((a, b) => {
      if (sort === "cited") return b.citations - a.citations;
      if (sort === "oldest") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });

    // Each facet counts against the *other* active facets, never against the
    // whole set — otherwise a chip can advertise a number and land on nothing.
    const countWith = (predicate: (p: Publication) => boolean) =>
      PUBLICATIONS.filter((p) => matchesQuery(p, query) && predicate(p)).length;

    const yearOptions: FacetOption<YearFilter>[] = [
      { value: "all" as const, label: "All" },
      ...YEARS.map((value) => ({ value, label: String(value) })),
    ].map((option) => ({
      ...option,
      count: countWith(
        (p) =>
          matchesYear(p, option.value) &&
          matchesTheme(p, theme) &&
          matchesProject(p, project) &&
          matchesOpen(p, openOnly),
      ),
    }));

    const themeOptions: FacetOption<ThemeFilter>[] = [
      { value: "all" as const, label: "All" },
      ...PUBLICATION_THEMES.map((value) => ({ value, label: value })),
    ].map((option) => ({
      ...option,
      count: countWith(
        (p) =>
          matchesYear(p, year) &&
          matchesTheme(p, option.value) &&
          matchesProject(p, project) &&
          matchesOpen(p, openOnly),
      ),
    }));

    const projectOptions: FacetOption<ProjectFilter>[] = [
      { value: "all" as const, label: "All" },
      ...PROJECTS.map((value) => ({ value, label: value })),
    ].map((option) => ({
      ...option,
      count: countWith(
        (p) =>
          matchesYear(p, year) &&
          matchesTheme(p, theme) &&
          matchesProject(p, option.value) &&
          matchesOpen(p, openOnly),
      ),
    }));

    return { visible, yearOptions, themeOptions, projectOptions };
  }, [filters, query, sort]);

  const shown = visible.slice(0, limit);

  const SORTS: { value: SortKey; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "cited", label: "Most cited" },
  ];

  return (
    <div className="publications-page">
      <Hero
        variant="image"
        src={HERO_IMAGE}
        paddingBottom="800"
        flexProps={{ direction: "column", alignSecondary: "start", gap: "1200" }}
      >
        <TextContentTitle
          title="Publications"
          subtitle="Peer-reviewed research from the Center and its collaborators — trials, measurement studies, and implementation work across global mental health."
        />
        <Flex direction="column" alignSecondary="stretch" gap="400">
          <Flex className="publications-stats" wrap gap="1200">
            {STATS.map((stat) => (
              <div className="publications-stat" key={stat.label}>
                <span className="publications-stat-value">{stat.value}</span>
                <TextSmall className="publications-stat-label">
                  {stat.label}
                </TextSmall>
              </div>
            ))}
          </Flex>
          {/* Says plainly what the numbers cover. "Citations" is the total for
              the 99 works listed here, not a career figure, and a reader
              comparing this against a Scholar profile deserves to know that
              before they wonder why it is lower. */}
          <TextSmall className="publications-note">
            Covers {YEARS[YEARS.length - 1]}–{YEARS[0]}: the Center&rsquo;s own
            listing merged with the OpenAlex record for Brandon A. Kohrt.
            Citation counts are for these {PUBLICATIONS.length} works and were
            captured in August 2026.
          </TextSmall>
        </Flex>
      </Hero>

      {/* A neutral band directly under the image hero, closed with a hairline,
          so the two read as one page header rather than as a banner followed by
          an unrelated first section. */}
      <Section className="publications-toolbar" variant="neutral" padding="800">
        <Flex container direction="column" alignSecondary="stretch" gap="600">
          <Flex wrap alignPrimary="space-between" alignSecondary="center" gap="400">
            <div className="publications-search">
              <Input
                type="search"
                value={filters.query}
                onChange={(event) => update({ query: event.target.value })}
                aria-label="Search publications"
                placeholder="Search titles, authors, journals…"
              />
            </div>
            <Flex alignSecondary="center" gap="400" wrap>
              <TextSmall className="publications-result-count" aria-live="polite">
                {isFiltered
                  ? `${visible.length} of ${PUBLICATIONS.length} publications`
                  : `All ${PUBLICATIONS.length} publications`}
              </TextSmall>
              {isFiltered && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setFilters(INITIAL_FILTERS);
                    setLimit(PAGE_SIZE);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Flex>
          </Flex>

          <Flex direction="column" alignSecondary="stretch" gap="300">
            <Facet
              label="Year"
              options={yearOptions}
              value={filters.year}
              onChange={(year) => update({ year })}
            />
            <Facet
              label="Theme"
              options={themeOptions}
              value={filters.theme}
              onChange={(theme) => update({ theme })}
            />
            <Facet
              label="Project"
              options={projectOptions}
              value={filters.project}
              onChange={(project) => update({ project })}
            />

            <Flex
              className="publications-facet"
              wrap
              alignSecondary="center"
              gap="200"
            >
              <TextSmall className="publications-facet-label" aria-hidden="true">
                Sort
              </TextSmall>
              <Flex role="group" aria-label="Sort publications" wrap gap="200">
                {SORTS.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={sort === option.value ? "default" : "outline"}
                    aria-pressed={sort === option.value}
                    // Sorting does not change the result set, so unlike the
                    // facets it deliberately keeps the current page size.
                    onClick={() => setSort(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </Flex>
              {/* Its own label, because sharing the Sort row unlabelled made
                  this read as a fourth sort option rather than a filter. */}
              <TextSmall
                className="publications-facet-label publications-facet-label-inline"
                aria-hidden="true"
              >
                Access
              </TextSmall>
              <Button
                size="sm"
                variant={filters.openOnly ? "default" : "outline"}
                aria-pressed={filters.openOnly}
                onClick={() => update({ openOnly: !filters.openOnly })}
              >
                Open access only
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Section>

      {/* Brand band — the first content section under the hero, skipping the
          toolbar. The rows stay `variant="stroke"` and reset their own colour,
          so they read as light cards on the brand surface. */}
      <Section variant="brand" padding="1600">
        <Flex container direction="column" alignSecondary="stretch" gap="800">
          {shown.length > 0 ? (
            <>
              <Flex direction="column" alignSecondary="stretch" gap="400">
                {shown.map((publication) => (
                  <PublicationRow
                    key={publication.slug}
                    publication={publication}
                  />
                ))}
              </Flex>
              {shown.length < visible.length && (
                <Flex alignPrimary="center">
                  {/* `secondary`, not `outline`: this sits on the brand
                      surface, where an outline button's border and text both
                      come from the default palette and nearly vanish. */}
                  <Button
                    variant="secondary"
                    onClick={() => setLimit((n) => n + PAGE_SIZE)}
                  >
                    Show {Math.min(PAGE_SIZE, visible.length - shown.length)}{" "}
                    more ({visible.length - shown.length} remaining)
                  </Button>
                </Flex>
              )}
            </>
          ) : (
            <Flex direction="column" alignSecondary="center" gap="400">
              <div className="publications-empty">
                <TextHeading>No publications match those filters</TextHeading>
                <Text>
                  Try a different year or theme, or clear the filters to see all{" "}
                  {PUBLICATIONS.length} publications.
                </Text>
                <Flex alignPrimary="center">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setFilters(INITIAL_FILTERS);
                      setLimit(PAGE_SIZE);
                    }}
                  >
                    Clear filters
                  </Button>
                </Flex>
              </div>
            </Flex>
          )}
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
              "Publications" H1 above. */}
          <Flex direction="column" alignSecondary="center" gap="200">
            <TextTitlePage className="text-align-center">
              Work with our researchers
            </TextTitlePage>
            <TextSubheading className="publications-cta-copy text-align-center">
              We collaborate on trials, measurement studies, and implementation
              research across low- and middle-income settings.
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
              render={<a href="/projects" />}
            >
              Browse our projects
            </Button>
          </Flex>
        </Flex>
      </Section>
    </div>
  );
}
