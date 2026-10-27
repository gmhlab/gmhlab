import {
  CareRings,
  IconArrowRight,
  ResearchGlyph,
  Section,
  TextEyebrow,
  TextHeading,
  TextSubheading,
  WaveDivider,
} from "@gmhlab/ui";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { GMH_CONTACT_COPY, GMH_CONTACT_EMAIL } from "../shared/gmh-copy";
import { PageHero } from "../shared/page-hero";
import {
  CONTACT_FORM_ID,
  ContactPageContext,
  type ContactPageState,
} from "./contact-context";
import {
  type CareNotice,
  type ContactLocation,
  type ContactTopic,
  contactMailto,
} from "./contact-types";
import "./contact-page.css";

export type ContactPageProps = {
  /** The routes a visitor can take — one card and one form option each. */
  topics: ContactTopic[];
  /**
   * The form, as an element: `<ContactForm onSend={…} />`. A slot rather
   * than a send function, so a server-rendered route can mount the page; the
   * form picks up the topics, the chosen route and `replyTime` from the page.
   */
  form: ReactNode;
  /** Where the organization is. Omit to render no address. */
  location?: ContactLocation;
  /**
   * The address the email fallback writes to. Omit for the GW Center's
   * (`GMH_CONTACT_EMAIL`); `null` offers no email.
   */
  email?: string | null;
  /**
   * When to expect a reply, as a sentence ("We aim to reply within three
   * business days."). No default: it is a promise only the inbox's owner
   * can make.
   */
  replyTime?: string;
  /**
   * The not-a-care-provider note and crisis lines, shown before anything
   * else. Omit for the Center's (`GMH_CONTACT_COPY.careNotice`); `null`
   * drops it — only do that if your organization *is* a care provider.
   */
  careNotice?: CareNotice | null;
  /** Hero background photograph, in the brand duotone. Omit for the motif alone. */
  heroImage?: string;
  /** The page's one H1. */
  title?: string;
  /** Omit for the Center's; `null` renders none. */
  subtitle?: string | null;
  /** Kicker over the topics heading. Omit for the Center's; `null` for none. */
  topicsEyebrow?: string | null;
  /** Omit for the Center's. */
  topicsHeading?: string;
  /** Omit for the Center's; `null` for none. */
  topicsSubheading?: string | null;
};

/**
 * A contact page that works as a pitch: what the organization offers, sorted
 * by why people write, with the form underneath.
 *
 * In order: the hero; a care notice (this is not a care provider, and here
 * is who is) pulled up over the hero's edge so it is the first thing read;
 * one card per inquiry route; then the form on a brand band beside the
 * address and a direct email.
 *
 * The cards and the form share one chosen topic. "Write to us about this"
 * on a card chooses it and scrolls to the form; `?topic=<id>` in the URL
 * does the same on load, so other pages can deep link a route
 * (`/contact?topic=equip#contact-form`). The direct email link takes the
 * chosen topic as its subject.
 */
export function ContactPage({
  topics,
  form,
  location,
  email = GMH_CONTACT_EMAIL,
  replyTime,
  careNotice = GMH_CONTACT_COPY.careNotice,
  heroImage,
  title = "Work with us",
  subtitle = GMH_CONTACT_COPY.subtitle,
  topicsEyebrow = GMH_CONTACT_COPY.topicsEyebrow,
  topicsHeading = GMH_CONTACT_COPY.topicsHeading,
  topicsSubheading = GMH_CONTACT_COPY.topicsSubheading,
}: ContactPageProps) {
  const [topic, setTopic] = useState("");

  // `?topic=` arrives after hydration, never in the server HTML: the form
  // renders unchosen first, then the route lights up.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("topic");
    if (wanted && topics.some((t) => t.id === wanted)) setTopic(wanted);
  }, [topics]);

  const state = useMemo<ContactPageState>(
    () => ({ topics, topic, setTopic, email, replyTime }),
    [topics, topic, email, replyTime],
  );

  const chooseTopic = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      // A plain link without JS; with it, no reload — choose, scroll, focus.
      event.preventDefault();
      setTopic(id);
      const target = document.getElementById(CONTACT_FORM_ID);
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      target?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
      // Focus the chosen chip, so keyboard users land in the form on their
      // choice. preventScroll: the scroll above is already under way.
      target
        ?.querySelector<HTMLElement>(`input[name="topic"][value="${id}"]`)
        ?.focus({ preventScroll: true });
      window.history.replaceState(
        window.history.state,
        "",
        `?topic=${encodeURIComponent(id)}#${CONTACT_FORM_ID}`,
      );
    },
    [],
  );

  const chosen = topics.find((t) => t.id === topic) ?? null;

  return (
    <ContactPageContext.Provider value={state}>
      <div className="contact-page">
        <PageHero
          title={title}
          subtitle={subtitle}
          image={heroImage}
          motif="rings"
        />

        <Section
          className="contact-topics-band"
          variant="subtle"
          padding="1600"
          paddingTop="0"
        >
          <div className="contact-container">
            {careNotice ? <CareNoticePanel notice={careNotice} /> : null}

            <header className="contact-section-heading">
              {topicsEyebrow ? <TextEyebrow>{topicsEyebrow}</TextEyebrow> : null}
              <TextHeading elementType="h2">{topicsHeading}</TextHeading>
              {topicsSubheading ? (
                <TextSubheading>{topicsSubheading}</TextSubheading>
              ) : null}
            </header>

            <ul className="contact-route-grid" data-count={topics.length}>
              {topics.map((item) => (
                <li key={item.id}>
                  <TopicCard
                    topic={item}
                    selected={item.id === topic}
                    onChoose={chooseTopic}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id={CONTACT_FORM_ID}
          className="contact-form-band"
          variant="brand"
          padding="1600"
        >
          <WaveDivider />
          <div className="contact-container contact-form-layout">
            <div className="contact-form-slot">{form}</div>

            <aside className="contact-aside" aria-label="Other ways to reach us">
              {email ? (
                <div className="contact-aside-block">
                  <h3 className="contact-aside-heading">Email</h3>
                  <a
                    className="contact-aside-email"
                    href={contactMailto(email, chosen)}
                  >
                    {email}
                  </a>
                  <p className="contact-aside-note">
                    {chosen ? (
                      <>
                        Opens with the subject “
                        {chosen.subject ?? chosen.label}”.
                      </>
                    ) : (
                      "Or write to us directly, if you prefer."
                    )}
                  </p>
                </div>
              ) : null}

              {location ? (
                <div className="contact-aside-block">
                  <h3 className="contact-aside-heading">Where we are</h3>
                  <address className="contact-address">
                    <strong>{location.name}</strong>
                    {location.affiliation?.map((line) => (
                      <span key={line} className="contact-address-affiliation">
                        {line}
                      </span>
                    ))}
                    <span className="contact-address-lines">
                      {location.address.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </span>
                  </address>
                  {location.mapHref ? (
                    <a
                      className="contact-aside-link"
                      href={location.mapHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open in Maps
                      <IconArrowRight />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              ) : null}

              {careNotice ? (
                <p className="contact-aside-care">
                  Need support now?{" "}
                  {careNotice.resources.map((resource, i) => (
                    <span key={resource.href}>
                      {i > 0 ? " · " : null}
                      <a href={resource.href}>{resource.label}</a>
                    </span>
                  ))}
                </p>
              ) : null}

              <CareRings className="contact-aside-rings" />
            </aside>
          </div>
        </Section>
      </div>
    </ContactPageContext.Provider>
  );
}

function CareNoticePanel({ notice }: { notice: CareNotice }) {
  return (
    <aside className="contact-care" aria-labelledby="contact-care-heading">
      <div className="contact-care-copy">
        <span className="contact-care-mark" aria-hidden="true">
          {/* Two hands around a heart: care, not alarm. */}
          <svg viewBox="0 0 24 24">
            <path d="M12 9.2c-.9-1.7-3.6-1.9-4.3.1-.6 1.7 1 3.2 4.3 5.4 3.3-2.2 4.9-3.7 4.3-5.4-.7-2-3.4-1.8-4.3-.1Z" />
            <path d="M3.5 13.5 7 17.2c.8.8 1.8 1.3 3 1.3h4c1.2 0 2.2-.5 3-1.3l3.5-3.7" />
          </svg>
        </span>
        <div>
          <h2 id="contact-care-heading" className="contact-care-heading">
            {notice.heading}
          </h2>
          <p className="contact-care-body">{notice.body}</p>
        </div>
      </div>
      <ul className="contact-care-resources">
        {notice.resources.map((resource) => {
          const external = /^https?:/.test(resource.href);
          return (
            <li key={resource.href}>
              <a
                className="contact-care-resource"
                href={resource.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <span className="contact-care-resource-label">
                  {resource.label}
                  <IconArrowRight />
                </span>
                <span className="contact-care-resource-detail">
                  {resource.detail}
                </span>
                {external ? (
                  <span className="sr-only"> (opens in a new tab)</span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
      {notice.emergency ? (
        <p className="contact-care-emergency">{notice.emergency}</p>
      ) : null}
    </aside>
  );
}

function TopicCard({
  topic,
  selected,
  onChoose,
}: {
  topic: ContactTopic;
  selected: boolean;
  onChoose: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  return (
    <article
      className="contact-route-card"
      data-selected={selected || undefined}
      aria-labelledby={`contact-route-${topic.id}`}
    >
      <span className="contact-route-glyph">
        <ResearchGlyph name={topic.glyph} size={40} />
      </span>
      <h3 id={`contact-route-${topic.id}`} className="contact-route-heading">
        {topic.label}
      </h3>
      <p className="contact-route-summary">{topic.summary}</p>
      {topic.offers?.length ? (
        <ul className="contact-route-offers">
          {topic.offers.map((offer) => (
            <li key={offer}>{offer}</li>
          ))}
        </ul>
      ) : null}
      {topic.links?.length ? (
        <ul className="contact-route-links">
          {topic.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      ) : null}
      {/* Only the button down here, so every card's rule lines up. */}
      <div className="contact-route-footer">
        <a
          className="contact-route-choose"
          href={`?topic=${encodeURIComponent(topic.id)}#${CONTACT_FORM_ID}`}
          onClick={(event) => onChoose(event, topic.id)}
          aria-describedby={`contact-route-${topic.id}`}
        >
          {selected ? "Chosen — continue below" : "Write to us about this"}
          <IconArrowRight />
        </a>
      </div>
    </article>
  );
}
