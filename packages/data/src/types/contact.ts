import type { ContactInquiry } from "@gmhlab/core";

/**
 * Contact context type. Holds no state of its own: the form owns its
 * idle/sending/sent cycle, like the newsletter signup.
 */
export interface ContactContextType {
  /** Deliver an inquiry. Rejects with a message fit to show the sender. */
  send: (inquiry: ContactInquiry) => Promise<void>;
}
