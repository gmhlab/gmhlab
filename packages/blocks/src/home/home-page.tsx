import {
  Button,
  Card,
  Flex,
  Image,
  Section,
  StatsCard,
  Text,
  TextBlockquote,
  TextEyebrow,
  TextHeading,
  TextSubheading,
  TextTitleHero,
  TextTitlePage,
} from "@gmhlab/ui";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  gapLitCells,
  type HomeContent,
  type HomeLink,
  type HomeSectionHead,
  splitEmphasis,
} from "./home-types";
import "./home-page.css";

/**
 * A research centre's landing page, after the GW Global Mental Health
 * reference design: serif headline over drawn topographic lines, a navy stat
 * band, the "care gap" field figure, duotone research cards, a pull quote, a
 * partner wall and a closing call to action.
 *
 * Record-driven — see `home-types.ts`. Page content only: the site header and
 * footer belong to the consuming app's layout.
 *
 * Motion is progressive. Sections rise in as they scroll into view, but the
 * hidden state is only applied after mount, and anything already on screen at
 * mount is marked visible first — so server HTML is fully visible, no-JS
 * readers see everything, and the first paint never blinks. All of it is off
 * under `prefers-reduced-motion`.
 */
export function HomePage({ content }: { content: HomeContent }) {
  const rootRef = useReveal();
  const { hero, stats, gap, focus, quote, partners, cta } = content;

  return (
    <div className="home-page" ref={rootRef}>
      <HomeHeroSection hero={hero} />

      {stats.length > 0 && (
        <Section variant="brand" padding="1200" aria-label="At a glance">
          <Flex container>
            <div className="home-stats">
              {stats.map((stat) => (
                <StatsCard
                  key={stat.label}
                  className="home-reveal"
                  stat={stat.value}
                  description={stat.label}
                  countUp
                />
              ))}
            </div>
          </Flex>
        </Section>
      )}

      {gap && <HomeGapSection gap={gap} />}

      {focus && focus.items.length > 0 && (
        <Section variant="tint" padding="1600">
          <Flex container direction="column" gap="1200">
            <SectionHead head={focus} />
            <div className="home-focus-grid">
              {focus.items.map((item) => (
                <Card
                  key={item.heading}
                  className="home-focus-card home-reveal"
                  variant="stroke"
                  direction="vertical"
                  interactionProps={{
                    href: item.href,
                    "aria-label": `${item.heading} — ${item.linkLabel ?? "Read the work"}`,
                  }}
                  asset={
                    item.image ? (
                      <Image
                        treatment="duotone"
                        aspectRatio="natural"
                        className="home-focus-image"
                        src={item.image.src}
                        alt={item.image.alt}
                        loading="lazy"
                      />
                    ) : undefined
                  }
                >
                  <div className="home-focus-body">
                    <TextEyebrow rule={false}>{item.tag}</TextEyebrow>
                    <TextHeading>{item.heading}</TextHeading>
                    <Text>{item.body}</Text>
                    <span className="home-arrow-link" aria-hidden="true">
                      {item.linkLabel ?? "Read the work"} <Arrow />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </Flex>
        </Section>
      )}

      {quote && (
        <Section padding="1600">
          <Flex container>
            <div className="home-split home-split-quote">
              {quote.image && (
                <div className="home-reveal">
                  <Image
                    treatment="duotone"
                    aspectRatio="1-1"
                    src={quote.image.src}
                    alt={quote.image.alt}
                    loading="lazy"
                  />
                </div>
              )}
              <Flex direction="column" gap="600" className="home-reveal">
                {quote.eyebrow && <TextEyebrow>{quote.eyebrow}</TextEyebrow>}
                <TextBlockquote
                  quote={quote.quote}
                  name={quote.name}
                  role={quote.role}
                />
                {quote.body && (
                  <TextSubheading className="home-lede">
                    {quote.body}
                  </TextSubheading>
                )}
                {quote.action && <ArrowButton link={quote.action} />}
              </Flex>
            </div>
          </Flex>
        </Section>
      )}

      {partners && partners.items.length > 0 && (
        <Section variant="tint" padding="1600">
          <Flex container direction="column" gap="1200">
            <SectionHead head={partners} />
            <ul className="home-partners home-reveal">
              {partners.items.map((partner) => (
                <li key={partner.name} className="home-partner">
                  {partner.name}
                  {partner.detail && <span>{partner.detail}</span>}
                </li>
              ))}
            </ul>
          </Flex>
        </Section>
      )}

      {cta && (
        <Section variant="brand" padding="1600" className="home-cta">
          <Flex
            container
            direction="column"
            alignSecondary="center"
            gap="600"
            className="home-reveal"
          >
            <TextTitlePage>{cta.heading}</TextTitlePage>
            <Text className="home-cta-body">{cta.body}</Text>
            <ArrowButton link={cta.action} variant="accent" />
          </Flex>
        </Section>
      )}
    </div>
  );
}

function HomeHeroSection({ hero }: { hero: HomeContent["hero"] }) {
  const parts = splitEmphasis(hero.title, hero.emphasis);
  return (
    <Section className="home-hero" padding="1600" elementType="header">
      <Topography />
      <Flex container>
        <div className="home-split home-split-hero">
          <Flex direction="column" gap="600" alignSecondary="start">
            {hero.eyebrow && <TextEyebrow>{hero.eyebrow}</TextEyebrow>}
            <TextTitleHero>
              {parts.length === 3 ? (
                <>
                  {parts[0]}
                  <em>{parts[1]}</em>
                  {parts[2]}
                </>
              ) : (
                parts[0]
              )}
            </TextTitleHero>
            <TextSubheading className="home-lede">{hero.lede}</TextSubheading>
            <Flex gap="300" wrap className="home-hero-actions">
              <ArrowButton link={hero.primary} />
              {hero.secondary && (
                <ArrowButton link={hero.secondary} variant="outline" arrow={false} />
              )}
            </Flex>
          </Flex>
          {hero.image && (
            <figure className="home-hero-figure">
              <div className="home-hero-frame">
                <Image
                  treatment="duotone"
                  aspectRatio="natural"
                  className="home-hero-image"
                  src={hero.image.src}
                  alt={hero.image.alt}
                  fetchPriority="high"
                />
                <span className="home-hero-rule" aria-hidden="true" />
              </div>
              {hero.image.caption && (
                <figcaption className="home-caption">
                  {hero.image.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </Flex>
    </Section>
  );
}

function HomeGapSection({ gap }: { gap: NonNullable<HomeContent["gap"]> }) {
  const lit = useMemo(
    () => gapLitCells(gap.total, gap.reached),
    [gap.total, gap.reached],
  );
  const cells = useMemo(
    () => Array.from({ length: gap.total }, (_, i) => lit.has(i)),
    [gap.total, lit],
  );
  return (
    <Section padding="1600">
      <Flex container>
        <div className="home-split home-split-gap">
          <Flex direction="column" gap="400" className="home-reveal">
            {gap.eyebrow && <TextEyebrow>{gap.eyebrow}</TextEyebrow>}
            <TextTitlePage>{gap.heading}</TextTitlePage>
            <Text className="home-gap-body">{gap.body}</Text>
            <div className="home-gap-legend">
              <span>
                <i className="home-gap-key home-gap-key-lit" />
                {gap.reachedLabel}
              </span>
              <span>
                <i className="home-gap-key" />
                {gap.unreachedLabel}
              </span>
            </div>
            {gap.source && <p className="home-caption">{gap.source}</p>}
          </Flex>
          <div
            className="home-gap-field home-reveal"
            role="img"
            aria-label={`${gap.reached} of every ${gap.total} people: ${gap.reachedLabel.toLowerCase()}. The other ${gap.total - gap.reached}: ${gap.unreachedLabel.toLowerCase()}.`}
          >
            {cells.map((isLit, i) => (
              <svg
                key={i}
                viewBox="0 0 14 20"
                aria-hidden="true"
                className={isLit ? "home-gap-cell is-lit" : "home-gap-cell"}
                // The `--*` CSSProperties augmentation is ui-internal (ambient, not
                // exported), so blocks spells the custom property with a cast.
                style={{ "--cell-index": i } as CSSProperties}
              >
                <circle cx="7" cy="4.6" r="3.1" />
                <path d="M1.4 19 C1.4 11.6 12.6 11.6 12.6 19" />
              </svg>
            ))}
          </div>
        </div>
      </Flex>
    </Section>
  );
}

function SectionHead({ head }: { head: HomeSectionHead }) {
  return (
    // Not TextContentHeading: that sets the heading at the 24px `heading`
    // size, which is card scale. A section head on this page is the page-title
    // size, as in the reference.
    <Flex direction="column" gap="400" className="home-section-head home-reveal">
      {head.eyebrow && <TextEyebrow>{head.eyebrow}</TextEyebrow>}
      <TextTitlePage>{head.heading}</TextTitlePage>
      {head.lede && (
        <TextSubheading className="home-lede">{head.lede}</TextSubheading>
      )}
    </Flex>
  );
}

function ArrowButton({
  link,
  variant = "default",
  arrow = true,
}: {
  link: HomeLink;
  variant?: "default" | "accent" | "outline";
  arrow?: boolean;
}) {
  return (
    <Button
      size="lg"
      variant={variant}
      nativeButton={false}
      className="home-arrow-button"
      render={<a href={link.href} />}
    >
      {link.label}
      {arrow && <Arrow />}
    </Button>
  );
}

function Arrow(): ReactNode {
  return (
    <span className="home-arrow" aria-hidden="true">
      →
    </span>
  );
}

/** Six contour lines that draw themselves in behind the hero. */
function Topography() {
  return (
    <svg
      className="home-topo"
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path d="M-60 700 C 220 610, 340 760, 620 660 S 1060 520, 1460 600" />
      <path d="M-60 640 C 240 540, 360 700, 640 590 S 1080 440, 1460 530" />
      <path d="M-60 578 C 260 468, 380 638, 660 518 S 1100 358, 1460 458" />
      <path d="M-60 512 C 280 392, 400 572, 680 442 S 1120 272, 1460 382" />
      <path d="M-60 444 C 300 314, 420 504, 700 364 S 1140 184, 1460 304" />
      <path d="M-60 372 C 320 232, 440 432, 720 282 S 1160 92, 1460 222" />
    </svg>
  );
}

/**
 * Scroll reveal for every `.home-reveal` under the returned ref. Elements on
 * screen at mount are marked in BEFORE the hidden state is switched on, so
 * the server-rendered first paint never disappears.
 */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".home-reveal"));
    const below = items.filter((el) => {
      const inView = el.getBoundingClientRect().top < window.innerHeight;
      if (inView) el.classList.add("is-in");
      return !inView;
    });
    root.dataset.reveal = "";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -70px" },
    );
    below.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}
