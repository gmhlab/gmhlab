import {
  Button,
  CareRings,
  ContourGlobe,
  Flex,
  GmhMark,
  Image,
  PhotoBackdrop,
  Section,
  StatsCard,
  Text,
  TextBlockquote,
  TextEyebrow,
  TextHeading,
  TextSubheading,
  TextTitleHero,
  TextTitlePage,
  WaveDivider,
} from "@gmhlab/ui";
import { type CSSProperties, type ReactNode, useMemo } from "react";
import { Aurora, TiltCard, toneAt, useLitReveal } from "../shared/lit";
import { Cover } from "../shared/ornaments";
import {
  gapLitCells,
  type HomeContent,
  type HomeLink,
  type HomeSectionHead,
  splitEmphasis,
} from "./home-types";
import "./home-page.css";

/**
 * A research centre's landing page, in the lit language the member workspace
 * introduced (../shared/lit.css): a full-width lit navy hero band,
 * with the campus photograph in full colour, the GMH mark large on it, the
 * kit's contours behind the copy; a navy stat band carved in by the gold
 * wave, the figures counting up; the "care gap" field figure on a glass panel; how
 * the organisation works (photographs in natural colour); the research lines
 * as tilt cards with kit cover art on a lit band; a pull quote; a partner
 * wall; and a closing lit card over the care rings.
 *
 * Record-driven — see `home-types.ts`. Page content only: the site header and
 * footer belong to the consuming app's layout.
 *
 * Motion is progressive. The hero rises in on load in CSS (it runs from the
 * server HTML), and sections rise in as they scroll into view, but the hidden
 * state is only applied after mount, and anything already on screen at mount
 * is marked visible first — so server HTML is fully visible, no-JS readers
 * see everything, and the first paint never blinks. All of it is off under
 * `prefers-reduced-motion`.
 */
export function HomePage({ content }: { content: HomeContent }) {
  const rootRef = useLitReveal();
  const { hero, stats, gap, approach, focus, quote, partners, cta } = content;

  return (
    <div className="home-page lit-canvas" ref={rootRef}>
      <HomeHeroSection hero={hero} />

      {stats.length > 0 && (
        <Section
          variant="brand"
          padding="600"
          className="home-stats-band"
          aria-label="At a glance"
        >
          <WaveDivider />
          <Flex container>
            <div className="home-stats">
              {stats.map((stat, i) => (
                <StatsCard
                  key={stat.label}
                  className="lit-reveal"
                  style={{ "--lit-i": i } as CSSProperties}
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

      {approach && approach.items.length > 0 && (
        <Section padding="1600" className="home-approach-band">
          <Flex container direction="column" gap="1200">
            <SectionHead head={approach} />
            <ol className="home-approach">
              {approach.items.map((item, i) => (
                <li
                  key={item.heading}
                  className="home-approach-item lit-reveal"
                  style={{ "--lit-i": i } as CSSProperties}
                >
                  {item.image && (
                    <figure className="home-approach-figure">
                      <Image
                        aspectRatio="natural"
                        className="home-approach-image"
                        src={item.image.src}
                        alt={item.image.alt}
                        loading="lazy"
                      />
                      <span className="home-approach-index" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.image.caption && (
                        <figcaption className="home-caption">
                          {item.image.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                  <div className="home-approach-body">
                    {!item.image && (
                      <span className="home-approach-index" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    <TextHeading>{item.heading}</TextHeading>
                    {item.body && <Text>{item.body}</Text>}
                    {item.points && item.points.length > 0 && (
                      <ul className="home-approach-points">
                        {item.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {approach.action && (
              <ArrowButton link={approach.action} variant="outline" />
            )}
          </Flex>
        </Section>
      )}

      {focus && focus.items.length > 0 && (
        <Section variant="brand" padding="1600" className="home-focus-band lit-band">
          <Aurora />
          <Flex container direction="column" gap="1200">
            <SectionHead head={focus} />
            <div className="home-focus-grid">
              {focus.items.map((item, i) => (
                <a
                  key={item.heading}
                  href={item.href}
                  className="home-focus-link group lit-reveal"
                  style={{ "--lit-i": i } as CSSProperties}
                >
                  <TiltCard className="home-focus-card lit-panel">
                    {item.image ? (
                      <Cover
                        art={{ kind: "glyph", name: item.glyph ?? "publication" }}
                        photo={item.image.src}
                        /* The theme's glyph moves into the badge; with no
                           glyph, no badge (an empty one is hidden) rather
                           than a stand-in. */
                        badge={item.glyph ? undefined : <></>}
                        className="home-focus-cover"
                      />
                    ) : (
                      <Cover
                        art={{ kind: "glyph", name: item.glyph ?? "publication" }}
                        tone={toneAt(i)}
                        className="home-focus-cover"
                      />
                    )}
                    <div className="home-focus-body">
                      <TextEyebrow rule={false}>{item.tag}</TextEyebrow>
                      <TextHeading>{item.heading}</TextHeading>
                      <Text>{item.body}</Text>
                      <span className="home-arrow-link">
                        {item.linkLabel ?? "Read the work"} <Arrow />
                      </span>
                    </div>
                  </TiltCard>
                </a>
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
                <div className="lit-reveal home-quote-art graphic-mask-blob">
                  <Image
                    treatment="duotone"
                    aspectRatio="1-1"
                    src={quote.image.src}
                    alt={quote.image.alt}
                    loading="lazy"
                  />
                </div>
              )}
              <Flex direction="column" gap="600" className="lit-reveal">
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
        <Section padding="1600" className="home-partners-band">
          <Flex container direction="column" gap="1200">
            <SectionHead head={partners} />
            <ul className="home-partners">
              {partners.items.map((partner, i) => (
                <li
                  key={partner.name}
                  className="home-partner lit-panel lit-reveal"
                  style={{ "--lit-i": i % 6 } as CSSProperties}
                >
                  {partner.name}
                  {partner.detail && <span>{partner.detail}</span>}
                </li>
              ))}
            </ul>
          </Flex>
        </Section>
      )}

      {cta && (
        <div className="lit-stage home-cta-stage">
          <Section variant="brand" padding="1600" className="home-cta lit-hero">
            <CareRings
              className="graphic-backdrop home-cta-rings"
              preserveAspectRatio="xMaxYMid meet"
            />
            <Aurora />
            <Flex
              container
              direction="column"
              alignSecondary="center"
              gap="600"
              className="lit-reveal"
            >
              <TextTitlePage>{cta.heading}</TextTitlePage>
              <Text className="home-cta-body">{cta.body}</Text>
              <ArrowButton link={cta.action} variant="accent" />
            </Flex>
          </Section>
        </div>
      )}
    </div>
  );
}

/**
 * The hero: a full-width lit band (no inset stage, no card corners), the
 * `background` photograph in full
 * colour under a navy fade from the left, and the contours behind the copy,
 * fading out before the right of the band. Without a side `image`, the GMH
 * mark stands large on the right, on the photo itself: its own element with
 * only a tight shadow, because the contour drawing's built-in clearing would
 * paint a halo over the photo. With a side `image`, that stands there instead.
 * The figures are not in the hero; they get their own band below it.
 */
function HomeHeroSection({ hero }: { hero: HomeContent["hero"] }) {
  const parts = splitEmphasis(hero.title, hero.emphasis);
  const withMark = !hero.image;
  return (
    <Section
      variant="brand"
      className={
        hero.background
          ? "home-hero lit-hero lit-band lit-hero-photo"
          : "home-hero lit-hero lit-band"
      }
      padding="1600"
      elementType="header"
    >
      {hero.background ? <PhotoBackdrop src={hero.background} /> : null}
      <div className="lit-hero-striations" aria-hidden>
        <ContourGlobe centerpiece="none" />
      </div>
      <Aurora />
      <Flex container>
        <div className="home-split home-split-hero">
          <div className="home-hero-copy">
            {hero.eyebrow && (
              <span className="home-hero-chip lit-enter">
                <span className="home-hero-chip-dot" aria-hidden="true" />
                {hero.eyebrow}
              </span>
            )}
            <TextTitleHero
              className="home-hero-title lit-enter"
              style={{ "--lit-i": 1 } as CSSProperties}
            >
              {parts.length === 3 ? (
                <>
                  {parts[0]}
                  <em className="lit-gold-text">{parts[1]}</em>
                  {parts[2]}
                </>
              ) : (
                parts[0]
              )}
            </TextTitleHero>
            <TextSubheading
              className="home-lede home-hero-lede lit-enter"
              style={{ "--lit-i": 2 } as CSSProperties}
            >
              {hero.lede}
            </TextSubheading>
            <div
              className="home-hero-actions lit-enter"
              style={{ "--lit-i": 3 } as CSSProperties}
            >
              <ArrowButton link={hero.primary} variant="accent" shine />
              {hero.secondary && (
                <ArrowButton link={hero.secondary} variant="glass" arrow={false} />
              )}
            </div>
          </div>
          {withMark && (
            <div
              className="home-hero-mark lit-enter"
              style={{ "--lit-i": 2 } as CSSProperties}
            >
              <GmhMark />
            </div>
          )}
          {hero.image && (
            <figure
              className="home-hero-figure lit-enter"
              style={{ "--lit-i": 2 } as CSSProperties}
            >
              <div className="home-hero-frame">
                <Image
                  aspectRatio="natural"
                  className="home-hero-image"
                  src={hero.image.src}
                  alt={hero.image.alt}
                  fetchPriority="high"
                />
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
          <Flex direction="column" gap="400" className="lit-reveal">
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
            className="home-gap-field lit-panel lit-reveal"
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
    <Flex direction="column" gap="400" className="home-section-head lit-reveal">
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
  shine = false,
}: {
  link: HomeLink;
  /** `glass` is the workspace's light-on-navy outline, for lit bands. */
  variant?: "default" | "accent" | "outline" | "glass";
  arrow?: boolean;
  /** The workspace's slow sweep of light across the button. */
  shine?: boolean;
}) {
  return (
    <Button
      size="lg"
      variant={variant === "glass" ? "outline" : variant}
      nativeButton={false}
      className={[
        "home-arrow-button",
        variant === "glass" ? "home-glass-button" : null,
        variant === "accent" ? "lit-cta-button" : null,
        shine ? "lit-shine" : null,
      ]
        .filter(Boolean)
        .join(" ")}
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
