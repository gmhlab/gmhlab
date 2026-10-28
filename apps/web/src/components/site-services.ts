import type { ContactService, NewsletterService } from "@gmhlab/core";

/**
 * POST a JSON body to one of the site's own route handlers. Rejects with the
 * handler's `error` message, which is written to be shown to the sender.
 */
async function post(path: string, body: unknown, fallback: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(fallback);
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(typeof data?.error === "string" ? data.error : fallback);
  }
}

/** Contact inquiries, emailed to the Center by `app/api/contact`. */
export const siteContactService: ContactService = {
  send: (inquiry) =>
    post(
      "/api/contact",
      inquiry,
      "Your message didn't go through. Please try again, or email us directly.",
    ),
};

/** Newsletter signups, emailed to the Center by `app/api/newsletter`. */
export const siteNewsletterService: NewsletterService = {
  subscribe: (email) =>
    post("/api/newsletter", { email }, "We couldn't add that address. Please try again."),
};
