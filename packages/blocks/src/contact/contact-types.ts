import type { ResearchGlyphName } from "@gmhlab/ui";
import type { PageAction } from "../shared/page-copy";

/**
 * One reason to get in touch, and what the organization offers under it.
 *
 * The same record drives a card in the page's "what are you reaching out
 * about?" grid and an option in the form, so a visitor reads the pitch and
 * picks the route in one motion. `id` travels with the message
 * (`ContactInquiry.topic`) — the contact service routes on it, so the page
 * never names an inbox.
 */
export type ContactTopic = {
  /**
   * Routing key sent with the inquiry, and the `?topic=` value that deep
   * links to the form with this route chosen (`/contact?topic=equip`).
   */
  id: string;
  /** The option's label and the card's heading. */
  label: string;
  glyph: ResearchGlyphName;
  /** One sentence on what the organization offers here. */
  summary: string;
  /** What that offer consists of. Rendered as a short list. */
  offers?: string[];
  /** Pages that show the work — projects, an innovation, the team. */
  links?: Pick<PageAction, "label" | "href">[];
  /**
   * What a useful message on this topic says. Shown under the message field
   * and as its placeholder once the topic is chosen.
   */
  prompt?: string;
  /**
   * `"required"` where a message is hard to act on without one — a
   * partnership lead with no institution. Optional by default.
   */
  organization?: "required" | "optional";
  /** Subject line for the email fallback. Defaults to `label`. */
  subject?: string;
};

/** Where the organization is, and whose it is. */
export type ContactLocation = {
  /** The organization's name, as it should appear on a letter. */
  name: string;
  /** Department, school, university — one line each, narrowest first. */
  affiliation?: string[];
  /** Postal address, one line each. */
  address: string[];
  /** A map link for the address. */
  mapHref?: string;
};

/** A crisis line or helpline directory. */
export type CareResource = {
  /** The action, as the visitor would say it: "Call or text 988". */
  label: string;
  /** Who answers, where and when: "Suicide & Crisis Lifeline · US, 24/7". */
  detail: string;
  href: string;
};

/**
 * The note that tells people looking for help that this is not where they
 * will get it, and where they will. Rendered above everything else on the
 * page, because a contact page for a mental health organization is a page
 * people in distress land on.
 */
export type CareNotice = {
  heading: string;
  body: string;
  resources: CareResource[];
  /** The emergency-number line, under the resources. */
  emergency?: string;
};

/**
 * A `mailto:` for the email fallback, with the chosen topic as its subject so
 * the message arrives already labelled — never a campaign title. `body`
 * carries a draft the form could not send, so the sender loses nothing.
 */
export function contactMailto(
  email: string,
  topic?: ContactTopic | null,
  body?: string,
): string {
  const params = new URLSearchParams();
  if (topic) params.set("subject", topic.subject ?? topic.label);
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${email}${query ? `?${query}` : ""}`;
}
