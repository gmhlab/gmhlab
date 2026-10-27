import { type ReactNode, useMemo } from "react";
import { ContactContext } from "../contexts/ContactContext";
import type { ContactInquiry, ContactService } from "@gmhlab/core";

export type ContactProviderProps = {
  /** The contact-form backend. Pass a stable reference. */
  service: ContactService;
  children?: ReactNode;
};

/**
 * Contact provider. A thin binding of the service into context, so the site
 * picks where its contact form delivers in one place, next to the others.
 * Trims every field, so the service never sees stray whitespace.
 */
export function ContactProvider({ service, children }: ContactProviderProps) {
  const value = useMemo(
    () => ({
      send: (inquiry: ContactInquiry) =>
        service.send({
          topic: inquiry.topic,
          name: inquiry.name.trim(),
          email: inquiry.email.trim(),
          organization: inquiry.organization.trim(),
          message: inquiry.message.trim(),
        }),
    }),
    [service],
  );

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}
