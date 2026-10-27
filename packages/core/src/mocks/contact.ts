import type { ContactService } from "../contact";
import { delay } from "./delay";

/**
 * Accepts every inquiry except one from `error@example.com`, which rejects so
 * the error state can be demoed. Sends nothing: no message leaves the browser.
 */
export const mockContactService: ContactService = {
  async send(inquiry) {
    await delay(1100);

    if (inquiry.email.trim().toLowerCase() === "error@example.com") {
      throw new Error(
        "Your message didn't go through. Please try again, or email us directly.",
      );
    }
  },
};
