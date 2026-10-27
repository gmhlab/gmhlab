"use client";

import { ContactForm } from "@gmhlab/blocks";
import { useContact } from "@gmhlab/data";

/**
 * The blocks ContactForm bound to the site's contact service. A client file
 * because the send function cannot cross from the server-component route;
 * the topics, the chosen route and the reply time come from the ContactPage
 * it is mounted in.
 */
export function SiteContactForm() {
  const { send } = useContact();
  return <ContactForm onSend={send} />;
}
