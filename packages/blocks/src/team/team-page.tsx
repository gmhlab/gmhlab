import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardGrid,
  Flex,
  Hero,
  Image,
  Section,
  Text,
  TextContentHeading,
  TextContentTitle,
  TextLink,
  TextSmall,
  TextStrong,
} from "@gmhlab/ui";
import {
  personDisplayName,
  personInitials,
  personProjects,
  personPublications,
  type Person,
  type TeamGroup,
} from "./team-types";
import type { Project } from "../projects/projects-types";
import type { Publication } from "../publications/publications-types";
import type { PageCta } from "../shared/page-copy";
import { GMH_TEAM_COPY } from "../shared/gmh-copy";
import { PageCtaSection } from "../shared/page-cta";
import "./team-page.css";

/**
 * A record-driven **team** page: core team, affiliates, students, alumni.
 * It names no one — the people arrive as `Person` records (see
 * `./team-types`), and the consuming app owns them.
 *
 * ## What it fixes about the usual staff page
 *
 *   - **One person format everywhere.** Credentials are inline after the name
 *     in every group, the line under the role always means *where they are
 *     based*, and every image's alt text is the person's name.
 *   - **No stand-in photos.** A person without a headshot gets an initials
 *     monogram, never a library image — a stock face beside a real name reads
 *     as misrepresentation.
 *   - **Bios expand in place** (`<details>`) instead of linking out to a thin
 *     profile page, and the expanded card carries what a collaborator looks
 *     for: projects, selected publications, ORCID and contact links.
 *   - **People connect to the work.** Each card lists its projects, and a
 *     project filter narrows the page to one team. The same records feed the
 *     project and innovation detail pages' "People" sections, so the link runs
 *     both ways.
 *   - **Alumni show where they went** (`now`) — the outcome a prospective
 *     student is looking for — and sort newest first.
 *
 * Page content only: the site header and footer belong to the consuming app's
 * layout (see `apps/web/src/app/layout.tsx`).
 */

/* -- Person pieces -------------------------------------------------------- */

function Avatar({ person, size }: { person: Person; size: "large" | "small" }) {
  return (
    <span className={`team-avatar team-avatar-${size}`}>
      {person.photo ? (
        // No `loading="lazy"`: Image keeps the img `display: none` until its
        // load event, and a lazy img with no layout box is never fetched — so
        // the photo would never appear.
        <Image
          src={person.photo}
          alt={person.name}
          aspectRatio="1-1"
          size="fill"
          variant="default"
        />
      ) : (
        // The name sits right beside it, so the monogram is decoration.
        <span className="team-monogram" aria-hidden="true">
          {personInitials(person)}
        </span>
      )}
    </span>
  );
}

function ProjectTags({
  projects,
  detailSlugs,
  projectsBasePath,
}: {
  projects: Project[];
  detailSlugs: string[];
  projectsBasePath: string;
}) {
  if (!projects.length) return null;
  return (
    <ul className="team-projects" aria-label="Projects">
      {projects.map((project) => (
        <li key={project.slug}>
          {/* Only projects with a detail page link — the rest would 404. */}
          {detailSlugs.includes(project.slug) ? (
            <a
              className="team-project team-project-link"
              href={`${projectsBasePath}/${project.slug}`}
            >
              {project.name}
            </a>
          ) : (
            <span className="team-project">{project.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function PersonLinks({ person }: { person: Person }) {
  const { email, orcid, scholar, bibliography } = person.links ?? {};
  const links = [
    email && { label: "Email", href: `mailto:${email}` },
    orcid && { label: "ORCID", href: `https://orcid.org/${orcid}` },
    scholar && { label: "Google Scholar", href: scholar },
    bibliography && { label: "Bibliography", href: bibliography },
  ].filter((link): link is { label: string; href: string } => Boolean(link));
  if (!links.length) return null;
  return (
    <Flex className="team-links" wrap gap="400">
      {links.map((link) => (
        <TextLink key={link.label} href={link.href}>
          {link.label}
        </TextLink>
      ))}
    </Flex>
  );
}

function SelectedWorks({ works }: { works: Publication[] }) {
  if (!works.length) return null;
  return (
    <div className="team-works">
      <TextSmall className="team-panel-label">Selected publications</TextSmall>
      <ol className="team-work-list">
        {works.map((work) => (
          <li key={work.slug}>
            {work.doi ? (
              <TextLink href={work.doi}>{work.title}</TextLink>
            ) : (
              <span>{work.title}</span>
            )}
            <TextSmall className="team-work-meta">
              {work.journal} · {work.year}
            </TextSmall>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Core team and affiliates: the full card, expandable when there is a bio. */
function PersonCard({
  person,
  projects,
  publications,
  detailSlugs,
  projectsBasePath,
}: {
  person: Person;
  projects: Project[];
  publications: Publication[];
  detailSlugs: string[];
  projectsBasePath: string;
}) {
  const tagged = personProjects(person, projects);
  const works = personPublications(person, publications);
  const hasMore = Boolean(person.bio?.length || works.length);

  return (
    <Card className="team-card" variant="stroke" padding="600">
      <article id={person.slug} className="team-card-body">
        <Flex className="team-card-head" alignSecondary="start" gap="400">
          <Avatar person={person} size="large" />
          <div className="team-card-identity">
            <TextStrong elementType="h3" className="team-name">
              {personDisplayName(person)}
            </TextStrong>
            {person.role ? (
              <TextSmall className="team-role">{person.role}</TextSmall>
            ) : null}
            {person.affiliation ? (
              <TextSmall className="team-meta">{person.affiliation}</TextSmall>
            ) : null}
            {person.location ? (
              <TextSmall className="team-meta">
                <span className="sr-only">Based in </span>
                {person.location}
              </TextSmall>
            ) : null}
          </div>
        </Flex>

        <ProjectTags
          detailSlugs={detailSlugs}
          projects={tagged}
          projectsBasePath={projectsBasePath}
        />

        {hasMore ? (
          <details className="team-more">
            <summary className="team-more-toggle">
              <span className="team-more-closed">Read bio</span>
              <span className="team-more-open">Hide bio</span>
              <span className="sr-only"> of {person.name}</span>
            </summary>
            <div className="team-more-body">
              {person.bio?.map((paragraph, index) => (
                <Text key={index}>{paragraph}</Text>
              ))}
              <SelectedWorks works={works} />
            </div>
          </details>
        ) : null}

        <PersonLinks person={person} />
      </article>
    </Card>
  );
}

/** Students: compact, since most carry a field and little else yet. */
function StudentRow({ person }: { person: Person }) {
  const detail = [person.degree, person.program].filter(Boolean).join(", ");
  return (
    <li id={person.slug} className="team-row">
      <Avatar person={person} size="small" />
      <div className="team-row-text">
        <TextStrong>{personDisplayName(person)}</TextStrong>
        {detail ? <TextSmall className="team-role">{detail}</TextSmall> : null}
      </div>
    </li>
  );
}

/** Alumni: name, year, and — when known — where they went. */
function AlumniRow({ person }: { person: Person }) {
  return (
    <li id={person.slug} className="team-row">
      <Avatar person={person} size="small" />
      <div className="team-row-text">
        <TextStrong>{personDisplayName(person)}</TextStrong>
        <TextSmall className="team-role">
          {[person.year, person.now].filter(Boolean).join(" · ")}
        </TextSmall>
      </div>
    </li>
  );
}

/* -- Project filter ------------------------------------------------------- */

const ALL = "all";

function ProjectFilter({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; count: number }[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <Flex
      className="team-filter"
      role="group"
      aria-label="Filter people by project"
      wrap
      alignSecondary="center"
      gap="200"
    >
      <TextSmall className="team-filter-label" aria-hidden="true">
        Project
      </TextSmall>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Button
            key={option.value}
            size="sm"
            variant={selected ? "default" : "outline"}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            <span className="team-filter-count">{option.count}</span>
          </Button>
        );
      })}
    </Flex>
  );
}

/* -- Page ----------------------------------------------------------------- */

export type TeamPageProps = {
  /** Everyone, in any order; the page groups and sorts. */
  people: Person[];
  /** The portfolio, for resolving each person's project tags. */
  projects?: Project[];
  /** The bibliography, for each person's selected publications. */
  publications?: Publication[];
  /** Project slugs with a detail page; only those tags link. */
  detailSlugs?: string[];
  /** Where the projects index is mounted. */
  projectsBasePath?: string;
  /** Hero background image. Required: the hero is an image variant. */
  heroImage: string;
  /** The hero heading. */
  title?: string;
  /** Omit for the GW Center's (`GMH_TEAM_COPY`); `null` renders none. */
  subtitle?: string | null;
  /** The closing call to action. Omit for the Center's; `null` for none. */
  cta?: PageCta | null;
};

/** Section headings are structural labels, not copy in anyone's voice. */
const GROUPS: { group: TeamGroup; heading: string }[] = [
  { group: "core", heading: "Core team" },
  { group: "affiliate", heading: "Affiliates" },
  { group: "student", heading: "Students" },
  { group: "alumni", heading: "Alumni" },
];

export function TeamPage({
  people,
  projects = [],
  publications = [],
  detailSlugs = [],
  projectsBasePath = "/projects",
  heroImage,
  title = "Our Team",
  subtitle = GMH_TEAM_COPY.subtitle,
  cta = GMH_TEAM_COPY.cta,
}: TeamPageProps) {
  const [project, setProject] = useState(ALL);

  // Only projects someone is tagged with become chips, in portfolio order.
  const filterOptions = useMemo(() => {
    const current = people.filter((person) => person.group !== "alumni");
    const options = projects
      .map((p) => ({
        value: p.slug,
        label: p.name,
        count: current.filter((person) => person.projects?.includes(p.slug))
          .length,
      }))
      .filter((option) => option.count > 0);
    return options.length
      ? [{ value: ALL, label: "Everyone", count: current.length }, ...options]
      : [];
  }, [people, projects]);

  const grouped = useMemo(() => {
    const byGroup = new Map<TeamGroup, Person[]>();
    for (const { group } of GROUPS) byGroup.set(group, []);
    for (const person of people) byGroup.get(person.group)?.push(person);
    // Newest alumni first; ties alphabetical, so the order is stable.
    byGroup
      .get("alumni")
      ?.sort(
        (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.name.localeCompare(b.name),
      );
    return byGroup;
  }, [people]);

  const isFiltered = project !== ALL;
  const visible = (group: TeamGroup) => {
    const members = grouped.get(group) ?? [];
    if (!isFiltered) return members;
    // Alumni carry no current project, so a project view hides them.
    if (group === "alumni") return [];
    return members.filter((person) => person.projects?.includes(project));
  };

  const card = (person: Person) => (
    <PersonCard
      key={person.slug}
      detailSlugs={detailSlugs}
      person={person}
      projects={projects}
      projectsBasePath={projectsBasePath}
      publications={publications}
    />
  );

  return (
    <div className="team-page">
      <Hero
        variant="image"
        src={heroImage}
        flexProps={{ direction: "column", alignSecondary: "start" }}
      >
        <TextContentTitle title={title} subtitle={subtitle ?? undefined} />
      </Hero>

      {filterOptions.length ? (
        <Section className="team-toolbar" variant="neutral" padding="600">
          <Flex container>
            <ProjectFilter
              options={filterOptions}
              value={project}
              onChange={setProject}
            />
          </Flex>
        </Section>
      ) : null}

      {/* One brand band under the filter holds every group, as the
          innovations index does. Cards reset their own colour, so they read as
          light panels on navy; the compact rows take the band's on-brand text
          (see `.team-groups` in the CSS). */}
      <Section className="team-groups" variant="brand" padding="1600">
        <Flex container direction="column" alignSecondary="stretch" gap="1600">
          {GROUPS.map(({ group, heading }) => {
            const members = visible(group);
            if (!members.length) return null;
            const compact = group === "student" || group === "alumni";
            return (
              <Flex
                key={group}
                direction="column"
                alignSecondary="stretch"
                gap="800"
              >
                <TextContentHeading heading={heading} />
                {compact ? (
                  <ul className="team-rows">
                    {members.map((person) =>
                      group === "student" ? (
                        <StudentRow key={person.slug} person={person} />
                      ) : (
                        <AlumniRow key={person.slug} person={person} />
                      ),
                    )}
                  </ul>
                ) : (
                  <CardGrid type="third" gap="600" alignSecondary="stretch">
                    {members.map(card)}
                  </CardGrid>
                )}
              </Flex>
            );
          })}
        </Flex>
      </Section>

      {/* Plain, not brand: it follows the brand band, and two navy bands in a
          row would read as one. */}
      {cta ? <PageCtaSection cta={cta} copyClassName="team-cta-copy" /> : null}
    </div>
  );
}

/* -- People strip for detail pages ---------------------------------------- */

/**
 * The "People" section a project or innovation detail page shows: everyone
 * tagged with that slug, linking back to their card on the team page. Renders
 * nothing when no one is tagged.
 */
export function PeopleSection({
  people,
  heading = "People",
  teamHref = "/team",
  variant,
}: {
  /** Already filtered to this project — see `projectPeople`. */
  people: Person[];
  heading?: string;
  teamHref?: string;
  variant?: "neutral";
}) {
  if (!people.length) return null;
  return (
    <Section className="team-people" variant={variant} padding="1600">
      <Flex container direction="column" alignSecondary="stretch" gap="800">
        <TextContentHeading heading={heading} />
        <ul className="team-rows">
          {people.map((person) => (
            <li key={person.slug} className="team-row">
              <Avatar person={person} size="small" />
              <div className="team-row-text">
                <TextLink href={`${teamHref}#${person.slug}`}>
                  {personDisplayName(person)}
                </TextLink>
                {person.role ? (
                  <TextSmall className="team-role">{person.role}</TextSmall>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Flex>
    </Section>
  );
}
