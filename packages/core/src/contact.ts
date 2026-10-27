/**
 * One message from a site's contact form. `topic` is the id of the inquiry
 * route the sender picked ("research", "media", …) — the service uses it to
 * decide whose inbox the message lands in, so the form never needs to know
 * an address.
 */
export interface ContactInquiry {
  topic: string;
  name: string;
  email: string;
  /** Institution, ministry, NGO or outlet. Empty when the sender gave none. */
  organization: string;
  message: string;
}

/**
 * What a contact backend must provide. Routing, spam filtering and the
 * auto-reply are the service's own business; the form only hands it a
 * validated inquiry.
 */
export interface ContactService {
  /**
   * Deliver the inquiry. Resolves once the backend has accepted it, rejects
   * with a message fit to show the sender.
   */
  send(inquiry: ContactInquiry): Promise<void>;
}
