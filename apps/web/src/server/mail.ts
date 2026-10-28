/**
 * Server-only mail delivery for the site's forms, through Resend's REST API
 * (no SDK — one `fetch`). Every contact inquiry and newsletter signup lands
 * in one inbox, the Center's.
 *
 * Configuration (Vercel project env, or `apps/web/.env.local` in dev):
 *
 *   - `RESEND_API_KEY` — required. Without it every send fails, and the forms
 *     show their error state (the contact form's fallback then offers a
 *     pre-filled email, so nothing typed is lost).
 *   - `MAIL_FROM` — required. The sender, on a domain verified in Resend,
 *     e.g. `GW Global Mental Health <website@yourdomain.org>`. It cannot be
 *     a gwu.edu address unless GW verifies that domain with Resend.
 *   - `MAIL_TO` — optional, defaults to the Center's address below.
 *
 * The inbox is restated here rather than imported from `@gmhlab/blocks`
 * (`GMH_CONTACT_EMAIL`): the blocks bundle is `"use client"`, and a server
 * module importing from it gets a client reference, not the string.
 */

const CENTER_INBOX = "globalmh@gwu.edu";

export interface Mail {
  subject: string;
  text: string;
  /** The sender's address, so "Reply" in the inbox answers them. */
  replyTo?: string;
}

export class MailNotConfiguredError extends Error {}

export async function sendMail({ subject, text, replyTo }: Mail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    throw new MailNotConfiguredError("RESEND_API_KEY and MAIL_FROM must be set");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [process.env.MAIL_TO || CENTER_INBOX],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}

/** Collapse a header-bound value to one line, so it cannot break a subject. */
export function oneLine(value: string, max = 200): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}
