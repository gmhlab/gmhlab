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
import {
  resolvePublicationRefs,
  type Publication,
} from "../publications/publications-types";
import type {
  InnovationAction,
  InnovationDetail,
} from "./innovation-detail-types";
import "./innovation-detail-page.css";

/**
 * An *innovation detail* page: what a tool is, how it works, who is running
 * it, what the evidence says, and how to adopt it.
 *
 * ## One component, driven by records
 *
 * This page **names no innovation**. It renders an `InnovationDetail` record
 * (see `./innovation-detail-types`), and the records themselves are the
 * consuming app's content. Adding an innovation detail page is adding a record
 * plus a one-line route wrapper — never editing this file. `EQUIP_DETAIL` in
 * `apps/web/src/content/innovation-detail-data.ts` is the first instance and
 * the reference to copy.
 *
 * Every section is conditional on its data, so an innovation with no
 * deployment sites renders no deployment section rather than an empty heading.
 *
 * ## Evidence is resolved, not restated
 *
 * `detail.publications` holds slugs into the bibliography passed as
 * `publications`, so journal, DOI and citation count come from the real
 * record. The three EQUIP citations that were hardcoded here before had all
 * silently drifted from the records they duplicated.
 *
 * Page content only: the site header and footer belong to the consuming app's
 * layout (see `apps/web/src/app/layout.tsx`).
 *
 * Column ratios come from Flex's grid `type` rather than pixel tracks, so they
 * collapse on their own: hero + map are `type="third"` with a `major`/`minor`
 * FlexItem pair (2/3 + 1/3 on desktop, stacked below); process steps are
 * `type="quarter"` (4 / 2 / 1); component and related cards `type="third"`.
 *
 * Everything this file adds on top of the design system lives in
 * `innovation-detail-page.css`, scoped under `.innovation-detail-page` so it
 * cannot leak into other consumers of `@gmhlab/blocks/styles.css`.
 */

/* -- Shared --------------------------------------------------------------- */

/** `nativeButton={false}` is required whenever `render` swaps the element —
 *  Base UI otherwise keeps native button semantics and logs on every render. */
function Actions({
  actions,
  align,
}: {
  actions: InnovationAction[];
  align?: "center";
}) {
  if (!actions.length) return null;
  return (
    <Flex wrap gap="400" alignPrimary={align === "center" ? "center" : undefined}>
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          nativeButton={false}
          render={<a href={action.href} />}
        >
          {action.label}
        </Button>
      ))}
    </Flex>
  );
}

/** "Kohrt BA, Pedersen GA, Schafer A, et al." */
function formatAuthors(publication: Publication): string {
  const shown = publication.authors.slice(0, 3).join(", ");
  const truncated =
    publication.authorCount > Math.min(3, publication.authors.length);
  return truncated ? `${shown}, et al.` : shown;
}

/* -- Breadcrumb ----------------------------------------------------------- */

function Breadcrumb({
  detail,
  basePath,
  homeHref,
  indexLabel,
}: {
  detail: InnovationDetail;
  basePath: string;
  homeHref: string;
  indexLabel: string;
}) {
  return (
    <Section
      className="innovation-detail-breadcrumb"
      variant="neutral"
      padding="400"
    >
      <nav aria-label="Breadcrumb">
        <Flex container alignSecondary="center" gap="200" wrap>
          <TextLink href={homeHref}>Home</TextLink>
          <TextSmall aria-hidden="true">›</TextSmall>
          <TextLink href={basePath}>{indexLabel}</TextLink>
          <TextSmall aria-hidden="true">›</TextSmall>
          <TextSmall>{detail.name}</TextSmall>
        </Flex>
      </nav>
    </Section>
  );
}

/* -- Hero ----------------------------------------------------------------- */

function Hero({ detail }: { detail: InnovationDetail }) {
  return (
    <Section variant="neutral" padding="1600">
      <Flex container type="third" gap="1200" wrap>
        <FlexItem size="major">
          <Flex direction="column" alignSecondary="stretch" gap="600">
            {detail.badges?.length ? (
              <Flex wrap gap="300">
                {detail.badges.map((badge) => (
                  <Badge
                    key={badge.label}
                    variant={badge.tone}
                    className="innovation-detail-badge"
                  >
                    {badge.label}
                  </Badge>
                ))}
              </Flex>
            ) : null}
            {/* TextTitlePage (3rem), not TextContentTitle — that resolves to
                TextTitleHero (4.5rem) on desktop, which is the index page's
                size. A detail page sits one level down. */}
            <Flex direction="column" alignSecondary="stretch" gap="200">
              <TextTitlePage>{detail.name}</TextTitlePage>
              {detail.expandedName ? (
                <TextSubheading>{detail.expandedName}</TextSubheading>
              ) : null}
            </Flex>
            <Text className="innovation-detail-hero-copy">{detail.summary}</Text>
            <Actions actions={detail.actions ?? []} />
          </Flex>
        </FlexItem>
        <FlexItem size="minor">
          <Flex direction="column" alignSecondary="stretch" gap="400">
            {detail.visualCaption ? (
              <div className="innovation-detail-visual">
                <TextSmall>{detail.visualCaption}</TextSmall>
              </div>
            ) : null}
            {detail.stats?.length ? (
              <Grid
                columns={`repeat(${Math.min(detail.stats.length, 3)}, 1fr)`}
                gap="300"
              >
                {detail.stats.map((stat) => (
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
            ) : null}
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}

/* -- How it works --------------------------------------------------------- */

function HowItWorks({ detail }: { detail: InnovationDetail }) {
  const steps = detail.process ?? [];
  if (!steps.length) return null;

  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="How It Works"
          subheading={detail.processNote}
        />
        <Flex type="quarter" gap="600" wrap>
          {steps.map((step, index) => (
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

/* -- Core components ------------------------------------------------------ */

function CoreComponents({ detail }: { detail: InnovationDetail }) {
  const components = detail.components ?? [];
  if (!components.length) return null;

  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Core Components"
          subheading={detail.componentsNote}
        />
        <CardGrid type="third" gap="600">
          {components.map((component) => (
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

/* -- Where it's used ------------------------------------------------------ */

function WhereItsUsed({ detail }: { detail: InnovationDetail }) {
  const sites = detail.sites ?? [];
  if (!sites.length) return null;

  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Where It's Used"
          subheading={detail.sitesNote}
        />
        <Flex type="third" gap="1200" wrap>
          <FlexItem size="major">
            {detail.mapCaption ? (
              <div className="innovation-detail-map">
                <TextSmall>{detail.mapCaption}</TextSmall>
              </div>
            ) : null}
          </FlexItem>
          <FlexItem size="minor">
            <div className="innovation-detail-countries">
              <div className="innovation-detail-countries-header">
                <TextStrong>
                  {detail.sitesListHeading ?? "Implementation sites"}
                </TextStrong>
              </div>
              <ul className="innovation-detail-country-list">
                {sites.map((site) => (
                  <li className="innovation-detail-country" key={site.name}>
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
                          {site.flag}
                        </span>
                        <Text>{site.name}</Text>
                      </Flex>
                      <TextSmall>{site.partner}</TextSmall>
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

/* -- Evidence ------------------------------------------------------------- */

function Evidence({
  detail,
  publications,
  publicationsHref,
}: {
  detail: InnovationDetail;
  publications: Publication[];
  publicationsHref: string;
}) {
  const entries = resolvePublicationRefs(detail.publications, publications);
  if (!entries.length) return null;

  return (
    <Section variant="neutral" padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Evidence Base"
          subheading={detail.publicationsNote}
        />
        <Flex direction="column" alignSecondary="stretch" gap="400">
          {entries.map(({ publication, note }) => (
            <Card
              className="innovation-detail-publication"
              key={publication.slug}
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
                    {formatAuthors(publication)} · {publication.year}
                    {note ? ` · ${note}` : ""}
                  </TextSmall>
                </Flex>
                {publication.doi ? (
                  <TextLink href={publication.doi}>View →</TextLink>
                ) : null}
              </Flex>
            </Card>
          ))}
        </Flex>
        <Flex>
          <TextLink href={publicationsHref}>
            View all publications →
          </TextLink>
        </Flex>
      </Flex>
    </Section>
  );
}

/* -- Related -------------------------------------------------------------- */

function Related({ detail }: { detail: InnovationDetail }) {
  const related = detail.related ?? [];
  if (!related.length) return null;

  return (
    <Section padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading
          heading="Related Projects"
          subheading={detail.relatedNote}
        />
        <CardGrid type="third" gap="600">
          {related.map((project) => (
            <Card
              className="innovation-detail-related"
              key={project.heading}
              variant="stroke"
              padding="600"
            >
              <TextHeading>{project.heading}</TextHeading>
              <Text>{project.body}</Text>
              {/* Wrapped: `.card-content > *` is forced to width:100%, which
                  would stretch the link's hit area across the card. Only
                  projects with a real route get a link. */}
              {project.href ? (
                <Flex>
                  <TextLink href={project.href}>View Project →</TextLink>
                </Flex>
              ) : null}
            </Card>
          ))}
        </CardGrid>
      </Flex>
    </Section>
  );
}

/* -- Closing CTA ---------------------------------------------------------- */

function Cta({ detail }: { detail: InnovationDetail }) {
  if (!detail.cta) return null;
  const { heading, body, actions } = detail.cta;

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
          <TextTitlePage className="text-align-center">{heading}</TextTitlePage>
          {/* Only the paragraph is measure-capped — capping the wrapper would
              break the heading onto two lines. */}
          <TextSubheading className="innovation-detail-cta-copy text-align-center">
            {body}
          </TextSubheading>
        </Flex>
        <Actions actions={actions ?? []} align="center" />
      </Flex>
    </Section>
  );
}

/* -- Page ----------------------------------------------------------------- */

export type InnovationDetailPageProps = {
  detail: InnovationDetail;
  /**
   * The bibliography, for resolving `detail.publications` into real citations.
   * Omit and the evidence section is skipped.
   */
  publications?: Publication[];
  /** Base path the innovations index is mounted at. */
  basePath?: string;
  /** Label for the index in the breadcrumb. */
  indexLabel?: string;
  /** Where the breadcrumb's "Home" points. */
  homeHref?: string;
  /** Where "view all publications" points. */
  publicationsHref?: string;
};

export function InnovationDetailPage({
  detail,
  publications = [],
  basePath = "/innovations",
  indexLabel = "Innovations",
  homeHref = "/",
  publicationsHref = "/publications",
}: InnovationDetailPageProps) {
  return (
    <div className="innovation-detail-page">
      <Breadcrumb
        basePath={basePath}
        detail={detail}
        homeHref={homeHref}
        indexLabel={indexLabel}
      />
      <Hero detail={detail} />
      <HowItWorks detail={detail} />
      <CoreComponents detail={detail} />
      <WhereItsUsed detail={detail} />
      <Evidence
        detail={detail}
        publications={publications}
        publicationsHref={publicationsHref}
      />
      <Related detail={detail} />
      <Cta detail={detail} />
    </div>
  );
}
