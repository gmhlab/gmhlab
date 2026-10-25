import { type ReactNode, useMemo } from "react";
import { NewsletterContext } from "../contexts/NewsletterContext";
import type { NewsletterService } from "@gmhlab/core";

export type NewsletterProviderProps = {
  /** The mailing-list backend. Pass a stable reference. */
  service: NewsletterService;
  children?: ReactNode;
};

/**
 * Newsletter provider. A thin binding of the service into context, so the
 * site picks its mailing-list backend in one place, next to the others.
 */
export function NewsletterProvider({ service, children }: NewsletterProviderProps) {
  const value = useMemo(
    () => ({ subscribe: (email: string) => service.subscribe(email.trim()) }),
    [service],
  );

  return <NewsletterContext.Provider value={value}>{children}</NewsletterContext.Provider>;
}
