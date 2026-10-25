/**
 * Newsletter context type. Holds no state of its own: each signup form owns
 * its idle/submitting/done cycle, so two forms on a page never share one.
 */
export interface NewsletterContextType {
  /**
   * Add an address to the list. Rejects with a message fit to show the
   * subscriber.
   */
  subscribe: (email: string) => Promise<void>;
}
