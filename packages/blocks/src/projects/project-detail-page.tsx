import {
  Badge,
  Button,
  Card,
  CardGrid,
  Flex,
  FlexItem,
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
  type TimelineEntry,
} from "./project-detail-types";
import type { Project } from "./projects-types";
import type { Publication } from "../publications/publications-types";
import "./project-detail-page.css";

/**
 * The GW Center for Global Mental Health **project detail** page — the
 * template the portfolio's other projects are built from.
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

function Hero({ detail }: { detail: ProjectDetail }) {
  return (
    <Section variant="neutral" padding="1600">
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
              <Flex direction="column" alignSecondary="stretch" gap="200">
                {/* TextTitlePage (3rem), not TextContentTitle — that resolves
                    to TextTitleHero on desktop, which is the index page's
                    size. A detail page sits one level down. */}
                <TextTitlePage>{detail.name}</TextTitlePage>
                {detail.expandedName ? (
                  <TextSubheading className="pd-expanded-name">
                    {detail.expandedName}
                  </TextSubheading>
                ) : null}
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
              What the trial compares
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
          <span
            className={cx(
              "pd-objective-rank",
              `pd-objective-rank-${objective.rank}`,
            )}
          >
            {objective.rank}
          </span>
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

function Objectives({
  objectives,
  hypotheses,
}: {
  objectives: Objective[];
  hypotheses?: string[];
}) {
  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Objectives and measures"
          subheading="What the trial set out to establish, and the instrument used for each. Primary and secondary are the protocol's own designations — they govern how the trial is powered."
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

function TimelineRow({
  entry,
  trackLabel,
}: {
  entry: TimelineEntry;
  trackLabel: string;
}) {
  return (
    <li
      className={cx(
        "pd-tl-entry",
        `pd-tl-${entry.track}`,
        `pd-tl-kind-${entry.kind}`,
      )}
    >
      <div className="pd-tl-marker" aria-hidden="true">
        {entry.kind === "point" && entry.code ? (
          <span className="pd-tl-code">{entry.code}</span>
        ) : (
          <span className="pd-tl-phase-dash" />
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

  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Assessment schedule"
          subheading="Both populations run on their own clock, ordered here on one shared timeline. Lettered points are assessments; the bands between them are periods of activity where nothing is measured."
        />
        {tracks.length ? (
          <ul className="pd-tl-legend">
            {tracks.map((track) => (
              <li
                className={cx("pd-tl-legend-item", `pd-tl-legend-${track.id}`)}
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
        <ol className="pd-tl">
          {timeline.map((entry) => (
            <TimelineRow
              entry={entry}
              key={`${entry.track}-${entry.code ?? entry.when}-${entry.title}`}
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
          subheading="The criteria participants were screened against at enrollment."
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

/* -- Evidence ------------------------------------------------------------- */

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

  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Published work"
          subheading="Peer-reviewed publications from this project and the stigma-reduction program it belongs to."
        />
        <ul className="pd-pubs">
          {entries.map(({ publication, note }) => (
            <li className="pd-pub" key={publication.slug}>
              <div className="pd-pub-meta">
                <span className="pd-pub-year">{publication.year}</span>
                {note ? <span className="pd-pub-note">{note}</span> : null}
              </div>
              <div className="pd-pub-body">
                <span className="pd-pub-title">
                  {publication.doi ? (
                    <TextLink href={publication.doi}>
                      {publication.title}
                    </TextLink>
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
                    <span className="pd-pub-tag pd-pub-tag-oa">
                      Open access
                    </span>
                  ) : null}
                  <span className="pd-pub-tag">
                    {publication.citations.toLocaleString()} citations
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
        <Flex>
          <TextLink href={publicationsHref}>
            All Center publications →
          </TextLink>
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
              <Flex direction="column" alignSecondary="stretch" gap="200">
                <TextHeading>{project.name}</TextHeading>
                <Text>{project.tagline}</Text>
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

/* -- CTA ------------------------------------------------------------------ */

function Cta({ detail }: { detail: ProjectDetail }) {
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
            Work with us on {detail.name}
          </TextTitlePage>
          {/* Only the paragraph is measure-capped — capping the wrapper would
              break the heading onto two lines. */}
          <TextSubheading className="pd-cta-copy text-align-center">
            We share protocols, training materials and measurement tools with
            teams adapting this work to their own setting.
          </TextSubheading>
        </Flex>
        <Flex wrap gap="400" alignPrimary="center">
          {detail.contact ? (
            <Button
              variant="secondary"
              nativeButton={false}
              render={<a href={`mailto:${detail.contact.email}`} />}
            >
              Contact the project
            </Button>
          ) : null}
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="mailto:info@gwglobalmentalhealth.com" />}
          >
            Email the Center
          </Button>
        </Flex>
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
}: ProjectDetailPageProps) {
  return (
    <div className="project-detail-page">
      <Breadcrumb basePath={basePath} detail={detail} />
      <Hero detail={detail} />
      {detail.rationale?.length ? (
        <Rationale paragraphs={detail.rationale} />
      ) : null}
      {detail.strategy || detail.arms?.length ? (
        <Strategy detail={detail} />
      ) : null}
      {detail.objectives?.length ? (
        <Objectives
          hypotheses={detail.hypotheses}
          objectives={detail.objectives}
        />
      ) : null}
      {detail.timeline?.length ? <Timeline detail={detail} /> : null}
      {detail.eligibility?.length ? <Eligibility detail={detail} /> : null}
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
      <Cta detail={detail} />
    </div>
  );
}
