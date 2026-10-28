import {
  Badge,
  Card,
  CardGrid,
  ContourGlobe,
  Flex,
  FlexItem,
  PhotoBackdrop,
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
import {
  resolveProjectPublications,
  resolveRelatedProjects,
  type Objective,
  type ProjectDetail,
  type ProjectFinding,
  type ResolvedProjectPublication,
  type TimelineEntry,
} from "./project-detail-types";
import type { Project } from "./projects-types";
import type { Publication } from "../publications/publications-types";
import { PublicationCover } from "../publications/publication-cover";
import { PageCtaSection } from "../shared/page-cta";
import { PeopleSection } from "../team/team-page";
import { projectPeople, type Person } from "../team/team-types";
import { gmhProjectDetailCta } from "../shared/gmh-copy";
import { ProjectMark } from "../shared/project-mark";
import "./project-detail-page.css";

/**
 * A record-driven **project detail** page — the template every project in a
 * portfolio is built from. (First built for the GW Center for Global Mental
 * Health; `RESHAPE_DETAIL` in apps/web is the reference record.)
 *
 * It renders a `ProjectDetail` record (see `./project-detail-types`) and
 * nothing else: no project is named in this file. Adding a second project
 * means adding a record, not editing this component.
 *
 * ## What this page type is for
 *
 * The Center's live project pages publish an abstract and a list of links,
 * which reads the same whether the project is a randomized trial or a training
 * platform. These projects are studies with protocols, so this page shows the
 * protocol: the randomized contrast, the assessment schedule, the objectives
 * and the instruments that measure them. A peer should be able to assess the
 * design from this page, and a partner should be able to see what adopting it
 * would involve.
 *
 * ## The structural devices are load-bearing, not decorative
 *
 *   - **Timepoint codes** (T0, T1, …) are the protocol's own nomenclature, not
 *     invented step numbers. Phases between timepoints carry no code because
 *     nothing is measured at them, and they are styled differently for that
 *     reason.
 *   - **Objectives are numbered and ranked** because primary/secondary is a
 *     statistical designation that governs power. The rank is labeled rather
 *     than implied by position.
 *   - **The timeline is two-tracked** because the study follows two populations
 *     on interlocking schedules. Ordering both tracks chronologically down one
 *     shared spine is the point: it shows patient enrollment opening while
 *     providers are still being reassessed, which no single-column list can.
 *
 * ## Section rendering
 *
 * Every section below is conditional on its data. A project with no
 * eligibility criteria renders no eligibility section — never an empty
 * heading. That is what lets one component serve a trial, a platform and a
 * validation study.
 *
 * Page content only: the site header and footer belong to the consuming app's
 * layout (see `apps/web/src/app/layout.tsx`).
 */

export type ProjectDetailPageProps = {
  detail: ProjectDetail;
  /**
   * The portfolio, for resolving `detail.relatedSlugs` into cards. Omit and
   * the related section renders nothing rather than a row of broken names.
   */
  projects?: Project[];
  /**
   * The bibliography, for resolving `detail.publications` into real citations.
   * Omit and the evidence section is skipped.
   */
  publications?: Publication[];
  /**
   * Slugs that have a detail page. A related card links only when its slug is
   * here, so a portfolio with few detail records ships no 404s.
   */
  detailSlugs?: string[];
  /** Base path the projects index is mounted at. */
  basePath?: string;
  /** Where "all publications" links to. */
  publicationsHref?: string;
  /**
   * Everyone on the team page. The page shows those tagged with this
   * project's slug; omit and the people section renders nothing.
   */
  people?: Person[];
  /** Where the team page is mounted; each person links to their card there. */
  teamHref?: string;
};

function cx(...values: (string | false | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}

/* -- Breadcrumb ----------------------------------------------------------- */

function Breadcrumb({
  detail,
  basePath,
}: {
  detail: ProjectDetail;
  basePath: string;
}) {
  return (
    <Section className="pd-breadcrumb" variant="neutral" padding="400">
      <nav aria-label="Breadcrumb">
        <Flex container alignSecondary="center" gap="200" wrap>
          <TextLink href="/">Home</TextLink>
          <TextSmall aria-hidden="true">›</TextSmall>
          <TextLink href={basePath}>Projects</TextLink>
          <TextSmall aria-hidden="true">›</TextSmall>
          <TextSmall>{detail.name}</TextSmall>
        </Flex>
      </nav>
    </Section>
  );
}

/* -- Hero ----------------------------------------------------------------- */

/** Maps the portfolio's status onto the Badge tones. */
const STATUS_VARIANT: Record<ProjectDetail["status"], "success" | "info"> = {
  active: "success",
  ongoing: "success",
  closed: "info",
};

function Hero({ detail, logo }: { detail: ProjectDetail; logo?: string }) {
  return (
    <Section variant="neutral" padding="1600">
      {detail.heroImage ? <PhotoBackdrop src={detail.heroImage} /> : null}
      <ContourGlobe backdrop centerpiece="none" className="pd-hero-contours graphic-fade-start" />
      <Flex container direction="column" alignSecondary="stretch" gap="1200">
        <Flex type="third" gap="1200" wrap>
          <FlexItem size="major">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              <Flex wrap gap="300">
                <Badge
                  variant={STATUS_VARIANT[detail.status]}
                  className="pd-badge"
                >
                  {detail.statusLabel}
                </Badge>
              </Flex>
              <Flex alignSecondary="center" gap="600">
                {logo ? <ProjectMark src={logo} size="large" /> : null}
                <Flex direction="column" alignSecondary="stretch" gap="200">
                  {/* TextTitlePage (3rem), not TextContentTitle — that
                      resolves to TextTitleHero on desktop, which is the index
                      page's size. A detail page sits one level down. */}
                  <TextTitlePage>{detail.name}</TextTitlePage>
                  {detail.expandedName ? (
                    <TextSubheading className="pd-expanded-name">
                      {detail.expandedName}
                    </TextSubheading>
                  ) : null}
                </Flex>
              </Flex>
              <Text className="pd-lede">{detail.lede}</Text>
            </Flex>
          </FlexItem>
          <FlexItem size="minor">
            <div className="pd-facts">
              <dl className="pd-facts-list">
                {detail.facts.map((fact) => (
                  <div className="pd-fact" key={fact.term}>
                    <dt className="pd-fact-term">{fact.term}</dt>
                    <dd className="pd-fact-detail">{fact.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FlexItem>
        </Flex>
        {detail.figures?.length ? (
          <ul className="pd-figures">
            {detail.figures.map((figure) => (
              <li className="pd-figure" key={figure.label}>
                <span className="pd-figure-value">{figure.value}</span>
                <span className="pd-figure-label">{figure.label}</span>
                {figure.note ? (
                  <span className="pd-figure-note">{figure.note}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </Flex>
    </Section>
  );
}

/* -- Rationale ------------------------------------------------------------ */

function Rationale({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="600">
        <TextContentHeading heading="Why this study" />
        <div className="pd-prose">
          {paragraphs.map((paragraph) => (
            <Text key={paragraph}>{paragraph}</Text>
          ))}
        </div>
      </Flex>
    </Section>
  );
}

/* -- Strategy and arms ---------------------------------------------------- */

function Strategy({ detail }: { detail: ProjectDetail }) {
  const { strategy, arms } = detail;
  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading heading={strategy?.heading ?? "The strategy"} />
        {strategy?.body.length ? (
          <div className="pd-prose pd-prose-on-band">
            {strategy.body.map((paragraph) => (
              <Text key={paragraph}>{paragraph}</Text>
            ))}
          </div>
        ) : null}

        {arms?.length ? (
          <div className="pd-arms">
            <TextSmall className="pd-arms-label">
              {detail.armsLabel ?? "What the trial compares"}
            </TextSmall>
            {/* alignSecondary="stretch": Flex maps it straight onto
                align-items and defaults to `start`, so the two arm cards
                would otherwise be different heights. */}
            <CardGrid type="half" gap="600" alignSecondary="stretch">
              {arms.map((arm) => (
                <Card
                  key={arm.name}
                  className={cx(
                    "pd-arm",
                    arm.isIntervention && "pd-arm-intervention",
                  )}
                  variant="stroke"
                  padding="800"
                >
                  <Flex direction="column" alignSecondary="stretch" gap="200">
                    <Flex alignSecondary="center" gap="200" wrap>
                      <TextHeading>{arm.name}</TextHeading>
                      {arm.abbr ? (
                        <span className="pd-arm-abbr">{arm.abbr}</span>
                      ) : null}
                    </Flex>
                    <Text>{arm.body}</Text>
                  </Flex>
                </Card>
              ))}
            </CardGrid>
          </div>
        ) : null}

        {strategy?.elements?.length ? (
          <dl className="pd-elements">
            {strategy.elements.map((element) => (
              <div className="pd-element" key={element.term}>
                <dt className="pd-element-term">{element.term}</dt>
                <dd className="pd-element-body">{element.body}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Flex>
    </Section>
  );
}

/* -- Objectives ----------------------------------------------------------- */

function ObjectiveRow({
  objective,
  index,
}: {
  objective: Objective;
  index: number;
}) {
  return (
    <li className="pd-objective">
      <div className="pd-objective-head">
        <span className="pd-objective-index" aria-hidden="true">
          {index + 1}
        </span>
        <div className="pd-objective-heading">
          {objective.rank ? (
            <span
              className={cx(
                "pd-objective-rank",
                `pd-objective-rank-${objective.rank}`,
              )}
            >
              {objective.rank}
            </span>
          ) : null}
          <TextHeading>{objective.title}</TextHeading>
        </div>
      </div>
      <div className="pd-objective-body">
        {objective.note ? (
          <p className="pd-objective-note">{objective.note}</p>
        ) : null}
        <dl className="pd-measures">
          {objective.measures.map((measure) => (
            <div className="pd-measure" key={measure.name}>
              <dt className="pd-measure-term">
                {measure.abbr ? (
                  <span className="pd-measure-abbr">{measure.abbr}</span>
                ) : null}
                <span className="pd-measure-name">{measure.name}</span>
              </dt>
              {measure.detail ? (
                <dd className="pd-measure-detail">{measure.detail}</dd>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </li>
  );
}

/* The ranked default only claims the ranks are the protocol's when some
   objective actually carries one; an unranked record gets the plain line. */
const OBJECTIVES_NOTE_RANKED =
  "What the trial set out to establish, and the instrument used for each. Primary and secondary are the protocol's own designations — they govern how the trial is powered.";
const OBJECTIVES_NOTE_UNRANKED =
  "What the project set out to establish, and the instruments used for each.";

function Objectives({
  objectives,
  hypotheses,
  note,
}: {
  objectives: Objective[];
  hypotheses?: string[];
  note?: string;
}) {
  const ranked = objectives.some((objective) => objective.rank);
  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Objectives and measures"
          subheading={
            note ??
            (ranked ? OBJECTIVES_NOTE_RANKED : OBJECTIVES_NOTE_UNRANKED)
          }
        />
        <ol className="pd-objectives">
          {objectives.map((objective, index) => (
            <ObjectiveRow
              key={objective.title}
              objective={objective}
              index={index}
            />
          ))}
        </ol>
        {hypotheses?.length ? (
          <div className="pd-hypotheses">
            <TextStrong className="pd-hypotheses-label">
              What the trial expects to find
            </TextStrong>
            <ul className="pd-hypotheses-list">
              {hypotheses.map((hypothesis) => (
                <li className="pd-hypothesis" key={hypothesis}>
                  {hypothesis}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Flex>
    </Section>
  );
}

/* -- Timeline ------------------------------------------------------------- */

/**
 * A track's side of the spine, from its order in `tracks`: 1 is left, 2 is
 * right. Keyed on position, never on the record's ids, so the stylesheet names
 * no project's populations. Tracks past the second alternate sides.
 */
function trackPosition(tracks: ProjectDetail["tracks"], id: string): 1 | 2 {
  const index = (tracks ?? []).findIndex((track) => track.id === id);
  return index > 0 && index % 2 === 1 ? 2 : 1;
}

function TimelineRow({
  entry,
  trackLabel,
  position,
}: {
  entry: TimelineEntry;
  trackLabel: string;
  position: 1 | 2;
}) {
  return (
    <li
      className={cx(
        "pd-tl-entry",
        `pd-tl-track-${position}`,
        `pd-tl-kind-${entry.kind}`,
      )}
    >
      <div className="pd-tl-marker" aria-hidden="true">
        {entry.kind === "phase" ? (
          <span className="pd-tl-phase-dash" />
        ) : entry.code ? (
          <span className="pd-tl-code">{entry.code}</span>
        ) : (
          /* A dated milestone with no protocol code: a node, not a tick. */
          <span className="pd-tl-dot" />
        )}
      </div>
      <div className="pd-tl-body">
        {/* Visually hidden on desktop, where the column position carries the
            track; visible on mobile, where both tracks share one column. */}
        <span className="pd-tl-track-tag">{trackLabel}</span>
        <span className="pd-tl-when">{entry.when}</span>
        <span className="pd-tl-title">{entry.title}</span>
        {entry.detail ? (
          <p className="pd-tl-detail">{entry.detail}</p>
        ) : null}
        {entry.cohorts?.length ? (
          <ul className="pd-tl-cohorts">
            {entry.cohorts.map((cohort) => (
              <li key={cohort}>{cohort}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

function Timeline({ detail }: { detail: ProjectDetail }) {
  const tracks = detail.tracks ?? [];
  const timeline = detail.timeline ?? [];
  const labelFor = (id: string) =>
    tracks.find((track) => track.id === id)?.label ?? id;
  /* One rail, not a spine with an empty side, when the schedule follows a
     single population (or names no tracks at all). */
  const single = tracks.length < 2;

  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading={detail.timelineHeading ?? "Assessment schedule"}
          subheading={
            detail.timelineNote ??
            (single
              ? "Lettered points are assessments; the bands between them are periods of activity where nothing is measured."
              : "Both populations run on their own clock, ordered here on one shared timeline. Lettered points are assessments; the bands between them are periods of activity where nothing is measured.")
          }
        />
        {tracks.length ? (
          <ul className="pd-tl-legend">
            {tracks.map((track) => (
              <li
                className={cx(
                  "pd-tl-legend-item",
                  `pd-tl-track-${trackPosition(tracks, track.id)}`,
                )}
                key={track.id}
              >
                <span className="pd-tl-legend-swatch" aria-hidden="true" />
                <span className="pd-tl-legend-label">{track.label}</span>
                <span className="pd-tl-legend-population">
                  {track.population}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <ol className={cx("pd-tl", single && "pd-tl-single")}>
          {timeline.map((entry) => (
            <TimelineRow
              entry={entry}
              key={`${entry.track}-${entry.code ?? entry.when}-${entry.title}`}
              position={trackPosition(tracks, entry.track)}
              trackLabel={labelFor(entry.track)}
            />
          ))}
        </ol>
      </Flex>
    </Section>
  );
}

/* -- Eligibility ---------------------------------------------------------- */

function Eligibility({ detail }: { detail: ProjectDetail }) {
  const groups = detail.eligibility ?? [];
  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Who was eligible"
          subheading={
            detail.eligibilityNote ??
            "The criteria participants were screened against at enrollment."
          }
        />
        <CardGrid type="half" gap="600" alignSecondary="stretch">
          {groups.map((group) => (
            <Card
              key={group.group}
              className="pd-eligibility"
              variant="stroke"
              padding="800"
            >
              <Flex direction="column" alignSecondary="stretch" gap="400">
                <TextHeading>{group.group}</TextHeading>
                <ul className="pd-criteria">
                  {group.criteria.map((criterion) => (
                    <li className="pd-criterion" key={criterion}>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </Flex>
            </Card>
          ))}
        </CardGrid>
      </Flex>
    </Section>
  );
}

/* -- Findings ------------------------------------------------------------- */

function FindingCard({
  finding,
  publications,
}: {
  finding: ProjectFinding;
  publications: Publication[];
}) {
  /* Resolved like the evidence list, and failing the same way: an unknown
     slug loses the citation line, never the finding. */
  const source = finding.source
    ? publications.find((publication) => publication.slug === finding.source)
    : undefined;

  return (
    <li className="pd-finding">
      <div className="pd-finding-head">
        <TextHeading>{finding.heading}</TextHeading>
        {finding.context ? (
          <span className="pd-finding-context">{finding.context}</span>
        ) : null}
      </div>
      {finding.stats?.length ? (
        <dl
          className={cx(
            "pd-finding-stats",
            `pd-finding-stats-${Math.min(finding.stats.length, 4)}`,
          )}
        >
          {finding.stats.map((stat) => (
            <div className="pd-finding-stat" key={stat.label}>
              <dt className="pd-finding-stat-label">{stat.label}</dt>
              <dd className="pd-finding-stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <p className="pd-finding-takeaway">{finding.takeaway}</p>
      {source ? (
        <p className="pd-finding-source">
          {source.doi ? (
            <a className="pd-finding-source-link" href={source.doi}>
              <em>{source.journal}</em>, {source.year}
            </a>
          ) : (
            <>
              <em>{source.journal}</em>, {source.year}
            </>
          )}
        </p>
      ) : null}
    </li>
  );
}

function Findings({
  detail,
  publications,
}: {
  detail: ProjectDetail;
  publications: Publication[];
}) {
  const findings = detail.findings ?? [];
  return (
    <Section variant="brand" padding="1600" className="pd-findings-band">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="What it found"
          subheading={detail.findingsNote}
        />
        <ul className="pd-findings">
          {findings.map((finding) => (
            <FindingCard
              finding={finding}
              key={finding.heading}
              publications={publications}
            />
          ))}
        </ul>
      </Flex>
    </Section>
  );
}

/* -- Evidence ------------------------------------------------------------- */

/** How many works the evidence section shows before the disclosure. */
const FEATURED_PUBLICATIONS = 3;

function PublicationRow({
  publication,
  note,
}: ResolvedProjectPublication) {
  return (
    <li className="pd-pub">
      <div className="pd-pub-meta">
        <PublicationCover publication={publication} />
        <span className="pd-pub-year">{publication.year}</span>
        {note ? <span className="pd-pub-note">{note}</span> : null}
      </div>
      <div className="pd-pub-body">
        <span className="pd-pub-title">
          {publication.doi ? (
            <TextLink href={publication.doi}>{publication.title}</TextLink>
          ) : (
            publication.title
          )}
        </span>
        <span className="pd-pub-source">
          {publication.authors[0]}
          {publication.authorCount > 1 ? " et al." : ""} ·{" "}
          <em>{publication.journal}</em>
        </span>
        <span className="pd-pub-tags">
          {publication.openAccess ? (
            <span className="pd-pub-tag pd-pub-tag-oa">Open access</span>
          ) : null}
          <span className="pd-pub-tag">
            {publication.citations.toLocaleString()} citations
          </span>
        </span>
      </div>
    </li>
  );
}

function Evidence({
  detail,
  publications,
  publicationsHref,
}: {
  detail: ProjectDetail;
  publications: Publication[];
  publicationsHref: string;
}) {
  const entries = resolveProjectPublications(detail, publications);
  if (!entries.length) return null;

  /* The first works the *record* lists are the featured ones — a record
     leads with its protocol or development paper, which newest-first would
     bury. The rest keep the resolver's newest-first order, behind a
     disclosure, so a long bibliography never becomes the page's longest
     section and nothing is dropped. */
  const order = new Map(
    (detail.publications ?? []).map((ref, index) => [ref.slug, index]),
  );
  const featured = [...entries]
    .sort(
      (a, b) =>
        (order.get(a.publication.slug) ?? 0) -
        (order.get(b.publication.slug) ?? 0),
    )
    .slice(0, FEATURED_PUBLICATIONS);
  const rest = entries.filter((entry) => !featured.includes(entry));

  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Published work"
          subheading={detail.publicationsNote}
        />
        <ul className="pd-pubs">
          {featured.map((entry) => (
            <PublicationRow key={entry.publication.slug} {...entry} />
          ))}
        </ul>
        {rest.length ? (
          <details className="pd-pubs-more">
            <summary className="pd-pubs-more-summary">
              Show all {entries.length} publications from this project
            </summary>
            <ul className="pd-pubs">
              {rest.map((entry) => (
                <PublicationRow key={entry.publication.slug} {...entry} />
              ))}
            </ul>
          </details>
        ) : null}
        <Flex>
          <TextLink href={publicationsHref}>All publications →</TextLink>
        </Flex>
      </Flex>
    </Section>
  );
}

/* -- Partners, resources, contact ----------------------------------------- */

function Collaborate({ detail }: { detail: ProjectDetail }) {
  const { partners, resources, contact } = detail;
  if (!partners?.length && !resources?.length && !contact) return null;

  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading heading="Partners and resources" />
        <Flex type="third" gap="800" wrap>
          {resources?.length ? (
            <FlexItem size="major">
              <div className="pd-resources">
                <TextSmall className="pd-panel-label">Resources</TextSmall>
                <ul className="pd-resource-list">
                  {resources.map((resource) => (
                    <li className="pd-resource" key={resource.href}>
                      <TextLink href={resource.href}>{resource.label}</TextLink>
                      <span className="pd-resource-kind">
                        {resource.kind === "document"
                          ? "PDF"
                          : resource.kind === "page"
                            ? "On this site"
                            : "External site"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FlexItem>
          ) : null}
          <FlexItem size="minor">
            <Flex direction="column" alignSecondary="stretch" gap="600">
              {partners?.length ? (
                <div className="pd-panel">
                  <TextSmall className="pd-panel-label">
                    Implementing partners
                  </TextSmall>
                  <ul className="pd-partners">
                    {partners.map((partner) => (
                      <li className="pd-partner" key={partner}>
                        {partner}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {contact ? (
                <div className="pd-panel">
                  <TextSmall className="pd-panel-label">Contact</TextSmall>
                  <div className="pd-contact">
                    <TextStrong>{contact.name}</TextStrong>
                    {contact.role ? (
                      <span className="pd-contact-role">{contact.role}</span>
                    ) : null}
                    <TextLink href={`mailto:${contact.email}`}>
                      {contact.email}
                    </TextLink>
                  </div>
                </div>
              ) : null}
            </Flex>
          </FlexItem>
        </Flex>
      </Flex>
    </Section>
  );
}

/* -- Related -------------------------------------------------------------- */

function Related({
  detail,
  projects,
  detailSlugs,
  basePath,
}: {
  detail: ProjectDetail;
  projects: Project[];
  /** Slugs that have a detail page of their own. */
  detailSlugs: string[];
  basePath: string;
}) {
  const related = resolveRelatedProjects(detail, projects);
  if (!related.length) return null;

  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Related projects"
          subheading="Other work in the portfolio that shares this project's method or platform."
        />
        <CardGrid type="third" gap="600" alignSecondary="stretch">
          {related.map((project) => (
            <Card
              key={project.slug}
              className="pd-related"
              variant="stroke"
              padding="600"
            >
              <Flex alignSecondary="start" gap="400">
                {project.logo ? (
                  <ProjectMark src={project.logo} size="small" />
                ) : null}
                <Flex direction="column" alignSecondary="stretch" gap="200">
                  <TextHeading>{project.name}</TextHeading>
                  <Text>{project.tagline}</Text>
                </Flex>
              </Flex>
              {/* Only projects with a detail record get a link — the rest have
                  no page yet, and a card that offers a 404 is worse than a
                  card that offers nothing. Wrapped in a Flex because
                  `.card-content > *` is forced to width:100%, which would
                  stretch the link's hit area across the card. */}
              {detailSlugs.includes(project.slug) ? (
                <Flex>
                  <TextLink href={`${basePath}/${project.slug}`}>
                    View project →
                  </TextLink>
                </Flex>
              ) : (
                <Flex>
                  <TextSmall className="pd-related-pending">
                    Page in progress
                  </TextSmall>
                </Flex>
              )}
            </Card>
          ))}
        </CardGrid>
      </Flex>
    </Section>
  );
}

/* -- Page ----------------------------------------------------------------- */

export function ProjectDetailPage({
  detail,
  projects = [],
  publications = [],
  detailSlugs = [],
  basePath = "/projects",
  publicationsHref = "/publications",
  people = [],
  teamHref = "/team",
}: ProjectDetailPageProps) {
  return (
    <div className="project-detail-page">
      <Breadcrumb basePath={basePath} detail={detail} />
      {/* The logo lives on the portfolio record, not the detail record, so
          a project's mark is set in one place. */}
      <Hero
        detail={detail}
        logo={projects.find((p) => p.slug === detail.slug)?.logo}
      />
      {detail.rationale?.length ? (
        <Rationale paragraphs={detail.rationale} />
      ) : null}
      {detail.strategy || detail.arms?.length ? (
        <Strategy detail={detail} />
      ) : null}
      {detail.objectives?.length ? (
        <Objectives
          hypotheses={detail.hypotheses}
          note={detail.objectivesNote}
          objectives={detail.objectives}
        />
      ) : null}
      {detail.timeline?.length ? <Timeline detail={detail} /> : null}
      {detail.eligibility?.length ? <Eligibility detail={detail} /> : null}
      {/* A brand band, so it sits between whichever light bands precede and
          follow it without breaking their alternation. */}
      {detail.findings?.length ? (
        <Findings detail={detail} publications={publications} />
      ) : null}
      <Evidence
        detail={detail}
        publications={publications}
        publicationsHref={publicationsHref}
      />
      <Collaborate detail={detail} />
      <Related
        basePath={basePath}
        detail={detail}
        detailSlugs={detailSlugs}
        projects={projects}
      />
      {/* After the neutral Related band, so the bands keep alternating. */}
      <PeopleSection
        people={projectPeople(detail.slug, people)}
        teamHref={teamHref}
      />
      {detail.cta !== null ? (
        <PageCtaSection
          cta={detail.cta ?? gmhProjectDetailCta(detail)}
          variant="brand"
          copyClassName="pd-cta-copy"
        />
      ) : null}
    </div>
  );
}
