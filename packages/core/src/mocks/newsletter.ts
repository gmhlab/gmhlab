import type { NewsletterService } from "../newsletter";
import { delay } from "./delay";

/**
 * Accepts any address except `error@example.com`, which rejects so the error
 * state can be demoed. Stores nothing: no address leaves the browser.
 */
export const mockNewsletterService: NewsletterService = {
  async subscribe(email) {
    await delay(900);

    if (email.trim().toLowerCase() === "error@example.com") {
      throw new Error("We couldn't add that address. Please try again.");
    }
  },
};
