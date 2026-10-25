/**
 * What a mailing-list backend must provide. Double opt-in, list ids and
 * provider keys are the service's own business; the UI only hands it an
 * address.
 */
export interface NewsletterService {
  /**
   * Add an address to the list. Resolves once the backend has accepted it,
   * rejects with a message fit to show the subscriber.
   */
  subscribe(email: string): Promise<void>;
}

/**
 * A deliberately loose address check — one `@`, something either side, a dot
 * in the domain, no spaces. Real validation is the mail provider's job; this
 * only catches typos before a round trip, so it must never reject a working
 * address.
 */
export function isEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
